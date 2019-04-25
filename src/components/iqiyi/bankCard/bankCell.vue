<!--银行卡卡片-->
<template>
	<div class="bankCell">
		<img :src="imgUrl" />
		<div class="bankInfo">
			<p class="bankname">{{item.bankName}}</p>
			<p class="bankLimit">单笔限额{{bankInfo.bfWithHoldSingleLimit}}元，每日限额{{bankInfo.bfWithHoldDayLimit}}元，每月无限额</p>
		</div>
	</div>
</template>

<script>
import allBankList from "@/utils/bankList";

export default {
  name: "bankCardCell",
  data() {
    return {};
  },
  props: ["item", "index"],
  computed: {
    imgUrl() {
      let img = "";
      let bankCode = this.item.bankCode;
      for (let i = 0; i < allBankList.length; i++) {
        if (bankCode === allBankList[i].code) {
          img = allBankList[i].icon;
          break;
        }
      }
      return img;
    },
    bankInfo() {
      return {
        bfWithHoldSingleLimit: Number(
          this.item.bfWithHoldSingleLimit / 100
        ).toFixed(2),
        bfWithHoldDayLimit: Number(this.item.bfWithHoldDayLimit / 100).toFixed(
          2
        )
      };
    }
  }
};
</script>

<style scope lang="scss">
.bankCell {
  background: #ffffff;
  width: 100%;
  height: 0.7rem;
  border-bottom: 0.5px solid rgb(231, 231, 231);
  padding: 0 0.15rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    width: 0.44rem;
    height: 0.44rem;
  }
  .bankInfo {
    margin-left: 0.14rem;
    .bankname {
      font-size: 0.14rem;
      color: rgb(33, 33, 33);
    }
    .bankLimit {
      font-size: 0.12rem;
      color: rgb(117, 117, 117);
      margin-top: 0.1rem;
    }
  }
}
</style>