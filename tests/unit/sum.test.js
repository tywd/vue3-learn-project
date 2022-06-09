/*
 * @Author: tywd
 * @Date: 2022-06-09 20:36:42
 * @LastEditors: tywd
 * @LastEditTime: 2022-06-09 21:22:27
 * @FilePath: /vue3-learn-project/tests/unit/sum.test.js
 * @Description: 一个两数相加的函数 jest 测试
 */
// const sum = require('./sum'); // CommonJs
import sum from './sum' // EsModule

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
