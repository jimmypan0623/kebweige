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
	var orpButton10=document.createElement("input");		   
	orpButton10.setAttribute("type","button");
	orpButton10.setAttribute("class","btn");
	orpButton10.setAttribute("value","\u{1F4DC}");          
    orpButton10.setAttribute("style","font-size:17px;");       			
	orpButton10.setAttribute("title","查看出貨紀錄，快速鍵 Alt+B");   
	orpButton10.setAttribute("accesskey","B");	
	attachEventListener(orpButton10,"click",page2OtherButton1,false);
	orpButton10.id="OUTRCD_BOTT";		
	var text16 = document.createTextNode('\u{A0}\u{A0}');
	var text17 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');   	
	frag1.appendChild(text16);	
	frag1.appendChild(orpButton10);	
	frag1.appendChild(text17);	
	var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}');
	frag1.appendChild(text01);	
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
     spn1.innerHTML='總金額:';
	frag1.appendChild(spn1);	
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
	frag1.appendChild(spn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
	spn3.className='ttl';
	spn3.innerHTML='0';
	frag1.appendChild(spn3);
	cntdiv[1].insertBefore(frag1,rspn2);
	////  	  	 
	var orpButton5=document.getElementById("lgt");		  //離開按鈕    
	const frag2 = document.createDocumentFragment();
	var text17 = document.createTextNode('\u{A0}');
	var orpButton7=document.createElement("input");		   
	orpButton7.setAttribute("type","button");
	orpButton7.setAttribute("class","btn");
	orpButton7.setAttribute("value","\u{2714}");       	      
	orpButton7.setAttribute("title","確認本訂單所有紀錄，快速鍵Alt+A");  
	orpButton7.setAttribute("accesskey","A");					
	orpButton7.id="ANS_BOTT";				
	attachEventListener(orpButton7,"click",ansproc,false);    
	frag2.appendChild(orpButton7);
	orpButton7.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");	  
	var text19 = document.createTextNode('\u{A0}');
	var orpButton8=document.createElement("input");		   
	orpButton8.setAttribute("type","button");
	orpButton8.setAttribute("class","btn");
	orpButton8.setAttribute("value","\u{1F504}");       	      
	orpButton8.setAttribute("title","反確認本訂單所有紀錄，快速鍵Alt+Z");  
	orpButton8.setAttribute("accesskey","Z");					
	orpButton8.id="VRS_BOTT";				
	attachEventListener(orpButton8,"click",vrsproc,false);    
	frag2.appendChild(orpButton8);
	orpButton8.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");				 
	var text21 = document.createTextNode('\u{A0}');
	var orpButton9=document.createElement("input");		   
	orpButton9.setAttribute("type","button");
	orpButton9.setAttribute("class","btn");
	orpButton9.setAttribute("value","\u{1F516}");       		      
	orpButton9.setAttribute("title","直接轉出貨單，快速鍵Alt+G");  
	orpButton9.setAttribute("accesskey","G");					
	orpButton9.id="TRN_BOTT";						 
	frag2.appendChild(orpButton9);
	frag2.appendChild(text21);
	orpButton9.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");		
	var cokath4=getAuth[0]()[4];
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
		frag2.appendChild(orpButton6);
		frag2.appendChild(text15);
		orpButton6.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");		
	}	    	
	maindiv[0].insertBefore(frag2,orpButton5);	
	///
    document.querySelectorAll("script[id]").forEach(s=>s.remove());		
	///		
	let axtmpl1=jsPth+jsPth.substr(0,3)+'.js?v='+jsvsn;
	let axtmpl2=jsPth+jsPth.substr(0,3)+'rgst.js?v='+jsvsn;
	loadScript(`${axtmpl1}`,function(){DrawTable();});
	loadScript(`${axtmpl2}`);
	loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);	 
	loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);	
	loadScript(`include/JS/confirmfun.js?v=${jsvsn}`);
	loadScript(`C01/JS/A01Name.js?v=${jsvsn}`);	
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
		 if (getAuth[0]()[1]=='Y'){
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
		     if(btns[i].accessKey=='I' || btns[i].accessKey=='M' || btns[i].accessKey=='B'){
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
				   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列				 
			     
			  }					
               shrno=aWaitUpdate[aWaitUpdate.length-2]	;		              			   
               document.getElementById('crncy').innerHTML=aWaitUpdate[aWaitUpdate.length-7]+'&nbsp';                  
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
			  if (getAuth[0]()[1]=='Y'){
                 newrcath.style.visibility="visible";	
			     attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			  }
         }	
		if(event!='GY'){ 
            var btns=getElementsByAttribute('class','btn');			 
		    for (var i=0;i<btns.length;i++){		
		        if(btns[i].accessKey=='T' || btns[i].accessKey=='J' || btns[i].accessKey=='K' || btns[i].accessKey=='V'){		    
		           btns[i].removeAttribute("accesskey");		
			    } 
			    if(right(btns[i].title,1)=='I' ||right(btns[i].title,1)=='M' || right(btns[i].title,1)=='B'){
		            btns[i].setAttribute("accesskey",right(btns[i].title,1));		
			    } 
	        }	
		}	
	    commontemp(fthkey.innerHTML,"d04.F01");		
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
	

	var urlphp="D04/BKND/D04report.php?ourCompany="+ourcmp+"&queryNo="+headdata[0]+"&customNo="+headdata[1]+"\u{A0}"+headdata[3];	
    urlphp+="&salesMan="+headdata[5]+"\u{A0}"+headdata[6]+"\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}"+"&curNcy="+headdata[7]+"&shipAddress="+headdata[9];
	urlphp+="&shipDirect="+headdata[10]+"&customerPo="+headdata[8]+"&isConfrim="+headdata[12]+"&username="+username;		 
	 window.open(urlphp,"_blank");
	return;
	 */

    const e = event || window.event;

    // 1. 取得表格並精確定位選中的行 (Checkbox 勾選的那一行)
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    const checkedInput = maintable.querySelector('input[type="checkbox"]:checked');
    if (!checkedInput) {
        alert("請先選擇一筆採購單據");
        return;
    }

    // 將該行單元格轉為陣列，並清理前後空白
    const row = checkedInput.closest('tr');
    const cells = Array.from(row.cells).map(cell => cell.innerText.trim());

    // 2. 取得環境與權限參數
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || "";
    
    let ourcmp = "";
    try {
        // 確保 getAuth 存在，避免腳本中斷
        ourcmp = (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "";
    } catch (err) {
        console.warn("無法取得公司名稱 (ourCompany)");
    }

    // 3. 封裝採購單專用參數 (依照 headdata 索引對應)
    // 原 headdata[0] = cells[1], headdata[1] = cells[2] ... 依此類推
    const params = {
        ourCompany:  ourcmp,
        queryNo:     cells[1], // 採購單號
        // 供應商編號 + 空格 + 供應商簡稱
        customNo:    `${cells[2]}\u00A0${cells[4]}`, 
        // 採購人員 + 空格 + 姓名 + 填充空格
        salesMan:    `${cells[6]}\u00A0${cells[7]}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`,
        curNcy:      cells[8],  // 幣別
        shipAddress: cells[10], // 交貨地點 (地址常有 # 號，此處已安全化)
        shipDirect:  cells[11], // 運輸方式
        customerPo:  cells[9],  // 對方單號
        isConfrim:   cells[13], // 確認狀態 (Y/N)
        username:    username   // 登入者
    };

    // 4. 使用物件導向方式建立查詢字串
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
            searchParams.append(key, params[key]);
        }
    });

    // 5. 組合最終 URL 並開啟
    const urlphp = `D04/BKND/D04report.php?${searchParams.toString()}`;
    window.open(urlphp, "_blank");	
}