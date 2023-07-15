function blkshow(txtword)
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
    if (isNaN(Number(txtword))){         //如果傳進來的參數是字串
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
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
    }else{

		      //新增||修改||刪除
			 if(txtword==1){       //是新增
               var headtitle="建立帳號,請輸入以下欄位：";
			 }else if(txtword==5){              
			   var headtitle="請輸入搜尋鍵值";
             } else{			 //要不然就是刪除
			    var headtitle="確定刪除所勾選紀錄?";
	         }

		     if(txtword==2){   //如果是修改
			     var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var maintable=document.getElementById("member");
				 myThgrp=maintable.getElementsByTagName("th");		 				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 
		            if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){
					   for (j=0;j<myThgrp.length-1;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   
			   	   
                       break;					   
			         }
		          } 
				 var headtitle="登入帳號："+aWaitUpdate[1];
		     } 
			 
		    dropsheet.style.paddingTop="20px"; /* Location of the box */
		    var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
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
	        if(txtword==2 || txtword==4 || txtword==5){
			    var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","確認");
				
				if(txtword==2){
		           attachEventListener(dialogButton1,"click",editFilePrc,false);	
			    }else if(txtword==4){
				   attachEventListener(dialogButton1,"click",delConfirm,false);	
				}else{
				    attachEventListener(dialogButton1,"click",srchBtnClick,false);	
				}
			}
		    var dialogButton3=document.createElement("input");
		    dialogButton3.setAttribute("type","button");
		    dialogButton3.setAttribute("class","btn");
		    dialogButton3.setAttribute("value","放棄");
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if (txtword==2 || txtword==4 ||txtword==5){
               oTd.appendChild(dialogButton1);	         //修改就兩個			   
			}
			if(txtword==1){    //如果是新增
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);	                 
			    oTd.innerHTML="<input type='button' class='btn' id='btn_uploadfile' value='確認' onclick='sendFilePrc(1);' >";                                                                             			
 	         }
		    oTd.appendChild(dialogButton3);		   		  //加入放棄按鈕  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
			 if(txtword==1 || txtword==2){  //如果不是刪除		
                 var oTr=ajTable.insertRow(ajTable,ajTable.length);			 
			     var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right');
	             oTd.innerHTML='生效日期';
	             var oTd = oTr.insertCell(1);				 	             
				 oTd.innerHTML="<input type='date' value='2021-10-31' name='valid_date' id='valid_date' class='txt'   autosize  />"; 	
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);			 
			     var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right');
	             oTd.innerHTML='員工編號';
	             var oTd = oTr.insertCell(1);				 
	             oTd.innerHTML="<input type='text' name='staff_no' id='staff_no' class='txt checkStaff ' maxlength='20'  autosize  />"; 
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='電郵信箱';
	            var oTd = oTr.insertCell(1);				 	            
                oTd.innerHTML="<input type='text' name='txt_email' id='txt_email' class='txt checkEmail' maxlength='50' style='width:80%;' />";	
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right');
	             oTd.innerHTML='連絡電話';
	             var oTd = oTr.insertCell(1);
	             oTd.innerHTML="<input type='text' name='tch_phone' id='tch_phone' class='txt checkPhoneNo' maxlength='25' autosize/>"; 				
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
				
	            oTd.innerHTML='部門編號';
	            var oTd = oTr.insertCell(1);
				var slt3=document.createElement("select");
				slt3.setAttribute("id","dptnoopt");
				 
				oTd.appendChild(slt3);
				//oTd.innerHTML="<input type='text' name='depart_no' id='depart_no' class='txt checkDepartNo' maxlength='30' autosize  />"; 
				 
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='姓    名';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='txt_name' id='txt_name' class='txt checkName' maxlength='20' autosize  />";    				
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='密    碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='password' name='lgn_psd' id='lgn_psd' class='txt checkPassword' maxlength='25' autosize  />"; 
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='登入帳號';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='login_no' id='login_no' class='txt checkAccount' maxlength='10' autosize  />";      
                if(txtword==2){   //如果是修改	
                   oTr.setAttribute("style","display:none;");			
			    }
				
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='rcrd_no' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");		
                if(txtword==2){		
				   optionitem(aWaitUpdate[4]);
                }else{
					optionitem("xx");
				}
			   
             }else if(txtword==5){
				   var oTr=ajTable.insertRow(ajTable,ajTable.length);  
	               var oTd = oTr.insertCell(0);
	               oTd.setAttribute('style','text-align:right');
	               oTd.innerHTML='搜尋';
				   var optkeyselect=document.createElement('select');
				   optkeyselect.setAttribute("id","optkey");				 
				   oTd.appendChild(optkeyselect);
	               var oTd = oTr.insertCell(1);
	               oTd.innerHTML="<input type='text' name='srchvalue' id='srchvalue' class='txt' maxlength='20' autosize  />";   
				                 
                
			 }				 
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);		     		  		  		   	  	   
		     dialog.appendChild(formJason)
	         dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  		  
		     dropsheet_content.appendChild(dialog);	
              			 
             if (txtword==1){                                     //如果是新增
				document.getElementById("login_no").focus();	
				var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
			     document.getElementById("valid_date").value=thtdy;  //日期都設為今天
			
			 }else if(txtword==2){                                                      //如果是修改
				  document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來
				  document.getElementById("lgn_psd").value=aWaitUpdate[2];       //密碼			
				  document.getElementById("txt_name").value=aWaitUpdate[3];     //姓名						     
			      document.getElementById("dptnoopt").value= aWaitUpdate[4];       //部門代號				
				  document.getElementById("tch_phone").value=aWaitUpdate[6];      //連絡電話	
                  document.getElementById("txt_email").value=aWaitUpdate[7];      //電子郵件帳號		
				  document.getElementById("staff_no").value=aWaitUpdate[8];      //員工編號
				  document.getElementById("valid_date").value=aWaitUpdate[9];      //生效日期
				
				  document.getElementById("lgn_psd").focus();	
			 }else if(txtword==5){
				 var slt5=document.getElementById("optkey");
				 srchcolumn(slt5);   //回主畫面新增可搜尋的欄位

				 var txtvalue=document.getElementById("srchvalue");
				
				 attachEventListener(txtvalue,'keypress',txtEnter,false); 
				 txtvalue.focus();	
			 }				 				 
		  	

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

/////  將table內容資料轉為jason
function TableToJson(loginno,lgnpsd,txtname,departno,tchphone,txtemail,staffno,validdate,nbrflag) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為新增內容
	 	
        var rsp="";
        
	    var order_head="{"+"\""+"Loginno"+"\""+":"+"\""+loginno+"\""+",";	
	    order_head+="\""+"Lgnpsd"+"\""+":"+"\""+lgnpsd+"\""+",";	 
		order_head+="\""+"Txtname"+"\""+":"+"\""+txtname+"\""+",";
		order_head+="\""+"Departno"+"\""+":"+"\""+departno+"\""+",";	
		order_head+="\""+"Tchphone"+"\""+":"+"\""+tchphone+"\""+",";		
		order_head+="\""+"Txtemail"+"\""+":"+"\""+txtemail+"\""+",";
		order_head+="\""+"Staffno"+"\""+":"+"\""+staffno+"\""+",";
		order_head+="\""+"Validdate"+"\""+":"+"\""+validdate+"\""+",";
	    order_head+="\""+"NbrFlag"+"\""+":"+"\""+nbrflag+"\"";		        
    
	var json =order_head+"}";
    var str_json=JSON.stringify(json);	 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respond;
 
     request.open("POST", "A02/A02wrt.php", true);        //新增記錄的php檔
 
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;			
			if(!isNaN(Number(rsp))){     //如果回傳為新增記錄號碼表示新增成功就做重刷一次畫面
 /* 			   if (nbrflag==1){          //這樣才能區分新增時翻到第一頁往上加			     
			      var PgeValue.value='001';			       
			   }else{ */
				    var PgeValue=document.getElementById('recmth') ;	 
//}
			     
			   choiceClick(PgeValue);     //僅修改或簽到即使這裡為'001'還是停留在原頁次  
				 
/* 				 var oTable = document.getElementById("maintbody");	
				 var oTr=oTable.insertRow(0);	
                 oTr.setAttribute("name","mainrow");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=rsp;
				 oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=loginno;
				 oTd.setAttribute("style","text-align:left;width:90px;");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=lgnpsd;				 
				 oTd.setAttribute("style","text-align:left;width:80px;"); 
				  var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=txtname;
				 oTd.setAttribute("style","text-align:left;width:80px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=departno;
				 oTd.setAttribute("style","text-align:left;width:80px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=departname;
				 oTd.setAttribute("style","text-align:center;width:80px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=tchphone;
				 oTd.setAttribute("style","text-align:center;width:127px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=txtemail;
				 oTd.setAttribute("style","text-align:left;width:210px;");
			     var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=staffno;
				 oTd.setAttribute("style","text-align:left;width:109px;");
				  var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=validdate;
				 oTd.setAttribute("style","text-align:left;width:109px;");
				 
	           	
		            var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                oTd.setAttribute("style","width:41px;");   
	 	            var myCheck=document.createElement('input'); 
		            myCheck.type="checkbox";
		            myCheck.setAttribute("name","recordchosen");   //讓使用者勾選的checkbox		
		            attachEventListener(myCheck,'click',chooserc,false);		   
		            oTd.appendChild(myCheck);         */   
                 
		
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息
            }										
        }
    }  
   
	return true; 
}  

function sendFilePrc(nbrflg){     //新增資料上傳檔案程序
    var recordNo=document.getElementById("rcrd_no");	
	var loginNo=document.getElementById("login_no");
	var lgnPsd=document.getElementById("lgn_psd");		
	var txtName=document.getElementById("txt_name");		
    var departNo=document.getElementById("dptnoopt");
	var tchPhone=document.getElementById("tch_phone");	
	var txtEmail=document.getElementById("txt_email");	    
	var staffNo=document.getElementById("staff_no");
	var validDate=document.getElementById("valid_date");	         		
	    if(loginNo.value.trim()==""){       //帳號
		    if(!loginNo.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      loginNo.parentNode.appendChild(errorSpan1);
		    }	 
		    loginNo.focus();
		    return false ;
        }else{
	
			if(loginNo.nextSibling){			
		       loginNo.parentNode.removeChild(loginNo.nextSibling);
		    } 
	    }
		
	    

   	  if(lgnPsd.value.trim()===""){      //密碼
		    if(!lgnPsd.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      lgnPsd.parentNode.appendChild(errorSpan1);
		    }	 
		    lgnPsd.focus();
		    return false ;
        }else{
		    if(lgnPsd.nextSibling){
		      lgnPsd.parentNode.removeChild(lgnPsd.nextSibling);
		    }
	    }
	   if(txtName.value.trim()===""){      //姓名
		    if(!txtName.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      txtName.parentNode.appendChild(errorSpan1);
		    }	 
		    txtName.focus();
		    return false ;
        }else{
		    if(txtName.nextSibling){
		      txtName.parentNode.removeChild(txtName.nextSibling);
		    }
	    }
       if(txtEmail.value!="" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(txtEmail.value)){
	     if(!txtEmail.nextSibling){
			var errorSpan3=document.createElement("span");
		    var errorMessage3=document.createTextNode("不是正確的電子郵件帳號");
		    errorSpan3.appendChild(errorMessage3);
		    errorSpan3.className="errorMsg";
		    txtEmail.parentNode.appendChild(errorSpan3); 
		  }		  
		   txtEmail.focus();
		   return false;
	     
	  }else{
		if(txtEmail.nextSibling){
			txtEmail.parentNode.removeChild(txtEmail.nextSibling);
		}
		 
	  } 
       var myaccount=Cookies.get('useraccount');	
	    
   if(nbrflg===1){    
              //如果有新增
			  
		     if(loginNo.value!="" && lgnPsd.value!="" && txtName.value!="")			 
			    var rspns=TableToJson(loginNo.value,lgnPsd.value,txtName.value,departNo.value,tchPhone.value,txtEmail.value,staffNo.value,validDate.value,0);
             else
				 blkshow("欄位資料不齊全無法新增帳戶");
		
   }
   
   blocksclose();			//關掉原視窗	
   return true;	 	

}
function editFilePrc(){     //修改資料上傳檔案程序
    var recordNo=document.getElementById("rcrd_no");	
	var loginNo=document.getElementById("login_no");
	var lgnPsd=document.getElementById("lgn_psd");		
	var txtName=document.getElementById("txt_name");		
    var departNo=document.getElementById("dptnoopt");
	var tchPhone=document.getElementById("tch_phone");	
	var txtEmail=document.getElementById("txt_email");	    
	var staffNo=document.getElementById("staff_no");
	var validDate=document.getElementById("valid_date");	         		


   	  if(lgnPsd.value.trim()===""){      //密碼
		    if(!lgnPsd.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      lgnPsd.parentNode.appendChild(errorSpan1);
		    }	 
		    lgnPsd.focus();
		    return false ;
        }else{
		    if(lgnPsd.nextSibling){
		      lgnPsd.parentNode.removeChild(lgnPsd.nextSibling);
		    }
	    }
	   if(txtName.value.trim()===""){      //姓名
		    if(!txtName.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      txtName.parentNode.appendChild(errorSpan1);
		    }	 
		    txtName.focus();
		    return false ;
        }else{
		    if(txtName.nextSibling){
		      txtName.parentNode.removeChild(txtName.nextSibling);
		    }
	    }
              if(txtEmail.value!="" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(txtEmail.value)){
	     if(!txtEmail.nextSibling){
			var errorSpan3=document.createElement("span");
		    var errorMessage3=document.createTextNode("不是正確的電子郵件帳號");
		    errorSpan3.appendChild(errorMessage3);
		    errorSpan3.className="errorMsg";
		    txtEmail.parentNode.appendChild(errorSpan3); 
		  }		  
		   txtEmail.focus();
		   return false;
	     
	  }else{
		if(txtEmail.nextSibling){
			txtEmail.parentNode.removeChild(txtEmail.nextSibling);
		}
		 
	  } 
       var myaccount=Cookies.get('useraccount');	
	    
   
	    var maintable=document.getElementById("member");
	    myThgrp=maintable.getElementsByTagName("th");
		myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
		var aWaitDelete=[];
		 
		for(var i=1;i< maintable.rows.length; i++){
			 
		    if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){		 			 
				aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
			 
				cko(-1);				
			}
		} 
		 var maintable=document.getElementById("member");
		 myThgrp=maintable.getElementsByTagName("th");
		 myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
       	 
	     var rspns=TableToJson(loginNo.value,lgnPsd.value,txtName.value,departNo.value,tchPhone.value,txtEmail.value,staffNo.value,validDate.value,recordNo.value); 	   
	       		
   
   blocksclose();			//關掉原視窗	
   return true;	 	

}
function delConfirm(event){     //確定刪除
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	
         var maintable=document.getElementById("member");

	    myThgrp=maintable.getElementsByTagName("th");
		myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
	 
	    
	
		var aWaitDelete=[];
		 
		for(var i=1;i< maintable.rows.length; i++){
			 
		    if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){		 			 
				aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
				maintable.deleteRow(i);
				i--;    //刪除一筆後記得把列數減一
				cko(-1);				
			}
		} 
		var rsp="";  //紀錄後端回傳值(空白為成功)		        
		var sendDeleRec="filename="+"("+aWaitDelete.toString()+")";	//在此下SQL語法傳給後端PHP	DELETE FROM a01 where F00 in 

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		
		var url="A02/A02del.php?timestamp="+new Date().getTime();	     
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);
		function respond(){
               	     
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
               		  
	      }
        }
	
		if (rsp.length == 0){   //有刪除成功				
		    var responseDiv=document.getElementById("serverResponse");	 
			responseDiv.setAttribute("style","color:#536a60;"); 
	        responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
			blocksclose();  //關掉原視窗
	   }else{	  
	         
			blkshow("請重刷頁面一次檢查是否刪除成功"); 
	   }

}

function optionitem(adored){

	 
	
	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;    
	var url="A02/A02srch.php?timestamp="+new Date().getTime();
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);
	
	function respond(){
       if (request.readyState == 4 && request.status == 200) {	       	     
		  //window.eval(request.responseText);		  
          evalinstead(request.responseText);		  
	  }
    }
	function createQueryString(){	    
	    
		 
	   
		 			
	        var queryString ="filename="+"'"+adored+"'" ;
	    
			
		 
	    return queryString;	// 
	}
	
	
	return
}
function optionadd(opt3,crntslt){
	var slt4 = document.getElementById("dptnoopt");	
    
	
	var item_no="";
	var item_value="";
	for(var i=0;i<opt3.length;i++){		
		var item_no="";
		var varItem="";
		for(var jk in opt3[i]){		   

				item_no+=opt3[i][jk]+"    ";
	
	       	varItem=new Option(item_no,item_no.substring(0,5).trim());
			     
		}
		slt4.options.add(varItem);  //item_no.substring(0,5).trim()==crntslt
		 
 	    if(slt4.options[i].value.trim()==crntslt){
		  
           slt4.options[i].selected=true;		
        }
	}
	
}
/* function srchBtnClick(event){   //檢索按鈕
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
    var responseDiv=document.getElementById("serverResponse");
	var txtfound=document.getElementById('srchvalue');	 

	if(txtfound.value.trim().length<2){		
	   responseDiv.setAttribute("style","color:red;"); 
	   responseDiv.innerHTML="必須多於1個字元。Must be more than 1 character. 1 文字以上でなければなりません。";	
	}else{
        responseDiv.innerHTML='&nbsp';		
		var slt2=document.getElementById('recmth');
		 
		slt2.value="000";
		var fld=document.getElementById('optkey');
       
		
		commontemp(txtfound.value.trim(),fld.value);
		
	}
 	 blocksclose();			//關掉原視窗	
   //return true;	 	 
}

function txtEnter(event){
	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
    var responseDiv=document.getElementById("serverResponse"); 
    if (event.keyCode == 13){
		
		  srchBtnClick(event);
	}	
	
	return false;			//關掉原視窗	
} */