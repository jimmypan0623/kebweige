function getProfile(str1,reccount,tbno) {    
  
   /*  var Today=new Date();
    var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ; */
    var cnt=0;
	var queryttl=0;
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
	    var rnddgt=Cookies.get('INT_069');  //四捨五入到幾位
        var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件	
	    for(var i=0;i<arr.length;i++){		
	    	var oTr=oTable.insertRow(-1);	
            oTr.setAttribute("name","mainrow");	      		
            cnt++;		
	    	for(var jk in arr[i]){		   
	    	    var oTd = oTr.insertCell(oTr.cells.length);		     		  
	    		oTd.innerHTML=arr[i][jk];	
                if (tbno==0){				
	    	       if(jk=='rc_no'  || jk=='sales_no' || jk=='lastupdate'){			 //表頭資料匯入
				       oTd.setAttribute("class","directdata");
	    	     	   oTd.setAttribute("style","display:none;");		  	  
	    	       }else if(jk=='query_no' || jk=='query_date'){	
                      oTd.setAttribute("class","directdata");				   
				      oTd.setAttribute("style","width:10%;");		
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				   }else if(jk=='custom_no'){	
				      oTd.setAttribute("class","directdata");
				      oTd.setAttribute("style","width:7%;");							 
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				   }else if(jk=='custom_name'){	
				      oTd.setAttribute("class","indirectdata");
				      oTd.setAttribute("style","width:7%;");							 
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */  
				  }else if(jk=='custom_fullname'){	
				      oTd.setAttribute("class","indirectdata");
				       oTd.setAttribute("style","display:none;");						 					   
				   }else if(jk=='crncy_type'){	
				        oTd.setAttribute("class","directdata");
				        oTd.setAttribute("style","width:4%;");			
                        attachEventListener(oTd,'click',rowchoose,false);							
				    }else if(jk=='sales_name'){					    
                          oTd.setAttribute("style","width:7%;");		
						   oTd.setAttribute("class","indirectdata");			
                          attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */ 
					 }else if(jk=='customer_po'){					    
                          oTd.setAttribute("style","width:12%;text-align:left;");		
						   oTd.setAttribute("class","directdata");			
                          attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				  	 }else if(jk=='shipdirect'){					    
                          oTd.setAttribute("style","width:15%;text-align:left;");		
						   oTd.setAttribute("class","directdata");			
                          attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */		  
				   }else if(jk=='shure' || jk=='trns'){		  //確認與訂單類別
				       oTd.setAttribute("class","indirectdata");
	    	     	   oTd.setAttribute("style","display:none;");	
				  }else{					  	
                          oTd.setAttribute("style","text-align:left;");				  
                         oTd.setAttribute("class","directdata");						 
						attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				   }
				   
                }else{      //表身資料c04匯入 
				    
			        if(jk=='rc_no' || jk=='lastupdate'){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 	
					}else if(jk=='stockname'){
						 oTd.setAttribute("class","indirectdata");	
                           oTd.setAttribute("style","text-align:left;");						 
						  attachEventListener(oTd,'click',rowchoose,false);		//點選資料							  
    				}else if(jk=='query_qty'){
					   oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
					}else if(jk=='query_price'){
						 oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料						 
					    var oTd = oTr.insertCell(oTr.cells.length);
						oTd.setAttribute("style","width:8%;text-align:right;");		
                        oTd.setAttribute("class","indirectdata");								
						oTd.innerHTML=Math.round((oTr.cells[3].innerHTML*oTr.cells[4].innerHTML + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
						queryttl+=Number(oTd.innerHTML);
					    attachEventListener(oTd,'click',rowchoose,false);		//點選資料
					}else if(jk=='hopedate'){
					   oTd.setAttribute("class","directdata");	
						 oTd.setAttribute("style","width:10%;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
		           }else if(jk=='already'){
				         oTd.setAttribute("class","indirectdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料
				   }else if(jk=='beencancel'){
				        oTd.setAttribute("class","indirectdata");	
						 oTd.setAttribute("style","width:8%;text-align:right;");	
                        attachEventListener(oTd,'click',rowchoose,false);		//點選資料
						var oTd = oTr.insertCell(oTr.cells.length);             //未出累計
						oTd.setAttribute("style","width:8%;text-align:right;");		
                        oTd.setAttribute("class","indirectdata");								
						oTd.innerHTML=Number(oTr.cells[3].innerHTML)-(Number(oTr.cells[8].innerHTML)+Number(oTr.cells[9].innerHTML));					 
					    attachEventListener(oTd,'click',rowchoose,false);		//點選資料
                  }else if(jk=='notout'){	                                   //開單未出量
				         oTd.setAttribute("class","indirectdata");	
						 oTd.setAttribute("style","display:none;");
				  }else {
			            oTd.setAttribute("style","text-align:left;");
					   oTd.setAttribute("class","directdata"); 
					   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
		            }			
					
	           }				
		   }		   
		   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:40px;display:none");   
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		   if(tbno==0){
			  myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox單頭
			  if(arr[i]['shure']!='Y'){  //未確認
			     oTr.setAttribute("style","font-weight:bold;color:#704214;"); 
		      } 
		   }else{
			  myCheck.setAttribute("name","chkbxmember2");   //讓使用者勾選的checkbox表身
			  scndttl.innerHTML= (Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));
              
		   }
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);  		   		  
	}
	 if (tbno==0){       //如果是單頭

		 var responseDiv=document.getElementById("serverResponse1");  
	  }else{

		  var responseDiv=document.getElementById("serverResponse2");  
	  } 		
	  
	   if(responseDiv.innerHTML=='Searching......'){    
		  if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此資料！Not found!検索できません。";
			 scndttl.innerHTML="0";
	      }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		              
		  }	
		  document.getElementById('ttltitle').innerHTML="本頁金額:";
	  }else{
		   if (tbno==1){       //如果是表身
		      document.getElementById('ttltitle').innerHTML="本單總額:";
		   }
	  } 
	  if(cnt>0){       //初始畫面呼叫
		  chooserc(1); //跳到第一列		  
	  }else{
		  scndttl.innerHTML="0";
	  }		  
}

function choseExtraDeal(targetTrChildren,targetTr){   //紀錄移動  
    var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var trnsbtt=document.getElementById("TRN_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");
	var apprv=document.getElementById('APPRVE');

	var shrno=targetTr.cells[targetTr.cells.length-3].innerHTML;
	var trnno=targetTr.cells[targetTr.cells.length-4].innerHTML;
	if(shrno=='Y'){				
	    ansbtt.setAttribute("style","display:none;");
	    detachEventListener(ansbtt,"click",ansproc,false);
	    delbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(delbtt,"click",delrec,false);
	    apprv.setAttribute("style","color:red;font-size:20px;font-weight:bold;");
	    apprv.innerHTML='\u{329E}\u{A0}\u{A0}\u{A0}\u{A0}';
	    if(trnno=='Y'){    //如果已轉出貨單反確認與轉單鈕不作用
		    vrsbtt.setAttribute("style","display:none;");
		    detachEventListener(vrsbtt,"click",vrsproc,false);
		    trnsbtt.setAttribute("style","display:none;");
		    detachEventListener(trnsbtt,"click",trnsproc,false);

	    }else{
		    if(Cookies.get('auth07')=='Y'){
			   trnsbtt.setAttribute("style","display:block;");
			   attachEventListener(trnsbtt,"click",trnsproc,false);
		    }else{
			   trnsbtt.setAttribute("style","display:none;");
			   detachEventListener(trnsbtt,"click",trnsproc,false);			
			}
		    if(Cookies.get('auth09')=='Y'){
			    vrsbtt.setAttribute("style","display:block;");
			    attachEventListener(vrsbtt,"click",vrsproc,false);
		    }else{
			    vrsbtt.setAttribute("style","display:none;");
			    detachEventListener(vrsbtt,"click",vrsproc,false);
			}		  
		  
	    }
	}else{	   
		 vrsbtt.setAttribute("style","display:none;");
		 detachEventListener(vrsbtt,"click",vrsproc,false);
		 trnsbtt.setAttribute("style","display:none;");
		 detachEventListener(trnsbtt,"click",trnsproc,false);	
		  apprv.setAttribute("style","color:green;font-size:20px;font-weight:bold;;");
		apprv.innerHTML='\u{3246}\u{A0}\u{A0}\u{A0}\u{A0}'; 
	    if(Cookies.get('auth08')=='Y'){		
		    ansbtt.setAttribute("style","display:block;");
		    attachEventListener(ansbtt,"click",ansproc,false);			 
	    }else{
		    ansbtt.setAttribute("style","display:none;");
		    detachEventListener(ansbtt,"click",ansproc,false);	
		}
	    if(Cookies.get('auth02')=='Y'){
		    editbtt.setAttribute("style","visibility:visible;");
		    attachEventListener(editbtt,"click",edtrec,false);
	    }else{
		    editbtt.setAttribute("style","visibility:hidden;");
		    detachEventListener(editbtt,"click",edtrec,false);
		}
	    if(Cookies.get('auth03')=='Y'){
		   delbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(delbtt,"click",delrec,false);
	    }else{
		   delbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(delbtt,"click",delrec,false);
		}

    }

    return true;			   
}
function choseSecond(targetTrChildren,targetTr){  //紀錄移動表身
	 var outhis=document.getElementById("OUTRCD_BOTT");
	 if(targetTrChildren[8].innerHTML*1>0){
		 outhis.setAttribute("style","visibility:visibility;"); 
		 attachEventListener(outhis,"click",page2OtherButton1,false);
	 }else{
		 outhis.setAttribute("style","visibility:hidden;"); 
	   detachEventListener(outhis,"click",page2OtherButton1,false);
	 }
   return true;	
}
function rowchoseExtraDeal(targetRow){    //紀錄移動  
    var shrno=targetRow.cells[targetRow.cells.length-3].innerHTML;
	var trnno=targetRow.cells[targetRow.cells.length-4].innerHTML;	       
	var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var trnsbtt=document.getElementById("TRN_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");  
	var apprv=document.getElementById('APPRVE');
	
	if(shrno=='Y'){		
		ansbtt.setAttribute("style","display:none;");
		detachEventListener(ansbtt,"click",ansproc,false);				
		delbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(delbtt,"click",delrec,false);
		apprv.setAttribute("style","color:red;font-size:20px;font-weight:bold;");
		apprv.innerHTML='\u{329E}\u{A0}\u{A0}\u{A0}\u{A0}';
		if(trnno=='Y'){          //如果已轉出貨單反確認與轉單鈕不作用
			trnsbtt.setAttribute("style","display:none;");
			detachEventListener(trnsbtt,"click",trnsproc,false); 
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);
			
		}else{
		    if(Cookies.get('auth09')=='Y'){
			   vrsbtt.setAttribute("style","display:block;");
			   attachEventListener(vrsbtt,"click",vrsproc,false);	
		    }else{
			    vrsbtt.setAttribute("style","display:none;");
			    detachEventListener(vrsbtt,"click",vrsproc,false);
			}
		    if(Cookies.get('auth07')=='Y'){
			    trnsbtt.setAttribute("style","display:block;");
				attachEventListener(trnsbtt,"click",trnsproc,false);	
		    }else{
			    trnsbtt.setAttribute("style","display:none;");
				detachEventListener(trnsbtt,"click",trnsproc,false);	
			}
		  
		}
	}else{		
		trnsbtt.setAttribute("style","display:none;");
		detachEventListener(trnsbtt,"click",trnsproc,false); 
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);		
		apprv.setAttribute("style","color:green;font-size:20px;font-weight:bold;");
		apprv.innerHTML='\u{3246}\u{A0}\u{A0}\u{A0}\u{A0}'; 
		if(Cookies.get('auth08')=='Y'){		  
		    ansbtt.setAttribute("style","display:block;");
		    attachEventListener(ansbtt,"click",ansproc,false);			  
		}else{
		    ansbtt.setAttribute("style","display:none;");
		    detachEventListener(ansbtt,"click",ansproc,false);
		}
		if(Cookies.get('auth02')=='Y'){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",edtrec,false);
		}else{
		    editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
		}
		if(Cookies.get('auth03')=='Y'){
		   delbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(delbtt,"click",delrec,false);
		}else{
		   delbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(delbtt,"click",delrec,false);
		}

	}  
	
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動表身
    var outhis=document.getElementById("OUTRCD_BOTT");
	 if(targetRow.childNodes[8].innerHTML*1>0){
		 outhis.setAttribute("style","visibility:visibility;"); 
		 attachEventListener(outhis,"click",page2OtherButton1,false);
	 }else{
		outhis.setAttribute("style","visibility:hidden;"); 
		detachEventListener(outhis,"click",page2OtherButton1,false); 
	 }
   return true;	
}




function getUrlParams2(url){  //解析url成物件
   let urlStr=url.split('?')[1];
   const urlSearchParams=new URLSearchParams(urlStr);
   const result=Object.fromEntries(urlSearchParams.entries());
   return result;

}