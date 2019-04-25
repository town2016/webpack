import {
  LOADCOUNT,
  ISSHOWLOADING,
} from './enum/gettersEnum'

export default {
  [LOADCOUNT](state) {
    return state.loadCount;
  },
  [ISSHOWLOADING](state) {
    return state.loadCount > 0;
  }
}
