// import moment from 'moment';
import Vue from 'vue';

const filter = () => {
  // 格式化为日期
  Vue.filter('formatDate', (date) => {
    if (!date) return '';
    const time = moment(date).format('YYYY-MM-DD');
    return time;
  });
  // 格式化为时分秒
  Vue.filter('formatDateSS', (date) => {
    if (!date) return '';
    const time = moment(date).format('YYYY-MM-DD HH:mm:ss');
    return time;
  });
  // 格式化为日期，无返回'--'
  Vue.filter('formatDate__', (date) => {
    if (!date) return '--';
    const time = moment(date).format('YYYY-MM-DD');
    return time;
  });
  // 格式化为时分秒，无返回'--'
  Vue.filter('formatDateSS__', (date) => {
    if (!date) return '--';
    const time = moment(date).format('YYYY-MM-DD HH:mm:ss');
    return time;
  });
  // 格式化时间段
  Vue.filter('formatMintueSecond', (time) => {
    /* eslint-disable */
    const seconds = ~~(time / 1000);
    const minute = ~~(seconds / 60);
    const second = seconds % 60;
    return `${minute < 10 ? ('0' + minute) : minute}分${second < 10 ? ('0' + second) : second}秒`;
    /* eslint-enable */
  });
  // 给手机号脱敏处理
  Vue.filter('formatPhone', (phone) => {
    return !phone ? '' : `${phone.substring(0, 3)}****${phone.substring(7)}`;
  });
};

export default filter;
