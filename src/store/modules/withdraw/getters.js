import { WITHDRAW_DEPOSITINFO } from "@/store/modules/withdraw/enum/gettersEnum";

export default {
  [WITHDRAW_DEPOSITINFO](state) {
    return state.drawDepositInfo;
  }
};
