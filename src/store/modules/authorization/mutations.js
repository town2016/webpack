import { 
  SET_GRANT_AUTHORIZATION
} from '@/store/modules/authorization/enum/mutationsEnum'

export default {
  [SET_GRANT_AUTHORIZATION](state, payload = '') {
    state.callbackUrl = payload
  }
}