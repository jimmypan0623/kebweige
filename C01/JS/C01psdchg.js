function selfTag(jsvsn){	
    ////
	 var cntdiv=getElementsByAttribute('class','tab_content');  	
	  var firstCover=getElementsByAttribute('class','table_cover');	
	 firstCover[0].style.width="32%";
	
	 var secondCover=document.createElement('div');
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="68%";
    righttbl1=document.createElement("table");
	righttbl1.id="rightMember1";			
	var arrayRgt1=["客戶編號:","客戶名稱:","客戶簡稱:","重要等級:","統一編號:","客戶類型:",
	"主要產品:","地區別:","發票抬頭:","發票品號:","發票種類:","課稅別:",
	"英文名稱:","公司地址:","送貨地址:","英文地址:","出貨指示:","聯絡人:",
	"負責人:","電話:","傳真:","E-mail:","母公司編號:","交易幣別:","結帳日期:","請款日:",
	"付款方式:","票期(T/T)天數:","業務擔當:","業務助理:","交貨方式:","收件人:","其他備註:","最後交易:",
	"最後報價:","最後更新:"];
     var arrayRgt2=["<span name='c01value' id='custom_no' ></span>","<span name='c01value' id='custom_name'></span>",
	 "<span name='c01value' id='custom_name_abbrv'></span>","<span name='c01value' id='level_of_impt'></span>",
	 "<span name='c01value' id='unite_no'></span>","<span name='c01value' id='business_type'>",
	 "<span name='c01value' id='main_product'></span>","<span name='c01value' id='area_domain'></span>",
	 "<span name='c01value' id='title_invoice'></span>","<span name='c01value' id='partno_invoice'>",
	 "<span name='c01value' id='typeofincoice'></span>","<span name='c01value' id='typeoftax'></span>",
	 "<span name='c01value' id='englishname'></span>","<span name='c01value' id='addrss'></span>",
	 "<span name='c01value' id='shipaddrss'></span>","<span name='c01value' id='englishaddrss'></span>",
	 "<span name='c01value' id='guide_ship'>","<span name='c01value' id='window_man'></span>",
	 "<span name='c01value' id='representive'></span>","<span name='c01value' id='tel_no'></span>",
	 "<span name='c01value' id='fax_no'></span>","<span name='c01value' id='emailaddrss'></span>",  
	 "<span name='c01value' id='gtoupno'></span>","<span name='c01value' id='typeofcrnt'></span>&nbsp&nbsp<span name='c01value' id='crnt_name'></span>",
	  "<span name='c01value' id='dayofincount'></span>","<span name='c01value' id='dayofcharge'></span>",
	 "<span name='c01value' id='typeofpay'></span>","<span name='c01value' id='paymentterm'></span>",
	 "<span name='c01value' id='sales_no'></span>&nbsp&nbsp<span name='c01value' id='sales_name'></span>","<span name='c01value' id='assistant_no'></span>&nbsp&nbsp<span name='c01value' id='assistant_name'></span>",
	 "<span name='c01value' id='wayofship'></span>","<span name='c01value' id='receiver'></span>",
	 "<span name='c01value' id='otherremark'></span>","<span name='c01value' id='lasttrade'></span>",
	 "<span name='c01value' id='lastquot'></span","<span name='c01value' id='lastchange'></span>"];  
	 var rowPop=[34,32,30,28,26,23,21,19,17,16,15,14,13,12,10,8,5,2,0]; //算好哪一欄要重新一列丟到陣列(逆排序)
	for(var i=0;i<arrayRgt1.length;i++){  //一陣列指示產生一列,完畢後pop掉
		if(i==rowPop[rowPop.length-1]){	
		    var oTr=righttbl1.insertRow(-1);		
			rowPop.pop();
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);
		 if (i==0 || i==22 ){
		     oTd.style.width='15%';		 
		 }
		  if (i==3){
		      oTd.style.width='5%';	
		  }
		 if(i==9 || i==33){
		     oTd.style.width='15%';		 
		 }
         oTd.innerHTML=arrayRgt2[i];
	}		
	secondCover.appendChild(righttbl1); 
	cntdiv[0].appendChild(secondCover); 	
    var tabnames=getElementsByAttribute('name','tablbl');	
 
		
    if(getAuth[0]()[5]=='Y'){	 //有查看報價紀錄權限時
	
	 
		var rspn2=document.getElementById('serverResponse2'); 
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    cntdiv[1].insertBefore(text01,rspn2);
	   var spn1=document.createElement('span');
	   spn1.id="ttltitle";
       spn1.innerHTML="報價筆數:";
	   cntdiv[1].insertBefore(spn1,rspn2);
	   var spn3=document.createElement('span');
	   spn3.id="ttlmny";
	   spn3.innerHTML='0';
	   cntdiv[1].insertBefore(spn3,rspn2);	 
	}else{
	    cntdiv[1].style.display='none';
	    tabnames[1].style.display='none';        
	}
	////
    var scriptall=document.getElementsByTagName("script");
	    for(var j=0;j<scriptall.length;j++){
	        if(scriptall[j].id){
	            scriptall[j].parentNode.removeChild(scriptall[j]);		 
		    }
	    }			
	///		
	loadScript(`C01/JS/C01.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`C01/JS/C01rgst.js?v=${jsvsn}`);
	loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);	
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

function tab1View(event){	  
 
	   if (typeof event=="undefined"){
		   event=window.event;
    	}
		var target=getEventTarget(event);
	/* 	var srchbtt=document.getElementById('SEEK_BOTT');		
		srchbtt.style.visibility="visible";	 */
		var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (getAuth[0]()[1]=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			 detachEventListener(newrcath,"click",addrec,false);
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
			 if(right(btns[i].title,1)=='T' || right(btns[i].title,1)=='J' || right(btns[i].title,1)=='K' || right(btns[i].title,1)=='V'){
		        btns[i].setAttribute("accesskey",right(btns[i].title,1));		
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
      if(getAuth[0]()[5]!='Y'){		     
		 blkshow("你無查看報價紀錄權限");		 
	     document.getElementById("tab1").checked=true;	
		 return false;	 
	  } 		  
	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
	   var keydescription=document.getElementById('keydscrpt1');   
	    var srchbtt=document.getElementById('SEEK_BOTT');
	   var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕		
	    var editbtt=document.getElementById("EDIT_BOTT");
		var delbtt=document.getElementById("DEL_BOTT");
       var fthkey=document.getElementById("fatherkey1");
	   var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料

       var maintable=document.getElementById("maintbody1");		//所指向的單頭紀錄		 				 	 
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){				  
				   aWaitUpdate.push(maintable.rows[i].cells[j].textContent);  //將待修改欄位資料存入陣列				 
			   }				                           
               break;					   
		   }
	   } 
	   keydescription.textContent=aWaitUpdate[3];  //aWaitUpdate[2]+'&nbsp'+
	   fthkey.innerHTML=aWaitUpdate[1];
	    
	   if(aWaitUpdate[23]==fthkey.innerHTML){	   //群組編號等於自己編號
           if (getAuth[0]()[1]=='Y'){
               newrcath.setAttribute("style","visibility:visible;");
			   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			}else{
			   newrcath.setAttribute("style","visibility:hidden;");
			   detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
			}
			if(getAuth[0]()[2]=='Y'){
				    editbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(editbtt,"click",edtrec,false);
			}else{
			    editbtt.setAttribute("style","visibility:hidden;");
			    detachEventListener(editbtt,"click",edtrec,false);
			}
			if(getAuth[0]()[3]=='Y'){
				    delbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(delbtt,"click",delrec,false);
			}else{
			    delbtt.setAttribute("style","visibility:hidden;");
			    detachEventListener(delbtt,"click",delrec,false);
			}
			srchbtt.setAttribute("style","visibility:visible;");	
		    attachEventListener(srchbtt,'click',seekrec,false);  
	    }else{
			 srchbtt.setAttribute("style","visibility:hidden;");	
	     	detachEventListener(srchbtt,'click',seekrec,false);    			
		    newrcath.setAttribute("style","visibility:hidden;");
			detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
			editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
			delbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(delbtt,"click",delrec,false);
			
		}			  
	   
	   
	   var responseDiv=document.getElementById("serverResponse2"); 
	   responseDiv.innerHTML='&nbsp';
	   var bibau=cko[3](0);   //找出閉包變數現值
	   cko[3](bibau*(-1));    //將表身閉包變數歸零			
	    bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		var btns=getElementsByAttribute('class','btn');			 
		 for (var i=0;i<btns.length;i++){		
		     if(btns[i].accessKey=='T' || btns[i].accessKey=='J' || btns[i].accessKey=='K' || btns[i].accessKey=='V'){		    
		        btns[i].removeAttribute("accesskey");		
			 } 
			  if(right(btns[i].title,1)=='I' ||right(btns[i].title,1)=='M'){
		        btns[i].setAttribute("accesskey",right(btns[i].title,1));		
			 } 
	     }		    
	   commontemp(fthkey.innerHTML,"c02.F01");
}