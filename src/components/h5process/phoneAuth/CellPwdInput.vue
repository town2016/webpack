<!-- 方框输入密码 -->
<template>
  <div id="cellPwdInput" @touchstart.stop.prevent="$emit('update:viewKey', true)">
    <div class="boxWrap" v-if="pwdShow">
      <div v-for="item in pwdSize" :key="item" :style="autoStyle.boxStyle" class="box"
           :class="{ viewLeft: item !== 1 }">
        <div v-if="pwd.length >= item" class="content">{{ pwd[item-1] || '' }}</div>
      </div>
    </div>
    <div class="boxWrap" v-else>
      <div v-for="item in pwdSize" :key="item" :style="autoStyle.boxStyle" class="box"
           :class="{ viewLeft: item !== 1 }">
        <div v-if="pwd.length >= item" class="content viewPoint" :style="autoStyle.pointStyle"></div>
      </div>
    </div>
    <div class="numbers" :class="{ view: viewKey }">
      <table>
        <tbody>
        <tr class="noTop twoLine">
          <td @touchstart.stop.prevent="editPwd(1)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===1 }">
            <div>1</div>
            <div class="letter" style="color: #FFF;">.</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(2)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===2 }">
            <div>2</div>
            <div class="letter">ABC</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(3)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===3 }">
            <div>3</div>
            <div class="letter">DEF</div>
          </td>
        </tr>
        <tr class="twoLine">
          <td @touchstart.stop.prevent="editPwd(4)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===4 }">
            <div>4</div>
            <div class="letter">GHI</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(5)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===5 }">
            <div>5</div>
            <div class="letter">JKL</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(6)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===6 }">
            <div>6</div>
            <div class="letter">MNO</div>
          </td>
        </tr>
        <tr class="twoLine">
          <td @touchstart.stop.prevent="editPwd(7)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===7 }">
            <div>7</div>
            <div class="letter">PQRS</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(8)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===8 }">
            <div>8</div>
            <div class="letter">TUV</div>
          </td>
          <td @touchstart.stop.prevent="editPwd(9)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===9 }">
            <div>9</div>
            <div class="letter">WXYZ</div>
          </td>
        </tr>
        <tr class="noBottom oneLine">
          <td style="background-color: #ccc;" @touchstart.stop.prevent="closeKeyboard"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMAwECARxeTXWAqxiz5CNW/uA/NIgWhpxQDbQzbrjGa7HlQjPZEdJEAAAIeSURBVHja7dprb6JQEIDhKdbaar2Vdr3U+/z//7ieDQfOrgstJE1m8H0+TmDkDYkQowAAAAAAAAAAAAD4CdnHgwunrTTaqBfHkTQ4qyNnqTdTR2ZSK1dXcqmTaXAZmHfRIJM6jxoMxbyhBo+EmEGINYRYQ4g1dxuSP5Q28ZBqFPdsqlFejJ7KyUIKi3L01Hl755AXLcVPH2npOV61libFaKzRqxReNRoXk8nt9mctjW63vxBCCCGEEEIIIdcQ3rXMIsQaQqwhxJq7fSASQgghhBBCCCF9+hHbLEKsIcQaQqxpGzLNSnlcUY3icXnWUdvt0x9/sndk+BWFEEIIIYQQQvoYshqU4kn7arSPZw06atw+ud2+4qXRLEKsIcSaOws5Z+advwjZqyt7qXVUR45S76SOnKTe+qBu7NbSZD9XFz5PawEAAAAA2LSUDt6nYs1qdpDWpou5tZLhTPXQumOuaqxk+KlXh9YdV2NTJQv949C2I7iIIeGOBB/tOuzdkarEeUdS4ryjVUnsMPed9U+J846kxHlHeCp+q2Q6Nt4hsoolzjuSEucdSYnzjqSkuWNhvaMq+dXY8S72lSXOO5IS5x0iy/+XbL111JRs39x1JCXOO5IS5x1JifOOpMR5R1Ky9t1xLSkuf7f03VGVHJ13FCXRzm/HXyU73/9LWr71oyOU9KMjlPSjI5T0o0NkO+hHBwAAAAAAAAAAAHAPfgN/gfGc95gHUAAAAABJRU5ErkJggg=="
            alt="" style="width: .3rem; vertical-align: middle;"></td>
          <td @touchstart.stop.prevent="editPwd(0)" @touchend.stop.prevent="activeNumber=null"
              :class="{ active: activeNumber===0 }">0
          </td>
          <td style="background-color: #ccc;" @touchstart.stop.prevent="deletePwd"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAbFBMVEUAAABERERERERERERDQ0NDQ0NERERCQkJAQEBDQ0NDQ0NDQ0NAQEA+Pj5ERERDQ0NDQ0NBQUFCQkIxMTFERERCQkJDQ0M8PDxDQ0NDQ0NCQkJCQkJFRUVERERDQ0NDQ0NDQ0NDQ0NDQ0NERET+ZXR7AAAAI3RSTlMAk/z5VEjwQgxZ9MUaEunYz05LA+JePgefe2grItysNr26kEgSdQoAAAFeSURBVFjD7ZbbdoMgEEUnIEa8x1suxtqG///HLrDtJC4GLU95YL85es6SYZgBAoHAGzNOaps4E5T+Xqp9NHZ93qmdZFZ9Uam9xDZ9YvR1Ak6SXmlsb2r9okI9xafd4JzpeFfAJgerQfulw2UOngbth0nNHZC8+I+B0acjIJKlET5F9SRdBhcd4/NzSkqlWPSn1/at1QBD/PiS00mhQ8T0+miDq46wVXUO3DgsevS3GdyURsKKo3E4oZ4yWCrrBkA4nFBvNZBMP1/BguDqBy7IbRRGfwArgqOeMjAN4AIEQhmEo5A6T4PVXz78lwDNriQeHWdBUtsoXNvoX0j+pTw4TuND/X6BVM+HyTTLzeOczoAk8aLHPKUJZYANaQSkf2kokrOe/gNsiXRLK/JVEomm7NtUcSx4tnUcbLXnYMHRmp09RhsOd6/hioyx33hH5tTvgoEM8a4rTgOBQOCd+AY8rWK4DkW2DAAAAABJRU5ErkJggg=="
            alt="" style="width: .3rem; vertical-align: middle;"></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

  export default {
    props: {
      pwdShow: { // 是否显示密码
        type: Boolean,
        default: false,
      },
      viewKey: { // 是否显示键盘
        type: Boolean,
        default: false,
      },
      pwdSize: { // 密码位数
        type: Number,
        default: 6,
      }
    },
    computed: {
      autoStyle() { // 根据不同的密码size显示不同的密码宽度
        const size = this.pwdSize < 6 ? 6 : this.pwdSize;
        return {
          boxStyle: {
            width: `${ 2.4 / size }rem`,
            height: `${ 2.4 / size }rem`,
            fontSize: `${ 1.5 / size }rem`,
          },
          pointStyle: {
            width: `${ 0.5 / size }rem`,
            height: `${ 0.5 / size }rem`,
          },
        };
      },
    },
    data() {
      return {
        pwd: '', // 密码
        activeNumber: null, // 激活的数字
      };
    },
    methods: {
      closeKeyboard() {
        this.$emit('closeKeyboard');
      },
      editPwd(number) {
        this.activeNumber = number;
        if ((this.pwd.length >= this.pwdSize) && (this.pwd.length > 0)) return;
        this.pwd += number;
      },
      deletePwd() {
        const ln = this.pwd.length;
        this.pwd = ln ? this.pwd.substr(0, ln - 1) : '';
      },
      reset() {
        this.pwd = '';
      },
    },
    watch: {
      pwdSize() {
        this.pwd = '';
      },
      pwd(newValue) {
        this.$emit('change', newValue);
      },
    },
  };

</script>
<style scoped lang="scss">
  #cellPwdInput {
    width: 100%;
    text-align: center;
    .boxWrap {
      width: 100%;
      font-size: 0;
      white-space: nowrap;
      .box {
        border-bottom: 1px solid #C1C1C1;
        margin: 0 0.025rem;
        display: inline-block;
        color: #000;
        &.viewLeft {
          border-left: none;
        }
        .content {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          &.viewPoint {
            background-color: #222;
            border-radius: 50%;
          }
        }
        &:after {
          content: '';
          display: inline-block;
          width: 0;
          height: 100%;
          vertical-align: middle;
        }
      }
    }
    .numbers {
      width: 100%;
      height: 2.3rem;
      background-color: #ddd;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      transition: all .2s;
      transform: translate3d(0, 2.4rem, 0);
      &.view {
        transform: translate3d(0, 0, 0);
      }
      table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        td {
          vertical-align: middle;
          border: 1px solid #C1C1C1;
          background-color: #fff;
          font-size: .27rem;
          width: 33.333%;
          .letter {
            font-size: .12rem;
            letter-spacing: 1px;
          }
          &.active {
            background-color: #ddd;
          }
        }
        .noTop td {
          border-top: none;
        }
        .noBottom td {
          border-bottom: none;
        }
        .twoLine td {
          height: 25.5%;
        }
        .oneLine td {
          height: 24%;
        }
      }
    }
  }
</style>
