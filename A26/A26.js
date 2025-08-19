function getProfile(str1,reccount,tbno) {    
  
    var Today=new Date();
    var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
    var cnt=0;
	var arr = str1; 
    var ath1=Cookies.get('auth01');  //cookie新增
			        var ath2=Cookies.get('auth02');  //cookie修改
					var ath3=Cookies.get('auth03');  //cookie刪除
					var notOnlyEdit=(ath1=='Y' && ath2=='Y' && ath3=='Y');
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
	    	    if(jk=='rc_no'){			 
	    	     	oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");	
					oTd.setAttribute("class","directdata");
				}else if(jk=='int_no'){
					oTd.setAttribute("style","width:7%;");
					oTd.setAttribute("class","directdata");
				      attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			    }else if(jk=='lastupdate'){
					 oTd.setAttribute("style","width:12%;");
					 oTd.setAttribute("class","directdata");
				      attachEventListener(oTd,'click',rowchoose,false);		//點選資料		  
				}else if(jk=='int_type' || jk=='int_length'){	
				   
				      oTd.setAttribute("style","width:5%;text-align:center;");					  
				      attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				        
				      oTd.setAttribute("class","directdata");
				}else if(jk=='int_check'){  
				  		 if(!notOnlyEdit){	  						  
							oTd.setAttribute("style","display:none;");
						 }							 
				      
				  
				      oTd.setAttribute("class","directdata");
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				}else if(jk=='int_content'){	
				   
				        oTd.setAttribute("style","text-align:center;");
						attachEventListener(oTd,'click',rowchoose,false);		//點選資料					 						
					    oTd.setAttribute("class","directdata");
				}else{
				    
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
					oTd.setAttribute("class","directdata");
				}					
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
	  }	  
}


function choseExtraDeal(targetTrChildren){   //紀錄移動
    
    return true;			   
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	
 


