import $ from 'jquery';
import api from "../middleware/api";

import {
  AclType,
  RightType,
  AppRecordsType,
  AppRecordType
} from 'type';

export const handleUpdateClick = async () => {
  showLog();
  addLog(`-- 処理開始 --`);

  const isUpdateAll = !window.confirm('差分のみを反映します。よろしいですか？\r\n※CSVで更新を行った場合は[キャンセル]を押してください。');

  const appRecords: AppRecordsType = await getAllAppRecords(isUpdateAll);
  console.log(appRecords);

  addLog(`[権限マスタ：反映対象レコード数]${appRecords.records.length}件`);

  for (let i = 0; i < appRecords.records.length; i++) {
    const appRecord = appRecords.records[i];
    const acl = convertGrantNewTableToAcl(appRecord);
    console.log(acl);
    await api.app.putAppAcl(acl.app, acl.rights);
    const _appRecord = createUpdatedAppRecord(appRecord);
    await api.record.putRecord(kintone.app.getId(), (appRecord.$id) ? appRecord.$id.value : 0, _appRecord);
    addLog(`[アプリアクセス権：反映][${appRecord.AppId.value}]${appRecord.AppName.value}`);
  }

  addLog(`-- 処理完了 --`);

  if (window.confirm('処理が完了しました。\r\n[OK]をクリックすると処理が完了します。\r\n[キャンセル]をクリックするとログを確認できます。')) {
    hideLog();
  }

  return null;
};

const getAllAppRecords = async (isUpdateAll: boolean) => {
  let query = 'order by AppId asc'
  if (!isUpdateAll) {
    query = 'NeedToUpdate in ("要反映") ' + query;
  } 
  const appRecords: AppRecordsType = await api.records.getAllRecords(kintone.app.getId(), query);
  return appRecords;
};

const convertGrantNewTableToAcl = (appRecord: AppRecordType) => {
  const acl: AclType = {
    rights: []
  };

  appRecord.AclNewTable.value.map(aclNewTableRow => {
    let rights: RightType[] = [];

    const right: RightType = {
      entity: {
        type: 'USER',
        code: undefined
      },
      includeSubs: false,
      appEditable: false,
      recordViewable: false,
      recordAddable: false,
      recordEditable: false,
      recordDeletable: false,
      recordImportable: false,
      recordExportable: false
    };
    
    if (aclNewTableRow.value.GrantNew.value.indexOf('閲覧') !== -1) right.recordViewable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('追加') !== -1) right.recordAddable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('編集') !== -1) right.recordEditable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('削除') !== -1) right.recordDeletable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('アプリ管理') !== -1) right.appEditable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('ファイル読み込み') !== -1) right.recordImportable = true;
    if (aclNewTableRow.value.GrantNew.value.indexOf('ファイル書き出し') !== -1) right.recordExportable = true;
    if (aclNewTableRow.value.SubsNew.value.indexOf('継承') !== -1) right.includeSubs = true;

    if (aclNewTableRow.value.UserNew.value.length !== 0) {
      aclNewTableRow.value.UserNew.value.forEach(user => {
        const _right: RightType = deepCopy<RightType>(right);
        _right.entity = {
          type: 'USER',
          code: user.code
        };
        rights.push(_right);
      });
    } else if (aclNewTableRow.value.OrgNew.value.length !== 0) {
      aclNewTableRow.value.OrgNew.value.forEach(org => {
        const _right: RightType = deepCopy<RightType>(right);
        _right.entity = {
          type: 'ORGANIZATION',
          code: org.code
        };
        rights.push(_right);
      });
    } else if (aclNewTableRow.value.GroupNew.value.length !== 0) {
      aclNewTableRow.value.GroupNew.value.forEach(group => {
        const _right: RightType = deepCopy<RightType>(right);
        _right.entity = {
          type: 'GROUP',
          code: group.code
        };
        rights.push(_right);
      });
    } else if (aclNewTableRow.value.CreatorNew.value.indexOf('作成者') !== -1) {
      const _right: RightType = deepCopy<RightType>(right);
      _right.entity = {
        type: 'CREATOR',
        code: undefined
      };
      rights.push(_right);
    }

    acl.rights = acl.rights.concat(rights);
  });

  return {
    app: appRecord.AppId.value,
    rights: acl.rights
  };
};

const createUpdatedAppRecord = (appRecord: AppRecordType) => {
  const _appRecord = {
    AclOldTable: {},
    NeedToUpdate: {
      value: []
    }
  };
  const aclOldTable: {value: any[]} = {
    value: []
  };
  appRecord.AclNewTable.value.forEach(aclNewTableRow => {
    const aclOldTableRow = {
      value: {
        UserOld: {
          value: aclNewTableRow.value.UserNew.value
        },
        OrgOld: {
          value: aclNewTableRow.value.OrgNew.value
        },
        SubsOld: {
          value: aclNewTableRow.value.SubsNew.value
        },
        GroupOld: {
          value: aclNewTableRow.value.GroupNew.value
        },
        CreatorOld: {
          value: aclNewTableRow.value.CreatorNew.value
        },
        GrantOld: {
          value: aclNewTableRow.value.GrantNew.value
        }
      }
    };
    aclOldTable.value.push(aclOldTableRow);
  });
  _appRecord.AclOldTable = aclOldTable;
  return _appRecord;
};

const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const showLog = () => {
  $('#progress-log').css('display', 'block');
  $('#progress-log-bk').css('display', 'block');
};

const hideLog = () => {
  $('#progress-log').css('display', 'none');
  $('#progress-log-bk').css('display', 'none');
};

const addLog = (text: string) => {
  $('#progress-log').append(
    $('<div class="log">').text(text)
  );
  const $progressLog = $('#progress-log');
  $progressLog.scrollTop(
    $progressLog.get(0).scrollHeight - $progressLog.get(0).offsetHeight
  );
};