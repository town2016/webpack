import {
  QUERY_LOAN_INFO_SUCCESS,
  QUERY_LOAN_INFO_FAILD,
  GET_WITHDRAW_RULES_SUCCESS,
  QUERY_ORDER_CALCULATE_SUCCESS,
  QUERY_ORDER_PLAN_SUCCESS,
  SAVE_USER_BASE_INFO,
  QUERY_INFORMATION_SUCCESS,
  QUERY_COMPANY_INFO_SUCCESS,
  QUERY_PROVINCES_SUCCESS,
  QUERY_CITYS_SUCCESS,
  QUERY_LEGAODICT_SUCCESS,
  QUERY_DISTRICTS_SUCCESS,
  QUERY_FACE_SUCCESS,
  CLEAR_ORDER_INFO,
  QUERY_CONTRACT_URL_SUCCESS
} from "./enum/mutationsEnum";
import storage from "@/utils/storage";

export default {
  [QUERY_LOAN_INFO_SUCCESS](state, payload) {
    if (payload == undefined) {
      //从未借过款返回为{}时候，默认返回 { code: 0 }，便于页面上显示借款信息页面
      state.orderStatus = Object.assign({}, state.orderStatus, {code: 0});
    } else {
      state.orderStatus = Object.assign({}, state.orderStatus, payload);
    }
  },
  [QUERY_LOAN_INFO_FAILD](state) {
    state.orderStatus = Object.assign({}, state.orderStatus, {});
  },
  [GET_WITHDRAW_RULES_SUCCESS](state, payload) {
    let midInfo = {};
    midInfo.loanUse = payload.loanUse.split(",");
    midInfo.termCode = payload.termCode.split(",");
    state.withdrawRules = Object.assign({}, state.withdrawRules, midInfo);
  },
  [QUERY_ORDER_CALCULATE_SUCCESS](state, payload) {
    state.orderCalculate = Object.assign({}, state.orderCalculate, payload);
  },
  [QUERY_ORDER_PLAN_SUCCESS](state, payload) {
    state.orderPlan = Object.assign({}, state.orderPlan, payload);
  },
  [CLEAR_ORDER_INFO](state, payload) {
    state.orderCalculate = {};
    state.orderPlan = {};
  },
  [SAVE_USER_BASE_INFO](state, payload) {
    state.information = Object.assign({}, state.information, payload);
  },
  [QUERY_INFORMATION_SUCCESS](state, payload) {
    let {
      companyDTO,
      contactDTOs,
      faceRecognition,
      informationDTO,
      jxl,
      custRelationDist,
      industryCategoryList,
      sourceOfIncomeDist
    } = payload;

    let midCustRelationDist = custRelationDist.filter((item) => {
      return item.datacode == 1 || item.datacode == 6 || item.datacode == 8;
    });
    if(contactDTOs && contactDTOs[0] && contactDTOs[0].contactRelationshipCode){
      let contactRelationshipCode = contactDTOs[0].contactRelationshipCode;
      if(contactRelationshipCode != 1 && contactRelationshipCode != 6 && contactRelationshipCode != 8){
        contactDTOs[0].contactName = '';
        contactDTOs[0].contactPhone = '';
        contactDTOs[0].contactRelationshipCode = '';
      }
    }
    midCustRelationDist.map(item => {
      item.text = item.datavalue;
      item.value = item.datacode;
    });
    state.custRelationDist = midCustRelationDist;
    industryCategoryList.map(item => {
      item.text = item.name;
      item.value = item.code;
    });
    state.industryCategoryList = industryCategoryList;
    sourceOfIncomeDist.map(item => {
      item.text = item.datavalue;
      item.value = item.datacode;
    });
    state.sourceOfIncomeDist = sourceOfIncomeDist;

    // 优先获取本地保存的基础信息
    let storageUserBaseInfo = {};
    if (storage.read("userBaseInfo")) {
      storageUserBaseInfo = JSON.parse(storage.read("userBaseInfo")) || {};
    }
    const isEmpty = (value) => {
      if (Array.isArray(value)) {
        if(JSON.stringify(value)==='[{}]'){
          return true;
        }
        return value.length === 0;
      }
      if (value && value.constructor === Object) {
        return Object.keys(value).length === 0;
      }
      return false;
    };
    for (const currentKey in payload) {
      const item = payload[currentKey];
      if (!isEmpty(item)) {
        if(storageUserBaseInfo[currentKey]&&item.constructor === Object){
          Object.assign( storageUserBaseInfo[currentKey],item);
        }else{
          storageUserBaseInfo[currentKey]  = item;
        }
      }
    }
    if(!storageUserBaseInfo.faceRecognition){
      storageUserBaseInfo.faceRecognition = 0;
    }
    if(!storageUserBaseInfo.jxl){
      storageUserBaseInfo.jxl = 0;
    }
    state.information = Object.assign({}, state.information, storageUserBaseInfo);
  },
  [QUERY_COMPANY_INFO_SUCCESS](state, payload) {
    state.companyInfo = Object.assign({}, state.companyInfo, payload);
  },
  [QUERY_PROVINCES_SUCCESS](state, payload) {
    if (payload) {
      payload.map(province => {
        switch (province.provinceCode) {
          case '110000':
          case '120000':
          case '310000':
          case '500000':
            province.provinceName = province.provinceName + '市';
            break;
          case '150000':
          case '450000':
          case '540000':
          case '640000':
          case '650000':
          case '710000':
          case '810000':
          case '820000':
            province.provinceName = province.provinceName;
            break;
          default:
            province.provinceName = province.provinceName + '省';
        }
      });
    }
    state.province = Object.assign({}, state.province, payload);
  },
  [QUERY_CITYS_SUCCESS](state, payload) {
    state.city = Object.assign({}, state.city, payload);
  },
  [QUERY_LEGAODICT_SUCCESS](state, payload) {
    state.legaoDict = Object.assign({}, state.legaoDict, payload);
  },
  [QUERY_DISTRICTS_SUCCESS](state, payload) {
    state.districts = Object.assign({}, state.districts, payload);
  },
  [QUERY_FACE_SUCCESS](state, payload) {
    state.FaceInfo = Object.assign({}, state.FaceInfo, payload);
  },
  [QUERY_CONTRACT_URL_SUCCESS](state, payload) {
    state.contractUrl = Object.assign({}, state.contractUrl, payload);
  }
};
