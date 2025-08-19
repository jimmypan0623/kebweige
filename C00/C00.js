 function getProfile(str1,reccount,tbno) {      
    var Today=new Date();
    var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
    var cnt=0;
	var arr = str1; 
        var pagecount=Math.ceil(reccount/parseInt(Cookies.get('INT_RCD')));
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
	    for(var jk in arr[i]){		   			
	    	var oTd = oTr.insertCell(oTr.cells.length);		     		  
	    	oTd.innerHTML=arr[i][jk];		 
		    if (tbno==0){	
	    	    if(jk=='rc_no'){			 
	    	     	oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
					   oTd.setAttribute("class","directdata"); 
	    	    }else{
					 oTd.setAttribute("style","text-align:center;");
					 oTd.setAttribute("class","directdata"); 
                     attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				}	    	 
    		}else{
				if(jk=='rc_no' ){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 
					
				}else {
			            oTd.setAttribute("style","text-align:center;");
					  if(jk=='lastupdate' ){
						    oTd.setAttribute("class","indirectdata");
					  }else{
						 
					     oTd.setAttribute("class","directdata");
					  }						 
					   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
		         }
			}	
		}			
		var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
		oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
		var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";		  		  
		myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());   //讓使用者勾選的checkbox表頭		   		  		
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);     
		  
	}
		var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());  		
	 
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

function choseExtraDeal(targetTrChildren,targetTr){   //紀錄移動
    var delbtt=document.getElementById("DEL_BOTT");
    if(Cookies.get('INT_011')==targetTrChildren[1].innerHTML || Cookies.get('auth03')!='Y'){
	    delbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(delbtt,"click",delrec,false);	    
    }else{
	   delbtt.setAttribute("style","visibility:visible;");
	   attachEventListener(delbtt,"click",delrec,false);
	}
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){   //紀錄移動表身
	 
   return true;	
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    var delbtt=document.getElementById("DEL_BOTT");
    if(Cookies.get('INT_011')==targetRow.childNodes[1].innerHTML || Cookies.get('auth03')!='Y'){
		delbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(delbtt,"click",delrec,false);	  
	}else{
	    delbtt.setAttribute("style","visibility:visible;");
		attachEventListener(delbtt,"click",delrec,false);	    
	}
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動 表身
   return true;	
}
