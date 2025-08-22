 function getProfile(str1,trncde,tbno) {      
    var cnt=0;
	var queryttl=0;
	var arr = str1; 
	if (tbno==0){     //如果是表頭   
        var bibau=cko[0](0);   //找出閉包變數
	    cko[0](bibau*(-1));    //將閉包變數歸零
		cko[0](trncde=='Y'?1:0);      //將此變數當作是否結轉的旗號			    
		var newbtt=document.getElementById("NEW_BOTT");  
		var prnbtt=document.getElementById("PRNT_BOTT");
		if(cko[0](0)==1){	   //如果庫存帳已結轉則新增與列印按鈕設為無效		 			
			prnbtt.setAttribute("style","visibility:hidden;");			
			detachEventListener(prnbtt,"click",prntproc,false);	
			newbtt.setAttribute("style","visibility:hidden;");			
			detachEventListener(newbtt,"click",addrec,false);					  			
		}else{
			var cokath1=Cookies.get('auth01'); 
			if (cokath1=='Y'){
		        newbtt.setAttribute("style","visibility:visible;");			 
			    attachEventListener(newbtt,"click",addrec,false);  //新增紀錄按鈕程序恢復
			}else{
			    newbtt.setAttribute("style","visibility:hidden;");			
			    detachEventListener(newbtt,"click",addrec,false);					 
			}
			var cokath4=Cookies.get('auth04');
	        if (cokath4=='Y'){
			    prnbtt.setAttribute("style","visiblity:visible;font-size:130%;margin:0;color:black;");			
			    attachEventListener(prnbtt,"click",prntproc,false);	
			}else{
			    prnbtt.setAttribute("style","visibility:hidden;");			
		  	    detachEventListener(prnbtt,"click",prntproc,false);	
			}			
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
			   }else if(jk=='query_no' || jk=='invoice_no'){	
				  oTd.setAttribute("class","directdata");				   
				  oTd.setAttribute("style","width:10%;");		
				  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
			   }else if(jk=='custom_no' ){	
				  oTd.setAttribute("class","directdata");
				  oTd.setAttribute("style","width:7%;");							 
				  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				  
				 }else if(jk=='crncy_rate'){	
				  oTd.setAttribute("class","directdata");
				  oTd.setAttribute("style","text-align:right;width:7%;");							 
				  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */  
			   }else if(jk=='custom_name'){	
				  oTd.setAttribute("class","indirectdata");
				  oTd.setAttribute("style","width:7%;");							 
				  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */  
			   }else if(jk=='crncy_type' || jk=='query_date' ){	
					oTd.setAttribute("class","directdata");
					oTd.setAttribute("style","text-align:center;width:4%;" );			
					attachEventListener(oTd,'click',rowchoose,false);							
				}else if(jk=='sales_name'){					    
					  oTd.setAttribute("style","width:7%;");		
					   oTd.setAttribute("class","indirectdata");			
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */ 
				 }else if(jk=='customer_po'){					    
					  oTd.setAttribute("style","width:12%;");		
					   oTd.setAttribute("class","directdata");			
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				 }else if(jk=='shipdirect'){					    
					  oTd.setAttribute("style","width:15%;");		
					   oTd.setAttribute("class","directdata");			
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */
				}else if(jk=='invoice_type'){					    
					  oTd.setAttribute("style","display:none;");		
					   oTd.setAttribute("class","directdata");		
					  var oTd = oTr.insertCell(oTr.cells.length);
					 oTd.innerHTML=whichinvoice(arr[i][jk]);
					  oTd.setAttribute("style","width:5%;");
					 attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
				 }else if(jk=='tax_type'){					    
					  oTd.setAttribute("style","display:none;");		
					   oTd.setAttribute("class","directdata");		
					   var oTd = oTr.insertCell(oTr.cells.length);
					   oTd.innerHTML=whichtax(arr[i][jk]);
					 oTd.setAttribute("style","width:4%;");
					 attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
				 }else if(jk=='payment' || jk=='ship_direct'){	
				  oTd.setAttribute("class","directdata");				   
				  oTd.setAttribute("style","width:8%;");		
				  attachEventListener(oTd,'click',rowchoose,false);		//點選資料  */	 
			   }else if(jk=='shure' || jk=='custom_fullname' || jk=='unitedno' || jk=='contact' || jk=='tel'){		  
				   oTd.setAttribute("class","indirectdata");
				   oTd.setAttribute("style","display:none;");	
			  }else{					  	
					  oTd.setAttribute("style","text-align:left;");				  
					 oTd.setAttribute("class","directdata");						 
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			   }
			   
			}else{      //表身資料b0d匯入 
				
				if(jk=='rc_no' || jk=='lastupdate'){			 
				  oTd.setAttribute("style","display:none;");
				  oTd.setAttribute("class","directdata"); 	
				}else if(jk=='stockname'){
					 oTd.setAttribute("class","indirectdata");	
					   oTd.setAttribute("style","text-align:left;");						 
					  attachEventListener(oTd,'click',rowchoose,false);		//點選資料							  
				}else if(jk=='order_no' || jk=='remark'){
				   oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","width:10%;");	
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料					
				}else if(jk=='query_qty'){
				   oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","width:7%;text-align:right;");	
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料		
				}else if(jk=='query_price'){
					 oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","width:7%;text-align:right;");	
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料						 
					var oTd = oTr.insertCell(oTr.cells.length);
					oTd.setAttribute("style","width:7%;text-align:right;");		
					oTd.setAttribute("class","indirectdata");								
					oTd.innerHTML=Math.round((oTr.cells[4].innerHTML*oTr.cells[5].innerHTML + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
					queryttl+=Number(oTd.innerHTML);
					attachEventListener(oTd,'click',rowchoose,false);		//點選資料	
					
			   }else if(jk=='dept_no'){
					oTd.setAttribute("class","directdata");	
					 oTd.setAttribute("style","display:none;");	
			   }else if(jk=='dept_name'){
					oTd.setAttribute("class","indirectdata");							
					 oTd.setAttribute("style","width:7%;");	  
					 attachEventListener(oTd,'click',rowchoose,false);		//點選資料		       
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
			scndttl.innerHTML= Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);              
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
		document.getElementById('ttltitle').innerHTML="本頁金額:"+sourceAccount(11,0)+":";
	}else{
		if (tbno==1){       //如果是表身
		    document.getElementById('ttltitle').innerHTML="本單總額:"+sourceAccount(11,0)+":";
		}
	} 
	
	if(cnt>0){       //初始畫面呼叫	   
		chooserc(1); //跳到第一列
	}else{ 
		scndttl.innerHTML="0";
	}		  
}

//發票聯式
function whichinvoice(tpe){
	 var tpemsg="";
     switch(tpe){
      case '31': {    
          tpemsg = '三聯式';    
          break;  
      }
      case '32': {    
          tpemsg = '二聯式';   
          break;
	  }	 
       default: {
         break;
       }
    }
    return tpemsg;
}
//稅別
function whichtax(tpe){
	 var tpemsg="";
     switch(tpe){
      case '1': {    
          tpemsg = '應稅';    
          break;  
      }
      case '2': {    
          tpemsg = '零稅';   
          break;
	  }
	   case '3': {    
          tpemsg = '免稅';   
          break;
	  }
       default: {
         break;
       }
    }
    return tpemsg;
}

function choseSecond(targetTrChildren,targetTr){
	 
   return true;	
}
function choseExtraDeal(targetTrChildren,targetTr){   //紀錄移動
    var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");
	var apprv=document.getElementById('APPRVE');	   
	var shrno=targetTr.cells[targetTr.cells.length-3].innerHTML;
	if(shrno=='Y'){
	    ansbtt.setAttribute("style","display:none;"); 			
	    detachEventListener(ansbtt,"click",ansproc,false);
	    editbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(editbtt,"click",edtrec,false);
	    delbtt.setAttribute("style","visibility:hidden;");
	    detachEventListener(delbtt,"click",delrec,false);	 
	    apprv.setAttribute("style","color:red;font-size:20px;font-weight:bold;");
	    apprv.innerHTML='\u{329E}\u{A0}\u{A0}\u{A0}\u{A0}';	 
	    if(Cookies.get('auth09')=='Y' && cko[0](0)==0){				 
			vrsbtt.setAttribute("style","display:block;");
			attachEventListener(vrsbtt,"click",vrsproc,false);			 
	    }else{
		   vrsbtt.setAttribute("style","display:none;");
		   detachEventListener(vrsbtt,"click",vrsproc,false);			
	    }
    }else{	   
		apprv.setAttribute("style","color:green;font-size:20px;font-weight:bold;");
		apprv.innerHTML='\u{3246}\u{A0}\u{A0}\u{A0}\u{A0}'; 
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);
	    if(Cookies.get('auth08')=='Y' && cko[0](0)==0){			
			ansbtt.setAttribute("style","display:block;");  					
			attachEventListener(ansbtt,"click",ansproc,false);													
	    }else{
			ansbtt.setAttribute("style","display:none;");  					
			detachEventListener(ansbtt,"click",ansproc,false);	
	    }
	    if(Cookies.get('auth02')=='Y' && cko[0](0)==0){
		   editbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(editbtt,"click",edtrec,false);
	    }else{
		   editbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(editbtt,"click",edtrec,false);	   
	    }
	   if(Cookies.get('auth03')=='Y' && cko[0](0)!=1){
		  delbtt.setAttribute("style","visibility:visible;");
		  attachEventListener(delbtt,"click",delrec,false);
	   }else{
		  delbtt.setAttribute("style","visibility:hidden;");
		  detachEventListener(delbtt,"click",delrec,false);
	   }
    }  
    return true;			   
}

function rowchoseExtraDeal(targetRow){    //紀錄移動
	var shrno=targetRow.cells[targetRow.cells.length-3].innerHTML;
	var ansbtt=document.getElementById("ANS_BOTT");	
	var vrsbtt=document.getElementById("VRS_BOTT");	
	var editbtt=document.getElementById("EDIT_BOTT");
	var delbtt=document.getElementById("DEL_BOTT");  
	var apprv=document.getElementById('APPRVE');			 
	if(shrno=='Y'){
		ansbtt.setAttribute("style","display:none;");			
		detachEventListener(ansbtt,"click",ansproc,false);				
		editbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(editbtt,"click",edtrec,false);
		delbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(delbtt,"click",delrec,false);	           
		apprv.setAttribute("style","color:red;font-size:20px;font-weight:bold;;");
		apprv.innerHTML='\u{329E}\u{A0}\u{A0}\u{A0}\u{A0}';			
		if(Cookies.get('auth09')=='Y' && cko[0](0)==0){			 
			vrsbtt.setAttribute("style","display:block;");
			attachEventListener(vrsbtt,"click",vrsproc,false);				 
		}else{
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);			
		}
	}else{		 
		apprv.setAttribute("style","color:green;font-size:20px;font-weight:bold;;");
		apprv.innerHTML='\u{3246}\u{A0}\u{A0}\u{A0}\u{A0}'; 
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);
		if(Cookies.get('auth08')=='Y' && cko[0](0)==0 ){			 
			ansbtt.setAttribute("style","display:block;");  				   
			attachEventListener(ansbtt,"click",ansproc,false);								 
		}else{
			ansbtt.setAttribute("style","display:none;");  				   
			detachEventListener(ansbtt,"click",ansproc,false);			
		}
		if(Cookies.get('auth02')=='Y' && cko[0](0)==0){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",edtrec,false);
		}else{
			 editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
		}
		if(Cookies.get('auth03')=='Y' && cko[0](0)==0){
		   delbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(delbtt,"click",delrec,false);
		}else{
		   delbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(delbtt,"click",delrec,false);
		}
	}  
    return true;			   
}	

function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}


