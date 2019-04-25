<template>
  <div class="container">
	  <div style="text-align: center;margin-top: 50%">跳转授权中...</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Toast } from "mint-ui";
import cookie from "@/utils/cookie";

import { TO_GRANT_AUTHORIZATION } from "@/store/h5processModules/GotoAccredit/enum/actionsEnum";
import { AUTHORIZATION_CALLBACK_URL } from "@/store/h5processModules/GotoAccredit/enum/gettersEnum";

export default {
  name: "GotoAccredit",
  data() {
    return {};
  },
  watch: {
    callbackUrl(value) {
      setTimeout(() => {
        window.location.href = value;
      }, 1000);
    }
  },
  async created() {
    let token = this.$route.query.token;
    cookie.set("sid", token);
    let opts = {
      callBackUrl: window.location.origin + "/openAccount?token=" + token
    };

    await this.toGrantAuthorization(opts); // 调用跳转授权地址
    if (!this.callbackUrl) {
      return setTimeout(() => {
        console.log('出错跳转')
        // window.history.go(-2);
      }, 1000); // 如果callback未拿到地址就回到上一页
    }
  },
  computed: {
    ...mapGetters("GotoAccredit", {
      callbackUrl: AUTHORIZATION_CALLBACK_URL
    })
  },
  methods: {
    ...mapActions("GotoAccredit", {
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
