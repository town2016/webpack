const requestPath = "commonRequest/h5ProcessRequest";

/**
 * 登录接口
 * @param {string} phone 手机号
 * @param {string} pwd 密码
 * @param {string} validCode 短信验证码
 */
export const API_LOGIN = {
  requestPath,
  url: 'user.do?method=login',
  method: 'POST'
};
