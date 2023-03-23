// ==UserScript==
// @name         时间戳转换脚本
// @namespace    https://github.com/ChenHaoHu
// @version      1
// @description  将页面上复制的包含时间戳的文本转换为YYYY-mm-ddHH:MM:SS格式并弹出窗口显示转换后的结果。
// @match        *://*/*
// @grant        none
// ==/UserScript==

function timestampToTime(timestamp) {
	// 时间戳为10位需*1000，时间戳为13位不需乘1000
	var date = new Date(timestamp * 1000);
	var Y = date.getFullYear() + "-";
	var M =
		(date.getMonth() + 1 < 10 ?
			"0" + (date.getMonth() + 1) :
			date.getMonth() + 1) + "-";
	var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
	var h = date.getHours() + ":";
	var m = date.getMinutes() + ":";
	var s = date.getSeconds();
	return Y + M + D + h + m + s;
}


function showPopup(text) {
	// 创建弹框元素
	const popup = document.createElement('div');
	popup.innerHTML = text;
	popup.style.position = 'fixed';
	popup.style.top = '30px';
	popup.style.right = '30px';
	popup.style.backgroundColor = '#fff';
	popup.style.padding = '10px';
	//popup.style.border = '1px solid #ccc';

	// 将弹框添加到页面中
	document.body.appendChild(popup);

	// 创建一个计时器，设置为 5 秒
	const timer = setTimeout(() => {
		// 在计时器到期时，将弹框从 DOM 中删除
		popup.parentNode.removeChild(popup);
	}, 5000);
}


function convertTimestamp(event) {

	// 获取复制的文本内容
	const copiedText = window.getSelection()
		.toString();

	let cleanText = copiedText.replace(/[\,\s]/g, ''); //兼容  1,647,105,421 的情况

	let regex = /\d{10,13}/g;

	let timestamps = cleanText.match(regex);

	if (timestamps.length != 0) {
		let content = 'date convert：<br/>'
		for (let i = 0; i < timestamps.length; i++) {
			if (timestamps[i] > 32503680000) {
				continue
			}
			content = content + `${timestamps[i]} => ${timestampToTime(timestamps[i])} <br/>`
		}

		// 弹出窗口展示转换后的结果
		showPopup(content)
	}

}

// 监听复制事件
document.addEventListener('copy', convertTimestamp);