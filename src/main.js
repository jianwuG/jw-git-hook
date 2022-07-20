// function add(a, b) {
//     return a + b + c
// }
// E:\me\jw-git-hook\src\main.js
//   1:10  error  'add' is defined but never used               no-unused-vars
//   2:1   error  Expected indentation of 2 spaces but found 4  indent
//   2:20  error  'c' is not defined                            no-undef
//   2:21  error  Missing semicolon                             semi

// ✖ 4 problems (4 errors, 0 warnings)

function add(a, b) {
    return a + b;
}

add(1, 2);

// 不合法的 commit 消息格式，请使用正确的提交格式：
//   fix: handle events on blur (close #28)：
//   详情请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md

// 此用户没有权限，具有权限的用户为： xxx@qq.com
