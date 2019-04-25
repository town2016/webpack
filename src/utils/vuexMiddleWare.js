export default function vuexMiddleWare(store) {
  const dispatch = store.prototype.dispatch;
  store.prototype.dispatch = function(...arg) {
    console.log('dispatch', arg);
    return dispatch.apply(this, [...arg]).catch((err) => {
      console.log(err);
    });
  }
};
