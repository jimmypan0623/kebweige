function getProfile(str1,reccount,tbno) {    
  
    var Today=new Date();
    var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
    var cnt=0;
	var arr = str1; 
    //var tabs=getElementsByAttribute("class","tab");
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
	}else if (tbno==1){
	    var oTable = document.getElementById("maintbody2");
		var fld=document.getElementById('recfield2');
	}else {
	    var oTable = document.getElementById("maintbody3");
		var fld=document.getElementById('recfield3');	
	}		
	 var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件
	  var scndttl1=document.getElementById('ttlmny1');   //次頁表頭的總金額物件
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
	    	        }
	    	        else if(jk=='stock_no'){		    	
		                 oTd.setAttribute("style","text-align:left;46");			 
						 oTd.setAttribute("class","directdata"); 
                         attachEventListener(oTd,'click',rowchoose,false);		//點選資料		  
		           }else if(jk=='stock_name'){			 				
		                 oTd.setAttribute("style","text-align:left;width:44%;");   
					     oTd.setAttribute("class","directdata"); 
		    		    attachEventListener(oTd,'click',rowchoose,false);		//點選資料    
				  
				   }else{				
                       if(jk=='dptname' || jk=='ntqty' || jk=='dpqty'){
						    oTd.setAttribute("class","indirectdata"); 
						}else{	
				           oTd.setAttribute("class","directdata"); 
						}  				
					   oTd.setAttribute("style","text-align:left;width:10%;display:none;");                         
				}   
			 }else if(tbno==1){
				 
				 if(jk=='rc_no' || jk=='lastupdate'){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 
					}else if(jk=='customno'){
						 oTd.setAttribute("class","directdata");	
                           oTd.setAttribute("style","text-align:left;width:7%;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  
					}else if(jk=='customname'){
						 oTd.setAttribute("class","indirectdata");	
                           oTd.setAttribute("style","text-align:left;width:7%;");						 
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
					}else if(jk=='query_no' || jk=='remark'){
						 oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:10%;text-align:left;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料					 					
				    }else {
			             oTd.setAttribute("style","text-align:left;");
					   oTd.setAttribute("class","directdata"); 
					   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
		            }
			 }else{
			      if(jk=='rc_no' || jk=='lastupdate'){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 
					}else if(jk=='vendorno'){
						 oTd.setAttribute("class","directdata");	
                           oTd.setAttribute("style","text-align:left;width:7%;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  
					}else if(jk=='vendorname'){
						 oTd.setAttribute("class","indirectdata");	
                           oTd.setAttribute("style","text-align:left;width:7%;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
					  
    				}else if(jk=='crncy_type'){
					   oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:4%;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
					}else if(jk=='query_price'){
						 oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料						 					  
		        
				    }else if(jk=='basic_pack' || jk=='min_order' || jk=='lead_time'){
				         oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:7%;text-align:right;");	
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
	       oTd.setAttribute("style","display:none");   //勾選不顯示
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";		  
		   if(tbno==0){
		      myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭
			  if(arr[i]['ntqty']*1>arr[i]['maxinv']*1 && arr[i]['maxinv']*1>0){  //庫存大於上限
			     oTr.setAttribute("style","font-weight:bold;color:#E60000;");  //#704214
		      } 
		      if(arr[i]['ntqty']*1<arr[i]['minuminv']*1){  //庫存小於安全存量
			     oTr.setAttribute("style","font-weight:bold;color:#704214;");//#949100
		      } 
		   }else if(tbno==1){
			  myCheck.setAttribute("name","chkbxmember2");   //讓使用者勾選的checkbox表身
			  
		   }else{
		        myCheck.setAttribute("name","chkbxmember3");   //讓使用者勾選的checkbox表身
		   }			   
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);     
		   
	}
	   if (tbno==0){       //如果是表頭   
	      var valueshows=document.getElementsByName("b01value");
	      for(var p=0;p<valueshows.length;p++){
		      valueshows[p].textContent="";
	      }
	      
		 var responseDiv=document.getElementById("serverResponse1");  		
	  	  		  	   
	  }else if (tbno==1){
		   var responseDiv=document.getElementById("serverResponse2");  
		   scndttl.textContent=cnt;
	  }else if (tbno==2){
		   var responseDiv=document.getElementById("serverResponse3");  
		   scndttl1.textContent=cnt;
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
              var invdtl=document.getElementById("INVDTL_BOTT");
			  var delbtt=document.getElementById("DEL_BOTT");
		      var b01a_value_names=document.getElementsByName("b01value");			   
		      for(var i=0;i<b01a_value_names.length;i++){
			      b01a_value_names[i].innerHTML=targetTrChildren[i+1].innerHTML;
		      }			 
			  if(!b01a_value_names[3]){
				  choseExtraDeal(targetTrChildren,targetTr); 
			  }				  
			  var tmp1=b01a_value_names[3].innerHTML;
			   document.getElementById("kind_of_belong_to").innerHTML=belongtoshow(tmp1);
			   document.getElementById("bom_should_be").innerHTML=(document.getElementById("bom_should_be").innerHTML=='Y'?'是':'否') ;
		       document.getElementById("leadtm_prchs").innerHTML+="天" ;
			   document.getElementById("leadtm_ready").innerHTML+="天" ;
			   document.getElementById("type_of_apply").innerHTML+=(document.getElementById("type_of_apply").innerHTML=='A'?'  個別領料':'  整批領料');			     	
               if(b01a_value_names[9].innerHTML.trim()==0 && b01a_value_names[10].innerHTML.trim()==0){
				  invdtl.setAttribute("style","visibility:hidden;");				  
				   detachEventListener(invdtl,"click",page1OtherButton1,false);
				    if(Cookies.get('auth03')=='Y'){
					   delbtt.setAttribute("style","visibility:visible;font-size:17px;");
				       attachEventListener(delbtt,"click",delrec,false);
					}else{
					   delbtt.setAttribute("style","visibility:hidden;");
				       detachEventListener(delbtt,"click",delrec,false);	
					}						
			   }else{
				    invdtl.setAttribute("style","visibility:visible;font-size:17px;");				  			   
					attachEventListener(invdtl,"click",page1OtherButton1,false);
				     delbtt.setAttribute("style","visibility:hidden;");
				     detachEventListener(delbtt,"click",delrec,false);	   				     
			   }
			   
         return true;
}
function choseSecond(targetTrChildren,targetTr){
	 
   return true;	
}
function rowchoseExtraDeal(targetRow){
           var invdtl=document.getElementById("INVDTL_BOTT");
		   var delbtt=document.getElementById("DEL_BOTT");
		   var b01a_value_names=document.getElementsByName("b01value");
		   for(var i=0;i<b01a_value_names.length;i++){
			   b01a_value_names[i].innerHTML=targetRow.childNodes[i+1].innerHTML;
		   }		   
		   document.getElementById("kind_of_belong_to").innerHTML=belongtoshow(b01a_value_names[3].innerHTML);
		   document.getElementById("bom_should_be").innerHTML=(document.getElementById("bom_should_be").innerHTML=='Y'?'是':'否') ;
		   document.getElementById("leadtm_prchs").innerHTML+="天" ;
	       document.getElementById("leadtm_ready").innerHTML+="天" ;
           document.getElementById("type_of_apply").innerHTML+=(document.getElementById("type_of_apply").innerHTML=='A'?'  個別領料':'  整批領料');	      
		    if(b01a_value_names[9].innerHTML.trim()==0 && b01a_value_names[10].innerHTML.trim()==0){
				invdtl.setAttribute("style","visibility:hidden;");
				//detachEventListener(invdtl,"click",srchB11show,false);
				detachEventListener(invdtl,"click",page1OtherButton1,false);
				if(Cookies.get('auth03')=='Y'){
				    delbtt.setAttribute("style","visibility:visible;font-size:17px;");
				    attachEventListener(delbtt,"click",delrec,false);
				 }else{
				    delbtt.setAttribute("style","visibility:hidden;");
				    detachEventListener(delbtt,"click",delrec,false);	
				 }
		    }else{
				invdtl.setAttribute("style","visibility:visible;font-size:17px;");				
				//attachEventListener(invdtl,"click",srchB11show,false);
				attachEventListener(invdtl,"click",page1OtherButton1,false);
				delbtt.setAttribute("style","visibility:hidden;");
				detachEventListener(delbtt,"click",delrec,false);	
		    }	   
			
	return true;

}
function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}
function belongtoshow(blg){
	var msgshow='';
	switch (blg) {
          case 'YNN': {    
                msgshow = '外購原料';    
                break;  
          }
          case 'YNY': {  
                msgshow = '買賣商品';    
                break;
          }
	      case 'NYY': {  
                msgshow = '自產銷售';    
                break;
          }
	      case 'NYN': {  
                msgshow = '在製組件';    
                break;
          }
	      case 'NNN': {  
                msgshow = '虛擬料號';    
                break;
          }
	      case 'YYY': {  
                msgshow = '無須定義';    
                break;
          }
          default: {
               break;
          }
     } 
  return msgshow;
}
