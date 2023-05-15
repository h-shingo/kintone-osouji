import $ from "jquery";

import { handleBulkAcquisitionClick } from "../logic/bulkAcquisition";
import { handleUpdateClick } from "../logic/bulkUpdate";
//お掃除リーパー用ロジックをimport
import { handleOsoujiClick } from "../logic/bulkOsouji";

export const handleIndexShow = async (event: any) => {
  setForms();
  return event;
};

const setForms = () => {
  if ($("#header-space-inner").get(0)) {
    return;
  }

  const $headerSpace = $(kintone.app.getHeaderSpaceElement());

  const $headerSpaceInner = $('<div id="header-space-inner">');

  const $updateAppListButton = $(
    '<input type="button" value="一括取得" class="header-btn update-app-list-btn" />'
  );
  $updateAppListButton.on("click", handleBulkAcquisitionClick);
  $headerSpaceInner.append($updateAppListButton);

  const $updateAclsButton = $(
    '<input type="button" value="一括反映" class="header-btn update-acls-btn" />'
  );
  $updateAclsButton.on("click", handleUpdateClick);
  $headerSpaceInner.append($updateAclsButton);

  //お掃除リーパー用のボタンを追加
  const $updateOsoujiButton = $(
    '<input type="button" value="お掃除リーパー反映" class="header-btn update-osouji-btn" />'
  );
  $updateOsoujiButton.on("click", handleOsoujiClick);
  $headerSpaceInner.append($updateOsoujiButton);

  //以下は進行中の画面と思われる
  const $progressMessage = $('<span id="progress-message">');
  $headerSpaceInner.append($progressMessage);

  const $progressLog = $('<div id="progress-log">');
  $headerSpaceInner.append($progressLog);

  const $progressLogBk = $('<div id="progress-log-bk">');
  $headerSpaceInner.append($progressLogBk);

  $headerSpace.append($headerSpaceInner);
};
