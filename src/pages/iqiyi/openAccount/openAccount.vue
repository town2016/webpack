<!--添加银行卡-->
<template>
  <div id="addBankCard">
    <div class="cell firstCell">
      <!--持卡人-->
      <text-input
        label="持卡人"
        :value="bankCard.username"
        type="text"
        :maxlength="12"
        disabled
        >
      </text-input>
      <!--分割线-->
      <div class="line"></div>

      <!--银行卡号-->
      <text-input
        label="银行卡"
        :value="bankCard.cardno"
        type="number"
        :maxlength="19"
        disabled>
      </text-input>

      <!--分割线-->
      <div class="line"></div>

      <!--银行卡号-->
      <text-input
        label="开户行"
        :value="bankCard.bankname"
        :maxlength="19"
        disabled>
      </text-input>
    </div>

    <!--支持银行-->
    <p class="supportBanktips" @click="toSupportBankListPage">存管支持银行及限额说明<span>查看</span></p>

    <div class="cell cssCell" >
      <!--银行卡预留手机号-->
      <text-input
        label="银行卡预留手机号"
        :value="bankCard.phone"
        type="tel"
        :maxlength="11"
        disabled>
      </text-input>

      <!--分割线-->
      <div class="line" v-if="!bankCard.thirdQueryBind"></div>

      <!--短信验证码-->
      <sms-code-input
        v-if="!bankCard.thirdQueryBind"
        ref="smsCodeInput"
        label="验证码"
        :value="smsCode"
        @input="smsCodeInput"
        :totalTime="60"
        @btnClick="smsCodeBtnClick"
        :maxlength="6"
        type="text">
      </sms-code-input>

    </div>
    <!--首选还款账户设置按钮-->
    <!--<mt-cell v-if="firstAccountBtnShow" title="设为首选还款账户" class="addBtn" >-->
      <!--<mt-switch v-model="isFirstAccount"></mt-switch>-->
    <!--</mt-cell>-->

    <!--下一步按钮-->
    <div class="buttonContainer">
    	<mt-button
        class="button"
        size="large"
        type="primary"
        :disabled="isBtnDisabled || throttleBtn"
        @click.native="nextClick">绑定银行卡</mt-button>
    </div>

    <!--绑卡协议-->
    <p class="protocal">请仔细阅读本绑卡协议信息，点击”绑定银行卡“按钮表示你们同意遵守<span @click="toProtocal">《绑卡协议》</span></p>
    <router-link :to="{ name: $route.query.fromUrl }">{{$route.query.fromUrl}}</router-link>

  </div>
</template>

<script>
  import { Indicator, Toast } from 'mint-ui';
  // import Api from '@/api';
  import cookie from '@/utils/cookie';
  import { query } from '@/utils/common';
  // import store from '@/store'
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import TextInput from '@/components/iqiyi/input/TextInput';
  import LinkCell from '@/components/iqiyi/cell/LinkCell';
  // import ImageCompressor from 'image-compressor.js';
  import axios from 'axios';
  import { isBackFromCG, isWeixin, closeWeixinWindow, } from '@/utils/common';
  import storage from '@/utils/storage';
  import Picker from '@/components/Picker';
  import SmsCodeInput from '@/components/iqiyi/input/SmsCodeInput';


  import {
    GET_FIRST_REPAY_CARD,
    QUERY_BANK_SUPPORT_LIST,
    GET_PAY_TYPE,
    GET_SMS_CODE,
    BIND_BANK_CARD,
    THIRD_QUERY_BIND,
    GET_CARD_AGREEMENT
  } from '@/store/modules/bankCard/enum/actionsEnum'
  import {
    SET_BANK_SUPPORT_CHANNEL,
    SET_IS_THIRD_BIND
  } from '@/store/modules/bankCard/enum/mutationsEnum'
  import {
    OPEN_TOAST_STATE
  } from '@/store/commonModules/Toast/enum/mutationsEnum'
  import {
    BANK_CARD,
    BANK_SUPPORT_LIST,
    PAY_TYPE,
    BANK_SUPPORT_CHANNEL,
    BIND_CARD_CALLBACK_URL,
    IS_THIRD_BIND,
    SMS_CODE_SUCCESS,
    CARD_AGREEMENT
  } from '@/store/modules/bankCard/enum/gettersEnum'

  export default {
    name: 'addBankCard',
    data() {
      return {
        // username: '',
        cardNo: '',
        bankName: '',
        bankAccount: '',
        telPhone: '',
        smsCode: '', // 短信验证码
        popupVisible: false,
        banksList: [],
        throttleBtn: false
      };
    },
    computed: {
      ...mapGetters({
        bankCard: BANK_CARD, // 获取银行卡信息
        bankSupportList: BANK_SUPPORT_LIST, // 支持绑定银行列表
        payType: PAY_TYPE, // 付款类型
        channel: BANK_SUPPORT_CHANNEL, // 获取支持银行的渠道 1-连连 2-宝付
        bindCardCallbackUrl: BIND_CARD_CALLBACK_URL, // 广发银行回调url地址
        isThirdBind: IS_THIRD_BIND, // 校验第三方绑卡
        smsCodeSuccess: SMS_CODE_SUCCESS, // 是否成功获取短信验证码
        cardAgreement: CARD_AGREEMENT, // 绑卡协议链接url地址
      }),
      isBtnDisabled() {
        let bankCard = this.bankCard
        if(JSON.stringify(bankCard) !== '{}') {
          return !(bankCard.cardno.length && bankCard.bankname.length && bankCard.phone.length);
        } else {
          return false
        }
      },
      firstAccountBtnShow() {
        let data = this.$store.state.bankCard.bankCardList;
        return data && data.BindedCardList && data.BindedCardList.length;
      },
      slots() {
        let values = [];
        this.bankSupportList.map((obj, i) => {
        	let item = {
        		text: obj.bankName,
        		value: obj.bankCode,
        	};
          values.push(item);
        });
        return {
        	columns: 1,
          pData1: values,
        };
      },
    },
    components: {
      TextInput,
      LinkCell,
      Picker,
      SmsCodeInput,
    },
    async created() {
      cookie.set('sid', this.$route.query.token)
      // 获取银行卡信息
      await this.getFirstRepayCard();
    },
    beforeRouteEnter (to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      if (from.name === 'bankCardList') {
        next(vm => {
          vm.cardNo = '';
          vm.bankName = '';
        });
      }
      next();
    },
    watch: {
      bankSupportList(value) {
        console.log(value)
        this.$router.push({
          name: 'supportBankList',
          params: {
            bankSupportList: this.bankSupportList,
          },
          query: {
            token: this.$route.query.token
          }
        });
      },
      bindCardCallbackUrl(value) {
        setTimeout(() => {
          location.href = value;
        },3000)
      }
    },
    methods: {
      ...mapActions({
        getFirstRepayCard: GET_FIRST_REPAY_CARD,
        queryBankSupport: QUERY_BANK_SUPPORT_LIST,
        getPayType: GET_PAY_TYPE,
        getSmsCode: GET_SMS_CODE,
        addBankCard: BIND_BANK_CARD,
        thirdQueryBind: THIRD_QUERY_BIND,
        getCardAgreement: GET_CARD_AGREEMENT
      }),
      ...mapMutations({
        setIsThirdBind: SET_IS_THIRD_BIND,
        setChannel: SET_BANK_SUPPORT_CHANNEL
      }),
      ...mapMutations("Toast",{
        openToast: OPEN_TOAST_STATE,
      }),
      smsCodeInput(value) {
        this.smsCode = value;
      },
      async toSupportBankListPage() { // 跳转到支持银行列表页
        await this.getPayTypeHandler();
        await this.queryBankSupportHandler();
        // 在watch监听bankSupportList跳转到支持银行的列表
      },
      async getPayTypeHandler() { // 获取支付类型调度器
        await this.getPayType(); // 获取支付类型

        switch(Number(this.payType)) {
          case 1:
            return this.setChannel(1); // 支付开关返回1，则设置渠道1-连连
          default:
            return this.setChannel(2) // 其他情况，包括接口请求错误，都设置渠道2-宝付
        }

      },
      async queryBankSupportHandler() { // 获取支持银行卡列表调度器
        await this.queryBankSupport(this.channel); // 获取支持银行卡列表
      },
      toSupportBankList() {
        this.getPayType(() => {
          this.$router.push({
            name: 'supportBankList',
            params: {
              bankList: this.banksList,
            },
            query: {
              token: this.$route.query.token
            }
          });
        });
      },
      checkCardNum() {
        if (this.bankCard.cardno.length < 16 || this.bankCard.cardno.length > 19) {
          this.openToast({
            text: "银行卡号长度必须在16到19之间"
          });
          return false;
        }
        let num = /^\d*$/;  //全数字
        if (!num.exec(this.bankCard.cardno)) {
          this.openToast({
            text: "银行卡号必须全为数字"
          });
          return false;
        }
        return true;
      },
      async smsCodeBtnClick() { // 获取短信验证码
        let bankCard = this.bankCard;
        if (!bankCard.cardno) {
          this.openToast({
            text: '请先输入银行卡号'
          });
          return;
        }
        if (!bankCard.bankname) {
          this.openToast({
            text: '请先选择开户行'
          });
          return;
        }
        if (!bankCard.phone) {
          this.openToast({
            text: '请先输入手机号码'
          });
          return;
        }
        const regPhone = /^1\d{10}$/;
        if (!bankCard.phone.match(regPhone)) {
          this.openToast({ text: '请输入正确的手机号码' });
          return;
        }
        let checkCardNum = this.checkCardNum();
        if (!checkCardNum) return;
        let params = {
          bankAccount: bankCard.bankCode,
          bankname: bankCard.bankname,
          cardno: bankCard.cardno,
          mobile: bankCard.phone,
        }
        await this.getSmsCode(params)
        if(this.smsCodeSuccess) {
          this.$refs.smsCodeInput.startCountDown(); // 开始倒计时
          this.openToast({ text: '短信发送成功' })
        }
      },
      // 绑定银行卡
      async nextClick() {
        let checkCardNum = this.checkCardNum();
        if(!this.bankCard.thirdQueryBind && !this.smsCode) {
          this.openToast({ text: "请输入验证码" });
          return;
        }
        if (!checkCardNum) return;

        // 去广发银行的callbackUrl中只能带一个参数
        const token = query().token;
        // 设置广发跳回自己页面的url
        let url = `${location.origin}/openAccount?token=${token}`;
        let bankCard = this.bankCard;
        let params = {
          bankAccount: bankCard.bankCode,
          bankname: bankCard.bankname,
          cardno: bankCard.cardno,
          mobile: bankCard.phone,
          callbackUrl: decodeURIComponent(url),
          smsCode: this.smsCode
        }
        this.throttleBtn = true;
        await this.addBankCard(params);
        this.throttleBtn = false;
        // 如果有成功返回重定向url，在watch中监听bindCardCallbackUrl跳转
      },
      async toProtocal() {
        try {
          await this.getCardAgreement()
          this.$router.push({ name: 'contractDetail', query: { pdfUrl: this.cardAgreement, token: this.$route.query.token } });
        } catch(e) {
          console.log(e)
        }
      }
    }
  };
</script>

<style scope lang="scss">
#addBankCard {
  width: 100%;
  .mint-cell-wrapper {
    padding: 0 15px;
  }
  .firstCell{
    margin-top: 0.2rem;
  }
  .select {
    padding: 0 0.15rem 0 0.05rem;
    span {
    	flex: none;
    }
    p {
    	display: flex;
    	flex: 1;
    	padding-left: 0.15rem;
    }
  }
  .line {
    width: 100%;
    border: 0.5px solid #e7e7e7;
    margin-left: 15px;
  }
  .cell {
    background-color: #ffffff;
  }
  .supportBanktips {
    font-size: 13px;
    color: rgb(117, 117, 117);
    padding: 10px 15px;
    margin-bottom: 11px;

    span {
      color: #398efd;
    }
  }

  .addBtn {
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .buttonContainer {
		width: 100%;
		padding: 0 15px;
    margin-top: 0.3rem;

	  .button {
      height:0.45rem;
	    border-radius: 0.9rem;
      background: linear-gradient(to bottom,#0c7ee8, #0e87fd);
      background: -webkit-linear-gradient(bottom, #0c7ee8, #0e87fd); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(bottom, #0c7ee8, #0e87fd); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(bottom, #0c7ee8, #0e87fd); /* Firefox 3.6 - 15 */
    }
  }
  .protocal {
    font-size: 15px;
    margin: 20px 15px;
    color: rgb(117, 117, 117);
    span {
      color: #398efd;
    }
  }
  .popup {
    width: 100%;
  }
  .mint-field-clear {
    padding: 0 10px;
  }
  .rightIcon {
    width: 0.26rem;
  }
}
.mint-switch-input:checked + .mint-switch-core {
	border-color: #44db5e;
	background-color: #44db5e;
}
</style>
