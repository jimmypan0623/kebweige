function getProfile(str1,reccount) {       
    var cnt=0;
	 var rnddgt=getCookie('INT_069');  //四捨五入到幾位
	var arr = str1; 
	var queryttl=0;
	//var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
    var tabs=getElementsByAttribute("class","tab");
        var pagecount=Math.ceil(reccount/parseInt(getCookie('INT_RCD')));
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
	    	for(var jk in arr[i]){		   
	    	    var oTd = oTr.insertCell(oTr.cells.length);		 
				if (!isNaN(parseInt(arr[i][jk]*1))){
			       oTd.innerHTML=parseInt(arr[i][jk]*1)!=0?Math.round(arr[i][jk]):"";
		        } else{
			       oTd.innerHTML=arr[i][jk];
		        }		  
	    		  	  			 
	    	    if(jk=='rc_no' || jk=='lastupdate'){			
                    oTd.setAttribute("class","directdata"); 				
	    	     	oTd.setAttribute("style","display:none;");												               
				
				}else if(jk=='stock_no'){		 
				         oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","text-align:left;width:12%;");		 
           
	    	    }else{						 
                      oTd.setAttribute("class","directdata");
					  oTd.setAttribute("style","text-align:right;width:7%;"); 
				}
				 attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				 
		   }
          
	       var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";		  
		   myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭			
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);     
		   //scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));
		  
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

  
