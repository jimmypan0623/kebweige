function selfTag(jsvsn){	
    var contentdiv=getElementsByAttribute('class','tab_content');	
	var tabnames=getElementsByAttribute('name','tablbl');			
    var firstCover=getElementsByAttribute('class','table_cover');	
	firstCover[0].style.width="37%";
	var secondCover=document.createElement('div');	 
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="63%";
    var righttbl1=document.createElement("table");
	righttbl1.id="rightMember1";	 
    var arrayRgt1=["料品編號","品名規格","管理類別","歸屬類別","保存期限:","計料單位:",
	"標準售價:","保管部門:","總庫存量:","在庫數量:","庫存上限:","安全存量:",
	"料架位置:","建立料表:","領料類別:","領用批量:","採購前置:","收發料前置:",
	"標準進價:","平均成本:","備註說明:","物料類別:","產    地:","最後更新:"];
     var arrayRgt2=["<span name='b01value' id='stock_no' ></span>","<span name='b01value' id='stock_name'></span>",
	 "<span name='b01value' id='type_of_mnge' ></span>","<span name='b01value' id='kind_of_belong_to'></span>",
	 "<span name='b01value' id='keepdays' ></span>","<span name='b01value' id='each_count'></span>",
	 "<span name='b01value' id='dividing' ></span>","<span name='b01value' id='who_hold'></span>&nbsp&nbsp&nbsp<span name='b01value' id='depart_name'></span>",
	 "<mark><span name='b01value' id='totalqty' ></span></mark>","<mark><span name='b01value' id='qyt_on_hand'></span></mark>",
	 "<span name='b01value' id='maxlimit_of_inv' ></span>","<span name='b01value' id='qty_of_safe'></span>",
	 "<span name='b01value' id='where_is' ></span>","<span name='b01value' id='bom_should_be'></span>",
	 "<span name='b01value' id='type_of_apply' ></span>","<span name='b01value' id='lotQty'></span>",
	 "<span name='b01value' id='leadtm_prchs' ></span>","<span name='b01value' id='leadtm_ready'></span>",
	 "<span name='b01value' id='sales_cost' ></span>","<span name='b01value' id='avg_cost'></span>",
	 "<span name='b01value' id='remark1' ></span>","<span name='b01value' id='mtr_type'></span>",
	 "<span name='b01value' id='rorgin_from' ></span>","<span name='b01value' id='who_and_when'></span>"];  
	for(var i=0;i<arrayRgt1.length;i++){
	    if(i%2==0){
		    var oTr=righttbl1.insertRow(-1);
			if(i==18){
				 oTr.setAttribute("class","costauth");
				 if(getAuth[0]()[7]!='Y'){
				     oTr.setAttribute("style","display:none;");				
				 }
			}
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);	 
         oTd.innerHTML=arrayRgt2[i];
	}		
	secondCover.appendChild(righttbl1); 
    contentdiv[0].appendChild(secondCover);   //畫面右邊欄位
	if(getAuth[0]()[5]=='Y'){	 //有查看報價紀錄權限時	   
		var rspn2=document.getElementById('serverResponse2'); 
		const frag1 = document.createDocumentFragment();			
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');	    
		frag1.appendChild(text01);
	    var spn1=document.createElement('span');
	    spn1.id="ttltitle";
        spn1.innerHTML="報價筆數:";	   
		frag1.appendChild(spn1);
	    var spn3=document.createElement('span');
	    spn3.id="ttlmny";       
	    spn3.innerHTML='0';	    
	  	frag1.appendChild(spn3);
		contentdiv[1].insertBefore(frag1,rspn2);
    }else{
        contentdiv[1].style.display='none';
	    tabnames[1].style.display='none';        
    }	   
    if(getAuth[0]()[6]=='Y'){	        //有查看詢價紀錄權限時      
        var rspn3=document.getElementById('serverResponse3'); 
		const frag2 = document.createDocumentFragment();			
	    var text02 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');	    
		frag2.appendChild(text02);
	    var spn4=document.createElement('span');
	    spn4.id="ttltitle1";
        spn4.innerHTML="詢價筆數:";	   
		frag2.appendChild(spn4);
	    var spn5=document.createElement('span');
	    spn5.id="ttlmny1";
	    spn5.innerHTML='0';
		frag2.appendChild(spn5);
		contentdiv[2].insertBefore(frag2,rspn3);
    }else{
		contentdiv[2].style.display='none';
	    tabnames[2].style.display='none';
	}

	var svrSpns1=document.getElementById('serverResponse1');    	 
	var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	var invDetailButton=document.createElement("input");		   
	invDetailButton.type="button";
	invDetailButton.className="btn";
	invDetailButton.value="\u{1F3E1}";     //u{1F3E1}
	invDetailButton.setAttribute("style","font-size:130%;margin:0px;");
	invDetailButton.title="各庫別明細，快速鍵 Alt+B";	
	invDetailButton.accessKey='B';
	invDetailButton.id="INVDTL_BOTT";		
	contentdiv[0].insertBefore(text5,svrSpns1);
	contentdiv[0].insertBefore(invDetailButton,svrSpns1);
    ///
    document.querySelectorAll("script[id]").forEach(s=>s.remove());		
	///		
	loadScript(`B01/JS/B01.js?v=${jsvsn}`,function(){DrawTable();});	
	loadScript(`B01/JS/B01rgst.js?v=${jsvsn}`);
	loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);
	var tab1Click=document.getElementById("tab1");
	if(tab1Click){
		tab1Click.setAttribute("accesskey","1");
	    attachEventListener(tab1Click,"click",tab1View,false);
	}	
	var tab2Click=document.getElementById("tab2");
	if(tab2Click){
		tab2Click.setAttribute("accesskey","2");
	    attachEventListener(tab2Click,"click",tab2View,false);
	}
	var tab3Click=document.getElementById("tab3");
	if(tab3Click){
		tab3Click.setAttribute("accesskey","3");
	    attachEventListener(tab3Click,"click",tab3View,false);
	}
}

function tab1View(event){	       
		if (typeof event=="undefined"){
		   event=window.event;
    	}
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (getAuth[0]()[1]=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";			
         }			 		 
		var srchbtt=document.getElementById('SEEK_BOTT');		
		srchbtt.style.visibility="visible";	
		attachEventListener(srchbtt,'click',seekrec,false);  
		var editbtt=document.getElementById('EDIT_BOTT');       //新增按鈕
		if (getAuth[0]()[2]=='Y'){
             editbtt.style.visibility="visible";	
			 attachEventListener(editbtt,"click",edtrec,false);  //新增紀錄按鈕程序
        }else{
			editbtt.style.visibility="hidden";
			
        }			 
		var delbtt=document.getElementById('DEL_BOTT');       //刪除按鈕		 
		if (getAuth[0]()[3]=='Y'){
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
		 var btns=getElementsByAttribute('class','btn');			 
		 for (var i=0;i<btns.length;i++){		
		     if(btns[i].accessKey=='I' || btns[i].accessKey=='M'){
		        btns[i].removeAttribute("accesskey");		
			 } 
			 if(right(btns[i].title,1)=='T' || right(btns[i].title,1)=='J' || right(btns[i].title,1)=='K' || right(btns[i].title,1)=='V' ||right(btns[i].title,1)=='B'){
		        btns[i].setAttribute("accesskey",right(btns[i].title,1));		
			 } 
	     }		           
}

function tab2View(event){	  
    if (typeof event=="undefined"){
		event=window.event;
    }
	var localbottoncl=document.getElementById('lclbtnbk');       //按鈕背景
	localbottoncl.style.backgroundColor="#F9FAD9";
	localbottoncl.style.border=" 2px solid #F9FAD9";
	localbottoncl.style.boxShadow="olivedrab 5px 10px 10px 7px";
    if(getAuth[0]()[5]!='Y'){		     
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
	if(right(aWaitUpdate[4],1).trim()=='Y'){	
        if (getAuth[0]()[1]=='Y'){
            newrcath.style.visibility="visible";	
			attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
		}
		if(getAuth[0]()[2]=='Y'){
			editbtt.setAttribute("style","visibility:visible;");
			attachEventListener(editbtt,"click",edtrec,false);
		}
		if(getAuth[0]()[3]=='Y'){
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
	if(event!='GY'){  	
		var btns=getElementsByAttribute('class','btn');		
		var M1=0;
		var I1=0;
		for (var i=0;i<btns.length;i++){		
		    if(btns[i].accessKey=='T' || btns[i].accessKey=='J' || btns[i].accessKey=='K' || btns[i].accessKey=='V' || btns[i].accessKey=='B'){		    
		        btns[i].removeAttribute("accesskey");		
			} 
			if(right(btns[i].title,1)=='I'){
				I1++;
				if(I1==1){
		            btns[i].setAttribute("accesskey",right(btns[i].title,1));
				}else{
					btns[i].removeAttribute("accesskey");
				}  
			} 
			if(right(btns[i].title,1)=='M'){
				M1++;
				if(M1==1){
		            btns[i].setAttribute("accesskey",right(btns[i].title,1));	
				}else{
					btns[i].removeAttribute("accesskey");
				}  
			} 
	    }
	}			
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
      if(getAuth[0]()[6]!='Y'){		     
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
	   var keydescription=document.getElementById('keydscrpt2');    
       var fthkey=document.getElementById("fatherkey2");
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
           if (getAuth[0]()[1]=='Y'){
               newrcath.style.visibility="visible";	
			   attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
			}
			if(getAuth[0]()[2]=='Y'){
				    editbtt.setAttribute("style","visibility:visible;");
				    attachEventListener(editbtt,"click",edtrec,false);
			}
			if(getAuth[0]()[3]=='Y'){
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
		if(event!='GY'){  	
		    var btns=getElementsByAttribute('class','btn');		
			var M1=0;
			var I1=0;
		    for (var i=0;i<btns.length;i++){		
		        if(btns[i].accessKey=='T' || btns[i].accessKey=='J' || btns[i].accessKey=='K' || btns[i].accessKey=='V' || btns[i].accessKey=='B'){		    
		           btns[i].removeAttribute("accesskey");		
			    } 
			    if(right(btns[i].title,1)=='I'){
				    I1++;
				    if(I1==2){
		               btns[i].setAttribute("accesskey",right(btns[i].title,1));		
				    }else{
					   btns[i].removeAttribute("accesskey");
					}
			    } 
				if(right(btns[i].title,1)=='M'){
				    M1++;
					if(M1==2){
		                btns[i].setAttribute("accesskey",right(btns[i].title,1));	
					}else{
					   btns[i].removeAttribute("accesskey");
					}						
			    } 
	        }
		}			
	   commontemp(fthkey.innerHTML,"d02.F03");
}
