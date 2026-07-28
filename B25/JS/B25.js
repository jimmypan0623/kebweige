function getProfile(arr,trncde) {         

	var cnt = 0;
	var apprv=document.getElementById('APPRVE');	 
    var tabs=getElementsByAttribute("class","tab");
 
	var bibau=cko[0](0);   //找出閉包變數
	cko[0](bibau*(-1));    //將閉包變數歸零
	cko[0](trncde=='Y'?1:0);      //將此變數當作是否結轉的旗號		
	var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
	var thmth=showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7);	
	var crntpge=document.getElementById('recmth').value ;
	
	var ansbtt=document.getElementById('ANS_BOTT');	
	var vrsbtt=document.getElementById('VRS_BOTT');	
	if(crntpge==thmth){    //如果當月兩個鈕都無效
		 ansbtt.setAttribute("style","display:none;");
		 detachEventListener(ansbtt,"click",ansproc,false);	
		 vrsbtt.setAttribute("style","display:none;");
		 detachEventListener(vrsbtt,"click",vrsproc,false);	
		 
		 apprv.innerHTML='\u{A0}';  
	}else{
		 if(cko[0](0)==1){	   //如果庫存帳已結轉則 
			ansbtt.setAttribute("style","display:none;");
			detachEventListener(ansbtt,"click",ansproc,false);	
			if (getAuth[0]()[9]=='Y'){   //(getCookie('auth09')=='Y'){
				vrsbtt.setAttribute("style","display:block;");
				attachEventListener(vrsbtt,"click",vrsproc,false);  //反確認按鈕程序  
			}		
			
			apprv.innerHTML="<img src='digits/marker.png' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"

		 }else{
			if (getAuth[0]()[8]=='Y'){   //getCookie('auth08')=='Y'
				ansbtt.setAttribute("style","display:block;");
				attachEventListener(ansbtt,"click",ansproc,false);  //確認按鈕程序  
			}		
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);		
			apprv.innerHTML='\u{A0}';  
		 }
	}

       var oTable = document.getElementById("maintbody1");
	
	  for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		oTr.setAttribute("name","mainrow");	      		
		cnt++;		
		for (var jk in arr[i]) {
			var meta = parseFieldMeta(jk);
			var oTd = oTr.insertCell(-1);			
            if (!isNaN(parseInt(arr[i][jk]*1))){
			   oTd.innerHTML=parseInt(arr[i][jk]*1)!=0?Math.round(arr[i][jk]):"";
			} else{
			   oTd.innerHTML=arr[i][jk];
			}		   
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
		  
	}
    
	  var responseDiv=document.getElementById("serverResponse1");  		
	  if(responseDiv.innerHTML=='Searching......'){	
		 if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此資料！Not found!検索できません。";
	      }else{ 			     
		      
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		          
		  }	
	  } 
	  if(cnt>0 ){       //初始畫面呼叫
		  chooserc(1);
	  }	 
	   
}

function choseExtraDeal(targetTrChildren){   //紀錄移動
    var rdyship=document.getElementById("HISTORY_BOTT");
    var jdgnm=0;
	for (var i=3;i<13;i++){
	    jdgnm+=targetTrChildren[i].innerHTML*1
	}
    if(jdgnm==0){
        rdyship.setAttribute("style","visibility:hidden;");				   
		detachEventListener(rdyship,"click",page1OtherButton1,false);
	   	   	   
    }else{
	   rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	} 	
	 
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    var rdyship=document.getElementById("HISTORY_BOTT");
	 var jdgnm=0;
	 for (var i=3;i<13;i++){
	    jdgnm+=targetRow.childNodes[i].innerHTML*1
	}
    if(jdgnm==0){
       rdyship.setAttribute("style","visibility:hidden;");				   
		detachEventListener(rdyship,"click",page1OtherButton1,false);
    }else{
		rdyship.setAttribute("style","visibility:visible;font-size:17px;");				   				   
		 attachEventListener(rdyship,"click",page1OtherButton1,false);
	}		
	 
    return true;			   
}	 