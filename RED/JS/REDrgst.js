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
function sendFilePrc(updflg){     //新增資料及修改程序       
	var tbjsn=[];
	var nonjsn=[];
	var tbno=0;
	var myPassword=document.getElementById('oRiginpassword').value;		     
    //----資料寫入資料庫前過濾程序區-----//
	var REDelements=document.getElementsByName('REDupdate');	
	if(REDelements[0].value!=myPassword ){
		 filtermsg(REDelements[0],"與原密碼不同");
	     REDelements[0].focus();
	    	return false ;
    }else{
	    if(REDelements[0].nextSibling){
	    	REDelements[0].parentNode.removeChild(REDelements[0].nextSibling);
	    }     
	}						
	
	if(!/^[a-zA-Z0-9]/.test(REDelements[1].value)){
		filtermsg(REDelements[1],"請建立有字元的密碼");
		REDelements[1].focus();
		return false ;
   }else{
	   
		if(REDelements[1].nextSibling){
		   REDelements[1].parentNode.removeChild(REDelements[1].nextSibling);
		}
	}	
	if(myPassword==REDelements[1].value){
		filtermsg(REDelements[1],"與原密碼相同");
		REDelements[1].focus();
		return false ;
   }else{
	   
		if(REDelements[1].nextSibling){
		   REDelements[1].parentNode.removeChild(REDelements[1].nextSibling);
		}
	}	
	if(REDelements[2].value!=REDelements[1].value){
		filtermsg(REDelements[2],"確認密碼不符");
		REDelements[2].focus();
		return false ;
   }else{
		if(REDelements[2].nextSibling){
		   REDelements[2].parentNode.removeChild(REDelements[2].nextSibling);
		} 
	}	
	for(var q=0;q<REDelements.length;q++){  	    //開始堆疊待異動資料陣列 REDelements.length	
		tbjsn.push(REDelements[q].value);	   
	}	
    //--------過濾區結束----------//	
	var myCookieUser_id = document.getElementById('oRiginID').value; //取得目前使用者的記錄號碼
	tbjsn.push(myCookieUser_id);		  	
	var rspns=TableToJson(tbjsn,nonjsn,tbno);       
	 
    blocksclose();			//關掉原視窗   
    return true;	 	
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位            
    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	 oTd.innerHTML='再確認:';
	 var oTd = oTr.insertCell(1);				 	            								   
	 oTd.innerHTML="<input type='password' name='REDupdate' id='txt_password_chk' class='txt' style='width:50%;'  />";	   
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='新密碼:';
	var oTd = oTr.insertCell(1);			
    oTd.innerHTML="<input type='password' name='REDupdate' id='txt_password' class='txt'  style='width:50%;'  />";                             				  
	var oTr=ajTable.insertRow(ajTable,ajTable.length);	            
	var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='原密碼:';
	var oTd = oTr.insertCell(1);				 
	oTd.innerHTML="<input type='password' name='REDupdate' id='orgtxt_password' class='txt' style='width:50%;'  />";  
    var oTr=ajTable.insertRow(ajTable,ajTable.length);	            
	var oTd = oTr.insertCell(0);
	oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='紀錄原密碼:';
	var oTd = oTr.insertCell(1);				 
	oTd.innerHTML="<input type='password' name='REDrecord' id='oRiginpassword' class='txt' style='width:50%;'  />";
	var oTd = oTr.insertCell(2);
	oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='使用者ID:';
	var oTd = oTr.insertCell(3);				 
	oTd.innerHTML="<input type='text' name='REDrecord' id='oRiginID' class='txt' style='width:50%;'  />";
    oTr.setAttribute("style","display:none;");   	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	  dropsheet_content.style.width="45%";   //原訊息內框畫面寬度調整  
      dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){		
	PasswordFromBackEnd(getCookie('useraccount')?getCookie('useraccount'):getAuth[1]()[0]);  //紀錄原始密碼   //PasswordFromBackEnd(getCookie('useraccount'));  //紀錄原始密碼   
	document.getElementById("orgtxt_password").focus();	
}

function  addNewRecordHint(tbno){
    return "修改密碼：";
}


function PasswordFromBackEnd(useraccount){	
    
	var getPassword="";
	var sendSrcRec="filename="+useraccount;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="RED/BKND/A01PassWord.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);			 						  
			 document.getElementById('oRiginpassword').value=rsp[0]['passWord'];	 
			  document.getElementById('oRiginID').value=rsp[0]['userId'];	 
		  }
	}
	return ;
}