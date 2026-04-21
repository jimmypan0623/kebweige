function selfTag(jsvsn,jsPth){	
    ////
	var maindiv=document.getElementsByClassName('tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 	
	const frag1 = document.createDocumentFragment();
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');	
	 frag1.appendChild(text01);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";	
     spn1.textContent='總金額:';
	 frag1.appendChild(spn1);
	
	var spn2=document.createElement('span');
	spn2.id="ttlmny";  
	spn2.className='ttl';
	spn2.textContent='0';
	 frag1.appendChild(spn2);
	 var spn3=document.createElement('span');
	spn3.id="isTax" ;	    
	frag1.appendChild(spn3);
	 
	 cntdiv[1].insertBefore(frag1,rspn2);
	////

	 
	var orpButton5=document.getElementById("lgt");		  //離開按鈕    
    const frag2 = document.createDocumentFragment();
	var orpButton7=document.createElement("input");		   
	
	orpButton7.type="button";
	orpButton7.className="btn";
	orpButton7.value="\u{2714}";       	      
	orpButton7.title="確認本張出貨單所有紀錄，快速鍵Alt+A";  
	orpButton7.accessKey="A";			
	orpButton7.id="ANS_BOTT";				
	attachEventListener(orpButton7,"click",ansproc,false);    
	frag2.appendChild(orpButton7);
	var orpButton8=document.createElement("input");		   
	 
	orpButton8.type="button";	
	orpButton8.className="btn";
	orpButton8.value="\u{1F504}";       	      
	orpButton8.title="反確認本張出貨單所有紀錄，快速鍵Alt+Z";  
	orpButton8.accessKey="Z";	
	////
	orpButton8.id="VRS_BOTT";				
	attachEventListener(orpButton8,"click",vrsproc,false);    
	maindiv[0].insertBefore(orpButton8,orpButton5);	 
	orpButton8.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");				 	   
	var text14 = document.createTextNode('\u{A0}\u{A0}');
	var text15 = document.createTextNode('\u{A0}\u{A0}');
	var orpButton6=document.createElement("input");		   
	orpButton6.type="button";
	orpButton6.className="btn";
	orpButton6.value="\u{1F5A8}";      // \u{1F5B6 	  
	orpButton6.title="列印所選紀錄，快速鍵Alt+P";  
	orpButton6.accessKey="P";					
	orpButton6.id="PRNT_BOTT";			
	
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
	/* if (typeof event=="undefined")
	{
		event=window.event;
	}
   
	
	var headdata=[];
	 var maintable=document.getElementById("maintbody1");	 
	 for(var i=0;i< maintable.rows.length; i++){			 
		 if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
					
			for (var j=1;j<maintable.rows[i].cells.length-2;j++){    //要從單據編號開始計	
				 headdata.push(maintable.rows[i].cells[j].innerHTML);	
			}
			break;
		 }
	}

   
	 var urlcmp=(decodeURI(window.location.search));
	 var rslt=getUrlParams2(urlcmp);
	 var username=rslt.username;
	  var ourcmp=getAuth[2]()[0].INT_000;
	

	var urlphp="B04/BKND/B04report.php?ourCompany="+ourcmp+"&queryNo="+headdata[0]+"&customNo="+headdata[1]+"\u{A0}"+encodeURIComponent(headdata[3]);	
    urlphp+="&shipAddress="+encodeURIComponent(headdata[18])+"&contact="+headdata[5]+"\u{A0}\u{A0}\u{A0}\u{A0}"+"&telNo="+encodeURIComponent(headdata[6])+"&salesMan="+headdata[8]+"\u{A0}"+headdata[9]+"\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}"
	urlphp+="&curNcy="+encodeURIComponent(headdata[10])+"\u{A0}\u{A0}"+"&rate="+headdata[11]+"&shipDate="+headdata[20]+"-"+headdata[7];
	urlphp+="&shipDirect="+headdata[19]+"&invoiceNo="+headdata[12]+"&payment="+headdata[17]+"&isConfrim="+headdata[21]+"&username="+username;		 
	 window.open(urlphp,"_blank");
	return; */
	
	const e = event || window.event;
    
    // 1. 取得表格中被選中的資料列
    const maintable = document.getElementById("maintbody1");
    if (!maintbody1) return;

    let selectedRow = null;
    // 使用 querySelector 直接找出被勾選的項目
    const checkedInput = maintable.querySelector('input[type="checkbox"]:checked');
    
    if (!checkedInput) {
        alert("請先選擇一筆單據");
        return;
    }

    // 取得該勾選框所在的整行 TR
    const row = checkedInput.closest('tr');
    const cells = Array.from(row.cells).map(cell => cell.innerText.trim()); // 使用 innerText 取得純文字比較安全

    // 2. 獲取環境參數
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || "";
    const ourcmp = (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "";

    // 3. 建立參數物件 (這對應你原本 headdata[j] 的順序)
    // 根據你原本的索引 j=1 開始，對應 cells[1]
    const params = {
        ourCompany: ourcmp,
        queryNo: cells[1],
        // 客戶編號 + 空格 + 某個名稱
        customNo: `${cells[2]}\u00A0${cells[4]}`, 
        shipAddress: cells[19],
        contact: `${cells[6]}\u00A0\u00A0\u00A0\u00A0`,
        telNo: cells[7], // 這裡包含 # 號，會被自動處理
        salesMan: `${cells[9]}\u00A0${cells[10]}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`,
        curNcy: `${cells[11]}\u00A0\u00A0`,
        rate: cells[12],
        shipDate: `${cells[21]}-${cells[8]}`,
        shipDirect: cells[20],
        invoiceNo: cells[13],
		invoiceType: cells[14],
		taxType: cells[16],
        payment: cells[18],
        isConfrim: cells[22],
        username: username
    };

    // 4. 使用 URLSearchParams 自動進行 URL 編碼
    const searchParams = new URLSearchParams();
    for (const key in params) {
        searchParams.append(key, params[key]);
    }

    const urlphp = `B04/BKND/B04report.php?${searchParams.toString()}`;
    
    // 5. 開啟視窗
    window.open(urlphp, "_blank");
	
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
		 localbottoncl.style.border=" 2px solid ##FCFCFC";
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
       /* if (typeof event=="undefined"){
		event=window.event;
    	} */
		event = event || window.event;
	    var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#F9FAD9";
		 localbottoncl.style.border=" 2px solid #F9FAD9";
		 localbottoncl.style.boxShadow="olivedrab 5px 10px 10px 7px";
	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
       var keydescription=document.getElementById('keydscrpt1'); 
    
       var fthkey=document.getElementById("fatherkey1");
	   var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
	   var shrno="";	   
       var maintable=document.getElementById("maintbody1");		//所指向的表頭紀錄		 				 	 
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){			   
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){				  
				   aWaitUpdate.push(maintable.rows[i].cells[j].textContent);  //將待修改欄位資料存入陣列				 			      
			   }					
               shrno=aWaitUpdate[aWaitUpdate.length-2]	;		        
               break;					   
		   }
	   } 	   	 
	   keydescription.textContent=aWaitUpdate[2]+'\u{A0}'+aWaitUpdate[3];
	   fthkey.textContent=aWaitUpdate[1];
	   var responseDiv=document.getElementById("serverResponse2"); 
	   responseDiv.textContent='\u{A0}';
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
	   commontemp(fthkey.textContent,"b0d.F01");
						  
}

