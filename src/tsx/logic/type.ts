export interface AppType {
  appId: string,
  code: string,
  name: string,
  description: string,
  spaceId: string | undefined,
  threadId: string | undefined,
  createdAt: string,
  creator: {
    code: string,
    name: string
  },
  modifiedAt: string,
  modifier: {
    code: string,
    name: string
  }
};

export interface AppsType {
  apps: AppType[]
};

export interface AclType {
  rights: RightType[]
};

export interface RightType {
  entity: {
    type: 'USER' | 'GROUP' | 'ORGANIZATION' | 'CREATOR',
    code: string | undefined
  },
  includeSubs: boolean,
  appEditable: boolean,
  recordViewable: boolean,
  recordAddable: boolean,
  recordEditable: boolean,
  recordDeletable: boolean,
  recordImportable: boolean,
  recordExportable: boolean
};

export interface AppAclType {
  app: AppType,
  acl: AclType
};

export interface AppRecordsType {
  records: AppRecordType[],
  totalCount: number | undefined
};

export interface AppRecordType {
  $id?: {
    value: number
  },
  AppId: {
    value: string
  },
  AppName: {
    value: string
  },
  AclNewTable: {
    value: {
      id: number | undefined,
      value: {
        UserNew: {
          value: {
            code: string,
            name: string
          }[]
        },
        OrgNew: {
          value: {
            code: string,
            name: string
          }[]
        },
        SubsNew: {
          value: string[]
        },
        GroupNew: {
          value: {
            code: string,
            name: string
          }[]
        },
        CreatorNew: {
          value: string[]
        },
        GrantNew: {
          value: string[]
        }
      }
    }[]
  },
  AclOldTable: {
    value: {
      id: number | undefined,
      value: {
        UserOld: {
          value: {
            code: string,
            name: string
          }[]
        },
        OrgOld: {
          value: {
            code: string,
            name: string
          }[]
        },
        SubsOld: {
          value: []
        },
        GroupOld: {
          value: {
            code: string,
            name: string
          }[]
        },
        CreatorOld: {
          value: []
        },
        GrantOld: {
          value: string[]
        }
      }
    }[]
  },
  NeedToUpdate: {
    value: string[]
  }
};