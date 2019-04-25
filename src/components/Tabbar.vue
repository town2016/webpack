<template>
  <footer class="footer-tabbar">
    <router-link :to="{ name: 'index' }" class="footer-tabbar-item">
      <span class="icon home"></span>
      <p class="text">首页</p>
    </router-link>
    <router-link :to="{ name: 'bills' }" class="footer-tabbar-item">
      <span class="icon bill"></span>
      <p class="text">账单</p>
    </router-link>
    <router-link :to="{ name: 'member' }" class="footer-tabbar-item">
      <span class="icon member"></span>
      <p class="text">我的</p>
    </router-link>
  </footer>
</template>

<script>
  export default {
    name: 'tabbar',
  };
</script>

<style scoped>
  .footer-tabbar {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
  }
  .footer-tabbar::before {  /* footer-tabbar顶部0.5px边框*/
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border-top: 1px solid rgb(231,231,231);
    transform: scaleY(.5);
  }
  .footer-tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
  }
  .footer-tabbar-item .icon {
    display: block;
    width: 0.23rem;
    height: 0.23rem;
  }
  .footer-tabbar-item .text {
    padding-top: 2px;
    font-size: 10px;
    color: #333;
  }
  .footer-tabbar-item.active .text {
    color: #26a2ff;
  }
  .icon.home {
    background: url(./../assets/images/tabbar/home_normal@2x.png) no-repeat;
    background-size: contain;
  }
  .footer-tabbar-item.active .icon.home {
    background: url(./../assets/images/tabbar/home_selected@2x.png) no-repeat;
    background-size: contain;
  }
  .icon.bill {
    background: url(./../assets/images/tabbar/bill_normal@2x.png) no-repeat;
    background-size: contain;
  }
  .footer-tabbar-item.active .icon.bill {
    background: url(./../assets/images/tabbar/bill_selected@2x.png) no-repeat;
    background-size: contain;
  }
  .icon.member {
    background: url(./../assets/images/tabbar/member_normal@2x.png) no-repeat;
    background-size: contain;
  }
  .footer-tabbar-item.active .icon.member {
    background: url(./../assets/images/tabbar/member_selected@2x.png) no-repeat;
    background-size: contain;
  }

</style>


