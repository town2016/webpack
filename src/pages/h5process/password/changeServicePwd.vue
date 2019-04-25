<!--修改服务密码-->
<template>
  <div class="container">
    <send-message
      v-if="window=='sendMessage'"
      ref="messageAuth"
      :data="messageAuthData"
      @messageAuth="messageAuth">
    </send-message>
    <new-password
      v-if="window=='newPassword'"
      ref="newPassword"
      :ruleReg="ruleReg"
      :maxlength=20
      :minlength=6
      @btnClick="changeServicePwd"
    ></new-password>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {Indicator, Toast} from 'mint-ui';
  import SendMessage from "@/pages/h5process/password/sendMessage";
  import NewPassword from '@/components/h5process/common/NewPassword';
  import {GET_LOGIN_PHONE} from "@/store/h5processModules/phoneAuth/enum/action-types";
  import {LOGIN_PHONE} from "@/store/h5processModules/phoneAuth/enum/getter-types";
  import {RESET_SERVICE_PASSWORD} from "@/store/h5processModules/phoneAuth/enum/action-types";

  export default {
    name: 'changeServicePwd',
    components: {
      SendMessage,
      NewPassword
    },
    data() {
      return {
        window: 'sendMessage',
        ruleReg: /^[0-9]{6,8}$/,
        captcha: '',
        password: ''
      }
    },
    computed: {
      ...mapGetters({
        loginPhone: LOGIN_PHONE, // 用户手机
      }),
      messageAuthData() {
        const data = {
          phone: this.loginPhone,
          buttonText: '下一步'
        };
        return data;
      }
    },
    methods: {
      ...mapActions({
        getLoginPhone: GET_LOGIN_PHONE,
        resetServicePassword: RESET_SERVICE_PASSWORD
      }),
      messageAuth(data) {
        this.captcha = data;
        this.window = 'newPassword';
      },
      async sendSmsCode() {
        const params = {
          password: '',
          captcha: '',
          type: 'RESEND_RESET_PWD_CAPTCHA'
        };
        let data = await this.resetServicePassword(params);
        switch (data.status) {
          case 500:
          case 203:
            Toast(data.desc);
            break;
          case 200:
            console.log(data);
            break;
          default:
            console.log(data);
        }
        return data;
      },
      async changeServicePwd(pwd) {
        const params = {
          password: pwd,
          captcha: this.captcha,
          type: 'SUBMIT_RESET_PWD'
        };
        let data = await this.resetServicePassword(params);
        console.log(data);
        switch (data.status) {
          case 500:
            Toast(data.desc);
            if(data.desc == "设置失败短信验证码已超时，请重新获取"){
              this.window = 'sendMessage';
            }
            break;
          case 203:
            this.window = 'sendMessage';
            break;
          case 200:
            this.$router.back();
            break;
          default:
            console.log(data);
        }
      }
    },
    async created() {
      await this.getLoginPhone();
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
  }
</style>
