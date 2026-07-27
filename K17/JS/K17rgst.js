function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');		
    for(var i=0;i<tabs.length;i++){
		tabs[i].setAttribute("accesskey",(i+1).toString());
	}	
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
    }else if(txtword==101){
		dropsheet_content.style.width="80%";   //原訊息內框畫面寬度調整
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
	
	 let invoicetype=document.getElementById('departNoOption');
/* 	 if(left(invoicetype.value,1)=='3'){
	    var url="K17/BKND/C13srch.php";   	      //用let會顯示不出來         		
	 }else{
	    var url="K17/BKND/D19srch.php";   	
	 } */
	 var url="K17/BKND/K17srch.php";   
	 let queryString ="filename="+sourceAccount(13,0);   
  
	 fetch(url, {
     method: 'POST',
	 cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString
    })
     .then(res => res.json())
     .then(rsp => searchHaveshiped(rsp,ajTable));  
}

function searchHaveshiped(arr,ajTable) {       //搜尋相關料號
    let rnddgt=getAuth[2]()[0].INT_069;
    let cnt=0;	   
	let array3=[];	
	let array4=[];
	let initqty=sourceAccount(2,0);    //
	for(let i=arr.length-1;i>-1;i--){				 
	    let oTr=ajTable.insertRow(ajTable,ajTable.length);
		cnt++;         		
		for(let jk in arr[i]){		   
		    let meta = parseFieldMeta(jk);
		    var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
            if (meta) {
				oTd.className = meta.isDirect ? "directdata" : "indirectdata";				
				oTd.style.width = meta.width;
				if(i==0 && !meta.isHidden){   //第一輪就塞進去	 //										  
					array3.push(meta.name);  //欄名
				    array4.push(meta.width); //欄寬
				}
				oTd.style.textAlign = meta.align;
				if (meta.isHidden) oTd.style.display = "none";
			}		
			if(jk.includes("小計")){
									
				oTd.innerHTML=Math.round((oTr.cells[2].innerHTML*oTr.cells[3].innerHTML *oTr.cells[5].innerHTML+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);				
			}
			if(oTd.innerHTML=="稅額"){
			   oTd.parentNode.style.color="#5B5B5B";
			} 
	    }	
	}	
	  
    if(cnt==0){
	    blkshow("無資料!");
	    return false;
	}else{	   
	    let oTr=ajTable.insertRow(ajTable,ajTable.length);
	    for (let j = 0; j < array3.length; j++) {
		    let th = document.createElement('th'); //column		   
		    let text = document.createTextNode(array3[j]); //cell	
			th.style.width=array4[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }
	}		
	
}


function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋發票管理對照欄位選擇";
}

function page1OtherWindow1(){
	var x = document.getElementById("departNoOption");
	var i = x.selectedIndex;		
	//var iniyqty=sourceAccount(2,0)*1 ; 
	 
    return "\u{1F4C5}:\u{300E}"+document.getElementById('recmth').value+"\u{300F}\u{1F6AA}:\u{300E}"+ x.options[i].text+"\u{300F}\u{1F4E6}:\u{300E}"
+sourceAccount(2,0)+"\u{300F}之發票明細"+"\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}";   
}