function selfTag(jsvsn){	
	var contentdiv=getElementsByAttribute('class','tab_content');	
	var svrSpns1=document.getElementById('serverResponse1');    	 
	var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	var invDetailButton=document.createElement("input");		   
	invDetailButton.setAttribute("type","button");
	invDetailButton.setAttribute("class","btn");
	invDetailButton.setAttribute("value","\u{1F3E1}");     //u{1F3E1}
	invDetailButton.setAttribute("style","font-size:130%;margin:0px");
	invDetailButton.setAttribute("title","各庫別明細，快速鍵 Alt+B");	
	invDetailButton.setAttribute('accesskey','B')
	invDetailButton.id="INVDTL_BOTT";		
	contentdiv[0].insertBefore(text5,svrSpns1);
	contentdiv[0].insertBefore(invDetailButton,svrSpns1);	 
	loadScript(`B01/JS/B01.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`B01/JS/B01rgst.js?v=${jsvsn}`);
	loadScript(`C21/JS/C01srch.js?v=${jsvsn}`);
	loadScript(`B01/JS/D01srch.js?v=${jsvsn}`);		
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
	    attachEventListener(tab1Click,"click",tab1View,false);
	}	
	var tab2Click=document.getElementById("tab2");
	if(tab2Click){
	    attachEventListener(tab2Click,"click",tab2View,false);
	}
	var tab3Click=document.getElementById("tab3");
	if(tab3Click){
	    attachEventListener(tab3Click,"click",tab3View,false);
	}
}

function tab1View(event){	  
       
		   if (typeof event=="undefined"){
		   event=window.event;
    	}
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (getCookie('auth01')=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
			
         }			 
		 
		 var srchbtt=document.getElementById('SEEK_BOTT');		
		srchbtt.style.visibility="visible";	
		attachEventListener(srchbtt,'click',seekrec,false);  
		var editbtt=document.getElementById('EDIT_BOTT');       //新增按鈕
		 if (getCookie('auth02')=='Y'){
             editbtt.style.visibility="visible";	
			 attachEventListener(editbtt,"click",edtrec,false);  //新增紀錄按鈕程序
         }else{
			 editbtt.style.visibility="hidden";
			
         }			 
		 var delbtt=document.getElementById('DEL_BOTT');       //刪除按鈕
		 
		    if (getCookie('auth03')=='Y'){
				if(document.getElementById('totalqty').textContent*1==0 && document.getElementById('qyt_on_hand').textContent*1==0){
                    delbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(delbtt,"click",delrec,false);
				}else{
				     delbtt.setAttribute("style","visibility:hidden;");
		            detachEventListener(delbtt,"click",delrec,false);
				}
            }else{
			    delbtt.setAttribute("style","visibility:hidden;");
				detachEventListener(delbtt,"click",delrec,false);	
		
            }			 
        
		 
		 var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#FCFCFC";
		 localbottoncl.style.border=" 2px solid #FCFCFC";
		 localbottoncl.style.boxShadow ="sandybrown 5px 10px 10px 7px";
		 var bibau=cko[3](0);   //找出閉包變數現值
	     cko[3](bibau*(-1));    //將表身閉包變數歸零	
		  bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		////
}

function tab2View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#F9FAD9";
		 localbottoncl.style.border=" 2px solid #F9FAD9";
		 localbottoncl.style.boxShadow="olivedrab 5px 10px 10px 7px";
      if(getCookie('auth05')!='Y'){		     
		 blkshow("你無查看報價紀錄權限");		 
	     document.getElementById("tab1").checked=true;	
		 return false;	 
	  } 		  

	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
	   var srchbtt=document.getElementById('SEEK_BOTT');
	   var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕		
	   var editbtt=document.getElementById("EDIT_BOTT");
	   var delbtt=document.getElementById("DEL_BOTT");
	   var keydescription=document.getElementById('keydscrpt');    
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
	 
	   keydescription.textContent=aWaitUpdate[2];   
	   fthkey.innerHTML=aWaitUpdate[1];
	   
	   if(right(aWaitUpdate[4],1).trim()=='Y'){	
           if (getCookie('auth01')=='Y'){
               newrcath.style.visibility="visible";	
			   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			}
			if(getCookie('auth02')=='Y'){
				    editbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(editbtt,"click",edtrec,false);
			}
			if(getCookie('auth03')=='Y'){
				delbtt.setAttribute("style","visibility:visible;");
				attachEventListener(delbtt,"click",delrec,false);
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
	   commontemp(fthkey.innerHTML,"c02.F03");
}


function tab3View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
		 localbottoncl.style.backgroundColor="#F3F3FA";
		 localbottoncl.style.border=" 2px solid #F3F3FA";
		 localbottoncl.style.boxShadow="skyblue 5px 10px 10px 7px";
      if(getCookie('auth06')!='Y'){		     
		 blkshow("你無查看詢價紀錄權限");		 
	     document.getElementById("tab1").checked=true;	
		 return false;	 
	  } 		  

	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
	   var srchbtt=document.getElementById('SEEK_BOTT');
	   var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕		
	   var editbtt=document.getElementById("EDIT_BOTT");
	   var delbtt=document.getElementById("DEL_BOTT");
	   var keydescription=document.getElementById('keydscrpt1');    
       var fthkey=document.getElementById("fatherkey1");
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
	 
	   keydescription.textContent=aWaitUpdate[2];   
	   fthkey.innerHTML=aWaitUpdate[1];
	   
	   if(left(aWaitUpdate[4],1).trim()=='Y'){	
           if (getCookie('auth01')=='Y'){
               newrcath.style.visibility="visible";	
			   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			}
			if(getCookie('auth02')=='Y'){
				    editbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(editbtt,"click",edtrec,false);
			}
			if(getCookie('auth03')=='Y'){
				    delbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(delbtt,"click",delrec,false);
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
	   
	   var responseDiv=document.getElementById("serverResponse3"); 
	   responseDiv.innerHTML='&nbsp';
	   var bibau=cko[4](0);   //找出閉包變數現值
	   cko[4](bibau*(-1));    //將表身閉包變數歸零			
	    bibau=cko[6](0);   //找出閉包變數現值
	    cko[6](bibau*(-1));    //將表身閉包變數歸零 
	   commontemp(fthkey.innerHTML,"d02.F03");
}
