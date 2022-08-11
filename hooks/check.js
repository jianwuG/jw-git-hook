const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
// const vueCompiler = require('vue-template-compiler') //VUE2版本
const vueCompiler = require('@vue/compiler-sfc'); // VUE3版本
const commitRE = /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,100}/;
const email = childProcess.execSync('git config user.email').toString().trim();
const msg = fs.readFileSync(process.argv[2], 'utf-8').trim(); // 索引 2 对应的 commit 消息文件
const _errStats = [];

/**
 * 校验提交规范
 */
const checkCommit = () => {
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
 * 校验邮箱规范
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
    checkFileStats(folder, false, (filename) => {
        if (/[A-Z]/.test(filename)) {
            // 目前只校验是否含大写字母
            console.log(chalk.yellow(folder + '/' + filename + ' 文件请遵守kebab-case命名规范'));
            process.exit(1);
        }
    });
};

/**
 * 检查提交文件内方法有没有写注释
 * @param {*} folder
 */
const checkFileExplanatory = async (folder) => {
    checkFileStats(folder, true, (fileDir) => {
        const isVue = fileDir.search('.vue') > -1;
        const sourceCode = fs.readFileSync(fileDir, 'utf-8');
        let ast = '';
        if (isVue) {
            // // vueStr .vue 文件内容 VUE2版本
            // const vueCode = vueCompiler.parseComponent(sourceCode);
            // ast = parser.parse(vueCode.script.content, {
            //     allowImportExportEverywhere: true
            // });

            // 提取vueCode
            const vueCode = vueCompiler.parse(sourceCode);
            if (vueCode.descriptor.script) {
                // const { code } = vueCompiler.compileTemplate({
                //     id: fileDir,
                //     filename: fileDir,
                //     source: vueCode.descriptor.script.content
                // });
                ast = parser.parse(vueCode.descriptor.script.content, {
                    sourceType: 'unambiguous'
                });
            }
        } else {
            ast = parser.parse(sourceCode, {
                sourceType: 'unambiguous'
            });
        }
        traverse(ast, {
            FunctionDeclaration: {
                enter(path, state) {
                    checkLeadingComments(path.node, fileDir, path.node.id.name);
                }
            },
            VariableDeclaration: {
                enter(path, state) {
                    const _declarations = path.node.declarations[0];
                    if (_declarations.init.type === 'ArrowFunctionExpression') {
                        checkLeadingComments(path.node, fileDir, _declarations.id.name);
                    }
                }
            }
        });
        if (_errStats.length) {
            console.error(`${_errStats.join('\n')}`);
            process.exit(1);
        }
    });
};

/**
 * 
 * @param {*} node ast path.node 节点
 * @param {*} fileDir 文件路劲
 * @param {*} name 方法名
 */
const checkLeadingComments = async (node, fileDir, name) => {
    const _leadingComments = node.leadingComments;
    // eslint-disable-next-line no-undef
    const hasCommentBlock = _leadingComments?.find(item => item.type === 'CommentBlock');
    if (!_leadingComments || !hasCommentBlock) {
        _errStats.push(`X: ${fileDir}中的${name}方法未添加注释!!`);
    }
};

/**
 * 文件状态校验
 * @param {*} folder 文件目录
 * @param {*} isFilePath 是否是文件路劲
 * @param {*} checkCallBack 回调方法
 */
const checkFileStats = async (folder, isFilePath, checkCallBack) => {
    await fs.readdir(folder, async (_err, files) => {
        if (_err) {
            console.warn(_err);
            process.exit(1);
        }
        // 遍历读取到的文件列表
        files.forEach(filename => {
            // 获取当前文件的绝对路径
            const fileDir = path.join(folder, filename);
            fs.stat(fileDir, async (err, stats) => {
                if (err) {
                    console.warn(err);
                    process.exit(1);
                } else {
                    const isDir = stats.isDirectory(); // 是文件夹
                    if (isDir) {
                        checkFileStats(folder + '/' + filename, isFilePath, checkCallBack);
                    } else {
                        checkCallBack(isFilePath ? fileDir : filename);
                    }
                }
            });
        }
        );
    });
};

module.exports = {
    checkCommit,
    checkEmail,
    checkFileCase,
    checkFileExplanatory
};
