function getProfile(str1,reccount,tbno) {    
    var cnt=0;
	var arr = str1; 
     var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD));  
    var optdigts= (pagecount.toString()).length;
	if (tbno==0){     //如果是表頭       
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
		//var fld=document.getElementById('recfield'); 
	}else if(tbno==1){
	    var oTable = document.getElementById("maintbody2");
		//var fld=document.getElementById('recfield2');
	}else{
	     var oTable = document.getElementById("maintbody3");
		//var fld=document.getElementById('recfield3');
	}		
	for(var i=0;i<arr.length;i++){		
	    var oTr=oTable.insertRow(-1);	
        oTr.setAttribute("name","mainrow");	      		
        cnt++;		
		
        var sn=0;
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
			if(jk.includes('直接或間接')){
			   var oTd = oTr.insertCell(oTr.cells.length);
			   oTd.setAttribute("class","indirectdata");	
			   oTd.setAttribute("style","width:6%;text-align:center;");	
			   oTd.innerHTML=whichDIM(arr[i][jk]);
			   
			}			 
			
			if(jk.includes('顯示或隱藏')){
			   var oTd = oTr.insertCell(oTr.cells.length);
			   oTd.setAttribute("class","indirectdata");	
			   oTd.setAttribute("style","width:6%;text-align:center;");	
			   oTd.innerHTML=showOrNot(arr[i][jk]);			   
			}			
			if(jk.includes('文字靠向')){
			   var oTd = oTr.insertCell(oTr.cells.length);
			   oTd.setAttribute("class","indirectdata");	
			   oTd.setAttribute("style","width:6%;text-align:center;");	
			   oTd.innerHTML=locateLCR(arr[i][jk]);
			  
			}			
			// 點擊事件綁定
			attachEventListener(oTd, 'click', rowchoose, false);
			sn++;
		}
        var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	    oTd.setAttribute("style","display:none");   //勾選不顯示
	 	var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";  		  
		myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());   //讓使用者勾選的checkbox表頭				 	
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);           
	}	  
	var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());  	
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
	}	  
}

function choseExtraDeal(targetTrChildren,targetTr){   //初始或搜尋換首頁紀錄移動額外處理事項
    var authbase=document.getElementsByName('authBase');
	if(authbase.length>0){
	   for(var j=0;j<authbase.length;j++){
	      authbase[j].innerHTML=targetTrChildren[j+3].textContent;
	   }
	}
    var authextra=document.getElementsByName('authExtra');
	if(authextra.length>0){
	   for(var i=0;i<authextra.length;i++){
	      authextra[i].innerHTML=targetTrChildren[i+7].textContent;
	   }
	}
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){	 
   return true;	
}

function rowchoseExtraDeal(targetRow){    //首頁紀錄點選移動額外處理事項     
    var authbase=document.getElementsByName('authBase');
	if(authbase.length>0){
	   for(var j=0;j<authbase.length;j++){
	      authbase[j].innerHTML=targetRow.cells[j+3].textContent;
	   }
	}
    var authextra=document.getElementsByName('authExtra');
	if(authextra.length>0){
	   for(var i=0;i<authextra.length;i++){
	      authextra[i].innerHTML=targetRow.cells[i+7].textContent;
	   }
	}
    return true;			   
}	

function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}



function whichDIM(tpe){
	 var tpemsg="";
     switch(tpe){
      case 'D': {    
          tpemsg = '直接';    
          break;  
      }
      case 'I': {    
          tpemsg = '關聯';   
          break;
      }
	   case 'M': {    
          tpemsg = 'DOM';   
          break;
      }	  
       default: {
         break;
       }
    }
    return tpemsg;
}
function showOrNot(tpe){
    var tpemsg="";
     switch(tpe){
      case 'S': {    
          tpemsg = '是';    
          break;  
      }
      case 'H': {    
          tpemsg = '否';   
          break;
      }
	 
      default: {
         break;
       }
    }
    return tpemsg;
}
function locateLCR(tpe){
   var tpemsg="";
     switch(tpe){
      case 'L': {    
          tpemsg = '靠左';    
          break;  
      }
      case 'C': {    
          tpemsg = '置中';   
          break;
      }
	   case 'R': {    
          tpemsg = '靠右';   
          break;
      }
      default: {
         break;
       }
    }
    return tpemsg;
}