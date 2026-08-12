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
		     
    //----資料寫入資料庫前過濾程序區-----//
	var REDelements=document.getElementsByName('REDupdate');
	 
	
	
	if(md5(REDelements[0].value)!=getAuth[3]()[0].passWord){	
		 filtermsg(REDelements[0],"與原密碼不同");
	     REDelements[0].focus();
	    	return false ;
    }else{
	    if(REDelements[0].nextSibling){
	    	REDelements[0].parentNode.removeChild(REDelements[0].nextSibling);
	    }     
	}						
	
	if(!/^[a-zA-Z0-9]+$/.test(REDelements[1].value)){
		filtermsg(REDelements[1],"請建立有字元的密碼");
		REDelements[1].focus();
		return false ;
   }else{
	   
		if(REDelements[1].nextSibling){
		   REDelements[1].parentNode.removeChild(REDelements[1].nextSibling);
		}
	}	

	if(	getAuth[3]()[0].passWord==md5(REDelements[1].value)){
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
	
    //--------過濾區結束----------//	
	//var myCookieUser_id = document.getElementById('oRiginID').value; //取得目前使用者的記錄號碼
	var myCookieUser_id = getAuth[3]()[0].userId; //取得目前使用者的記錄號碼
	var mdPassword=md5(document.getElementById('txt_password_chk').value);
	tbjsn.push(myCookieUser_id);	
    tbjsn.push(mdPassword);	
	var rspns=TableToJson(tbjsn,nonjsn,tbno);       	 
    blocksclose();			//關掉原視窗  	
	delCookie('useraccount');
	return true;	 	
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位            
    var oTr=ajTable.insertRow(0);
	
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	 oTd.innerHTML='再確認:';
	 var oTd = oTr.insertCell(1);				 	            								   
	 oTd.innerHTML="<input type='password' name='REDupdate' id='txt_password_chk' class='txt' style='width:50%;'  />";	   
	 var oTr=ajTable.insertRow(0);
	 
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='新密碼:';
	var oTd = oTr.insertCell(1);			
    oTd.innerHTML="<input type='password' name='REDupdate' id='txt_password' class='txt'  style='width:50%;'  />";                             				  
	var oTr=ajTable.insertRow(0);	            
	
	var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:20%');	
	oTd.innerHTML='原密碼:';
	var oTd = oTr.insertCell(1);				 
	oTd.innerHTML="<input type='password' name='REDupdate' id='orgtxt_password' class='txt' style='width:50%;'  />";  
 
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	  dropsheet_content.style.width="45%";   //原訊息內框畫面寬度調整  
      dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){		
	//PasswordFromBackEnd(getCookie('useraccount')?getCookie('useraccount'):getAuth[1]()[0]);  //紀錄原始密碼   //PasswordFromBackEnd(getCookie('useraccount'));  //紀錄原始密碼   
	PasswordFromBackEnd();
	document.getElementById("orgtxt_password").focus();	
}

function  addNewRecordHint(tbno){
    return "修改密碼：";
}


//async function PasswordFromBackEnd(useraccount) {	
async function PasswordFromBackEnd() {	
    const url = `RED/BKND/A01PassWord.php?timestamp=${Date.now()}`;
    const payload ="";  //`filename=${encodeURIComponent(useraccount)}`;		
    getAuth[3]('Clear_All');		
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
 
		    getAuth[3](rsp[0]);			
        }
    } catch (error) {
        console.error("無法讀取驗證資料:", error);
    }
}