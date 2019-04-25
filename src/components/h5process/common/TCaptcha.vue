<template>
  <div class="captcha-wrap">
    <div id="TCaptcha"></div>
    <div class="v-modal" v-show="showModal"></div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {
    CAPTCHA_JS_URL
  } from "@/store/h5processModules/smsCode/enum/getter-types";
  import {
    SET_CAPTCHA_TICKET,
    SET_CAPTCHA_SHOW
  } from "@/store/h5processModules/smsCode/enum/mutation-types";

  export default {
    name: "TCaptcha",
    props: {
      show: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data() {
      return {
        showModal: false
      }
    },
    computed: {
      ...mapGetters({
        captchaJsUrl: CAPTCHA_JS_URL
      })
    },
    watch: {
      show(status) {
        if(status){
          this.init();
        }
      },
    },
    methods: {
      ...mapMutations({
        setCaptchaTicket: SET_CAPTCHA_TICKET,
        setCaptchaShow: SET_CAPTCHA_SHOW
      }),
      refresh() {
        if(window.capRefresh){
          capRefresh();
        }
        this.showModal = true;
      },
      destroy() {
        this.setCaptchaTicket('');
        if(window.capDestroy){
          capDestroy();
        }
      },
      loadCaptchaJs() {
        let promise = new Promise((resolve, reject)=> {
          window.jsLoader.load(this.captchaJsUrl.result,()=>{
            resolve();
          })
        });
        return promise;
      },
      init() {
        let self = this;
        if (self.captchaJsUrl.result && self.show) {
          this.loadCaptchaJs().then(()=>{
            let capOption = {
              type: 'popup',
              callback: cbfn,
              showHeader: true
            };
            capInit(document.getElementById("TCaptcha"), capOption);
            self.showTCaptcha = true;
            //回调函数：验证码页面关闭时回调
            function cbfn(retJson) {
              if (retJson.ret == 0) {
                // 用户验证成功
                self.setCaptchaTicket(retJson.ticket);
                self.showModal = false;
              }
              else {
                //用户关闭验证码页面，没有验证
                self.showModal = false;
              }
            }
          });
        }
      }
    },
    created() {

    }
  }
</script>

<style scoped>
  .v-modal {
    z-index: 1;
  }
</style>
