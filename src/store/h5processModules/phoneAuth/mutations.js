import {
  SET_LOGIN_PHONE,
  SET_PHONE_AUTH_INFO
} from "./enum/mutation-types";

export default {
  [SET_LOGIN_PHONE](state, phone) {
    state.loginPhone = phone;
  },
  [SET_PHONE_AUTH_INFO](state, info) {
    state.phoneAuthInfo = info;
  }
}
