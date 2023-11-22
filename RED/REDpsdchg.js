addLoadListener(initDialog);
function initDialog()
{        
	  var myAccount=Cookies.get('useraccount');
	 
	 var i;
	 
	 if(!myAccount){
         (function myLoop(i) {
             setTimeout(function() {
               blkshow("請先從登入畫面登入帳號密碼"); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 9000)
          })(10);                   //  pass the number of iterations as an argument

        
		document.location.href="logOut.php";
     }
	
	  
}
function redmenuchange(event){    //畫面展開縮起來
	//通過父元素li，找到兄弟元素ul
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var oSecondDiv = target.parentNode.getElementsByTagName("ul")[0];
	//CSS交替更換來實現顯、隱
	if(oSecondDiv!=undefined){
  	   if(oSecondDiv.className == "myHide"){	 	
	      oSecondDiv.className = "myShow";			  
		 
		  //pageScroll();
	
	   }
	    else{
	   	  oSecondDiv.className = "myHide";	
          //disableScroll();
	   }
	}		
	 
	
}
function excuteFun(event){
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var exucPrgNo=target.childNodes[0].textContent.slice(0,3)+'.html';
	var authArray=target.parentNode.childNodes[1].textContent.split("");  //切割成陣列	
	for(var i=1;i<10;i++){
		var authorder='auth'+paddingLeft(i.toString(),2);
		 
		if(authArray[i-1]=='Y'){  //auth01:新增  auth02:修改 auth03:刪除  auth04:列印....
		  setCookie(authorder,'Y');
	    }else{
	       setCookie(authorder,'');
		}  
		
	}
	var documentHeight=document.documentElement.offsetHeight;
		  var viewportHeight=window.innerHeight;
		  
		  window.scrollTo(0, documentHeight-viewportHeight); 
	document.location.href=exucPrgNo;
}	

function blockshow(txtword)    //變更密碼程序
{
/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
  var dropext=document.getElementById('myModal');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal");
	dropsheet.setAttribute("class","modal");
	dropsheet.style.display="block";	   
    dropsheet.style.position="fixed"; /* Stay in place */       		
    dropsheet.style.left="0";
    dropsheet.style.top="0";
    dropsheet.style.width="100%"; /* Full width */
    dropsheet.style.height="100%";  
	dropsheet.style.zIndex="1";
	dropsheet.style.paddingTop="100px"; /* Location of the box */
	dropsheet.style.overflow="auto";     /* Enable scroll if needed */	
    dropsheet.style.backgroundColor = "rgba(0,0,0,0.4)"; /* Black w/ opacity 外層黑透內層白底*/
	var body=document.getElementsByTagName("body")[0];
	body.appendChild(dropsheet);            //最外層<div>加入body
    var dropsheet_content=document.createElement('div');
	dropsheet_content.setAttribute("id","modal-content");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="38%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	  /*22*/
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
	    if (txtword!=event){             //判斷呼叫方傳來的(或是沒有傳來)的參數，若非事件表示從主畫面登入錯誤傳來的訊息	
		    dropsheet_content.style.width="38%";
		   var closeSpan = document.createElement('span')		   	
 	       closeSpan.setAttribute("class","close");
	       closeSpan.style.color="#aaaaaa";
	       closeSpan.style.float="right";
	       closeSpan.style.fontSize="28px";   /*28*/
	       closeSpan.style.fontWeight="bold";
           closeSpan.innerHTML = '&times;';   
           attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	   dropsheet_content.appendChild(closeSpan);        //加進內容框		
			var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		    p_tx.style.color="blue";
	        p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
			dropsheet_content.appendChild(p_tx);				
	    } else{		//若是事件表示直接修改密碼按鈕點下去傳過來要求開視窗	
	       var headtitle='帳號:'+Cookies.get('useraccount') ;
	      dropsheet.style.paddingTop="20px"; /* Location of the box */
		    	
		  // var target=getEventTarget(event);		   
		  // dropsheet_content.style.width="50%";
		   var dialog=document.createElement("div");		//開始從畫面密碼修改欄位
		   dialog.className="customDialog"; 		 
		   dialog.style.position="relative";		  		    
		    var dialogTitle=document.createElement("div");		
			dialogTitle.setAttribute("style","font-size:medium;font-family:標楷體; color:#A42D00;");
		    dialogTitle.appendChild(document.createTextNode(headtitle));	
		    dialog.appendChild(dialogTitle);		   	
		     
		   
		   		  
		    var ajTable=document.createElement("table");	
			
		    ajTable.setAttribute("id","aplyform");
	        ajTable.style.width='100%';
		  
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
		   
		   
		   var dialogButton1=document.createElement("input");		   
		   dialogButton1.setAttribute("type","button");
		   dialogButton1.setAttribute("class","btn");
		   dialogButton1.setAttribute("value","確認");
		   attachEventListener(dialogButton1,"click",confirmClick,false);	   	   
	
		   var dialogButton3=document.createElement("input");
		   dialogButton3.setAttribute("type","button");
		   dialogButton3.setAttribute("class","btn");
		   dialogButton3.setAttribute("value","取消");
		   attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		   var oTd = oTr.insertCell(0);	   		     //將兩個按鈕加入畫面   
	       oTd.appendChild(dialogButton1);		 
		   oTd.appendChild(dialogButton3);		   		  
       	   oTd.setAttribute('colspan',2); 
	 	   oTd.setAttribute('style','text-align:center');
		 		  		   
		   //dropsheet_content.style.height="50%";    //只是修改密碼畫面不需要那麼高畫面要拉高
	
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	       var oTd = oTr.insertCell(0);
	       oTd.setAttribute('style','text-align:right;font-size:medium;');
	       oTd.innerHTML='再確認';
	       var oTd = oTr.insertCell(1);
	       oTd.innerHTML="<input type='password' name='txt_password_chk' id='txt_password_chk' class='txt checkPassword)chk' maxlength='10' style='width:30%;'  />";
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	       var oTd = oTr.insertCell(0);
	       oTd.setAttribute('style','text-align:right;font-size:medium;' );
	       oTd.innerHTML='新密碼';
	       var oTd = oTr.insertCell(1);
	       oTd.innerHTML="<input type='password' name='txt_password' id='txt_password' class='txt checkPassword' maxlength='10' style='width:30%;'  />";
		 		  
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	           var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right;font-size:medium;');
	            oTd.innerHTML='原密碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='password' name='txt_orgpassword' id='orgtxt_password' class='txt orgcheckPassword' maxlength='10' style='width:30%;'  />";
		  
		   

           var formJason=document.createElement('form');		   
		   formJason.id="formdata";
	       formJason.appendChild(ajTable);		     		  		  		   	  	   
		   dialog.appendChild(formJason)
	       dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  
		   dropsheet_content.appendChild(dialog);		
		 
		   dropsheet_content.style.backgroundColor='#CCA6A3';
		    

		   document.getElementById("orgtxt_password").focus();
	    }
        return true;
}

function blocksclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);

	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
	
	return true;
}	

function confirmClick(event){     //修改密碼檢查程序
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	
	var customerOrgPassword=document.getElementById("orgtxt_password");  //原始密碼
	var customerPassword=document.getElementById("txt_password");      //設定新密碼
    var customerPassword_chk=document.getElementById("txt_password_chk");	//再次打入確認的新密碼
    var myCookiePassword = Cookies.get('password'); //取得目前cooike紀錄的密碼
	//var md5cmp=md5(customerOrgPassword.value); 	 暫時不用md5編碼	 
	if(customerOrgPassword.value!=myCookiePassword ){
	    if(!customerOrgPassword.nextSibling){
   	    	var errorSpan1=document.createElement("span");
    		var errorMessage1=document.createTextNode("與原始密碼不符");
    		errorSpan1.appendChild(errorMessage1);
    		errorSpan1.classId="errorMsg";
    		customerOrgPassword.parentNode.appendChild(errorSpan1);
    	}	 
	       customerOrgPassword.focus();
	    	return false ;
       }else{
	    	if(customerOrgPassword.nextSibling){
	    	   customerOrgPassword.parentNode.removeChild(customerOrgPassword.nextSibling);
	    	}     
	    }						
			
	if(!/^[a-zA-Z0-9]/.test(customerPassword.value)){
		if(!customerPassword.nextSibling){
		   var errorSpan1=document.createElement("span");
		   var errorMessage1=document.createTextNode("請建立有字元的密碼");
		   errorSpan1.appendChild(errorMessage1);
		   errorSpan1.classId="errorMsg";
		   customerPassword.parentNode.appendChild(errorSpan1);
		}	 
		customerPassword.focus();
		return false ;
   }else{
	   
		if(customerPassword.nextSibling){
		   customerPassword.parentNode.removeChild(customerPassword.nextSibling);
		}
	}	
	if(myCookiePassword==customerPassword.value){
		if(!customerPassword.nextSibling){
		   var errorSpan1=document.createElement("span");
		   var errorMessage1=document.createTextNode("與原密碼相同");
		   errorSpan1.appendChild(errorMessage1);
		   errorSpan1.classId="errorMsg";
		   customerPassword.parentNode.appendChild(errorSpan1);
		}	 
		customerPassword.focus();
		return false ;
   }else{
	   
		if(customerPassword.nextSibling){
		   customerPassword.parentNode.removeChild(customerPassword.nextSibling);
		}
	}	
	if(customerPassword_chk.value!=customerPassword.value){
		if(!customerPassword.nextSibling){
		   var errorSpan1=document.createElement("span");
		   var errorMessage1=document.createTextNode("確認密碼不符");
		   errorSpan1.appendChild(errorMessage1);
		   errorSpan1.classId="errorMsg";
		   customerPassword_chk.parentNode.appendChild(errorSpan1);
		}	 
		customerPassword_chk.focus();
		return false ;
   }else{
		if(customerPassword_chk.nextSibling){
		   customerPassword_chk.parentNode.removeChild(customerPassword_chk.nextSibling);
		} 
	}
       var myCookieACccount = Cookies.get('username'); //取得cookie目前記錄得id號碼
	   var myCookieUser_id = Cookies.get('userid'); //取得cookie目前記錄得id號碼
	
  
	   var rspns=TableToJson(myCookieUser_id,myCookieACccount,customerPassword.value);
  
	blocksclose();			//關掉原視窗	
		
	
	blockshow(rspns);      //顯示修改密碼資訊視窗

	 
	
	 var repsdchg=document.getElementById('repsd');       //修改密碼按鈕
     repsdchg.parentNode.removeChild(repsdchg);
	 //repsdchg.style.display="none";                  //此時就隱藏了
	return true;	 	
}

/////  將table內容資料轉為jason
function TableToJson(user_id,account,password) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為註冊或密碼修改內容
	
        var rsp="";
	    var rspns="密碼已變更！下次登入請記得使用新密碼。"
		var order_head="{"+"\""+"Password"+"\""+":"+"\""+password+"\""+",";
            order_head+="\""+"User_id"+"\""+":"+"\""+user_id+"\""+",";					
		    order_head+="\""+"Account"+"\""+":"+"\""+account+"\"";		 
		    
	var json =order_head+"}";
    var str_json=JSON.stringify(json);	 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respond;

		request.open("POST", "RED/REDpdchg.php", true);        //更改密碼的的php檔
		
	 
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;
        }
    }     
	 

    if (rsp.length == 0){
       return rspns; 	
	  
	  
	}else{
	  
	  return rsp;
	}   
	//return json;  //測試資料用
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
function getCookie(sName) {
    var aCookie = document.cookie.split('; ');
    for (var i=0; i < aCookie.length; i++) {
    var aCrumb = aCookie[i].split('=');
    if (sName == aCrumb[0])
    return decodeURI(aCrumb[1]);
 }
 return '';
}
/* function pageScroll() {
    	window.scrollBy(0,50); // horizontal and vertical scroll increments
	    
    	var scrolldelay = setTimeout('pageScroll()',100); // scrolls every 100 milliseconds
		
		return false;
} */
 /* function disableScroll() {
            // Get the current page scroll position
            scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
            scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft,
         
                // if any scroll is attempted,
                // set this to the previous value
                window.onscroll = function() {
                    window.scrollTo(scrollLeft, scrollTop);
                };
        }
         
        function enableScroll() {
            window.onscroll = function() {};
        } */