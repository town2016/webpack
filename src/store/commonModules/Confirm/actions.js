import { SHOW_CONFIRM, SURE_RESOLVE, CANCEL_REJECT } from './enum/actionsEnum';
import { SUBMIT_CONFIRM_DATA, CLEAT_CONFIRM_DATA } from './enum/mutationsEnum';
let promiseHandler = null;

export default {
  [SHOW_CONFIRM]: {
    root: true,
    handler({ commit }, { sureCb = () => {}, cancelCb = () => {}, text = 'confirm information' }) {
      const resolve = (...args) => {
        sureCb(...args);
        commit(CLEAT_CONFIRM_DATA); // 清除
      };
      const reject = (...args) => {
        cancelCb(...args);
        commit(CLEAT_CONFIRM_DATA); // 清除
      };
      commit(SUBMIT_CONFIRM_DATA, { sureCb: resolve, cancelCb: reject, text });
      // const promise = new Promise(function(resolve, reject) {
      //   promiseHandler = { resolve, reject };
      // });
      // commit(SUBMIT_CONFIRM_DATA, preload);
      // return promise;
    },
  },
  // [SURE_RESOLVE]() {
  //   promiseHandler.resolve('sure');
  //   promiseHandler = null;
  //   // commit(PROMISE_RESOLVE);
  // },
  // [CANCEL_REJECT]() {
  //   promiseHandler.reject('cancel');
  //   promiseHandler = null;
  //   //commit(PROMISE_REJECT);
  // },
}
