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
	orpButton7.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");	  
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
	var text21 = document.createTextNode('\u{A0}');
	var orpButton9=document.createElement("input");		   
	orpButton9.setAttribute("type","button");
	orpButton9.setAttribute("class","btn");
	orpButton9.setAttribute("value","\u{1F516}");       		      
	orpButton9.setAttribute("title","直接轉出貨單，快速鍵Alt+Y");  
	orpButton9.setAttribute("accesskey","Y");					
	orpButton9.id="TRN_BOTT";						 
	maindiv[0].insertBefore(orpButton9,orpButton5);
	maindiv[0].insertBefore(text21,orpButton5);				 
	orpButton9.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");		
	var cokath4=Cookies.get('auth04');
	if (cokath4=='Y'){	   
		var text15 = document.createTextNode('\u{A0}\u{A0}');
		var orpButton6=document.createElement("input");		   
		orpButton6.setAttribute("type","button");
		orpButton6.setAttribute("class","btn");
		orpButton6.setAttribute("value","\u{1F5A8}");      // \u{1F5B6 	  
	    orpButton6.setAttribute("title","列印所選紀錄，快速鍵Alt+P");  
		orpButton6.setAttribute("accesskey","P");					
		orpButton6.id="PRNT_BOTT";				
		attachEventListener(orpButton6,"click",prntproc,false);  //列印按鈕程序		 
		maindiv[0].insertBefore(orpButton6,orpButton5);
		maindiv[0].insertBefore(text15,orpButton5);				 
		orpButton6.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");		
	}	    
	var contentdiv=getElementsByAttribute('class','tab_content');	  	 
	var orpButton10=document.createElement("input");		   
	orpButton10.setAttribute("type","button");
	orpButton10.setAttribute("class","btn");
	orpButton10.setAttribute("value","\u{1F4DA}");          
    orpButton10.setAttribute("style","font-size:17px;");       			
	orpButton10.setAttribute("title","查看出貨紀錄");  
	//orpButton10.setAttribute("accesskey","Y");					
	//attachEventListener(orpButton10,"click",srchC10show,false);
	attachEventListener(orpButton10,"click",page2OtherButton1,false);
	orpButton10.id="OUTRCD_BOTT";		
	var text16 = document.createTextNode('\u{A0}\u{A0}');
	var text17 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
    var scndpgettl=document.getElementById('ttltitle');	
	  contentdiv[1].insertBefore(text16,scndpgettl);
	 contentdiv[1].insertBefore(orpButton10,scndpgettl);
	 contentdiv[1].insertBefore(text17,scndpgettl);
	loadScript(`C04/C04.js?v=${jsvsn}`,function(){DrawTable();});	
    loadScript(`C04/C04rgst.js?v=${jsvsn}`);	 
	loadScript(`C04/C01srch.js?v=${jsvsn}`);	 
	loadScript(`C01/A01srch.js?v=${jsvsn}`);	
	loadScript(`C01/A09getno.js?v=${jsvsn}`);	
	loadScript(`C04/B01srch.js?v=${jsvsn}`);	
	loadScript(`include/confirmfunction.js?v=${jsvsn}`);
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
	      attachEventListener(tab1Click,"click",tab1View,false);
	}	
	var tab2Click=document.getElementById("tab2");
	if(tab2Click){
	    attachEventListener(tab2Click,"click",tab2View,false);
	}
}

function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (Cookies.get('auth01')=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			 detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
         }			 
		 var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		  
		 localbottoncl.style.backgroundColor="#FCFCFC";
		 localbottoncl.style.border=" 2px solid #FCFCFC";
		 localbottoncl.style.boxShadow ="sandybrown 5px 10px 10px 7px";
		 var bibau=cko[3](0);   //找出閉包變數現值
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
               document.getElementById('crncy').innerHTML=aWaitUpdate[aWaitUpdate.length-7];   
                
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
			  if (Cookies.get('auth01')=='Y'){
                 newrcath.style.visibility="visible";	
			     attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			  }
         }			
		
        
	   commontemp(fthkey.innerHTML,"c04.F01");
		
}

function prntproc(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var headidx=0;
	var headdata=[];
	 var maintable=document.getElementById("maintbody1");	 
	 for(var i=0;i< maintable.rows.length; i++){			 
		 if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			headidx=i;				 					 
			break;
		 }
	}
	for (var i=1;i<maintable.rows[headidx].cells.length-3;i++){  //要從編號開始計		     					 			
	   headdata.push(maintable.rows[headidx].cells[i].innerHTML);			 
	}
	/*  var urlcmp=(decodeURI(window.location.search));
	 var ourcmp=urlcmp.substr(urlcmp.indexOf('=')+1); */
	  var urlcmp=(decodeURI(window.location.search));
	 var rslt=getUrlParams2(urlcmp);
	 var ourcmp=rslt.ourcompany;
	var urlphp="C21/C21report.php?ourCompany="+ourcmp+"&queryNo="+headdata[0]+"&customNo="+headdata[1]+' '+headdata[3];		 
	urlphp+="&salesMan="+headdata[6]+"&curNcy="+headdata[7]+"&shipWay="+headdata[9];
	urlphp+="&payMent="+headdata[10]+"&reMark="+headdata[11]+"&windowMan="+headdata[8];
	window.open(urlphp,"_blank");
	return;
}