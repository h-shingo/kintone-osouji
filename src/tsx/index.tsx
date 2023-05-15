// kintone-customize-uploader --domain cy-yumochi21.cybozu.com --username yumochi21 --password Cybozu_123 customize-manifest.json --watch

import { handleIndexShow } from './handler/indexShowHandler';
import { handleEditSubmit } from './handler/editSubmitHandler';

import '../style/common/common.css';

(() => {
  'use strict';

  kintone.events.on('app.record.index.show', handleIndexShow);

  kintone.events.on('app.record.edit.submit', handleEditSubmit);

})();