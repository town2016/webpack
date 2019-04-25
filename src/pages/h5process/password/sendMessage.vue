<!--短信验证-->
<template>
  <div id="messageAuth" class="container">
    <p class="titleTip">发送短信验证码到</p>
    <p class="phoneNumber">+86 {{ data.phone | formatPhone }}</p>
    <div class="form-row">
      <!--短信验证码-->
      <div class="smsDiv">
        <sms-code-input
          ref="smsCodeInput"
          label="验证码："
          :value="smsCode"
          @input="smsCodeInput"
          :totalTime="60"
          @btnClick="smsCodeBtnClick"
          :maxlength="6"
          placeholder="请输入验证码"
          type="tel">
        </sms-code-input>
      </div>
    </div>
    <!--提交按钮-->
    <base-button text='下一步' :type='submitButtonState' mt='.3rem' @click.native="submit"></base-button>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import {Indicator, Toast, MessageBox} from 'mint-ui';
  import SmsCodeInput from '@/components/h5process/input/SmsCodeInput';
  import BaseButton from '@/components/h5process/base/BaseButton';
  import TCaptcha from '@/components/h5process/common/TCaptcha';

  import { OPEN_TOAST_STATE } from "@/store/commonModules/Toast/enum/mutationsEnum";

  export default {
    name: 'messageAuth',
    props: {
      data: {
        type: Object,
        default: {},
      },
    },
    components: {
      SmsCodeInput,
      BaseButton,
      TCaptcha
    },
    data() {
      return {
        smsCode: '', // 短信验证码
      };
    },
    computed: {
      buttonActive() {
        return this.smsCode.length === 6;
      },
      submitButtonState() {
        return this.buttonActive ? 'yellow' : 'gray';
      }
    },
    methods: {
      ...mapMutations('Toast', {
        openToast: OPEN_TOAST_STATE
      }),
      async smsCodeBtnClick() {
        let data = await this.$parent.sendSmsCode();
        if(data.status == 200 || data.status == 203){
          this.startCountDown();
        }
      },
      startCountDown() {
        this.$refs.smsCodeInput.startCountDown();
      },
      smsCodeInput(smsCode) {
        this.smsCode = smsCode;
      },
      async submit() { // 提交操作
        if(!this.buttonActive){
          return;
        }
        this.$emit('messageAuth',this.smsCode);
      }
    }
  };
</script>

<style lang="scss">
  #messageAuth {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.6rem;
    line-height: 1;
    .titleTip {
      font-size: 0.14rem;
      color: #757575;
      padding: 0.3rem 0.15rem 0;
    }
    .phoneNumber {
      font-size: 0.26rem;
      padding: 0.14rem 0.15rem 0;
    }
    .form-row {
      margin-top: 0.25rem;
      .inputContainer {
        margin: 0 15px;
        .leftLabel {
          margin-left: 0;
        }
      }
    }
    .hairline {
      border-top: 1px solid rgb(231, 231, 231);
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      margin-left: 0.15rem;
    }
    > > > .inviteman-input .input {
      text-align: left;
      margin-right: 0.15rem !important;
    }
  }
</style>
