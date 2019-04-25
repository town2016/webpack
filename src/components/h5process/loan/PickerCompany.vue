<!-- Picker组件 使用文档：https://github.com/naihe138/vue-picker -->
<template>
  <div
    id="h-picker"
    v-if="show"
  >
    <div class="picker-shade">
      <div class="area_ctrl">
        <div class="area_btn_box">
          <div class="search-con">
            <div class="area_btn_title">
              <img
                class="item-image"
                :src="require('@/assets/h5processImages/loan/search.png')"
                alt=""
              >
              <input
                class="company-input"
                type="text"
                placeholder="请输入公司名称"
                v-model="companyInput"
                v-on:input="queryCompany"
              >
            </div>
            <img
              @click="clearCompanyInput"
              class="area_btn larea_finish"
              :src="require('@/assets/h5processImages/loan/email-clear@2x.png')"
              alt=""
            >
          </div>
          <div
            class="search-cancel"
            @click="close"
          >
            取消
          </div>
        </div>
        <div class="area_roll">
          <div
            class="tooth00"
            v-for="(item,index) in companyInfo.fuzzyInfos"
            :key="index"
            @click="finish(item)"
            :data-id='index'
          >{{item.companyName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { GET_COMPANY_INFO, } from '@/store/h5processModules/loan/enum/actionsEnum';
import { COMPANY_INFO, } from '@/store/h5processModules/loan/enum/gettersEnum';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    selectData: {
      type: Array,
      default: {}
    },
    companyList: []
  },
  data() {
    return {
      companyInput: ""
    }
  },
  computed: {
    ...mapGetters({
      companyInfo: COMPANY_INFO,
    }),
  },
  watch: {
    // companyInfo(){
    //   console.log(543254,this.companyInfo);
    //   this.companyList.push(this.companyInput);
    //   this.companyList.comtact(this.companyInfo.fuzzyInfos);
    // }
    companyInput() {
      this.queryCompany();
    }
  },
  methods: {
    ...mapActions({
      getCompanyInfo: GET_COMPANY_INFO,
    }),
    close: function (e) {
      this.init();
      this.$emit('cancel');
      e.preventDefault();
    },
    finish: function (val) {
      this.$emit('confirm', val)
    },
    clearCompanyInput(){
      this.companyInput = "";
      this.queryCompany();
    },
    queryCompany() {
      if (!this.companyInput) {
        this.companyInfo.fuzzyInfos = [];
        return;
      }
      let params = {
        key: this.companyInput
      };
      this.getCompanyInfo(params);
    },
    init() {
      this.queryCompany();
    }
  },
  created() {
    this.init()
  },
  watch: {
    companyName: {
      handler: function () {
        this.init()
      },
      deep: true
    },
  }
}
</script>

<style scoped>
#h-picker {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 998;
}
.picker-shade {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}
.gearArea {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9900;
  overflow: hidden;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.area_ctrl {
  font-size: 12px;
  vertical-align: middle;
  background-color: #fff;
  color: #000;
  margin: 0;
  height: auto;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9901;
  overflow: hidden;
  /* -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0) */
}

.area_btn {
  color: #979797;
  text-align: center;
  line-height: 0.24rem;
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.05rem;
  margin-right: 0.1rem;
}
.area_btn_title {
  color: #979797;
  text-align: center;
  padding-left: 0.15rem;
  line-height: 0.3rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0.16rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
  height: 0.3rem;
}
.larea_finish {
  font-size: 0.12rem;
}

.area_btn_box {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  background-color: #fff;
  position: relative;
  padding: 0.15rem;
}
.search-con {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  background-color: #fff;
  position: relative;
  width: 3rem;
  border-radius: 0.12rem;
  background-color: rgba(234, 234, 234, 1);
}

.area_btn_box:before {
  left: 0;
  top: 0;
  -webkit-transform-origin: 50% 20%;
  transform-origin: 50% 20%;
}

.area_btn_box:after {
  left: 0;
  bottom: 0;
  -webkit-transform-origin: 50% 70%;
  transform-origin: 50% 70%;
}
.area_roll {
  max-height: 5rem;
  overflow: scroll;
}
.tooth00 {
  font-size: 0.15rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.5rem;
  margin: 0 0.15rem;
}
.item-image {
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.05rem;
}
.search-cancel {
  line-height: 0.3rem;
}
.company-input {
  border: none;
  text-align: left;
  width: 2.3rem;
  font-size: 0.12rem;
  padding-left: 0.1rem;
  box-sizing: border-box;
  background-color: rgba(234, 234, 234, 1);
}
</style>

