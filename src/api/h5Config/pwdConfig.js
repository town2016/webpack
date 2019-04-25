const requestPath = "commonRequest/h5ProcessRequest";

/**
 * 重置密码接口
 * @param {string} phone 手机号
 * @param {string} pwd 密码
 * @param {string} smsCode 短信验证码
 */
export const API_RESET_PWD = {
  requestPath,
  url: 'user.do?method=resetPwd',
  method: 'POST'
};
