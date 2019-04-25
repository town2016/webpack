import {
  AUTHORIZATION_CALLBACK_URL
} from './enum/gettersEnum';

export default {
  [AUTHORIZATION_CALLBACK_URL](state) {
    return state.callbackUrl;
  }
};