const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const commitRE = /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,100}/;
const email = childProcess.execSync('git config user.email').toString().trim();
const msg = fs.readFileSync(process.argv[2], 'utf-8').trim(); // 索引 2 对应的 commit 消息文件

/**
 * 校验提交规范
 */
const checkCommit = () => {
    // 校验提交规范
    if (!commitRE.test(msg)) {
        console.log(chalk.yellow(
            '不合法的 commit 消息格式，请使用正确的提交格式：\n' +
            '  fix: handle events on blur (close #28)：\n' +
            '  详情请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md'
        ));
        process.exit(1);
    }
};
/**
 * 校验邮箱
 * @param {*} testEmail
 */
const checkEmail = (testEmail) => {
    if (!testEmail.test(email)) {
        console.log(chalk.red('此用户没有权限，具有权限的用户为： xxx@qq.com或者100.com'));
        process.exit(1);
    }
};

/**
 * 校验提交文件目录命名规范
 * @param {*} folder 
 */
const checkFileCase = async (folder) => {
    await fs.readdir(folder, async (_err, files) => {
        if (_err) {
            console.warn(_err);
            process.exit(1);
        }

        // 遍历读取到的文件列表
        files.forEach(filename => {
            // 获取当前文件的绝对路径
            const filedir = path.join(folder, filename);
            // 根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, async (err, stats) => {
                if (err) {
                    console.warn(err);
                    process.exit(1);
                } else {
                    const isDir = stats.isDirectory(); // 是文件夹
                    if (isDir) {
                        checkFileCase(folder + '/' + filename);
                    } else {
                        if (/[A-Z]/.test(filename)) {
                            // 目前只校验是否含大写字母
                            console.log(chalk.yellow(folder + '/' + filename + ' 文件请遵守kebab-case命名规范'));
                            process.exit(1);
                        }
                    }
                }
            });
        });
    });
};

module.exports = {
    checkCommit,
    checkEmail,
    checkFileCase
};
