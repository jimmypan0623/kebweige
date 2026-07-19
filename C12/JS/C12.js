function getProfile(str1,reccount) {      
    var cnt=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
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
	   		  
	}	
	  var responseDiv=document.getElementById("serverResponse1");  		

	  if(cnt>0){       //初始畫面呼叫
	       if(responseDiv.innerHTML=='Searching......'){
			    responseDiv.setAttribute("style","color:#536a60;"); 
                responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            	
		   }else{
			    var seekrcd=document.getElementById("SEEK_BOTT");
		        seekrcd.setAttribute("style","visibility:visible;");
		        attachEventListener(seekrcd,"click",seekrec,false);
		   }
		  chooserc(1);		
		 
	  }else{
		    if(responseDiv.innerHTML=='Searching......'){	
			    responseDiv.setAttribute("style","color:red;"); 
	   	        responseDiv.innerHTML="無此資料！Not found!検索できません。";
		    }else{
				responseDiv.innerHTML="本月無應收帳款。";
				var seekrcd=document.getElementById("SEEK_BOTT");
		         seekrcd.setAttribute("style","visibility:hidden;");
		         detachEventListener(seekrcd,"click",seekrec,false);
		    }
		    var oTable = document.getElementById("contentTbody");	
	        if (oTable.rows.length>0){
		       var i=0;
	            while (i<oTable.rows.length){
		    
		          oTable.deleteRow(i);		    	    
		          i--;		    
		           i++; 	     
	            }	 		    
	        } 
	        document.getElementById('ttlmny').innerHTML="";   //次頁表頭的總金額物件
			document.getElementById("ttltitle").innerHTML="";			
	  }		  	  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動    	
	var sendSrcRec="keyfield="+targetTrChildren[0].innerHTML+"|"+document.getElementById('recmth').value;		
	contenBkndAjax(sendSrcRec);     	
	 
}
function rowchoseExtraDeal(targetRow){    //紀錄移動     	
	 var sendSrcRec="keyfield="+targetRow.firstChild.innerHTML+"|"+document.getElementById('recmth').value;		
	 contenBkndAjax(sendSrcRec);
     
}	 
/* 
function contenBkndAjax(sendSrcRec){
	var rsp="";  	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	       
	var url="C12/BKND/C12Contentbrow.php?timestamp="+new Date().getTime();			
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {    
		   rsp=JSON.parse(request.responseText);					 
		   contentShow(rsp.recdrow);
		}
	}	 	 
    return;			   	
} */
async function contenBkndAjax(sendSrcRec) {
    //const url = `C12/BKND/C12Contentbrow.php?timestamp=${Date.now()}`;
     const url = "C12/BKND/C12Contentbrow.php";
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
}
function contentShow(arr){
	var oTable = document.getElementById("contentTbody");	
	if (oTable.rows.length>0){
		    var i=0;
	        while (i<oTable.rows.length){
		    
		       oTable.deleteRow(i);		    	    
		       i--;		    
		     i++; 	     
	        }	 		    
	} 
	var cnt1=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var queryttl=0;
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
		//oTr.setAttribute("name","mainrow");	      		
		cnt1++;		
		
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
			if(oTd.innerHTML=="稅額"){
			   oTd.parentNode.style.color="#5B5B5B";
			}
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='rcd_total'){
			   queryttl+=Number(oTd.innerHTML);
			} 
			 
		}
   }
    if(cnt1>0){       //初始畫面呼叫
		  document.getElementById("ttltitle").innerHTML="<mark style='background-color:#BAF4D8;'>"+sourceAccount('0',0)+"&nbsp"+sourceAccount(2,0)+"</mark>\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}本月應收總額:";
		  scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));
	}else{		
	   if(scndttl.innerHTML=='0'){
          tab1View();
	   }		  
	}		
    return;
}