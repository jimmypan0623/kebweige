addLoadListener(initDialog);
function initDialog()
{        
	  var myAccount=Cookies.get('useraccount');
	  //var myAccount=getCookie('useraccount');
	
	 
	 var i;
	 //if(myAccount==null){		 
	 if(!myAccount){
         (function myLoop(i) {
             setTimeout(function() {
               blkshow("請先從登入畫面登入帳號密碼"); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 9000)
          })(10);                   //  pass the number of iterations as an argument

        
		document.location.href="logOut.php";
     }else	{
	    document.getElementById('user_who').innerHTML=myAccount;
   
    	 var logoutbtn=document.getElementById('lgt');     	 //登出按鈕
	   
    	 attachEventListener(logoutbtn,"click",outprocs,false);  //登出按鈕程序
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (Cookies.get('auth01')=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
         }			 
	     var edtrcath=document.getElementById('EDIT_BOTT');
		 if (Cookies.get('auth02')=='Y'){			 
	        edtrcath.style.visibility="visible";
			attachEventListener(edtrcath,"click",edtrec,false);  //修改紀錄按鈕程序
		 }else{
			edtrcath.style.visibility="hidden";
		 }
	     var delrcath=document.getElementById('DEL_BOTT');
		 if (Cookies.get('auth03')=='Y'){
			 delrcath.style.visibility="visible";
			 attachEventListener(delrcath,"click",delrec,false);  //刪除紀錄按鈕程序
		 }else{
		     delrcath.style.visibility="hidden";
		 }
		 var srchstockno=document.getElementById("B01_BOTT");
		  if (Cookies.get('auth08')=='Y'){
			  srchstockno.style.visibility="visible";
		     attachEventListener(srchstockno,"click",stknosrch,false);  //相關料號搜尋紀錄按鈕程序
		  }else{
			  srchstockno.style.visibility="hidden";
		  }
	     var keyfield=document.getElementById('recfield');
		 attachEventListener(keyfield,"change",keysrchchg,false);  //檢核按鈕程序
		 var myRow=document.getElementById("headrow");
	 
		 myRow.cells[1].style.backgroundColor="#1AFD9C";   //初始值設定第一個欄位為預設搜尋鍵值故顯示顏色

			  var newth=document.createElement('th');
			  newth.setAttribute("style","width:41px;");
			  
			  newth.setAttribute("id","AUTH");
			  newth.innerHTML="選取";
			  
			  myRow.appendChild(newth);
			  myRow.childNodes[myRow.childNodes.length-3].setAttribute("style","width:41px;");		       

	
     }
}
function outprocs(event){	  
    if (typeof event=="undefined"){
		event=window.event;
	}
   
	
	history.back();
	
}


//新增紀錄按鈕程序
 function addrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko(0)>0){
		blkshow("請取消勾選待修改或刪除的紀錄，再新增");
		return false;
	}	 
	blkshow(1);
} 
 //修改紀錄
function edtrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko(0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行修改");
		return false;
	}else if(cko(0)>1){
		blkshow("一次只能修改一筆紀錄，請留一筆勾選再執行");
		return false;
	} 
    blkshow(2); 		
} 
//相關料號搜尋紀錄按鈕程序
function stknosrch(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko(0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行查詢");
		return false;
	}else if(cko(0)>1){
		blkshow("一次只能查詢一筆紀錄，請留一筆勾選再執行");
		return false;
	} 
    blkshow(3); 		
} 

//刪除紀錄
function delrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko(0)==0){
		blkshow("未勾選任何紀錄，請至少勾選一筆再按此鈕執行刪除");	
		return false;	
    } 
	
	blkshow(4);

}
function keysrchchg(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);
	var responseDiv=document.getElementById("serverResponse");
	 
	responseDiv.innerHTML='&nbsp';
	var tables=getElementsByAttribute("class","datalist");
    var ths=tables[0].getElementsByTagName("th");		
    var idx=(target.value.slice(-1));	
	for (var i=1;i<ths.length;i++){
		if(i==idx){
			ths[i].style.backgroundColor="#1AFD9C";//background-color:#F2E6E6;;#778812
			 
			var strUser = target.options[i-1].text;
			
		}else{
			ths[i].style.backgroundColor="#F2E6E6";//background-color:#F2E6E6;
		}
	}
}

function getCookie(sName) {
    var aCookie = document.cookie.split('; ');
    for (var i=0; i < aCookie.length; i++) {
    var aCrumb = aCookie[i].split('=');
    if (sName == aCrumb[0])
    return decodeURI(aCrumb[1]);
 }
 return '';
}


function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
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

function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
