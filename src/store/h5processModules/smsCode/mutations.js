import {
  SET_SMS_CODE_STATUS,
  SET_CAPTCHA_JS_URL,
  SET_CAPTCHA_TICKET,
  SET_CAPTCHA_SHOW,
  SET_CHECK_SMS_CODE_TOKEN
} from './enum/mutation-types';
import storage from '@/utils/storage';

export default {
  [SET_SMS_CODE_STATUS]( state, status ) {
    state.smsCodeStatus = status;
  },
  [SET_CAPTCHA_JS_URL]( state, url ) {
    state.captchaJsUrl = url;
  },
  [SET_CAPTCHA_TICKET]( state, ticket ) {
    state.captchaTicket = ticket;
  },
  [SET_CAPTCHA_SHOW]( state, status ) {
    state.captchaShow = status;
  },
  [SET_CHECK_SMS_CODE_TOKEN]( state, token ) {
    state.checkSmsCodeToken = token;
    if(storage){
      storage.write('checkSmsCodeToken', token);
    }
  }
}
