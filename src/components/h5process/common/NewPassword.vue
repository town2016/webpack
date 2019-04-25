<!--修改服务密码-->
<template>
  <div class="container">
    <p class="title">新密码：</p>
    <p class="desc">{{desc}}</p>
    <div class="form-row">
      <password-input
        :value="password"
        @input="passwordInput"
        label="新密码："
        :minlength:="minlength"
        :maxlength="maxlength"
        :placeholder="placeholder"
        inputType="password"
      ></password-input>
    </div>
    <!--提交按钮-->
    <base-button text='下一步' :type='submitButtonState' mt='.3rem' @click.native="nextStep"></base-button>
  </div>
</template>

<script>
  import PasswordInput from '@/components/h5process/input/PasswordInput';
  import BaseButton from '@/components/h5process/base/BaseButton';

  export default {
    name: 'changeServicePwd',
    components: {
      PasswordInput,
      BaseButton
    },
    props: {
      desc: {
        type: String,
        default: '密码为6位数字，若修改失败请尝试8位数字'
      },
      placeholder: {
        type: String,
        default: '请输入6位数字'
      },
      ruleReg: {
        type: RegExp
      },
      maxlength: Number,
      minlength :Number
    },
    data() {
      return {
        password: '' // 密码
      };
    },
    computed: {
      buttonActive() {
        return this.ruleReg.test(this.password);
      },
      submitButtonState() {
        return this.buttonActive ? 'yellow' : 'gray';
      }
    },
    methods: {
      passwordInput(password) {
        this.password = password;
      },
      nextStep() {
        if(this.buttonActive){
          this.$emit('btnClick',this.password)
        }
      }
    }
  };
</script>

<style lang="scss"scoped>
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    .title{
      font-size: 0.26rem;
      line-height: 0.37rem;
      color: #212121;
      padding: 0.25rem 15px 0.05rem;
    }
    .desc{
      color: #757575;
      font-size: 0.14rem;
      line-height: 0.2rem;
      padding:0 15px;
    }
    .form-row {
      margin-top: 0.4rem;
      background-color: #fff;
      .inputContainer{
        margin: 0 15px;
        border-bottom: 1px solid rgb(231,231,231);
        .leftLabel{
          margin-left: 0;
        }
      }
    }
  }
</style>
