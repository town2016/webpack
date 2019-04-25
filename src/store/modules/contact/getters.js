import {
  CONTACT_LIST
} from '@/store/modules/contact/enum/gettersEnum';

export default {
  [CONTACT_LIST](state) {
    return state.contactList;
  }
}