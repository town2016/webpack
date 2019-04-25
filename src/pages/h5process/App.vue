<template>
  <div id="appRootDiv" class="scroll-content theme__gold--style" v-wechat-title="$route.meta.title">
    <keep-alive :exclude="exclude">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { Toast, Indicator, MessageBox } from "mint-ui";
import { GETERRORMESSAGE } from "@/store/commonModules/Error/enum/gettersEnum";
import { ISSHOWLOADING } from "@/store/commonModules/Loading/enum/gettersEnum";
import { RESOLVE_URL_SEARCH } from "@/store/commonModules/Reference/enum/actionsEnum";
import { CHECK_PERMISSION } from "@/store/h5processModules/common/enum/action-types";
import { GET_PROCESS_INFO } from "@/store/h5processModules/redirect/enum/action-types";
import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";

const originClose = Indicator.close;
const originOpen = Indicator.open;
Indicator.open = () => {
  originOpen();
  clearTimeout(Indicator.timer);
  Indicator.isCloseabled = false;
  Indicator.timer = setTimeout(() => {
    Indicator.isCloseabled = true;
    if (Indicator.isNeedClose) {
      originClose();
      Indicator.isNeedClose = false;
    }
  }, 1000);
};
Indicator.close = () => {
  if (Indicator.isCloseabled) {
    originClose();
    Indicator.isNeedClose = false;
  } else {
    Indicator.isNeedClose = true;
  }
};
export default {
  name: "App",
  data() {
    return {
      exclude: null
    };
  },
  computed: {
    ...mapGetters({
      errorObj: GETERRORMESSAGE,
      isShowLoading: ISSHOWLOADING
    }),
    ...mapGetters("Reference", {
      baseOriginInfo: "baseOriginInfo"
    }),
    ...mapGetters("Toast", ["toastInfo"]),
    ...mapGetters("Confirm", ["confirmInfo"])
  },

  methods: {
    ...mapActions("Reference", {
      resolveUrlSearch: RESOLVE_URL_SEARCH
    }),
    ...mapActions({
      getProcessInfo: GET_PROCESS_INFO,
      getConfig: GET_CONFIG,
      checkPermission: CHECK_PERMISSION
    }),
    //重写提示
    toast(message, duration = 3000) {
      const { toastInstance } = this;
      //正在弹窗中，则修改
      if (toastInstance && toastInstance.closed == false) {
        toastInstance.timer && clearTimeout(toastInstance.timer);
        this.toastInstance.message = this.toastInfo.text;
        return (toastInstance.timer = setTimeout(() => {
          if (toastInstance.closed) {
            return;
          }
          toastInstance.close();
        }, toastInstance.duration || duration || 3000));
      }
      // 未在弹窗，则直接弹出
      this.toastInstance = Toast({ message, duration });
    }
  },
  watch: {
    isShowLoading(newVal) {
      if (newVal) {
        Indicator.open();
      } else {
        Indicator.close();
      }
    },
    toastInfo() {
      this.toast(this.toastInfo.text, this.toastInfo.duration);
    },
    confirmInfo() {
      if (!this.confirmInfo) {
        return;
      }
      const { text, sureCb, cancelCb } = this.confirmInfo;
      MessageBox.confirm(text)
        .then(sureCb)
        .catch(cancelCb);
    },
    errorObj(val) {
      console.log(val);
    },
    $route(val) {
      if (this.baseOriginInfo.token == "") {
        if (val.meta.requireAuth == true) {
          this.$router.replace("/login");
        }
      } else {
        this.checkPermission();
      }
    }
  },
  async created() {
    this.$root.$clearComponent = Name => {
      this.exclude = Name;
      this.$nextTick(() => {
        this.exclude = null;
      });
    };
    this.resolveUrlSearch({ targetAnchor: location.href })
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  },
  mounted() {
    this.getConfig();
  }
};
</script>
<style lang="scss">
// 主题样式
@import "~@/assets/styles/h5process/theme.scss";

#appRootDiv {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  overflow: hidden;
  overflow-y: scroll;

  -webkit-overflow-scrolling: touch;

  &.scroll-content.padding-bottom {
    margin-bottom: 0.5rem;
  }
}

.dfButtonContainer {
  width: 100%;
  padding: 0 15px;

  .button {
    border-radius: 0.9rem;
    background: linear-gradient(to right, #fed200, #ff9d02);
    margin-top: 0.3rem;
    color: #fff;

    &.disabled {
      background: linear-gradient(to right, #cbcbcb, #afafaf);
    }

    &.mint-button.is-disabled {
      opacity: 1;
    }
  }
}

.mint-indicator-mask {
  // background:transparent!important;
  opacity: 1 !important;
  background: rgba(0, 0, 0, 0.3) !important;
  z-index: 8888;
}

.mint-indicator-wrapper {
  z-index: 9999;
  padding: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.mint-spinner-snake {
  width: 1.5rem !important;
  height: 1.4rem !important;
  border: none !important;
  animation: none !important;
  border-radius: 0 !important;
  background: url("~@/assets/h5processImages/redirect/loading.gif") center /
    100% auto no-repeat;
}
</style>
