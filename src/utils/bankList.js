const imgUrl = "../assets/images/components/bankcard/";

export const mapArr = [
  {
    key: ["工商", "工行"],
    name: "工商银行",
    fullName: "中国工商银行",
    img: require("@/assets/images/components/bankcard/gongshang.png"),
    icon: require("@/assets/images/components/bankcard/icon_gongshang.png"),
    code: "102100099996"
  },
  {
    key: ["光大"],
    name: "光大银行",
    fullName: "中国光大银行",
    img: require("@/assets/images/components/bankcard/guangda.png"),
    icon: require("@/assets/images/components/bankcard/icon_guangda.png"),
    code: "303100000006"
  },
  {
    key: ["广发", "广东发展"],
    name: "广发银行",
    fullName: "广东发展银行",
    img: require("@/assets/images/components/bankcard/guangfa.png"),
    icon: require("@/assets/images/components/bankcard/icon_guangfa.png"),
    code: "306581000003"
  },
  {
    key: ["华夏"],
    name: "华夏银行",
    fullName: "华夏银行",
    img: require("@/assets/images/components/bankcard/huaxia.png"),
    icon: require("@/assets/images/components/bankcard/icon_huaxia.png"),
    code: "304100040000"
  },
  {
    key: ["建设", "建行"],
    name: "建设银行",
    fullName: "中国建设银行",
    img: require("@/assets/images/components/bankcard/jianshe.png"),
    icon: require("@/assets/images/components/bankcard/icon_jianshe.png"),
    code: "105100000017"
  },
  {
    key: ["交通"],
    name: "交通银行",
    fullName: "交通银行",
    img: require("@/assets/images/components/bankcard/jiaotong.png"),
    icon: require("@/assets/images/components/bankcard/icon_jiaotong.png"),
    code: "301290000007"
  },
  {
    key: ["民生"],
    name: "民生银行",
    fullName: "中国民生银行",
    img: require("@/assets/images/components/bankcard/minsheng.png"),
    icon: require("@/assets/images/components/bankcard/icon_minsheng.png"),
    code: "305100000013"
  },
  {
    key: ["平安"],
    name: "平安银行",
    fullName: "平安银行",
    img: require("@/assets/images/components/bankcard/pingan.png"),
    icon: require("@/assets/images/components/bankcard/icon_pingan.png"),
    code: "307584007998"
  },
  {
    key: ["上海银行"],
    name: "上海银行",
    fullName: "上海银行",
    img: require("@/assets/images/components/bankcard/shanghai.png"),
    icon: require("@/assets/images/components/bankcard/icon_shanghai.png"),
    code: "313290000017"
  },
  {
    key: ["兴业"],
    name: "兴业银行",
    fullName: "兴业银行",
    img: require("@/assets/images/components/bankcard/xingye.png"),
    icon: require("@/assets/images/components/bankcard/icon_xingye.png"),
    code: "309391000011"
  },
  {
    key: ["招商", "招行"],
    name: "招商银行",
    fullName: "招商银行",
    img: require("@/assets/images/components/bankcard/zhaoshang.png"),
    icon: require("@/assets/images/components/bankcard/icon_zhaoshang.png"),
    code: "308584000013"
  },
  {
    key: ["农业", "农行"],
    name: "农业银行",
    fullName: "中国农业银行",
    img: require("@/assets/images/components/bankcard/nongye.png"),
    icon: require("@/assets/images/components/bankcard/icon_nongye.png"),
    code: "103100000026"
  },
  {
    key: ["中国银行", "中行"],
    name: "中国银行",
    fullName: "中国银行",
    img: require("@/assets/images/components/bankcard/zhonghang.png"),
    icon: require("@/assets/images/components/bankcard/icon_zhonghang.png"),
    code: "104100000004"
  },
  {
    key: ["中信"],
    name: "中信银行",
    fullName: "中信银行",
    img: require("@/assets/images/components/bankcard/zhongxin.png"),
    icon: require("@/assets/images/components/bankcard/icon_zhongxin.png"),
    code: "302100011000"
  },
  {
    key: ["浦东", "浦发"],
    name: "浦东发展银行",
    fullName: "浦东发展银行",
    img: require("@/assets/images/components/bankcard/pufa.png"),
    icon: require("@/assets/images/components/bankcard/icon_pufa.png"),
    code: "310290000013"
  },
  {
    key: ["邮政"],
    name: "中国邮政储蓄银行",
    fullName: "中国邮政储蓄银行",
    img: require("@/assets/images/components/bankcard/youzheng.png"),
    icon: require("@/assets/images/components/bankcard/icon_youzheng.png"),
    code: "403100000004"
  }
];
export default mapArr;

/**
 * 通过key值获取对应银行
 * @param  { string } bankStr 银行名称或描述
 * @return { object } 银行信息
 */
export const filterBankByKey = (bankStr = "浦发") => {
  let result = null;
  for (let item of mapArr) {
    let keys = item.key;
    for (let subItem of keys) {
      if (bankStr.match(subItem)) {
        result = item;
        break;
      }
    }
    if (result) break;
  }
  return result || mapArr[14]; // 默认浦发
};

/**
 * 通过卡的全称获取对应银行
 * @param  { string } bankStr 银行名称或描述
 * @return { object } 银行信息
 */
export const filterBankByFullName = (bankStr = "浦东发展银行") => {
  let result = null;
  for (let item of mapArr) {
    if (item.fullName == bankStr) {
      result = item;
      break;
    }
  }
  return result || mapArr[14]; // 默认浦发
};
