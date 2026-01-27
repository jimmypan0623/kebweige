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
	    if (target.value=="\u{274E}"  && getCookie('INT_127')=='Y'){    
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
			  var query_no="BAxxxxxxxx";
			}
			
	        if(document.getElementById('queryno')!=null){			  
	            var currentNo=document.getElementById('queryno').value;	            	 
	            if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號		         
		   	        var thtdy=document.getElementById('recmth').value;
				    discardNoRec('BA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
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
	    var b02elements=document.getElementsByName('b02update');
        var b02athments=document.getElementsByName('b02others');			
	}else{
		 var b02elements=document.getElementsByName('b0bupdate');	
		 var b02athments=document.getElementsByName('b0bothers');			 
	}
	for(var r=0;r<b02athments.length;r++){        //關聯資料
		    nonjsn.push(b02athments[r].tagName.toUpperCase()=='SPAN'?b02athments[r].innerHTML:b02athments[r].value);		
	}
	for(var q=1;q<b02elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(b02elements[q].value);	   
	}
	for(var j=1;j<b02elements.length-1;j++){
		if(tbno==0 && j==3){
			  let oDate=new Date(document.getElementById('recmth').value+'-'+b02elements[j].value);
		      let cYear = oDate.getFullYear();
              let cMonth = oDate.getMonth() + 1;
              let cDate = oDate.getDate();
			  let iYear=left(document.getElementById('recmth').value,4);
			  let iMonth=right(document.getElementById('recmth').value,2);
			  let iDate=paddingLeft(b02elements[j].value.trim(),2);
			  let result = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
			  if(!result){
				  filtermsg(b02elements[j],"日期格式不對");
				  return false ;
			  }else{
	    	    if(b02elements[j].nextSibling){		      
			       b02elements[j].parentNode.removeChild(b02elements[j].nextSibling);
		        }		
	          }
	    }
		
        if(b02elements[j].value.trim()=="" && !((j==4 || j==6 || j==7)&& tbno==1) && !((j==7 || j==8 || j==9 ) && tbno==0)){		
		     if (j==1 ){
			    b02elements[j].placeholder="不得空白" ;
			 }else{
		        filtermsg(b02elements[j],"不得空白");
			 }
		     return false ;
        }else{		     
		   if(b02elements[j].nextSibling ){		
               if(!((j==4 && tbno==0) || (j==1 && tbno==1))){		   //非人名與料號移除             
			      b02elements[j].parentNode.removeChild(b02elements[j].nextSibling);				  
			   }			   
		   }
		  if((tbno==1 && (j==3 || j==4)) || (tbno==0 && j==6)){
			  if(b02elements[j].value == 0){
			     filtermsg(b02elements[j],"不得為 0");
		         return false ;
			  }
		   } 
	    }	    
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 	   
        if(b02elements[1].value!="" ){		 
		    if(tbno==0){ //表頭新增
                var blngmth=document.getElementById('recmth').value;
		        tbjsn.push(blngmth);   //要多一個所屬年月參數
		    }else{   //表身新增
				 tbjsn.push(sourceAccount(2,0));      //記住表頭廠商編號 
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
           tbjsn[2]=b02elements[3].value-sourceAccount(4,1);  //傳到後端為新數量減原進貨數之差(此作法因理開單未過帳量的處理較快)
		   tbjsn.push(sourceAccount(2,0));    //記住表頭廠商編號
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
	    var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var crntsum=Number(maintable.rows[i].cells[6].innerHTML);							
		document.getElementById('ttlmny').innerHTML=ttlcnt-crntsum;
	}
	return;
}
 function billNoReCreate(currentNo){         //刪除確認(delConfirm)中挑出之個別程序
    if (getCookie('INT_099')=='Y' && getCookie('INT_127')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用			
		var thtdy=document.getElementById('recmth').value;
		discardNoRec('BA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	} 
 return;
 }

function lostfocus1(event){     
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var slsno=sourceAccount(5,0);  //找到目前指向的列數與欄位資料	
	
	if (target.value!=slsno){	       //業務欄位資料變動	
        target.parentNode.childNodes[1].innerHTML="";   //名字清空	
	    srchshow(event);
	}
    return;	
}
function lostfocus2(event){     
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dptno=sourceAccount(7,1);  //找到目前指向的列數與欄位資料	
	
	if (target.value!=dptno){	       //部門欄位資料變動	
        target.parentNode.childNodes[1].innerHTML="";   //名字清空	
	    srchshow(event);
	}
    return;	
}

function ratechange(event){     //匯率更改異動
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	   
	var sendDeleRec="filename="+target.value;				
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
	   var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	        	
	var url="B02/BKND/D00srch.php?timestamp="+new Date().getTime();        		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendDeleRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {  		     
		   document.getElementById("curncy").value=request.responseText*1;   	              		   
		}
	} 	  	  
}
function rateSrch(event){   //進貨日期異動順便更動匯率
    if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var target=getEventTarget(event);	
	var crtNow=document.getElementById('crntopt').value;
	var ckc=document.getElementById("recmth");
	var rte=document.getElementById('curncy');
    if(getCookie('INT_011')!=crtNow){	   
	   var sendSrcRec="filename="+crtNow+"|"+ckc.value+"|"+target.value;	       
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="B02/BKND/D0ZRateChange.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	    function respond(){           
		    if (request.readyState == 4 && request.status == 200) {   
			    rsp=JSON.parse(request.responseText);
				if(rsp[0]['curncy']>0){ 				     
			       rte.value=rsp[0]['curncy']; 
				} 
		    }
	    }		  
    }
   return;
}
function d01VendorName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetVendorNo=getEventTarget(event);		
	var sendSrcRec="filename="+targetVendorNo.value;	    
	var rsp="";  	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	   
	var url="B02/BKND/D01VendorName.php?timestamp="+new Date().getTime();		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200){    
            rsp=JSON.parse(request.responseText);			 
			document.getElementById('vendorname').value=rsp[0]['vendorname'];
	        document.getElementById('vendorfullname').value=rsp[0]['vendorfullname'];
			document.getElementById('unitno').value=rsp[0]['unitno'];
			document.getElementById('winname').value=rsp[0]['winname'];
			document.getElementById('telNo').value=rsp[0]['telNo']; 
			document.getElementById('whono').value=rsp[0]['whono']; 
			document.getElementById('whonameEx').innerHTML=rsp[0]['whonameEx']; 
			document.getElementById('crntopt').value=rsp[0]['crntopt'];
			document.getElementById('curncy').value=rsp[0]['curncy'];			 
			document.getElementById('howpay').value=rsp[0]['howpay'];		 
			document.getElementById('shipdirect').value=rsp[0]['shipdirect'];
		}
	}
	return;
}


function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料			     				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='到貨方式:';
	    var oTd = oTr.insertCell(1);   
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='b02update' id='shipdirect' class='txt' style='width:35%;' maxlength='40'    />";  				  			 				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='廠商送貨單號:';
	    var oTd = oTr.insertCell(1);     
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='b02update' id='dlvbillno' class='txt' style='width:35%;' maxlength='40'    />";
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	   
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='課稅別:';
	    var oTd = oTr.insertCell(1);               	              
	    var slt5=document.createElement("select");
	    slt5.options.add(new Option('應稅','1'));
	    slt5.options.add(new Option('零稅','2'));
	    slt5.options.add(new Option('免稅','3'));
	    slt5.setAttribute("id","taxtype");
	    slt5.setAttribute("name","b02update");
	    oTd.appendChild(slt5);	                        	
        var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='付款方式:';
	    var oTd = oTr.insertCell(3);   	    
	    oTd.innerHTML="<input type='text' name='b02update' id='howpay' class='txt' style='width:50%;' maxlength='30'    />";  		
		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='發票號碼:';
	    var oTd = oTr.insertCell(1);   
	    
	    oTd.innerHTML="<input type='text' name='b02update' id='invoiceno' class='txt' style='width:50%;' maxlength='10'    />";  				  			 				  
	     var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='發票種類:';
	    var oTd = oTr.insertCell(3);				
	    var slt8=document.createElement("select");
	    slt8.options.add(new Option('三聯式','21'));
	    slt8.options.add(new Option('二聯式','22'));
  	    slt8.setAttribute("id","invtype");
	    slt8.setAttribute("name","b02update");
	    oTd.appendChild(slt8);	  	  

	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='幣別:';
	    var oTd = oTr.insertCell(1);  
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crntopt");
	    slt4.setAttribute("name","b02update");
	    attachEventListener(slt4,"change",ratechange,false);	
	    oTd.appendChild(slt4);						  	  
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='匯率:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b02update' id='curncy' value=1 class='txt' style='width:35%;text-align:right;' />";  						  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='進貨日:';
	    var oTd = oTr.insertCell(1);            		
	    oTd.innerHTML="<input type='text' name='b02update' id='shipdate' class='txt' style='width:18%;' maxlength='2'   />";  				  	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='採購人員:';
	    var oTd = oTr.insertCell(3);               	              
	    oTd.innerHTML="<input type='text' name='b02update' id='whono' class='txt' style='width:40%;' maxlength='8'    />";  				  
	    oTd.innerHTML+="<span name='b02others' id='whonameEx'></span>&nbsp&nbsp";  
	    var srchButton1=document.createElement("input");				   
	    srchButton1.setAttribute("type","button");	
	    srchButton1.setAttribute("class","scopelook");				   
	    srchButton1.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton1,"click",srchshow,false);				
	    oTd.appendChild(srchButton1);			
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='聯絡人:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='b02others' id='winname' class='txt' style='width:50%;' maxlength='40'    />";  				
	      var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='電話:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b02others' id='telNo'  class='txt' style='width:35%;' maxlength='8'  />";  				
	   oTr.setAttribute("style","display:none;");   //整列隱藏		
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='廠商全名:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='b02others' id='vendorfullname' class='txt' style='width:50%;' maxlength='40'    />";  				
	      var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='統一編號:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b02others' id='unitno'  class='txt' style='width:35%;' maxlength='8'  />";  				
	    oTr.setAttribute("style","display:none;");   //整列隱藏	   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='廠商代號:';
   	    var oTd = oTr.insertCell(1);       
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b02update' id='vendorno' class='txt' style='background-color:#B9B9FF;width:35%;' maxlength='6' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='b02update' id='vendorno' class='txt' style='width:35%;' maxlength='6'    />";  				
		    var srchButton3=document.createElement("input");				   
		    srchButton3.setAttribute("type","button");	
		    srchButton3.setAttribute("class","scopelook");				   
		    srchButton3.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton3,"click",srchshow,false);				
		    oTd.appendChild(srchButton3);			
	    }	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='廠商簡稱:';
	    var oTd = oTr.insertCell(3);   
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b02others' id='vendorname' class='txt' style='background-color:#B9B9FF;width:40%;' maxlength='8' readOnly=true  />";  					  
	    }else{
	   	   oTd.innerHTML="<input type='text' name='b02others' id='vendorname' class='txt' style='width:40%;' maxlength='8'    />";  				 
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
	    oTd.innerHTML='進貨單號:';
	    var oTd = oTr.insertCell(1);		
	    oTd.colspan=3;				  
	    if(txtword==2){   //如果是修改		                    
	 	   oTd.innerHTML="<input type='text' name='b02update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />"; 					
		   optionitem(aWaitUpdate[5],slt4.id,4,"D01/BKND/D00srch.php");		//幣別欄位					 	         
		}else{
		   oTd.innerHTML="<input type='text' name='b02update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 
		   optionitem(getCookie('INT_011'),slt4.id,4,"D01/BKND/D00srch.php");	 	 
	    }			 	              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);	  
	    oTd.innerHTML="<input type='text' name='b02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
    }else{               //異動表身資料			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='備註:';
	    var oTd = oTr.insertCell(1);		
		 oTd.innerHTML="<input type='text' name='b0bupdate' id='extradsp' class='txt' style='width:50%;' maxlength='20'/>"; 				 	
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='需求用途:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='b0bupdate' id='vendorPO' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='廠商品號:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='b0bupdate' id='vendorpartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='進貨部門:';
	    var oTd = oTr.insertCell(1);               	              
	    oTd.innerHTML="<input type='text' name='b0bupdate' id='deptno' class='txt' style='width:15%;' maxlength='6'    />";  				  
	    oTd.innerHTML+="<span name='b0bothers' id='deptname'></span>&nbsp&nbsp";  
	    var srchButton5=document.createElement("input");				   
	    srchButton5.setAttribute("type","button");	
	    srchButton5.setAttribute("class","scopelook");				   
	    srchButton5.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton5,"click",srchshow,false);				
	    oTd.appendChild(srchButton5);								  		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='單價:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='b0bupdate' id='price' value=0 class='txt' style='width:20%;text-align:right;' />";  				 
 	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
   	    oTd.innerHTML='數量:';
	    var oTd = oTr.insertCell(1);      
	    oTd.innerHTML="<input type='number' name='b0bupdate' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";  					  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='訂單號碼:';
	    var oTd = oTr.insertCell(1);         
	    if(txtword==2){   //如果是修改
	  	   oTd.innerHTML="<input type='text' name='b0bupdate' id='origno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true />";  				  
	    }else{
		   oTd.innerHTML="<input type='text' name='b0bupdate' id='origno' class='txt' style='width:30%;' maxlength='10'    />";  				  
	    } 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='品名規格:';
	    var oTd = oTr.insertCell(1);      
	    if(txtword==2){   //如果是修改
		   oTd.innerHTML="<input type='text' name='b02others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	    }else{
		   oTd.innerHTML="<input type='text' name='b0bothers' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
		   var srchButton8=document.createElement("input");				   
		   srchButton8.setAttribute("type","button");	
		   srchButton8.setAttribute("class","scopelook");				   
		   srchButton8.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton8,"click",srchshow,false);				
		   oTd.appendChild(srchButton8);			
	    }				  				  			 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='料品編號:';
	    var oTd = oTr.insertCell(1);     
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b0bupdate' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='b0bupdate' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	    oTd.innerHTML="<input type='text' name='b0bupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
	}				  			             	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
		dropsheet.style.paddingTop="25px";      // 高度也往上提 
		if(txtword!=7){
		   if (tbno==0){				
			  //  var sales_no=document.getElementById('whono');	 
			   // attachEventListener(sales_no,"focusout",lostfocus1,false);
			   var ship_date=document.getElementById('shipdate');					 		
			   attachEventListener(ship_date,"focusout",rateSrch,false);		//日期變動若為外幣交易也一併修正匯率  
			}else{
				var dept_no=document.getElementById('deptno');			
				 //attachEventListener(dept_no,"focusout",lostfocus2,false)
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
			   document.getElementById("shipdate").value=paddingLeft(nowDate.getDate(),2);  //
					   //單號為系統自動編號
				objGetNo('queryno','BA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());				        	 
			   //document.getElementById("vendorno").focus();	
			     var cstNo=document.getElementById("vendorno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",d01VendorName,false);	//找廠商名稱
		   }else{
																
				document.getElementById("stockno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			  document.getElementById("shipdate").focus();				  			 				  
			  var editinit=document.getElementsByName('b02update');
			  document.getElementById('vendorname').value=notWaitdata[0];
			  document.getElementById('whonameEx').innerHTML=notWaitdata[5];
			    
		   }else{
			   document.getElementById("queryqty").focus();				  			 				  
			  var editinit=document.getElementsByName('b0bupdate');
			  document.getElementById('stockname').value=notWaitdata[0];
			  document.getElementById('deptname').innerHTML=notWaitdata[2];
		   }
		   for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k]			 							   
		   }		
			//alert(document.getElementById('howpay').value.match(/\d+/g)*1);   //				
		   break;	
		case 7:   	   	//搜尋   
		   
			  var txtseek=document.getElementById('searchWords');
			  txtseek.focus();
			  attachEventListener(txtseek,'keypress',textKeypress,false);
			 break;   
	}	
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動   
    var rnddgt=getCookie('INT_068');  //四捨五入到幾位         
	var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var fldidx=0;
		var argsNo=0;
		while(rsp.fldsatrr[fldidx]){
			var oTd = oTr.insertCell(oTr.cells.length); 			
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				oTd.innerHTML=args[argsNo];
				argsNo++;
			}else{		               
			    if(tbno==0 && fldidx==2){   //廠商簡稱
				   oTd.innerHTML=nongs[0];				   
				}
				if(tbno==0 && fldidx==3){   //廠商全稱
				   oTd.innerHTML=nongs[1];				  
				}
				if(tbno==0 && fldidx==4){   //統一編號
				   oTd.innerHTML=nongs[2];				  
				}
				if(tbno==0 && fldidx==5){   //聯絡人
				   oTd.innerHTML=nongs[3];				  
				}
				if(tbno==0 && fldidx==6){   //電話
				   oTd.innerHTML=nongs[4];				  
				}
				 if(tbno==0 && fldidx==9){   //業務名稱
				   oTd.innerHTML=nongs[5];				  
				}
				if(tbno==0 && fldidx==14){   //發票別
				    oTd.innerHTML=whichinvoice(args[7]);	
				}					
				if(tbno==0 && fldidx==16){   //稅別
				    oTd.innerHTML=whichtax(args[8]);
				}				
				if(tbno==0 && fldidx==20){   //確認				 
				   oTd.innerHTML='N';				   
				}				
			    if(tbno==1 && fldidx==1){   //品名
				   oTd.innerHTML=nongs[0];				    
				}
				if(tbno==1 && fldidx==7){   //部門名稱
				   oTd.innerHTML=nongs[1];				   
				}
			    if(tbno==1 && fldidx==5){				   	//小計
				   oTd.innerHTML=Math.round((args[2]*args[3]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);			
				   ttlcnt=ttlcnt+Math.round((args[2]*args[3]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);	
				   document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額					  
				}				
			}
			oTd.setAttribute("class",rsp.fldsatrr[fldidx][0]);
			if(rsp.fldsatrr[fldidx][1]=='none'){
					oTd.setAttribute("style","display:none;");		
			}else{
				   oTd.style.textAlign=rsp.fldsatrr[fldidx][2];				     	
				   oTd.style.width=rsp.fldsatrr[fldidx][3]+"%";				  
			}					 		
			fldidx++;
		}				
	    if (tbno==0){
		    oTr.setAttribute("style","font-weight:bold;color:#704214;");			 
		}

	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);	
    oTd.setAttribute("class","directdata");					   
    oTd.innerHTML=rsp.lastupdate;	
    oTd.setAttribute("style","display:none;"); //最後異動要隱藏
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
    var rnddgt=getCookie('INT_068');  //四捨五入到幾位     
	if (tbno==0){
	    var maintable=document.getElementById("maintbody1");		
	    var fldidx=4;
		var argsNo=2;
		var nongsNo=5;		   
	}
	else{
	   var maintable=document.getElementById("maintbody2");
	    var fldidx=3;
		var argsNo=2;
		var nongsNo=0;	
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML)-Number(maintable.rows[args[arglth-1]].cells[6].innerHTML);					
	} 
		while(rsp.fldsatrr[fldidx]){			
		    	
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				if(fldidx==3 && tbno==1){
				    var orderQty=Number(maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML)*1+args[2]*1;						
		            maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=orderQty;		
				}else{				
			   	   maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];	
				}  
				argsNo++;
			}else{				
			    if(fldidx==9 && tbno==0){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[5];	//業務姓名	
				}
				if(fldidx==14 && tbno==0){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=whichinvoice(args[7]);  //發票類別
				}
				if(fldidx==16 && tbno==0){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=whichtax(args[8]);	     //稅別
				}
		        if(fldidx==5 && tbno==1){   //小計
				    var orderQty=maintable.rows[args[arglth-1]].cells[4].innerHTML*1		  
			         ttlcnt=ttlcnt+Math.round((orderQty*args[3] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);							
		            document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額				 
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=Math.round((orderQty*args[3] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);				 								
				}	
				if(fldidx==7 && tbno==1){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[0];
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
		 
		 slt5.options.add(new Option('進貨單號','b02.F01'));
		 slt5.options.add(new Option('廠商編號','b02.F06'));
		 slt5.options.add(new Option('廠商簡稱','d01.F04'));
		 slt5.options.add(new Option('進貨日期','b02.F02'));
		 slt5.options.add(new Option('採購編號','b02.F09'));
		 slt5.options.add(new Option('採購姓名','a01.F03'));
		 slt5.options.add(new Option('發票號碼','b02.F20')); 
		 slt5.options.add(new Option('已確認?(Y/N)','b02.F10')); 			
	}else{
		 slt5.options.add(new Option('料品編號','b0b.F03'));
		 slt5.options.add(new Option('品名規格','b01.F02'));
		 slt5.options.add(new Option('採購單號','b0b.F07'));
		 slt5.options.add(new Option('廠商品號','b0b.F08'));	
		 slt5.options.add(new Option('需求用途','b0b.F09'));										  
	}
}

function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
	   return "請輸入進貨單表頭資料：";
    }else{
	   return "請輸入進貨單:"+sourceAccount(1,0)+"內容資料："; 
    }		
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改進貨單表頭資料："; 
	}else{
		return "修改進貨單:"+sourceAccount(1,0)+"內容資料："; 
	}	 
}
/* function transRecordHint(tbno){
	if (tbno==0){  //表頭資料	
		return '進貨單號:'+sourceAccount(1,tbno)+",轉INVOICE?";
	}else{
		return '進貨單號:'+document.getElementById('fatherkey1').value+",轉INVOICE?";
	}  
} */
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋進貨單單頭欄位選擇";
	}else{
		return "搜尋進貨單單身欄位選擇";
	}
}
////以下處理回呼資料傳送給開窗選擇頁面
function srcArgobj(srcId){
	if (srcId=='vendorno' || srcId=='vendorname'){
		var custno=document.getElementById(srcId).value;		 
		var tttlt='';
	    if(srcId=='vendorno'){			     
		    var qrystring ="d01.F01"+"|"+custno;
			tttlt="請選取廠商代號";          			
	    }else if(srcId=='vendorname'){			 
		    var qrystring ="d01.F04"+"|"+custno;			 
			tttlt="請選取廠商簡稱";		
		}
		return {"headtitle":tttlt,"drpshtWidth":"28%","thCntnt":['廠商編號', '廠商簡稱'],
		"thWidth":['50%','50%'],"urlPth":"B02/BKND/D01srch.php","clickfunc":chsecust,"qryString":qrystring,"mendwidth":"calc( 100%  )"};
    }else if(srcId=='whono'){
	   var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取採購人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};    
	}else if(srcId=='deptno'){
		var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取進貨部門","drpshtWidth":"28%","thCntnt":['部門編號', '部門名稱'],"thWidth":['50%','50%'],"urlPth":"B02/BKND/A14srch.php","clickfunc":deptchoose,"qryString":qrystring,"mendwidth":"calc( 100% )"};    
	}else{
		var cstno=document.getElementById('keydscrpt1').innerHTML;
		var stockNo=document.getElementById(srcId).value;		 
		var tttlt='';
	    if(srcId=='stockno'){			     
		    var qrystring ="d04.F02"+"|"+stockNo+"_"+cstno;
			tttlt="請選取料號";          			
	    }else if(srcId=='stockname'){			 
		    var qrystring ="b01.F02"+"|"+stockNo+"_"+cstno;			 
			tttlt="請選取品名";		
		}
		return {"headtitle":tttlt,"drpshtWidth":"85%","thCntnt":['料品編號', '品名規格','訂單號碼','預定交期','進貨數量','單價','廠商品號','廠商PO'],
		"thWidth":['16%','15%','12%','10%','10%','10%','15%','12%'],"urlPth":"B02/BKND/B01srch.php","clickfunc":stckchg,"qryString":qrystring,"mendwidth":"calc( 100%  )"};
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

function stckchg(event)  //選擇料號
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var stockNo=document.getElementById('stockno');
	stockNo.value="";
    var stockName=document.getElementById('stockname');			
	stockName.value="";  	
	var orderNo=document.getElementById('origno');
	var shipQty=document.getElementById('queryqty');
	var shipPrice=document.getElementById('price');
	var custstockno=document.getElementById('vendorpartno');
	var custpo=document.getElementById('vendorPO');
	var deptno=document.getElementById('deptno');
	var deptname=document.getElementById('deptname');
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stockNo.value=maintable.rows[i].cells[1].innerHTML;								 
			 stockName.value=maintable.rows[i].cells[2].innerHTML;	
			 if(orderNo){
				orderNo.value=maintable.rows[i].cells[3].innerHTML;
			 }
			 if(shipQty){
				shipQty.value=maintable.rows[i].cells[5].innerHTML;
			 }
			 if(shipPrice){
				shipPrice.value=maintable.rows[i].cells[6].innerHTML;
			 }
			 if(custstockno){
				custstockno.value=maintable.rows[i].cells[7].innerHTML;
			 }  
			 if(custpo){
				custpo.value=maintable.rows[i].cells[8].innerHTML;
			 }   
			 if(deptno){
				deptno.value=maintable.rows[i].cells[9].innerHTML;
			 }  
			 if(deptname){
				deptname.innerHTML=maintable.rows[i].cells[10].innerHTML;
			 }  
			 break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	

function chsecust(event)  //選擇廠商
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	 
	 var custNo=document.getElementById('vendorno');
	 custNo.value="";
     var custName=document.getElementById('vendorname');			
	 custName.value="";
	 var rprsntno=document.getElementById('whono');
	 var rprsntname=document.getElementById('whonameEx');
	 var crnttpe=document.getElementById('crntopt');
	 var contactman=document.getElementById('winman');
 
	 var paymenttp=document.getElementById('howpay');
 
	 var shipdirect=document.getElementById('shipdirect');
	 var crntrate=document.getElementById('curncy');
   
	 var maintable=document.getElementById("stuffTbody");  	 
	 var vendorFullname=document.getElementById('vendorfullname');
	 var vendorUnitno=document.getElementById('unitno');			
	 var vendorTelNo=document.getElementById('telNo'); 
	  
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
			 if(crnttpe){
				crnttpe.value=maintable.rows[i].cells[4].innerHTML;
			 }
			 if(contactman){
				contactman.value=maintable.rows[i].cells[5].innerHTML;
			 }

			 if(paymenttp){
				var tpy=maintable.rows[i].cells[6].innerHTML;
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
					   tpy='現結';
					  break;
				   }	
			
				}	 
				paymenttp.value=tpy+(maintable.rows[i].cells[7].innerHTML==0?'':maintable.rows[i].cells[7].innerHTML+'天');
			 }	
			
			  if(shipdirect){
				 shipdirect.value=maintable.rows[i].cells[8].innerHTML;
			 }
			 if(crntrate){
				 crntrate.value=maintable.rows[i].cells[9].innerHTML;
			 }
             if(vendorFullname){
				 vendorFullname.value=maintable.rows[i].cells[10].innerHTML;
			 }  
			 if(vendorUnitno){
				 vendorUnitno.value=maintable.rows[i].cells[11].innerHTML;
			 }
		     if(vendorTelNo){
				vendorTelNo.value=maintable.rows[i].cells[12].innerHTML;
			 }
			 break;
		}					  		   
	}             
	srchblkclose(event);
	return true;
}	

function deptchoose(event)  //部門編號選擇
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var deptNo=document.getElementById('deptno');
	deptNo.value="";
    var deptName=document.getElementById('deptname');			
	deptName.innerHTML="";
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			deptNo.value=maintable.rows[i].cells[0].innerHTML;								 
			deptName.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	