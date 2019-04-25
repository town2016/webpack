import { GETEVALUATELIMITINFO } from "@/api/h5Config/evaluateLimitConfig";
import { FETCH_SERVER } from "@/store/commonModules/Service/enum/actionEnum";
import {
  QUERY_EVALUATE_LIMIT_INFO_SUCCESS,
  QUERY_EVALUATE_LIMIT_INFO_FAILD
} from "./enum/mutationsEnum";
import { GET_EVALUATE_LIMIT_INFO, CLEAR_TIME_OUT } from "./enum/actionsEnum";

let handler;
export default {
  async [GET_EVALUATE_LIMIT_INFO](
    { commit, dispatch },
    { isLoading = false, isToast = false } = {}
  ) {
    try {
      const response = await dispatch(
        FETCH_SERVER,
        {
          apiName: GETEVALUATELIMITINFO,
          config: { isLoading, isToast },
          params: {},
          extraFetchConfig: {}
        },
        { root: true }
      );
      commit(QUERY_EVALUATE_LIMIT_INFO_SUCCESS, response.result);
      if (response.result != undefined && response.result.code === "in_process") {
        handler && window.clearTimeout(handler);
        handler = setTimeout(() => {
          dispatch(GET_EVALUATE_LIMIT_INFO);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async [CLEAR_TIME_OUT](
    { commit, dispatch },
    { isLoading = false, isToast = true } = {}
  ) {
    handler && window.clearTimeout(handler);
  }
};
