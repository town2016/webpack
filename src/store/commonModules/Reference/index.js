import { SUBMIT_BASE_INFO, CLEAR_LOGIN_STATE, SUBMIT_WX_STATE } from './enum/mutationsEnum';
import actions from './actions';

export default {
  namespaced: true,
  state: {
    isSucResolve: false, // 确认是否登录
    token: null, // sid
    channel: null, // 标识（渠道）
    fromUrl: null, // 源url
    utmSource: null, // 广告
    appId: null, //第三方appId
    uid: null, // 第三方传的uid
    sucInitWXSDK: null,
    hadInitedWXSDK: false
  },
  getters: {
    isSucResolve: state => state.isSucResolve,
    baseOriginInfo: state => ({ token: state.token, channel: state.channel, fromUrl: state.fromUrl, utmSource: state.utmSource ,appId: state.appId, uid: state.uid})
  },
  actions,
  mutations: {
    [SUBMIT_BASE_INFO](state, { token, channel, fromUrl, utmSource, appId,uid }) {
      const isSucResolve = Boolean(token);
      state.token = token;
      state.channel = channel;
      state.fromUrl = fromUrl;
      state.utmSource = utmSource;
      state.appId = appId;
      state.uid = uid;
      state.isSucResolve = isSucResolve;
      console.log({ token, channel, fromUrl });
    },
    [CLEAR_LOGIN_STATE](state) {
      state.token = null; // 清空token
      // state.channel = null;
      // state.fromUrl = null;
      state.isSucResolve = false; // 置为false
    },
    [SUBMIT_WX_STATE](state, payload) {
      state.sucInitWXSDK = payload;
      state.hadInitedWXSDK = true;
    }
  }
};
