import {
  FACE_RECOGNITION,
  EASY_FACE
} from './enum/action-types';

import { requireApiConfig } from '@/api/h5Config';

export default {
  /**
   * 人脸识别
   * @param {Object} file
   */
  async [FACE_RECOGNITION]({ dispatch }, { file }) {
    const formData = new FormData();
    // 上传文件，最后一个参数表示文件名（其他key-value类型不能传第三个参数）
    formData.append('uploadFile', file, file.name);
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_FACE_RECOGNITION'),
      params: formData
    }, { root: true });
    return response;
  },

  /**
   * 人脸识别-图片file
   * @param {Object} file
   */
  async [EASY_FACE]({ dispatch }, { file }) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('authentication/API_EASY_FACE'),
      params: formData
    }, { root: true });
    return response;
  }
};
