import { SUBMIT_INITED_DATA } from './enum/mutation-types';

export default {
  // bank list assemble
  [SUBMIT_INITED_DATA](state, { moneyTotal, phaseTotal, type, cardNo, bankName, oId, phasesStr, isPrePayFee }) {
    // state.moneyTotal = moneyTotal;
    // state.phaseTotal = phaseTotal;
    // state.type = type;
    // state.cardNo = cardno;
    // state.bankName = bankname;
    // state.oId = oId;
    // state.phasesStr = phasesStr;
    // state.isPrePayFee = isPrePayFee;
    Object.assign(state, {
      moneyTotal,
      phaseTotal,
      type,
      cardNo,
      bankName,
      oId,
      phasesStr,
      isPrePayFee
    });
  }
};