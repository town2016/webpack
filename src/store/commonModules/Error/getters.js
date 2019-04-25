import {
  GETERRORLIST,
  GETERRORMESSAGE
} from './enum/gettersEnum';

export default {
  [GETERRORLIST](state) {
    return state.errorList;
  },
  [GETERRORMESSAGE](state) {
    return state.nowError;
  }
};
