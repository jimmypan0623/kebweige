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
		var fld=document.getElementById('recfield');
	}else{
	    var oTable = document.getElementById("maintbody2");
		var fld=document.getElementById('recfield2');
	}		
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
			if(jk.substr(0,jk.lastIndexOf('_')-4)=='table_type'){
			   var oTd = oTr.insertCell(oTr.cells.length);
			   oTd.setAttribute("class","indirectdata");	
			   oTd.setAttribute("style","width:20%;text-align:center;");	
			   oTd.innerHTML=whichtable(arr[i][jk]);			
			}			
			// 點擊事件綁定
			attachEventListener(oTd, 'click', rowchoose, false);    //點選資料
		}
		var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
		oTd.setAttribute("style","display:none");   
		var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";		 
		myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());   //讓使用者勾選的checkbox表頭			   
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);  		   		  
	}
	if (tbno==0){       //如果是表頭   
	    var valueshows=document.getElementsByName("c01value");
	    for(var p=0;p<valueshows.length;p++){
		    valueshows[p].textContent="";
	    }	      
		var responseDiv=document.getElementById("serverResponse1");  			  	  		  	   
	}else{
		var responseDiv=document.getElementById("serverResponse2");  		   
	}
	if(responseDiv.textContent=='Searching......'){	
		if (cnt==0){
			responseDiv.setAttribute("style","color:red;"); 
	   	    responseDiv.textContent="無此資料！Not found!検索できません。";
	    }else{ 		 
		    responseDiv.setAttribute("style","color:#536a60;"); 
            responseDiv.textContent="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
        }	
	}
	if(cnt>0){       //初始畫面呼叫
		chooserc(1);
	}	  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動    
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){
	 
   return true;	
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}
function whichtable(tpe){
	 var tpemsg="";
     switch(tpe){
      case '0': {    
          tpemsg = '基本檔';    
          break;  
      }
      case '1': {    
          tpemsg = '月份檔';   
          break;
      }
	   case '2': {    
          tpemsg = '年度檔';   
          break;
      }
	  case '3': {    
          tpemsg = '奇月檔';   
          break;
      }
	   case '9': {    
          tpemsg = '暫存檔';   
          break;
      }
	   case 'z': {    
          tpemsg = '系統檔';   
          break;
      }
       default: {
         break;
       }
    }
    return tpemsg;
}
