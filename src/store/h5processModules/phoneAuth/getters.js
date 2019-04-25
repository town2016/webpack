import {
  LOGIN_PHONE,
  PHONE_AUTH_INFO
} from "./enum/getter-types";

export default {
  [LOGIN_PHONE](state) {
    return state.loginPhone;
  },
  [PHONE_AUTH_INFO](state) {
    return state.phoneAuthInfo;
  }
}
