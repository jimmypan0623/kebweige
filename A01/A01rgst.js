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
               var headtitle="請輸入新部門編號與名稱：";
			 }else if(txtword==5){               //要不然就是刪除
			       var headtitle="請輸入搜尋鍵值";
	         }else{
				 
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
				 var headtitle="程式編號："+aWaitUpdate[1];
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
		           attachEventListener(dialogButton1,"click",sendFilePrc,false);	
			    } else if(txtword==4){
				   attachEventListener(dialogButton1,"click",delConfirm,false);	
				} else if(txtword==5){
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
            oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
		   if(txtword==1 || txtword==2){  //如果是新增或修改
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='附加權限五';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='auth5_attch' id='auth5_attch' class='txt' maxlength='20' autosize  />"; 
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='附加權限四';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='auth4_attch' id='auth4_attch' class='txt' maxlength='20' autosize  />"; 
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='附加權限三';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='auth3_attch' id='auth3_attch' class='txt' maxlength='20' autosize  />"; 
				 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='附加權限二';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='auth2_attch' id='auth2_attch' class='txt' maxlength='20' autosize  />"; 
				 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='附加權限一';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='auth1_attch' id='auth1_attch' class='txt' maxlength='20' autosize  />"; 
	            

			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='基本權限';
	            var oTd = oTr.insertCell(1);
			    oTd.innerHTML="<div><input name='typeOfChange' type='checkbox' id='tpchg1' value='Y'><label>新增&nbsp&nbsp</label>"+
                              "<input name='typeOfChange' type='checkbox' id='tpchg2' value='Y'><label>修改&nbsp&nbsp</label>"+
				   		      "<input name='typeOfChange' type='checkbox' id='tpchg3' value='Y'><label>刪除&nbsp&nbsp</label>"+
						       "<input name='typeOfChange' type='checkbox' id='tpchg4' value='Y'><label>列印&nbsp&nbsp</label></div>";
	
			   	
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='程式說明';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='prg_name' id='prg_name' class='txt' maxlength='20' autosize  />"; 	 			
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='程式編號';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='prg_no' id='prg_no' class='txt' maxlength='3' autosize  />"; 
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
			      document.getElementById("prg_no").focus();	
			     var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
 	
				
			 }else if(txtword==2){                                                      //如果是修改
				  document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來
				  document.getElementById("prg_no").value=aWaitUpdate[1];       //程式編號
				  document.getElementById("prg_name").value= aWaitUpdate[2];  //程式名稱
				  document.getElementById("tpchg1").checked=(aWaitUpdate[3]=="Y");  //新增
				  document.getElementById("tpchg2").checked=(aWaitUpdate[4]=="Y");   //修改
			      document.getElementById("tpchg3").checked= (aWaitUpdate[5]=="Y");  //刪除
				  document.getElementById("tpchg4").checked= (aWaitUpdate[6]=="Y");  //列印
			      document.getElementById("auth1_attch").value= aWaitUpdate[7];      //附一
				  document.getElementById("auth2_attch").value=aWaitUpdate[8];       //附二
				  document.getElementById("auth3_attch").value=aWaitUpdate[9];       //附三
				  document.getElementById("auth4_attch").value=aWaitUpdate[10];       //附四
				  document.getElementById("auth5_attch").value=aWaitUpdate[11];       //附五
				  document.getElementById("prg_name").focus();	
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
function TableToJson(prgno,prgname,newauth,editauth,delauth,prntauth,auth1attach,auth2attach,auth3attach,auth4attach,auth5attach,nbrflag) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為新增內容
	 		
        var rsp="";
        
	    var order_head="{"+"\""+"Prgno"+"\""+":"+"\""+prgno+"\""+",";	
	    order_head+="\""+"Prgname"+"\""+":"+"\""+prgname+"\""+",";	    	
		order_head+="\""+"Newauth"+"\""+":"+"\""+newauth+"\""+",";
		order_head+="\""+"Editauth"+"\""+":"+"\""+editauth+"\""+",";
		order_head+="\""+"Delauth"+"\""+":"+"\""+delauth+"\""+",";
		order_head+="\""+"Prntauth"+"\""+":"+"\""+prntauth+"\""+",";
		order_head+="\""+"Auth1attach"+"\""+":"+"\""+auth1attach+"\""+",";	
        order_head+="\""+"Auth2attach"+"\""+":"+"\""+auth2attach+"\""+",";
        order_head+="\""+"Auth3attach"+"\""+":"+"\""+auth3attach+"\""+",";
        order_head+="\""+"Auth4attach"+"\""+":"+"\""+auth4attach+"\""+",";
        order_head+="\""+"Auth5attach"+"\""+":"+"\""+auth5attach+"\""+",";		
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
 
     request.open("POST", "A01/A01wrt.php", true);        //新增記錄的php檔
 
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;			
			if(!isNaN(Number(rsp))){     //如果回傳為新增記錄號碼表示新增成功就做表格插入一列
				 var oTable = document.getElementById("maintbody");	
				 var oTr=oTable.insertRow(0);	
                 oTr.setAttribute("name","mainrow");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=rsp;
				 oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=prgno;
				 oTd.setAttribute("style","text-align:left;width:70px;");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=prgname;
				 oTd.setAttribute("style","text-align:left;width:224px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=newauth;
				 oTd.setAttribute("style","text-align:center;width:47px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=editauth;
				 oTd.setAttribute("style","text-align:center;width:47px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=delauth;
				 oTd.setAttribute("style","text-align:center;width:47px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=prntauth;
				 oTd.setAttribute("style","text-align:left;width:47px;");
			     var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=auth1attach;
				 oTd.setAttribute("style","text-align:left;width:93px;");
				  var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=auth2attach;
				 oTd.setAttribute("style","text-align:left;width:93px;");
				  var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=auth3attach;
				 oTd.setAttribute("style","text-align:left;width:93px;");
				  var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=auth4attach;
				 oTd.setAttribute("style","text-align:left;width:93px;");
	           	 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=auth5attach;
				 oTd.setAttribute("style","text-align:left;width:93px;");
				 
		            var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                oTd.setAttribute("style","width:41px;");   
	 	            var myCheck=document.createElement('input'); 
		            myCheck.type="checkbox";
		            myCheck.setAttribute("name","recordchosen");   //讓使用者勾選的checkbox		
		            attachEventListener(myCheck,'click',chooserc,false);		   
		            oTd.appendChild(myCheck);           
                
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息
            }										
        }
    }  
   
	return true;
}  

function sendFilePrc(nbrflg){     //新增資料上傳檔案及修改程序
	var recordNo=document.getElementById("rcrd_no");
	var prgNo=document.getElementById("prg_no");	
    var prgName=document.getElementById("prg_name");		
	var checkboxes = document.getElementsByName("typeOfChange");                         
    var newAuth=(checkboxes[0].checked?'Y':' ');
    var editAuth=(checkboxes[1].checked?'Y':' ');
	var delAuth=(checkboxes[2].checked?'Y':' ');
	var prntAuth=(checkboxes[3].checked?'Y':' ');
	var auth1Attach=document.getElementById("auth1_attch");	    
	var auth2Attach=document.getElementById("auth2_attch");
	var auth3Attach=document.getElementById("auth3_attch");	    
	var auth4Attach=document.getElementById("auth4_attch");
	var auth5Attach=document.getElementById("auth5_attch");
	var uploadFilebtn=document.getElementById("btn_uploadfile");	 
    if (nbrflg==1){     //如果是新增
	 
	    if(!/^[a-zA-Z0-9]/.test(prgNo.value)){
		    if(!prgNo.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      prgNo.parentNode.appendChild(errorSpan1);
		    }	 
		    prgNo.focus();
		    return false ;
        }else{
		    if(prgNo.nextSibling){
		      prgNo.parentNode.removeChild(prgNo.nextSibling);
		    }
	    }
		 
    }  
		if(prgName.value===""){
		    if(!prgName.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      prgName.parentNode.appendChild(errorSpan1);
		    }	 
		    prgName.focus();
		    return false ;
        }else{
		    if(prgName.nextSibling){
		      prgName.parentNode.removeChild(prgName.nextSibling);
		    }
	    } 


   if(nbrflg==1){    //如果有新增 
      if(prgNo.value!="" && prgName.value!="" )	
        var rspns=TableToJson(prgNo.value,prgName.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach.value,auth2Attach.value,auth3Attach.value,auth4Attach.value,auth5Attach.value,0); 
      else
		 blkshow("欄位資料不齊全無法新增帳戶");
    
	  
   }else {
	  
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
		
		 myThgrp=maintable.getElementsByTagName("th");
		 myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";			
	     var rspns=TableToJson(prgNo.value,prgName.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach.value,auth2Attach.value,auth3Attach.value,auth4Attach.value,auth5Attach.value,recordNo.value); 	   
	     blkshow("修改成功"); 		
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

	
 	    var aWaitDelete=[];
		 
		for(var i=1;i< maintable.rows.length; i++){
			 
		    if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){		 			 
				aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列

			}
		}  
		var rsp="";  //紀錄後端回傳值(空白為成功)		        
		var sendDeleRec="filename="+"("+aWaitDelete.toString()+")";	//在此下SQL語法傳給後端PHP	DELETE FROM q78 where F00 in 

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;
		var url="A01/A01del.php?timestamp="+new Date().getTime();	     
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);
		
		function respond(){
               	     
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
		
			  if (rsp.length>2){   //如果此程式已被使用
				  blkshow(rsp);				
				  
			  }else{
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
				  var responseDiv=document.getElementById("serverResponse");	 
		   	      responseDiv.setAttribute("style","color:#536a60;"); 
	             responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
			     blocksclose();  //關掉原視窗
			  }
               		  
	      }
        }

}


