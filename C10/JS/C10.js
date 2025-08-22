function getProfile(str1,reccount) {      
    var cnt=0;
	var rnddgt=Cookies.get('INT_069');  //四捨五入到幾位
	var arr = str1; 
	var queryttl=0;
	var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
    var tabs=getElementsByAttribute("class","tab");
	var pagecount=Math.ceil(reccount/parseInt(Cookies.get('INT_RCD')));
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
			oTd.innerHTML=arr[i][jk];		 	  			 
			if(jk=='rc_no' || jk=='lastupdate' || jk=='sales_no'){			
				oTd.setAttribute("class","directdata"); 				
				oTd.setAttribute("style","display:none;");												               
			
			}else if(jk=='custom_no'){		 
					 oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","text-align:left;width:7%;");		 
			 }else if(jk=='custom_name' || jk=='sales_name'){		 
					 oTd.setAttribute("class","indirectdata");	
					 oTd.setAttribute("style","text-align:left;width:7%;");
			  }else if(jk=='bill_no'){		 
					 oTd.setAttribute("class","indirectdata");	
					 oTd.setAttribute("style","text-align:left;width:10%;");
			}else if(jk=='crncy_type' || jk=='ship_date' ){
				  oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","text-align:center;width:4%;"); 
			}else if(jk=='unit_price' || jk=='crncy_rate' || jk=='ship_qty'){
				  oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","text-align:right;width:7%;"); 	
			}else if(jk=='rcd_total'){
				  oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","text-align:right;width:8%;");
					  queryttl+=Number(oTd.innerHTML);					   
			}else{						 
				  oTd.setAttribute("class","directdata");
				  oTd.setAttribute("style","text-align:left;"); 
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
	   scndttl.innerHTML=thousands(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));		  
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
    
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	 

  
