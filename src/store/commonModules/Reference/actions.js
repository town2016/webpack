import { resolveUrlQuery } from '@/utils/helpers';
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import cookieController from '@/utils/cookie';
import {CHECK_STORAGE, RESOLVE_URL_SEARCH, SET_BASE_INFO, CLEAR_LOGIN_INFO, AC_INIT_WX_SDK, AC_SET_WX_SHARE } from './enum/actionsEnum';
import { SUBMIT_BASE_INFO, CLEAR_LOGIN_STATE, SUBMIT_WX_STATE } from './enum/mutationsEnum';

export default {
  //  提交基本信息
  [SET_BASE_INFO]({ commit, state }, { token, channel, fromUrl, utmSource, appId, uid }) {
    const currentToken = token || state.token || '';
    const currentChannel = channel || state.channel;
    const currentFromUrl = fromUrl || state.fromUrl;
    const currentUtmSource = utmSource || state.utmSource;
    const currentAppId = appId || state.appId;
    const currentUid = uid || state.uid;
    const baseInfo = { token: currentToken, channel: currentChannel, fromUrl: currentFromUrl, utmSource: currentUtmSource,appId: currentAppId, uid: currentUid };
    cookieController.set('sid', currentToken ,1); // 未登录会清除cookie
    if (currentChannel) sessionStorage.setItem('channel', currentChannel);
    sessionStorage.setItem('reference', JSON.stringify(baseInfo));
    commit(SUBMIT_BASE_INFO, baseInfo);
    return Promise.resolve(baseInfo);
  },
  [CHECK_STORAGE]() {
    return new Promise((resolve,reject)=>{
      let fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) {
        try {
          window.openDatabase(null, null, null, null);
          if(typeof localStorage === 'object'){
            try{
              localStorage.setItem('checkStorage', '1');
              localStorage.removeItem('checkStorage');
              resolve();
            }catch(e){
              Storage.prototype._setItem = Storage.prototype.setItem;
              Storage.prototype.setItem = function() {};
              reject();
            }
          }else{
            reject();
          }
        } catch(e){
          reject();
        }
      } else {
        fs(window.TEMPORARY,100,function(){
          if(typeof localStorage === 'object'){
            try{
              localStorage.setItem('checkStorage', '1');
              localStorage.removeItem('checkStorage');
              resolve();
            }catch(e){
              Storage.prototype._setItem = Storage.prototype.setItem;
              Storage.prototype.setItem = function() {};
              reject();
            }
          }else{
            reject();
          }
        },function(){
          reject();
        });
      }
    });
  },
  // 初始解析基本信息
  [RESOLVE_URL_SEARCH]({ dispatch, state }, { targetAnchor = '' }) {
    try {
      // 第一优先级
      const { token: firstToken = '', channel: firstChannel = null, fromUrl: firstFromUrl = null,utm_source: firstUtmSource= null,appId: firstAppId = null, uid: firstUid =null } = resolveUrlQuery(targetAnchor);
      let reference = sessionStorage.getItem('reference') || {};
      try {
        reference = JSON.parse(reference);
      } catch (e) {}
      const sid = cookieController.get('sid'); // 未登录会清除cookie
      // 第二优先级
      const { token: secToken = null, channel: secChannel = null, fromUrl: secFromUrl = null, utm_source: secondUtmSource = null, appId: secondAppId = null, uid: secondUid = null} = reference;
      // 首先获取url里面的。 再次获取localStore里面的。 之后默认
      const token = firstToken || secToken || sid || state.token || '';
      const channel = firstChannel || secChannel || state.channel || '';
      const fromUrl = firstFromUrl || secFromUrl || state.fromUrl || '';
      const utmSource = firstUtmSource || secondUtmSource || state.utmSource ||'';
      const appId = firstAppId || secondAppId || state.appId ||'';
      const uid = firstUid || secondUid || state.uid ||'';
      const temp = { token, channel, fromUrl: decodeURIComponent(fromUrl), utmSource, appId, uid };
      // 提交信息
      dispatch(SET_BASE_INFO, temp);
      return Promise.resolve(temp);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  // 清除信息
  [CLEAR_LOGIN_INFO]({ commit }) {
    // sessionStorage.removeItem('reference');
    // sessionStorage.removeItem('channel');
    cookieController.set('sid', '');
    commit(CLEAR_LOGIN_STATE);
  },
  async [AC_INIT_WX_SDK]({ dispatch, state, commit }) {
    console.log('初始化微信基本信息');
    if (!state.isSucResolve) {
      return;
    }
    const resonse = await dispatch(FETCH_SERVER, {
      apiName: 'base/API_GET_WXSDK_BASE',
      config: { isLoading: true, isToast: true },
      params: {
        url: window.location.href
      }
    }, { root: true });
    const wxChat = window.wx;
    const data = resonse.result;
    wxChat.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appid || 'wxe9ed5a9cf83a5c9b', // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonce, // 必填，生成签名的随机串
      signature: data.sign, // 必填，签名
      jsApiList: ['updateAppMessageShareData', 'onMenuShareQQ', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
    });
    if (!state.hadInitedWXSDK) {
      wxChat.ready(() => {
        dispatch(AC_SET_WX_SHARE, {});
        // suc
        commit(SUBMIT_WX_STATE, true);
      });
      wxChat.error((res) => {
        console.log(res);
        commit(SUBMIT_WX_STATE, false);
      });
    }
    //  return resonse;
  },
  async [AC_SET_WX_SHARE]({ dispatch, getters }, options = {}) {
    const wxChat = window.wx;
    const response = await dispatch('invitationWithdraw/getInviterCode', null, { root: true });
    const invitationCode = response.result;
    let origin = '';
    switch (process.env.BULID_ENV) {
      case 'stg':
        origin = 'https://h5-test.touna.cn';
        break;
      case 'release':
        origin = 'https://pre-activity.touna.cn';
        break;
      case 'prod':
        origin = 'https://activity.touna.cn';
        break;
      default:
        origin = 'https://h5-test.touna.cn';
    }
    const shareData = {
      title: '你有一个517元新人红包待领取',
      desc: '还有高达20万的取现额度哦！猛戳→', // 这里请特别注意是要去除html
      link: `${origin}/invitation/register?invitationCode=${invitationCode}&sign=${getters.baseOriginInfo.sign}&fromUrl=${getters.baseOriginInfo.fromUrl}`,
      imgUrl: `${origin}/static/share-logo.png`
    };
    const callback = function(res) {
      dispatch('showToast', { text: '分享成功' }, { root: true });
      // 这里是回调函数
      console.log(res);
    };
    if (wxChat.onMenuShareAppMessage) { // 微信文档中提到这两个接口即将弃用，故判断
      const retData = { ...shareData, success: callback };
      wxChat.onMenuShareAppMessage(retData); // 1.0 分享到朋友
      wxChat.onMenuShareTimeline(retData); // 1.0分享到朋友圈
      wxChat.onMenuShareQQ(retData);
    } else {
      wxChat.updateAppMessageShareData(shareData, callback); // 1.4 分享到朋友
      wxChat.updateTimelineShareData(shareData, callback); // 1.4分享到朋友圈
    }
    // wxChat.updateAppMessageShareData({
    //   title: 'asdasdas', // 分享标题
    //   desc: 'adas', // 分享描述
    //   link: , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //   imgUrl: , // 分享图标
    // }, function(res) {
    //   dispatch('showToast', { text: '分享成功' }, { root: true });
    //   // 这里是回调函数
    //   console.log(res);
    // });
  }
};
