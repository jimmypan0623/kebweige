function selfTag(jsvsn,jsPth){
	////
	var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 
	const frag1 = document.createDocumentFragment();
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 //cntdiv[1].insertBefore(text01,rspn2);
	 frag1.appendChild(text01);
	 var spn2=document.createElement('span');
	spn2.id="dntOrRjt" ;
	spn2.setAttribute("style","font-size:150%;");
    //cntdiv[1].insertBefore(spn2,rspn2); 
	frag1.appendChild(spn2);
	  var text0a = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	// cntdiv[1].insertBefore(text0a,rspn2);
	frag1.appendChild(text0a);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
	spn1.setAttribute("style","font-size:120%;font-weight:bold;");
     spn1.innerHTML='總金額:';
	//cntdiv[1].insertBefore(spn1,rspn2);
    frag1.appendChild(spn1);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
	spn3.className='ttl';
    spn3.setAttribute("style","font-size:120%;font-weight:bold;");
	spn3.innerHTML='0';
	// cntdiv[1].insertBefore(spn3,rspn2); 
	frag1.appendChild(spn3);
	cntdiv[1].insertBefore(frag1,rspn2); 
	var orpButton5=document.getElementById("lgt");		  //離開按鈕   
	const frag2 = document.createDocumentFragment();
	var text17 = document.createTextNode('\u{A0}');
	var orpButton7=document.createElement("input");		   
	orpButton7.setAttribute("type","button");
	orpButton7.setAttribute("class","btn");
	orpButton7.setAttribute("value","\u{2714}");       	      
	orpButton7.setAttribute("title","確認本張出貨退回所有紀錄，快速鍵Alt+A");  
	orpButton7.setAttribute("accesskey","A");					
	orpButton7.id="ANS_BOTT";				
	attachEventListener(orpButton7,"click",ansproc,false);    
	//maindiv[0].insertBefore(orpButton7,orpButton5);
    frag2.appendChild(orpButton7);   
	var text19 = document.createTextNode('\u{A0}');
	var orpButton8=document.createElement("input");		   
	orpButton8.setAttribute("type","button");
	orpButton8.setAttribute("class","btn");
	orpButton8.setAttribute("value","\u{1F504}");       	      
	orpButton8.setAttribute("title","反確認本張出貨退回單所有紀錄，快速鍵Alt+Z");  
	orpButton8.setAttribute("accesskey","Z");					
	orpButton8.id="VRS_BOTT";				
	attachEventListener(orpButton8,"click",vrsproc,false);    
	 frag2.appendChild(orpButton8);   
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
	//maindiv[0].insertBefore(text14,orpButton5);	
	frag2.appendChild(text14);   
	frag2.appendChild(orpButton6);   
	frag2.appendChild(text15);   
	maindiv[0].insertBefore(frag2,orpButton5);
	///
    document.querySelectorAll("script[id]").forEach(s=>s.remove());		
	///	
	var axtmpl1=jsPth+jsPth.substr(0,3)+'.js?v='+jsvsn;
	var axtmpl2=jsPth+jsPth.substr(0,3)+'rgst.js?v='+jsvsn;
	loadScript(`${axtmpl1}`,function(){DrawTable();});
	loadScript(`${axtmpl2}`);
	loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);		
	loadScript(`include/JS/confirmfun.js?v=${jsvsn}`);	
	loadScript(`C01/JS/A01Name.js?v=${jsvsn}`);	
	loadScript(`B02/JS/A14Name.js?v=${jsvsn}`);	
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
       var rjtdnt=document.getElementById('dntOrRjt');
	   var srcvlue=sourceAccount(20,0)*1;
	   if(srcvlue==1){	     
	       if(!ths[9]){
			   var ths9=document.createElement('th');
			   var text9 = document.createTextNode('補貨日期');
			   ths9.appendChild(text9);
			   ths9.style.width='10%';
			   ths[8].parentNode.appendChild(ths9);
	       }
		    
		   rjtdnt.innerHTML='\u{1F69A}';   //'\u{1F3FB}';   //'\u{88DC}';
	   }else{
		  if(ths[9]){
		    ths[8].parentNode.removeChild(ths[9]);
		  }
		   
		   if(srcvlue==3){	
		      rjtdnt.innerHTML='\u{1F911}'; //'\u{1F9FE}';//'\u{6298}';
		   }else{
		       rjtdnt.innerHTML='\u{1F9FA}';//'\u{9000}';
		   }
	   }
	   
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
	   commontemp(fthkey.innerHTML,"b0e.F01");
						  
}