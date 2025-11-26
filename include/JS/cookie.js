function setCookie(name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : null;

	document.cookie = escape(name) + "=" + escape(value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == null) ? "" : ("; secure=" + secure));
}

function delCookie(name) {
	var expDate = new Date();
	expDate.setTime(expDate.getTime()-1);	// 設定 Cookie 的失效時間比目前時間還早
	document.cookie = escape(name) + "=; expires=" + expDate.toGMTString();	// 重新設定 Cookie
}

function getCookie(name){  //取得COOKIE 
	var arg = name + "="; 
	var alen = arg.length; 
	var clen = document.cookie.length; 
	var i = 0; 
	var j = 0;
	while(i < clen){ 
		j = i + alen; 
		if (document.cookie.substring(i, j) == arg) 
			return getCookieVal(j); 
		i = document.cookie.indexOf(" ", i) + 1; 
		if(i == 0) 
			break;
	} 
	return null; 
} 
  
function getCookieVal(offset){ 
	var endstr = document.cookie.indexOf(";", offset); 
	if(endstr == -1){ 
		endstr = document.cookie.length;
	} 
	return unescape(document.cookie.substring(offset, endstr)); 
} 
