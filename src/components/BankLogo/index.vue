<template>
  <div class="logo-base" :style="{width,height}" :class="[className]"></div>
</template>

<script>
import getBankLogoInfo from './bankInfoMap.js'

export default {
  name: 'BankLogo',
  props: {
    // 根据code 或者name
    according: {
      required: true,
      type: String
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  computed: {
    className() {
      const bankInfo = getBankLogoInfo(this.according);
      if (!bankInfo) {
        this.$emit('convertBankName', this.according);
        return 'none';
      }
      // 传输当前银行名称
      if (bankInfo) {
        this.$emit('convertBankName', bankInfo.fullName);
        return bankInfo.className;
      } else {
        return 'none';
      }
    }
  },
};
</script>
<style lang='scss' scoped>
.logo-base {
  background-position: center;
  background-size: 100% auto;
  background-repeat: no-repeat;
  width: .3rem;
  height: .3rem;
}

// .none {
//   background-color: #ededed;
// }
.none {
  @include bg-image('~@/components/BankLogo/logo/default-logo', auto);
}

.beijing {
  @include bg-image('~@/components/BankLogo/logo/beijing', auto);
}

.gongshang {
  @include bg-image('~@/components/BankLogo/logo/beijing', auto);
}

.guangda {
  @include bg-image('~@/components/BankLogo/logo/guangda', auto);
}

.guangfa {
  @include bg-image('~@/components/BankLogo/logo/guangfa', auto);
}

.jianshe {
  @include bg-image('~@/components/BankLogo/logo/jianshe', auto);
}

.jiaotong {
  @include bg-image('~@/components/BankLogo/logo/jiaotong', auto);
}

.minsheng {
  @include bg-image('~@/components/BankLogo/logo/minsheng', auto);
}

.nongye {
  @include bg-image('~@/components/BankLogo/logo/nongye', auto);
}

.pingan {
  @include bg-image('~@/components/BankLogo/logo/pingan', auto);
}

.shanghai {
  @include bg-image('~@/components/BankLogo/logo/shanghai', auto);
}

.shanghaifazhan {
  @include bg-image('~@/components/BankLogo/logo/shanghaifazhan', auto);
}

.xingye {
  @include bg-image('~@/components/BankLogo/logo/xingye', auto);
}

.youzheng {
  @include bg-image('~@/components/BankLogo/logo/youzheng', auto);
}

.zhaoshang {
  @include bg-image('~@/components/BankLogo/logo/zhaoshang', auto);
}

.zhongguo {
  @include bg-image('~@/components/BankLogo/logo/zhongguo', auto);
}

.zhongxin {
  @include bg-image('~@/components/BankLogo/logo/zhongxin', auto);
}
</style>