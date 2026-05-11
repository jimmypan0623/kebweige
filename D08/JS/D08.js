function getProfile(str1,reccount) {      
    var cnt=0;
	var arr = str1; 
    var tabs=getElementsByAttribute("class","tab");
        var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD));
        var optdigts= (pagecount.toString()).length;	    
        var slt2=document.getElementById('recmth');
	    if (slt2.options.length<pagecount){
		for (var i=slt2.options.length+1;i<=pagecount;i++){
			var item_no=paddingLeft(i,optdigts);				
			var varItem=new Option(item_no,item_no);
			slt2.options.add(varItem);	 
	   }	  
			   //第一個選項位數修正		   
	   slt2.options[0].value=paddingLeft(1,optdigts);
	   slt2.options[0].text=paddingLeft(1,optdigts);
		var bibau=cko[0](0);   //找出閉包筆數變數現值
		cko[0](bibau*(-1));    //將閉包變數歸零
		cko[0](reccount);      //將筆數記起來	
	  
	}
	var oTable = document.getElementById("maintbody1");
	var fld=document.getElementById('recfield');
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
			}											
			// 點擊事件綁定
			attachEventListener(oTd, 'click', rowchoose, false);
		}
	   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	   oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	   var myCheck=document.createElement('input'); 
	   myCheck.type="checkbox";		  
	   myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭			
	   attachEventListener(myCheck,'click',chooserc,false);		   
	   oTd.appendChild(myCheck);     		    
		if(arr[i]['readyship_qty_IHC_000']*1>0){  //有開單未過帳量
			oTr.setAttribute("style","font-weight:bold;color:#704214;");//#949100
		}else if(arr[i]['diffdate_IHC_000']>0 || arr[i]['avlqty_ISR_007']<0){  //預定交期超過今天紅字
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");
		}		  
	}
	   
	 var responseDiv=document.getElementById("serverResponse1");  		
	
	  if(cnt>0){       //初始畫面呼叫
	        if(responseDiv.innerHTML=='Searching......'){	
	            responseDiv.setAttribute("style","color:#536a60;"); 
                responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
		    }
		    chooserc(1);
	  }else{
		   if(responseDiv.innerHTML=='Searching......'){	
		      responseDiv.setAttribute("style","color:red;"); 
	   	      responseDiv.innerHTML="無此資料！Not found!検索できません。";
		   }else{
			   responseDiv.innerHTML="採購訂單均已結清....";
			   var seekrcd=document.getElementById("SEEK_BOTT");
		       seekrcd.setAttribute("style","visibility:hidden;");
		       detachEventListener(seekrcd,"click",seekrec,false);
		   }
	     var rdyship=document.getElementById("REDYSHIP_BOTT");
		 rdyship.setAttribute("style","visibility:hidden;");				   
		 detachEventListener(rdyship,"click",page1OtherButton1,false);		 
		  
	  }		  
}
/* function choseExtraDeal(targetTrChildren){   //紀錄移動
     var rdyship=document.getElementById("REDYSHIP_BOTT");
	 
	 if(targetTrChildren[6].innerHTML*1==0){
		  rdyship.setAttribute("style","visibility:hidden;");				   
		  detachEventListener(rdyship,"click",page1OtherButton1,false);
	 }else{
		 rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	 }
	 
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    var rdyship=document.getElementById("REDYSHIP_BOTT");
	 
	 if(targetRow.childNodes[6].innerHTML*1==0){
		  rdyship.setAttribute("style","visibility:hidden;");				   
		  detachEventListener(rdyship,"click",page1OtherButton1,false);
	 }else{
		 rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	 }
	
    return true;			   
}	 */



/**
 * 按鈕可用性檢查 (整合版)
 */
function checkButtonAvailability(target, isRow) {
    const rdyship = document.getElementById("REDYSHIP_BOTT");
    const cells = isRow ? target.childNodes : target;
    
    // 檢查關鍵數值欄位 (假設在第 7 欄，Index 6)
    const val = Number(cells[6]?.innerHTML) || 0;

    if (val === 0) {
        rdyship.style.visibility = "hidden";
        detachEventListener(rdyship, "click", page1OtherButton1, false);
    } else {
        rdyship.style.cssText = "visibility:visible; font-size:17px;";
        attachEventListener(rdyship, "click", page1OtherButton1, false);
    }
}

// 供外部調用
function choseExtraDeal(targetTrChildren) { checkButtonAvailability(targetTrChildren, false); return true; }
function rowchoseExtraDeal(targetRow) { checkButtonAvailability(targetRow, true); return true; }