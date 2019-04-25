<template>
  <div class="container">
    <div style="text-align: center;margin-top: 50%">跳转授权中...</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cookie from '@/utils/cookie';


import {
  TO_GRANT_AUTHORIZATION
} from '@/store/h5processModules/bankManage/modules/gotoAccredit/enum/actionsEnum'
import {
  AUTHORIZATION_CALLBACK_URL
} from "@/store/h5processModules/bankManage/modules/gotoAccredit/enum/gettersEnum";

export default {
  name: "gotoAccredit",
  data() {
    return {};
  },
  watch: {
    callbackUrl(value) {
      setTimeout(() => {
        window.location.href = value;
      }, 1000)
    }
  },
  async created() {
    // let token = this.$route.query.token;
    // cookie.set('sid', token);
    let secCatalog = '';
      // switch(process.env.BUILD_ENV) {
      //   case 'prd':
      //   case 'release':
      //     secCatalog = '';
      //     break;
      //   default:
      //     secCatalog = ''
      // }
      let opts = { 
        callBackUrl: `${window.location.origin}${secCatalog}/professionAuthorizationFail.do`
      };
      await this.toGrantAuthorization(opts); // 调用跳转授权地址
      if(!this.callbackUrl) {
        return setTimeout(() => {window.history.go(-2);},1000); // 如果callback未拿到地址就回到上一页
      }
  },
  computed: {
    ...mapGetters('bankManage/gotoAccredit', {
      callbackUrl: AUTHORIZATION_CALLBACK_URL
    })
  },
  methods: {
    ...mapActions('bankManage/gotoAccredit', {
      toGrantAuthorization: TO_GRANT_AUTHORIZATION
    })
  }
};
</script>
<style scoped>
.container {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
