<!--修改服务密码-->
<template>
  <div class="container">
    <div v-show="window=='sendMessage'">
      <p class="title">忘记密码：</p>
      <p class="desc">请输入手机号获取验证码</p>
      <div class="form-row">
        <text-input
          class="phone-input"
          label="手机号: "
          placeholder="请输入手机号"
          :value="phone"
          @input="phoneInput"
          type="tel"
          :maxlength="11"
          :rightIcon="iconClose"
          @rightIconClick="clear"
        ></text-input>
      </div>
      <div class="form-row">
        <sms-code-input
          type="tel"
          ref="smsCodeInput"
          label="验证码: "
          :value="''"
          :totalTime="60"
          :maxlength="6"
          placeholder="请输入验证码"
          @input="smsCodeInput"
          @btnClick="smsCodeBtnClick"
        >
        </sms-code-input>
      </div>
      <t-captcha :show="showTCaptcha" ref="TCaptcha" class="form-group"></t-captcha>
      <!--提交按钮-->
      <base-button text='下一步' :type='submitButtonState' mt='.3rem' @click.native="nextStep(false)"></base-button>
    </div>
    <new-password
      v-show="window=='resetPwd'"
      ref="newPassword"
      :desc="desc"
      :placeholder="placeholder"
      :ruleReg="ruleReg"
      :maxlength=20
      :minlength=6
      @btnClick="resetPwd"
    ></new-password>
  </div>
</template>

<script>
  import md5 from 'md5';
  import IconClear from '@/assets/h5processImages/common/icon-close.png';
  import { mapActions, mapGetters, mapMutations} from 'vuex';
  import TextInput from '@/components/h5process/input/TextInput';
  import SmsCodeInput from "@/components/h5process/input/SmsCodeInput";
  import BaseButton from '@/components/h5process/base/BaseButton';
  import TCaptcha from '@/components/h5process/common/TCaptcha';
  import NewPassword from '@/components/h5process/common/NewPassword';
  import { OPEN_TOAST_STATE } from "@/store/commonModules/Toast/enum/mutationsEnum";
  import {
    SEND_SMS_CODE,
    GET_CAPTCHA_JS_URL,
    CHECK_SMS_CODE
  } from "@/store/h5processModules/smsCode/enum/action-types";
  import { RESET_PWD } from "@/store/h5processModules/password/enum/action-types";
  import { SET_CAPTCHA_TICKET } from "@/store/h5processModules/smsCode/enum/mutation-types";
  import {
    SMS_CODE_STATUS,
    CAPTCHA_JS_URL,
    CAPTCHA_TICKET,
    CHECK_SMS_CODE_TOKEN
  } from "@/store/h5processModules/smsCode/enum/getter-types";

  export default {
    name: 'forgetPwd',
    components: {
      TextInput,
      SmsCodeInput,
      BaseButton,
      TCaptcha,
      NewPassword
    },
    data() {
      return {
        window: 'sendMessage',
        iconClose: '',
        phone: '', // 显示的手机号码
        smsCode: '',// 验证码
        showTCaptcha: false,
        desc: '请设置新密码',
        placeholder: '密码为6~20位数字与字母组合',
        ruleReg: /^[0-9A-Za-z]{6,20}$/,
        pwdReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      };
    },
    computed: {
      ...mapGetters({
        smsCodeStatus: SMS_CODE_STATUS,
        captchaJsUrl: CAPTCHA_JS_URL,
        captchaTicket: CAPTCHA_TICKET,
        checkSmsCodeToken: CHECK_SMS_CODE_TOKEN,
      }),
      buttonActive() {
        const mobileReg = /^[1][0-9]{10}$/;
        if (!mobileReg.test(this.phone)) {
          return false;
        }
        if (this.smsCode.length !== 6) {
          return false;
        }
        return true;
      },
      submitButtonState() {
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
      smsCodeStatus(newVal) {
        if (newVal.status == 200) {
          this.$refs.smsCodeInput.startCountDown();
          this.showTCaptcha = false;
          this.$refs.TCaptcha.destroy();
        }else if(newVal.status == 500){
          this.showTCaptcha = false;
          this.$refs.TCaptcha.destroy();
          this.openToast({ text: newVal.desc });
        }
        if (newVal.desc == "请输入图形验证码") {
          if (this.captchaJsUrl.result == '') {
            this.getCaptchaJsUrl().then(() => {
              this.showTCaptcha = true;
              this.$refs.TCaptcha.refresh();
            });
          }else{
            this.showTCaptcha = true;
            this.$refs.TCaptcha.refresh();
          }
        }
      },
      captchaTicket(val) {
        if(val !== ''){
          this.smsCodeBtnClick();
        }
      }
    },
    methods: {
      ...mapMutations('Toast', {
        openToast: OPEN_TOAST_STATE
      }),
      ...mapActions({
        sendSmsCode: SEND_SMS_CODE,
        getCaptchaJsUrl: GET_CAPTCHA_JS_URL,
        checkSmsCode: CHECK_SMS_CODE,
        doResetPwd: RESET_PWD
      }),
      phoneInput(phone) {
        this.phone = phone;
      },
      clear() {
        this.phone = '';
      },
      smsCodeInput(smsCode) {
        this.smsCode = smsCode;
      },
      smsCodeBtnClick() {
        const mobileReg = /^[1][0-9]{10}$/;
        if (!mobileReg.test(this.phone)) {
          this.openToast({ text: '请输入正确的手机号码' });
          return;
        }
        let opts = {
          phone: this.phone,
          codeUse: 'resetPwd'
        };
        if (this.captchaTicket) {
          opts.validCode = this.captchaTicket;
        }
        this.sendSmsCode(opts);
      },
      async nextStep() {
        if(!this.buttonActive){
          return;
        }
        let params = {
          phone: this.phone,
          codeUse: 'resetPwd',
          smsCode: this.smsCode
        };
        await this.checkSmsCode(params);
        if(this.checkSmsCodeToken != ''){
          this.window = 'resetPwd';
        }
      },
      async resetPwd(password) {
        if(!this.pwdReg.test(password)){
          this.openToast({ text: '密码为6~20位数字与字母组合' });
          return;
        }
        let params = {
          phone: this.phone,
          pwd: md5(password),
          token: this.checkSmsCodeToken
        };
        let data = await this.doResetPwd(params);
        switch (data.status) {
          case 200:
            this.openToast({ text: data.result });
            setTimeout(()=>{
              if(data.result == '短信授权不通过'){
                this.window = 'sendMessage';
                return;
              }
              this.$router.back();
            },3000);
            break;
          case 203:
            this.openToast({ text: data.result });
            this.window = 'sendMessage';
            break;
          case 500:
            this.openToast({ text: data.result });
            break;
          default:
            console.log(data);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    .title {
      font-size: 0.26rem;
      line-height: 0.37rem;
      color: #212121;
      padding: 0.25rem 15px 0.05rem;
    }
    .desc {
      color: #757575;
      font-size: 0.14rem;
      line-height: 0.2rem;
      padding: 0 15px;
    }
    .form-row {
      margin-top: 0.15rem;
      padding: 0 15px;
      background-color: #fff;
      .inputContainer {
        border-bottom: 1px solid #c1c1c1;
        .leftLabel {
          margin-left: 0 !important;
        }
      }
    }
    .phone-input {
      margin-top: 0.4rem !important;
    }
  }
</style>
