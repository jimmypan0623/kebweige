function loginInitForm(){
	// 1. 定義要動態產生的 HTML 字串（完全保留原本的屬性與結構）
    const formTemplate = `
    <form id="login" method="post" action="loginchk.php" autocomplete="on" onsubmit="return encryptPassword()">
        <h1>LOG IN</h1>
        <fieldset id="inputs">         
                <input id="account"
                name="account"
                type="text"
				placeholder="Account"
				autocomplete="username"
				autofocus
				required>
				<input id="rawPassword"				
				type="password"
				placeholder="Password" autocomplete="current-password" required>				
				<input id="hiddenPassword" 
				type="hidden" 
				name="password">												
				<input id="validcode"
				name="validcode"
				type="text"
				placeholder="不分大小寫輸入右邊驗證碼"
				maxlength="4"
				required>			 
				<img id="img4" alt="">
				<img id="img3" alt="">
				<img id="img2" alt="">
				<img id="img1" alt=""> 
			</fieldset>
			<fieldset id="actions">
				<input type="submit" id="submit" value="Log in">
			</fieldset>        
		</form>
	`;

	// 2. 為了確保在 initsetup.js 執行前 DOM 已經存在，method="post" action="loginchk.php" onsubmit="return encryptPassword()" 
	// 這裡使用同步的插入方式，直接寫入到當前 script 標籤所在的位置（即容器內）。
	let formContainer = document.getElementById('login-Form');
	if (!formContainer) {	
		// 備用方案：如果容器尚未生成，直接寫入 document		 
		formContainer = document.createElement('div');
        formContainer.id = 'login-Form';
        document.body.insertBefore(formContainer, document.body.firstChild)
	}
	formContainer.innerHTML = formTemplate;
    var img1=document.getElementById('img1');
	var img2=document.getElementById('img2');
	var img3=document.getElementById('img3');
	var img4=document.getElementById('img4');
	if (img1 && img2 && img3 && img4 ) {
		
		for (let i = 1; i <= 4; i++) {
			 let img = document.getElementById('img' + i);
			 if (img) {
				 img.style.cursor = 'pointer'; // 讓滑鼠移上去顯示手型
				 img.title = '看不清楚？可再點擊換一組'; // 增加提示文字
				
				 attachEventListener(img,"click",refreshCaptcha,false);
			}
		}
		
	   // 呼叫我們定義的刷新函式
	   refreshCaptcha();
	}
	// 📢 【修正】不論有無錯誤訊息，只要表單產生了，就必須綁定提交事件
	var sbmtclk = document.getElementById('submit');
	if (sbmtclk) {
		// 先移除防止重複綁定，再重新綁定		
	    attachEventListener(sbmtclk, "click", clrinpt, false);
	}
	var errMsg = getCookie('errmsg');
	if (errMsg) {
		// 1. 自動填回之前輸入的帳密
		if (document.getElementById('account')) document.getElementById('account').value = getCookie('tmpacnt') || '';
		if (document.getElementById('rawPassword')) document.getElementById('rawPassword').value = getCookie('tmppswd') || '';
		if (document.getElementById('hiddenPassword')) document.getElementById('hiddenPassword').value = md5(getCookie('tmppswd')) || '';
		// 2. 判斷錯誤類型
		if (errMsg == 'A1') {    
			blkshow("帳號或密碼錯誤");
		} else if (errMsg == 'A2') {
			blkshow("驗證碼錯誤");
		} else {
			// A3: 重複登入處理
			blkshow("同一帳號於同一瀏覽器重複登入系統");
			
			// 移除驗證碼圖片
			for (let i = 1; i <= 4; i++) {
				let img = document.getElementById('img' + i);
				if (img) img.remove();
			}
			
			// 延遲跳轉至登出頁面清空狀態
			setTimeout(function() {
				document.location.href = "logOut.php";
			}, 2000);  
			
			return; // A3 狀態直接中斷，不要往下清 Cookie
		}

		// 3. 驗證失敗後，重新產生一組驗證碼圖片
		if (typeof refreshCaptcha === 'function') {
			refreshCaptcha();
		}

		// 4. 清除錯誤記錄 Cookie
		delCookie('errmsg');
		delCookie('tmpacnt');
		delCookie('tmppswd'); 
	
	}else{
	   blocksclose();
	}		
		
	
}
function blocksclose(event) {
	event = event || window.event;
	var target = (typeof getEventTarget === 'function') ? getEventTarget(event) : (event.target || event.srcElement);
	const modal = document.getElementById("myModal");
	if (modal) {
	   modal.remove();
	}
	return true;
}  

function encryptPassword() {
    const rawPasswordInput = document.getElementById('rawPassword');
    const hiddenPasswordInput = document.getElementById('hiddenPassword');

    // 確保密碼不為空才加密
    if (rawPasswordInput.value) {
        // 使用 CryptoJS 轉成 MD5
        //const hashedPassword = CryptoJS.MD5(rawPasswordInput.value).toString();
        const hashedPassword = md5(rawPasswordInput.value) ;
        // 將加密結果賦值給隱藏欄位
        hiddenPasswordInput.value = hashedPassword;
        
        // 清空明碼欄位（保護使用者隱私）
        rawPasswordInput.value = '';
    }
    
    return true; // 允許表單繼續送出
}
function clrinpt(event){    //登入畫面初始
  
    
	if (typeof event=="undefined"){
		   event=window.event;
    }
	var target=getEventTarget(event);    
	 
	 let i=3;		 	
         (function myLoop(i) {
             setTimeout(function() {			   
               inptclr(); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 500)
          })();                   //  pass the number of iterations as an argument 
    //detachEventListener(target,"click",false);
}

function inptclr(){
    document.getElementById('account').value='';			 
	document.getElementById('rawPassword').value=''; 
	document.getElementById('hiddenPassword').value=''; 
	document.getElementById('validcode').value='';
}

/* async function PasswordFromBackEnd(useraccount) {	
    const url = `RED/BKND/A01PassWord.php?timestamp=${Date.now()}`;
    const payload = `filename=${encodeURIComponent(useraccount)}`;		

    try {
        const response = await fetch(url, {
            method: 'POST',
			
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (!response.ok) throw new Error(`HTTP 錯誤: ${response.status}`);

        const rsp = await response.json();			
        
        if (rsp[0]) {             
            document.getElementById('oRiginpassword').value = rsp[0]['passWord'] ?? '';	 
            document.getElementById('oRiginID').value = rsp[0]['userId'] ?? '';	 
        }
    } catch (error) {
        console.error("無法讀取驗證資料:", error);
    }
} */