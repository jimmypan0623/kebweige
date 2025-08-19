function selfTag(jsvsn){		
	loadScript(`C01/C01.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`C01/C01rgst.js?v=${jsvsn}`);
	loadScript(`C01/A01srch.js?v=${jsvsn}`);
	loadScript(`C01/A09getno.js?v=${jsvsn}`);	
    loadScript(`C21/B01srch.js?v=${jsvsn}`);	
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
	      attachEventListener(tab1Click,"click",tab1View,false);
	}	
	var tab2Click=document.getElementById("tab2");
	if(tab2Click){
	    attachEventListener(tab2Click,"click",tab2View,false);
	}		
}

function tab1View(event){	  
 
	   if (typeof event=="undefined"){
		   event=window.event;
    	}
		var srchbtt=document.getElementById('SEEK_BOTT');		
		srchbtt.style.visibility="visible";	
		var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (Cookies.get('auth01')=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			 detachEventListener(newrcath,"click",addrec,false);
         }			 
		var editbtt=document.getElementById("EDIT_BOTT");
		
		if(Cookies.get('auth02')=='Y'){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",  edtrec,false);
		}else{
		    editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",  edtrec,false);
		}
		var delbtt=document.getElementById("DEL_BOTT");
		if(Cookies.get('auth03')=='Y'){
			delbtt.setAttribute("style","visibility:visible;");
			attachEventListener(delbtt,"click",  delrec,false);
		}else{
		    delbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(delbtt,"click",  delrec,false);
		}
		 var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#FCFCFC";
		 localbottoncl.style.border=" 2px solid #FCFCFC";
		 localbottoncl.style.boxShadow ="sandybrown 5px 10px 10px 7px";
		 var bibau=cko[3](0);   //找出閉包變數現值
	     cko[3](bibau*(-1));    //將表身閉包變數歸零		 
		  bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		 
		/////
}
function tab2View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#F9FAD9";
		 localbottoncl.style.border=" 2px solid #F9FAD9";
		 localbottoncl.style.boxShadow="olivedrab 5px 10px 10px 7px";
      if(Cookies.get('auth05')!='Y'){		     
		 blkshow("你無查看報價紀錄權限");		 
	     document.getElementById("tab1").checked=true;	
		 return false;	 
	  } 		  
	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
	   var keydescription=document.getElementById('keydscrpt');   
	    var srchbtt=document.getElementById('SEEK_BOTT');
	   var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕		
	    var editbtt=document.getElementById("EDIT_BOTT");
		var delbtt=document.getElementById("DEL_BOTT");
       var fthkey=document.getElementById("fatherkey");
	   var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料

       var maintable=document.getElementById("maintbody1");		//所指向的單頭紀錄		 				 	 
	   for(var i=0;i< maintable.rows.length; i++){			 		            
		   if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			   for (j=0;j<maintable.rows[i].cells.length-1;j++){				  
				   aWaitUpdate.push(maintable.rows[i].cells[j].textContent);  //將待修改欄位資料存入陣列				 
			   }				                           
               break;					   
		   }
	   } 
	   keydescription.textContent=aWaitUpdate[3];  //aWaitUpdate[2]+'&nbsp'+
	   fthkey.innerHTML=aWaitUpdate[1];
	    
	   if(aWaitUpdate[23]==fthkey.innerHTML){	   //群組編號等於自己編號
           if (Cookies.get('auth01')=='Y'){
               newrcath.setAttribute("style","visibility:visible;");
			   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			}else{
			   newrcath.setAttribute("style","visibility:hidden;");
			   detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
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
			srchbtt.setAttribute("style","visibility:visible;");	
		    attachEventListener(srchbtt,'click',seekrec,false);  
	    }else{
			 srchbtt.setAttribute("style","visibility:hidden;");	
	     	detachEventListener(srchbtt,'click',seekrec,false);    			
		    newrcath.setAttribute("style","visibility:hidden;");
			detachEventListener(newrcath,"click",addrec,false);  //取消新增按鈕程序
			editbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(editbtt,"click",edtrec,false);
			delbtt.setAttribute("style","visibility:hidden;");
			detachEventListener(delbtt,"click",delrec,false);
			
		}			  
	   
	   
	   var responseDiv=document.getElementById("serverResponse2"); 
	   responseDiv.innerHTML='&nbsp';
	   var bibau=cko[3](0);   //找出閉包變數現值
	   cko[3](bibau*(-1));    //將表身閉包變數歸零			
	    bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
	   commontemp(fthkey.innerHTML,"c02.F01");
}