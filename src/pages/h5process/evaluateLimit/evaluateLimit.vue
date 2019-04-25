<template>
  <div class="container">
    <navigation-bar index=2></navigation-bar>

    <div
      class="evaluating"
      v-if="drawDepositInfo.code === 'in_process' && !overOneMin"
    >
      <div class="evaluating-animate">
        <div class="animate-con">
          <img
            class="getlimit-con-bg"
            :style="{transform: 'rotate('+degree+'deg)', '-ms-transform': 'rotate('+degree+'deg)', '-webkit-transform': 'rotate('+degree+'deg)', '-o-transform': 'rotate('+degree+'deg)','-moz-transform': 'rotate('+degree+'deg)'}"
            :src="require('@/assets/h5processImages/evaluateLimit/circle00@2x.png')"
          >
          <img
            class="getlimit-con-item"
            :src="require('@/assets/h5processImages/evaluateLimit/jinxiang@2x.png')"
          >
        </div>
      </div>
      <p class="evaluating-tips">额度评估中</p>
      <p class="evaluating-info">预计需要30秒，请耐心等候</p>
    </div>

    <div
      class="getlimit item-container"
      v-if="drawDepositInfo.code === 'normal'&&drawDepositInfo.available>0"
    >
      <img
        class="getlimit-bg"
        :src="require('@/assets/h5processImages/evaluateLimit/getlimit-bg@2x.png')"
        alt=""
      >
      <img
        class="getlimit-info"
        :src="require('@/assets/h5processImages/evaluateLimit/getlimit-info@2x.png')"
        alt=""
      >
      <div class="getlimit-intro">
        <p class="getlimit-intro-title">恭喜您获得额度(元)</p>
        <p class="getlimit-intro-limit">{{drawDepositInfo.available}}</p>
      </div>
      <base-button
        text='马上拿钱'
        :type='submitButtonState'
        mt='.3rem'
        @click.native="nextStep"
      ></base-button>
    </div>

    <div class="status-ctn" v-if="drawDepositInfo.code === 'in_process' && overOneMin">
      <StatusTips
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-waiting@2x.png')"
        tips="额度评估还需要几分钟时间"
        info="记得稍后回来查看你的额度哦"
      ></StatusTips>
    </div>

    <div class="status-ctn" v-if="drawDepositInfo.code !== 'in_process'">
      <StatusTips
        v-if="drawDepositInfo.code === 'normal'&&drawDepositInfo.available==0&&baseConfig.isAdvertEnabled"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
        tips="暂时无法评估额度，请继续补充资料"
        info="APP借款额度可提高至10万元"
        button="下载APP拿更高额度"
        @statusClick="downApp"
      ></StatusTips>

      <StatusTips
      v-if="drawDepositInfo.code === 'reject' || (drawDepositInfo.code === 'normal'&&drawDepositInfo.available==0&&baseConfig.isAdvertEnabled==false)"
      :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
      tips="抱歉，您暂时不符合借款条件"
      :info="drawDepositInfo.rejectTimeLimitDate?drawDepositInfo.rejectTimeLimitDate + '后可再次申请':''"
      ></StatusTips>

      <StatusTips
        v-if="drawDepositInfo.code === 'reject_forever'"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
        tips="抱歉，您暂时不符合借款条件"
      ></StatusTips>

      <StatusTips
        v-if="drawDepositInfo.code === 'recredit'"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
        tips="抱歉，请重新认证"
        button="重新认证"
        @statusClick="toCertification"
      ></StatusTips>

      <StatusTips
        v-if="drawDepositInfo.code === 'out_of_date'"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
        tips="你的额度已过期，请点击重新认证更新额度"
        button="重新认证"
        @statusClick="toCertification"
      ></StatusTips>

      <StatusTips
        v-if="drawDepositInfo.code === 'overdue'"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
        tips="账户异常，清结清后再借"
      ></StatusTips>

    </div>

  </div>
</template>

<script scoped>
import { Button } from 'mint-ui';
import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
import BaseButton from '@/components/h5process/base/BaseButton';
import StatusTips from '@/components/h5process/loan/StatusTips';
import { mapActions, mapGetters, mapState } from 'vuex';
import { GET_EVALUATE_LIMIT_INFO, CLEAR_TIME_OUT } from '@/store/h5processModules/evaluateLimit/enum/actionsEnum';
import { EVALUATE_LIMIT_INFO } from '@/store/h5processModules/evaluateLimit/enum/gettersEnum';
import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";
import storage from "@/utils/storage";

export default {
  name: 'evaluateLimit',
  data() {
    return {
      buttonClickable: false, // 马上拿钱按钮是否可点
      timer: null,
      setTime: null,
      degree: 0,
      baseConfig: {},
      overOneMin: false
    };
  },
  created() {
    // 获取评估额度信息
    this.getEvaluateLimitInfo()
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters({
      drawDepositInfo: EVALUATE_LIMIT_INFO,
    }),
    submitButtonState() {
      return this.buttonClickable ? 'yellow' : 'gray';
    }
  },
  mounted() {
    this.overOneMin = localStorage.getItem('overOneMin') == '1' ? true : false;
  },
  watch: {
    overOneMin(val) {
      if(val){
        console.log(val);
      }
    },
    async drawDepositInfo(oldVal, newVal) {
      if (oldVal.available > 0) {
        this.buttonClickable = true;
      }
      if (oldVal.code === 'in_process') {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.degree += 2;
          if (this.degree >= 360) {
            this.degree = 0;
          }
        }, 1);
        this.setTime = setTimeout(()=>{
          localStorage.setItem('overOneMin','1');
          this.overOneMin = true;
        },60000)
      } else if (oldVal.code === 'reject' || (oldVal.code === 'normal' && oldVal.available == 0)) {
        clearInterval(this.timer);
        clearTimeout(this.setTime);
        this.baseConfig = await this.getConfig();
      } else {
        clearInterval(this.timer);
        clearTimeout(this.setTime);
      }
    }
  },
  methods: {
    ...mapActions({
      getEvaluateLimitInfo: GET_EVALUATE_LIMIT_INFO,
      clearTimeout: CLEAR_TIME_OUT,
      getConfig: GET_CONFIG,
    }),
    nextStep() {
      if (!this.buttonClickable) {
        return;
      }
      storage.delete('loadTakeDetail');
      this.$router.replace('/loan');
    },
    async downApp() {
      window.location.href = this.baseConfig.downloadUrl;
    },
    toCertification() {
      this.$router.replace('/basicDataIdentify');
    }
  },
  components: {
    NavigationBar,
    Button,
    BaseButton,
    StatusTips
  },
};
</script>
<style scoped>
.container {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
}

.status-ctn{
  padding-top: 0.15rem;
  flex:1;
  background-color: #f4f4f4;
}

.item-container {
  flex:1;
  width: 100%;
  padding: 0.5rem 0.15rem 0 0.15rem;
  background-color: #f4f4f4;
}

.evaluating{
  width: 100%;
  padding: 0.5rem 0.15rem 0 0.15rem;
}

.evaluating-tips {
  font-size: 0.16rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.3rem;
  text-align: center;
  margin-top: 0.1rem;
}
.evaluating-info {
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 0.2rem;
  text-align: center;
}
.getlimit {
  position: relative;
}
.getlimit-bg {
  width: 100%;
  display: block;
}
.getlimit-info {
  position: absolute;
  width: 1.5rem;
  height: 1.2rem;
  top: 0.6rem;
  right: 0.3rem;
}
.getlimit-intro {
  position: absolute;
  width: 1.5rem;
  top: 0.8rem;
  left: 0.4rem;
}
.getlimit-intro-title {
  font-size: 0.13rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.2rem;
}
.getlimit-intro-limit {
  font-size: 0.4rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
  line-height: 0.6rem;
}
.getlimit-img,
.ruoju-img,
.qiangju-img {
  margin: 0 auto;
  width: 1.59rem;
  height: 1.56rem;
  display: block;
}
.animate-con {
  margin: 0 auto;
  width: 1.59rem;
  height: 1.56rem;
  display: block;
  position: relative;
}
.getlimit-con-bg {
  width: 100%;
  height: 100%;
}
.getlimit-con-item {
  position: absolute;
  width: 0.7rem;
  height: 0.45rem;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
