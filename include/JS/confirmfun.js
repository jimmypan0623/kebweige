function shurePrc(event){        //單據確認程序
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var ansbtt=document.getElementById("ANS_BOTT");
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");  
	var vrsbtt=document.getElementById("VRS_BOTT");
	var trnsbtt=document.getElementById("TRN_BOTT");
	var tabs=getElementsByAttribute('class','tab');		
	var headtable=document.getElementById('maintbody1');
	var aprv=document.getElementById('APPRVE');	
	var rcdindex=0;
	rcdindex=sourceAccount(null,0);	
	var fieldlast=(document.getElementById("TRN_BOTT"))?4:3;
	var shr_head="{";
	if(getAuth[0]()[12]!='A'){  //非分析資料檔
		for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要從編號開始計
			if(headtable.rows[rcdindex].cells[i].className=='directdata'){			
				shr_head+="\""+"elemh"+String(i)+"\""+":"+"\""+headtable.rows[rcdindex].cells[i].textContent+"\""+",";
			}
		}
		if(target.value=='\u{2705}'){			
			headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='Y';
			shr_head+="\""+"elemh"+String(headtable.rows[rcdindex].cells.length-3)+"\""+":"+"\""+'Y'+"\""+",";
		}else{     
			headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-4].textContent='Y';
			shr_head+="\""+"elemh"+String(headtable.rows[rcdindex].cells.length-4)+"\""+":"+"\""+'Y'+"\""+",";	
			shr_head+="\""+"elemhP"+"\""+":"+"\""+document.getElementById('newPono').value+"\""+",";		 
			var NewNumber=document.getElementById('newPono').value;
		}
	}
	if(document.getElementById('recmth').value.search('-')>-1){
		shr_head+="\""+"elemh"+String(headtable.rows[rcdindex].cells.length)+"\""+":"+"\""+document.getElementById('recmth').value+"\""+",";
	}
	var urlphp='';
	var str_json='';
	var urlfolder=document.getElementsByTagName('title');
	var urlpath=(left(urlfolder[0].innerHTML,3));   
	var json=shr_head.slice(0,-1)+"}";   //去掉最後一個逗號再加上右大引號	 	      
    str_json=JSON.stringify(json);   	 
    setCookie('useraccount',getAuth[1]()[0]);	
	if(target.value=="\u{2705}"){   //確認		   	
	    urlphp=urlpath+"/BKND/"+urlpath+"shrh.php";	
	}else{			
		urlphp=urlpath+"/BKND/"+urlpath+"trnh.php";		   		   
	}			
	if (tabs[0].checked){          //如果頁面為表頭	
	    var responseDiv=document.getElementById("serverResponse1"); 				 
    }else{                     //如果是在表身畫面確認
		var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		newrcath.setAttribute("style","visibility:hidden;");
	    detachEventListener(newrcath,"click",addrec,false);		
	    var responseDiv=document.getElementById("serverResponse2"); 
	}		
	/* responseDiv.style.textAlign='center';	 
	responseDiv.innerHTML='<img src="digits/Loading.gif" width="1.5%" height="1.5%" border="0">'; */	
	aprv.innerHTML="<img src='digits/Loading.gif' alt='svg' style='position: absolute;top: 47px;left: 50%;width: 50px;opacity: 0.45;'>"
	if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	}else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
    }		
	request.onreadystatechange = respond;	   
    request.open("POST", urlphp, true);        //新增記錄的php檔	  
    request.setRequestHeader("Content-type", "application/json");
    request.send(str_json);	
    function respond() {		
        if (request.readyState == 4 && request.status == 200) { 
		    rsp=JSON.parse(request.responseText);   			 
			if(!rsp.order_no){
                //blkshow('可確認之數量超過未確認數量');	
				blkshow(rsp);
				if(target.value=='\u{2705}'){			
				    if(rsp.indexOf('(.|.)')>0){						
					    headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='Y';
					    for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要從編號開始計
		                    headtable.rows[rcdindex].cells[i].style.color="#000";
		                    headtable.rows[rcdindex].cells[i].style.fontWeight="normal";					            
	                    }						
						ansbtt.setAttribute("style","display:none;");
				        detachEventListener(ansbtt,"click",ansproc,false);							
				        editbtt.setAttribute("style","visibility:hidden;");
			        	detachEventListener(editbtt,"click",edtrec,false);
				        delbtt.setAttribute("style","visibility:hidden;");
				        detachEventListener(delbtt,"click",delrec,false);
						aprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
				    }else{
					   
		               headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='N';
					   aprv.innerHTML="\u{A0}";
				    }  
				}else{
					 
				    if(getAuth[0]()[12]!='A'){
				       headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-4].textContent='N';
				    }else{
					   ansbtt.setAttribute("style","display:none;");
				       detachEventListener(ansbtt,"click",ansproc,false);	
					}
				}					  
				 responseDiv.innerHTML="\u{A0}";				 
			}else{				    
                headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-2].textContent=rsp.lastupdate;
			    for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要從編號開始計
		            headtable.rows[rcdindex].cells[i].style.color="#000";
		            headtable.rows[rcdindex].cells[i].style.fontWeight="normal";					            
	            }
			    ansbtt.setAttribute("style","display:none;");				
				detachEventListener(ansbtt,"click",ansproc,false);	
				 if(getAuth[0]()[12]!='A'){
				    editbtt.setAttribute("style","visibility:hidden;");
				    detachEventListener(editbtt,"click",edtrec,false);
				    delbtt.setAttribute("style","visibility:hidden;");
				    detachEventListener(delbtt,"click",delrec,false);
				 }
				if(target.value=="\u{2705}"){
				   if (getAuth[0]()[9]=='Y'){   //(getCookie('auth09')=='Y'){
					   vrsbtt.setAttribute("style","display:block;");
					   attachEventListener(vrsbtt,"click",vrsproc,false);  //反確認按鈕程序  
				   }		
				   if (getAuth[0]()[7]=='Y' && getAuth[2]()[0].INT_013=='Y' && target.value=="\u{2705}"){  
					   if(trnsbtt){
						  trnsbtt.setAttribute("style","visibility:visible;");
						  attachEventListener(trnsbtt,"click",trnsproc,false);  //轉訂單程序   
					   }
				   }		
				}else{      //反轉單據程序
					vrsbtt.setAttribute("style","display:none;");
					detachEventListener(vrsbtt,"click",vrsproc,false);	
					if(trnsbtt){
					   trnsbtt.setAttribute("style","visibility:hidden;");
					   detachEventListener(trnsbtt,"click",trnsproc,false);
					}
				}
                if(getAuth[0]()[12]!='A'){ 
					aprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
					responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
					responseDiv.innerHTML=(target.value=="\u{2705}"?whichrspns1(urlpath):whichrspns2(urlpath)+NewNumber+"，請至該單確認"); 	
					 
			    }else{					
					responseDiv.innerHTML=whichrspns1(urlpath);					
					aprv.innerHTML="<img src='digits/marker.png' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
				   
				}
				 setTimeout(() => { responseDiv.innerHTML='\u{A0}'; }, 3000);
			}   
	    }		
    }			
    blocksclose();  //關掉原視窗     	 	
} 
function vrshrPrc(event){
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var ansbtt=document.getElementById("ANS_BOTT");
	var vrsbtt=document.getElementById("VRS_BOTT");
	if(getAuth[0]()[12]!='A'){
	    var editbtt=document.getElementById("EDIT_BOTT");
	    var delbtt=document.getElementById("DEL_BOTT");  	
	    var trnsbtt=document.getElementById("TRN_BOTT");
	}
	var tabs=getElementsByAttribute('class','tab');	  
	var headtable=document.getElementById('maintbody1');
	var aprv=document.getElementById('APPRVE');
	var rcdindex=0;
	var query_no='';
	var fieldlast=(document.getElementById("TRN_BOTT"))?4:3;	
	rcdindex=sourceAccount(null,0);
	if(getAuth[0]()[12]!='A'){
	    query_no=headtable.rows[rcdindex].cells[1].textContent;
	}else{
	  query_no=document.getElementById('recmth').value;
	}
	setCookie('useraccount',getAuth[1]()[0]);
	var sendDeleRec="filename="+query_no;		
	var rsp="";  	
	if (tabs[0].checked){          //如果頁面為表頭
		var responseDiv=document.getElementById("serverResponse1"); 
	}else{
		if (getAuth[0]()[1]=='Y' ){      //getCookie('auth01')=='Y'
			var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
			newrcath.style.visibility="visible";	
		   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
		} 		 
		var responseDiv=document.getElementById("serverResponse2"); 
	}
	
	aprv.innerHTML="<img src='digits/Loading.gif' alt='svg' style='position: absolute;top: 47px;left: 50%;width: 50px;opacity: 0.45;'>"
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
	   var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	
	var urlfolder=document.getElementsByTagName('title');
	var urlpath=(left(urlfolder[0].innerHTML,3));	
	var url=urlpath+"/BKND/"+urlpath+"vrs.php?timestamp="+new Date().getTime();        		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendDeleRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {     		  
			rsp=JSON.parse(request.responseText);   			 
			if(!rsp.order_no){
			   blkshow(rsp);		
			   if(rsp.indexOf('(.|.)')>0){				   
					headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='N';
					
				}				
			   responseDiv.innerHTML="\u{A0}";
			   aprv.innerHTML='\u{A0}';
			}else{		
			        if(getAuth[0]()[12]!='A'){																
						headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-2].textContent=rsp.lastupdate;					       
						headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='N';				  	 
						for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要變色
							 headtable.rows[rcdindex].cells[i].style.color="#704214";
							 headtable.rows[rcdindex].cells[i].style.fontWeight="bold";	
						}				   				   
				    }
					vrsbtt.setAttribute("style","display:none;");
					detachEventListener(vrsbtt,"click",vrsproc,false);	
					if(trnsbtt){
						 trnsbtt.setAttribute("style","visibility:hidden;");
						detachEventListener(trnsbtt,"click",trnsproc,false);	
					} 
					if (getAuth[0]()[8]=='Y'){    
						ansbtt.setAttribute("style","display:block;");
						attachEventListener(ansbtt,"click",ansproc,false);  //確認按鈕程序  
					}		
					if (getAuth[0]()[2]=='Y'){			  
						editbtt.style.visibility="visible";
						attachEventListener(editbtt,"click",edtrec,false);  //修改紀錄按鈕程序
					}
	  
					if (getAuth[0]()[3]=='Y'){   
					   delbtt.style.visibility="visible";
					   attachEventListener(delbtt,"click",delrec,false);  //刪除紀錄按鈕程序
					}
					responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
					 
					responseDiv.innerHTML=whichrspns3(urlpath); 	
					setTimeout(() => { responseDiv.innerHTML='\u{A0}'; }, 3000);   
					 
					aprv.innerHTML='\u{A0}';
				 
			}
		}
	} 
    blocksclose();  //關掉原視窗
}

function whichrspns1(tpe){
	 var tpemsg="";
     switch(tpe){
      case 'C21': {    
          tpemsg = '所勾選報價單號已確認，並寫入報價紀錄...';    
          break;  
      }
      case 'C04': {    
          tpemsg = '所勾選訂單已確認，並寫入出貨計劃...';   
          break;
      }
	  case 'B02': {    
          tpemsg = '已確認過帳，請檢查相對應庫存與帳款是否正確...';   
          break;
      }
	  case 'B03': {    
          tpemsg = '已確認過帳，請檢查相對應庫存與帳款及訂單未出量是否正確...';   
          break;
      }
	   case 'B04': {    
          tpemsg = '已確認過帳，請檢查相對應庫存與帳款是否正確...';   
          break;
      }
	 case 'B05': {    
          tpemsg = '已確認過帳，請檢查相對應庫存與帳款及訂單未出量是否正確...';   
          break;
      }
	 case 'B06': {    
          tpemsg = '已確認過帳，請檢查轉出部門與轉入部門之庫存是否正確...';   
          break;
      } 
	 case 'B09': {    
          tpemsg = '已確認過帳，請檢查盤差部門之庫存是否正確...';   
          break;
      }  
	 case 'B10': {    
          tpemsg = '已確認過帳，請檢查報廢部門之庫存是否減少...';   
          break;
      }   
	  case 'B25': {    
          tpemsg = '已將本月期末庫存結轉至次月，請檢查次月期初庫存是否正確...';   
          break;
      }
	  case 'D04': {    
          tpemsg = '所勾選採購單已確認，並寫入進貨計劃...';   
          break;     
      }
	   case 'K10': {    
          tpemsg = '所勾選應收沖銷單已確認，並扣除其應收立沖結餘明細帳...';   
          break;     
      }
	    case 'K11': {    
          tpemsg = '所勾選應付沖銷單已確認，並扣除其應收立沖結餘明細帳...';   
          break;     
      }
       default: {
         break;
       }
    }
    return tpemsg;
}
function whichrspns2(tpe){
	 var tpemsg="";
     switch(tpe){
      case 'C21': {    
          tpemsg = "已轉入C04客戶訂單:";    
          break;  
      }
      case 'C04': {    
          tpemsg = '已轉入B04出貨單:';   
          break;
      }
	 
	 
	   
	  case 'D04': {    
          tpemsg = '已轉入B02進貨單:';   
          break;
      }
	   
       default: {
         break;
       }
    }
    return tpemsg;
}
function whichrspns3(tpe){
	 var tpemsg="";
     switch(tpe){
      case 'C21': {    
          tpemsg = "所勾選報價單號已反確認,並清除其報價紀錄...";    
          break;  
      }
      case 'C04': {    
          tpemsg = '所勾選客戶訂單號已反確認,並清除其出貨計劃...';   
          break;
      }
	    case 'B02': {    
          tpemsg = '本單進貨料號庫存帳已減去，且帳款也刪除...';   
          break;
      }
	  case 'B03': {    
          tpemsg = '本單進貨退出料號庫存帳已加回，且帳款也減去...';   
          break;
      }
	   case 'B04': {    
          tpemsg = '本單出貨料號庫存帳已加回，且帳款已減去...';   
          break;
      }
	  case 'B05': {    
          tpemsg = '本單出貨退回料號庫存帳已減去，且帳款也減去...';   
          break;
      }
	   case 'B06': {    
          tpemsg = '本單轉出與轉入部門庫存帳已回復原來未確認前狀態...';   
          break;
      }
	  case 'B09': {    
          tpemsg = '本單部門庫存帳已回復原來未確認前狀態...';   
          break;
      }
	    case 'B10': {    
          tpemsg = '本單部門庫存帳已回復原來未確認前狀態...';   
          break;
      }
	   case 'B25': {    
          tpemsg = '本月之庫存月報檔已反結轉，可修正本月之庫存單據...';   
          break;
      }
	  case 'D04': {    
          tpemsg = '所勾選採購單號已反確認,並清除其進貨計劃... ';   
          break;
      }
	  case 'K10': {    
          tpemsg = '所勾選應收沖銷單號已反確認,並還原其應收立沖結餘明細帳... ';   
          break;
      } 
	   case 'K11': {    
          tpemsg = '所勾選應付沖銷單號已反確認,並還原其應收立沖結餘明細帳... ';   
          break;
      } 
       default: {
         break;
       }
    }
    return tpemsg;
}

function processShipment(orderItem, shipQty) {
  // 1. 更新已出數量與未出數量
  orderItem.shippedQty += shipQty;
  orderItem.openQty = orderItem.orderQty - orderItem.shippedQty - orderItem.canceledQty;

  // 2. 解析分批出貨 JSON (確保按日期由小到大排序)
  let schedule = JSON.parse(orderItem.scheduleJson);
  schedule.sort((a, b) => new Date(a.date) - new Date(b.date));

  let remainingToDeduct = shipQty;
  let updatedSchedule = [];

  for (let batch of schedule) {
    if (remainingToDeduct <= 0) {
      // 若已扣完，保留後續批次
      updatedSchedule.push(batch);
    } else if (batch.qty <= remainingToDeduct) {
      // 本批次數量不足或剛好扣完 -> 消耗此批次，不加入新陣列
      remainingToDeduct -= batch.qty;
    } else {
      // 本批次數量足夠扣除 -> 扣減後保留剩餘數量
      batch.qty -= remainingToDeduct;
      remainingToDeduct = 0;
      updatedSchedule.push(batch);
    }
  }

  // 3. 轉回 JSON 字串以更新資料庫/畫面
  orderItem.scheduleJson = JSON.stringify(updatedSchedule);

  return orderItem;
}