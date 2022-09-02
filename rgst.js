addLoadListener(initDialog);
function initDialog()
{   

     var blkshow = document.getElementById('rgstedit');  //註冊按鈕

	 attachEventListener(blkshow,"click",blockshow,false); //註冊按鈕程序
}
function blockshow(txtword)
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
	    dropsheet_content.style.fontSize="22px";	  	  
		dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
	   	
	    if (txtword!=event){             //判斷呼叫方傳來的(或是沒有傳來)的參數，若非事件表示從主畫面登入錯誤傳來的訊息	
		   var closeSpan = document.createElement('span')
 	       closeSpan.setAttribute("class","close");
	       closeSpan.style.color="#aaaaaa";
	       closeSpan.style.float="right";
	       closeSpan.style.fontSize="28px";
	       closeSpan.style.fontWeight="bold";
           closeSpan.innerHTML = '&times;';   
           attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	   dropsheet_content.appendChild(closeSpan);        //加進內容框		
			var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		    p_tx.style.color="blue";
	        p_tx.innerHTML=txtword;	                         　//將傳來的這一段文字加入準備顯示
			dropsheet_content.appendChild(p_tx);				
	    } else{		//若是事件表示直接從註冊申請按鈕點下去傳過來要求開視窗		　　　　　　　　　
		   var target=getEventTarget(event);		   
		   var dialog=document.createElement("div");		//開始從畫面產生註冊申請欄位
		   dialog.className="customDialog"; 		 
		   dialog.style.position="relative";		  		    
		   var dialogTitle=document.createElement("h1");
		
		       dialogTitle.appendChild(document.createTextNode("Join Us!"));
	
		   dialog.appendChild(dialogTitle);		  
		   var ajTable=document.createElement("table");	
		   ajTable.setAttribute("id","aplyform");
	       ajTable.style.width='95%';
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
		   var dialogButton1=document.createElement("input");		   
		   dialogButton1.setAttribute("type","button");
		   dialogButton1.setAttribute("class","btton");
		   dialogButton1.setAttribute("value","yes");
		   attachEventListener(dialogButton1,"click",confirmClick,false);	   	   
		   var dialogButton2=document.createElement("input");
		   dialogButton2.setAttribute("type","button");
		   dialogButton2.setAttribute("class","btton");
		   dialogButton2.setAttribute("value","No");
		   attachEventListener(dialogButton2,"click",reEdit,false);		   
		   var dialogButton3=document.createElement("input");
		   dialogButton3.setAttribute("type","button");
		   dialogButton3.setAttribute("class","btton");
		   dialogButton3.setAttribute("value","Cancle");
		   attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		   var oTd = oTr.insertCell(0);	   		     //將三個按鈕加入畫面   
	       oTd.appendChild(dialogButton1);
		   oTd.appendChild(dialogButton2);
		   oTd.appendChild(dialogButton3);		   		  
       	   oTd.setAttribute('colspan',2); 
	 	   oTd.setAttribute('style','text-align:center');

		      var oTr=ajTable.insertRow(ajTable,ajTable.length);		  
	          var oTd = oTr.insertCell(0);
   	          oTd.setAttribute('style','text-align:right');
	          oTd.innerHTML='電子信箱';
	          var oTd = oTr.insertCell(1);
	          oTd.innerHTML="<input type='text' name='txt_email' id='txt_email' class='txt checkEmail' maxlength='50' style='width:60%;' />";	
  	          var oTr=ajTable.insertRow(ajTable,ajTable.length);
	          var oTd = oTr.insertCell(0);
	          oTd.setAttribute('style','text-align:right');
	          oTd.innerHTML='聯絡電話';
       	      var oTd = oTr.insertCell(1);
	          oTd.innerHTML="<input type='text' name='txt_phone' id='txt_phone' class='txt checkPhone' maxlength='20' />";
		      var oTr=ajTable.insertRow(ajTable,ajTable.length);
	          var oTd = oTr.insertCell(0);
	          oTd.setAttribute('style','text-align:right');
	          oTd.innerHTML='您的生日';
	          var oTd = oTr.insertCell(1);
	          oTd.innerHTML="<input type='date' value='2021-04-10' name='txt_birth' id='txt_birth' class='txt checkBirth' autosize  />";		   
	       
	          var oTr=ajTable.insertRow(ajTable,ajTable.length);
	          var oTd = oTr.insertCell(0);
	          oTd.setAttribute('style','text-align:right');
	          oTd.innerHTML='您的大名';
	          var oTd = oTr.insertCell(1);
	          oTd.innerHTML="<input type='text' name='txt_name' id='txt_name' class='txt checkName' maxlength='10' autosize  />";
			   		   
		       dropsheet_content.style.height="58%";    //原訊息內框畫面要拉高
		    
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	       var oTd = oTr.insertCell(0);
	       oTd.setAttribute('style','text-align:right');
	       oTd.innerHTML='再次確認密碼';
	       var oTd = oTr.insertCell(1);
	       oTd.innerHTML="<input type='password' name='txt_password_chk' id='txt_password_chk' class='txt checkPassword)chk' maxlength='10' autosize  />";
		   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	       var oTd = oTr.insertCell(0);
	       oTd.setAttribute('style','text-align:right');
	       oTd.innerHTML='您的密碼';
	       var oTd = oTr.insertCell(1);
	       oTd.innerHTML="<input type='password' name='txt_password' id='txt_password' class='txt checkPassword' maxlength='10' autosize  />";

		   

		      var oTr=ajTable.insertRow(ajTable,ajTable.length);
	          var oTd = oTr.insertCell(0);
	          oTd.setAttribute('style','text-align:right');
	          oTd.innerHTML='登入帳號';
	          var oTd = oTr.insertCell(1);
	          oTd.innerHTML="<input type='text' name='txt_account' id='txt_account' class='txt checkAccount' maxlength='15' autosize  />"; 			 
		  
           var formJason=document.createElement('form');		   
		   formJason.id="formdata";
	       formJason.appendChild(ajTable);		     		  		  		   	  	   
		   dialog.appendChild(formJason)
	       dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  
		   dropsheet_content.style.backgroundImage="url('http://localhost/blgex/src/lotus.jpg')";  //並有背景圖
		   dropsheet_content.appendChild(dialog);
		   
		       document.getElementById("txt_account").focus();
		  
	    }
	　  return true;
}
function reEdit(event)   //註冊資料再作編輯修正
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var regrest=document.getElementById("txt_account");
 
	    document.getElementById("txt_account").focus();
	
	return true;
}	
function blocksclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
/* 	detachEventListener(window,"click",blocksclose,false); */
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
	
	return true;
}	

function confirmClick(event){     //註冊輸入資料與修改密碼檢查程序
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	

    var customerAccount=document.getElementById("txt_account");	
	
		var customerName=document.getElementById("txt_name");	
	    var customerBirth=document.getElementById("txt_birth");
	    var customerPhone=document.getElementById("txt_phone");
	    var customerEmail=document.getElementById("txt_email");
	
	var customerPassword=document.getElementById("txt_password");
    var customerPassword_chk=document.getElementById("txt_password_chk");	    
	
	    if(!/^[a-zA-Z0-9]/.test(customerAccount.value)){
		    if(!customerAccount.nextSibling){
		      var errorSpan1=document.createElement("span");
		      var errorMessage1=document.createTextNode("請建立有字元的帳號");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      customerAccount.parentNode.appendChild(errorSpan1);
		    }	 
		    customerAccount.focus();
		    return false ;
        }else{
		    if(customerAccount.nextSibling){
		      customerAccount.parentNode.removeChild(customerAccount.nextSibling);
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
	
	    if(!/^[\u0391-\uFFE5]+$/.test(customerName.value)){
		   if(!customerName.nextSibling){
		       var errorSpan1=document.createElement("span");
		       var errorMessage1=document.createTextNode("請輸入中文姓名");
		       errorSpan1.appendChild(errorMessage1);
		       errorSpan1.className="errorMsg";
		       customerName.parentNode.appendChild(errorSpan1);
		    }	 
		    customerName.focus();
		    return false ;
       }else{
		    if(customerName.nextSibling){
	    	   customerName.parentNode.removeChild(customerName.nextSibling);
		    }
 
	    }
    	if(!/^(\(\d+\)?)?(\d+[\-])*\d+$/.test(customerPhone.value)){
	    	if(!customerPhone.nextSibling){
	    		var errorSpan2=document.createElement("span");
		        var errorMessage2=document.createTextNode("不正確的電話號碼");
		        errorSpan2.appendChild(errorMessage2);
		        errorSpan2.className="errorMsg";
		        customerPhone.parentNode.appendChild(errorSpan2); 			 
		    }	       
		       customerPhone.focus();
		      return false ;
	
	    }else{
		    if(customerPhone.nextSibling){
	    	    customerPhone.parentNode.removeChild(customerPhone.nextSibling);
		    }				 
	    }
	    if(customerEmail.value!="" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(customerEmail.value)){
	         if(!customerEmail.nextSibling){
		    	var errorSpan3=document.createElement("span");
		        var errorMessage3=document.createTextNode("不正確的電郵帳號");
		        errorSpan3.appendChild(errorMessage3);
		        errorSpan3.className="errorMsg";
		        customerEmail.parentNode.appendChild(errorSpan3); 
		     }		  
		       customerEmail.focus();
		       return false;	     
	    }else{
	    	if(customerEmail.nextSibling){
	    		customerEmail.parentNode.removeChild(customerEmail.nextSibling);
		    }		 
	    }    
        		
	if(customerAccount==null){  	//
	   var rspns=TableToJson("jis",customerPassword.value,"","","","");
	}else{
	    var rspns=TableToJson(customerAccount.value,customerPassword.value,customerName.value,customerBirth.value,customerPhone.value,customerEmail.value);
	}	
	blocksclose();			//關掉原視窗	
	blockshow(rspns);      //顯示註冊資訊視窗
	return true;	 	
}

/////  將table內容資料轉為jason
function TableToJson(account,password,name,birth,telephone,email) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為註冊內容
	 		
        var rsp="";
        var rspns="You have joined us!";	
	    var order_head="{"+"\""+"Account"+"\""+":"+"\""+account+"\""+",";	
	    order_head+="\""+"Password"+"\""+":"+"\""+password+"\""+",";
	    order_head+="\""+"Name"+"\""+":"+"\""+name+"\""+",";		
		order_head+="\""+"Birth"+"\""+":"+"\""+birth+"\""+",";
		order_head+="\""+"Telephone"+"\""+":"+"\""+telephone+"\""+",";
	    order_head+="\""+"Email"+"\""+":"+"\""+email+"\"";		        
    
	var json =order_head+"}";
    var str_json=JSON.stringify(json);	 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respond;
 
     request.open("POST", "blgmbwrt.php", true);        //新增記錄的php檔
 
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;
        }
    }  
    
    if (rsp.length == 0){
       return rspns; 	
	   document.getElementById('rgstedit').style.display="none"; //註冊資料寫入成功後註冊按鈕此時已經可以不用顯現 
	}else{
	  
	  return rsp;
	}   	
	//return json;　　　//測試資料用
}  

	 
	 

