import {
  ERROR_MESSAGE,
  ERROR_ADDINFO
} from './enum/mutationsEnum';

export default {
  [ERROR_MESSAGE](state, errorSender = {}) {
    state.nowError = errorSender;
  },
  [ERROR_ADDINFO](state, errorInfo = {}) {
    state.errorList.push(errorInfo);
  }
};
