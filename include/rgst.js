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
	    p_tx.innerHTML=txtword;	                         　//將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
    }else{

		  if(txtword==3){     //如果是搜尋相關料號
			 var headtitle="";	     
		     var aWaitUpdate=[];	//準備搜尋相關料號
			  
				 var maintable=document.getElementById("member");
				 myThgrp=maintable.getElementsByTagName("th");		 				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 
		            if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){
					   for (j=0;j<myThgrp.length-2;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   
			   	       aWaitUpdate.push(decodeURI(maintable.rows[i].cells[myThgrp.length-2].childNodes[0].href));
                       break;					   
			         }
		          } 
				 var headtitle="通報號碼："+aWaitUpdate[1];
			     dropsheet.style.paddingTop="20px"; /* Location of the box */
		         var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		         dialog.className="customDialog"; 		 
		         dialog.style.position="relative";		  		    		   	           
		         var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		         dialogButton3.setAttribute("value","關閉");
		         attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  		  
				 var tblname=document.createElement("caption");
				 tblname.innerHTML=headtitle;	
				 tblname.appendChild(dialogButton3);				 
				 var srchTable=document.createElement("table");				  
		         srchTable.id="srchTable";
				 srchTable.className="srchStocNo";
	             srchTable.style.width='100%';
				 srchTable.style.border="1px solid #151515";
			     srchTable.style.backgroundColor="#F0F0F0";
				 srchTable.appendChild(tblname);
				 var srchHead=document.createElement("thead");
				 srchTable.appendChild(tblname);
				 srchTable.appendChild(srchHead);
				 var oTr=srchTable.insertRow(-1);								 
				 var oTh = oTr.insertCell(oTr.cells.length);
				 oTh.innerHTML="料號";				 
				 var oTh = oTr.insertCell(oTr.cells.length);
				 oTh.innerHTML="品名";				 
				 var oTh = oTr.insertCell(oTr.cells.length);
				 oTh.innerHTML="系列別";				 
			     var oTh = oTr.insertCell(oTr.cells.length);				  
				 oTh.innerHTML="包裝基量";
				 var oTh = oTr.insertCell(oTr.cells.length);			 
				 oTh.innerHTML="包裝數量";
				 var srchTbody=document.createElement("tbody");
				 srchTbody.setAttribute("id","srchtbody");
				 srchTable.appendChild(srchTbody);
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata";	          
				 formJason.appendChild(srchTable);
		         dialog.appendChild(formJason)
	             dropsheet_content.style.width="68%";	 	 //原訊息內框畫面寬度調整  		  
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="srchstkno.php?timestamp="+new Date().getTime();   	
                 //var url="http://192.168.10.213/technote/srchstkno.php?timestamp="+new Date().getTime();  					 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				 var queryString ='filename='+aWaitUpdate[7];
	             request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     
		           //window.eval(request.responseText);		  
                        evalinstead(request.responseText);		  
	                }	  
                 }
			 			 
		 }else{      //新增||修改||刪除
			 if(txtword==1){       //是新增
               var headtitle="請依通報資料填入以下各欄後上傳該PDF檔（不接受中文檔名）：";
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
			   	       aWaitUpdate.push(decodeURI(maintable.rows[i].cells[myThgrp.length-2].childNodes[0].href));
                       break;					   
			         }
		          } 
				 var headtitle="通報號碼："+aWaitUpdate[1];
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
		    oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
	
			
			 if(txtword==1){    //如果是新增
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='上傳檔案';
	            var oTd = oTr.insertCell(1);	         
			    oTd.innerHTML="<input type='file' name='file' id='file'><input type='button' class='btn' id='btn_uploadfile' value='上傳' onclick='sendFilePrc(1);' >";                                                                             			
 	         }else if(txtword==2){          //如果是修改
				 				 			 
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right');
	             oTd.innerHTML='檔案位置';
	             var oTd = oTr.insertCell(1);
	             oTd.innerHTML="<input type='text' name='link_path' id='link_path' class='txt' maxlength='60' style='width:100%'/>"; 
			 }

			 if(txtword!=4){  //如果不是刪除
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='影響系列';
	            var oTd = oTr.insertCell(1);
			    var editSrs=document.createElement("textarea");
		   	    editSrs.rows=6;
			    editSrs.cols=30;
			    editSrs.id="inf_series";
			    editSrs.name="inf_series";
			    editSrs.placeholder="此欄僅需要輸入系列別代號並以逗號(,)隔開，結尾最後一個字元也必須以逗號(,)結束。";
			    oTd.appendChild(editSrs);			
	            //oTd.innerHTML="<input type='text' name='inf_series' id='inf_series' class='txt' maxlength='100' style='width:100%' required />"; 			 

			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='變更類別';
	            var oTd = oTr.insertCell(1);
			    oTd.innerHTML="<div><input name='typeOfChange' type='checkbox' id='tpchg1' value='材質異動' checked><label>材質異動</label>"+
                              "<input name='typeOfChange' type='checkbox' id='tpchg2' value='產地異動'><label>產地異動</label>"+
				   		      "<input name='typeOfChange' type='checkbox' id='tpchg3' value='包裝變更'><label>包裝變更</label>"+
						      "<input name='typeOfChange' type='checkbox' id='tpchg4' value='料號變更'><label>料號變更</label></div>"+
						      "<div><input name='typeOfChange' type='checkbox' id='tpchg5' value='設計變更'><label>設計變更</label>"+
						      "<input name='typeOfChange' type='checkbox' id='tpchg6' value='標籤變更'><label>標籤變更</label>"+  
							  "<input name='typeOfChange' type='checkbox' id='tpchg7' value='廠商變更'><label>廠商變更</label>"+  
						      "<input name='typeOfChange' type='checkbox' id='tpchg8' value='停產通知'><label>停產通知</label></div>";
	
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='收件日期';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='date' value='2021-10-31' name='receipt_date' id='receipt_date' class='txt' autosize  />";			 			 
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='實施日期';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='date' value='2021-10-31' name='practice_date' id='practice_date' class='txt' autosize  />";			 
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='發行主旨';
	            var oTd = oTr.insertCell(1);
			    var editSbjct=document.createElement("textarea");
			    editSbjct.rows=6;
			    editSbjct.cols=30;
			    editSbjct.id="isue_sbjct";
			    editSbjct.name="isue_sbjct";
			    editSbjct.placeholder="此欄請輸入通報中Title Subject欄位的內容。";
			    oTd.appendChild(editSbjct);			 
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='發行日期';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='date' value='2021-10-31' name='isue_date' id='isue_date' class='txt' autosize  />";			 			
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='通報文號';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='isue_no' id='isue_no' class='txt' maxlength='25' autosize  />"; 
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
             }				
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);		     		  		  		   	  	   
		     dialog.appendChild(formJason)
	         dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  		  
		     dropsheet_content.appendChild(dialog);		
             if (txtword==1){                                     //如果是新增
			     var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
			     document.getElementById("isue_date").value=thtdy;  //日期都設為今天
			     document.getElementById("receipt_date").value=thtdy;  //日期都設為今天
			     document.getElementById("practice_date").value=thtdy;   //日期都設為今天	
				   document.getElementById("isue_no").focus();	
			 }else if(txtword==2){                                                      //如果是修改
				  document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來
				  document.getElementById("isue_no").value=aWaitUpdate[1];       //此時要把insue_no當成是紀錄號碼的變數
				  document.getElementById("isue_date").value= aWaitUpdate[2];  //日期都設為紀錄內容
				  document.getElementById("isue_sbjct").value=aWaitUpdate[3];
				  document.getElementById("practice_date").value= aWaitUpdate[4];   //日期都設為紀錄內容
			      document.getElementById("receipt_date").value= aWaitUpdate[5];  //日期都設為紀錄內容
			      document.getElementById("inf_series").value= aWaitUpdate[7]; 
				  document.getElementById("link_path").value=aWaitUpdate[8]; 
				  var checkboxes = document.getElementsByName("typeOfChange");       
                  for(var i = 0; i < checkboxes.length; i++)  
                  {  
                     if(aWaitUpdate[6].indexOf(checkboxes[i].value) >= 0 ){  		     
                         checkboxes[i].checked=true;                                  
	                 }else{
						 checkboxes[i].checked=false; 
                     }						 
                  }  
				  document.getElementById("isue_date").focus();	
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
function TableToJson(isueno,isuedate,isuesubject,parcticedate,receiptdate,typechange,infulenceseries,linkpath,nbrflag) {   //由此紀錄剩餘的table內容開始轉jason資料
   
	//以下為新增內容
	 		
        var rsp="";
        
	    var order_head="{"+"\""+"Isueno"+"\""+":"+"\""+isueno+"\""+",";	
	    order_head+="\""+"Isuedate"+"\""+":"+"\""+isuedate+"\""+",";	    	
		order_head+="\""+"Isuesubject"+"\""+":"+"\""+isuesubject+"\""+",";
		order_head+="\""+"Parcticedate"+"\""+":"+"\""+parcticedate+"\""+",";
		order_head+="\""+"Receiptdate"+"\""+":"+"\""+receiptdate+"\""+",";
		order_head+="\""+"Typechange"+"\""+":"+"\""+typechange+"\""+",";
		order_head+="\""+"Infulenceseries"+"\""+":"+"\""+infulenceseries+"\""+",";	
		order_head+="\""+"Linkpath"+"\""+":"+"\""+linkpath+"\""+",";
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
 
     request.open("POST", "q78wrt.php", true);        //新增記錄的php檔
 
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
				 oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
                 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=isueno;
				 oTd.setAttribute("style","text-align:left;width:134px;");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=isuedate;
				 oTd.setAttribute("style","text-align:center;width:104px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=isuesubject;
				 oTd.setAttribute("style","text-align:left;width:238px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=parcticedate;
				 oTd.setAttribute("style","text-align:center;width:104px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=receiptdate;
				 oTd.setAttribute("style","text-align:center;width:104px;"); 
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=typechange;
				 oTd.setAttribute("style","text-align:left;width:100px;");
			     var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=infulenceseries;
				 oTd.setAttribute("style","text-align:left;width:130px;");
				 var oTd = oTr.insertCell(oTr.cells.length);
				 oTd.innerHTML=linkpath;
				 oTd.setAttribute("style","text-align:left;width:82px;");
				 var url_address=oTd.innerHTML;  //先把網址存到變數		
		         oTd=oTr.deleteCell(8);		  //記錄完後再把此欄刪掉 
                 var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄
		  
		           oTd.setAttribute("style","width:41px;");
	          
	            if (url_address!=""){	
	 	            var myHref = document.createElement('a');         //每列最後一欄建立超連結
                    myHref.href = url_address;
		            myHref.target='_blank';           
		            var iss=document.createElement("i");
		            iss.setAttribute("class","fas fa-file-download fa-1x ");
		            myHref.appendChild(iss);		            		  
	 	            oTd.appendChild(myHref);		   		   
		        }           
	           	
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
	var isueNo=document.getElementById("isue_no");	
	var isueDate=document.getElementById("isue_date");
    var isueSubject=document.getElementById("isue_sbjct");
	var parcticeDate=document.getElementById("practice_date");
	var receiptDate=document.getElementById("receipt_date");    
	var infulenceSeries=document.getElementById("inf_series");	    
	var uploadFilebtn=document.getElementById("btn_uploadfile");	 
    if (nbrflg==1){     //如果是新增
	 
	    if(!/^[a-zA-Z0-9]/.test(isueNo.value)){
		    if(!isueNo.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      isueNo.parentNode.appendChild(errorSpan1);
		    }	 
		    isueNo.focus();
		    return false ;
        }else{
		    if(isueNo.nextSibling){
		      isueNo.parentNode.removeChild(isueNo.nextSibling);
		    }
	    }
		 
    }  else{        //如果是修改
		
		  var linkPath=document.getElementById("link_path");	
		  if(linkPath.value.trim()===""){
		    if(!linkPath.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      linkPath.parentNode.appendChild(errorSpan1);
		    }	 
		    linkPath.focus();
		    return false ;
        }else{
		    if(linkPath.nextSibling){
		      linkPath.parentNode.removeChild(linkPath.nextSibling);
		    }
	    } 
		 
	 }	 
		if(isueDate.value===""){
		    if(!isueDate.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      isueDate.parentNode.appendChild(errorSpan1);
		    }	 
		    isueDate.focus();
		    return false ;
        }else{
		    if(isueDate.nextSibling){
		      isueDate.parentNode.removeChild(isueDate.nextSibling);
		    }
	    } 
   	  if(isueSubject.value.trim()===""){
		    if(!isueSubject.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      isueSubject.parentNode.appendChild(errorSpan1);
		    }	 
		    isueSubject.focus();
		    return false ;
        }else{
		    if(isueSubject.nextSibling){
		      isueSubject.parentNode.removeChild(isueSubject.nextSibling);
		    }
	    } 
	 /*  if(parcticeDate.value===""){
		    if(!parcticeDate.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      parcticeDate.parentNode.appendChild(errorSpan1);
		    }	 
		    parcticeDate.focus();
		    return false ;
        }else{
		    if(parcticeDate.nextSibling){
		      parcticeDate.parentNode.removeChild(parcticeDate.nextSibling);
		    }
	    } */
		if(receiptDate.value===""){
		    if(!receiptDate.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      receiptDate.parentNode.appendChild(errorSpan1);
		    }	 
		    receiptDate.focus();
		    return false ;
        }else{
		    if(receiptDate.nextSibling){
		      receiptDate.parentNode.removeChild(receiptDate.nextSibling);
		    }
	    } 

    var typeChange="";
    var checkboxes = document.getElementsByName("typeOfChange");       
    for(var i = 0; i < checkboxes.length; i++)  
    {  
        if(checkboxes[i].checked){  		     
            typeChange+=checkboxes[i].value+"/ ";  
	    }		
    }  
	var firstchkbox=checkboxes[0];
    if(typeChange==="")  
    {          
         if(!firstchkbox.parentNode.parentNode.nextSibling){
		      var errorSpan1=document.createElement("span");
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("*");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      firstchkbox.parentNode.parentNode.parentNode.appendChild(errorSpan1);
		  }	 
		    
		    firstchkbox.focus();
		    return false ;

    }else {
		  typeChange=typeChange.substring(0,typeChange.length-2);
		  if(firstchkbox.parentNode.parentNode.nextSibling){
		      firstchkbox.parentNode.parentNode.parentNode.removeChild(firstchkbox.parentNode.parentNode.nextSibling);
		  }
    }		

	if(infulenceSeries.value.trim()===""){
		if(!infulenceSeries.nextSibling){
		    var errorSpan1=document.createElement("span");
			errorSpan1.style.color="red";
			errorSpan1.style.fontFamily="標楷體";
		    var errorMessage1=document.createTextNode("此欄不得空白");
		    errorSpan1.appendChild(errorMessage1);
		    errorSpan1.classId="errorMsg";
		    infulenceSeries.parentNode.appendChild(errorSpan1);
		}	 
		infulenceSeries.focus();
		return false ;
    }else{
		if(infulenceSeries.nextSibling){
		   infulenceSeries.parentNode.removeChild(infulenceSeries.nextSibling);
		}
	} 
	
	if(infulenceSeries.value.trim().charAt(infulenceSeries.value.trim().length-1)!=","){     //str.charAt(str.length – 1)
		if(!infulenceSeries.nextSibling){
		    var errorSpan1=document.createElement("span");
			errorSpan1.style.color="red";
			errorSpan1.style.fontFamily="標楷體";
		    var errorMessage1=document.createTextNode("最後一字必須為逗號");
		    errorSpan1.appendChild(errorMessage1);
		    errorSpan1.classId="errorMsg";
		    infulenceSeries.parentNode.appendChild(errorSpan1);
		}	 
		infulenceSeries.focus();
		return false ;
    }else{
		if(infulenceSeries.nextSibling){
		   infulenceSeries.parentNode.removeChild(infulenceSeries.nextSibling);
		}
	} 

   if(nbrflg==1){    //如果有新增上傳
      var files = document.getElementById("file").files;    
      if(files.length > 0 ){      
	  var storagename="http://211.75.33.50/kebweige/upload/"+files[0].name;  //選取的檔案名稱先存入變數	   	 
      var formData = new FormData();
      formData.append("file", files[0]);
      var xhttp = new XMLHttpRequest();
      // Set POST method and ajax file path
      xhttp.open("POST", "ajaxfile.php", true);
      // call on request changes state
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {  
          var response = this.responseText;   
           if(response == ''){   //檔案上傳成功後才新增資料到資料庫
			  var rspns=TableToJson(isueNo.value,isueDate.value,isueSubject.value,parcticeDate.value,receiptDate.value,typeChange,infulenceSeries.value,storagename,1); 
              blkshow("檔案上傳成功"); 			  
           }else{
              alert(response);			   
           }
         }
      };

      // Send request with data
      xhttp.send(formData);

      }else{
	   
	    if(!uploadFilebtn.nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("*");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      uploadFilebtn.parentNode.appendChild(errorSpan1);
		    }	 
		    uploadFilebtn.focus();
		    return false ; 	
      }
	  
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
		 var maintable=document.getElementById("member");
		 myThgrp=maintable.getElementsByTagName("th");
		 myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";			
	     var rspns=TableToJson(isueNo.value,isueDate.value,isueSubject.value,parcticeDate.value,receiptDate.value,typeChange,infulenceSeries.value,linkPath.value,recordNo.value); 	   
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
		var sendDeleRec="filename="+"("+aWaitDelete.toString()+")";	//在此下SQL語法傳給後端PHP	DELETE FROM q78 where F00 in 

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		
		var url="q78del.php?timestamp="+new Date().getTime();	     
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

function srchStockNo(str1) {       //搜尋相關料號
    var cnt=0;
	var arr = str1; 
    var oTable = document.getElementById("srchtbody");		 
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(oTable.rows.length);
		cnt++;
         
		for(var jk in arr[i]){		   
		  var oTd = oTr.insertCell(oTr.cells.length);
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='stockno'|jk=='dscrpt' | jk=='srsno'){
			 oTd.setAttribute("style","text-align:left;");   
		  
		  }else{
		     oTd.setAttribute("style","text-align:right;");      
		  }		  		   
		}  				 	 	     		 
	}
	 
}
