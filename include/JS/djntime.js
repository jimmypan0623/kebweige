// 使用 addLoadListener 註冊啟動
addLoadListener(StartClock);

var timerID = null;
var timerRunning = false;	

// 擷取日期各欄位並指定值
function MyTimer() {	
    // 生成 Date 物件實例
    var nowTime = new Date();
    var iyear = nowTime.getFullYear();
    var imonth = nowTime.getMonth();
    var iweek = nowTime.getDay();
    var idate = nowTime.getDate();
    var ihours = nowTime.getHours();
    var iminutes = nowTime.getMinutes();
    var iseconds = nowTime.getSeconds();
    
    // 透過函數返回月份和日期的中文形式
    var Month = MyMonth(imonth);
    var Week = MyWeek(iweek);
    
    // 設定輸出格式
    var myDate = ((idate < 10) ? "0" : "") + idate;
    var AM_PM = (ihours >= 12) ? "下午" : "上午";
    var tempHours = (ihours >= 12) ? (ihours - 12) : ihours;
    var Hours = ((tempHours < 10) ? "0" : "") + tempHours;
    var Minutes = ((iminutes < 10) ? ":0" : ":") + iminutes;
    var Seconds = ((iseconds < 10) ? ":0" : ":") + iseconds; 
    
    // 設定輸出字串
    var iTime = (iyear + "年" + Month + "月" + myDate + "日" + Week + "," + AM_PM + Hours + Minutes + Seconds);
    
    var showTime = document.getElementById('currentTime');
    if (showTime) {
        showTime.innerHTML = iTime;
    }
    
    // 【關鍵修正】：不要傳入字串 "MyTimer()"，改為直接傳入函式本身 MyTimer 
    timerID = setTimeout(MyTimer, 1000);
    timerRunning = true;
}

// 轉換月份, 0對應一月, 依此類推
function MyMonth(month) {
    var strMonth = "12";
    if (month == 0) strMonth = "01";
    if (month == 1) strMonth = "02";
    if (month == 2) strMonth = "03";
    if (month == 3) strMonth = "04";
    if (month == 4) strMonth = "05";
    if (month == 5) strMonth = "06";
    if (month == 6) strMonth = "07";
    if (month == 7) strMonth = "08";
    if (month == 8) strMonth = "09";
    if (month == 9) strMonth = "10";
    if (month == 10) strMonth = "11";
    return strMonth;
}

// 轉換星期, 0對應星期日, 依此類推
function MyWeek(week) {
    var strWeek = "星期日";
    if (week == 0) strWeek = "星期日";
    if (week == 1) strWeek = "星期一";
    if (week == 2) strWeek = "星期二";
    if (week == 3) strWeek = "星期三";
    if (week == 4) strWeek = "星期四";
    if (week == 5) strWeek = "星期五";
    if (week == 6) strWeek = "星期六";
    return strWeek;
}

// 文檔載入的同時啟動計時器
function StartClock() {
    if (timerRunning) {
        clearTimeout(timerID);
    }
    timerRunning = false;
    MyTimer();     
}