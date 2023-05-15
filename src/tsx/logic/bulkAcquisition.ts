import $ from "jquery";
import api from "../middleware/api";
import { AppsType, AclType, AppAclType, AppRecordType } from "type";

export const handleBulkAcquisitionClick = async () => {
  showLog();
  addLog(`-- 処理開始 --`);

  const apps: AppsType = await api.app.getAllApps();
  addLog(`[アプリ数]：${apps.apps.length}`);

  const appAcls = await createAppAclList(apps);
  addLog(`[アプリアクセス権：取得]完了`);

  await updateAppList(appAcls);

  addLog(`-- 処理完了 --`);

  if (
    window.confirm(
      "処理が完了しました。\r\n[OK]をクリックすると取得したアクセス権をレコードに反映します。\r\n[キャンセル]をクリックするとログを確認できます。"
    )
  ) {
    location.reload();
  }
  return null;
};

/**
 * アプリのアクセス権の一覧を作成する
 * @param apps
 * @returns
 */
const createAppAclList = async (apps: { apps: any[] }) => {
  const appAcls: AppAclType[] = new Array();
  for (var i = 0; i < apps.apps.length; i++) {
    const acl: AclType = await api.app
      .getAppAcl(apps.apps[i].appId)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "GAIA_IL23") {
          addLog(
            `[ERROR][アプリアクセス権：取得][${apps.apps[i].appId}]${apps.apps[i].name} ゲストスペースのアプリは対象外です`
          );
        } else {
          addLog(
            `[ERROR][アプリアクセス権：取得][${apps.apps[i].appId}]${apps.apps[i].name}`
          );
        }
        return null;
      });
    if (!acl || !acl.rights) {
      continue;
    }
    const appAcl: AppAclType = {
      app: apps.apps[i],
      acl: acl
    };
    appAcls.push(appAcl);
    addLog(`[アプリアクセス権：取得][${appAcl.app.appId}]${appAcl.app.name}`);
  }
  return appAcls;
};

const updateAppList = async (appAcls: AppAclType[]) => {
  for (let i = 0; i < appAcls.length; i++) {
    const appAcl = appAcls[i];
    const appRecord: {
      records: AppRecordType[];
    } = await api.records.getRecords(
      kintone.app.getId(),
      `AppId = "${appAcl.app.appId}"`
    );

    const _appRecord: AppRecordType = createAppRecord(appAcl);
    if (appRecord.records.length === 0) {
      // New
      await api.record.postRecord(kintone.app.getId(), _appRecord);
      addLog(`[権限マスタ：登録][${appAcl.app.appId}]${appAcl.app.name}`);
    } else {
      // Update
      await api.record.putRecord(
        kintone.app.getId(),
        appRecord.records[0].$id ? appRecord.records[0].$id.value : 0,
        _appRecord
      );
      addLog(
        `[権限マスタ：レコード更新][${appAcl.app.appId}]${appAcl.app.name}`
      );
    }
  }

  return null;
};

/**
 * 権限アプリのレコードを作成する
 * @param appAcl
 */
const createAppRecord = (appAcl: AppAclType) => {
  const appRecord: AppRecordType = {
    AppId: { value: appAcl.app.appId },
    AppName: { value: appAcl.app.name },
    AclNewTable: {
      value: []
    },
    AclOldTable: {
      value: []
    },
    NeedToUpdate: {
      value: []
    }
  };
  appAcl.acl.rights.forEach((right) => {
    const newRow: any = {
      value: {
        UserNew: { value: [] },
        OrgNew: { value: [] },
        SubsNew: { value: [] },
        GroupNew: { value: [] },
        CreatorNew: { value: [] },
        GrantNew: { value: [] }
      }
    };
    const oldRow: any = {
      value: {
        UserOld: { value: [] },
        OrgOld: { value: [] },
        SubsOld: { value: [] },
        GroupOld: { value: [] },
        CreatorOld: { value: [] },
        GrantOld: { value: [] }
      }
    };
    if (right.entity.type === "CREATOR") {
      newRow.value.CreatorNew.value.push("作成者");
      oldRow.value.CreatorOld.value.push("作成者");
    } else {
      const entity = {
        code: right.entity.code
      };
      switch (right.entity.type) {
        case "USER": {
          newRow.value.UserNew.value.push(entity);
          oldRow.value.UserOld.value.push(entity);
          break;
        }
        case "ORGANIZATION": {
          newRow.value.OrgNew.value.push(entity);
          oldRow.value.OrgOld.value.push(entity);
          break;
        }
        case "GROUP": {
          newRow.value.GroupNew.value.push(entity);
          oldRow.value.GroupOld.value.push(entity);
          break;
        }
        default: {
          break;
        }
      }
    }
    if (right.includeSubs) {
      newRow.value.SubsNew.value.push("継承");
      oldRow.value.SubsOld.value.push("継承");
    }
    if (right.recordViewable) {
      newRow.value.GrantNew.value.push("閲覧");
      oldRow.value.GrantOld.value.push("閲覧");
    }
    if (right.recordAddable) {
      newRow.value.GrantNew.value.push("追加");
      oldRow.value.GrantOld.value.push("追加");
    }
    if (right.recordEditable) {
      newRow.value.GrantNew.value.push("編集");
      oldRow.value.GrantOld.value.push("編集");
    }
    if (right.recordDeletable) {
      newRow.value.GrantNew.value.push("削除");
      oldRow.value.GrantOld.value.push("削除");
    }
    if (right.appEditable) {
      newRow.value.GrantNew.value.push("アプリ管理");
      oldRow.value.GrantOld.value.push("アプリ管理");
    }
    if (right.recordImportable) {
      newRow.value.GrantNew.value.push("ファイル読み込み");
      oldRow.value.GrantOld.value.push("ファイル読み込み");
    }
    if (right.recordExportable) {
      newRow.value.GrantNew.value.push("ファイル書き出し");
      oldRow.value.GrantOld.value.push("ファイル書き出し");
    }
    appRecord.AclNewTable.value.push(newRow);
    appRecord.AclOldTable.value.push(oldRow);
  });
  return appRecord;
};

const showLog = () => {
  $("#progress-log").css("display", "block");
  $("#progress-log-bk").css("display", "block");
};

const addLog = (text: string) => {
  $("#progress-log").append($('<div class="log">').text(text));
  const $progressLog = $("#progress-log");
  $progressLog.scrollTop(
    $progressLog.get(0).scrollHeight - $progressLog.get(0).offsetHeight
  );
};
