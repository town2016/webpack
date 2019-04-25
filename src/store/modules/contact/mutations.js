import {
  SET_CONTACT_LIST
} from '@/store/modules/contact/enum/mutationsEnum';

export default {
  [SET_CONTACT_LIST](state, payload) {
    console.log(payload)
    state.contactList = payload;
  }
}