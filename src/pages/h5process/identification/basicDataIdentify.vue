<template>
  <div class="container" ref="container">
    <!-- 隐藏的文件上传表单 -->
    <input style="display:none" type="file" ref="inputFile" capture="camera" accept="image/*" @change="fileChange">
    <div class="anthentication-process">
      <NavigationBar index="1"></NavigationBar>
    </div>
    <div class="IDcard-container">
      <div class="sub-IDcard-item IDcard-front" @click="selectImage('front')">
        <div class="IDcard-increase" :class="{compeleted:IDCardFrontSuc}">{{IDCardFrontSuc?'正面已识别':'身份证正面'}}</div>
      </div>
      <div class="sub-IDcard-item IDcard-back" @click="selectImage('back')">
        <div class="IDcard-increase" :class="{compeleted:IDCardBackSuc}">{{IDCardBackSuc?'背面已识别':'身份证背面'}}</div>
      </div>
    </div>
    <div class="form-area">
      <div class="check-and-change">请确认身份信息，如有误请修改</div>
      <CustomInput v-if='IDCardFrontSuc' desc="姓名" v-model="realName" left-width="0.7rem" placeholder="请拍照识别姓名"
                   input-color="#212121"></CustomInput>
      <CustomInput v-if='IDCardFrontSuc' desc="身份证号" v-model="idCard" left-width="0.7rem" placeholder="请拍照识别身份证"
                   input-color="#212121"></CustomInput>
      <CustomInput desc="学历" left-width="0.7rem" :use-slot="true">
        <template slot="tail">
          <!-- junior -->
          <div class="academic-level junior" :class="{active:academicLevel===4}" @click="switchAcademicLevel(4)">高中及以下</div>
          <!-- senior -->
          <div class="academic-level senior" :class="{active:academicLevel===3}" @click="switchAcademicLevel(3)">专科及以上</div>
        </template>
      </CustomInput>
    </div>
    <div class="taobao-authenticate">
      <div class="go-authen" :class="{disabled:isTaobaoAuthen}" @click="goAuthenticate">{{taobaoAuthenBtnText}}</div>
      <p class="taobao-title">淘宝认证<span v-if='isTaobaoOverdue' class="taobao-title--overdue">（已过期）</span></p>
      <p class="taobao-note">为了大幅提高额度,请先完成淘宝认证</p>
    </div>
    <BaseButton text="下一步" :type="submitButtonState" mt=".13rem" @click.native="nextStep"></BaseButton>
    <div class="padding-bottom"></div>
    <div class="progress-shelter" v-if='progressNum!==100'>
      <MyProgress :value="progressNum" class="my-process">
        <!-- <div slot="start">上传中：</div> -->
        <div slot="end" class="process-end">{{progressNum}}%</div>
      </MyProgress>
    </div>
    <tip-dialog :visible='tipVisible' @tipClick="tipClick"></tip-dialog>
  </div>
</template>

<script scoped>
import ImageCompressor from "image-compressor.js";
import TextInput from "@/components/h5process/input/TextInput";
import NavigationBar from "@/components/h5process/givingCredit/NavigationBar";
import TipDialog from "@/components/h5process/givingCredit/TipDialog";
import CustomInput from "@/components/h5process/input/KeyValueInputFill";
import BaseButton from "@/components/h5process/base/BaseButton";
import moveScroll from "@/utils/move";
import { Progress as MyProgress } from 'mint-ui';
// import front from '@/assets/images/components/certification/front.png';
// import end from '@/assets/images/components/certification/end.png';
import { mapActions } from "vuex";

class TimerService {
  constructor() {
    this._timer = null;
    this._on = false;
  }
  set() {
    this.clear();
    this._on = true;
    return new Promise(resolve => {
      this._timer = setTimeout(() => {
        this._on = false;
        resolve("trigger");
      }, 3000);
    });
  }
  clear() {
    if (this._on) {
      this._on = false;
      clearTimeout(this._timer);
    }
  }
}

export default {
  name: "basicDataIdentify",
  components: {
    TextInput,
    NavigationBar,
    TipDialog,
    CustomInput,
    BaseButton,
    MyProgress
  },
  data() {
    return {
      progressNum: 100,
      geolocationInfo: null,
      // 学历 4.高中及以下 3.专科及以上
      academicLevel: 4, // junior(primary) -> senior
      IDCardFrontSuc: false, // 正面识别成功
      IDCardBackSuc: false, // 反面识别成功
      realName: "", // 真实姓名
      idCard: "", // 身份证号码
      // 0->未认证 1->已认证 2->认证过期
      taobaoAuthenStatus: 0,
      //当前上传的是身份证正面还是反面 front.正面 back.反面
      currentType: null,
      // files: [], // 用户上传的图片
      isFromOtherPage: false // 是否来自其他页面
    };
  },
  computed: {
    buttonClickabeld() {
      return (
        this.realName &&
        this.idCard &&
        this.IDCardFrontSuc &&
        this.IDCardBackSuc &&
        this.isTaobaoAuthen
      );
    },
    submitButtonState() {
      return this.buttonClickabeld ? "yellow" : "gray";
    },
    // 是否已经淘宝认证
    isTaobaoAuthen() {
      return this.taobaoAuthenStatus === 1; // 已认证
    },
    // 淘宝认证是否过期
    isTaobaoOverdue() {
      return this.taobaoAuthenStatus === 2; // 已过期
    },
    taobaoAuthenBtnText() {
      const isTaobaoAuthen = this.isTaobaoAuthen;
      const isTaobaoOverdue = this.isTaobaoOverdue;
      return isTaobaoOverdue ? '重新认证' : isTaobaoAuthen ? '已认证' : '去认证';
    },
    tipVisible() {
      return localStorage.getItem('visited') == 'true' ? false : true;
    }
  },
  methods: {
    ...mapActions(["showToast"]),
    ...mapActions("identification/basicDataIdentify", [
      "getMapGeolocation", // 地理位置
      "getBaseAuthenInfo", // 初始化页面认证信息
      "uploadIDCard", // 上传身份证
      "authRealName", // 提交实名认证
      "getTaobaoAuthURL" // 获取淘宝认证URL
    ]),
    // 开始进度条
    startProgress() {
      return new Promise((resolve, reject) => {
        this.progressNum = 0;
        let timeDistance = 40;
        let stepDistance = 2;
        const setTimer = () => {
          const timer = setTimeout(() => {
            let numCount = this.progressNum;
            numCount += stepDistance;
            if (numCount < 99) {
              setTimer();
            }
            if (numCount > 100) {
              numCount = 100;
            }
            this.progressNum = numCount;
            // console.log(numCount)
          }, timeDistance);
        };
        setTimer();
        setTimeout(() => {
          stepDistance = 1;
          timeDistance = 80;
          resolve();
        }, 1000);
      });
    },
    //切换学术水平
    switchAcademicLevel(level) {
      this.academicLevel = level;
    },
    scrollTopBtm() {
      if (!(this.IDCardFrontSuc && this.IDCardFrontSuc)) {
        return;
      }
      const containerEl = this.$refs.container;
      const mostScrollTop = containerEl.scrollHeight - containerEl.offsetHeight;
      moveScroll.ease([containerEl.scrollTop, mostScrollTop], 250, v => {
        containerEl.scrollTop = v;
      });
    },
    async goAuthenticate() {
      if (this.isTaobaoAuthen) {
        return;
      }
      const response = await this.getTaobaoAuthURL();
      const data = {
        realName: this.realName,
        idCard: this.idCard,
        IDCardFrontSuc: this.IDCardFrontSuc,
        IDCardBackSuc: this.IDCardBackSuc,
        academicLevel: this.academicLevel
      };

      localStorage.setItem("cache_someone", JSON.stringify({ data, autheInfo: this.autheInfo }));
      console.log(response);
      console.log("去认证");
      location.href = response.result;
    },
    async nextStep() {
      if (!this.buttonClickabeld) {
        if (!this.isTaobaoAuthen) {
          this.showToast({ text: "请先完成淘宝认证(1)" });
        }
        return;
      }
      let geolocationInfo = this.geolocationInfo || {};
      // if (!geolocationInfo) {
      //   try {
      //     Indicator.open(); // 定位
      //     geolocationInfo = await this.geolocation();
      //     Indicator.close(); // 完成
      //     console.log("定位信息", geolocationInfo);
      //   } catch (err) {
      //     console.error(err);
      //     geolocationInfo = {};
      //     // this.showToast({ text: "定位失败,请清除浏览器缓存后重试" });
      //     // return;}
      //   }
      // }
      const { longitude, latitude } = geolocationInfo;
      const creditSubmitParam = JSON.stringify({
        appType: "h5",
        longitude, // stringify -> undefined会被忽略
        latitude // stringify -> undefined会被忽略
      });
      Object.assign(this.autheInfo, {
        name: this.realName,
        idCard: this.idCard,
        education: this.academicLevel,
        creditSubmitParam
      });

      // 提交
      await this.authRealName(this.autheInfo);
      console.log("下一步");
      this.$router.replace("/evaluateLimit");
    },
    // 压缩File,返回一个新的File
    async imageCompressor(file, quality) {
      const imageCompressor = new ImageCompressor();
      let fileAfterCompress;
      try {
        console.log(`压缩前:${file.size}B`);
        // mimeType:'image/png,jpeg'
        fileAfterCompress = await imageCompressor.compress(file, { quality });
        console.log(`压缩后:${fileAfterCompress.size}B`);
        console.log(`压缩率:${1 - fileAfterCompress.size/file.size}`);
        console.log(fileAfterCompress, URL.createObjectURL(fileAfterCompress));
      } catch (err) {
        console.log(err);
        this.showToast({ text: "压缩图片失败，请重新选择图片(1)" });
        throw err; // 抛出错误
      }

      return fileAfterCompress;
    },
    // File transform to base64
    FileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          resolve(e.target.result); // 获取到base64图片
        };
        reader.onerror = reject;
      });
    },
    selectImage(uploadType) {
      // 选择图片
      this.currentType = uploadType;
      this.$refs.inputFile.click(); // 触发输入框的click事件
    },
    async fileChange(e) {
      // 文件改变
      const currentType = this.currentType;
      const inputElement = e.target;
      const file = inputElement.files[0];
      if (!~["front", "back"].indexOf(currentType) || !file) {
        return;
      }
      console.log(file);
      if (file.size > 20 * 1024 * 1024) { // 大于20M
        this.showToast({ text: `身份证图片过大(20M+)，请重新选择(1)` });
        return;
      }
      let fileAfterCompress, base64img;
      // Indicator.open();
      await this.startProgress();
      try {
        // 开始压缩图片
        // 检测压缩后文件大小的合法性
        const checkFileSizeValidity = (currentFile) => {
          const currentFileSize = Number((currentFile.size / 1024 / 1024).toFixed(1));
          return currentFileSize >= 5 ? currentFileSize : '0';
        };
        // 首次压缩
        fileAfterCompress = await this.imageCompressor(file, 0.7);

        let fileSize = checkFileSizeValidity(fileAfterCompress);
        // 第二次压缩
        if (fileSize !== '0') {
          console.log('二次压缩');
          fileAfterCompress = await this.imageCompressor(fileAfterCompress, 0.5);
          fileSize = checkFileSizeValidity(fileAfterCompress);
          if (fileSize !== '0') {
            this.showToast({ text: `身份证图片过大(${currentFileSize}M+)，请重新选择!` });
            throw new Error('身份证图片过大，请重新选择');
          }
        }
        // 转成base64
        // try {
        //   base64img = await this.FileToBase64(fileAfterCompress);
        // } catch (err) {
        //   this.showToast({ text: "获取身份证失败，请稍后重试" });
        //   throw err;
        // }
        // 开始上传
        const response = await this.uploadIDCard({
          type: currentType,
          file: fileAfterCompress
        });
        try {
          const result = response.result;
          if (currentType === "front") {
            const { name, idCode, address, nation } = result;
            Object.assign(this.autheInfo, {
              nation,
              natureFullAddress: address
            });
            this.realName = name; // 真实姓名
            this.idCard = idCode; // 身份证号码
            this.IDCardFrontSuc = true;
          } else {
            const { idCardValidityDate } = result;
            this.IDCardBackSuc = true;
            this.autheInfo.idCardValid = idCardValidityDate;
          }
          this.progressNum = 100;
          if (this.IDCardFrontSuc && this.IDCardBackSuc) {
            this.$nextTick(() => {
              this.scrollTopBtm();
            });
          }
        } catch (err) {
          // 后端返回的数据有误
          this.showToast({ text: '身份证识别数据有误(1)' });
          throw new Error('身份证识别数据有误');
        }
      } catch (err) {
        console.dir(err);
        // Indicator.close();
        if (currentType === "front") {
          this.IDCardFrontSuc = false; // 背面识别失败
          this.realName = "";
          this.idCard = "";
        } else {
          this.IDCardBackSuc = false; // 背面识别失败
        }
        // err.errorCode === 0为前端框架报错，优先级toast最大
        // err.desc
        // if (err.errorCode !== 0) {
        //   // 自定义错误信息
        //   this.showToast({ text: `身份证${currentType === "front" ? "正面" : "反面"}识别失败，请稍后重试` });
        // }
        inputElement.value = "";
        this.progressNum = 100;
      }
    },
    async geolocation() {
      try {
        const geolocationInfo = sessionStorage.getItem("geolocationInfo");
        if (geolocationInfo) {
          this.geolocationInfo = JSON.parse(geolocationInfo);
        } else {
          const result = await this.getMapGeolocation();
          this.geolocationInfo = result;
          sessionStorage.setItem("geolocationInfo", JSON.stringify(result));
        }
        console.log("定位信息", this.geolocationInfo);
        return this.geolocationInfo;
      } catch (err) {
        console.log(err);
        sessionStorage.removeItem("geolocationInfo");
        // this.showToast({ text: "定位失败" });
        console.log("定位失败");
        return Promise.reject(err);
      }
    },
    tipClick() {
      this.geolocation();
    }
  },
  created() {
    // 读取缓存数据
    try {
      const cache_someone = localStorage.getItem("cache_someone");
      if (cache_someone) {
        const currentRecord = JSON.parse(cache_someone);
        this.autheInfo = currentRecord.autheInfo;
        Object.assign(this, currentRecord.data);
      }
    } catch (er) {}

    // 储存提交的信息
    if (!this.autheInfo) this.autheInfo = {};
      // 获取地理位置
      // this.geolocation();
    // 获取初始信息
    this.getBaseAuthenInfo().then(res => {
      const result = res.result;
      const { taobao, idcardFront } = result;
      this.taobaoAuthenStatus = taobao;
      if (idcardFront) {
        // 存在被储存的信息
        const {
          idcardBack,
          education,
          idcard,
          name,
          nation,
          natureFullAddress,
          idCardValid
        } = result;
        this.IDCardFrontSuc = idcardFront ? true : false;
        this.IDCardBackSuc = idcardBack ? true : false;
        this.realName = name;
        this.idCard = idcard;
        // 学历3.专科及以上 4.高中及以下
        this.academicLevel = Number(education) || 4;

        Object.assign(this.autheInfo, {
          nation,
          natureFullAddress,
          idCardValid
        });
      }
    });
    if (this.$route.query.fromPage) {
      this.isFromOtherPage = true;
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      if (from.name !== "webview") {
        vm.currentType = "front"; // 当前上传的是身份证正面还是反面 0：正面  1：反面
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.progress-shelter {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.my-process {
  width: 80%;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
}

.process-end {
  color: #fff;
  font-size: 0.16rem;
}

.container {
  // display: flex;
  // display: -webkit-flex;
  // flex-direction: column;
  // flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: rgba(244, 244, 244, 1);

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
    overflow: hidden;
  }
}

.padding-bottom {
  padding-bottom: 0.1rem;
}

.anthentication-process {
  //height: 0.9rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.IDcard-container {
  width: 100%;
  /* overflow: hidden; */
}

.sub-IDcard-item {
  width: 2.6rem;
  height: 1.4rem;
  margin: 0 auto;
  padding-top: 0.2rem;

  /* float: left; */
  &.IDcard-front {
    @include bg-image("~@/assets/h5processImages/identification/IDcard-front",
    center/100% 100% no-repeat);
    margin-top: 0.2rem;
  }

  &.IDcard-back {
    @include bg-image("~@/assets/h5processImages/identification/IDcard-back",
    center/100% 100% no-repeat);
    margin-top: 0.15rem;
  }
}

.IDcard-increase {
  padding-top: 0.7rem;
  font-size: 0.15rem;
  text-align: center;
  color: #212121;
  @include bg-image("~@/assets/h5processImages/identification/increase",
  center top/.7rem auto no-repeat);

  &.compeleted {
    @include bg-image("~@/assets/h5processImages/identification/identity-succees",
    center top/.7rem auto no-repeat);
  }
}

.form-area {
  margin-top: 0.2rem;
  background-color: #fff;
}

.check-and-change {
  height: 0.45rem;
  line-height: 0.45rem;
  font-size: 0.16rem;
  color: #212121;
  padding-left: 0.15rem;
  font-weight: 600;
  border-bottom: 1px solid #eeeeee;
}

.academic-level {
  font-size: .16rem;
  float: left;
  height: 0.45rem;
  width: 1.15rem;
  color: #c1c1c1;
  padding-left: 0.3rem;
  @include bg-image("~@/assets/h5processImages/identification/unticked",
  left center/.2rem auto no-repeat);

  &.senior {
    margin-left: 0.28rem;
  }

  &.active {
    @include bg-image("~@/assets/h5processImages/identification/tick",
    left center/.2rem auto no-repeat);
    color: #212121;
  }
}

.taobao-authenticate {
  position: relative;
  display: block !important;
  margin-top: 0.15rem;
  // background-color:
  height: 0.7rem;
  padding: 0.12rem 0 0.12rem 0.7rem;
  width: 100%;
  @include bg-image("~@/assets/h5processImages/identification/taobao-logo",
  (0.15rem center/.4rem auto no-repeat, #fff));
}

.go-authen {
  position: absolute;
  top: 0.25rem;
  right: 0.15rem;
  height: 0.25rem;
  border-radius: 0.125rem;
  background-color: #f9c937;
  text-align: center;
  line-height: 0.25rem;
  width: 0.8rem;
  color: #212121;
  font-size: 0.14rem;

  &.disabled {
    background-color: #c1c1c1;
    color: #fff;
  }
}

.taobao-title {
  color: #212121;
  font-size: 0.16rem;
  // margin-top: .12rem;
  line-height: 1;
  margin-top: 0.04rem;
}

.taobao-title--overdue {
  font-size: .16rem;
  color: #F33F3D;
}

.taobao-note {
  color: #757575;
  font-size: 0.12rem;
  margin-top: 0.1rem;
  line-height: 1;
}

.tip-text {
  padding: 8px 0;
  text-align: center;
  font-size: 13px;
  color: #666;
}

// .form {
//   background-color: #fff;
//   z-index: 5;
// }

// .form-tip-text {
//   height: 0.45rem;
//   padding-left: 0.15rem;
//   line-height: 0.45rem;
//   font-size: 14px;
//   color: rgb(243, 63, 61);
// }

// .hairline {
//   border-top: 1px solid rgb(231, 231, 231);
//   -webkit-transform: scaleY(0.5);
//   transform: scaleY(0.5);
//   margin-left: 0.15rem;
// }

// .footer {
//   position: relative;
//   width: 100%;
//   // left: 0;
//   // bottom: 0;
//   z-index: 999;
// }

// .footer-link {
//   padding: 0.15rem;
//   font-size: 13px;
//   color: #777;
//   line-height: 20px;
//   background-color: #f4f4f4;
// }

// .footer-link span {
//   font-size: 13px;
//   color: rgb(54, 142, 255);
// }

// .btn-login {
//   display: block;
//   width: 100%;
//   height: 0.45rem;
//   border-radius: 0;
//   background-color: rgb(54, 142, 255);
// }

// .bar-con {
//   height: 0.5rem;
//   margin-top: 1.3rem;
// }

// .ml-15 {
//   margin-left: 0.15rem;
// }
</style>
