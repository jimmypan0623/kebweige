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
	aprv.setAttribute("style","color:red;font-size:20px;font-weight:bold;");
	var rcdindex=0;
	rcdindex=sourceAccount(null,0);	
	var fieldlast=(document.getElementById("TRN_BOTT"))?4:3;
	var shr_head="{";
	for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要從編號開始計
		headtable.rows[rcdindex].cells[i].style.color="#000";
		headtable.rows[rcdindex].cells[i].style.fontWeight="normal";			
		if(headtable.rows[rcdindex].cells[i].className=='directdata'){			
			shr_head+="\""+"elemh"+String(i)+"\""+":"+"\""+headtable.rows[rcdindex].cells[i].innerHTML+"\""+",";
		}
	}
	if(target.value=='\u{2705}'){			
		headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].innerHTML='Y';
		shr_head+="\""+"elemh"+String(headtable.rows[rcdindex].cells.length-3)+"\""+":"+"\""+headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].innerHTML+"\""+",";
	}else{     
		headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-4].innerHTML='Y';
		shr_head+="\""+"elemh"+String(headtable.rows[rcdindex].cells.length-4)+"\""+":"+"\""+headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].innerHTML+"\""+",";	
		shr_head+="\""+"elemhP"+"\""+":"+"\""+document.getElementById('newPono').value+"\""+",";		   
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
	if(target.value=="\u{2705}"){   //確認		   	
	    urlphp=urlpath+"/"+urlpath+"shrh.php";	
	}else{			
		urlphp=urlpath+"/"+urlpath+"trnh.php";		   		   
	}			
	if (tabs[0].checked){          //如果頁面為表頭	
	    var responseDiv=document.getElementById("serverResponse1"); 				 
    }else{                     //如果是在表身畫面確認
		var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		newrcath.setAttribute("style","visibility:hidden;");
	    detachEventListener(newrcath,"click",addrec,false);		
	    var responseDiv=document.getElementById("serverResponse2"); 
	}				
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
	        var rsp=request.responseText;	
             headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-2].innerHTML=rsp.lastupdate;			 
	   
	    }
    }		
	ansbtt.setAttribute("style","display:none;");
	detachEventListener(ansbtt,"click",ansproc,false);	
	editbtt.setAttribute("style","visibility:hidden;");
	detachEventListener(editbtt,"click",edtrec,false);
	delbtt.setAttribute("style","visibility:hidden;");
	detachEventListener(delbtt,"click",delrec,false);
	if(target.value=="\u{2705}"){
	   if (Cookies.get('auth09')=='Y'){
		   vrsbtt.setAttribute("style","display:block;");
		   attachEventListener(vrsbtt,"click",vrsproc,false);  //反確認按鈕程序  
	   }		
	   if (Cookies.get('auth07')=='Y' && Cookies.get('INT_013')=='Y' &&target.value=="\u{2705}"){
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
	 responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
     responseDiv.innerHTML=(target.value=="\u{2705}"?whichrspns1(urlpath):whichrspns2(urlpath)+document.getElementById('newPono').value+"，請至該單確認"); 						       					   
	 aprv.innerHTML='\u{329E}\u{A0}\u{A0}\u{A0}\u{A0}';     //"<img src='digits/approve.gif' />";
     blocksclose();  //關掉原視窗     	 	
} 
function vrshrPrc(event){
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
	  aprv.setAttribute("style","color:green;font-size:20px;font-weight:bold;"); 
	  var rcdindex=0;
	  var query_no='';
	  var fieldlast=(document.getElementById("TRN_BOTT"))?4:3;
	
	  rcdindex=sourceAccount(null,0);
	  headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].innerHTML='N';				  
	  query_no=	headtable.rows[rcdindex].cells[1].innerHTML;
	  for (var i=1;i<headtable.rows[rcdindex].cells.length-fieldlast;i++){  //要變色
		    headtable.rows[rcdindex].cells[i].style.color="#704214";
			headtable.rows[rcdindex].cells[i].style.fontWeight="bold";	
	  }
	  var sendDeleRec="filename="+query_no;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
        var urlfolder=document.getElementsByTagName('title');
	    var urlpath=(left(urlfolder[0].innerHTML,3));	
		var url=urlpath+"/"+urlpath+"vrs.php?timestamp="+new Date().getTime();
        		
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);		
		function respond(){           
		  if (request.readyState == 4 && request.status == 200) {     
		   	   var rsp=request.responseText;				  
                headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-2].innerHTML=rsp.lastupdate;
		  }
		} 	  
	  if (tabs[0].checked){          //如果頁面為表頭
	       var responseDiv=document.getElementById("serverResponse1"); 
	  }else{

		 if (Cookies.get('auth01')=='Y'){
			  var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         } 		 
		   var responseDiv=document.getElementById("serverResponse2"); 
	  }
	  vrsbtt.setAttribute("style","display:none;");
	  detachEventListener(vrsbtt,"click",vrsproc,false);	
	  if(trnsbtt){
	     trnsbtt.setAttribute("style","visibility:hidden;");
	     detachEventListener(trnsbtt,"click",trnsproc,false);	
	  } 
	  	if (Cookies.get('auth08')=='Y'){
		    ansbtt.setAttribute("style","display:block;");
			attachEventListener(ansbtt,"click",ansproc,false);  //確認按鈕程序  
		}		
		 if (Cookies.get('auth02')=='Y'){			 
	        editbtt.style.visibility="visible";
			attachEventListener(editbtt,"click",edtrec,false);  //修改紀錄按鈕程序
		 }
	  
		 if (Cookies.get('auth03')=='Y'){
			 delbtt.style.visibility="visible";
			 attachEventListener(delbtt,"click",delrec,false);  //刪除紀錄按鈕程序
		 }
	  responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
      responseDiv.innerHTML=whichrspns3(urlpath); 	
	  aprv.innerHTML='\u{3246}\u{A0}\u{A0}\u{A0}\u{A0}'; 
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
	   case 'B04': {    
          tpemsg = '已確認過帳，請檢查相對應庫存與帳款是否正確...';   
          break;
      }
	  case 'D04': {    
          tpemsg = '奇月檔';   
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
	   case 'B04': {    
          tpemsg = '本單出貨料號庫存帳已加回，且帳款已減去...';   
          break;
      }
	  case 'D04': {    
          tpemsg = ' ';   
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
	   case 'B04': {    
          tpemsg = '本單出貨料號庫存帳已加回，且帳款已減去...';   
          break;
      }
	  case 'D04': {    
          tpemsg = ' ';   
          break;
      }
	   
       default: {
         break;
       }
    }
    return tpemsg;
}