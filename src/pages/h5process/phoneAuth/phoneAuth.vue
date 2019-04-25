<template>
  <div id="phoneAuth">
    <div v-show="window=='phoneAuth'" @touchstart.stop="viewKey = false" style="width: 100%;height: 100%">
      <div class="phone">
        <span>{{ loginPhone | formatPhone }} 服务密码</span>
        <span class="eye" @touchstart.stop.prevent="pwdShow=!pwdShow">
          <img v-if="pwdShow" :src="require('@/assets/h5processImages/PhoneAuth/eye_open.png')" alt="">
          <img v-else :src="require('@/assets/h5processImages/PhoneAuth/eye_close.png')" alt="">
        </span>
      </div>
      <div class="pwdSize">
        <div class="imgWrap">
          <img v-if="pwdStatus==1" :src="require('@/assets/h5processImages/PhoneAuth/switch_pwd.png')"
               alt="" @touchstart.stop.prevent="setPwdState(2)">
          <img v-else-if="pwdStatus==2" :src="require('@/assets/h5processImages/PhoneAuth/switch_pwd.png')"
               alt="" @touchstart.stop.prevent="setPwdState(1)">
        </div>
      </div>
      <cell-pwd-input
        v-if="pwdStatus == 1"
        :pwdSize="pwdSize"
        :pwdShow="pwdShow"
        :viewKey.sync="viewKey"
        @change="pwdChange"
        @closeKeyboard="closeKeyboard"
      ></cell-pwd-input>
      <div v-else class="inputContainer">
        <input
          class="input"
          v-model="serviceCode"
          :type="inputType"
          maxlength=8
          placeholder="请输入您的手机服务密码"/>
      </div>
      <div class="tip">
        <p>温馨提示：</p>
        <p>
          1、请输入正确的运营商（移动、联通、电信）服务密码，如若忘记可点击<span class="link"
                                                 @click="$router.push({ name: 'ChangeServicePwd' })">修改服务密码</span>找回，或通过拨打<span
          class="link" @click="telLinkVisible=true">手机运营商客户电话</span>进行重置；
        </p>
        <p>2、一般服务密码为6位数字，部分运营商格式不同，请点击切换为全键盘输入；</p>
        <p>3、部分地区运营商可能需要输入两次服务密码；</p>
        <p>4、手机认证需要2~3分钟，请耐心等待。</p>
      </div>
      <base-button text='下一步' :type='submitButtonState' mt='.3rem' @click.native="nextClick(false)"></base-button>
      <tel-link :visible.sync="telLinkVisible"></tel-link>
    </div>
    <message-auth v-if="window=='messageAuth'" ref="messageAuth" :data="messageAuthData"
                  @messageAuth="messageAuth"></message-auth>
    <wait-moment :visible.sync="waitMomentVisible" content="认证需要2-3分钟，请耐心等待"></wait-moment>
    <message-box :visible.sync="authResultVisible" :content="authContent"></message-box>
  </div>
</template>

<script>
  import {mapActions, mapMutations, mapGetters} from 'vuex';
  import CellPwdInput from '@/components/h5process/phoneAuth/CellPwdInput';
  import TelLink from '@/components/h5process/phoneAuth/TelLink';
  import WaitMoment from '@/components/h5process/phoneAuth/WaitMoment';
  import MessageBox from '@/components/h5process/phoneAuth/MessageBox';
  import TextInput from "@/components/h5process/input/TextInput";
  import PasswordInput from "@/components/h5process/input/PasswordInput";
  import MessageAuth from "@/pages/h5process/phoneAuth/MessageAuth";
  import BaseButton from '@/components/h5process/base/BaseButton';

  import {OPEN_TOAST_STATE} from "@/store/commonModules/Toast/enum/mutationsEnum";
  import {GET_LOGIN_PHONE, PHONE_AUTH} from "@/store/h5processModules/phoneAuth/enum/action-types";
  import {LOGIN_PHONE, PHONE_AUTH_INFO} from "@/store/h5processModules/phoneAuth/enum/getter-types";

  export default {
    name: "phoneAuth",
    components: {
      MessageBox,
      PasswordInput,
      TextInput,
      CellPwdInput,
      TelLink,
      WaitMoment,
      MessageAuth,
      BaseButton
    },
    data() {
      return {
        window: 'phoneAuth',
        serviceCode: '',
        smsCode: '',
        pwdSize: 6, // 服务密码size
        pwdShow: true, // 是否显示服务密码
        pwdStatus: 1,
        viewKey: true, // 是否显示键盘
        telLinkVisible: false, // 是否显示联系电话弹框
        waitMomentVisible: false, // 是否显示等待动画
        isFromReAuth: false,  // 是否来自过期认证页
        authResultVisible: false,
        authContent: ''
      }
    },
    computed: {
      ...mapGetters({
        loginPhone: LOGIN_PHONE, // 用户手机
        phoneAuthInfo: PHONE_AUTH_INFO
      }),
      messageAuthData() {
        const data = {
          phone: this.loginPhone,
          serviceCode: this.serviceCode,
          isFromReAuth: this.isFromReAuth
        };
        return data;
      },
      inputType() {
        return this.pwdShow ? 'number' : 'password';
      },
      buttonActive() {
        if (this.pwdStatus == 1) {
          return this.serviceCode.length == this.pwdSize;
        } else {
          return this.serviceCode.length >= 6;
        }
      },
      submitButtonState() {
        return this.buttonActive ? 'yellow' : 'gray';
      }
    },
    watch: {
      phoneAuthInfo(data) {
        if (!data) {
          return;
        }
        this.waitMomentVisible = false;
        switch (data.status) {
          case 203:
            this.openToast({ text: data.desc });
            this.window = 'messageAuth';
            break;
          case 500:
            this.authContent = data.desc;
            if(data.desc == '密码错误次数超过上限，请明天再试'){
              this.authContent = "手机认证暂时锁定<br>服务密码错误超过上限，请明天再试";
            }
            this.authResultVisible = true;
            break;
          case 10003:
            let message = '';
            if(data.result == 0){
              message = '手机认证暂时锁定<br>服务密码错误超过上限，请明天再试';
            }else{
              message = '服务密码错误<br>还剩下<span style="color: #F33F3D;">' + data.result +'次</span>错误机会';
            }
            this.authContent = message;
            this.authResultVisible = true;
            this.window = 'phoneAuth';
            break;
          case 200:
            this.openToast({ text: '手机认证成功' });
            setTimeout(() => {
              this.$router.push({path: 'baseInfo'});
            }, 3000);
            break;
          default:
            console.log(data);
        }
      },
      inputType(val) {
        // console.log(val);
      }
    },
    methods: {
      ...mapMutations('Toast', {
        openToast: OPEN_TOAST_STATE
      }),
      ...mapActions({
        getLoginPhone: GET_LOGIN_PHONE,
        phoneAuth: PHONE_AUTH
      }),
      pwdChange(serviceCode) { // 获取更新填写的手机号
        this.serviceCode = serviceCode;
      },
      closeKeyboard() {
        this.viewKey = false;
      },
      setPwdState(status) {
        this.pwdStatus = status;
        switch (status) {
          case 1:
            this.pwdSize = 6;
            break;
          case 2:
            this.pwdSize = 8;
            break;
        }
        if (status == 2) {
          this.pwdSize = 8;
        } else if (status == 1) {
          this.pwdSize = 6;
        }
      },
      async nextClick(hideAnimation) {
        if (!this.buttonActive) {
          return;
        }
        const params = {
          phone: this.loginPhone,
          serviceCode: this.serviceCode,
          captcha: this.smsCode
        };
        if (!hideAnimation) {
          this.waitMomentVisible = true;
        }
        let data = await this.phoneAuth(params);
        return data.status;
      },
      messageAuth(data) {
        this.smsCode = data;
      }
    },
    async created() {
      await this.getLoginPhone();
    }
  }
</script>

<style scoped lang="scss">

  #phoneAuth {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    .phone {
      width: 100%;
      line-height: 0.25rem;
      text-align: center;
      padding-top: 0.3rem;
      font-size: 0.18rem;
      color: #000;
      vertical-align: middle;
      span {
        vertical-align: middle;
      }
      .eye {
        font-size: 0;
        img {
          width: 0.18rem;
          vertical-align: middle;
        }
      }
    }
    .pwdSize {
      width: 100%;
      text-align: center;
      padding: 0.1rem 0;
      .imgWrap {
        display: inline-block;
        img {
          width: 0.9rem;
        }
      }
    }
    .tip {
      padding: 0.3rem 0.2rem 0 0.15rem;
      font-size: 0.12rem;
      line-height: 0.17rem;
      color: #666;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      .link {
        color: #368eff;
      }
    }
  }

  .inputContainer {
    width: 70.6%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 0.52rem;
    border-bottom: 1px solid #c1c1c1;
  }

  .input {
    display: block;
    width: 100%;
    color: #000;
    font-size: 0.24rem;
    line-height: 0.24rem;
    background-color: transparent;
    border: none;
    outline: none;
    text-align: center;
  }

  .input::-webkit-input-placeholder {
    color: rgb(193, 193, 193);
    font-size: 0.16rem;
  }

</style>
