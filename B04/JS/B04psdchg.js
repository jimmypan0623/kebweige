function selfTag(jsvsn){	
	var maindiv=getElementsByAttribute('class','tab_css');	  	 
	var orpButton5=document.getElementById("lgt");		  //離開按鈕    
	var text17 = document.createTextNode('\u{A0}');
	var orpButton7=document.createElement("input");		   
	orpButton7.setAttribute("type","button");
	orpButton7.setAttribute("class","btn");
	orpButton7.setAttribute("value","\u{2714}");       	      
	orpButton7.setAttribute("title","確認所選紀錄，快速鍵Alt+A");  
	orpButton7.setAttribute("accesskey","A");					
	orpButton7.id="ANS_BOTT";				
	attachEventListener(orpButton7,"click",ansproc,false);    
	maindiv[0].insertBefore(orpButton7,orpButton5);
	var text19 = document.createTextNode('\u{A0}');
	var orpButton8=document.createElement("input");		   
	orpButton8.setAttribute("type","button");
	orpButton8.setAttribute("class","btn");
	orpButton8.setAttribute("value","\u{1F504}");       	      
	orpButton8.setAttribute("title","反確認所選紀錄，快速鍵Alt+Z");  
	orpButton8.setAttribute("accesskey","Z");					
	orpButton8.id="VRS_BOTT";				
	attachEventListener(orpButton8,"click",vrsproc,false);    
	maindiv[0].insertBefore(orpButton8,orpButton5);	 
	orpButton8.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");				 	   
	var text14 = document.createTextNode('\u{A0}\u{A0}');
	var text15 = document.createTextNode('\u{A0}\u{A0}');
	var orpButton6=document.createElement("input");		   
	orpButton6.setAttribute("type","button");
	orpButton6.setAttribute("class","btn");
	orpButton6.setAttribute("value","\u{1F5A8}");      // \u{1F5B6 	  
	orpButton6.setAttribute("title","列印所選紀錄，快速鍵Alt+P");  
	orpButton6.setAttribute("accesskey","P");					
	orpButton6.id="PRNT_BOTT";					
	maindiv[0].insertBefore(text14,orpButton5);		
	maindiv[0].insertBefore(orpButton6,orpButton5);
	maindiv[0].insertBefore(text15,orpButton5);				 
	loadScript(`B04/JS/B04.js?v=${jsvsn}`,function(){DrawTable();});		
    loadScript(`B04/JS/B04rgst.js?v=${jsvsn}`);	 
	loadScript(`B04/JS/C01srch.js?v=${jsvsn}`);	 
	loadScript(`C01/JS/A01srch.js?v=${jsvsn}`);	
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);	
	loadScript(`B04/JS/B01srch.js?v=${jsvsn}`);	
	loadScript(`B04/JS/A14srch.js?v=${jsvsn}`);	
	loadScript(`include/JS/confirmfunction.js?=${jsvsn}`);	
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
	      attachEventListener(tab1Click,"click",tab1View,false);
	}	
	var tab2Click=document.getElementById("tab2");
	if(tab2Click){
	    attachEventListener(tab2Click,"click",tab2View,false);
	}		
}
function prntproc(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var headidx=0;
	var headdata=[];
	 var maintable=document.getElementById("maintbody1");	 
	 if(maintable.rows.length==0){
	    blkshow("空白資料無法列印!");
		return false;
	 }
	 for(var i=0;i< maintable.rows.length; i++){			 
		 if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			headidx=i;				 					 
			break;
		 }
	}
	for (var i=1;i<maintable.rows[headidx].cells.length-3;i++){  //要從編號開始計		     					 			
	   headdata.push(maintable.rows[headidx].cells[i].innerHTML);			 
	}
	 var urlcmp=(decodeURI(window.location.search));
	 var ourcmp=urlcmp.substr(urlcmp.indexOf('=')+1);
	var urlphp="C21/BKND/C21report.php?ourCompany="+ourcmp+"&queryNo="+headdata[0]+"&customNo="+headdata[1]+' '+headdata[2];		 
	urlphp+="&salesMan="+headdata[5]+"&curNcy="+headdata[6]+"&shipWay="+headdata[8];
	urlphp+="&payMent="+headdata[9]+"&reMark="+headdata[10]+"&windowMan="+headdata[7];
	window.open(urlphp,"_blank");
	return;
}
  
function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (Cookies.get('auth01')=='Y' && cko[0](0)==0 ){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			 detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
         }			 
		 var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#FCFCFC";
		 localbottoncl.style.border=" 2px solid ##FCFCFC";
		 localbottoncl.style.boxShadow ="sandybrown 5px 10px 10px 7px";
		 var bibau=cko[3](0);   //找出閉包變數現值
		 //var fthkey=document.getElementById("fatherkey");
	
	        cko[3](bibau*(-1));    //將表身閉包變數歸零
			bibau=cko[6](0);   //找出閉包變數現值
			cko[6](bibau*(-1));    //將表身閉包變數歸零
			 
}
function tab2View(event){	  
       if (typeof event=="undefined"){
		event=window.event;
    	}
	    var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#F9FAD9";
		 localbottoncl.style.border=" 2px solid #F9FAD9";
		 localbottoncl.style.boxShadow="olivedrab 5px 10px 10px 7px";
	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
       var keydescription=document.getElementById('keydscrpt'); 
    
       var fthkey=document.getElementById("fatherkey");
	   var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
	   var shrno="";	   
       var maintable=document.getElementById("maintbody1");		//所指向的表頭紀錄		 				 	 
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){			   
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){				  
				   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列				 			      
			   }					
               shrno=aWaitUpdate[aWaitUpdate.length-2]	;		        
               break;					   
		   }
	   } 
	   
	 
	   keydescription.innerHTML=aWaitUpdate[2]+'&nbsp'+aWaitUpdate[3];
	   fthkey.innerHTML=aWaitUpdate[1];
	   var responseDiv=document.getElementById("serverResponse2"); 
	   responseDiv.innerHTML='&nbsp';
	   var bibau=cko[3](0);   //找出閉包變數現值
	   cko[3](bibau*(-1));    //將表身閉包變數歸零			
	    bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
	   var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if(shrno=='Y'){
			 newrcath.style.visibility="hidden";
			 detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
         }else{
			  if (Cookies.get('auth01')=='Y' && cko[0](0)==0){
                 newrcath.style.visibility="visible";	
			     attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			  }
         }			 
        
	   commontemp(fthkey.innerHTML,"b0d.F01");
						  
}

