function selfTag(jsvsn){
	
	 var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 var text6 = document.createTextNode('\u{A0}');
	var contentdiv=getElementsByAttribute('class','tab_content');	
	var svrSpns1=document.getElementById('serverResponse1'); 
    if (Cookies.get('auth05')=='Y'){	 
	    var cpyAuthButton=document.createElement("input");		   
		cpyAuthButton.setAttribute("type","button");
		cpyAuthButton.setAttribute("class","btn");
		cpyAuthButton.setAttribute("value","\u{1F465}");    
	    cpyAuthButton.setAttribute("style","font-size:17px;");
		cpyAuthButton.setAttribute("title","複製此帳戶權限予以他人");							
		cpyAuthButton.id="COPY_BOTT";		
		attachEventListener(cpyAuthButton,"click",authCopy,false);  //複製權限按鈕程序
		contentdiv[0].insertBefore(text5,svrSpns1);
	    contentdiv[0].insertBefore(cpyAuthButton,svrSpns1);
		contentdiv[0].insertBefore(text6,svrSpns1);
	}
	if (Cookies.get('auth06')=='Y'){	 
	    var reMoveButton=document.createElement("input");		   
		reMoveButton.setAttribute("type","button");
		reMoveButton.setAttribute("class","btn");
		reMoveButton.setAttribute("value","\u{1F512}");    
	    reMoveButton.setAttribute("style","font-size:17px;");
		reMoveButton.setAttribute("title","移除此帳戶所有功能權限");							
		reMoveButton.id="REMOVE_BOTT";		
		attachEventListener(reMoveButton,"click",authRemove,false);  //移除權限按鈕程序
	    contentdiv[0].insertBefore(reMoveButton,svrSpns1);
	}
	loadScript(`A02/A02.js?v=${jsvsn}`,function(){DrawTable();});	
	  loadScript(`A02/A02rgst.js?v=${jsvsn}`);
	  loadScript(`A02/A02srch.js?v=${jsvsn}`);
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
		 var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#FCFCFC";
		 localbottoncl.style.border=" 2px solid #FCFCFC";
		 localbottoncl.style.boxShadow ="sandybrown 5px 10px 10px 7px";
		 var bibau=cko[3](0);   //找出閉包變數現值
	     cko[3](bibau*(-1));    //將表身閉包變數歸零			 
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
       var maintable=document.getElementById("maintbody1");		//所指向的表頭紀錄	
	   var topvth=0;
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){
				  if(maintable.rows[i].cells[j].className=='directdata'){
					aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
				  }
			   }							  
               break;					   
		   }
	   } 
	    
	   keydescription.innerHTML=aWaitUpdate[2];
	   fthkey.innerHTML=aWaitUpdate[1];
	   var responseDiv=document.getElementById("serverResponse2"); 
	   responseDiv.innerHTML='&nbsp';
	   var bibau=cko[3](0);   //找出閉包變數現值
	   cko[3](bibau*(-1));    //將表身閉包變數歸零						   
	   
	   commontemp(fthkey.innerHTML,"a02.F01");
						  
}