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

		 if(txtword>10){     //如果回公司打卡 傳過來的是紀錄號碼
			
              var rspns=TableToJson(txtword.toString(),'','','','','',3);			  
	          blkshow("簽到成功，歡迎歸來！"); 
	
		 }else{      //新增||修改||刪除
			 if(txtword==1){       //是新增
               var headtitle="登入帳號:"+Cookies.get('useraccount')+"  請輸入以下欄位：";
			 }else{               //要不然就是刪除
			   var headtitle="確定刪除所勾選紀錄?";
	         }

		     if(txtword==2){   //如果是修改
			     var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var maintable=document.getElementById("member");
				 myThgrp=maintable.getElementsByTagName("th");		 				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 
		            if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){
					   for (j=0;j<myThgrp.length-2;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   
			   	   
                       break;					   
			         }
		          } 
				 var headtitle="登記人員："+aWaitUpdate[5];
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
	        if(txtword==2 || txtword==4){
			    var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","確認");
				
				if(txtword==2)
		           attachEventListener(dialogButton1,"click",sendFilePrc,false);	
			    else
				   attachEventListener(dialogButton1,"click",delConfirm,false);	
			}
		    var dialogButton3=document.createElement("input");
		    dialogButton3.setAttribute("type","button");
		    dialogButton3.setAttribute("class","btn");
		    dialogButton3.setAttribute("value","放棄");
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if (txtword==2 || txtword==4){
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
			 if(txtword!=4){  //如果不是刪除			 
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right');
	             oTd.innerHTML='接洽人電話';
	             var oTd = oTr.insertCell(1);
	             oTd.innerHTML="<input type='text' name='tch_phone' id='tch_phone' class='txt' maxlength='25' autosize/>"; 
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='接洽人員';
	            var oTd = oTr.insertCell(1);				 
	            oTd.innerHTML="<input type='text' name='tch_man' id='tch_man' class='txt' maxlength='20' autosize  />"; 			
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='所到地點';
	            var oTd = oTr.insertCell(1);
				oTd.innerHTML="<input type='text' name='lve_place' id='lve_place' class='txt' maxlength='30' autosize  />"; 			    	 			 
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='外出事由';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='lve_rsn' id='lve_rsn' class='txt' maxlength='30' autosize  />"; 
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='rcrd_no' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	
             }				
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);		     		  		  		   	  	   
		     dialog.appendChild(formJason)
	         dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  		  
		     dropsheet_content.appendChild(dialog);		
             if (txtword==1){                                     //如果是新增
				document.getElementById("lve_rsn").focus();	
			 }else if(txtword==2){                                                      //如果是修改
				  document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來
				  document.getElementById("lve_rsn").value=aWaitUpdate[6];       //為何而去			
				  document.getElementById("lve_place").value=aWaitUpdate[7];     //去往何處							     
			      document.getElementById("tch_man").value= aWaitUpdate[8];       //面見何人
				  document.getElementById("tch_phone").value=aWaitUpdate[9];      //可有信鴿				  
				  document.getElementById("lve_rsn").focus();	
			 }				 
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
function TableToJson(myaccount,lversn,lveplace,tchman,tchphone,backtime,nbrflag) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為新增內容
	 	
        var rsp="";
        
	    var order_head="{"+"\""+"Myaccount"+"\""+":"+"\""+myaccount+"\""+",";	
	    order_head+="\""+"Lversn"+"\""+":"+"\""+lversn+"\""+",";	   
		order_head+="\""+"Lveplace"+"\""+":"+"\""+lveplace+"\""+",";	
		order_head+="\""+"Tchman"+"\""+":"+"\""+tchman+"\""+",";		
		order_head+="\""+"Tchphone"+"\""+":"+"\""+tchphone+"\""+",";
		order_head+="\""+"Backtime"+"\""+":"+"\""+backtime+"\""+",";
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
 
     request.open("POST", "S27/S27wrt.php", true);        //新增記錄的php檔
 
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;			
			if(!isNaN(Number(rsp))){     //如果回傳為新增記錄號碼表示新增成功就做重刷一次畫面
			   if (nbrflag==1){          //這樣才能區分新增時翻到第一頁往上加
			      var PgeValue=document.getElementById('recmth') ;	 
			      PgeValue.value='001';
			       
			   }	  
			     choiceClick('001');     //僅修改或簽到即使這裡為'001'還是停留在原頁次
		
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息
            }										
        }
    }  
   
	return true; 
}  

function sendFilePrc(nbrflg){     //新增資料上傳檔案及修改程序
	var recordNo=document.getElementById("rcrd_no");
	var lveRsn=document.getElementById("lve_rsn");		
    var lvePlace=document.getElementById("lve_place");
	var tchMan=document.getElementById("tch_man");	    
	var tchPhone=document.getElementById("tch_phone");	 
	    if(lveRsn.value==""){       //事由
		    if(!lveRsn.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      lveRsn.parentNode.appendChild(errorSpan1);
		    }	 
		    lveRsn.focus();
		    return false ;
        }else{
		    if(lveRsn.nextSibling){
		      lveRsn.parentNode.removeChild(lveRsn.nextSibling);
		    }
	    }

   	  if(lvePlace.value.trim()===""){      //所到地點
		    if(!lvePlace.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      lvePlace.parentNode.appendChild(errorSpan1);
		    }	 
		    lvePlace.focus();
		    return false ;
        }else{
		    if(lvePlace.nextSibling){
		      lvePlace.parentNode.removeChild(lvePlace.nextSibling);
		    }
	    } 
       var backtime='';
       var myaccount=Cookies.get('useraccount');	
   if(nbrflg==1){    //如果有新增
    
		      
			  var backtime='';
			  var rspns=TableToJson(myaccount,lveRsn.value,lvePlace.value,tchMan.value,tchPhone.value,backtime,1); 
               		  
   
	  
   }else {   //如果是修改
	   
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
	     var rspns=TableToJson(myaccount,lveRsn.value,lvePlace.value,tchMan.value,tchPhone.value,backtime,recordNo.value); 	   
	       		
   }
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
		var sendDeleRec="filename="+"("+aWaitDelete.toString()+")";	//在此下SQL語法傳給後端PHP	DELETE FROM s27 where F00 in 

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		
		var url="S27/S27del.php?timestamp="+new Date().getTime();	     
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


