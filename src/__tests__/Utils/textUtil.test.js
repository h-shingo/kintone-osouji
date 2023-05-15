/* eslint-disable no-undef */
import {textUtil} from '../../tsx/util/textUtil';
describe('checkUtilクラスのテスト', () => {
  describe('isEmptyメソッドのテスト', () => {
    it('引数が100の場合', () => {
      expect(textUtil.separateTreeNumber(100)).toBe('100');
    });
    it('引数が1000の場合', () => {
      expect(textUtil.separateTreeNumber(1000)).toBe('1,000');
    });
    it('引数が10000の場合', () => {
      expect(textUtil.separateTreeNumber(10000)).toBe('10,000');
    });
    it('引数が10000000000の場合', () => {
      expect(textUtil.separateTreeNumber(10000000000)).toBe('10,000,000,000');
    });
  });
});
