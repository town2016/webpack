import * as base from './base';

import * as repayConfig from './repayConfig';
import * as bankCardConfig from './bankCardConfig';
import * as withdrawConfig from './withdrawConfig';
import * as userConfig from './userConfig';
import * as contactConfig from './contactConfig';
export const apiConfig = {
  base,
  repayConfig,
  bankCardConfig,
  withdrawConfig,
  userConfig,
  contactConfig
};
export default apiConfig;

export function requireApiConfig(_apiModule) {
  const arr = _apiModule.replace(/^\/|\/$/gi, '').split('/');
  try {
    const requistApi = arr.reduce((_result, _key) => _result[_key], apiConfig);
    if (!requistApi) {
      throw new Error('error');
    }
    return requistApi;
  } catch (err) {
    throw new Error('not found this api config');
  }
};
