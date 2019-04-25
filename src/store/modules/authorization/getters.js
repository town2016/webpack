import {
  AUTHORIZATION_CALLBACK_URL
} from "@/store/modules/authorization/enum/gettersEnum";

export default {
  [AUTHORIZATION_CALLBACK_URL](state) {
    return state.callbackUrl;
  }
}