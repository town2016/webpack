<template>
  <div class="bank-selector" v-show='isShow'>
    <transition name='slide' v-on:after-leave="afterLeave">
      <div class="inner" v-if='isSlide'>
        <div class="header">
          <div class="cancel" @click='cancel'>取消</div>
          <div class="sure" @click='sure'>确认</div>
          <span>选择银行卡</span>
        </div>
        <div class="body">
          <bankCell v-for='(item,index) in bankArr' :bankCellInfo='item' :selected='selIndex===index' :key='index||item.id' type='selectabled' @selHanlder='tickSwitch(index)'></bankCell>
          <div class="add-card" @click='addCard'>
            <div class="icon"></div>
            <span class="text">更换银行卡</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import bankCell from '@/components/iqiyi/repayment/BankCell.vue';
import cookie from '@/utils/cookie';
export default {
  name: 'BankSelector',
  components: { bankCell },
  props: {
    bankArr: { //银行卡列表
      type: Array,
      required: true,
    },
    defIndex: { //默认选中项
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selIndex: null,
      isShow: false,
      isSlide: false,
    }
  },
  methods: {
    sure() {
      this.$emit('updateBank', this.selIndex);
      this.isSlide = false;
    },
    addCard() {
      cookie.set('from', '-', 1);
      this.$router.push({ path: '/addBankCard', query: { fromHref: location.href.replace(/\?.*/, '') } });
    },
    cancel() {
      this.curSelItem = null;
      this.isSlide = false;
    },
    afterLeave() {
      this.isShow = false;
    },
    tickSwitch(_index) {
      if (_index === this.selIndex) {
        console.log('select repeat!');
        return;
      }
      this.selIndex = _index;
    },
  },
  created() {
    console.log(this.selIndex, this.defIndex);
    this.selIndex = this.defIndex;
    this.$on('show', () => {
      this.isShow = true;
      this.isSlide = true;
    });
  },
};

</script>
<style lang="scss" scoped>
.bank-selector {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.inner {
  height: 4.3rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #fff;
}

.slide-enter-active {
  transition: all .3s ease;
}

.slide-leave-active {
  transition: all .2s ease;
}

.slide-enter,
.slide-leave-to {
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}

.header {
  height: .45rem;
  line-height: .45rem;
  overflow: hidden;
  text-align: center;
  border-bottom: 1px solid #E7E7E7;
  font-size: .16rem;
  color: #212121;
  &>div {
    color: #368EFF;
    font-size: .15rem;
    padding: 0.08rem;
    line-height: 1;
    margin: 0.07rem;
  }
}

.cancel {
  float: left;
}

.sure {
  float: right;
}

.body {
  position: absolute;
  top: 0.45rem;
  bottom: 0;
  left: 0;
  right: 0;
  @include hide-y-scrolbar();
}

.add-card {
  position: relative;
  margin-left: .15rem;
  width: 3.45rem;
  height: .45rem;
  line-height: .45rem;
  border: 1px dashed #aaa;
  margin-top: .2rem;
  background: url(~@/assets/images/common/linkCellArrowRight@2x.png) right 0.15rem center/auto 0.15rem no-repeat, #fff;
  margin-bottom: 0.2rem;
  border-radius: 0.02rem;
  .icon {
    position: absolute;
    top: .125rem;
    left: .15rem;
    width: .18rem;
    height: .18rem;
    border: 1px dashed #aaa;
    @include bg-image('~@/assets/images/repay/add_icon');
    background-position: center;
    background-size: 100% auto;
  }
  .text {
    color: #757575;
    font-size: .15rem;
    margin-left: .45rem;
  }
}

</style>
