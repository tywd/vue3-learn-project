/*
 * @Author: tywd
 * @Date: 2022-06-09 20:35:55
 * @LastEditors: tywd
 * @LastEditTime: 2022-06-09 21:21:59
 * @FilePath: /vue3-learn-project/tests/unit/sum.js
 * @Description: 一个两数相加的函数 jest 测试
 */
function sum(a, b) {
    return a + b;
}
// module.exports = sum; // CommonJs
export default sum // EsModule
