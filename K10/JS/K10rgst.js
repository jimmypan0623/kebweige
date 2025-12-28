function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');
    for(var i=0;i<tabs.length;i++){
		tabs[i].setAttribute("accesskey",(i+1).toString());
	}			
	if (tabs[0].checked){
	    if (target.value=="\u{274E}"  && getCookie('INT_127')=='Y'){    //
		    var maintable=document.getElementById("maintbody1");		 		
		    var tablerowindex=0;
		    for(var i=0;i< maintable.rows.length; i++){			 
		        if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
			   	   tablerowindex=i;       //記住是目前table的哪一列			 
				   break;
			    }
		    } 		
		    if(maintable.rows.length>0){     //如果不為空檔
		       var query_no=maintable.rows[tablerowindex].cells[1].innerHTML;
		    }else{
			   var query_no="KAxxxxxxxx";
			}
	        if(document.getElementById('queryno')!=null){			  
	            var currentNo=document.getElementById('queryno').value;	            	 
	            if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號		         
		   	        var thtdy=document.getElementById('recmth').value;
				    discardNoRec('KA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	            } 
	        }
	    }
    }
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   	
    var btns=getElementsByAttribute('class','btn');			 
    for (var i=0;i<btns.length;i++){		
        if (tabs[0].checked){
			if(right(btns[i].title,1)=='M' || right(btns[i].title,1)=='I'){		      
			     btns[i].removeAttribute("accesskey");
			}else{
			    btns[i].setAttribute("accesskey",right(btns[i].title,1));
			}				
		}else{
		   if(right(btns[i].title,1)=='J' || right(btns[i].title,1)=='K' || right(btns[i].title,1)=='T' || right(btns[i].title,1)=='V'){		      
			    btns[i].removeAttribute("accesskey");
			}else{
			    btns[i].setAttribute("accesskey",right(btns[i].title,1));
			}				
		}			
	}		       	
	return true;
}	

function sendFilePrc(updflg){     //新增資料及修改程序       
	var tbjsn=[];
	var nonjsn=[];
	var recordNo=document.getElementById("rcrd_no");
    //----資料寫入資料庫前過濾程序區-----//
	var tabs=getElementsByAttribute('class','tab');		
	var tbno=0;	
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}					 		
    if (tbno==0){
	    var k10elements=document.getElementsByName('k10update');
        var k10athments=document.getElementsByName('k10others');			
	}else{
		 var k10elements=document.getElementsByName('k0hupdate');	
		 var k10athments=document.getElementsByName('k0hothers');			 
	}
	for(var r=0;r<k10athments.length;r++){        //關聯資料
		    nonjsn.push(k10athments[r].tagName.toUpperCase()=='SPAN'?k10athments[r].innerHTML:k10athments[r].value);		
	}
	for(var q=1;q<k10elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(k10elements[q].value);	   
	}
	for(var j=1;j<k10elements.length-1;j++){
		if(tbno==0 && j==3){
			var oDate=new Date(document.getElementById('recmth').value+'-'+k10elements[j].value);
		    var cYear = oDate.getFullYear();
            var cMonth = oDate.getMonth() + 1;
            var cDate = oDate.getDate();
			var iYear=left(document.getElementById('recmth').value,4);
			var iMonth=right(document.getElementById('recmth').value,2);
			var iDate=paddingLeft(k10elements[j].value.trim(),2);
			var result = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
			if(!result){
				filtermsg(k10elements[j],"日期格式不對");
				return false ;
			}else{
	    	    if(k10elements[j].nextSibling){		      
			       k10elements[j].parentNode.removeChild(k10elements[j].nextSibling);
		        }		
	        }
	    }		
        if(k10elements[j].value.trim()=="" && !((j==2 || j==6 ) && tbno==1) && !((j==6 || j==9 ) && tbno==0)){		
		     if (j==1 ){
			    k10elements[j].placeholder="不得空白" ;
			 }else{
				 
		        filtermsg(k10elements[j],"不得空白");
			 }
		     return false ;
        }else{		     
		    if(k10elements[j].nextSibling ){		
                if(!((j==4 && tbno==0) || (j==1 && tbno==1))){		   //非人名與料號移除
			      k10elements[j].parentNode.removeChild(k10elements[j].nextSibling);
			    }			   
		    }
		    if((tbno==1 && (j==3 || j==4)) || (tbno==0 && j==11) ){			
			   if(k10elements[j].value == 0){
			      filtermsg(k10elements[j],"不得為 0");
		          return false ;
			   }
		    }
	    }	    
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 	   
        if(k10elements[1].value!="" ){		 
		    if(tbno==0){ //表頭新增
                var blngmth=document.getElementById('recmth').value;
		        tbjsn.push(blngmth);   //要多一個所屬年月參數
		    }else{   //表身新增
		        
				tbjsn.push(sourceAccount(2,0));  //記住表頭客戶編號 
		    }			   
		    tbjsn.push('0');
		    tbjsn.push('0');	
		    var rspns=TableToJson(tbjsn,nonjsn,tbno);        
	    } 
	    else{
		    blkshow("欄位資料不齊全無法新增權限");
        }		
		 
    }else{    //如果是修改
        if (typeof updflg=="undefined"){
		    updflg=window.event;
        }			
	    var target=getEventTarget(updflg);	
		
		if(tbno==1){   //如果是表身		   
		  // alert(tbjsn[4]);
           tbjsn[4]=k10elements[5].value*1-sourceAccount(5,1)*1;  //傳到後端為新數量減原出貨數之差
		   tbjsn.push(sourceAccount(2,0));  //記住表頭客戶編號 
		}  
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
         var rspns=TableToJson(tbjsn,nonjsn,tbno); 	
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}

function calculateTtl(tbno,maintable,i){      //刪除確認(delConfirm)中挑出之個別程序 
    if (tbno==1){	//計算本單總金額
	    var ttlcnt2=document.getElementById('ttlmny2').innerHTML ;
		var ttlcnt3=document.getElementById('ttlmny3').innerHTML ;
		var crntsum=maintable.rows[i].cells[5].innerHTML;		
        		
		document.getElementById('ttlmny2').innerHTML=ttlcnt2*1-crntsum*1;
		document.getElementById('ttlmny3').innerHTML=ttlcnt3*1+crntsum*1;
		var newbtt=document.getElementById("NEW_BOTT");	
		if(ttlcnt3*1+crntsum*1>0 || getAuth[0]()[1]=='Y'){		    
		    newbtt.setAttribute("style","visibility:visible;");
		    attachEventListener(newbtt,"click",addrec,false);  //新增紀錄按鈕程序 
		}else{
			 newbtt.setAttribute("style","visibility:hidden;"); 			
	        detachEventListener(newbtt,"click",addrec,false);
		}
	}
	return;
}
 function billNoReCreate(currentNo){         //刪除確認(delConfirm)中挑出之個別程序
    if (getCookie('INT_099')=='Y' && getCookie('INT_127')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用			
		var thtdy=document.getElementById('recmth').value;
		discardNoRec('KA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	} 
 return;
 }

function c01CustomName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetCustomNo=getEventTarget(event);		
	var sendSrcRec="filename="+targetCustomNo.value;	    
	var rsp="";  	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	   
	var url="K10/BKND/C01CustomName.php?timestamp="+new Date().getTime();		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200){    
            rsp=JSON.parse(request.responseText);			 
			document.getElementById('customname').value=rsp[0]['customname'];
			document.getElementById('whono').value=rsp[0]['whono']; 
			document.getElementById('whonameEx').innerHTML=rsp[0]['whonameEx']; 			 
		}
	}
	return;
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料			 
         var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='備註:';
	    var oTd = oTr.insertCell(1);      
		oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='k10update' id='remark' class='txt' maxlength='20' style='width:30%;' />";		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='兌現日期:';
	    var oTd = oTr.insertCell(1);   	     	
		oTd.innerHTML="<input type='Date' name='k10update' id='querydate' class='txt' style='width:55%;' maxlength='10'/>";  				    
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='收款金額:';
	    var oTd = oTr.insertCell(3);      
		if(txtword==2){   //如果是修改	
	       oTd.innerHTML="<input type='number' name='k10update' id='curncy' value=1 class='txt' style='background-color:#B9B9FF;width:35%;;text-align:right'  readOnly=true />";
		}else{
		     oTd.innerHTML="<input type='number' name='k10update' id='curncy' value=1 class='txt' style='width:35%;text-align:right;' />";
		}			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='收款方式:';
	    var oTd = oTr.insertCell(1);    		
        var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
	    var slt11=document.createElement("select");
		slt11.setAttribute("id","wayofpay");
		slt11.options.add(new Option('現金','1'));
	    slt11.options.add(new Option('支票','2'));
		slt11.options.add(new Option('銀行存款','3'));
	    slt11.options.add(new Option('銷貨退回','4'));
		slt11.options.add(new Option('銷貨折讓','5'));
	    slt11.options.add(new Option('備抵呆帳-應收帳款','6'));
		slt11.options.add(new Option('兌換損失準備','7'));
	    slt11.options.add(new Option('匯費','8'));
		slt11.options.add(new Option('郵資','9'));
	    slt11.options.add(new Option('其他','10'));
	    slt11.setAttribute("name","k10update");		 
	    oTd.appendChild(slt11);	      	 
		var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='支票/收據號碼:';
	    var oTd = oTr.insertCell(3);   		
		oTd.innerHTML="<input type='text' name='k10update' id='billno' class='txt' style='width:55%;' maxlength='20'    />";  					   		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='沖銷日:';
	    var oTd = oTr.insertCell(1);            		
	    oTd.innerHTML="<input type='text' name='k10update' id='writedate' class='txt' style='width:18%;' maxlength='2'   />";  				  	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='業務擔當:';
	    var oTd = oTr.insertCell(3);               	              
	    oTd.innerHTML="<input type='text' name='k10update' id='whono' class='txt' style='width:40%;' maxlength='8'    />";  				  
	    oTd.innerHTML+="<span name='k10others' id='whonameEx'></span>&nbsp&nbsp";  
	    var srchButton1=document.createElement("input");				   
	    srchButton1.setAttribute("type","button");	
	    srchButton1.setAttribute("class","scopelook");				   
	    srchButton1.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton1,"click",srchshow,false);				
	    oTd.appendChild(srchButton1);					
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶代號:';
   	    var oTd = oTr.insertCell(1);       
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='k10update' id='customno' class='txt' style='background-color:#B9B9FF;width:35%;' maxlength='6' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='k10update' id='customno' class='txt' style='width:35%;' maxlength='6'    />";  				
		    var srchButton3=document.createElement("input");				   
		    srchButton3.setAttribute("type","button");	
		    srchButton3.setAttribute("class","scopelook");				   
		    srchButton3.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton3,"click",srchshow,false);				
		    oTd.appendChild(srchButton3);			
	    }	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶簡稱:';
	    var oTd = oTr.insertCell(3);   
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='k10others' id='customname' class='txt' style='background-color:#B9B9FF;width:40%;' maxlength='8' readOnly=true  />";  					  
	    }else{
	   	   oTd.innerHTML="<input type='text' name='k10others' id='customname' class='txt' style='width:40%;' maxlength='8'    />";  				 
		   var srchButton2=document.createElement("input");				   
		   srchButton2.setAttribute("type","button");	
	 	   srchButton2.setAttribute("class","scopelook");				   
		   srchButton2.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton2,"click",srchshow,false);				
		   oTd.appendChild(srchButton2);			
	    }				  	 			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='沖銷單號:';
	    var oTd = oTr.insertCell(1);		
	    oTd.colspan=3;				  
	    if(txtword==2){   //如果是修改		                
	 	   oTd.innerHTML="<input type='text' name='k10update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />";		  
		}else{
		   oTd.innerHTML="<input type='text' name='k10update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 		  	 
	    }			 	              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);	  
	    oTd.innerHTML="<input type='text' name='k10update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
    }else{               //異動表身資料			  			 		 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='備註說明:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='k0hupdate' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 	     		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='沖銷金額:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='k0hupdate' id='writemoney' value=0 class='txt' style='width:20%;text-align:right;' />";  				 
 	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
   	    oTd.innerHTML='原始金額:';
	    var oTd = oTr.insertCell(1);      
		if(txtword==2){   //如果是修改
		    oTd.innerHTML="<input type='number' name='k0hupdate' id='originmoney' value=1 class='txt' style='background-color:#B9B9FF;width:20%;text-align:right;' readOnly=true/>";  					  
		}else{
    	    oTd.innerHTML="<input type='number' name='k0hupdate' id='originmoney' value=1 class='txt' style='width:20%;text-align:right;' />";  					  
	    }
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='發票日期:';
	    var oTd = oTr.insertCell(1);	
		if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='Date' name='k0hupdate' id='origindate' class='txt' style='background-color:#B9B9FF;width:30%;' readOnly=true/>"; 		
		}else{
	        oTd.innerHTML="<input type='Date' name='k0hupdate' id='origindate' class='txt' style='width:30%;' />"; 				 		
  	    }
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='發票號碼:';
	    var oTd = oTr.insertCell(1);         	   
		if(txtword==2){   //如果是修改		
	        oTd.innerHTML="<input type='text' name='k0hupdate' id='invoiceno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true/>";  				  			 				  
        }else{
			oTd.innerHTML="<input type='text' name='k0hupdate' id='invoiceno' class='txt' style='width:30%;' maxlength='10'/>";  		
		    var srchButton5=document.createElement("input");				   
		    srchButton5.setAttribute("type","button");	
		    srchButton5.setAttribute("class","scopelook");				   
		    srchButton5.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton5,"click",srchshow,false);				
		    oTd.appendChild(srchButton5);			
		}			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='憑證單號:';
	    var oTd = oTr.insertCell(1);     
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='k0hupdate' id='shipbill_no' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='k0hupdate' id='billno' class='txt' style='width:30%;' maxlength='10'    />";
		    var srchButton4=document.createElement("input");				   
		    srchButton4.setAttribute("type","button");	
		    srchButton4.setAttribute("class","scopelook");				   
		    srchButton4.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton4,"click",srchshow,false);				
		    oTd.appendChild(srchButton4);						
	    }  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);                 
	    oTd.innerHTML="<input type='text' name='k0hupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
	}				  			             	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
		dropsheet.style.paddingTop="25px";      // 高度也往上提 
		if(txtword!=7){
		   if (tbno==0){				
			   var sales_no=document.getElementById('whono');		
			   var ship_date=document.getElementById('writedate');		

			}	
		}else{				
		    dropsheet_content.style.width="60%"; 			
		}	 
    return true;
}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
	switch (txtword) {
		case 1:                                   //如果是新增		       
		   var thtdy=document.getElementById('recmth').value;
		   if (tbno==0){		       
			   var nowDate=new Date();				   
			   document.getElementById("writedate").value=paddingLeft(nowDate.getDate(),2);  //
					   //單號為系統自動編號
				 document.getElementById("querydate").value=thtdy+'-'+paddingLeft(nowDate.getDate(),2);  //日期都設為今天	   
				objGetNo('queryno','KA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());				        	 
			  
			     var cstNo=document.getElementById("customno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
		   }else{			    				
				document.getElementById("billno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			  document.getElementById("writedate").focus();				  			 				  
			  var editinit=document.getElementsByName('k10update');
			  
			  document.getElementById('customname').value=notWaitdata[0];
			  document.getElementById('whonameEx').innerHTML=notWaitdata[1];
			    
		   }else{
			  document.getElementById("writemoney").focus();				  			 				  
			  var editinit=document.getElementsByName('k0hupdate');
			  
		   }
		   for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k];
				   
		   }				    			
		   break;	
		case 7:   	   	//搜尋   		   
			  var txtseek=document.getElementById('searchWords');
			  txtseek.focus();
			  attachEventListener(txtseek,'keypress',textKeypress,false);
			 break;   
	}	
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動   
       
	var ttlcnt2=document.getElementById('ttlmny2').innerHTML*1;
	var ttlcnt3=document.getElementById('ttlmny3').innerHTML*1;
	var fldidx=0;
	var argsNo=0;
	while(fldsgsroup(fldidx,tbno)){		
		var oTd = oTr.insertCell(oTr.cells.length); 			
		if(fldsgsroup(fldidx,tbno)[0]=='directdata'){
			oTd.innerHTML=args[argsNo];
			argsNo++;
		}else{		               
			if(tbno==0 && fldidx==2){   //客戶簡稱
			   oTd.innerHTML=nongs[0];				   
			}
			
			 if(tbno==0 && fldidx==5){   //業務名稱
			   oTd.innerHTML=nongs[1];				  
			}
			
			if(fldidx==7 && tbno==0){
				   oTd.innerHTML=whichinvoice(args[4]);  //支付方式
				 
			}
		}
		oTd.setAttribute("class",fldsgsroup(fldidx,tbno)[0]);
		if(fldsgsroup(fldidx,tbno)[1]=='none'){
				oTd.setAttribute("style","display:none;");		
		}else{
			   oTd.style.textAlign=fldsgsroup(fldidx,tbno)[2];				     	
			   oTd.style.width=fldsgsroup(fldidx,tbno)[3]+"%";				  
		}					 		
		fldidx++;
	}				

	 //最後異動
    var oTd = oTr.insertCell(oTr.cells.length);	
    oTd.setAttribute("class","directdata");					   
    oTd.innerHTML=rsp.lastupdate;	
	if (tbno==0){
	   oTr.setAttribute("style","font-weight:bold;color:#704214;");		
       oTd.setAttribute("style","display:none;"); //最後異動要隱藏
	}else{
		document.getElementById('ttlmny2').innerHTML=ttlcnt2+args[4]*1;
		document.getElementById('ttlmny3').innerHTML=ttlcnt3-args[4]*1;
		var newbtt=document.getElementById("NEW_BOTT");	
		if(ttlcnt3-args[4]*1<=0 || getAuth[0]()[1]=='N' ){
		    newbtt.setAttribute("style","visibility:hidden;"); 			
	        detachEventListener(newbtt,"click",addrec,false);
		}else{
		    newbtt.setAttribute("style","visibility:visible;");
		     attachEventListener(newbtt,"click",addrec,false);  //新增紀錄按鈕程序	
		}
	    oTd.setAttribute("style","width:12%;text-align:center;");
	}
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
   var ttlcnt2=document.getElementById('ttlmny2').innerHTML*1;
	var ttlcnt3=document.getElementById('ttlmny3').innerHTML*1;
	if (tbno==0){
	    var maintable=document.getElementById("maintbody1");		
	    var fldidx=3;
		var argsNo=2;
		var nongsNo=0;		   
	}
	else{
	   var maintable=document.getElementById("maintbody2");
	    var fldidx=0;
		var argsNo=0;
		var nongsNo=0;	

	} 
	
		while(fldsgsroup(fldidx,tbno)){			
		    	
			if(fldsgsroup(fldidx,tbno)[0]=='directdata'){					
				  
			   	  
				   if(fldidx==4 && tbno==1){
				       var orderQty=Number(maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML)*1+args[4]*1;						
		               maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=orderQty;	
					   ttlcnt2=ttlcnt2+args[4]*1;
					   ttlcnt3=ttlcnt3-args[4]*1;
					   document.getElementById('ttlmny2').innerHTML= ttlcnt2 ;
					   document.getElementById('ttlmny3').innerHTML= ttlcnt3 ;
					   var newbtt=document.getElementById("NEW_BOTT");	
					   if(ttlcnt3<=0 || getAuth[0]()[1]=='N' ){
					       newbtt.setAttribute("style","visibility:hidden;"); 			
	                       detachEventListener(newbtt,"click",addrec,false);
					   }else{
					       newbtt.setAttribute("style","visibility:visible;");
		                    attachEventListener(newbtt,"click",addrec,false);  //新增紀錄按鈕程序	
					   }
				    }else{
					    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];	
					}						
				   argsNo++;
			}else{				
			    if(fldidx==5 && tbno==0){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[1];	//業務姓名	
					
				}
				if(fldidx==7 && tbno==0){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=whichinvoice(args[4]);  //支付方式				 
				}					
			}		 		
			fldidx++;
		}		
		maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=rsp.lastupdate;
 
}
function transConfirm(oTd){
    //oTd.innerHTML="<input type='text' name='c03update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 		
    return true;
}   
function searchOptionsKey(tbno,slt5){	
    if (tbno==0){
		 
		 slt5.options.add(new Option('沖銷單號','k08.F01'));
		 slt5.options.add(new Option('客戶編號','k08.F06'));
		 slt5.options.add(new Option('客戶簡稱','c01.F05'));		 
		 slt5.options.add(new Option('業務編號','k08.F09'));
		 slt5.options.add(new Option('業務姓名','a01.F03'));
		  slt5.options.add(new Option('支票/收據號','k08.F04')); 		  
		slt5.options.add(new Option('已確認?(Y/N)','k08.F10')); 			
	}else{
		 slt5.options.add(new Option('憑證單號','k0h.F03'));
		 slt5.options.add(new Option('發票號碼','k0h.F02'));
							  
	}
}

function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
	   return "請輸入應收沖銷單表頭資料：";
    }else{
	   return "請輸入應收沖銷單內容資料："; 
    }		
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改應收沖銷單表頭資料："; 
	}else{
		return "修改應收沖銷單內容資料："; 
	}	 
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋應收沖銷單單頭欄位選擇";
	}else{
		return "搜尋應收沖銷單單身欄位選擇";
	}
}

////以下處理回呼資料傳送給開窗選擇頁面
function srcArgobj(srcId){
	if (srcId=='customno' || srcId=='customname'){
		var custno=document.getElementById(srcId).value;		 
		var tttlt='';
	    if(srcId=='customno'){			     
		    var qrystring ="c01.F01"+"|"+custno;
			tttlt="請選取客戶代號";          			
	    }else if(srcId=='customname'){			 
		    var qrystring ="c01.F05"+"|"+custno;			 
			tttlt="請選取客戶簡稱";		
		}
		return {"headtitle":tttlt,"drpshtWidth":"28%","thCntnt":['客戶編號', '客戶簡稱'],
		"thWidth":['50%','50%'],"urlPth":"k10/BKND/C01srch.php","clickfunc":chsecust,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
    }else if(srcId=='whono'){
	   var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取業務人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100%  )"};    
	}else if(srcId=='deptno'){
		var qrystring=document.getElementById(srcId).value;
        return {"headtitle":"請選取出貨部門","drpshtWidth":"28%","thCntnt":['部門編號', '部門名稱'],"thWidth":['50%','50%'],"urlPth":"k10/BKND/A14srch.php","clickfunc":deptchoose,"qryString":qrystring,"mendwidth":"calc( 100% )"};    
	}else if(srcId=='billno' || srcId=='invoiceno'){
		var billNo=document.getElementById(srcId).value;		
		var tttlt='';
	    if(srcId=='billno'){			     	     
			var qrystring ="k25.F15"+"|"+billNo+"|"+sourceAccount(2,0);   
			tttlt="請選取出貨單號";          			
	    }else if(srcId=='invoiceno'){			 		    	
			var qrystring ="k25.F07"+"|"+billNo+"|"+sourceAccount(2,0);   
			tttlt="請選取發票號碼";		
		}
		return {"headtitle":tttlt,"drpshtWidth":"60%","thCntnt":['出貨單號', '發票號碼','發票日期','原始金額','可沖金額'],
		"thWidth":['20%','20%','20%','20%','20%'],"urlPth":"k10/BKND/K25srch.php","clickfunc":bill_no,"qryString":qrystring,"mendwidth":"calc( 100%  )"};
	}
}

function chseprg1(event)  //選擇業務
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var stuffNo=document.getElementById('whono');
	stuffNo.value="";
    var stuffName=document.getElementById('whonameEx');		
    if(stuffName)	 
	    stuffName.innerHTML="";
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stuffNo.value=maintable.rows[i].cells[0].innerHTML;								 
			 stuffName.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			 break;
		  }				 
	}             
	srchblkclose(event);	
	return true;
}	


function chsecust(event)  //選擇客戶
{
		if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	 var custNo=document.getElementById('customno');
	 custNo.value="";
     var custName=document.getElementById('customname');			
	 custName.value="";
	 var rprsntno=document.getElementById('whono');
	 var rprsntname=document.getElementById('whonameEx');

	 var maintable=document.getElementById("stuffTbody");  	 
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			custNo.value=maintable.rows[i].cells[0].innerHTML;								 
			custName.value=maintable.rows[i].cells[1].innerHTML;
			if(rprsntno){
				rprsntno.value=maintable.rows[i].cells[2].innerHTML;
			}
			if(rprsntname){
			   rprsntname.innerHTML=maintable.rows[i].cells[3].innerHTML;
			}
			
			break;
		}					  		   
	}             
	srchblkclose(event);
	return true;
}	

function bill_no(event)  //出貨單號選取
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	 var billNo=document.getElementById('billno');
	 billNo.value="";
     var invoiceNo=document.getElementById('invoiceno');			
	 invoiceNo.value="";	 
	 var incoicedate=document.getElementById('origindate');
	 var originMoney=document.getElementById('originmoney');
	 var writeMoney=document.getElementById('writemoney');
	 var taxkind=document.getElementById('taxtype');	 
	 var maintable=document.getElementById("stuffTbody");  	 
		for(var i=0;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     billNo.value=maintable.rows[i].cells[0].innerHTML;								 
				 invoiceNo.value=maintable.rows[i].cells[1].innerHTML;			
				 if(incoicedate){
				    incoicedate.value=maintable.rows[i].cells[2].innerHTML;
				 }				
				 if(originMoney){
					 originMoney.value=maintable.rows[i].cells[3].innerHTML;
				 }
				 if(writeMoney){
					 var availreduce=sourceAccount(11,0)*1-document.getElementById('ttlmny2').innerHTML*1;
					 writeMoney.value=(maintable.rows[i].cells[4].innerHTML*1>availreduce?availreduce:maintable.rows[i].cells[4].innerHTML*1);
				 }
				
				 break;
			}					  		   
		}             
	srchblkclose(event);	
	return true;
}	