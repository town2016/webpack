<template>
  <div id="appRootDiv" class="scroll-content" v-wechat-title="$route.meta.title">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters, } from 'vuex';
import { Toast, Indicator, MessageBox } from 'mint-ui';
import { LOGIN } from '@/store/modules/user/enum/actionsEnum';
import { GETERRORMESSAGE } from '@/store/commonModules/Error/enum/gettersEnum';
import { ISSHOWLOADING } from '@/store/commonModules/Loading/enum/gettersEnum';
import cookie from '@/utils/cookie';

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      errorInfo: GETERRORMESSAGE,
      isShowLoading: ISSHOWLOADING,
    }),
    ...mapGetters('Toast', ['toastInfo']),
    ...mapGetters('Confirm', ['confirmInfo']),
  },
  methods: {
    ...mapActions({
      login: LOGIN
    }),
    // ...mapActions('Confirm', {
    //   'SURE_RESOLVE': SURE_RESOLVE,
    //   'CANCEL_REJECT': CANCEL_REJECT,
    // }),

    //重写提示
    toast(message, duration = 3000) {
      const { toastInstance } = this
      //正在弹窗中
      if (toastInstance && toastInstance.closed == false) {
        toastInstance.timer && clearTimeout(toastInstance.timer)
        this.toastInstance.message = this.toastInfo.text;
        return toastInstance.timer = setTimeout(() => {
          if (toastInstance.closed) { return }
          toastInstance.close()
        }, toastInstance.duration || duration || 3000)
      }

      this.toastInstance = Toast({ message, duration })
    }
  },
  watch: {
    // errorInfo() {
    //   console.log('抓住错误信息', this.errorInfo)
    // },
    isShowLoading(newVal) {
      if (newVal) {
        Indicator.open();
      } else {
        Indicator.close();
      }
    },
    toastInfo() {
      this.toast(this.toastInfo.text, this.toastInfo.duration)

    },
    confirmInfo() {
      if (!this.confirmInfo) {
        return;
      }
      const { text, sureCb, cancelCb } = this.confirmInfo;
      MessageBox.confirm(text).then(sureCb).catch(cancelCb);
      // const fn = confirmInfo => {
      //   const { text = "", success = () => {}, faild = () => {} } = this.confirmInfo
      //   MessageBox.confirm(this.confirmInfo.text).then(success).catch(faild);
      // }
      // fn(this.confirmInfo)
    },
  },
  created() {
    // let TOKEN = location.href.match(/(?<=token=).*&?/);
    let TOKEN = location.href.match(/token=.+?(&|\b)/);
    if (TOKEN) {
      cookie.set('sid', TOKEN[0].replace(/(^.*?=)|&/g, ''), 3);
    }
  },
}
</script>
<style lang="scss">
#appRootDiv {
  display: flex;
  flex: 1;
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
    background: linear-gradient(to right, #FED200, #FF9D02);
    margin-top: 0.3rem;
    color: #FFF;

    &.disabled {
      background: linear-gradient(to right, #CBCBCB, #AFAFAF);
    }

    &.mint-button.is-disabled {
      opacity: 1;
    }
  }
}
</style>