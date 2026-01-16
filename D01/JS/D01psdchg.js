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
	var arrayRgt1=["廠商編號:","廠商名稱:","廠商簡稱:","品質等級:","統一編號:","營業項目:",
	"運送方式:","公司地址:","工廠地址:","聯絡人:","負責人:","電話:",
	"傳真:","E-mail:","交易幣別:","結帳日期:","請款日:","付款方式:",
	"票期(T/T)天數:","採購人員:","其他備註:","最後交易:","最後更新:"];
     var arrayRgt2=["<td><span name='d01value' id='vender_no'></span>","<span name='d01value' id='vender_name'></span>",
	 "<span name='d01value' id='vender_name_abbrv'></span>","<span name='d01value' id='level_of_impt'></span>",
	 "<span name='d01value' id='unite_no'></span>","<span name='d01value' id='main_product'>",
	 "<span name='d01value' id='way_of_ship'></span>","<span name='d01value' id='addrss'></span>",
	 "<span name='d01value' id='shipaddrss'></span>","<span name='d01value' id='window_man'>",
	 "<span name='d01value' id='representive'></span>","<span name='d01value' id='tel_no'></span>",
	 "<span name='d01value' id='fax_no'></span>","<span name='d01value' id='emailaddrss'></span>",
	 "<span name='d01value' id='typeofcrnt'></span>&nbsp&nbsp<span span name='d01value' id='crnt_name'></span>","<span name='d01value' id='dayofincount'></span>",
	 "<span name='d01value' id='dayofcharge'>","<span name='d01value' id='typeofpay'></span>",
	 "<span name='d01value' id='paymentterm'></span>","<span name='d01value' id='proc_no'></span>&nbsp&nbsp<span name='d01value' id='proc_name'></span>",
	 "<span name='d01value' id='otherremark'></span>","<span name='d01value' id='lasttrade'></span>",  
	 "<span name='d01value' id='lastchange'></span>"];  
	 var rowPop=[21,20,19,17,14,13,11,9,8,7,5,2,0]; //算好哪一欄要重新一列丟到陣列(逆排序)
	for(var i=0;i<arrayRgt1.length;i++){  //一陣列指示產生一列,完畢後pop掉
		if(i==rowPop[rowPop.length-1]){		  	
		    var oTr=righttbl1.insertRow(-1);		
			rowPop.pop();
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);
		 if (i==0 ){
		     oTd.style.width='12%';		 
		 }		
         oTd.innerHTML=arrayRgt2[i];
	}		
	secondCover.appendChild(righttbl1); 
	cntdiv[0].appendChild(secondCover); 
    var tabnames=getElementsByAttribute('name','tablbl');	
    var keynames=getElementsByAttribute('name','keyname');	
	if(getAuth[0]()[5]=='Y'){	 //有查看報價紀錄權限時
	   
		var rspn2=document.getElementById('serverResponse2'); 
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    cntdiv[1].insertBefore(text01,rspn2);
	    var spn1=document.createElement('span');
	    spn1.id="ttltitle";	 
        spn1.innerHTML="詢價筆數:";
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
	loadScript(`D01/JS/D01.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`D01/JS/D01rgst.js?v=${jsvsn}`);
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);	
    loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);	
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
		var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (getAuth[0]()[1]=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			
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
       var fthkey=document.getElementById("fatherkey1");
	   var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
	
       var maintable=document.getElementById("maintbody1");		//所指向的單頭紀錄		 				 	 
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){				  
				   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列				 
			   }				                           
               break;					   
		   }
	   } 
	   keydescription.innerHTML=aWaitUpdate[3];  //aWaitUpdate[2]+'&nbsp'+
	   fthkey.innerHTML=aWaitUpdate[1];
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
	   commontemp(fthkey.innerHTML,"d02.F01");
}