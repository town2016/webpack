import {
  SMS_CODE_STATUS,
  CAPTCHA_JS_URL,
  CAPTCHA_TICKET,
  CAPTCHA_SHOW,
  CHECK_SMS_CODE_TOKEN
} from "./enum/getter-types";

export default {
  [SMS_CODE_STATUS](state) {
    return state.smsCodeStatus;
  },
  [CAPTCHA_JS_URL](state) {
    return state.captchaJsUrl;
  },
  [CAPTCHA_TICKET](state) {
    return state.captchaTicket;
  },
  [CAPTCHA_SHOW](state) {
    return state.captchaShow;
  },
  [CHECK_SMS_CODE_TOKEN](state) {
    return state.checkSmsCodeToken;
  }
}
