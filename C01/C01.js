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
	  var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件	
	    for(var i=0;i<arr.length;i++){		
	    	var oTr=oTable.insertRow(-1);	
            oTr.setAttribute("name","mainrow");	      		
            cnt++;		
	    	for(var jk in arr[i]){		   
	    	    var oTd = oTr.insertCell(oTr.cells.length);		     		  
	    		oTd.textContent=arr[i][jk];	
			    if (tbno==0){
	    	       if(jk=='rc_no'){			 
	    	     	   oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");		  	  
	    	           oTd.setAttribute("class","directdata"); 
				   }
	    	         else if(jk=='custom_no'){							       
		                    oTd.setAttribute("style","text-align:left;width:22%;");	
							oTd.setAttribute("class","directdata"); 
                            attachEventListener(oTd,'click',rowchoose,false);		//點選資料		  
		           }else if(jk=='custom_name'){			 				
		                 oTd.setAttribute("style","text-align:left;width:78%;");   
						 oTd.setAttribute("class","directdata"); 
		    		      attachEventListener(oTd,'click',rowchoose,false);		//點選資料    
				   
				   }else{				
				        if(jk=='assistantname' || jk=='salesname' || jk=='crntname'){
						    oTd.setAttribute("class","indirectdata"); 
						}else{	
				           oTd.setAttribute("class","directdata"); 
						}  
					    oTd.setAttribute("style","display:none;");                         
				   }             
                         
					 	   
				}else{
					 if(jk=='rc_no' || jk=='lastupdate'){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 
					}else if(jk=='stockno'){
						 oTd.setAttribute("class","directdata");	
                           oTd.setAttribute("style","text-align:left;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  
					}else if(jk=='stockname'){
						 oTd.setAttribute("class","indirectdata");	
                           oTd.setAttribute("style","text-align:left;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
					}else if(jk=='custom_partno'){
						 oTd.setAttribute("class","directdata");	
                           oTd.setAttribute("style","text-align:left;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料 	  
    				}else if(jk=='crncy_type'){
					   oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:4%;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
					}else if(jk=='query_price'){
						 oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料						 					  		        
				    }else if(jk=='basic_pack' || jk=='min_order'){
				         oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:7%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
					}else if(jk=='query_no'){
						 oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:10%;text-align:left;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
				    }else if(jk=='dateline' || jk=='datestart'){
				         oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:8%;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料					      
				    }else if(jk=='remark'){
				         oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:10%;text-align:left;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料			
				    }else {
			            oTd.setAttribute("style","text-align:left;");
					   oTd.setAttribute("class","directdata"); 
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
	   if (tbno==0){       //如果是表頭   
	      var valueshows=document.getElementsByName("c01value");
	      for(var p=0;p<valueshows.length;p++){
		      valueshows[p].textContent="";
	      }
	      
		 var responseDiv=document.getElementById("serverResponse1");  		
	  	  		  	   
	  }else{
		   var responseDiv=document.getElementById("serverResponse2");  
		   scndttl.textContent=cnt;
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

function choseExtraDeal(targetTrChildren,targetTr){
    var c01a_value_names=document.getElementsByName("c01value");
		      for(var i=0;i<c01a_value_names.length;i++){
			      c01a_value_names[i].innerHTML=targetTrChildren[i+1].innerHTML;
		      }
			  if(!c01a_value_names[9]){
				  choseExtraDeal(targetTrChildren,targetTr);
			  }
			    var tmp1=c01a_value_names[9].innerHTML;   //加此變數多存一次以防太快
			    document.getElementById("partno_invoice").innerHTML=(tmp1=='1'?'我方':'客方');
		        document.getElementById("typeofincoice").innerHTML=(c01a_value_names[10].innerHTML=='31'?'三聯式':'二聯式');				
				document.getElementById("typeoftax").innerHTML=(c01a_value_names[11].innerHTML=='1'?'應稅':(c01a_value_names[11].innerHTML=='2'?'零稅':'免稅'));
                var tpy=paycondition(document.getElementById("typeofpay").innerHTML);		 
			   document.getElementById("typeofpay").innerHTML=tpy;		
			   var telno=document.getElementById("tel_no").innerHTML;
			   document.getElementById("tel_no").innerHTML="<a href='tel:+" + telno + "'>" + telno + "</a>";
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){   //表身
	 
   return true;	
}
function rowchoseExtraDeal(targetRow){
   var c01a_value_names=document.getElementsByName("c01value");
		   for(var i=0;i<c01a_value_names.length;i++){
			   c01a_value_names[i].innerHTML=targetRow.childNodes[i+1].innerHTML;
		   }
		   document.getElementById("partno_invoice").innerHTML=(c01a_value_names[9].innerHTML=='1'?'我方':'客方');
		   document.getElementById("typeofincoice").innerHTML=(c01a_value_names[10].innerHTML=='31'?'三聯式':'二聯式');
           document.getElementById("typeoftax").innerHTML=(c01a_value_names[11].innerHTML=='1'?'應稅':(c01a_value_names[11].innerHTML=='2'?'零稅':'免稅'));
           var tpy=document.getElementById("typeofpay").innerHTML;
		  
		   document.getElementById("typeofpay").innerHTML=paycondition(tpy);
		    var telno=document.getElementById("tel_no").innerHTML;
			   document.getElementById("tel_no").innerHTML="<a href='tel:+" + telno + "'>" + telno + "</a>";
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動表身
   return true;	
}
    


function paycondition(tpy){
      switch (tpy){	
			        
                     case '0' :{
						  tpy="現結";
						  break;
					 }
					  case '1' :{
						  tpy="月結";
						  break;
					 }
					  case '2' :{
						   tpy="次月結";
						  break;
					 }
					  case '3' :{
						   tpy="T/T";
						  break;
					 }
                 default: {
					 tpy='';
                    break;
                    }					
			  }	 
		return tpy;	  
}			  
