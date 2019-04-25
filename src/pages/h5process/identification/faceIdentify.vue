<template>
  <div class="container">
    <TipNavigation v-if='identStatus===0' text='你还没进行人脸识别' :showArrow='false'></TipNavigation>
    <!-- 隐藏的文件上传表单 -->
    <form action="" enctype="multipart/form-data" style="display:none">
      <input type="file" accept="image/*" capture="camera" id="fileupload" name="file" @change="fileChange" />
      <input type="file" accept="image/*" capture="camera" id="fileuploadOnly" name="file" @change="fileChange" />
    </form>
    <div class='camera-container'>
      <template v-if='identStatus === 0'>
        <div class="tip-line mt2">
          <div class="tip-line__image first"></div>
          <div class="tip-line__text">不能戴眼镜</div>
        </div>
        <div class="tip-line mt4">
          <div class="tip-line__image second"></div>
          <div class="tip-line__text">不能戴帽子</div>
        </div>
        <div class="tip-line mt4">
          <div class="tip-line__image third"></div>
          <div class="tip-line__text">不要在昏暗<br>或逆光下拍照</div>
        </div>
      </template>
      <template v-else-if="identStatus === 1">
        <div class="face-image face-success"></div>
        <div class="camera-info">
          <p class="fz-px-16 camera-tips">恭喜你，识别成功</p>
          <BaseButton text="完成" type="yellow" mt=".2rem" @click.native="goBaseInfo"></BaseButton>
        </div>
      </template>
      <template v-else-if="identStatus === 2">
        <div class="face-image face-fail"></div>
        <div class="camera-info">
          <p class="fz-px-16 camera-tips1">人脸识别失败</p>
          <p class="fz-px-16 camera-tips2">请衣着整齐，平视屏幕，并正对光源</p>
          <div class="camera-tips3">
            <div class="camera-photo">
              <div class="image-display glasses-waring"></div>
              <p class="fz-px-14 camera-photo__p">不能戴眼镜</p>
            </div>
            <div class="camera-photo">
              <div class="image-display cover-face"></div>
              <p class="fz-px-14 camera-photo__p">不能遮挡脸部</p>
            </div>
            <div class="camera-photo">
              <div class="image-display light-dark"></div>
              <p class="fz-px-14 camera-photo__p">不要光线昏暗</p>
            </div>
          </div>
        </div>
      </template>
      <BaseButton v-if="identStatus !== 1" :text="btnText" type="yellow" mt=".4rem" @click.native="dentification"></BaseButton>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
import ImageCompressor from "image-compressor.js";
import TipNavigation from '@/components/h5process/repayment/TipNavigation';
import BaseButton from "@/components/h5process/base/BaseButton";
import { mapActions } from "vuex";

export default {
  name: "FaceIdentify",
  components: {
    TipNavigation,
    BaseButton
  },
  data() {
    return {
      realName: "", // 真实姓名
      idCard: "", // 身份证号码
      nation: "", // 民族
      natureFullAddress: "", // 户籍地址
      idCardValid: "", // 身份证有效期
      currentIndex: 0, // 当前上传的是身份证正面还是反面 0：正面  1：反面
      idCardFrontSuccess: false, // 身份证正面OCR识别是否成功
      idCardEndSuccess: false, // 身份证反面OCR识别是否成功
      files: [], // 用户上传的图片,
      exArray: [], //存储设备源ID,
      identStatus: 0, // 识别状态   待识别0, 识别成功1，识别失败2
      isFromOtherPage: false, // 是否来自过期认证页
      // isFaceIdentification: true, // 是否兼容人脸识别
    };
  },
  computed: {
    btnText() {
      return this.identStatus === 0 ? '立即识别' : '重新识别'
    }
  },
  created() {
    if (this.$route.query.fromUrl && this.$route.query.fromUrl == 'reAuth') {
      this.isFromOtherPage = true
    }
    this.identStatus = localStorage.getItem('identStatus') ? parseInt(localStorage.getItem('identStatus')) : 0;
    console.log(localStorage.getItem('identStatus'));
    console.log(this.identStatus);
  },
  mounted() {},
  methods: {
    ...mapActions('identification/faceIdentify', [
      'easyFace'
    ]),
    // 开始采集
    dentification() {
      document.getElementById("fileupload").click(); // 触发输入框的click事件
      // if (!this.isFaceIdentification) {
      //   MessageBox({
      //     title: '抱歉，您的手机型号不支持，需上传照片。',
      //     message: '1.点击"去录像"进入相机打开录像录制3-5秒视频。<br/>2.再次点击去采集弹窗点击"去上传"完成视频上传，启动人脸识别审核。<br/>注：需保证人脸清晰，且为本人。',
      //     confirmButtonText: '去录像',
      //     showCancelButton: true,
      //     cancelButtonText: '去上传',
      //   }).then((action) => {
      //     if (action == 'cancel') {
      //       document.getElementById("fileuploadOnly").click(); // 触发输入框的click事件
      //     } else if (action == 'confirm') {
      //       document.getElementById("fileupload").click(); // 触发输入框的click事件
      //     }
      //   });
      // } else {
      //   document.getElementById("fileupload").click(); // 触发输入框的click事件
      // }
    },
    // 压缩File,返回一个新的File
    async imageCompressor(file, quality) {
      const imageCompressor = new ImageCompressor();
      let fileAfterCompress;
      try {
        console.log(`压缩前:${file.size}B`);
        fileAfterCompress = await imageCompressor.compress(file, { quality });
        console.log(`压缩后:${fileAfterCompress.size}B`);
        console.log(`压缩率:${1 - fileAfterCompress.size/file.size}`);
        console.log(fileAfterCompress, URL.createObjectURL(fileAfterCompress));
      } catch (err) {
        console.log(err);
        this.showToast({ text: "压缩图片失败，请重新选择" });
        throw err; // 抛出错误
      }

      return fileAfterCompress;
    },
    async fileChange(e) {
      // 文件改变
      const inputElement = e.target;
      const file = inputElement.files[0];
      if (!file) {
        return;
      }
      console.log(file);
      if (file.size > 3 * 1024 * 1024) { // 大于3M
        this.showToast({ text: `身份证图片过大(3M+)，请重新选择` });
        return;
      }
      let fileAfterCompress;
      Indicator.open();
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
            this.showToast({ text: `图片过大(${currentFileSize}M+)，请重新选择!` });
            throw new Error('图片过大，请重新选择');
          }
        }
        // 开始上传
        try {
          const response = await this.easyFace({ file: fileAfterCompress });
          if(response.result && response.result.data){
            this.identStatus = 1; // 识别成功
          }else{
            this.identStatus = 2; // 识别失败
            inputElement.value = "";
          }
          localStorage.setItem('identStatus',this.identStatus);
        } catch (err) {
          this.identStatus = 2; // 识别失败
          inputElement.value = "";
          localStorage.setItem('identStatus',this.identStatus);
        }
      } catch (err) {
        console.dir(err);
        Indicator.close();
        inputElement.value = "";
      }
    },
    goBaseInfo() {
      if(this.isFromOtherPage) {
        this.$router.push({ name: this.$route.query.fromUrl }); //跳转到其他页面
      }else{
        this.$router.push('/baseInfo');
      }
    }
  },
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.face-image {
  margin: 0 auto;
  width: 1.6rem;
  height: 1.56rem;
  &.face-fail{
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/face-authen--fail', center / contain no-repeat);
  }
  &.face-success{
    margin-top: 0.18rem;
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/face-authen--success', center / contain no-repeat);
  }
}

.image-display {
  margin: 0 auto;
  width: .6rem;
  height: .6rem;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  &.glasses-waring {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/glasses-waring', auto);
  }

  &.cover-face {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/cover-face', auto);
  }

  &.light-dark {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/light-dark', auto);
  }

}

.tip-line {
  height: 1.25rem;
  overflow: hidden;
  padding: 0 .32rem;

  &.mt4 {
    margin-top: .4rem;
  }

  &.mt2 {
    margin-top: .19rem;
  }
}

.tip-line__image {
  float: left;
  width: 1.25rem;
  height: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  &.first {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/first-warning', auto);
  }

  &.second {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/second-warning', auto);
  }

  &.third {
    @include bg-image('~@/assets/h5processImages/identification/faceAuth/third-warning', auto);
  }
}

.tip-line__text {
  float: left;
  position: relative;
  text-align: justify;
  width: 1.3rem;
  margin-left: .43rem;
  font-size: .16rem;
  color: #757575;
  top: 50%;
  transform: translateY(-50%);
}

.camera-container{
  margin-bottom: 0.3rem;
}

.camera-info {
  width: 100%;
}

.camera-tips{
  margin-top: 0.2rem;
  text-align: center;
  line-height: 1;
}

.camera-tips1 {
  margin-top: 0.2rem;
  line-height: 0.3rem;
  text-align: center;
}

.camera-tips2 {
  margin-top: .05rem;
  text-align: center;
  color: #757575;
  font-size: .14rem;
}

.camera-tips3 {
  width: 3.65rem;
  margin: .3rem auto 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}

.camera-photo__p {
  text-align: center;
  line-height: 0.24rem;
}

.camera-photo {
  flex: 1;
}
</style>
