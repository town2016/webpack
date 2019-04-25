<template>
  <div class="unpaid-bills" ref='scroller'>
    <BillCell v-if='valuable' v-for='(item,index) in listData' :key='index' :cell-info='item'></BillCell>
    <ListState v-if='!valuable' :type='realListState'>
      <div class="error-btn" @click='reload'>重新加载</div>
    </ListState>
  </div>
</template>
<script>
import BillCell from '@/components/h5process/repayment/PaidBillListCell.vue';
import ListState from '@/components/h5process/repayment/ListState.vue';

export default {
  name: 'PaidBillList',
  props: {
    listData: { // 列表数据
      required: true,
    },
    listState: {
      required: true,
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['loading', 'valuable', 'fail'].indexOf(value) !== -1
      }
    },
  },
  components: { BillCell, ListState },
  data() {
    return {};
  },
  computed: {
    realListState() {
      const propListState = this.listState;
      const listData = this.listData;
      let isEmpty;
      if (propListState === 'valuable') {
        if (listData && Array.isArray(listData)) {
          isEmpty = listData.length === 0;
        } else {
          return 'fail';
        }
      }
      return isEmpty ? 'empty' : propListState;
    },
    valuable() {
      return this.realListState === "valuable";
    },
  },
  methods: {
    reload() {
      this.$emit('reload');
    }
  },
  mounted() {
    this.$refs.scroller.addEventListener('scroll', function (e) {
      e.stopPropagation();
    });
    this.$refs.scroller.addEventListener('touchmove', function (e) {
      e.stopPropagation();
    });
  },
};
</script>
<style lang="scss" scoped>
.unpaid-bills {
  // padding-top: 0.15rem;
  position: absolute;
  top: 0rem;
  bottom: 0;
  left: 0;
  right: 0;
  @include hide-y-scrolbar();
}
</style>