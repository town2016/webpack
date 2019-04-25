import {FETCH_SERVER} from "@/store/commonModules/Service/enum/actionEnum";
import {
  GETORDERSTATUS,
  PLACEORDER,
  ORDERCALCULATE,
  GETORDERPLAN,
  GETWITHDRAWRULES,
  GETINFORMATION,
  COMMITINFORMATION,
  GETCOMPANYINFO,
  GETPROVINCES,
  GETCITYS,
  GETDISTRICTS,
  GETLEGAODICT,
  GETFACEURL,
  GETCONTRACTURL
} from "@/api/h5Config/loanConfig";
import {
  QUERY_LOAN_INFO_SUCCESS,
  QUERY_LOAN_INFO_FAILD,
  GET_WITHDRAW_RULES_SUCCESS,
  QUERY_ORDER_CALCULATE_SUCCESS,
  QUERY_ORDER_PLAN_SUCCESS,
  QUERY_INFORMATION_SUCCESS,
  QUERY_COMPANY_INFO_SUCCESS,
  QUERY_PROVINCES_SUCCESS,
  QUERY_CITYS_SUCCESS,
  QUERY_LEGAODICT_SUCCESS,
  QUERY_DISTRICTS_SUCCESS,
  QUERY_FACE_SUCCESS,
  QUERY_CONTRACT_URL_SUCCESS
} from "./enum/mutationsEnum";
import {
  GET_ORDER_STATUS,
  PLACE_ORDER,
  GET_ORDER_CALCULATE,
  GET_ORDER_PLAN,
  GET_WITHDRAW_RULES,
  GET_INFORMATION,
  COMMIT_INFORMATION,
  GET_COMPANY_INFO,
  GET_PROVINCES,
  GET_CITYS,
  GET_DISTRICTS,
  GET_LEGAODICT,
  GET_FACE_URL,
  GET_CONTRACT_URL
} from "./enum/actionsEnum";
import storage from "@/utils/storage";
import {SHOW_TOAST} from "../../commonModules/Toast/enum/actionsEnum";
import {MessageBox } from "mint-ui";
import router from "@/pages/h5process/router";

export default {
  async [GET_ORDER_STATUS](
    {commit, dispatch},
    {isLoading = true, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETORDERSTATUS,
          config: {isLoading, isToast},
          params: {},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_LOAN_INFO_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [PLACE_ORDER](
    {commit, dispatch},
    params,
    {isLoading = true, isToast = false} = {}
  ) {
    try {
      let {$router, placeOrderParam} = params;
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: PLACEORDER,
          config: {isLoading, isToast},
          params: {...placeOrderParam},
          extraFetchConfig: {}
        },
        {root: true}
      );
      if (response.status == 200) {
        $router.push("/loan");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.status == 500) {
        let message = "";
        if (error.response.data && error.response.data.result) {
          let out_of_date_item = error.response.data.result.out_of_date_item;
          switch (out_of_date_item) {
            case "realNameAuth":
              message = "实名认证已过期，请重新认证";
              break;
            case "faceRecognition":
              message = "人脸识别已过期，请重新认证";
              break;
            case "jxlAuth":
              message = "手机认证已过期，请重新认证";
              break;
            case "taoBaoAuth":
              message = "淘宝认证已过期，请重新认证";
              break;
            default:
              message = error.response.data.desc || "下单失败";
          }
          if(out_of_date_item){
            dispatch(GET_INFORMATION);
          }
          if (out_of_date_item == "realNameAuth" || out_of_date_item == "taoBaoAuth") {
            MessageBox.confirm(message, "提示", {
              confirmButtonText: "重新认证",
              cancelButtonText: "放弃"
            }).then(action => {
              if (action == "confirm") {
                //确认的回调,跳转认证
                router.push({path: "/basicDataIdentify"});
              }
            }).catch(() => {});
          } else {
            if (error.response.data.desc == '抱歉，你暂时不符合借款条件') {
              router.push('/loanResult');
              return;
            }
            dispatch(SHOW_TOAST,{
              text: message
            })
          }
        }
      }
    }
  },
  async [GET_ORDER_CALCULATE](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: ORDERCALCULATE,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_ORDER_CALCULATE_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_ORDER_PLAN](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETORDERPLAN,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_ORDER_PLAN_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_WITHDRAW_RULES](
    {commit, dispatch},
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETWITHDRAWRULES,
          config: {isLoading, isToast},
          params: {},
          extraFetchConfig: {}
        },
        {root: true}
      );
      response.result.termCode = response.result.termCode.replace(/M/g, "期");
      commit(GET_WITHDRAW_RULES_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_INFORMATION](
    {commit, dispatch},
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETINFORMATION,
          config: {isLoading, isToast},
          params: {},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_INFORMATION_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [COMMIT_INFORMATION](
    {commit, dispatch},
    params,
    {isLoading = true, isToast = true} = {}
  ) {
    try {
      let {$router, baseInfo, locationInfo} = params;
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: COMMITINFORMATION,
          config: {isLoading, isToast},
          params: {...baseInfo},
          extraFetchConfig: {}
        },
        {root: true}
      );

      if (response.status == 200) {
        storage.delete("userBaseInfo");
        let loadTakeDetail = JSON.parse(storage.read("loadTakeDetail"));
        loadTakeDetail.loanTermCode = loadTakeDetail.loanTermCode.replace(
          "期",
          "M"
        );
        loadTakeDetail = Object.assign({}, loadTakeDetail, locationInfo);
        // let INFO = {
        //   amount: 1000,
        //   appType: "H5",
        //   latitude: "22.54469",
        //   loanTermCode: "12M",
        //   loanUse: "购买原材料",
        //   longitude: "114.03937"
        // };
        let params = {
          placeOrderParam: {
            placeOrderParam: JSON.stringify(loadTakeDetail)
          },
          $router: $router
        };
        dispatch(PLACE_ORDER, params);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_COMPANY_INFO](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETCOMPANYINFO,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      let midData = {
        companyName: params.key
      };
      if (response.result && response.result.fuzzyInfos) {
        response.result.fuzzyInfos.unshift(midData);
      } else {
        response.result = {};
        response.result.fuzzyInfos = [];
        response.result.fuzzyInfos.unshift(midData);
      }
      // console.log(response.result);
      commit(QUERY_COMPANY_INFO_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_PROVINCES](
    {commit, dispatch},
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETPROVINCES,
          config: {isLoading, isToast},
          params: {},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_PROVINCES_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_CITYS](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETCITYS,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_CITYS_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_DISTRICTS](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETDISTRICTS,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_DISTRICTS_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_LEGAODICT](
    {commit, dispatch},
    {isLoading = false, isToast = true} = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETLEGAODICT,
          config: {isLoading, isToast},
          params: {},
          extraFetchConfig: {}
        },
        {root: true}
      );
      commit(QUERY_LEGAODICT_SUCCESS, response.result);
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_FACE_URL](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    let url = "";
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETFACEURL,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      url = response.result;
      commit(QUERY_FACE_SUCCESS, {url: url});
    } catch (error) {
      console.log(error);
    }
  },
  async [GET_CONTRACT_URL](
    {commit, dispatch},
    params,
    {isLoading = false, isToast = true} = {}
  ) {
    let url = "";
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETCONTRACTURL,
          config: {isLoading, isToast},
          params: {...params},
          extraFetchConfig: {}
        },
        {root: true}
      );
      url = response.result[0].pdfSignUrl;
      commit(QUERY_CONTRACT_URL_SUCCESS, {url: url});
    } catch (error) {
      console.log(error);
    }
  }
};
