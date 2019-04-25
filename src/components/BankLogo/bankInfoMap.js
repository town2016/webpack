const bankInfoMap = [{
  fullName: '中国工商银行',
  key: ['工商', '工行', '工商银行'],
  className: 'gongshang',
  code: '102100099996'
},
{
  fullName: '中国光大银行',
  key: ['光大'],
  className: 'guangda',
  code: '303100000006'
},
{
  fullName: '广发银行',
  key: ['广发', '广东发展'],
  className: 'guangfa',
  code: '306581000003'
},
{
  fullName: '华夏银行',
  key: ['华夏'],
  code: '304100040000'
},
{
  fullName: '中国建设银行',
  key: ['建设', '建行'],
  className: 'jianshe',
  code: '105100000017'
},
{
  fullName: '交通银行',
  key: ['交通'],
  className: 'jiaotong',
  code: '301290000007'
},
{
  fullName: '中国民生银行',
  key: ['民生'],
  className: 'minsheng',
  code: '305100000013'
},
{
  fullName: '平安银行',
  key: ['平安'],
  className: 'pingan',
  code: '307584007998'
},
{
  fullName: '上海银行',
  key: ['上海银行'],
  className: 'shanghai',
  code: '313290000017'
},
{
  fullName: '兴业银行',
  key: ['兴业'],
  className: 'xingye',
  code: '309391000011'
},
{
  fullName: '招商银行',
  key: ['招商', '招行'],
  className: 'zhaoshang',
  code: '308584000013'
},
{
  fullName: '中国农业银行',
  key: ['农业', '农行'],
  className: 'nongye',
  code: '103100000026'
},
{
  fullName: '中国银行',
  key: ['中国银行', '中行'],
  className: 'zhongguo',
  code: '104100000004'
},
{
  fullName: '中信银行',
  key: ['中信'],
  className: 'zhongxin',
  code: '302100011000'
},
{
  fullName: '浦东发展银行',
  key: ['浦东', '浦发'],
  className: 'shanghaifazhan',
  code: '310290000013'
},
{
  fullName: '中国邮政储蓄银行',
  key: ['邮政'],
  className: 'youzheng',
  code: '403100000004'
}
];

const getBankLogoInfo = (bankStr) => {
  if (typeof bankStr !== 'string') {
    return null;
  }
  const according = /^\d+$/.test(bankStr) ? 'code' : 'key';
  let result = null;
  if (according === 'key') {
    for (let item of bankInfoMap) {
      let keys = item.key;
      for (let subItem of keys) {
        if (bankStr.match(subItem)) {
          result = item;
          break;
        }
      }
      if (result) break;
    }
  } else { // code
    for (let item of bankInfoMap) {
      if (bankStr === item.code) {
        result = item;
        break;
      }
    }
  }
  return result;
};
export default getBankLogoInfo;
