<!--已绑定银行卡列表-->
<template>
  <div>
    <bank-cell v-for="(card, index) in this.bankSupportList" :key="'card_' + index"
               :item="card" :index="index" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import bankCell from '@/components/iqiyi/bankCard/BankCell';
import {
  BANK_SUPPORT_LIST
} from "@/store/modules/bankCard/enum/gettersEnum";

export default {
  name: 'supportBankCardList',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      bankSupportList: BANK_SUPPORT_LIST
    })
  },
  components: {
    'bank-cell': bankCell,
  },
  created() {
    // this.$store.commit('COMMON_CONFIG', { // 组件创建的时候，去修改common.js中配置项的状态
    // 	showTabbar: false,   // 不显示tabbar
    // });
    const doc = document;
    let body = doc.querySelector('body');
    body.style.paddingTop = '8px';
    body.style.boxSizing = 'content-box';
    doc.documentElement.scrollTop = 8;
    doc.body.scrollTop = 8;
    window.onscroll = () => {
      doc.documentElement.scrollTop = 8;
      doc.body.scrollTop = 8;
    }
  },
  beforeDestroy() {
    let body = document.querySelector('body');
    body.style.paddingTop = '0px';
    body.style.boxSizing = 'border-box';
    window.onscroll = null;
  },
};
</script>

<style scope lang="scss">
.addBtn {
  font-size: 0.15rem;
  color: rgb(117, 117, 117);
}
</style>