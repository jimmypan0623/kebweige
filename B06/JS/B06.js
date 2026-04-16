 function getProfile(str1,trncde,tbno) {      
    var cnt=0;
	 
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
			var cokath1=getAuth[0]()[1]; 
			if (cokath1=='Y'){
		        newbtt.setAttribute("style","visibility:visible;");			 
			    attachEventListener(newbtt,"click",addrec,false);  //新增紀錄按鈕程序恢復
			}else{
			    newbtt.setAttribute("style","visibility:hidden;");			
			    detachEventListener(newbtt,"click",addrec,false);					 
			}
			var cokath4=getAuth[0]()[4];
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
			// 點擊事件綁定
			attachEventListener(oTd, 'click', rowchoose, false);
		}
		var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	    oTd.setAttribute("style","width:40px;display:none");   
	 	var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";
		if(tbno==0){
			myCheck.setAttribute("name","chkbxmember1");   //讓使用者勾選的checkbox單頭			 
			if(arr[i]['shure_IHC_000']!='Y'){  //未確認
			    oTr.setAttribute("style","font-weight:bold;color:#704214;"); 
		    } 			 
		}else{
			myCheck.setAttribute("name","chkbxmember2");   //讓使用者勾選的checkbox表身	
		}   
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);  		   		  
	}
	if (tbno==0){       //如果是單頭	     
		var responseDiv=document.getElementById("serverResponse1");  
	}else{		 
		var responseDiv=document.getElementById("serverResponse2");  
	} 		

	if(cnt>0){       //初始畫面呼叫	   
	    if(responseDiv.innerHTML=='Searching......'){   
		    responseDiv.setAttribute("style","color:#536a60;"); 
            responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		              
		     
		}else{
		    var seekrcd=document.getElementById("SEEK_BOTT");
		    seekrcd.setAttribute("style","visibility:visible;");
		    attachEventListener(seekrcd,"click",seekrec,false);
			
		}
		
		chooserc(1); //跳到第一列
	}else{ 
	     if(responseDiv.innerHTML=='Searching......'){   
		    responseDiv.setAttribute("style","color:red;"); 
	   	    responseDiv.innerHTML="無此資料！Not found!検索できません。";
			 
		 }else{
			if (tbno==0){       //如果是表頭
		       responseDiv.innerHTML="本月無移轉單。";
			}
			var seekrcd=document.getElementById("SEEK_BOTT");
		    seekrcd.setAttribute("style","visibility:hidden;");
		    detachEventListener(seekrcd,"click",seekrec,false);
		 }
		 
		var apprv=document.getElementById('APPRVE');
		apprv.innerHTML="&nbsp";
	}		  
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
		apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
	    if(getAuth[0]()[9]=='Y' && cko[0](0)==0){				 
			vrsbtt.setAttribute("style","display:block;");
			attachEventListener(vrsbtt,"click",vrsproc,false);			 
	    }else{
		   vrsbtt.setAttribute("style","display:none;");
		   detachEventListener(vrsbtt,"click",vrsproc,false);			
	    }
    }else{	   
		
		apprv.innerHTML='\u{A0}';  
		
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);
	    if(getAuth[0]()[8]=='Y' && cko[0](0)==0){			
			ansbtt.setAttribute("style","display:block;");  					
			attachEventListener(ansbtt,"click",ansproc,false);													
	    }else{
			ansbtt.setAttribute("style","display:none;");  					
			detachEventListener(ansbtt,"click",ansproc,false);	
	    }
	    if(getAuth[0]()[2]=='Y' && cko[0](0)==0){
		   editbtt.setAttribute("style","visibility:visible;");
		   attachEventListener(editbtt,"click",edtrec,false);
	    }else{
		   editbtt.setAttribute("style","visibility:hidden;");
		   detachEventListener(editbtt,"click",edtrec,false);	   
	    }
	   if(getAuth[0]()[3]=='Y' && cko[0](0)!=1){
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
		apprv.innerHTML="<img src='digits/approve.gif' alt='svg' style='position: absolute;top: 39px;left: 54%;width: 50px;opacity: 0.45;'>"
		if(getAuth[0]()[9]=='Y' && cko[0](0)==0){			 
			vrsbtt.setAttribute("style","display:block;");
			attachEventListener(vrsbtt,"click",vrsproc,false);				 
		}else{
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);			
		}
	}else{		 
		apprv.innerHTML='\u{A0}'; 
		vrsbtt.setAttribute("style","display:none;");
		detachEventListener(vrsbtt,"click",vrsproc,false);
		if(getAuth[0]()[8]=='Y' && cko[0](0)==0 ){			 
			ansbtt.setAttribute("style","display:block;");  				   
			attachEventListener(ansbtt,"click",ansproc,false);								 
		}else{
			ansbtt.setAttribute("style","display:none;");  				   
			detachEventListener(ansbtt,"click",ansproc,false);			
		}
		if(getAuth[0]()[2]=='Y' && cko[0](0)==0){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",edtrec,false);
		}else{
			 editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
		}
		if(getAuth[0]()[3]=='Y' && cko[0](0)==0){
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