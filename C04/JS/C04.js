function getProfile(arr,reccount,tbno) {    
    var cnt=0;
	var queryttl=0;	    
    var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD)); ///
    var optdigts= (pagecount.toString()).length;                         ///
	if (tbno==0){     //如果是表頭   
        var slt2=document.getElementById('recmth');   ///
	    if (slt2.options.length<pagecount){   ///
    		for (var i=slt2.options.length+1;i<=pagecount;i++){  ///
			    var item_no=paddingLeft(i,optdigts);			 ///	
		        var varItem=new Option(item_no,item_no);       ///
	    	    slt2.options.add(varItem);	                ///
           }		        ///   
		   		   //第一個選項位數修正		   
		   slt2.options[0].value=paddingLeft(1,optdigts);    ///
		   slt2.options[0].text=paddingLeft(1,optdigts);     ///
		    var bibau=cko[0](0);   //找出閉包筆數變數現值
	        cko[0](bibau*(-1));    //將閉包變數歸零
		    cko[0](reccount);      //將筆數記起來	
          
	    }
		var oTable = document.getElementById("maintbody1");		
	}else{
		contentShow([]);  //清空右側資料
	    var oTable = document.getElementById("maintbody2");		
	}		
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件	
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		oTr.setAttribute("name","mainrow");	      		
		cnt++;		
		for (var jk in arr[i]) {
			var meta = parseFieldMeta(jk);
			var oTd = oTr.insertCell(-1);
			oTd.innerHTML = arr[i][jk];
			if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";
				oTd.style.width = meta.width;
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
									
				if(meta.name=='單價' && tbno==1){	
					attachEventListener(oTd, 'click', rowchoose, false);
					var oTd = oTr.insertCell(oTr.cells.length);
					oTd.setAttribute("class","indirectdata");					 
					oTd.setAttribute("style","width:8%;text-align:right;");	
					oTd.innerHTML=Math.round((oTr.cells[3].innerHTML*oTr.cells[4].innerHTML + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);	
					queryttl+=Number(oTd.innerHTML);
				}		 			
				if(meta.name=='開單未出' && tbno==1){	
					attachEventListener(oTd, 'click', rowchoose, false);
					var oTd = oTr.insertCell(oTr.cells.length);
					oTd.setAttribute("class","indirectdata");					 
					oTd.setAttribute("style","width:8%;text-align:right;");	
					oTd.innerHTML=Number(oTr.cells[3].innerHTML)-(Number(oTr.cells[8].innerHTML)+Number(oTr.cells[9].innerHTML));					 				
					  
				}				
			}
			// 點擊事件綁定
			attachEventListener(oTd, 'click', rowchoose, false);
		}
	    var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	    oTd.setAttribute("style","width:40px;display:none");   
	    var myCheck=document.createElement('input'); 
	    myCheck.type="checkbox";
	    if(tbno==0){
		    myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox單頭
		    if(arr[i]['是否確認_IHC_000']=='N'){  //未確認
			   oTr.setAttribute("style","font-weight:bold;color:#704214;"); 
		    }				  
	    }else{ 
		    myCheck.setAttribute("name","chkbxmember2");   //讓使用者勾選的checkbox表身
		    scndttl.innerHTML= (Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));             
	    }
	   attachEventListener(myCheck,'click',chooserc,false);		   
	   oTd.appendChild(myCheck);  		   		  
	}
	if (tbno==0){       //如果是單頭
	   var responseDiv=document.getElementById("serverResponse1");  
	}else{

	  var responseDiv=document.getElementById("serverResponse2"); 
       
	} 			  
	if(responseDiv.innerHTML=='Searching......'){    
		if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此資料！Not found!検索できません。";
			 scndttl.innerHTML="0";
	    }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";      //為何沒顯示
		}	
		  document.getElementById('ttltitle').innerHTML="本頁金額:";
	}else{
		if (tbno==1){       //如果是表身
		    document.getElementById('ttltitle').innerHTML="本單總額:";
		}else{
		    var btns=getElementsByAttribute('class','btn');			 
		    for (var i=0;i<btns.length;i++){		
		        if(btns[i].accessKey=='I' || btns[i].accessKey=='M' || btns[i].accessKey=='B'){
		            btns[i].removeAttribute("accesskey");		
			    } 			        
	        }		        
		}
	} 
	if(cnt>0){       //初始畫面呼叫
		  chooserc(1); //跳到第一列		  
	}else{
		scndttl.innerHTML="0";
		var apprv=document.getElementById('APPRVE');
		apprv.innerHTML="&nbsp";
	}		  
}

function choseExtraDeal(targetTrChildren,targetTr){   //紀錄移動  
    var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var trnsbtt=document.getElementById("TRN_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");
	var apprv=document.getElementById('APPRVE');

	var shrno=targetTr.cells[targetTr.cells.length-3].innerHTML;
	var trnno=targetTr.cells[targetTr.cells.length-4].innerHTML;
	if(shrno=='Y'){				
	    ansbtt.setAttribute("style","display:none;");
	    detachEventListener(ansbtt,"click",ansproc,false);
	    delbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(delbtt,"click",delrec,false);
	  	apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
	    if(trnno=='Y'){    //如果已轉出貨單反確認與轉單鈕不作用
		    vrsbtt.setAttribute("style","display:none;");
		    detachEventListener(vrsbtt,"click",vrsproc,false);
		    trnsbtt.setAttribute("style","display:none;");
		    detachEventListener(trnsbtt,"click",trnsproc,false);
	    }else{
		    if(getAuth[0]()[7]=='Y'){
			   trnsbtt.setAttribute("style","display:block;");
			   attachEventListener(trnsbtt,"click",trnsproc,false);
		    }else{
			   trnsbtt.setAttribute("style","display:none;");
			   detachEventListener(trnsbtt,"click",trnsproc,false);			
			}
		    if(getAuth[0]()[9]=='Y'){
			    vrsbtt.setAttribute("style","display:block;");
			    attachEventListener(vrsbtt,"click",vrsproc,false);
		    }else{
			    vrsbtt.setAttribute("style","display:none;");
			    detachEventListener(vrsbtt,"click",vrsproc,false);
			}		  		  
	    }
	}else{	   
		 vrsbtt.setAttribute("style","display:none;");
		 detachEventListener(vrsbtt,"click",vrsproc,false);
		 trnsbtt.setAttribute("style","display:none;");
		 detachEventListener(trnsbtt,"click",trnsproc,false);			   
		apprv.innerHTML='\u{A0}'; 
	    if(getAuth[0]()[8]=='Y'){		
		    ansbtt.setAttribute("style","display:block;");
		    attachEventListener(ansbtt,"click",ansproc,false);			 
	    }else{
		    ansbtt.setAttribute("style","display:none;");
		    detachEventListener(ansbtt,"click",ansproc,false);	
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
    }
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){  //紀錄移動表身
   
	    var outhis=document.getElementById("OUTRCD_BOTT");	 
		var invthis=document.getElementById("INVDTL_BOTT");	 
		var futurethis=document.getElementById("IFUTURE_BOTT");	 
		var nvlqty=targetTrChildren[8].innerHTML*1+targetTrChildren[9].innerHTML*1;
	    if(nvlqty>0){			 
		    outhis.setAttribute("style","font-size:120%;visibility:visible;"); 
		    attachEventListener(outhis,"click",page2OtherButton1,false);
	    }else{
		    outhis.setAttribute("style","visibility:hidden;"); 
	      detachEventListener(outhis,"click",page2OtherButton1,false);
	    }
		if(targetTrChildren[3].innerHTML*1-nvlqty>0){
		   var sendSrcRec="keyfield="+document.getElementById("fatherkey1").innerHTML+"|"+targetTrChildren[1].innerHTML;	//右側出貨計劃	      
		   contentShow(JSON.parse(targetTrChildren[12].innerHTML));  		
		   invthis.setAttribute("style","font-size:120%;visibility:visible;"); 
		   attachEventListener(invthis,"click",page2OtherButton2,false)
		   futurethis.setAttribute("style","font-size:120%;visibility:visible;"); 
		   attachEventListener(futurethis,"click",page2OtherButton3,false)
	    }else{
		   contentShow([]);    //若已經出光則不用再跑後端資料
		    invthis.setAttribute("style","visibility:hidden;"); 
	        detachEventListener(invthis,"click",page2OtherButton2,false);
			futurethis.setAttribute("style","visibility:hidden;"); 
	        detachEventListener(futurethis,"click",page2OtherButton3,false);
		   
		}
	
	    		
    return true;	
}
function rowchoseExtraDeal(targetRow){    //紀錄移動  
    var shrno=targetRow.cells[targetRow.cells.length-3].innerHTML;
	var trnno=targetRow.cells[targetRow.cells.length-4].innerHTML;	       
	var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var trnsbtt=document.getElementById("TRN_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");  
	var apprv=document.getElementById('APPRVE');	
	if(shrno=='Y'){		
		ansbtt.setAttribute("style","display:none;");
		detachEventListener(ansbtt,"click",ansproc,false);				
		delbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(delbtt,"click",delrec,false);
		apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
		if(trnno=='Y'){          //如果已轉出貨單反確認與轉單鈕不作用
			trnsbtt.setAttribute("style","display:none;");
			detachEventListener(trnsbtt,"click",trnsproc,false); 
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);			
		}else{
		    if(getAuth[0]()[9]=='Y'){
			   vrsbtt.setAttribute("style","display:block;");
			   attachEventListener(vrsbtt,"click",vrsproc,false);	
		    }else{
			    vrsbtt.setAttribute("style","display:none;");
			    detachEventListener(vrsbtt,"click",vrsproc,false);
			}
		    if(getAuth[0]()[7]=='Y'){
			    trnsbtt.setAttribute("style","display:block;");
				attachEventListener(trnsbtt,"click",trnsproc,false);	
		    }else{
			    trnsbtt.setAttribute("style","display:none;");
				detachEventListener(trnsbtt,"click",trnsproc,false);	
			}		  
		}
	}else{		
		trnsbtt.setAttribute("style","display:none;");
		detachEventListener(trnsbtt,"click",trnsproc,false); 
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);				 
		apprv.innerHTML='\u{A0}'; 
		if(getAuth[0]()[8]=='Y'){		  
		    ansbtt.setAttribute("style","display:block;");
		    attachEventListener(ansbtt,"click",ansproc,false);			  
		}else{
		    ansbtt.setAttribute("style","display:none;");
		    detachEventListener(ansbtt,"click",ansproc,false);
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
	}  	
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動表身   
    
		var outhis=document.getElementById("OUTRCD_BOTT");
		var invthis=document.getElementById("INVDTL_BOTT");	 
		var futurethis=document.getElementById("IFUTURE_BOTT");	 
		var nvlqty=targetRow.childNodes[8].innerHTML*1+targetRow.childNodes[9].innerHTML*1;
		 if(nvlqty>0){
			 outhis.setAttribute("style","visibility:visible;"); 
			 attachEventListener(outhis,"click",page2OtherButton1,false);
		 }else{
			outhis.setAttribute("style","visibility:hidden;"); 
			detachEventListener(outhis,"click",page2OtherButton1,false); 
		 }	
		  
		 if(targetRow.childNodes[3].innerHTML*1-nvlqty>0){
		    var sendSrcRec="keyfield="+document.getElementById("fatherkey1").innerHTML+"|"+targetRow.childNodes[1].innerHTML;	//右側出貨計劃	 
			contentShow(JSON.parse(targetRow.cells[12].innerHTML));
			invthis.setAttribute("style","font-size:120%;visibility:visible;"); 
		    attachEventListener(invthis,"click",page2OtherButton2,false)
		    futurethis.setAttribute("style","font-size:120%;visibility:visible;"); 
		    attachEventListener(futurethis,"click",page2OtherButton3,false)
		 }else{
		    contentShow([]);  //若已經出光則不用再跑後端資料
			invthis.setAttribute("style","visibility:hidden;"); 
	        detachEventListener(invthis,"click",page2OtherButton2,false);
			futurethis.setAttribute("style","visibility:hidden;"); 
	        detachEventListener(futurethis,"click",page2OtherButton3,false);
		 }			 
		
    return true;	
}

function getUrlParams2(url){  //解析url成物件
   let urlStr=url.split('?')[1];
   const urlSearchParams=new URLSearchParams(urlStr);
   const result=Object.fromEntries(urlSearchParams.entries());
   return result;

}

function contentShow(arr) {   // 右側分批出貨表格
    var oTable = document.getElementById("contentTbody");	
    
    // ✅ 直接高效清空舊表格內容
    oTable.innerHTML = ""; 

    if (!arr || arr.length === 0) return;

    // 明確指定欄位順序：date 在前、qty 在後
    var fieldOrder = ['date', 'qty'];

    for (var i = 0; i < arr.length; i++) {		
        var oTr = oTable.insertRow(-1);			  
        for (var idx = 0; idx < fieldOrder.length; idx++) {
            var jk = fieldOrder[idx];     
            var oTd = oTr.insertCell(-1);
            oTd.innerHTML = arr[i][jk] !== undefined ? arr[i][jk] : ''; 				 
            
            if (jk === 'qty') {
               oTd.style.textAlign = 'right';  // 數量靠右
            } else {
               oTd.style.textAlign = 'center'; // 日期置中
            }
        }
    }
}

/*
//瀏覽//
SELECT 
    c04.F01, c04.F02, c04.F03,
    jt.json_date, jt.json_qty            
FROM 
    c04,
    JSON_TABLE(
        c04.F07,
        '$[*]' COLUMNS (
            json_date VARCHAR(50) PATH '$.date',  -- 明確指定抓 date 欄位
            json_qty  INT         PATH '$.qty'   -- 明確指定抓 qty 欄位
        )
    ) AS jt 
WHERE c04.F01='CA26700044';     
			
//新增//
UPDATE c04 
SET F07 = JSON_ARRAY_APPEND(
    F07, 
    '$', 
    JSON_OBJECT('date', '2026-07-03', 'qty', 30) -- 明確定義 Key 名稱
) 
WHERE F01 = 'CA26700044';

//修改//
UPDATE c04 
SET F07 = JSON_SET(
    F07, 
    -- 尋找日期為 '2026-07-02' 的位置，並將其欄位路徑指向 qty
    REPLACE(JSON_UNQUOTE(JSON_SEARCH(F07, 'one', '2026-07-02')), '.date', '.qty'), 
    99 -- 要修改的新數量
) 
WHERE F01 = 'CA26700044' 
  AND JSON_SEARCH(F07, 'one', '2026-07-02') IS NOT NULL;
//刪除//
UPDATE c04 
SET F07 = JSON_REMOVE(
    F07, 
    -- 尋找日期為 '2026-07-02' 的物件路徑（將 .date 拿掉即為物件本身）
    REPLACE(JSON_UNQUOTE(JSON_SEARCH(F07, 'one', '2026-07-02')), '.date', '')
) 
WHERE F01 = 'CA26700044' 
  AND JSON_SEARCH(F07, 'one', '2026-07-02') IS NOT NULL;  
  
//整組替換//
UPDATE c04 
SET F07 = :傳入的JSON字串 
WHERE F01 = 'CA26700044';  
//複寫或寫入初始資料//
UPDATE c04 SET F07 = '[{"date":"2026-08-01","qty":1000}, {"date":"2026-09-12","qty":1000}]' WHERE F01 = 'CA26700045';


UPDATE c04 SET F07 = JSON_ARRAY( JSON_OBJECT( 'date', F06, 'qty', F03 - F09 - F21 ) ) WHERE F03 - F09 - F21 > 0;

*/

/* async function contenBkndAjax(sendSrcRec) {
    
     const url = "C04/BKND/C05Contentbrow.php";
    try {
        const response = await fetch(url, {
            method: 'POST',
			cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: sendSrcRec
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rsp = await response.json();
        
        // 確保 rsp 與 rsp.recdrow 存在再進行呼叫
        if (rsp && rsp.recdrow !== undefined) {
            contentShow(rsp.recdrow);
        } else {
            console.warn("回傳的資料格式不符:", rsp);
        }
    } catch (error) {
        console.error("請求失敗:", error);
		alert("系統連線失敗，請稍後再試");
    }
} */