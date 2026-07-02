function getProfile(str1,reccount) {      
    var cnt=0;
	var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var arr = str1; 
	var queryttl=0;
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
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
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='付款方式代號'){
				var oTd = oTr.insertCell(oTr.cells.length);
				oTd.setAttribute("class","indirectdata");					 
				oTd.setAttribute("style","width:10%;text-align:center;");	
				oTd.innerHTML=howtopay(arr[i][jk]);			
			}		 	
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='沖銷金額'){
			   queryttl+=Number(oTd.innerHTML);
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
	  if(cnt>0){       //初始畫面呼叫
		  chooserc(1);
		  scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));		
	  }	  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動
    
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	 

  
function howtopay(tpe){
	 var tpemsg="";
     switch(tpe){
      case '1': {    
          tpemsg = '現金';    
          break;  
      }
	  case '2': {    
          tpemsg = '支票';   
          break;
	  }	 
      case '3': {    
          tpemsg = '銀行存款';   
          break;
	  }	 
	  case '4': {    
          tpemsg = '銷貨退回';   
          break;
	  }	 
	  case '5': {    
          tpemsg = '銷貨折讓';   
          break;
	  }	 
	  case '6': {    
          tpemsg = '備抵呆帳-應收帳款';   
          break;
	  }	 
	  case '7': {    
          tpemsg = '兌換損失準備';   
          break;
	  }	 
	   case '8': {    
          tpemsg = '匯費';   
          break;
	  }	 
	   case '9': {    
          tpemsg = '郵資';   
          break;
	  }	 
	   case '10': {    
          tpemsg = '其他';   
          break;
	  }	 
       default: {
         break;
       }
    }
    return tpemsg;
}