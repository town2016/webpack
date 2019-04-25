// 判断是否是从银行页面跳回
export function isBackFromCG(url) {
	let params = url.split('?')[1];
	if (params) {
		let arr = params.split('&');
		if (arr.length === 1 && arr[0].indexOf('params=') > -1) {
			return true;
		}
	}
	return false;
}

// 判断是否是微信浏览器
export function isWeixin(){
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

// 跳转回公众号窗口
export function closeWeixinWindow() {
	if (typeof(WeixinJSBridge) === 'undefined') { // WeixinJSBridge还未生效
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', function() {
				WeixinJSBridge.invoke('closeWindow',{},function(res){});
			}, false);
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function() {
				WeixinJSBridge.invoke('closeWindow',{},function(res){});
			});
			document.attachEvent('onWeixinJSBridgeReady', function() {
				WeixinJSBridge.invoke('closeWindow',{},function(res){});
			});
		}
	} else {
		WeixinJSBridge.invoke('closeWindow',{},function(res){});
	}
}

// 复制到剪贴板
export function copyToClipboard(txt) {
	try {
		let input=document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('value', txt);
		input.setAttribute('id', 'copyInput');
		document.getElementsByTagName('body')[0].appendChild(input);
		let select = input.select();
		const retvalue = document.execCommand('copy'); // 执行copy命令，copy用户选择的文本
		input.remove();
		if (retvalue) {
			console.log('复制成功！');
		} else {
			console.log('复制失败！');
		}
    } catch (error) {
		console.log(error);
    }
}

//加法
export function add(num1, num2) {
	let baseNum, baseNum1, baseNum2;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	return (num1 * baseNum + num2 * baseNum) / baseNum;
}

//减法
export function sub(num1, num2) {
	let baseNum, baseNum1, baseNum2;
	let precision;// 精度
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

//乘法
export function mul(num1, num2) {
	let baseNum = 0;
	try {
		baseNum += num1.toString().split(".")[1].length;
	} catch (e) { console.log(e) }
	try {
		baseNum += num2.toString().split(".")[1].length;
	} catch (e) { console.log(e) }
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
}

//除法
export function div(num1, num2) {
	let baseNum1 = 0, baseNum2 = 0;
	let baseNum3, baseNum4;
	try {
	 	baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
	 	baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum3 = Number(num1.toString().replace(".", ""));
	baseNum4 = Number(num2.toString().replace(".", ""));
	return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
}

export function query() {
	let search = decodeURIComponent(window.location.href).split('?');
	search.splice(0, 1);
	search = search.join('');
	if(search) {
		let query = search.split('&');
		let tempObj = {};
		query.map((v) => {
			let val = v.split('=');
			tempObj[val[0]] = val[1];
		});
		return tempObj;
	}
	return {};
}

// 发送消息至app
export function appPostMessage(message) {
  console.log(JSON.stringify(message));
  try {
    if (window.postMessage) {
      window.postMessage(JSON.stringify(message),'*');
    } else {
      console.log('postMessage error')
    }
  } catch (error) {
    console.log(error);
  }
}
