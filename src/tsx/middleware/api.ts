/**
 * HTTP メソッド
 */
const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

/**
 * REST API URI
 */
const API_PATH = {
  RECORD: '/k/v1/record',
  RECORDS: '/k/v1/records',
  RECORDS_CURSOR: '/k/v1/records/cursor',
  RECORD_COMMENT: '/k/v1/record/comment',
  RECORD_COMMENTS: '/k/v1/record/comments',
  RECORD_ASSIGNEES: '/k/v1/record/assignees',
  RECORD_STATUS: '/k/v1/record/status',
  RECORDS_STATUS: '/k/v1/records/status',
  BULK_REQUEST: '/k/v1/bulkRequest',
  FILE: '/k/v1/file',
  APPS: '/k/v1/apps',
  APP_FORM_FIELDS: '/k/v1/app/form/fields',
  APP_ACL: '/k/v1/app/acl'
};

/**
 * 共通処理
 */
const common = {

  /**
   * kintone REST API リクエストを送信する
   * @param path 
   * @param method 
   * @param params 
   */
  async sendRequest(path: string, method: string, params: any) {
    return new kintone.Promise((resolve: any, reject: any) => {
      kintone.api(kintone.api.url(path, true), method, params).then((resp: any) => {
        resolve(resp);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
};

/**
 * レコード（１件）
 */
const record = {

  /**
   * レコード（１件）を登録する
   * @param app 
   * @param record 
   */
  async postRecord(app: string | number, record: any) {
    const param = {
      app: app,
      record: record
    };
    return await common.sendRequest(API_PATH.RECORD, HTTP_METHOD.POST, param);
  },

  /**
   * レコード（１件）を更新する
   * @param app 
   * @param record 
   */
  async putRecord(app: string | number, id: string | number, record: any) {
    const param = {
      app: app,
      id: id,
      record: record
    };
    return await common.sendRequest(API_PATH.RECORD, HTTP_METHOD.PUT, param);
  }
};

/**
 * レコード（複数件）
 */
const records = {

  /**
   * レコード（複数件）を取得する
   * @param app 
   * @param query 
   * @param fields 
   * @param totalCount 
   */
  async getRecords(app: string | number, query?: string, fields?: string[], totalCount?: boolean) {
    const params = {
      app: app,
      query: query ? query : undefined,
      fields: fields ? fields : undefined,
      totalCount: totalCount ? totalCount : undefined
    };
    return await common.sendRequest(API_PATH.RECORDS, HTTP_METHOD.GET, params);
  },

  /**
   * レコード全件を取得する
   * @param app 
   * @param query 
   * @param fields 
   * @param totalCount 
   * @returns 
   */
  async getAllRecords(app: string | number, query?: string, fields?: string[], totalCount?: boolean) {
    const result = {
      records: [],
      totalCount: undefined
    };
    let count = 0;
    while(true) {
      const _records = await records.getRecords(app, (query) ? query + ` limit 500 offset ${count}` : `limit 500 offset ${count}`, fields, totalCount);
      if (_records.records.length === 0) break;
      count += 500;
      result.records = result.records.concat(_records.records);
      result.totalCount = result.totalCount;
    }
    return result;
  }
};

/**
 * アプリ
 */
const app = {

  /**
   * アプリ情報を取得する
   * @param ids 
   * @param codes 
   * @param name 
   * @param spaceIds 
   * @param limit 
   * @param offset 
   * @returns 
   */
  async getApps(ids?: string[] | number[], codes?: string[], name?: string, spaceIds?: string[] | number[], limit?: number, offset?: number) {
    const params: any = {};
    if (ids) params.ids = ids;
    if (codes) params.codes = codes;
    if (name) params.name = name;
    if (spaceIds) params.spaceIds = spaceIds;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset; 
    return await common.sendRequest(API_PATH.APPS, HTTP_METHOD.GET, params);
  },

  /**
   * 全アプリ情報を取得する
   * @param ids 
   * @param codes 
   * @param name 
   * @param spaceIds 
   * @returns 
   */
  async getAllApps(ids?: string[] | number[], codes?: string[], name?: string, spaceIds?: string[] | number[]) {
    const apps: {apps: any[]} = {
      apps: []
    };
    let count = 0;
    while(true) {
      const _apps = await app.getApps(ids, codes, name, spaceIds, 100, count);
      if (_apps.apps.length === 0) break;
      count += 100;
      apps.apps = apps.apps.concat(_apps.apps);
    }
    return apps;
  },

  /**
   * フィールドの一覧を取得する
   * @param app 
   * @param lang 
   */
  async getAppFormFields(app: string | number, lang?: string) {
    const params = {
      app: app,
      lang: lang ? lang : undefined
    };
    return await common.sendRequest(API_PATH.APP_FORM_FIELDS, HTTP_METHOD.GET, params);
  },

  /**
   * アプリのアクセス権一覧を取得する
   * @param app 
   */
  async getAppAcl(app: string | number) {
    const params = {
      app: app
    };
    return new kintone.Promise((resolve: any, reject: any) => {
      common.sendRequest(API_PATH.APP_ACL, HTTP_METHOD.GET, params).then((resp: any) => {
        resolve(resp);
      }).catch((error: any) => {
        reject(error);
      });
    });
    // return await common.sendRequest(API_PATH.APP_ACL, HTTP_METHOD.GET, params);
  },

  /**
   * アプリのアクセス権を更新する
   * @param app 
   * @param rights 
   * @returns 
   */
  async putAppAcl(app: string | number, rights: any[]) {
    const params = {
      app: app,
      rights: rights
    };
    return await common.sendRequest(API_PATH.APP_ACL, HTTP_METHOD.PUT, params);
  }
};

export default {
  record,
  records,
  app
};