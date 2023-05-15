module.exports = {
  extends: '@cybozu/eslint-config/presets/prettier',
  globals: {
    kintone: false
  },
  env: {
    'jest/globals': true
  },
  plugins: ['jest']
};
