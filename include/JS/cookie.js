// 1. 設定 Cookie (使用 ES6 預設參數，並改用 encodeURIComponent)
function setCookie(name, value, daysOrDate = null, path = "/", domain = null, secure = false) {
    let expires = "";
    if (daysOrDate) {
        if (daysOrDate instanceof Date) {
            expires = "; expires=" + daysOrDate.toGMTString();
        } else {
            const date = new Date();
            date.setTime(date.getTime() + (daysOrDate * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
    }
    
    document.cookie = 
        encodeURIComponent(name) + "=" + encodeURIComponent(value) +
        expires +
        (path ? "; path=" + path : "") +
        (domain ? "; domain=" + domain : "") +
        (secure ? "; secure" : "");
}

// 2. 取得 Cookie (使用正規表示式簡化)
function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + encodeURIComponent(name).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}

// 3. 刪除 Cookie (直接將 max-age 設為 0 或過期)
function delCookie(name, path = "/", domain = null) {
    setCookie(name, "", -1, path, domain);
}