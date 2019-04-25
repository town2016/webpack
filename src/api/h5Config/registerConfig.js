const requestPath = "commonRequest/h5ProcessRequest";

/**
 * 注册接口
 * @param {string} phone 手机号
 * @param {string} pwd 密码（md5加密）
 * @param {string} smsCode 手机验证码
 * @param {string} invitationCode 用户邀请码（非必填）
 * @param {object} locationData 用户地址信息（String）（非必填）
 */
export const API_REGISTER = {
  requestPath,
  url: 'user.do?method=register',
  method: 'POST'
};
