const requestPath = "commonRequest/h5ProcessRequest";

/**
 * 获取用户节点信息
 * @type {{requestPath: string, url: string, method: string}}
 */
export const API_GET_PROCESS_INFO = {
  requestPath,
  url: 'basic.do?method=getProcessInfo',
  method: 'GET',
};

/**
 * 获取短信验证码
 * @param {string} phone 手机号
 * @param {string} codeUse 用途 register：注册 resetPwd：修改密码 resetPhone：修改手机号（新） localCheck：修改手机号（旧）
 * @param {string} validCode 验证码
 */
export const API_SEND_SMS_CODE = {
  requestPath,
  url: 'basic.do?method=sendSmsCode',
  method: 'POST'
};

/**
 * 获取腾讯图形验证码
 */
export const API_GET_CAPTCHA_JS_URL = {
  requestPath,
  url: 'basic.do?method=getCaptchaJsUrl',
  method: 'GET'
};

/**
 * 校验短信验证码
 * @param {string} phone 手机号
 * @param {string} codeUse 用途  resetPwd：修改密码
 * @param {string} smsCode 验证码
 */
export const API_CHECK_SMS_CODE = {
  requestPath,
  url: 'basic.do?method=checkSmsCode',
  method: 'POST'
};

/**
 * 获取配置
 */
export const API_GET_CONFIG = {
  requestPath,
  url: 'basic.do?method=getConfig',
  method: 'GET'
};
