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
	dropsheet_content.style.width="28%";		
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="18px";	  	  
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
    if (isNaN(Number(txtword))){         //如果傳進來的參數是字串	   
	    var closeSpan = document.createElement('span')
 	    closeSpan.setAttribute("class","close");
	    closeSpan.style.color="#000";
	    closeSpan.style.float="right";
	    closeSpan.style.fontSize="32px";
	    closeSpan.style.fontWeight="bold";
		closeSpan.style.backgroundColor="#E0E0E0";
        closeSpan.innerHTML = '&times';   	 
        attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	dropsheet_content.appendChild(closeSpan);        //加進內容框		
	    var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		p_tx.style.color="blue";
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
		dropsheet_content.style.width="28%";			
    }else{
		       //新增||修改||刪除||
			 if(txtword==1){       //是新增
               var headtitle="請輸入幣別資料：(新增完畢請按結束鈕)";			
	         }else if(txtword==4){				 
				var headtitle="確定刪除所勾選紀錄?";
			 }else if(txtword==3){
				 /* var headtitle=sourceAccount()+":的權限複製到"; */
			 }
			 if(txtword==2){   //如果是修改
			     var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var tabs=getElementsByAttribute('class','tab');				 			
				var maintable=document.getElementById("member");				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 		            
					if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
					   for (j=0;j<maintable.rows[i].cells.length-1;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   			   	   
                       break;					   
			         }
		          } 
				 var headtitle="修改幣別資料："; 
		     } 		    
		    var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		    dialog.className="crncyDialog"; 		 
		    dialog.style.position="relative";		  		    
		    var dialogTitle=document.createElement("div");		
			dialogTitle.setAttribute("style","font-size:medium;font-family:Arial;font-weight:bold; color:#336666;");
		    dialogTitle.appendChild(document.createTextNode(headtitle));	
		    dialog.appendChild(dialogTitle);		  
		    var ajTable=document.createElement("table");	
		    ajTable.setAttribute("id","aplyform2");
	        ajTable.style.width='100%';						
		    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	        if(txtword==2 || txtword==4 || txtword==3 || txtword==5){
			    var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","確認");
				dialogButton1.setAttribute("title","確認此筆異動資料，快速鍵Alt+S");
				dialogButton1.setAttribute("accesskey","S");				 
				if(txtword==2){
		           attachEventListener(dialogButton1,"click",sendFilePrc,false);	
			    } else if(txtword==3){
					 attachEventListener(dialogButton1,"click",athcpy,false);
				}else{
				   attachEventListener(dialogButton1,"click",delConfirm,false);	
				}								
			}
		    var dialogButton3=document.createElement("input");
		    dialogButton3.setAttribute("type","button");
		    dialogButton3.setAttribute("class","btn");
		    dialogButton3.setAttribute("value","結束");
			dialogButton3.setAttribute("title","放棄或結束並離開，快速鍵Alt+X");
			dialogButton3.setAttribute("accesskey","X");					
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if ((txtword==2 || txtword==4) ){			
               oTd.appendChild(dialogButton1);	         //修改刪除	   
			}			
			 if(txtword==1){    //如果是新增			    
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);	                 
			    oTd.innerHTML="<input type='button' class='btn' id='btn_uploadfile' value='確認' title='確認此筆新增，快速鍵Alt+S' accesskey='S' onclick='sendFilePrc(1);' >";   			   		
 	         }
            oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
		   if(txtword==1 || txtword==2){  //如果是新增或修改
          
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
				 var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='匯率:';
	            var oTd = oTr.insertCell(1);
				 oTd.colspan=3;
	            oTd.innerHTML="<input type='number' name='d00update' id='crncyabbrv' class='txt' value=0 style='width:25%;'  />";                             
	             
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='幣別代號:';
	            var oTd = oTr.insertCell(1);		
                		
				 if(txtword==2){   //如果是修改		                
					oTd.innerHTML="<input type='text' name='d00update' id='crncyno' class='txt' style='background-color:#B9B9FF;width:45%;' maxlength='4' readOnly=true  />"; 
		         }else{
					oTd.innerHTML="<input type='text' name='d00update' id='crncyno' class='txt' style='width:45%;' maxlength='4'/>"; 
				 }			 
	            var oTd = oTr.insertCell(2);	   
                 oTd.setAttribute('style','text-align:right;width:15%');					
	            oTd.innerHTML='幣別名稱:';
	            var oTd = oTr.insertCell(3);               
	            oTd.innerHTML="<input type='text' name='d00update' id='crncyname' class='txt' style='width:50%;' maxlength='8'    />";  				
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);	             
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
                oTd.colspan=3;
	            oTd.innerHTML="<input type='text' name='d00update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	
				 
				if(txtword==2){				                   	
				   						 
                }else{
					 			
				}								
             }			 	
			 
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);	             		 
		     dialog.appendChild(formJason)	        	 	 
		     dropsheet_content.appendChild(dialog);	
             if(txtword==1 || txtword==2){			 
			    dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整  
                dropsheet.style.paddingTop="25px";      // 高度也往上提 	
									
			 }
			 switch (txtword) {
                case 1:                                   //如果是新增
				   
			       document.getElementById("crncyno").focus();	
			     
				   break;
			    case 2:                                                     //如果是修改，要先顯示目前該筆資料
				   document.getElementById("crncyname").focus();
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
				  
				   var editinit=document.getElementsByName('d00update');
				   for(var k=0;k<editinit.length;k++){ //8
					   editinit[k].value=aWaitUpdate[k];
				   }		
                  		   				
				   break;			   
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
//function TableToJson(loginno,prgno,newauth,editauth,delauth,prntauth,auth1attach,auth2attach,auth3attach,auth4attach,auth5attach,nbrflag,rowno) {   //由此紀錄剩餘的table內容開始轉jason資料   
	//以下為新增內容
function TableToJson(args){	
	//var args=arguments; //記錄傳進了的參數
	 	//var tabs=getElementsByAttribute('class','tab');			
        var rsp="";        
		var order_head="{";
		for (var n=0;n<args.length;n++){
			order_head+="\""+"elem"+String(n)+"\""+":"+"\""+args[n]+"\""+",";
		}
		var json=order_head.slice(0,-1)+"}";   //去掉最後一個逗號再加上右大引號
		
     var str_json=JSON.stringify(json);	 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respond;
     request.open("POST", "D00/D00wrt.php", true);        //新增記錄的php檔
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=JSON.parse(request.responseText);	
            var arglth=	args.length;		
			if(!isNaN(Number(rsp.order_no))){     			   
			   if(args[arglth-2]==0){     //如果回傳為新增記錄號碼且旗標值為0表示新增成功就做表格插入一列		
			      var oTable = document.getElementById("maintbody");	
				  var oTr=oTable.insertRow(0);	
                  oTr.setAttribute("name","mainrow");
				  var oTd = oTr.insertCell(oTr.cells.length);				
				  oTd.innerHTML=rsp.order_no;
				  oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                  
				  for(var i=0;i<arglth-2;i++){
					  var oTd = oTr.insertCell(oTr.cells.length);
					  oTd.innerHTML=args[i];					 
				  }				 
				    //最後異動
				  var oTd = oTr.insertCell(oTr.cells.length);				       
				  oTd.innerHTML=rsp.lastupdate;				 					  
				  for (var i=1;i<5;i++){					 
					  attachEventListener(oTr.cells[i],'click',rowchoose,false);		//點選資料   
				  }				    				   				 			  	
		             var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                 oTd.setAttribute("style","width:41px;display:none");   
	 	             var myCheck=document.createElement('input'); 
		             myCheck.type="checkbox";
		             myCheck.setAttribute("name","recordchosen1");   //讓使用者勾選的checkbox		
		             attachEventListener(myCheck,'click',chooserc,false);
                     oTd.appendChild(myCheck); 			
                   	 chooserc(1);        
                     oTable.scrollTo(0,0)	;	//滾動到此表格第一筆	 	
                     cko[4](1);                 //閉包變數紀錄多一筆
					 var slt2=document.getElementById('recmth');	
					 var pagecount=Math.ceil(cko[4](0)/12);
					 if(slt2.options.length<Math.ceil(pagecount)){						 
						 var optdigts= (pagecount.toString()).length;
						 var item_no=paddingLeft(pagecount,optdigts);
		                 var varItem=new Option(item_no,item_no);
	    	             slt2.options.add(varItem);	 
					 }					
                     blkshow(1);					  					 
			   }else{            //如果是修改則原列更改內容		                    		   								
			        var maintable=document.getElementById("member");	               
				    for (var j=2;j<arglth-1;j++){				        
						maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
			        }										 
					/***********************************************************/                    
					maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;										
			   }
			   
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息				
            }										
        }
    }      
	return true; 
}  
function sendFilePrc(updflg){     //新增資料及修改程序       
	var tbjsn=[];
	var recordNo=document.getElementById("rcrd_no");
    //----資料寫入資料庫前過濾程序區-----//
	var d00elements=document.getElementsByName('d00update');	
	for(var q=1;q<d00elements.length;q++){  	//開始堆疊待異動資料陣列   
		 tbjsn.push(d00elements[q].value);	   
	}
	for(var j=1;j<d00elements.length;j++){
        if(d00elements[j].value.trim()==="" ){		
		   if(!d00elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      d00elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   d00elements[j].focus();
		   return false ;
        }else{		     
		   if(d00elements[j].nextSibling){		      
			  d00elements[j].parentNode.removeChild(d00elements[j].nextSibling);
		   }			
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(d00elements[1].value!="" ){
           //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
		   tbjsn.push(0);
		   tbjsn.push(0);
	
		   var rspns=TableToJson(tbjsn);        
	    } 
	    else{
		    blkshow("欄位資料不齊全無法新增權限");
        }		
    }else{    //如果是修改
        if (typeof updflg=="undefined"){
		    updflg=window.event;
        }	
	    var target=getEventTarget(updflg);	        	
		var maintable=document.getElementById("member");	  		
		var tablerowindex=0;
		for(var i=1;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 				 
	     //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,recordNo.value,tablerowindex); 	   
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);				
         var rspns=TableToJson(tbjsn); 	
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
		var sendDeleRec="filename="+sourceAccount();
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="D00/D00del.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);		
		function respond(){           
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
		      
			  if(!isNaN(Number(rsp))){  //如果是數字                      
				       var myThgrp=maintable.getElementsByTagName("th");
		               myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
				       var aWaitDelete=[];		 
					   var rowidx=0;
		               for(var i=1;i< maintable.rows.length; i++){			 
		                  if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
				             aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
				            maintable.deleteRow(i);			
                            rowidx=i;							
				            i--;    //刪除一筆後記得把列數減一	                                  						
			  	            cko[0](-1);	           
                            break;							
			              }
		               } 					   
					   var valueshows=document.getElementsByName("d00value");
			           for(var p=0;p<valueshows.length;p++){
				          valueshows[p].innerHTML="";
			           }
			 	       var responseDiv=document.getElementById("serverResponse1");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
				       cko[4](-1);    //閉包記錄變數減一筆
					   var slt2=document.getElementById('recmth');	
					   var pagecount=Math.ceil(cko[4](0)/12);
					   if(slt2.options.length>pagecount){		//檢查頁數是否該減少.
					      var lastvalue=parseInt(slt2.value-1);						  
						  var optdigts=slt2.value.length;						
						  slt2.options.remove(slt2.options.length-1);	
						  if (lastvalue>0){
						     choiceClick(paddingLeft(String(lastvalue),optdigts));
						  }
					   }   else{
						   var mbody=document.getElementById('maintbody');
						   if (mbody.rows.length>0){							 
							   if (rowidx<mbody.rows.length){
						          chooserc(rowidx);
							   }else{
								   chooserc(mbody.rows.length);
							   }						      					    
						   }  
					   }  
					   
			     blocksclose();  //關掉原視窗
			  }else{
		          blkshow(rsp);	
			  }
               		  
	      }
        }
}

