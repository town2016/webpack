import {
  GET_MAP_GEOLOCATION,
  GET_BASE_AUTHEN_INFO,
  UPLOAD_IDCARD,
  AUTH_REAL_NAME,
  GET_TAOBAO_AUTH_URL
} from './enum/action-types';

import { requireApiConfig } from '@/api/h5Config';

export default {
  // 拿到地理位置信息
  [GET_MAP_GEOLOCATION]() {
    // 清除高德地图的缓存
    try {
      Object.keys(localStorage).forEach((x) => {
        if (/_AMap/.test(x)) {
          localStorage.removeItem(x);
        }
      });
    } catch (err) {
      console.error(err);
      console.log('清除缓存失败');
    }
    return new Promise((resolve, reject) => {
      const AMap = window.AMap;
      const mapObj = new AMap.Map('iCenter');
      mapObj.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', (gpsLocation) => {
          const addressComponent = gpsLocation ? gpsLocation.addressComponent : '';
          if (addressComponent) {
            resolve({
              city: addressComponent.city, // 市
              district: addressComponent.district, // 区
              province: addressComponent.province, // 省
              latitude: gpsLocation.position.lat, // 纬度
              longitude: gpsLocation.position.lng // 经度
            });
          } else {
            reject(new Error('fail to geolocation'));
          }
        }); // 返回定位信息
        AMap.event.addListener(geolocation, 'error', (e) => {
          console.log('>>>>>>>>>>>>>>>>>地图定位失败', e);
          reject(e);
        }); // 返回定位出错信息
      });
    });
  },
  // 获取基本信息
  async [GET_BASE_AUTHEN_INFO]({ dispatch }) {
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_BASE_AUTHEN_INFO')
    }, { root: true });
    return response;
  },

  /**
   * 上传身份证
   * @param {String} type 类型：front.正面 back.反面
   * @param {Object} file
   */
  async [UPLOAD_IDCARD]({ dispatch }, { type, file }) {
    const formData = new FormData();
    // 上传文件，最后一个参数表示文件名（其他key-value类型不能传第三个参数）
    formData.append(type === 'front' ? 'idcard1' : 'idcard2', file, file.name);
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_UPLOAD_IDCARD'),
      // config: { costomToast: true },
      config: { isLoading: false },
      params: formData
    }, { root: true });

    return response;
  },
  /**
   * 提交认证
   */
  async [AUTH_REAL_NAME]({ dispatch }, params) {
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_AUTH_REAL_NAME'),
      params
    }, { root: true });

    return response;
  },
  /**
   * 淘宝认证
   */
  async [GET_TAOBAO_AUTH_URL]({ dispatch }) {
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_TAOBAO_AUTH_URL'),
      params: {
        url: location.href
      }
    }, { root: true });
    return response;
  }
};