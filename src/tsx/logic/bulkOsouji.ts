import $ from "jquery";
import api from "../middleware/api";
import { AclType, RightType, AppRecordsType, AppRecordType } from "type";

export const handleOsoujiClick = async () => {
  const isUpdateAll = !window.confirm(
    "お掃除リーパー用アクセス権を一括設定します。よろしいですか？\r\n※既存のアクセス権を削除されて困る場合は[キャンセル]を押してください。"
  );

  // 実行対象のアプリIDを設定します
  const targetAppId = kintone.app.getId();

  async function getAllRecords(appId) {
    let allRecords = [];
    let id = 0;
    const limit = 500;

    while (true) {
      const records = await kintone.api(
        kintone.api.url("/k/v1/records", true),
        "GET",
        {
          app: appId,
          query: `order by $id asc limit ${limit} offset ${id}`
        }
      );
      allRecords = allRecords.concat(records.records);
      if (records.records.length < limit) {
        break;
      }
      id = id + limit;
    }
    return allRecords;
  }

  async function extractAppIds(appId) {
    const records = await getAllRecords(appId);
    const appIds = records.map((record) => record.AppId.value);
    return appIds;
  }

  extractAppIds(targetAppId).then((appIds) => {
    console.log(appIds);
  });
};
