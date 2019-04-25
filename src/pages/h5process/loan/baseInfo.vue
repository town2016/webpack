<template>
  <div class="container">
    <top-tip class="top" :text="'补充资料即可完成借款，还差一步' + loadTakeDetail.amount +'元到手'"/>
    <div class="info-container">
      <div>
        <div class="chuck">
          <div class="item">
            <div class="item-title">紧急联系人</div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">真实姓名</div>
            <div>
              <input
                type="text"
                placeholder="请输入"
                v-model="userBaseInfo.contactDTOs[0].contactName"
                @blur="saveInfo"
              >
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">手机号码</div>
            <div>
              <input
                type="tel"
                maxlength="11"
                placeholder="请输入"
                v-model="userBaseInfo.contactDTOs[0].contactPhone"
                @blur="saveInfo"
              >
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">所属关系</div>
            <div style="width: 2.3rem;">
              <div
                class="academic-level"
                :class='{active:userBaseInfo.contactDTOs[0].contactRelationshipCode==item.value}'
                v-for="(item,index) in custRelationDist"
                :key="index"
                @click='switchRelationship(item)'
                :data-id='index'
              >{{item.text}}
              </div>
            </div>
          </div>

        </div>
        <div class="chuck">
          <div class="item">
            <div class="item-title">个人信息</div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">个人邮箱</div>
            <div style="display:flex;">
              <input
                type="text"
                placeholder="请输入邮箱名称"
                style="width: 2rem;"
                v-model="userBaseInfo.informationDTO.email"
                @blur="saveInfo"
              >
              <img
                @click="clearEmail"
                class="email-clear"
                :class="{show: userBaseInfo.informationDTO.email != ''}"
                :src="require('@/assets/h5processImages/loan/email-clear@2x.png')"
                alt=""
              >
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">月收入(元)</div>
            <div>
              <input
                type="text"
                placeholder="请输入"
                v-model="userBaseInfo.informationDTO.income"
                @blur="saveInfo"
              >
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">收入来源</div>
            <div>
              <select-input
                @click.native="openIncomePicker"
                :value="userBaseInfo.informationDTO.sourceOfIncome"
                placeholder="请选择"
              />
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">行业类别</div>
            <div>
              <select-input
                @click.native="openJobPicker"
                :value="userBaseInfo.companyDTO.industryName"
                placeholder="请选择"
              />
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">单位名称</div>
            <div>
              <select-input
                type="text"
                @click.native="openCompanyPicker"
                :value="userBaseInfo.companyDTO.companyName"
                placeholder="请输入"
              />
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">单位地址</div>
            <div style="display: flex">
              <p
                class="placeholder area-select"
                :class="{'area-active':userBaseInfo.companyDTO.companyProvince&&userBaseInfo.companyDTO.companyCity}"
                @click="openCompanyLocationPicker"
              >
                {{userBaseInfo.companyDTO.companyProvince&&userBaseInfo.companyDTO.companyCity&&userBaseInfo.companyDTO.cityZone?userBaseInfo.companyDTO.companyProvince+userBaseInfo.companyDTO.companyCity+userBaseInfo.companyDTO.cityZone:'选择所在区'}}</p>
              <input
                type="text"
                placeholder="请补充详细地址"
                style="width: 1.3rem;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                v-model="userBaseInfo.companyDTO.companyAddress"
                @blur="saveInfo"
              >
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div class="item-left">居住地区</div>
            <div style="display: flex">
              <p
                class="placeholder area-select"
                :class="{'area-active':userBaseInfo.informationDTO.province&&userBaseInfo.informationDTO.city}"
                @click="openPersonLocationPicker"
                style="width: 1rem; padding-right:0.06rem;"
              >
                {{userBaseInfo.informationDTO.province&&userBaseInfo.informationDTO.city&&userBaseInfo.informationDTO.cityZone?userBaseInfo.informationDTO.province+userBaseInfo.informationDTO.city+userBaseInfo.informationDTO.cityZone:'选择所在区'}}</p>
              <input
                type="text"
                placeholder="请补充详细地址"
                style="width: 1.3rem;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
                v-model="userBaseInfo.informationDTO.address"
                @blur="saveInfo"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="company-part">
        <div class="chuck">
          <div class="item">
            <div style="display:flex;">
              <img
                class="item-image"
                :src="require('@/assets/h5processImages/loan/rlsb@2x.png')"
                alt=""
              >人脸识别<span class="out-of-date" v-if="userBaseInfo.faceRecognition == 2">(已过期)</span></div>
            <div>
              <p
                class="goto-credit"
                @click="gotoFaceIdentification"
                v-if="userBaseInfo.faceRecognition == 0"
              >去认证</p>
              <p
                class="have-credit"
                v-else-if="userBaseInfo.faceRecognition == 1"
              >已认证</p>
              <p
                class="goto-credit"
                @click="gotoFaceIdentification"
                v-else-if="userBaseInfo.faceRecognition == 2"
              >重新认证</p>
            </div>
            <div class="line"></div>
          </div>
          <div class="item">
            <div style="display:flex;"><img
              class="item-image"
              :src="require('@/assets/h5processImages/loan/sjrz@2x.png')"
              alt=""
            >手机认证<span class="out-of-date" v-if="userBaseInfo.jxl == 2">(已过期)</span></div>
            <div>
              <p
                class="goto-credit"
                @click="gotoPhoneCredit"
                v-if="userBaseInfo.jxl == 0"
              >去认证</p>
              <p
                class="have-credit"
                v-else-if="userBaseInfo.jxl == 1"
              >已认证</p>
              <p
                class="goto-credit"
                @click="gotoPhoneCredit"
                v-else-if="userBaseInfo.jxl == 2"
              >重新认证</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="choose-agree"
      :class='{active:isAgree}'
    >
      <span
        class="choose-check"
        @click='switchAgree'
      ></span>本人已阅读并同意签署<span
      class="jkxy"
      @click="loanProtocol"
    >《借款协议》</span>
    </div>
    <BaseButton
      text='完成借款'
      :type='submitButtonState'
      @click.native="save"
      mt='0rem'
    ></BaseButton>
    <div style="margin-top: 0.3rem;"></div>
    <!--收入来源picker-->
    <picker-with-code
      title="收入来源"
      :show="showIncomePicker"
      :selectData="sourceOfIncomeDist"
      className="picker-income"
      @cancel="closeIncomePicker"
      @confirm="confirmIncomePicker"
    />

    <!--行业类别picker-->
    <picker-with-code
      title="行业类别"
      :show="showJobPicker"
      :selectData="industryCategoryList"
      className="picker-industry"
      @cancel="closeJobPicker"
      @confirm="confirmJobPicker"
    />

    <!--公司picker-->
    <picker-company
      title="行业类别"
      :companyName="userBaseInfo.companyDTO.companyName"
      :show="showCompanyPicker"
      :selectData="companyList"
      @cancel="closeCompanyPicker"
      @confirm="confirmCompanyPicker"
    />

    <!--地址picker-->
    <picker-location
      title="选择省市区"
      :show="showCompanyLocationPicker"
      :selectData="companyCityList"
      :procinceSelected="userBaseInfo.companyDTO.companyProvince"
      :procinceSelectedId="userBaseInfo.companyDTO.companyProvinceCode"
      :citySelected="userBaseInfo.companyDTO.companyCity"
      :citySelectedId="userBaseInfo.companyDTO.companyCityCode"
      :districtSelected="userBaseInfo.companyDTO.cityZone"
      :districtSelectedId="userBaseInfo.companyDTO.cityZoneCode"
      @cancel="closeCompanyLocationPicker"
      @confirm="confirmCompanyLocationPicker"
    />

    <!--地址picker-->
    <picker-location
      title="选择省市区"
      :show="showPersonLocationPicker"
      :selectData="personCityList"
      :procinceSelected="userBaseInfo.informationDTO.province"
      :procinceSelectedId="userBaseInfo.informationDTO.provinceCode"
      :citySelected="userBaseInfo.informationDTO.city"
      :citySelectedId="userBaseInfo.informationDTO.cityCode"
      :districtSelected="userBaseInfo.informationDTO.cityZone"
      :districtSelectedId="userBaseInfo.informationDTO.cityZoneCode"
      @cancel="closePersonLocationPicker"
      @confirm="confirmPersonLocationPicker"
    />
  </div>
</template>

<script scoped>
  import {mapActions, mapGetters, mapState, mapMutations} from 'vuex';
  import {
    GET_INFORMATION,
    COMMIT_INFORMATION,
    GET_COMPANY_INFO,
    GET_PROVINCES,
    GET_CITYS,
    GET_DISTRICTS,
    GET_LEGAODICT,
    GET_FACE_URL,
    GET_CONTRACT_URL
  } from '@/store/h5processModules/loan/enum/actionsEnum';
  import {
    SAVE_USER_BASE_INFO
  } from "@/store/h5processModules/loan/enum/mutationsEnum";
  import {
    INFORMATION,
    COMPANY_INFO,
    PROVINCES,
    CITYS,
    DISTRICTS,
    LEGAODICT,
    GET_FACE_INFO,
    CONTRACTURL,
    CUSTRELATIONDIST,
    INDUSTRYCATEGORYLIST,
    SOURCEOFINCOMEDIST,
  } from '@/store/h5processModules/loan/enum/gettersEnum';
  import Picker from '@/components/h5process/loan/Picker';
  import PickerWithCode from '@/components/h5process/loan/PickerWithCode';
  import PickerCompany from '@/components/h5process/loan/PickerCompany';
  import PickerLocation from '@/components/h5process/loan/PickerLocation';
  import AREA from '@/utils/area'; // 借款城市选项
  import PERSONDATA from '@/utils/personData'; // 借款城市选项
  import SelectInput from '@/components/h5process/loan/SelectInput';
  import TopTip from "@/components/h5process/loan/TopTip";
  import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
  import {DatetimePicker, Indicator, Toast, MessageBox, Radio, Checklist} from 'mint-ui';
  import BaseButton from '@/components/h5process/base/BaseButton';
  import storage from '@/utils/storage';

  export default {
    name: "personData",
    data() {
      return {
        showPersonPicker: false,  // 是否显示个人城市picker
        showCompanyPicker: false,  // 是否显示个人城市picker
        showEntryTimePicker: false,  // 是否显示入职时间picker
        showIncomePicker: false,  // 是否显示收入来源picker
        showJobPicker: false,  // 是否显示负债情况picker
        showEmergencyContactPicker: false,  // 是否显示负债情况picker
        showCompanyLocationPicker: false,  // 公司地址picker
        showPersonLocationPicker: false,  // 公司地址picker

        personCityList: AREA,
        companyCityList: AREA,
        jobList: PERSONDATA.JOB,
        incomeList: PERSONDATA.INCOME,

        incomePerMonth: undefined,
        isFromOtherPage: false,
        isAgree: true,
        companyList: [],
        loadTakeDetail: {}
      }
    },
    async created() {
      // 此页面依赖于借款页面所填写的信息
      if (!(storage.read("loadTakeDetail") && storage.read("bankCardInfo"))) {
        this.$router.push("/loan");
        return;
      }
      this.loadTakeDetail = JSON.parse(storage.read("loadTakeDetail"));
      // 获取借款协议
      let loadTakeDetail = JSON.parse(storage.read("loadTakeDetail"));
      let bankCardInfo = JSON.parse(storage.read("bankCardInfo"));
      let contractParam = {
        amount: loadTakeDetail.amount,
        bankName: bankCardInfo.bankname,
        bankNo: bankCardInfo.cardno,
        loanUse: loadTakeDetail.loanUse,
        loanTermCode: loadTakeDetail.loanTermCode.replace("期", "M"),
      };
      let params = {
        contractParam: JSON.stringify(contractParam)
      };
      this.getContractUrl(params);

      // 获取基础信息
      this.getInformation();
      // 获取定位地址
      this.getLocation();
    },
    computed: {
      buttonClickable() {
        // 确定按钮是否可点击
        return true;
        // return (
        //   this.userBaseInfo.contactDTOs[0].contactName &&
        //   this.userBaseInfo.contactDTOs[0].contactPhone &&
        //   this.userBaseInfo.contactDTOs[0].contactRelationship &&
        //   this.userBaseInfo.contactDTOs[0].contactRelationshipCode &&
        //   this.userBaseInfo.companyDTO.companyName &&
        //   this.userBaseInfo.companyDTO.companyProvince &&
        //   this.userBaseInfo.companyDTO.companyProvinceCode &&
        //   this.userBaseInfo.companyDTO.companyCity &&
        //   this.userBaseInfo.companyDTO.companyCityCode &&
        //   this.userBaseInfo.companyDTO.companyAddress &&
        //   this.userBaseInfo.companyDTO.industryName &&
        //   this.userBaseInfo.companyDTO.industryCode &&
        //   this.userBaseInfo.companyDTO.cityZoneCode &&
        //   this.userBaseInfo.companyDTO.cityZone &&
        //   this.userBaseInfo.informationDTO.province &&
        //   this.userBaseInfo.informationDTO.provinceCode &&
        //   this.userBaseInfo.informationDTO.city &&
        //   this.userBaseInfo.informationDTO.cityCode &&
        //   this.userBaseInfo.informationDTO.address &&
        //   this.userBaseInfo.informationDTO.income &&
        //   this.userBaseInfo.informationDTO.sourceOfIncome &&
        //   this.userBaseInfo.informationDTO.sourceOfIncomeCode &&
        //   this.userBaseInfo.informationDTO.email &&
        //   this.userBaseInfo.informationDTO.cityZoneCode &&
        //   this.userBaseInfo.informationDTO.cityZone &&
        //   this.userBaseInfo.jxl == 1 &&
        //   this.userBaseInfo.faceRecognition == 1 &&
        //   this.isAgree
        // );
      },
      submitButtonState() {
        return this.buttonClickable ? 'yellow' : 'gray';
      },
      ...mapGetters({
        userBaseInfo: INFORMATION,
        companyInfo: COMPANY_INFO,
        province: PROVINCES,
        citys: CITYS,
        districts: DISTRICTS,
        legaodict: LEGAODICT,
        faceInfo: GET_FACE_INFO,
        contractUrl: CONTRACTURL,
        custRelationDist: CUSTRELATIONDIST,
        industryCategoryList: INDUSTRYCATEGORYLIST,
        sourceOfIncomeDist: SOURCEOFINCOMEDIST,
      })
    },
    beforeDestroy() {
      // this.saveInformation();
    },
    mounted() {
      // alert(JSON.stringify(this.userBaseInfo));
    },
    watch: {
      faceInfo() {
        if (this.faceInfo.url) {
          window.location.href = this.faceInfo.url
        }
      }
    },
    methods: {
      ...mapActions({
        getInformation: GET_INFORMATION,
        commitInformation: COMMIT_INFORMATION,
        getCompanyInfo: GET_COMPANY_INFO,
        getProvinces: GET_PROVINCES,
        getCitys: GET_CITYS,
        getDistricts: GET_DISTRICTS,
        getLegaodict: GET_LEGAODICT,
        getFaceUrl: GET_FACE_URL,
        getContractUrl: GET_CONTRACT_URL,
      }),
      ...mapMutations({
        saveUserBaseInfo: 'SAVE_USER_BASE_INFO'
      }),
      getLocation() {
        // 获取定位地址
        const mapObj = new AMap.Map("iCenter");
        mapObj.plugin("AMap.Geolocation", () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", this.onComplete); // 返回定位信息
          AMap.event.addListener(geolocation, "error", this.onError); // 返回定位出错信息
        });
      },
      // 地图定位成功
      onComplete(e) {
        // console.log('>>>>>>>>>>>>>>>>>>>>location', e);
        this.gpsLocation = e;
      },
      // 地图定位失败
      onError(e) {
        console.log(">>>>>>>>>>>>>>>>>地图定位失败", e);
      },
      // 获取地理位置信息对象
      getGeolocation() {
        let obj = {};
        let addressComponent = this.gpsLocation
          ? this.gpsLocation.addressComponent
          : "";
        if (addressComponent) {
          obj.city = addressComponent.city; // 市
          obj.district = addressComponent.district; // 区
          obj.province = addressComponent.province; // 省
          obj.latitude = this.gpsLocation.position.lat; // 纬度
          obj.longitude = this.gpsLocation.position.lng; // 经度
        }
        return obj;

        // const geolocationRequest = {
        //   "city": "深圳市",
        //   "district": "福田区",
        //   "province": "广东省",
        //   "latitude": "22.54469",
        //   "longitude": "114.03937"
        // };
        // return geolocationRequest;
      },
      saveInformation() {
        this.saveUserBaseInfo(this.userBaseInfo);
        storage.write("userBaseInfo", JSON.stringify(this.userBaseInfo));
      },
      saveInfo() {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.saveInformation();
        }, 100);
      },
      openIncomePicker() {  // 选择收入来源picker
        this.showIncomePicker = true;
      },
      closeIncomePicker() { // 关闭收入来源picker
        this.showIncomePicker = false;
      },
      confirmIncomePicker(data) { // 收入来源选择结果
        this.userBaseInfo.informationDTO.sourceOfIncome = data.text;
        this.userBaseInfo.informationDTO.sourceOfIncomeCode = data.value;
        this.showIncomePicker = false;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      openJobPicker() {  // 选择行业类别picker
        this.showJobPicker = true;
      },
      closeJobPicker() { // 关闭行业类别picker
        this.showJobPicker = false;
      },
      confirmJobPicker(data) { // 行业类别选择结果
        this.userBaseInfo.companyDTO.industryName = data.text;
        this.userBaseInfo.companyDTO.industryCode = data.code;
        this.showJobPicker = false;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      openCompanyPicker(e) {  // 选择公司
        this.showCompanyPicker = true;
      },
      closeCompanyPicker() { // 关闭公司picker
        this.showCompanyPicker = false;
      },
      confirmCompanyPicker(data) { // 公司选择结果
        this.userBaseInfo.companyDTO.companyName = data.companyName;
        this.showCompanyPicker = false;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      openCompanyLocationPicker() {  // 选择个人所在地区
        this.province.length == 0 && this.getProvinces();
        this.showCompanyLocationPicker = true;
      },
      closeCompanyLocationPicker() { // 关闭个人picker
        this.showCompanyLocationPicker = false;
      },
      confirmCompanyLocationPicker(data) { // 个人城市选择结果
        this.userBaseInfo.companyDTO.companyProvince = data.procinceChoosed;
        this.userBaseInfo.companyDTO.companyProvinceCode = data.procinceChoosedId;
        this.userBaseInfo.companyDTO.companyCity = data.cityChoosed;
        this.userBaseInfo.companyDTO.companyCityCode = data.cityChoosedId;
        this.userBaseInfo.companyDTO.cityZone = data.districtChoosed;
        this.userBaseInfo.companyDTO.cityZoneCode = data.districtChoosedId;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
        this.showCompanyLocationPicker = false;
      },
      openPersonLocationPicker() {  // 选择个人所在地区
        this.province.length == 0 && this.getProvinces();
        this.showPersonLocationPicker = true;
      },
      closePersonLocationPicker() { // 关闭个人picker
        this.showPersonLocationPicker = false;
      },
      confirmPersonLocationPicker(data) { // 个人城市选择结果
        this.userBaseInfo.informationDTO.province = data.procinceChoosed;
        this.userBaseInfo.informationDTO.provinceCode = data.procinceChoosedId;
        this.userBaseInfo.informationDTO.city = data.cityChoosed;
        this.userBaseInfo.informationDTO.cityCode = data.cityChoosedId;
        this.userBaseInfo.informationDTO.cityZone = data.districtChoosed;
        this.userBaseInfo.informationDTO.cityZoneCode = data.districtChoosedId;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
        this.showPersonLocationPicker = false;
      },
      checkContactPhone() {
        this.userBaseInfo.contactDTOs[0].contactPhone = this.userBaseInfo.contactDTOs[0].contactPhone.replace(/[^\d]+/, '');
        if (this.userBaseInfo.contactDTOs[0].contactPhone.length > 11) {
          this.userBaseInfo.contactDTOs[0].contactPhone = this.userBaseInfo.contactDTOs[0].contactPhone.substring(0, 11)
        }
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      // 月收入输入校验
      checkIncome() {
        this.userBaseInfo.informationDTO.income = this.userBaseInfo.informationDTO.income.replace(/[^\d.]+/, '');
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      switchAgree() {
        this.isAgree = !this.isAgree;
      },
      gotoPhoneCredit() {
        this.saveInformation();
        this.$router.push("/phoneAuth");
      },
      loanProtocol() {
        this.saveInformation();
        this.$router.push({name: 'Webview', query: {href: this.contractUrl.url}});
      },
      async gotoFaceIdentification() {
        storage.delete('identStatus');
        this.saveInformation();
        let params = {
          url: window.location.href,
        };
        await this.getFaceUrl(params);
        //跳转
        this.faceInfo.url && (window.location.href = this.faceInfo.url)
      },
      async save() {
        // console.log(this.userBaseInfo);
        // 手机匹配正则
        let ph = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        // 座机匹配正则
        let mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
        // 特殊字符正则
        let regEn = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im;
        let regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        // 汉字正则
        let Cn = /[\u4e00-\u9fa5]/im;

        if (!this.userBaseInfo.contactDTOs[0].contactName) {
          Toast('请输入联系人真实姓名');
          return;
        } else if (!new RegExp("^[\u4E00-\u9FA5]+$").test(this.userBaseInfo.contactDTOs[0].contactName)) {
          Toast('联系人真实姓名,必须全部为汉字');
          return;
        }

        if (!this.userBaseInfo.contactDTOs[0].contactPhone) {
          Toast('请输入联系人号码');
          return;
        } else if (!ph.test(this.userBaseInfo.contactDTOs[0].contactPhone)) {
          Toast('请输入正确的联系人号码');
          return;
        }
        if (!this.userBaseInfo.contactDTOs[0].contactRelationshipCode) {
          Toast('请选择联系人所属关系');
          return;
        }

        if (!this.userBaseInfo.informationDTO.email) {
          Toast('请输入个人邮箱');
          return;
        } else if (this.userBaseInfo.informationDTO.email.length > 20) {
          Toast('个人邮箱，需输入20位字符以内信息');
          return;
        } else if (this.userBaseInfo.informationDTO.email.length < 3) {
          Toast('个人邮箱，需输入3位字符以上信息');
          return;
        }

        if (!this.userBaseInfo.informationDTO.income) {
          Toast('请输入月收入');
          return;
        } else if (!new RegExp("^[0-9]*(\.[0-9]{1,2})?$").test(this.userBaseInfo.informationDTO.income)) {
          Toast('请输入正确格式的月收入');
          return;
        }

        if (!this.userBaseInfo.informationDTO.sourceOfIncome) {
          Toast('请选择收入来源');
          return;
        }

        if (!this.userBaseInfo.companyDTO.industryName) {
          Toast('请选择行业类别');
          return;
        }

        if (!this.userBaseInfo.companyDTO.companyName) {
          Toast('请输入单位名称');
          return;
        } else if (new RegExp("^[a-zA-Z]+$").test(this.userBaseInfo.companyDTO.companyName) || new RegExp("^[0-9]+$").test(this.userBaseInfo.companyDTO.companyName)) {
          Toast('单位名称，不能全部输入英文或数字，请重新输入');
          return;
        }

        if (!(this.userBaseInfo.companyDTO.companyProvince && this.userBaseInfo.companyDTO.companyCity && this.userBaseInfo.companyDTO.cityZone)) {
          Toast('请选择单位地址');
          return;
        }

        if (!this.userBaseInfo.companyDTO.companyAddress) {
          Toast('请输入单位地址详细地址');
          return;
        } else if (new RegExp("^[a-zA-Z]+$").test(this.userBaseInfo.companyDTO.companyAddress) || new RegExp("^[0-9]+$").test(this.userBaseInfo.companyDTO.companyAddress)) {
          Toast('单位地址详细地址，不能全部输入英文或数字，请重新输入');
          return;
        }

        if (!(this.userBaseInfo.informationDTO.province && this.userBaseInfo.informationDTO.city && this.userBaseInfo.informationDTO.cityZone)) {
          Toast('请选择居住地区');
          return;
        }

        if (!this.userBaseInfo.informationDTO.address.length) {
          Toast('请输入居住地区详细地址');
          return;
        } else if (this.userBaseInfo.informationDTO.address.length <= 5) {
          Toast('居住地区详细地址，需输入5位字符以上信息');
          return;
        } else if (new RegExp("^[a-zA-Z]+$").test(this.userBaseInfo.informationDTO.address) || new RegExp("^[0-9]+$").test(this.userBaseInfo.informationDTO.address)) {
          Toast('居住地区详细地址，不能全部输入英文或数字，请重新输入');
          return;
        }

        if (this.userBaseInfo.faceRecognition == undefined || this.userBaseInfo.faceRecognition == 0) {
          Toast('请先进行人脸识别');
          return;
        } else if (this.userBaseInfo.faceRecognition == 2) {
          Toast('人脸识别已过期，请重新认证');
          return;
        }

        if (this.userBaseInfo.jxl == undefined || this.userBaseInfo.jxl == 0) {
          Toast('请先进行手机认证');
          return;
        } else if (this.userBaseInfo.jxl == 2) {
          Toast('手机认证已过期，请重新认证');
          return;
        }

        if (!this.isAgree) {
          Toast('请同意并勾选借款协议');
          return;
        }

        let location = this.getGeolocation();
        // if (!location.city) {
        //   MessageBox.confirm('请允许获取地理位置信息', '', {
        //     confirmButtonText: '打开',
        //     cancelButtonText: '取消',
        //   }).then(() => {
        //     this.getLocation();
        //     Indicator.close();
        //   }).catch(() => {
        //     Indicator.close();
        //   });
        //   return;
        // }
        let params = {
          baseInfo: {
            information: JSON.stringify(this.userBaseInfo),
          },
          locationInfo: {
            latitude: location.latitude,  // 纬度
            longitude: location.longitude,  // 经度
          },
          $router: this.$router,
        };
        this.commitInformation(params);
      },
      switchRelationship(item) {
        this.userBaseInfo.contactDTOs[0].contactRelationshipCode = item.value;
        this.userBaseInfo.contactDTOs[0].contactRelationship = item.text;
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      },
      clearEmail() {
        this.userBaseInfo.informationDTO.email = "";
        // this.saveUserBaseInfo(this.userBaseInfo);
        this.saveInfo();
      }
    },
    components: {
      Picker,
      SelectInput,
      TopTip,
      NavigationBar,
      DatetimePicker,
      BaseButton,
      Radio,
      Checklist,
      PickerCompany,
      PickerLocation,
      PickerWithCode
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    font-family: PingFangSC-Regular;
    position: relative;

    .progress {
      .progress-bar {
        height: 0.03rem;
        width: 25%;
        background-color: #368eff;
      }
    }

    .top {
      z-index: 0 !important;
    }

    .stress-fontSize {
      display: inline-block;
      width: 85%;
      font-weight: bold;
    }

    .stress-color {
      display: inline-block;
      color: #368eff;
    }

    .title {
      display: block;
      padding: 0 0.15rem;
      margin-top: 0.2rem;
      height: 0.45rem;
      line-height: 0.45rem;
      font-size: pxToRem(18);
      background: white;
    }

    .chuck {
      padding: 0 0.15rem;
      background: white;
      margin-bottom: 0.2rem;

      .item {
        display: -ms-flexbox; /* IE 10 */
        display: -moz-box; /* Firefox 17- */
        display: -moz-flex; /* Firefox 18+ */
        display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
        display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
        display: -webkit-inline-flex;
        display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
        position: relative;
        justify-content: space-between;
        height: 0.45rem;
        line-height: 0.45rem;
        font-size: pxToRem(15);
        background: white;

        .item-title {
          font-weight: 600;
          color: rgba(33, 33, 33, 1);
        }

        .item-image {
          width: 0.4rem;
          height: 0.4rem;
          margin-top: 0.02rem;
          margin-right: 0.05rem;
        }

        .line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: calc(100% + 0.15rem);
          height: 0.01rem;
          background: #e7e7e7;
        }

        input[type="number"], input[type="text"], input[type="tel"] {
          border: none;
          text-align: left;
          width: 2.3rem;
        }
      }

      .exact-address {
        margin: 0;
        display: block;
        font-size: pxToRem(14);
        overflow: hidden;
        height: 0.7rem;

        textarea {
          display: block;
          width: 100%;
          height: 0.5rem;
          border: none;
          resize: NONE;
          margin: 0.1rem 0;
          overflow: hidden;
        }
      }
    }

    .company-part {
      margin-bottom: 0.27rem;
    }

    .bottom-bar {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      height: 0.5rem;
      line-height: 0.5rem;
      color: white;
      background: rgb(193, 193, 193);
    }

    .bar-con {
      height: 0.5rem;
      margin-top: 0.7rem;
    }

    .info-container {
      position: relative;
      margin: 0 0.15rem;
      margin-top: 50px;
    }

    .choose-agree {
      float: left;
      line-height: 0.3rem;
      font-size: 0.12rem;
      color: rgba(117, 117, 117, 1);
      padding-left: 0.3rem;
      width: 3.45rem;
      margin: 0 auto 0.15rem;
      position: relative;
      @include bg-image(
          "~@/assets/h5processImages/identification/unticked",
          left center/.2rem auto no-repeat
      );

      &.active {
        @include bg-image(
            "~@/assets/h5processImages/identification/tick",
            left center/.2rem auto no-repeat
        );
      }

      .jkxy {
        color: #368eff;
        cursor: pointer;
      }

      .choose-check {
        display: block;
        position: absolute;
        width: 0.3rem;
        height: 0.3rem;
        left: 0;
        top: 0;
      }
    }

    .goto-credit {
      width: 1rem;
      height: 0.3rem;
      text-align: center;
      background: rgba(193, 193, 193, 1) linear-gradient(
          90deg,
          rgba(249, 201, 55, 1) 0%,
          rgba(255, 211, 78, 1) 100%
      );
      line-height: 0.3rem;
      margin-top: 0.08rem;
      border-radius: 0.15rem;
    }

    .have-credit {
      width: 1rem;
      height: 0.3rem;
      text-align: center;
      background: #E8E8E8;
      color: #C1C1C1;
      line-height: 0.3rem;
      margin-top: 0.08rem;
      border-radius: 0.15rem;
    }

    input::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: rgb(193, 193, 193);
    }

    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: rgb(193, 193, 193);
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: rgb(193, 193, 193);
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: rgb(193, 193, 193);
    }

    .email-clear {
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.1rem;
      margin-top: 0.12rem;
      visibility: hidden;

      &.show {
        visibility: visible;
      }
    }

    .academic-level {
      float: left;
      height: 0.45rem;
      color: #c1c1c1;
      padding-left: 0.22rem;
      margin-right: 0.16rem;
      @include bg-image(
          "~@/assets/h5processImages/identification/unticked",
          left center/.2rem auto no-repeat
      );

      &.senior {
        margin-left: 0.2rem;
      }

      &.active {
        @include bg-image(
            "~@/assets/h5processImages/identification/tick",
            left center/.2rem auto no-repeat
        );
        color: #212121;
      }
    }

    .placeholder {
      color: rgb(193, 193, 193);
    }

    .area-active {
      color: black;
    }

    .area-select {
      width: 1rem;
      padding-right: 0.06rem;
      overflow: hidden;
    }

    .out-of-date {
      color: rgb(213, 72, 90);
    }
  }
</style>
