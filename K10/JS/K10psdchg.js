function selfTag(jsvsn){
	//////
	var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text01,rspn2);
	 var spn2=document.createElement('span');
	spn2.id="dntOrRjt" ;
	spn2.setAttribute("style","font-size:150%;");
    cntdiv[1].insertBefore(spn2,rspn2); 
	
	  var text0a = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0a,rspn2);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
	spn1.setAttribute("style","font-size:120%;font-weight:bold;");
     spn1.innerHTML='收款金額:';
	cntdiv[1].insertBefore(spn1,rspn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
    spn3.setAttribute("style","font-size:120%;font-weight:bold;");
	spn3.innerHTML='0';
	 cntdiv[1].insertBefore(spn3,rspn2); 
	///// 
	  var text0b = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0b,rspn2);
	var spn4=document.createElement('span');
	spn4.id="ttltitle2";
	spn4.setAttribute("style","font-size:120%;font-weight:bold;");
     spn4.innerHTML='待沖金額:';
	cntdiv[1].insertBefore(spn4,rspn2);
	var spn5=document.createElement('span');
	spn5.id="ttlmny2";
	spn5.className="ttl";
    spn5.setAttribute("style","font-size:120%;font-weight:bold;");
	spn5.innerHTML='0';
	 cntdiv[1].insertBefore(spn5,rspn2);  
	 ////
	   var text0c = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0c,rspn2);
	var spn6=document.createElement('span');
	spn6.id="ttltitle2";
	spn6.setAttribute("style","font-size:120%;font-weight:bold;");
     spn6.innerHTML='剩餘未沖:';
	cntdiv[1].insertBefore(spn6,rspn2);
	var spn7=document.createElement('span');
	spn7.id="ttlmny3";
    spn7.setAttribute("style","font-size:120%;font-weight:bold;");
	spn7.innerHTML='0';
	 cntdiv[1].insertBefore(spn7,rspn2);  

	var orpButton5=document.getElementById("lgt");		  //離開按鈕    
	var text17 = document.createTextNode('\u{A0}');
	var orpButton7=document.createElement("input");		   
	orpButton7.setAttribute("type","button");
	orpButton7.setAttribute("class","btn");
	orpButton7.setAttribute("value","\u{2714}");       	      
	orpButton7.setAttribute("title","確認本張出貨退回所有紀錄，快速鍵Alt+A");  
	orpButton7.setAttribute("accesskey","A");					
	orpButton7.id="ANS_BOTT";				
	attachEventListener(orpButton7,"click",ansproc,false);    
	maindiv[0].insertBefore(orpButton7,orpButton5);


	var text19 = document.createTextNode('\u{A0}');
	var orpButton8=document.createElement("input");		   
	orpButton8.setAttribute("type","button");
	orpButton8.setAttribute("class","btn");
	orpButton8.setAttribute("value","\u{1F504}");       	      
	orpButton8.setAttribute("title","反確認本張出貨退回單所有紀錄，快速鍵Alt+Z");  
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
	//attachEventListener(orpButton6,"click",prntproc,false);  //列印按鈕程序	
	maindiv[0].insertBefore(text14,orpButton5);		
	maindiv[0].insertBefore(orpButton6,orpButton5);
	maindiv[0].insertBefore(text15,orpButton5);				 
	///
    var scriptall=document.getElementsByTagName("script");
	    for(var j=0;j<scriptall.length;j++){
	        if(scriptall[j].id){
	            scriptall[j].parentNode.removeChild(scriptall[j]);		 
		    }
	    }			
	///	
	loadScript(`K10/JS/K10.js?v=${jsvsn}`,function(){DrawTable();});
    loadScript(`K10/JS/K10rgst.js?v=${jsvsn}`);	 
	loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);		
	loadScript(`include/JS/confirmfun.js?v=${jsvsn}`);	
	loadScript(`C01/JS/A01Name.js?v=${jsvsn}`);	
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
		tab1Click.setAttribute("accesskey","1");  
	    attachEventListener(tab1Click,"click",tab1View,false);		
	}	
	var tab2Click=document.getElementById("tab2");	
	if(tab2Click){		
		tab2Click.setAttribute("accesskey","2");
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
		 if (getAuth[0]()[1]=='Y' && cko[0](0)==0 ){
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
   		var btns=getElementsByAttribute('class','btn');			 
		 for (var i=0;i<btns.length;i++){		
		     if(btns[i].accessKey=='I' || btns[i].accessKey=='M'){
		        btns[i].removeAttribute("accesskey");		
			 } 			 
	     }		   
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
	   var tables=getElementsByAttribute("class","gridlist");
	   var ths=tables[1].getElementsByTagName("th");		
      
	   
	   
       var keydescription=document.getElementById('keydscrpt1'); 
      	   
       var fthkey=document.getElementById("fatherkey1");
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
			  if (getAuth[0]()[1]=='Y' && cko[0](0)==0){
                 newrcath.style.visibility="visible";	
			     attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			  }
         }
        if(event!='GY'){  		 
		    var btns=getElementsByAttribute('class','btn');			 
		    for (var i=0;i<btns.length;i++){				     
			    if(right(btns[i].title,1)=='I' ||right(btns[i].title,1)=='M'){
		           btns[i].setAttribute("accesskey",right(btns[i].title,1));		
			    } 
	        }	
		}	
		var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件	
		scndttl.innerHTML=sourceAccount(11,0);
		var scndtt2=document.getElementById('ttlmny2');   //次頁表頭的總金額物件	
		//scndtt2.innerHTML='0';
	   commontemp(fthkey.innerHTML,"k0h.F01");
				  
}