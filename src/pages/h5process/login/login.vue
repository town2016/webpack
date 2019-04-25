<!-- 登录-密码登录 -->
<template>
  <div class="container">
    <div class="logo"></div>
    <!-- 用户名输入框 -->
    <text-input class="login-field" label="手机号" :value="phone" @input="phoneInput" type="tel" :maxlength="11" placeholder="请输入手机号" :rightIcon="iconClose" @rightIconClick="clear"></text-input>
    <div class="hairline"></div>
    <!-- 密码输入框 -->
    <password-input class="login-field m-t-15" label="密码" :rightIconInvisible="iconVisible" :rightIconVisible="iconInvisible" :value="pwd" @input="pwdInput" :maxlength="20" placeholder="请输入密码" inputType="password"></password-input>
    <div class="hairline"></div>
    <!-- 登录按钮 -->
    <base-button text='登录' :type='loginButtonStatus' mt='.45rem' @click.native="login"></base-button>
    <div class="user-switch">
      <router-link class="login-link fz-px-14" :to="{ path: '/forgetPwd' }">
        忘记密码
      </router-link>
      <div class="vertical-line"></div>
      <router-link class="login-link fz-px-14" :to="{ path: '/register', query: query }">
        立即注册
      </router-link>
    </div>
    <t-captcha :show="showTCaptcha" ref="TCaptcha"></t-captcha>
  </div>
</template>

<script>
import md5 from 'md5';
import { query } from '@/utils/common';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { MessageBox } from 'mint-ui';

import IconClear from '@/assets/h5processImages/common/icon-close.png';
import IconInvisible from '@/assets/h5processImages/input/invisiblepassword.png';
import IconVisible from '@/assets/h5processImages/input/visiblepassword.png';
import TextInput from '@/components/h5process/input/TextInput';
import PasswordInput from '@/components/h5process/input/PasswordInput';
import BaseButton from '@/components/h5process/base/BaseButton';
import TCaptcha from '@/components/h5process/common/TCaptcha';

import { OPEN_TOAST_STATE } from "@/store/commonModules/Toast/enum/mutationsEnum";
import { LOGIN,EXIT_LOGIN_IN } from "@/store/h5processModules/login/enum/action-types";
import { GET_PROCESS_INFO } from "@/store/h5processModules/redirect/enum/action-types";
import { PROCESS_INFO } from "@/store/h5processModules/redirect/enum/getter-types";
import { SET_BASE_INFO } from "@/store/commonModules/Reference/enum/actionsEnum";
import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";
import {
  SEND_SMS_CODE,
  GET_CAPTCHA_JS_URL
} from "@/store/h5processModules/smsCode/enum/action-types";
import {
  CAPTCHA_JS_URL,
  CAPTCHA_TICKET
} from "@/store/h5processModules/smsCode/enum/getter-types";

export default {
  name: 'login',
  components: {
    TextInput,
    PasswordInput,
    BaseButton,
    TCaptcha
  },
  data() {
    return {
      phone: '', // 用户名
      pwd: '', // 密码
      iconClose: '', // 输入框删除图标
      iconInvisible: IconInvisible, // 密码图标
      iconVisible: IconVisible, // 密码图标
      query: '',
      showTCaptcha: false,
      baseConfig: {}
    };
  },
  computed: {
    ...mapGetters({
      processInfo: PROCESS_INFO,
      captchaJsUrl: CAPTCHA_JS_URL,
      captchaTicket: CAPTCHA_TICKET
    }),
    ...mapGetters('Reference', {
      baseOriginInfo: 'baseOriginInfo'
    }),
    buttonActive() {
      const mobileReg = /^[1][0-9]{10}$/;
      return mobileReg.test(this.phone) && this.pwd.length >= 6;
    },
    loginButtonStatus() {
      return this.buttonActive ? 'yellow' : 'gray';
    }
  },
  watch: {
    phone(newVal) {
      if (newVal != '') {
        this.iconClose = IconClear;
      } else {
        this.iconClose = '';
      }
    },
    captchaTicket(val) {
      if (val !== '') {
        this.login();
      }
    },
    loginButtonStatus(newVal) {
      // console.log(newVal);
    }
  },
  methods: {
    ...mapMutations('Toast', {
      openToast: OPEN_TOAST_STATE
    }),
    ...mapActions({
      getProcessInfo: GET_PROCESS_INFO,
      getCaptchaJsUrl: GET_CAPTCHA_JS_URL,
      getConfig: GET_CONFIG
    }),
    ...mapActions('login', {
      doLogin: LOGIN,
      exitLogin: EXIT_LOGIN_IN
    }),
    ...mapActions('Reference', {
      setBaseInfo: SET_BASE_INFO
    }),
    phoneInput(val) {
      this.phone = val;
    },
    pwdInput(val) {
      this.pwd = val;
    },
    clear() {
      this.phone = '';
    },
    async login(e) {
      this.$nextTick(()=>{
        e.target.scrollIntoView(true);
      },100);
      if (!this.buttonActive) {
        return;
      }
      let params = {
        phone: this.phone,
        pwd: md5(this.pwd)
      };
      if (this.captchaTicket) {
        params.validCode = this.captchaTicket;
      }
      let data = await this.doLogin(params);
      if(!data || !data.status){
        this.openToast({
          text: '服务器开小差,请稍后重试'
        });
        return;
      }
      if (data.status == 200) {
        this.showTCaptcha = false;
        this.$refs.TCaptcha.destroy();
        if (data.result && data.result.sid) {
          localStorage && localStorage.clear();
          let { fromUrl = '' } = this.baseOriginInfo;
          this.setBaseInfo({ token: data.result.sid });
          if (fromUrl) {
            location.replace(fromUrl);
          } else {
            this.getProcessInfo();
          }
        }
      }
      if (data.status == 203) {
        if (this.captchaJsUrl.result == '') {
          this.getCaptchaJsUrl().then(() => {
            this.showTCaptcha = true;
            this.$refs.TCaptcha.refresh();
          });
        } else {
          this.showTCaptcha = true;
          this.$refs.TCaptcha.refresh();
        }
      }
      if (data.status == 500) {
        this.showTCaptcha = false;
        this.$refs.TCaptcha.destroy();
        this.openToast({
          text: data.desc
        });
      }
      if (data.status == 401) {
        if(this.baseConfig.channelPermission.length == 2 && this.baseConfig.channelPermission[1] == 'home'){
          MessageBox.alert('抱歉，该入口仅提供还款功能');
        }else{
          MessageBox.alert('您已申请过该产品');
        }
        this.exitLogin();
      }
    }
  },
  async mounted() {
    let mobile = this.$route.query.mobile;
    const mobileReg = /^[1][0-9]{10}$/;
    if (mobileReg.test(mobile)) {
      this.phone = mobile;
    }
    this.baseConfig = await this.getConfig();
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.logo {
  margin: 0.4rem auto 0.14rem;
  width: 0.92rem;
  height: 0.92rem;
  @include bg-image('~@/assets/h5processImages/common/logo');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.login-field {
  padding: 0 0.25rem;
}

.link-forget-password {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  padding: .15rem;
}

.hairline {
  border-top: 1px solid #E3E3E3;
  margin: 0 0.25rem;
}

.user-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.27rem;
}

.vertical-line {
  margin: 0 0.16rem;
  width: 1px;
  height: 0.18rem;
  background: #e3e3e3;
}

.login-link {
  color: #757575;
}

.yellow {
  color: #631700 !important;
}

.inputContainer .rightIcon {
  height: 0.22rem !important;
}
</style>
