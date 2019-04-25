const requestPath = 'commonRequest/h5ProcessRequest';

/*
 *@name getBaseAuthenInfo
 *@desc 获取认证页面信息(初始化页面信息)
 */
export const API_BASE_AUTHEN_INFO = {
  requestPath,
  url: 'user.do?method=getAuth',
  method: 'get'
};

/*
 *@name API_UPLOAD_IDCARD
 *@desc 上传身份证
 */
export const API_UPLOAD_IDCARD = {
  requestPath,
  url: 'basic.do?method=idCardOCR',
  method: 'POST'
};

/*
 *@name API_AUTH_REAL_NAME
 *@desc 实名认证
 */
export const API_AUTH_REAL_NAME = {
  requestPath,
  url: 'user.do?method=informationAuth',
  method: 'POST'
};

/*
 *@name faceRecognition
 *@desc 人脸识别
 *@params paramsFile 上传的文件
 */
export const API_FACE_RECOGNITION = {
  requestPath,
  url: 'auth.do?method=faceRecognition',
  method: 'POST'
};

/*
 *@name easyFace
 *@desc 人脸识别
 *@params paramsFile 上传的文件
 */
export const API_EASY_FACE = {
  requestPath,
  url: 'auth.do?method=easyFace',
  method: 'POST'
};

/*
 *@name getTaobaoUrl
 *@desc 淘宝认证
 */
export const API_TAOBAO_AUTH_URL = {
  requestPath,
  url: 'auth.do?method=getTaobaoUrl',
  method: 'POST'
};

/**
 * 手机认证
 * @param {string} phone 手机号
 * @param {string} serviceCode 服务密码
 * @param {string} captcha 验证码
 */
export const API_PHONE_AUTH = {
  requestPath,
  url: 'auth.do?method=jxlAuth',
  method: 'POST'
};

/**
 * 手机认证
 * @param {string} password 新密码
 * @param {string} captcha 验证码
 * @param {string} type 类型SUBMIT_RESET_PWD（提交短信验证码）RESEND_RESET_PWD_CAPTCHA（重发短信验证码)
 */
export const API_RESET_SERVICE_PASSWORD = {
  requestPath,
  url: 'auth.do?method=jxlResetPassword',
  method: 'POST'
};

