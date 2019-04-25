<template>
  <div class="container">
    <div class="form">
      <register-text-input
        v-model="phone"
        type="tel"
        placeholder="请输入手机号码"
        :maxlength="11"
        class="form-group"
      ></register-text-input>
      <register-text-input
        v-model="pwd"
        type="password"
        placeholder="6~20位数字与字母组合"
        :maxlength="20"
        :minlength="6"
        class="form-group"
      ></register-text-input>
      <register-sms-code-field
        class="form-group sms-form-group"
        type="tel"
        placeholder="请输入验证码"
        v-model="smsCode"
        :maxlength="6"
        :timeTotal="60"
        @getSmsCodeHandler="getSmsCodeHandler"
      ></register-sms-code-field>
      <div class="contract fz-px-14">
        <div class="contract-inner">
          <div class="contract-confirm">
            <div class="icon-check" v-show="isChecked" @click="setChecked(false)"></div>
            <div class="icon-uncheck" v-show="!isChecked" @click="setChecked(true)"></div>
          </div>
          <span>阅读并同意</span>
          <router-link :to="{ path: '/protocolRegister' }">《注册协议》</router-link>
          <router-link :to="{ path: '/login' }" class="login">切换登录</router-link>
        </div>
      </div>
      <div class="form-group btn-register">
        <base-button text="立即注册" :type="registerButtonStatus" @click.native="register"></base-button>
      </div>
    </div>
    <div class="tips-wrap tips-desc">
      <p class="tips fz-px-22">受个人情况影响，额度与到账时间以实际情况为准</p>
    </div>
    <t-captcha :show="showTCaptcha" ref="TCaptcha"></t-captcha>
  </div>
</template>

<script>
import md5 from "md5";
import { MessageBox } from "mint-ui";
import { query } from "@/utils/common";
import { mapActions, mapGetters, mapMutations } from "vuex";
import registerTextInput from "@/components/h5process/register/registerTextInput";
import registerSmsCodeField from "@/components/h5process/register/registerSmsCodeField";
import BaseButton from "@/components/h5process/base/BaseButton";
import TCaptcha from "@/components/h5process/common/TCaptcha";
import { OPEN_TOAST_STATE } from "@/store/commonModules/Toast/enum/mutationsEnum";
import { REGISTER } from "@/store/h5processModules/register/enum/action-types";
import {
  SEND_SMS_CODE,
  GET_CAPTCHA_JS_URL
} from "@/store/h5processModules/smsCode/enum/action-types";
import {
  SMS_CODE_STATUS,
  CAPTCHA_JS_URL,
  CAPTCHA_TICKET
} from "@/store/h5processModules/smsCode/enum/getter-types";

import { GET_PROCESS_INFO } from "@/store/h5processModules/redirect/enum/action-types";
import { SET_BASE_INFO } from "@/store/commonModules/Reference/enum/actionsEnum";

export default {
  name: "Register",
  data() {
    return {
      phone: "",
      pwd: "",
      smsCode: "",
      validCode: "",
      isChecked: true,
      smsCodeCb: null,
      showTCaptcha: false
    };
  },
  components: {
    registerSmsCodeField,
    registerTextInput,
    BaseButton,
    TCaptcha
  },
  computed: {
    ...mapGetters("Reference", {
      baseOriginInfo: "baseOriginInfo"
    }),
    ...mapGetters({
      smsCodeStatus: SMS_CODE_STATUS,
      captchaJsUrl: CAPTCHA_JS_URL,
      captchaTicket: CAPTCHA_TICKET
    }),
    buttonActive() {
      const mobileReg = /^[1][0-9]{10}$/;
      if (!mobileReg.test(this.phone)) {
        return false;
      }
      if (this.pwd.length == 0) {
        return false;
      }
      if (this.smsCode.length == 0) {
        return false;
      }
      if (!this.isChecked) {
        return false;
      }
      return true;
    },
    registerButtonStatus() {
      return this.buttonActive ? "orange-yellow" : "gray";
    }
  },
  watch: {
    registerButtonStatus(newVal, oldVal) {
      // console.log(newVal, oldVal);
    },
    smsCodeStatus(newVal) {
      if (newVal.status == 200) {
        if (this.smsCodeCb) {
          this.smsCodeCb();
        }
        this.showTCaptcha = false;
        this.$refs.TCaptcha.destroy();
      } else if (newVal.status == 500) {
        this.showTCaptcha = false;
        this.$refs.TCaptcha.destroy();
      }
      if (newVal.desc == "请输入图形验证码") {
        if (this.captchaJsUrl.result == "") {
          this.getCaptchaJsUrl().then(() => {
            this.showTCaptcha = true;
            this.$refs.TCaptcha.refresh();
          });
        } else {
          this.showTCaptcha = true;
          this.$refs.TCaptcha.refresh();
        }
      }
    },
    captchaTicket(val) {
      if (val !== "") {
        this.getSmsCodeHandler(this.smsCodeCb);
      }
    }
  },
  methods: {
    ...mapMutations("Toast", {
      openToast: OPEN_TOAST_STATE
    }),
    ...mapActions({
      doRegister: REGISTER,
      sendSmsCode: SEND_SMS_CODE,
      getCaptchaJsUrl: GET_CAPTCHA_JS_URL,
      getProcessInfo: GET_PROCESS_INFO
    }),
    ...mapActions("Reference", {
      setBaseInfo: SET_BASE_INFO
    }),
    getSmsCodeHandler(callback) {
      const mobileReg = /^[1][0-9]{10}$/;
      if (!mobileReg.test(this.phone)) {
        this.openToast({
          text: "请输入正确的手机号码"
        });
        return;
      }
      let opts = {
        phone: this.phone,
        codeUse: "register"
      };
      if (this.captchaTicket) {
        opts.validCode = this.captchaTicket;
      }
      this.smsCodeCb = callback;
      this.sendSmsCode(opts);
    },
    setChecked(isChecked) {
      // 勾选注册协议
      this.isChecked = isChecked;
    },
    async register() {
      if (!this.buttonActive) {
        return;
      }
      const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!pwdReg.test(this.pwd)) {
        this.openToast({
          text: "密码为6~20位数字与字母组合"
        });
        return;
      }
      if (this.smsCode.length !== 6) {
        this.openToast({
          text: "验证码格式错误"
        });
        return;
      }
      let urlParams = this.baseOriginInfo;
      // 发送注册请求
      let params = {
        phone: this.phone,
        pwd: md5(this.pwd),
        smsCode: this.smsCode,
        utm_source: this.$route.query.utm_source || urlParams.utmSource || "",
        appId: this.$route.query.appId || urlParams.appId || "",
        thirdUid: this.$route.query.uid || urlParams.uid || "",
        invitationCode: this.$route.query.invitationCode || ""
      };
      let data = await this.doRegister(params);
      if (!data || !data.status) {
        this.openToast({
          text: "服务器开小差,请稍后重试"
        });
        return;
      }
      if (data.status == 200) {
        if (data.result === "手机号码已存在, 请重新输入") {
          MessageBox.confirm("", {
            message: "该手机号已注册, 请直接登录",
            title: "提示",
            confirmButtonText: "去登录",
            cancelButtonText: "取消"
          })
            .then(action => {
              if (action == "confirm") {
                //确认的回调,跳转登录
                this.$router.push({ path: "/login" });
              }
            })
            .catch(e => {});
          return;
        }
        if (data.result === "短信验证码错误,请重新输入") {
          this.openToast({
            text: "短信验证码错误"
          });
          return;
        }
        if (data.result == "验证码已过期") {
          this.openToast({
            text: data.result
          });
          return;
        }
        if (data.result && data.result.sid) {
          localStorage && localStorage.clear();
          let { fromUrl = "" } = this.baseOriginInfo;
          this.setBaseInfo({ token: data.result.sid });
          if (fromUrl) {
            location.replace(fromUrl);
          } else {
            this.getProcessInfo();
          }
        }
      }
      if (data.status == 203) {
        MessageBox.confirm("", {
          message: "恭喜您已注册成功",
          title: "提示",
          confirmButtonText: "去登录",
          cancelButtonText: "取消"
        })
          .then(action => {
            if (action == "confirm") {
              //确认的回调,跳转登录
              this.$router.push({ path: "/login" });
            }
          })
          .catch(e => {});
      }
    }
  },
  created() {
    let mobile = this.$route.query.mobile;
    const mobileReg = /^[1][0-9]{10}$/;
    if (mobileReg.test(mobile)) {
      this.phone = mobile;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  @include bg-image("~@/assets/h5processImages/register/bg");
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f3a932;
  min-height: 100%;
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .container {
    background-size: contain;
  }
}
.form {
  margin: 3.03rem 0.15rem 0;
  padding: 0.1rem 0.15rem 0.23rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.1rem;
}

.form-group {
  margin-top: 0.2rem;
}

.sms-form-group {
  border-bottom: none !important;
}

.contract {
  margin-top: 0.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.12rem;
  color: #fff;
}

.contract-inner {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  a {
    font-size: 0.13rem;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    cursor: pointer;
    &:visited,
    &:hover,
    &:link,
    &:active {
      color: #fff;
    }
  }
  a.login {
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    &:visited,
    &:hover,
    &:link,
    &:active {
      color: #fff;
    }
  }
}

.contract-confirm {
  display: flex;
  margin-right: 0.08rem;
  width: 0.16rem;
  height: 0.16rem;
}

.icon-check,
.icon-uncheck {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.icon-check {
  @include bg-image("~@/assets/h5processImages/register/icon-checked");
}
.icon-uncheck {
  @include bg-image("~@/assets/h5processImages/register/icon-unchecked");
}
.btn-register .button {
  width: 100%;
}
.tips-desc {
  margin-top: 0.04rem;
  height: 0.3rem;
}
.tips-wrap {
  width: 200%;
  transform: translateX(-25%) scale(0.5);
}
.tips {
  text-align: center;
  color: #fff;
}
.tips-wrap > .tips + .tips {
  margin-top: 6px;
}
.footer {
  position: absolute;
  bottom: 0;
}
</style>
