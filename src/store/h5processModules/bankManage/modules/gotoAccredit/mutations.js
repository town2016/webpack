import {
  SET_GRANT_AUTHORIZATION
} from './enum/mutationsEnum';

export default {
  [SET_GRANT_AUTHORIZATION](state, payload = '') {
    state.callbackUrl = payload;
  }
};