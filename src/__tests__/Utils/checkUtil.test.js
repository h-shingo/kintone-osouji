/* eslint-disable no-undef */
import {checkUtil} from '../../tsx/util/checkUtil';
describe('checkUtilクラスのテスト', () => {
  describe('isEmptyメソッドのテスト', () => {
    it('引数がnullの場合', () => {
      expect(checkUtil.isEmpty(null)).toBe(true);
    });
    it('引数がundefinedの場合', () => {
      expect(checkUtil.isEmpty(undefined)).toBe(true);
    });
    it('引数が空の場合', () => {
      expect(checkUtil.isEmpty('')).toBe(true);
    });
    it('引数が文字列の場合', () => {
      expect(checkUtil.isEmpty('hoge')).toBe(false);
    });
  });
});
