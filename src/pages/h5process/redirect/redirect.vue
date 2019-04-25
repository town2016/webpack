<template>
    <div class="loading">
      <img :src="imgUrl"/>
    </div>
</template>

<script>
    import loadingImg from '@/assets/h5processImages/redirect/loading.gif';
    import { mapActions, mapGetters } from 'vuex';
    import { GET_PROCESS_INFO } from "@/store/h5processModules/redirect/enum/action-types";
    import { PROCESS_INFO } from "@/store/h5processModules/redirect/enum/getter-types";

    export default {
      name: "redirect",
      data() {
        return {
          imgUrl: loadingImg
        }
      },
      computed: {
        ...mapGetters('Reference', {
          baseOriginInfo: 'baseOriginInfo'
        }),
        ...mapGetters({
          processInfo: PROCESS_INFO
        })
      },
      methods: {
        ...mapActions({
          getProcessInfo: GET_PROCESS_INFO
        })
      },
      created() {
        if(this.baseOriginInfo.token  ==  ''){
          this.$router.replace({ path: '/register' });
        }else{
          this.getProcessInfo();
        }
      }
    }
</script>

<style lang="scss" scoped>
  .loading{
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    background: rgba(0,0,0,0.5);
  }
  .loading img{
    width: .9rem;
    height: .9rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.45rem 0 0 -.45rem;
    background: rgba(255,255,255,1);
    border-radius: 0.1rem;
  }
</style>
