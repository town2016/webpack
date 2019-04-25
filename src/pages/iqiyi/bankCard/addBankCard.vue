<!--添加银行卡-->
<template>
  <div id="addBankCard">
    <input type="file" id="inputFile" accept="image/*" @change="inputFileChange" style="display:none"/>
    <div class="cell firstCell">
      <!--持卡人-->
      <text-input
        label="持卡人"
        :value="1"
        type="text"
        :maxlength="12"
        disabled
        placeholder="请输入真实姓名"
        >
      </text-input>
      <!--分割线-->
      <div class="line"></div>

      <!--银行卡号-->
      <text-input
        label="银行卡"
        :value="cardNo"
        @input="cardNoInput"
        type="number"
        :maxlength="19"
        placeholder="仅支持储蓄卡"
        :rightIcon="require('@/assets/images/components/bankcard/icon_camera.png')"
        @rightIconClick="onClickCamera">
      </text-input>

      <!--分割线-->
      <div class="line"></div>

      <!--开户行-->
      <link-cell
        title="开户行"
        :value="bankName"
        :isLink="true"
        @click.native="selectBank"
        class="select"
      >
      </link-cell>
    </div>

    <!--支持银行-->
    <p class="supportBanktips" @click="toSupportBankList">存管支持银行及限额说明<span>查看</span></p>

    <div class="cell cssCell" >
      <!--银行卡预留手机号-->
      <text-input
        label="银行卡预留手机号"
        :value="telPhone"
        @input="phoneInput"
        type="tel"
        :maxlength="11"
        placeholder="请输入手机号">
      </text-input>

      <!--分割线-->
      <div class="line"
        v-if="!isThirdBind"></div>
      <!--短信验证码-->
      <sms-code-input
        v-if="!isThirdBind"
        ref="smsCodeInput"
        label="验证码"
        :value="smsCode"
        @input="smsCodeInput"
        :totalTime="60"
        @btnClick="smsCodeBtnClick"
        :maxlength="6"
        placeholder="请输入验证码"
        type="text">
      </sms-code-input>
    </div>
    <!--首选还款账户设置按钮-->
    <!--<mt-cell v-if="firstAccountBtnShow" title="设为首选还款账户" class="addBtn" >-->
      <!--<mt-switch v-model="isFirstAccount"></mt-switch>-->
    <!--</mt-cell>-->

    <!--下一步按钮-->
    <div class="buttonContainer">
    	<mt-button class="button" size="large" type="primary" :disabled="isBtnDisabled" @click.native="nextClick">下一步</mt-button>
    </div>

    <!--绑卡协议-->
    <p v-if="!isThirdBind" class="protocal">请仔细阅读本绑卡协议信息，点击”下一步“按钮表示你们同意遵守<span @click="toProtocal">《绑卡协议》</span></p>
    <router-link :to="{ name: $route.query.fromUrl }">{{$route.query.fromUrl}}</router-link>
    <!--开户行picker-->
    <picker
      :show="popupVisible"
      :selectData="slots"
      @cancel="pickerCancel"
      @confirm="pickerConfirm"
    />
  </div>
</template>

<script>
  import { Indicator, Toast } from 'mint-ui';
  // import Api from '@/api';
  import cookie from '@/utils/cookie';
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
    THIRD_QUERY_BIND
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
    // GF_CALLBACK_URL,
    IS_THIRD_BIND,
    SMS_CODE_SUCCESS
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
        isFirstAccount: true,
        popupVisible: false,
        banksList: [],
      };
    },
    computed: {
      ...mapGetters({
        bankSupportList: BANK_SUPPORT_LIST, // 支持绑定银行列表
        payType: PAY_TYPE, // 付款类型
        channel: BANK_SUPPORT_CHANNEL, // 获取支持银行的渠道 1-连连 2-宝付
        // GF_CallbackUrl: GF_CALLBACK_URL, // 广发银行回调地址
        isThirdBind: IS_THIRD_BIND, // 校验第三方绑卡
        smsCodeSuccess: SMS_CODE_SUCCESS // 是否成功获取短信验证码
      }),
      order() {
        return this.isFirstAccount ? 1 : 0;
      },
      isBtnDisabled() {
        if(this.isThirdBind){
          return !(this.cardNo.length && this.bankName.length && this.telPhone.length);
        }else{
          return !(this.cardNo.length && this.bankName.length && this.telPhone.length && this.smsCode.length);
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
    methods: {
      ...mapActions({
        queryBankSupport: QUERY_BANK_SUPPORT_LIST,
        getPayType: GET_PAY_TYPE,
        getSmsCode: GET_SMS_CODE,
        bindBankCard: BIND_BANK_CARD,
        thirdQueryBind: THIRD_QUERY_BIND
      }),
      ...mapMutations({
        setIsThirdBind: SET_IS_THIRD_BIND,
        setChannel: SET_BANK_SUPPORT_CHANNEL
      }),
      ...mapMutations("Toast",{
        openToast: OPEN_TOAST_STATE,
      }),
      async toSupportBankListPage() { // 跳转到支持银行列表页
        await this.getPayTypeHandler();
        await this.queryBankSupportHandler();
        console.log(this.bankSupportList)
        setTimeout(() => {
          this.$router.push({
            name: 'supportBankList',
            params: {
              bankSupportList: this.bankSupportList,
            },
            query: {
              token: this.$route.query.token
            }
          });
        }, 1000)

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
      async parseReceiptUrl(url) {
        try {
          Indicator.open();
          const data = await Api.bankCard.parseReceiptUrl(url);
          Indicator.close();
          if (data.status === 200) { // 成功

          } else if (data.desc) {  // 失败
            Toast(data.desc);
          }
        } catch (error) {
          Indicator.close();
          Toast(error);
          console.log(error);
        }
      },
      cardNoInput(value) {
        this.cardNo = value;
        this.bankName = '';
        this.bankAccount = '';
        this.setIsThirdBind(true);
        this.clearSmsCode();
      },
      async selectBank() {
        await this.getPayTypeHandler();
        await this.queryBankSupportHandler();
        this.popupVisible = true;
      },
      phoneInput(value) {
        this.telPhone = value;
        this.clearSmsCode();
      },
      smsCodeInput(value) {
        this.smsCode = value;
      },
      clearSmsCode() {
        if (this.smsCode) {
          this.smsCode = '';
        }
      },
      async smsCodeBtnClick() { // 获取短信验证码
        if (!this.cardNo) {
          Toast('请先输入银行卡号');
          return;
        }
        if (!this.bankName) {
          Toast('请先选择开户行');
          return;
        }
        if (!this.telPhone) {
          Toast('请先输入手机号码');
          return;
        }
        const regPhone = /^1\d{10}$/;
        if (!this.telPhone.match(regPhone)) {
          Toast('请输入正确的手机号码');
          return;
        }
        let checkCardNum = this.checkCardNum();
        if (!checkCardNum) return;
          let params = {
            bankAccount: this.bankAccount,
            bankname: this.bankName,
            cardno: this.cardNo,
            mobile: this.telPhone,
          }
        await this.getSmsCode(params)
        if(this.smsCodeSuccess) {
          this.$refs.smsCodeInput.startCountDown(); // 开始倒计时
          Toast('短信发送成功')
        }
      },
      pickerCancel() {
      	this.popupVisible = false;
      },
      pickerConfirm(value) {
      	this.popupVisible = false;
      	this.bankName = value.select1 ? value.select1.text : '';
        this.bankAccount = value.select1 ? value.select1.value : '';
        this.clearSmsCode();
        this.thirdQueryBindHandler();
      },
      async thirdQueryBindHandler() {
        if(!(this.bankName && this.cardNo&&this.cardNo.length>=15&&this.cardNo.length<=19) ){
          if(this.cardNo&&(!(this.cardNo.length>=15&&this.cardNo.length<=19))){
            Toast('请输入正确格式的银行卡号')
          }
          return;
        }
        let params = {
          bankAccount: this.bankAccount,
          bankname: this.bankName,
          cardno: this.cardNo,
        }
        try {
          this.thirdQueryBind(params)
        } catch(e) { Toast(e.desc || '第三方绑卡校验失败') }
      },
      onClickCamera() {
        document.getElementById('inputFile').click();
      },
      inputFileChange(event) {
          let file = event.target.files[0];
          // 压缩图片
          Indicator.open();
          const imageCompressor = new ImageCompressor();
          imageCompressor.compress(file, { quality: .5 })
          .then((result) => {
            console.log(result);
            // 将数据放到formData中
            const formData = new FormData();
            formData.append('file', result, result.name);
            // 调用OCR识别接口
            const url = process.env.NODE_ENV === 'development' ? '/api_service/ocr/bankcard' : '/ocr/bankcard';  // OCR请求API地址
            axios.post(url, formData)
            .then((response) => response.data)
            .then((response) => {
              document.getElementById('inputFile').value = '';  // 清空inut file的内容
              Indicator.close();
              console.log(response);
              if (response.status === 'OK') { // 识别成功
                if (response.result) {
                  this.cardNo = response.result.card_number.replace(/\s/g, '');  // 银行卡号
                } else {
                  Toast('识别失败，请上传清晰、真实银行卡图片');
                }
              } else if (response.status === 'IMAGE_FILE_SIZE_TOO_BIG') {
                Toast('图片体积过大');
              } else if (response.status === 'INVALID_IMAGE_FORMAT_OR_SIZE') {
                Toast('图片大小或格式不符合要求');
              } else if (response.status === 'INTERNAL_ERROR') {
                Toast('服务器内部错误');
              }
            })
            .catch((error) => {
              document.getElementById('inputFile').value = '';  // 清空inut file的内容
              Indicator.close();
              console.log(error);
            });
          })
          .catch((err) => {
            // 处理失败会执行
            document.getElementById('inputFile').value = '';  // 清空inut file的内容
            Indicator.close();
            Toast('压缩图片失败，请重新选择图片');
            console.log(err);
          });
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
      getBankCode(name) {
        for (let i = 0; i < this.banksList.length; i++) {
          if (this.banksList[i].bankName === name) {
            return this.banksList[i].bankCode;
          }
        }
        return '';
      },
      checkCardNum() {
        if (this.cardNo.length < 16 || this.cardNo.length > 19) {
          Toast("银行卡号长度必须在16到19之间");
          return false;
        }
        let num = /^\d*$/;  //全数字
        if (!num.exec(this.cardNo)) {
          Toast("银行卡号必须全为数字");
          return false;
        }
        return true;
      },
      async getSupportBankList(channel, callback) {
        try {
          Indicator.open();
          const data = await Api.bankCard.queryBankSupportList(channel);
          Indicator.close();
          if (data.status === 200) { // 成功
            if (data.result.length) {
              this.banksList = data.result;
              // this.bankFullNameList = this._getBankList(this.banksList);
              if (callback) {
                callback();
              }
            } else {
              Toast('支持的银行列表为空');
            }
          } else {  // 失败
            let desc = data.desc ? data.desc : "未获取到支持的银行列表";
            Toast(desc);
          }
        } catch (error) {
          Indicator.close();
          Toast(error);
          console.log(error);
        }
      },
      async nextClick() {
        let checkCardNum = this.checkCardNum();
        if (!checkCardNum) return;

        try {

          let callbackUrl = location.href;
          // 去广发银行的callbackUrl中只能带一个参数
          let url = this.$route.query.url
          url = url ? url.split('&')[0] : location.origin;
          if(!/touna.cn/.test(url)) {
            url += '#/userCard';
          }
          let params = {
            bankAccount: this.bankAccount,
            bankname: this.bankName,
            cardno: this.cardNo,
            mobile: this.telPhone,
            smsCode: this.smsCode || '123456',
            callbackUrl: decodeURIComponent(url),
          }
          await this.bindBankCard(params)
          return;
          location.href = this.GF_CallbackUrl;
        } catch (error) {
          Indicator.close();
          Toast(error);
          console.log(error);
        }
      },
      async getBindCG() {
        try {
          Indicator.open();
          let bankInfo = {
            bankAccno: this.cardNo,
            bankAccount: this.bankAccount,
            mobile: '',
          };
          let callbackUrl = location.href;
          const data = await Api.bankCard.getBindBankCardHttpRequestUrl(bankInfo, callbackUrl);
          Indicator.close();
          if (data.status === 200 && data.result) { // 成功
            location.href = data.result;
          } else {  // 失败
            let desc = data.desc ? data.desc : '没有获取到第三方绑卡链接';
            Toast(desc);
          }
        } catch (error) {
          Indicator.close();
          Toast(error);
          console.log(error);
        }
      },
      async toProtocal() {
        try {
          Indicator.open();
          const data = await Api.bankCard.getCardAgreement();
          Indicator.close();
          if (data.status === 200 && data.result && data.result.pdfSignUrl) { // 成功
            this.$router.push({ name: 'webview', query: { href: data.result.pdfSignUrl, token: this.$route.query.token } });
          } else {  // 失败
            let desc = data.desc ? data.desc : '没有获取到绑卡协议链接';
            Toast(desc);
          }
        } catch (error) {
          Indicator.close();
          Toast(error);
          console.log(error);
        }
      },
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
      color: #F7A206;
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
