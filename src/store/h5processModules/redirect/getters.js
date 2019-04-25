import {
  PROCESS_INFO
} from "./enum/getter-types";

export default {
  [PROCESS_INFO](state) {
    return state.processInfo;
  }
}
