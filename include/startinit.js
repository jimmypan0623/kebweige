
function dynamicLoadJs(url,callback){
    var head=document.getElementsByTagName('head')[0];
    var script=document.createElement('script');
	script.type="text/javascript";
	script.src=url;
	if(typeof(callback)=='function'){
	    script.onload=script.onreadystatechange=function(){
	        if(!this.readyState || this.readyState==="Load" || this.readyState==="complete"){
			   callback();
			   script.onload=script.onreadystatechange=null;
			
			}	   
	   
	    };
	    head.appendChild(script);
	  
	}

}

function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  // 檢查是否有callback函數
  if (callback) {
    // 確保script載入完成後執行callback
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.head.appendChild(script); // 或 document.body.appendChild(script);
}

// 範例：
loadScript("myScript.js", function() {
  // 在這裡可以執行載入完成後的程式碼
  myFunction(); // 假設myScript.js中有一個名為myFunction的函數
});