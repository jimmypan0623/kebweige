function getProfile(str1,reccount,tbno) {    
    var cnt=0;
	var queryttl=0;
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
	    var rnddgt=getCookie('INT_069');  //四捨五入到幾位
        var scndttl=document.getElementById('ttlmny');   //次頁表頭的總金額物件	
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
				if(jk.substr(0,jk.lastIndexOf('_')-4)=='query_price' && tbno==1){
					attachEventListener(oTd, 'click', rowchoose, false);  //點選資料
					var oTd = oTr.insertCell(oTr.cells.length);
					oTd.setAttribute("class","indirectdata");					 
					oTd.setAttribute("style","width:8%;text-align:right;");	
					oTd.innerHTML=Math.round((oTr.cells[3].innerHTML*oTr.cells[4].innerHTML + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);	
					queryttl+=Number(oTd.innerHTML);
				}		 						
				// 點擊事件綁定
				attachEventListener(oTd, 'click', rowchoose, false);  //點選資料
		    }
		   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","display:none");   
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		   if(tbno==0){
			  myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox表頭
			  if(arr[i]['shure_IHC_000']!='Y'){  //未確認
			     oTr.setAttribute("style","font-weight:bold;color:#704214;"); 
		      } 
		   }else{
			  myCheck.setAttribute("name","chkbxmember2");   //讓使用者勾選的checkbox表身
			  scndttl.innerHTML=(Math.round((queryttl + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt));              
		   }
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);  		   		  
	}	 
	var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());  	 	
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
		  var apprv=document.getElementById('APPRVE');
		  apprv.innerHTML="&nbsp";
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
	   editbtt.setAttribute("style","visibility:hidden;");
	   detachEventListener(editbtt,"click",edtrec,false);
	   delbtt.setAttribute("style","visibility:hidden;");
	   detachEventListener(delbtt,"click",delrec,false);	 
	   apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
	    if(trnno=='Y'){    //如果已轉訂單反確認與轉單鈕不作用
		    vrsbtt.setAttribute("style","display:none;");
		    detachEventListener(vrsbtt,"click",vrsproc,false);
		    trnsbtt.setAttribute("style","visibility:hidden;");
		    detachEventListener(trnsbtt,"click",trnsproc,false);
	    }else{
		    if(getAuth[0]()[7]=='Y'){    //轉單權限
			    trnsbtt.setAttribute("style","visibility:visible;");
			    attachEventListener(trnsbtt,"click",trnsproc,false);
		    }else{
			    trnsbtt.setAttribute("style","visibility:hidden;");
			    detachEventListener(trnsbtt,"click",trnsproc,false);
			}
		    if(getAuth[0]()[9]=='Y'){     //反確認權限
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
		 trnsbtt.setAttribute("style","visibility:hidden;");
		 detachEventListener(trnsbtt,"click",trnsproc,false);	
		 apprv.innerHTML='\u{A0}'; 		
	    if(getAuth[0]()[8]=='Y'){      //確認權限		
		    ansbtt.setAttribute("style","display:block;");
		    attachEventListener(ansbtt,"click",ansproc,false);			 
	    }else{
		    ansbtt.setAttribute("style","display:none;");
		    detachEventListener(ansbtt,"click",ansproc,false);
		}
	    if(getAuth[0]()[2]=='Y'){      //修改權限
		   editbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(editbtt,"click",edtrec,false);
	    }else{
		   editbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(editbtt,"click",edtrec,false);
		}
	    if(getAuth[0]()[3]=='Y'){      //刪除權限
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
		editbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(editbtt,"click",edtrec,false);
		delbtt.setAttribute("style","visibility:hidden;");
		detachEventListener(delbtt,"click",delrec,false);				
		apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
		if(trnno=='Y'){          //如果已轉訂單反確認與轉單鈕不作用
			trnsbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(trnsbtt,"click",trnsproc,false); 
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);			
		}else{
			if(getAuth[0]()[9]=='Y'){
			   vrsbtt.setAttribute("style","display:block;");
			   attachEventListener(vrsbtt,"click",vrsproc,false);	
			}else{
			   vrsbtt.setAttribute("style","display:none;");
			   detachEventListener(vrsbtt,"click",vrsproc,false);	
			}
			if(getAuth[0]()[7]=='Y' ){
				trnsbtt.setAttribute("style","visibility:visible;");
				attachEventListener(trnsbtt,"click",trnsproc,false);	
			}else{
				trnsbtt.setAttribute("style","visibility:hidden;");
				detachEventListener(trnsbtt,"click",trnsproc,false);	
			}
		}
	}else{
		 trnsbtt.setAttribute("style","visibility:hidden;");
		 detachEventListener(trnsbtt,"click",trnsproc,false); 
		 vrsbtt.setAttribute("style","display:none;");
		 detachEventListener(vrsbtt,"click",vrsproc,false);
		 apprv.innerHTML='\u{A0}'; 
		if(getAuth[0]()[8]=='Y'){				  
		   ansbtt.setAttribute("style","display:block;");
		   attachEventListener(ansbtt,"click",ansproc,false);					  				   
		}else{
		   ansbtt.setAttribute("style","display:none;");
		   detachEventListener(ansbtt,"click",ansproc,false);	
		}
		if(getAuth[0]()[2]=='Y'){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",edtrec,false);
		}else{
			editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
		}
		if(getAuth[0]()[3]=='Y'){
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
   return true;	
}

