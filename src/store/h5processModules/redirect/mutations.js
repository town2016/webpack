import { SET_PROCESS_INFO } from "./enum/mutation-types";

export default {
  [SET_PROCESS_INFO](state, info) {
    state.processInfo = info;
  }
}
