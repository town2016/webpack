/* eslint-disable */
const INCOME = [
  { text: "工资及奖金收入", value: "A001" },
  { text: "生产经营收入", value: "A002" },
  {
    text: "财产性收入",
    value: "A003"
  }
];
const DEBT = [
  { text: "无", value: "A001" },
  { text: "有房贷", value: "A002" },
  {
    text: "有车贷",
    value: "A003"
  },
  { text: "有其他贷款", value: "A004" }
];
const EMERGENCYCONTACT = [
  {
    text: "父母",
    value: "1"
  },
  {
    text: "兄弟姐妹",
    value: "2"
  },
  {
    text: "亲戚",
    value: "3"
  },
  {
    text: "朋友",
    value: "4"
  },
  {
    text: "同事",
    value: "5"
  },
  {
    text: "子女",
    value: "6"
  },
  {
    text: "其他",
    value: "7"
  },
  {
    text: "配偶",
    value: "8"
  }
];
const JOB = [
  { value: "1", level: "1", code: "A", text: "农、林、牧、渔业" },
  { value: "90", level: "1", code: "B", text: "采矿业" },
  { value: "154", level: "1", code: "C", text: "制造业" },
  { value: "893", level: "1", code: "D", text: "电力、热力、燃气及水生产和供应业" },
  { value: "916", level: "1", code: "E", text: "建筑业" },
  { value: "956", level: "1", code: "F", text: "批发和零售业" },
  { value: "1090", level: "1", code: "G", text: "交通运输、仓储和邮政业" },
  { value: "1159", level: "1", code: "H", text: "住宿和餐饮业" },
  { value: "1181", level: "1", code: "I", text: "信息传输、软件和信息技术服务业" },
  { value: "1214", level: "1", code: "J", text: "金融业" },
  { value: "1269", level: "1", code: "K", text: "房地产业" },
  { value: "1281", level: "1", code: "L", text: "租赁和商务服务业" },
  { value: "1334", level: "1", code: "M", text: "科学研究和技术服务业" },
  { value: "1386", level: "1", code: "N", text: "水利、环境和公众设施管理业" },
  { value: "1423", level: "1", code: "O", text: "居民服务、修理和其他服务业" },
  { value: "1465", level: "1", code: "P", text: "教育" },
  { value: "1490", level: "1", code: "Q", text: "卫生和社会工作" },
  { value: "1526", level: "1", code: "R", text: "文化、体育和娱乐业" },
  { value: "1593", level: "1", code: "S", text: "公共管理、社会保障和社会组织" },
  { value: "1639", level: "1", code: "T", text: "国际组织" },
];
const entryYear = getYearList();
const entryMonth = getMonthList();

function getYearList() {
  let thisYear = new Date().getFullYear();
  let yearList = [{ text: "1960", value: 1 + "" }];
  for (let i = 1960; i < thisYear; i++) {
    yearList.push({ text: i + 1 + "", value: i - 1958 + "" });
  }
  // console.log('entryYear', yearList);
  return yearList;
}

function _getMonth(year) {
  return [
    { text: "01", value: 12 * (year - 1960) + 1 + "" },
    { text: "02", value: 12 * (year - 1960) + 2 + "" },
    { text: "03", value: 12 * (year - 1960) + 3 + "" },
    { text: "04", value: 12 * (year - 1960) + 4 + "" },
    { text: "05", value: 12 * (year - 1960) + 5 + "" },
    { text: "06", value: 12 * (year - 1960) + 6 + "" },
    { text: "07", value: 12 * (year - 1960) + 7 + "" },
    { text: "08", value: 12 * (year - 1960) + 8 + "" },
    { text: "09", value: 12 * (year - 1960) + 9 + "" },
    { text: "10", value: 12 * (year - 1960) + 10 + "" },
    { text: "11", value: 12 * (year - 1960) + 11 + "" },
    { text: "12", value: 12 * (year - 1960) + 12 + "" }
  ];
}

function getMonthList() {
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth() + 1;
  let entryMonth = {};
  for (let i = 1960; i < thisYear; i++) {
    entryMonth[i - 1959 + ""] = _getMonth(i);
  }
  entryMonth[thisYear - 1959 + ""] = _getMonth(thisYear).slice(0, thisMonth);
  // console.log('entryMonth', entryMonth);
  return entryMonth;
}

export default {
  INCOME,
  DEBT,
  entryYear,
  entryMonth,
  EMERGENCYCONTACT,
  JOB
};
