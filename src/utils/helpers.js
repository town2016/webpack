/**
 * 格式化时间戳(结果为对应的本地时间)
 * @param  {Number | numString} timeStamp 时间戳(格林时间)
 * @param  {string} splitStr  分开的符号
 * @param  {object} conf  额外配置
 * @return
 */
export const filterDate = (timeStamp, splitStr = '-', conf = {}) => {
  const oDate = new Date(timeStamp);
  const oYear = oDate.getFullYear();
  const oMonth = oDate.getMonth() + 1;
  const oDay = oDate.getDate();
  // oHour = oDate.getUTCHours(),
  // oMinute = oDate.getUTCMinutes(),
  const formatLen = (str) => (String(str).length === 2 ? str : `0${str}`);
  return [oYear, formatLen(oMonth), formatLen(oDay)].join(splitStr);
};

/**
 * 检测手机号
 * @param  {string} tel 手机号
 * @return
 */
export const checkTelephone = (tel) => /^1[3-9]\d{9}$/.test(tel);

/**
 * 复制对应DOM中的所有文本节点（ >=ie9 ）
 * @param  {object} dom DOM节点对象
 * @return {string} 选中的文本内容
 */

export const copyTextContent = (dom) => {
  const sel = window.getSelection(); // 获取鼠标选中
  const range = document.createRange(); // 创建一个range
  sel.removeAllRanges(); // 失去焦点
  range.selectNodeContents(dom); // 设置该范围的边界点，使它包含指定节点的子孙节点，但不包含指定的节点本身。(文本节点)
  sel.addRange(range); // 新增选中(重新选中内容)
  document.execCommand('Copy'); // 复制(返回成功或失败)
  sel.removeAllRanges(); // 失去焦点
  return range.toString();
};

/**
 * 判断是否为空对象
 * @param  {object} obj 对象
 * @return {boolean} 是否为空对象
 */
export function isOwnPropertyEmpty(obj) {
  for (const name in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      return false; // 返回false，不为空对象
    }
  }
  return true; // 返回true，为空对象
}

/**
 * 获取数组中匹配的项
 * @param  {obj} objectArray required 源数组
 * @param  {any} value required
 *  子项值,支持fn,暂不支持regexp
 * @property {bool}  options.deep optional false
 *  deep Compare,当对象属性值为一个对象时可开启深度比较
 * @property {bool} options.isUnique optional true
 *  是否是独特的
 * @return {obj} 返回匹配到的值
 */
export function getItemByOnePair(objectArray, value, { deep = false, isUnique = true } = {}) {
  if (!Array.isArray(objectArray) || value === undefined) {
    return null;
  }
  const len = objectArray.length;
  const isFunc = typeof value === 'function';
  const hasProperty = Object.prototype.hasOwnProperty;
  let indexs = [];
  let items = [];
  for (let i = 0; i < len; i++) {
    const item = objectArray[i];
    if (isFunc ? value(item) : (hasProperty.call(item, key) && item[key] === value)) {
      indexs.push(i);
      items.push(item);
      if (isUnique) break;
    }
  }
  return indexs.length !== 0 ? isUnique ? [items[0], indexs[0]] : [items, indexs] : null;
}

/**
 * 解析url的传参query
 * @return {obj} 解析url传参生成的对象
 */
export function resolveUrlQuery() {
  const arr = location.href.match(/(\?|&)[^&\?]+?=[^&\?]+?(?=(&|$))/g) || [];
  const pairs = {};
  for (const item of arr) {
    const pair = item.replace(/\?|&/, '').split('=');
    pairs[pair[0]] = pair[1];
  }
  return pairs;
}
