import {
  ORDER_STATUS,
  LOAN_INFO,
  ORDER_CALCULATE,
  ORDER_PLAN,
  WITHDRAW_RULES,
  INFORMATION,
  COMPANY_INFO,
  PROVINCES,
  CITYS,
  DISTRICTS,
  LEGAODICT,
  GET_FACE_INFO,
  CONTRACTURL,
  CUSTRELATIONDIST,
  INDUSTRYCATEGORYLIST,
  SOURCEOFINCOMEDIST,
} from "@/store/h5processModules/loan/enum/gettersEnum";
import storage from "@/utils/storage";

export default {
  [ORDER_STATUS](state) {
    return state.orderStatus;
  },
  [LOAN_INFO](state) {
    return state.loanInfo;
  },
  [ORDER_CALCULATE](state) {
    return state.orderCalculate;
  },
  [ORDER_PLAN](state) {
    return state.orderPlan;
  },
  [WITHDRAW_RULES](state) {
    return state.withdrawRules;
  },
  [INFORMATION](state) {
    return state.information;
    // if(storage.read("userBaseInfo")){
    //   let midInfo = JSON.parse(storage.read("userBaseInfo"));
    //   midInfo.faceRecognition = state.information.faceRecognition;
    //   midInfo.jxl = state.information.faceRecognition;
    //   return midInfo;
    // }else{
    //   console.log(state.information);
    //   return state.information;
    // }
  },
  [COMPANY_INFO](state) {
    return state.companyInfo;
  },
  [PROVINCES](state) {
    return state.province;
  },
  [CITYS](state) {
    return state.city;
  },
  [DISTRICTS](state) {
    return state.districts;
  },
  [LEGAODICT](state) {
    return state.legaoDict;
  },
  [GET_FACE_INFO](state){
    return state.FaceInfo
  },
  [CONTRACTURL](state){
    return state.contractUrl
  },
  [CUSTRELATIONDIST](state){
    return state.custRelationDist
  },
  [INDUSTRYCATEGORYLIST](state){
    return state.industryCategoryList
  },
  [SOURCEOFINCOMEDIST](state){
    return state.sourceOfIncomeDist
  },
};
