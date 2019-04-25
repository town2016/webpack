<!--已绑定银行卡列表-->
<template>
  <div class="container-bank-card-list">
    <template v-if="hasBankCard">
      <bank-card-cell :item="bankCard" @onClick="toBankCardInfo" />
      <mt-cell
        title="更换银行卡"
        :to="{ name: 'addBankCard', query: { token: $route.query.token, url: $route.query.url } }"
        class="addBtn">
      </mt-cell>
    </template>
    <template v-else>
      <div class="noCards">
        <img :src="require('@/assets/images/components/bankcard/no_card@2x.png')" width="162" height="158">
        <p class="noCardsText">你还没有添加银行卡</p>
        <mt-button class="button"
          type="primary"
          :disabled="false"
          @click.native="buttonClick">添加银行卡</mt-button>
      </div>
    </template>
  </div>
</template>

<script>
  import { Indicator, Toast, MessageBox } from "mint-ui";
  import cookie from '@/utils/cookie';
  import bankCardCell from "@/components/iqiyi/bankCard/BankCardCell";
  import { mapGetters, mapActions } from "vuex";
  import { isBackFromCG, isWeixin, closeWeixinWindow } from "@/utils/common";
  import storage from "@/utils/storage";

  import {
    GET_FIRST_REPAY_CARD
  } from '@/store/modules/bankCard/enum/actionsEnum'
  import {
    BANK_CARD
  } from '@/store/modules/bankCard/enum/gettersEnum'

  export default {
    name: "bankCardList",
    data() {
      return {

      };
    },
    components: {
      "bank-card-cell": bankCardCell
    },
    computed: {
      ...mapGetters({
        bankCard: BANK_CARD // 获取银行卡列表
      }),
      hasBankCard() { // 判断银行卡是否为空
        return JSON.stringify(this.bankCard) !== '{}';
      }
    },
    methods: {
      ...mapActions({
        getFirstRepayCard: GET_FIRST_REPAY_CARD
      }),
      toBankCardInfo(item, i) {
        storage.write("preUrl", location.href); // 银行卡详情页面跳转广发后，回跳到银行卡列表页
        this.$router.push({ name: "bankCardInfo", query: { index: i } });
      },
      buttonClick() {
        this.$router.push({ name: "addBankCard", query: { fromUrl: this.fromUrl } });
      }
    },
    async created() {
      cookie.set('sid', this.$route.query.token);

      await this.getFirstRepayCard();
      console.log(this.bankCard, 1231232)

    }
  };
</script>

<style scope lang="scss">
.container-bank-card-list {
  width: 100%;
}
// .cardBtn {
// }
.addBtn {
  font-size: 0.15rem;
  color: rgb(117, 117, 117);
}
.noCards {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1.45rem;

  .noCardsText {
    font-size: 14px;
    color: rgb(117, 117, 117);
    margin: 0.2rem 0 0.18rem;
  }
  .button {
    border-radius: 0.9rem;
    background-color: rgb(54, 142, 255);
    width: 1.55rem;
  }
}
.mint-cell-wrapper {
  background-image: none;
  text-align: center;
}
.mint-cell:last-child {
  background-image: none;
}
</style>
