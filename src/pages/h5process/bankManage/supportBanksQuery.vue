<!--已绑定银行卡列表-->
<template>
  <div v-if='supportedBanks'>
    <BankCell v-for="(card, index) in supportedBanks" :key="'card_' + index" :item="card" :index="index" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BankCell from '@/components/h5process/bankCard/BankCell';

export default {
  name: 'supportBankCardList',
  data() {
    return {};
  },
  computed: {
    // supportedBanks
    ...mapGetters('bankManage/supportBanksQuery', ['supportedBanks'])
  },
  methods: {
    ...mapActions('bankManage/supportBanksQuery', ['getSupportBanks'])
  },
  components: {
    BankCell,
  },
  created() {
    // 初始化数据
    this.getSupportBanks().catch((err) => {
      this.$occurError(err);
    });
  },
};
</script>

<style scope lang="scss">
.addBtn {
  font-size: 0.15rem;
  color: rgb(117, 117, 117);
}
</style>