<!-- Picker组件 使用文档：https://github.com/naihe138/vue-picker -->
<template>
  <div
    id="h-picker"
    v-if="show"
  >
    <div class="picker-shade">
      <div
        class="area_ctrl"
        v-if="show"
      >
        <div class="area_btn_box">
          <div
            class="area_btn_title"
            @click="close"
            v-if="title"
          >{{title}}</div>

          <div
            class="area_btn area_finish"
            @click="close"
          ></div>
        </div>
        <div class="location-select">
          <div
            class="location-select-item"
            :class="{'location-select-active':isSelecting==='province'}"
            @click="select('province')"
          >{{procinceChoosed || "请选择省"}}</div>
          <div
            class="location-select-item"
            :class="{'location-select-active':isSelecting==='city'}"
            @click="select('city')"
            v-if="procinceChoosed"
          >{{cityChoosed || "请选择市"}}</div>
          <div
            class="location-select-item"
            :class="{'location-select-active':isSelecting==='district'}"
            @click="select('district')"
            v-if="cityChoosed"
          >{{districtChoosed || "请选择区"}}</div>
        </div>
        <div
          class="area_roll"
          v-if="isSelecting==='province'"
        >
          <div
            class="tooth00"
            v-for="(item,index) in province"
            :key="index"
            @click="chooseProcince(item)"
            :data-id='index'
            :class="{'select-active':procinceChoosed===item.provinceName}"
          >{{item.provinceName}}</div>
        </div>
        <div
          class="area_roll"
          v-if="isSelecting==='city'"
        >
          <div
            class="tooth00"
            v-for="(item,index) in citys"
            :key="index"
            @click="chooseCity(item)"
            :data-id='index'
            :class="{'select-active':cityChoosed===item.cityName}"
          >{{item.cityName}}</div>
        </div>
        <div
          class="area_roll"
          v-if="isSelecting==='district'"
        >
          <div
            class="tooth00"
            v-for="(item,index) in districts"
            :key="index"
            @click="chooseDistrict(item)"
            :data-id='index'
            :class="{'select-active':districtChoosed===item.districtName}"
          >{{item.districtName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { GET_PROVINCES, GET_CITYS, GET_DISTRICTS, } from '@/store/h5processModules/loan/enum/actionsEnum';
import { PROVINCES, CITYS, DISTRICTS, } from '@/store/h5processModules/loan/enum/gettersEnum';

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
    selectData: {
      type: Array,
      default: {}
    },
    procinceSelected: {
      type: String,
      default: ''
    },
    procinceSelectedId: {
      type: [Number, String],
      default: ''
    },
    citySelected: {
      type: String,
      default: ''
    },
    citySelectedId: {
      type: [Number, String],
      default: ''
    },
    districtSelected: {
      type: String,
      default: ''
    },
    districtSelectedId: {
      type: [Number, String],
      default: ''
    },
  },
  data() {
    return {
      noData: false,
      isSelecting: 'province',
      procinceChoosed: '',
      procinceChoosedId: '',
      cityChoosed: '',
      cityChoosedId: '',
      districtChoosed: '',
      districtChoosedId: '',
    }
  },
  computed: {
    ...mapGetters({
      province: PROVINCES,
      citys: CITYS,
      districts: DISTRICTS,
    }),
  },
  methods: {
    ...mapActions({
      getProvinces: GET_PROVINCES,
      getCitys: GET_CITYS,
      getDistricts: GET_DISTRICTS,
    }),
    close: function (e) {
      this.$emit('cancel')
      e.preventDefault();
    },
    finish: function (e) {
      // this.$emit('confirm', e)
      event.preventDefault();
    },
    select(val) {
      this.isSelecting = val;
      switch (val) {
        case 'province':
          console.log('province');
          break;
        case 'city':
          let params = {
            provinceId: this.procinceChoosedId
          };
          this.getCitys(params);
          break;
        case 'district':
          let params0 = {
            cityId: this.cityChoosedId
          };
          this.getDistricts(params0);
          break;
      }
    },
    chooseProcince(val) {
      this.procinceChoosed = val.provinceName;
      this.procinceChoosedId = val.provinceId;
      this.cityChoosed = '';
      this.cityChoosedId = '';
      this.districtChoosed = '';
      this.districtChoosedId = '';
      this.select('city');
    },
    chooseCity(val) {
      this.cityChoosed = val.cityName;
      this.cityChoosedId = val.cityId;
      this.districtChoosed = '';
      this.districtChoosedId = '';
      this.select('district');
    },
    chooseDistrict(val) {
      this.districtChoosed = val.districtName;
      this.districtChoosedId = val.districtId;
      let areaObj = {
        procinceChoosed: this.procinceChoosed,
        procinceChoosedId: this.procinceChoosedId,
        cityChoosed: this.cityChoosed,
        cityChoosedId: this.cityChoosedId,
        districtChoosed: this.districtChoosed,
        districtChoosedId: this.districtChoosedId,
      };
      this.$emit('confirm', areaObj)
    },
    init() {
      // console.log(1111, this.procinceSelected, this.procinceSelectedId, this.citySelected, this.citySelectedId, this.districtSelected, this.districtSelectedId);
      this.procinceChoosed = this.procinceSelected;
      this.procinceChoosedId = this.procinceSelectedId;
      this.cityChoosed = this.citySelected;
      this.cityChoosedId = this.citySelectedId;
      this.districtChoosed = this.districtSelected;
      this.districtChoosedId = this.districtSelectedId;
    }
  },
  created() {
    // this.province.length == 0 && this.getProvinces();

    this.init()
  },
  watch: {
    procinceSelected: {
      handler: function () {
        this.init()
      },
      deep: true
    },
  }
}
</script>

<style scoped lang="scss">

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
  position: fixed;
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
  bottom: 0;
  z-index: 9901;
  overflow: hidden;
  /* -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0) */
}

.area_btn_title {
  color: #979797;
  text-align: center;
  padding: 0 0.15rem;
  line-height: 0.6rem;
}

.area_btn{
  position: absolute;
  top: 0.2rem;
  right: 0.15rem;
  width: 0.18rem;
  height: 0.18rem;
  @include bg-image('~@/assets/h5processImages/common/pop-close',center/100% 100% no-repeat);
}

.area_btn_title {
  font-size: 0.18rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
}

.area_btn_box:before,
.area_btn_box:after {
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  display: block;
  background-color: #96979b;
  z-index: 15;
  -webkit-transform: scaleY(0.33);
  transform: scaleY(0.33);
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
  height: 4.5rem;
  overflow: scroll;
}
.tooth00 {
  font-size: 0.15rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.5rem;
  margin: 0 0.15rem;
}
.location-select {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  border-bottom: 1px solid rgb(233, 229, 229);
  padding: 0 0.15rem;
}
.location-select-item {
  margin-right: 0.15rem;
  line-height: 0.4rem;
  font-size: 0.15rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
}
.location-select-active {
  border-bottom: 2px solid #ffd34e;
}
.select-active {
  color: #ffd34e;
}
</style>

