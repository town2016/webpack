/**
 * 格式化金额，如:123456.00-> 123,456.00
 * @param { Number } source: 金额
 * @param { Numeer } length: 多少位显示','
 */
export default function (source, length = 3) {
	source = String(source).split('.');
	source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
	return source.join('.');
}
