import * as basicConfig from './basicConfig';
import * as registerConfig from './registerConfig';
import * as pwdConfig from './pwdConfig';
import * as loginConfig from './loginConfig';
import * as userConfig from './userConfig';
import * as repayment from './repayment';
import * as authentication from './authentication';
import * as homeConfig from './homeConfig';
import * as bankManage from './bankManage';

export const apiConfig = {
  basicConfig,
  homeConfig,
  registerConfig,
  loginConfig,
  userConfig,
  repayment,
  authentication,
  pwdConfig,
  bankManage
};
export default apiConfig;

export function requireApiConfig(apiModuleStr) {
  const moduleArr = apiModuleStr.replace(/^\/|\/$/gi, '').split('/');
  try {
    const APIConfig = moduleArr.reduce((total, curKey) => total[curKey], apiConfig);
    if (!APIConfig) {
      throw new Error('error');
    }
    return APIConfig;
  } catch (err) {
    throw new Error('not found this api config');
  }
};
