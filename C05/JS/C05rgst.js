function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   	 
    var btns=getElementsByAttribute('class','btn');		
	var bttssn1=[];
    for (var i=0;i<btns.length;i++){
		bttssn1.push(btns[i].title);
		btns[i].setAttribute("accesskey",right(bttssn1[i],1));				 
	}		      		
	return true;
}	
function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	
	if(txtword==7){
		dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    
	}else{
	    dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
	}
    dropsheet.style.paddingTop="20px";      // 高度也往上提 		
   

    return true;
}
function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){  //在此無作用但也要有此函數被呼叫
    if (txtword==7) {
        var txtseek=document.getElementById('searchWords');
		txtseek.focus();
		attachEventListener(txtseek,'keypress',textKeypress,false);
			  
	}			
    return true;	
}

function page1Detail01(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";	
	ajTable.className="gridlist";                 	 	 		             				 
	 var url="C05/BKND/B04srch.php";  
	 var queryString ="filename="+sourceAccount(1,0)+'|'+sourceAccount(3,0);	 
	
	fetch(url, {
     method: 'POST',
	 cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString
    })
     .then(res => res.json())
     .then(rsp => searchReadyship(rsp, ajTable));
	 
}

function page1Detail02(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";
	ajTable.className="gridlist";                 	 		          				 
	 var url="B01/BKND/B11srch.php";   	    		    
	 var queryString ="filename="+sourceAccount(1,0);
	  
	 
	fetch(url, {
     method: 'POST',
	 cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString
    })
     .then(res => res.json())
     .then(rsp => srchStockNo(rsp, ajTable));
}

function page1Detail03(ajTable){    //查看預期結餘
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";	
	ajTable.className="gridlist";                 	 			
	
	 //var url="C05/BKND/E07srch.php?timestamp="+new Date().getTime();   	               				 
	 let url="C05/BKND/E07srch.php";
	  
	 let queryString ="filename="+sourceAccount(1,0)+'|'+sourceAccount(8,0)*1;	 
  
	
	fetch(url, {
     method: 'POST',
	 cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString
    })
     .then(res => res.json())
     .then(rsp => searchHaveshiped(rsp, ajTable)); 
	 
}

function searchReadyship(arr,ajTable) {       //搜尋相關料號開單未出
    let cnt=0;	  
    let array3=[];	
	let array4=[];	
	for(let i=0;i<arr.length;i++){				 		 
		var oTr=ajTable.insertRow(0);
		cnt++;         
		
		for(let jk in arr[i]){		   
		    let meta = parseFieldMeta(jk);
		    let oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
            if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
				oTd.style.width = meta.width;
				if(i==0 && !meta.isHidden){   //第一輪就塞進去											  
					array3.push(meta.name);  //欄名
				    array4.push(meta.width); //欄寬
				}
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
			}		
			
	    }	
	}
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}else{
	    var oTr=ajTable.insertRow(0);
		
	    for (let j = 0; j < array3.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[j]); //cell	
			th.style.width=array4[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}				
}

function srchStockNo(arr,ajTable) {       //搜尋相關料號
    let cnt=0;
	let array1=[];
	let array2=[];
	for(let i=0;i<arr.length;i++){				 
        var oTr=ajTable.insertRow(0);		
		cnt++;         
		
		for(let jk in arr[i]){		   
		    let meta = parseFieldMeta(jk);
		    var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
            if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
				oTd.style.width = meta.width;
				if(i==0 && !meta.isHidden){   //第一輪就塞進去											  
					array1.push(meta.name);  //欄名
				    array2.push(meta.width); //欄寬
				}
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
			}
			if(meta.name=='庫存數量'){
				
				if(arr[i]['列入計算_IHC_000']!='Y'){
			     
				    oTd.setAttribute("style",`width:${meta.width};text-align:right;text-decoration: line-through;color:#7f8890;`);
				
				}else{
					oTd.setAttribute("style",`width:${meta.width};text-align:right;`);
				}
			}
	    }	
        if(arr[i]['呆滯天數_IHC_000']>210 ){  //最後異動日期距今超過210天紅字		   
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");			
		}else if(arr[i]['呆滯天數_IHC_000']>90 ){//最後異動日期距今超過90天低於210天棕色字
			oTr.setAttribute("style","font-weight:bold;color:#704214;");			
		}
	}	
   
    if(cnt==0){
	  blkshow("無庫存資料!");
	  //return false;
	}else{
	    var oTr=ajTable.insertRow(0);
	    for (let j = 0; j < array1.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array1[j]); //cell	
			th.style.width=array2[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}			
}

function searchHaveshiped(arr,ajTable) {       //搜尋相關料號
    let cnt=0;
	let array3=[];
	let array4=[];	 
	let initqty=sourceAccount(2,0);    //
	for(var i=arr.length-1;i>-1;i--){				 
	    var oTr=ajTable.insertRow(0);
		cnt++;         
		
		for(let jk in arr[i]){		   
		    var meta = parseFieldMeta(jk);
		    var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
            if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
				oTd.style.width = meta.width;
				if(i==0 && !meta.isHidden){   //第一輪就塞進去											  
					array3.push(meta.name);  //欄名
				    array4.push(meta.width); //欄寬
				}
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
			}		
			
	    }	
		if( arr[i]['預期結餘_ISR_010']<0){  //預期結餘超過今天紅字
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");				 
		}	 
		if(arr[i]['序號_IHC_000']==left(sourceAccount(3,0),2)+sourceAccount('0',0)){
			
		   //oTr.setAttribute("style","font-weight:bold;color:#704214;");
			 oTr.style.backgroundColor='#B9B9FF';
		} 
	}	
	
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}else{
	    var oTr=ajTable.insertRow(0);		
	    for (let j = 0; j < array3.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[j]); //cell	
			th.style.width=array4[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}		
	
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋出貨月報表對照欄位選擇";
}
function page1OtherWindow1(){
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{1F4E4}:\u{300E}"+sourceAccount(3,0)+"\u{300F}開單未過帳明細";
}
function page1OtherWindow2(){
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{26A1}:\u{300E}"+sourceAccount(2,0)+"\u{300F}\u{A0}\u{A0}之庫存明細\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{1F4C4}庫存總計:"+sourceAccount(8,0);
}

function page1OtherWindow3(){		 
   return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{A0}\u{A0}預期庫存異動明細\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{1F4C4}目前庫存:"+sourceAccount(8,0);
}