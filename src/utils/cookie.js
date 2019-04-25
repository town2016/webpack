export default {
  // 设置cookie
  set(cName, value, expiredays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())+';path=/';
  },
  // 获取cookie
  get(cName) {
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(cName + '=');
      if (cStart !== -1) {
        cStart = cStart + cName.length + 1;
        let cEnd = document.cookie.indexOf(';', cStart);
        if (cEnd === -1) cEnd = document.cookie.length;
        return unescape(document.cookie.substring(cStart, cEnd));
      }
    }
    return '';
  },
};

