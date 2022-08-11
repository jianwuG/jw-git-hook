/**
 * 判断是否为空
 * @param {*} input
 * @returns
 */
const isEmpty = (input) => {
    return input == null || input == '';
};

/**
 * 判断参数是否为空，（空格:"  "，也返回true）
 */
const isBlank = (input) => {
    return input == null || /^\s*$/.test(input);
};
/**
 * 判断是空或者undefined
 * @param {*} input
 * @returns
 */
const isEmptyOrUndefined = (input) => {
    return isEmpty(input) || typeof input == 'undefined' || input == 'defined';
};
/**
 * 参数为空返回""，否则返回去空格的参数
 */
const trimToEmpty = (input) => {
    return isEmptyOrUndefined(input) ? '' : input.trim();
};

/** 只包含字母 **/
const isAlpha = (input) => {
    return /^[a-z]+$/i.test(input);
};

module.exports = {
    isAlpha,
    isBlank,
    isEmpty,
    isEmptyOrUndefined,
    trimToEmpty
};
