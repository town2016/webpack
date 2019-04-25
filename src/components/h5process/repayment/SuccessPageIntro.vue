<template>
  <div class="intro-warpper">
    <ProcessLine :selected='true' :text='text.firstStep' type='start'>
      <template slot="icon">
        <div class="view-icon first"></div>
      </template>
    </ProcessLine>
    <ProcessLine :selected='false' :text='text.secondStep' type='end'>
      <template slot="icon">
        <div class="view-icon second"></div>
      </template>
    </ProcessLine>
  </div>
</template>

<script>
import ProcessLine from '@/components/LinePlace/ProcessLine';

export default {
  name: 'SuccessPageIntro',
  components: { ProcessLine },
  props: {
    text: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>
.intro-warpper {
  width: 100%;
}

.view-icon {
  width: 100%;
  height: 100%;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center;

  &.first {
    @include bg-image('~@/assets/h5processImages/Repayment/repay-suc', auto);
  }

  &.second {
    @include bg-image('~@/assets/h5processImages/Repayment/withhold-suc', auto);
  }
}
</style>