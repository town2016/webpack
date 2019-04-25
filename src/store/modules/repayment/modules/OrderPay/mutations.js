import { _BANK_LIST_ASSEMBLE, SELECTED_BANK_SWITCH } from './enum/mutation-types';

export default {
  // bank list assemble
  [_BANK_LIST_ASSEMBLE](_state, _payload) {
    _state.bankArr = [_payload];
  },
  // 切换选中银行卡的索引
  [SELECTED_BANK_SWITCH](_state, _payload) {
    console.log(_payload);
    _state.selectIndex = _payload;
  }
};