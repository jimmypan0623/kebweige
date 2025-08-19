function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');			
	if (tabs[0].checked){
	   if (target.value=="\u{274E}"  && Cookies.get('INT_127')=='Y'){
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
			  var query_no="BDxxxxxxxx";
			}
	      if(document.getElementById('queryno')!=null){			  
	         var currentNo=document.getElementById('queryno').value;	            	 
	         if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號		         
		   	     var thtdy=document.getElementById('recmth').value;
				 discardNoRec('BD'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	         } 
	      }
	   }
    }
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
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
	    var b05elements=document.getElementsByName('b05update');
        var b05athments=document.getElementsByName('b05others');			
	}else{
		 var b05elements=document.getElementsByName('b0eupdate');	
		 var b05athments=document.getElementsByName('b0eothers');			 
	}
	for(var r=0;r<b05athments.length;r++){        //關聯資料
		    nonjsn.push(b05athments[r].tagName.toUpperCase()=='SPAN'?b05athments[r].innerHTML:b05athments[r].value);		
	}
	for(var q=1;q<b05elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(b05elements[q].value);	   
	}
	for(var j=1;j<b05elements.length-1;j++){
		if(tbno==0 && j==3){
			  let oDate=new Date(document.getElementById('recmth').value+'-'+b05elements[j].value);
		      let cYear = oDate.getFullYear();
              let cMonth = oDate.getMonth() + 1;
              let cDate = oDate.getDate();
			  let iYear=left(document.getElementById('recmth').value,4);
			  let iMonth=right(document.getElementById('recmth').value,2);
			  let iDate=paddingLeft(b05elements[j].value.trim(),2);
			  let result = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
			  if(!result){
				  filtermsg(b05elements[j],"日期格式不對");
				  return false ;
			  }else{
	    	    if(b05elements[j].nextSibling){		      
			       b05elements[j].parentNode.removeChild(b05elements[j].nextSibling);
		        }		
	          }
	    }
		
        if(b05elements[j].value.trim()=="" && !(j==4 && tbno==1) && !(j==7 && tbno==0)){		
		     if (j==1 ){
			    b05elements[j].placeholder="不得空白" ;
			 }else{
		        filtermsg(b05elements[j],"不得空白");
			 }
		     return false ;
        }else{		     
		   if(b05elements[j].nextSibling ){		
               if((j!=4 && tbno!=0 ) && (j!=1 && tbno!=1)){		   //非人名與料號移除
			      b05elements[j].parentNode.removeChild(b05elements[j].nextSibling);
			   }			   
		   }
		   if(tbno==1 && (j==2 || j==3) && b05elements[j].value == 0){			  
			  filtermsg(b05elements[j],"不得為 0");
		      return false ;
		   }else{
	    	    if(b05elements[j].nextSibling){		      
			       b05elements[j].parentNode.removeChild(b05elements[j].nextSibling);
		        }		
	       }	   
	    }	    
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 	   
        if(b05elements[1].value!="" ){		 
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
           tbjsn[2]=b05elements[3].value-sourceAccount(4,1);  //傳到後端為新數量減原出貨數之差
		   tbjsn.push(document.getElementById('keydscrpt').innerHTML);    //記住表頭客戶編號
		}  
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
         var rspns=TableToJson(tbjsn,nonjsn,tbno); 	
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}
//

function calculateTtl(tbno,maintable,i){      //刪除確認(delConfirm)中挑出之個別程序 
    if (tbno==1){	//計算本單總金額
	    var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var crntsum=Number(maintable.rows[i].cells[6].innerHTML);							
		document.getElementById('ttlmny').innerHTML=ttlcnt-crntsum;
	}
	return;
}
 function billNoReCreate(currentNo){         //刪除確認(delConfirm)中挑出之個別程序
    if (Cookies.get('INT_099')=='Y' && Cookies.get('INT_127')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用						      
		var thtdy=document.getElementById('recmth').value;
		discardNoRec('BD'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	} 
 return;
 }
////
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
	    deptshow(event);
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
	var url="B05/C00srch.php?timestamp="+new Date().getTime();        		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendDeleRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {  		     
		   document.getElementById("curncy").value=request.responseText*1;   	              		   
		}
	} 	  	  
}
function rateSrch(event){   //出貨日期異動順便更動匯率
    if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var target=getEventTarget(event);	
	var crtNow=document.getElementById('crntopt').value;
	var ckc=document.getElementById("recmth");
	var rte=document.getElementById('curncy');
    if(Cookies.get('INT_011')!=crtNow){	
	   var sendSrcRec="filename="+crtNow+"|"+ckc.value+"|"+target.value;	
        
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B05/C0ZRateChange.php?timestamp="+new Date().getTime();
			
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
	var url="B05/C01CustomName.php?timestamp="+new Date().getTime();		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200){    
            rsp=JSON.parse(request.responseText);			 
			document.getElementById('customname').value=rsp[0]['customname'];
	        document.getElementById('customfullname').value=rsp[0]['customfullname'];
			document.getElementById('unitno').value=rsp[0]['unitno'];
			document.getElementById('winname').value=rsp[0]['winname'];
			document.getElementById('telNo').value=rsp[0]['telNo']; 
			document.getElementById('whono').value=rsp[0]['whono']; 
			document.getElementById('whonameEx').innerHTML=rsp[0]['whonameEx']; 
			document.getElementById('crntopt').value=rsp[0]['crntopt'];
			document.getElementById('curncy').value=rsp[0]['curncy'];
			document.getElementById('invtype').value=rsp[0]['invtype'];
			document.getElementById('taxtype').value=rsp[0]['taxtype'];
			document.getElementById('howpay').value=rsp[0]['howpay'];
			document.getElementById('dlvrplace').value=rsp[0]['dlvrplace'];
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
	    oTd.innerHTML='出貨指示:';
	    var oTd = oTr.insertCell(1);   
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='b05update' id='shipdirect' class='txt' style='width:35%;' maxlength='40'    />";  				  			 				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='交貨地點:';
	    var oTd = oTr.insertCell(1);     
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='b05update' id='dlvrplace' class='txt' style='width:80%;' maxlength='40'    />";
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
	    slt5.setAttribute("name","b05update");
	    oTd.appendChild(slt5);	                        	
        var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='付款方式:';
	    var oTd = oTr.insertCell(3);   	    
	    oTd.innerHTML="<input type='text' name='b05update' id='howpay' class='txt' style='width:50%;' maxlength='30'    />";  		
		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='發票號碼:';
	    var oTd = oTr.insertCell(1);   
	    
	    oTd.innerHTML="<input type='text' name='b05update' id='invoiceno' class='txt' style='width:50%;' maxlength='10'    />";  				  			 				  
	     var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='發票種類:';
	    var oTd = oTr.insertCell(3);				
	    var slt8=document.createElement("select");
	    slt8.options.add(new Option('三聯式','31'));
	    slt8.options.add(new Option('二聯式','32'));
  	    slt8.setAttribute("id","invtype");
	    slt8.setAttribute("name","b05update");
	    oTd.appendChild(slt8);	  	  

	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='幣別:';
	    var oTd = oTr.insertCell(1);  
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crntopt");
	    slt4.setAttribute("name","b05update");
	    attachEventListener(slt4,"change",ratechange,false);	
	    oTd.appendChild(slt4);						  	  
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='匯率:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b05update' id='curncy' value=1 class='txt' style='width:35%;text-align:right;' />";  						  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='出貨日:';
	    var oTd = oTr.insertCell(1);            		
	    oTd.innerHTML="<input type='text' name='b05update' id='shipdate' class='txt' style='width:18%;' maxlength='2'   />";  				  	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='業務擔當:';
	    var oTd = oTr.insertCell(3);               	              
	    oTd.innerHTML="<input type='text' name='b05update' id='whono' class='txt' style='width:40%;' maxlength='8'    />";  				  
	    oTd.innerHTML+="<span name='b05others' id='whonameEx'></span>&nbsp&nbsp";  
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
	    oTd.innerHTML="<input type='text' name='b05others' id='winname' class='txt' style='width:50%;' maxlength='40'    />";  				
	      var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='電話:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b05others' id='telNo'  class='txt' style='width:35%;' maxlength='8'  />";  				
	   oTr.setAttribute("style","display:none;");   //整列隱藏
		
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶全名:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='b05others' id='customfullname' class='txt' style='width:50%;' maxlength='40'    />";  				
	      var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='統一編號:';
	    var oTd = oTr.insertCell(3);      
	    oTd.innerHTML="<input type='number' name='b05others' id='unitno'  class='txt' style='width:35%;' maxlength='8'  />";  				
	    oTr.setAttribute("style","display:none;");   //整列隱藏
	   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶代號:';
   	    var oTd = oTr.insertCell(1);       
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b05update' id='customno' class='txt' style='background-color:#B9B9FF;width:35%;' maxlength='6' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='b05update' id='customno' class='txt' style='width:35%;' maxlength='6'    />";  				
		    var srchButton3=document.createElement("input");				   
		    srchButton3.setAttribute("type","button");	
		    srchButton3.setAttribute("class","scopelook");				   
		    srchButton3.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton3,"click",custnoshow,false);				
		    oTd.appendChild(srchButton3);			
	    }	   
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶簡稱:';
	    var oTd = oTr.insertCell(3);   
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b05others' id='customname' class='txt' style='background-color:#B9B9FF;width:40%;' maxlength='8' readOnly=true  />";  					  
	    }else{
	   	   oTd.innerHTML="<input type='text' name='b05others' id='customname' class='txt' style='width:40%;' maxlength='8'    />";  				 
		   var srchButton2=document.createElement("input");				   
		   srchButton2.setAttribute("type","button");	
	 	   srchButton2.setAttribute("class","scopelook");				   
		   srchButton2.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton2,"click",custnoshow,false);				
		   oTd.appendChild(srchButton2);			
	    }				  	 			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='出貨單號:';
	    var oTd = oTr.insertCell(1);		
	    oTd.colspan=3;				  
	    if(txtword==2){   //如果是修改		                
	 	   oTd.innerHTML="<input type='text' name='b05update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />"; 					
		   optionitem(aWaitUpdate[5],slt4.id,4,"C01/C00srch.php");		//幣別欄位					 
	         
		}else{
		   oTd.innerHTML="<input type='text' name='b05update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 
		   optionitem(Cookies.get('INT_011'),slt4.id,4,"C01/C00srch.php");			 
	    }			 	              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);	  
	    oTd.innerHTML="<input type='text' name='b05update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
    }else{               //異動表身資料			        
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='客戶PO:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='b0eupdate' id='customPO' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='客戶品號:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='b0eupdate' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='出貨部門:';
	    var oTd = oTr.insertCell(1);               	              
	    oTd.innerHTML="<input type='text' name='b0eupdate' id='deptno' class='txt' style='width:15%;' maxlength='5'    />";  				  
	    oTd.innerHTML+="<span name='b0eothers' id='deptname'></span>&nbsp&nbsp";  
	    var srchButton5=document.createElement("input");				   
	    srchButton5.setAttribute("type","button");	
	    srchButton5.setAttribute("class","scopelook");				   
	    srchButton5.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton5,"click",deptshow,false);				
	    oTd.appendChild(srchButton5);								  		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='單價:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='b0eupdate' id='price' value=0 class='txt' style='width:20%;text-align:right;' />";  				 
 	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
   	    oTd.innerHTML='數量:';
	    var oTd = oTr.insertCell(1);      
	    oTd.innerHTML="<input type='number' name='b0eupdate' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";  					  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='訂單號碼:';
	    var oTd = oTr.insertCell(1);         
	    if(txtword==2){   //如果是修改
	  	   oTd.innerHTML="<input type='text' name='b0eupdate' id='origno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='10' readOnly=true />";  				  
	    }else{
		   oTd.innerHTML="<input type='text' name='b0eupdate' id='origno' class='txt' style='width:30%;' maxlength='10'    />";  				  
	    } 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='品名規格:';
	    var oTd = oTr.insertCell(1);      
	    if(txtword==2){   //如果是修改
		   oTd.innerHTML="<input type='text' name='b05others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	    }else{
		   oTd.innerHTML="<input type='text' name='b0eothers' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
		   var srchButton8=document.createElement("input");				   
		   srchButton8.setAttribute("type","button");	
		   srchButton8.setAttribute("class","scopelook");				   
		   srchButton8.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton8,"click",stocknoshow,false);				
		   oTd.appendChild(srchButton8);			
	    }				  				  			 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='料品編號:';
	    var oTd = oTr.insertCell(1);     
	    if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='b0eupdate' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='b0eupdate' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
		    var srchButton4=document.createElement("input");				   
		    srchButton4.setAttribute("type","button");	
		    srchButton4.setAttribute("class","scopelook");				   
		    srchButton4.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton4,"click",stocknoshow,false);				
		    oTd.appendChild(srchButton4);						
	    }  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);                 
	    oTd.innerHTML="<input type='text' name='b0eupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
	}				  			             	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整  
		dropsheet.style.paddingTop="25px";      // 高度也往上提 
		if(txtword!=7){
		   if (tbno==0){				
			   var sales_no=document.getElementById('whono');		
			   var ship_date=document.getElementById('shipdate');		
			   attachEventListener(sales_no,"focusout",lostfocus1,false);		
			   attachEventListener(ship_date,"focusout",rateSrch,false);		//日期變動若為外幣交易也一併修正匯率
			}else{
				var dept_no=document.getElementById('deptno');			
				 attachEventListener(dept_no,"focusout",lostfocus2,false)
			}	
		}else{
			if (tbno==0){		
		       dropsheet_content.style.width="60%"; 
			}
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
				objGetNo('queryno','BD'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());				        	 
			   //document.getElementById("customno").focus();	
			     var cstNo=document.getElementById("customno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
		   }else{
																
				document.getElementById("stockno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			  document.getElementById("shipdate").focus();				  			 				  
			  var editinit=document.getElementsByName('b05update');
			  document.getElementById('customname').value=notWaitdata[0];
			  document.getElementById('whonameEx').innerHTML=notWaitdata[5];
			    
		   }else{
			   document.getElementById("queryqty").focus();				  			 				  
			  var editinit=document.getElementsByName('b0eupdate');
			  document.getElementById('stockname').value=notWaitdata[0];
			  document.getElementById('deptname').innerHTML=notWaitdata[2];
		   }
		   for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k];
							   
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
    var rnddgt=Cookies.get('INT_069');  //四捨五入到幾位         
    if (tbno==0){     //先整理表頭新增後的資料
	    for(var i=0;i<2;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);
		    oTd.innerHTML=args[i];				
		    oTd.setAttribute("class","directdata");	
		    if(i==0){						  
		  	   oTd.setAttribute("style","width:10%;");		
		    }else{
			   oTd.setAttribute("style","width:7%;");		
		    }
	    }				
	    var oTd = oTr.insertCell(oTr.cells.length);   //客戶名稱
	    oTd.innerHTML=nongs[0];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","width:7%;");			 
        var oTd = oTr.insertCell(oTr.cells.length);   //客戶全名
	    oTd.innerHTML=nongs[1];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","display:none;");	
		var oTd = oTr.insertCell(oTr.cells.length);   //統一編號
	    oTd.innerHTML=nongs[2];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","display:none;");	
		var oTd = oTr.insertCell(oTr.cells.length);   //聯絡人
	    oTd.innerHTML=nongs[3];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","display:none;");	
		var oTd = oTr.insertCell(oTr.cells.length);   //電話
	    oTd.innerHTML=nongs[4];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","display:none;");	
	    var oTd = oTr.insertCell(oTr.cells.length);   //出貨日期 		
		oTd.innerHTML=paddingLeft(args[2].trim(),2);				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","text-align:center;width:4%;");				
	    var oTd = oTr.insertCell(oTr.cells.length);    //業務編號
		oTd.innerHTML=args[3];				
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","display:none;"); //真正的業務編號要隱藏
	    var oTd = oTr.insertCell(oTr.cells.length);     
		oTd.innerHTML=nongs[5];				
		oTd.setAttribute("class","indirectdata");  //業務名稱
		oTd.setAttribute("style","width:7%;");		
		var oTd = oTr.insertCell(oTr.cells.length);   //幣別 
		oTd.innerHTML=args[4];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","text-align:center;width:4%;");
		var oTd = oTr.insertCell(oTr.cells.length);   //匯率 
		oTd.innerHTML=args[5];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","text-align:right;width:7%;");  
		var oTd = oTr.insertCell(oTr.cells.length);   //發票號碼
		oTd.innerHTML=args[6];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","width:10%;");   
		var oTd = oTr.insertCell(oTr.cells.length);   //發票類別代號
		oTd.innerHTML=args[7];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","display:none;");   
		var oTd = oTr.insertCell(oTr.cells.length);   //發票類別名稱
		oTd.innerHTML=whichinvoice(args[7]);				
		oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","width:5%;");     
		var oTd = oTr.insertCell(oTr.cells.length);   //稅別代號
		oTd.innerHTML=args[8];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","display:none;");   
		var oTd = oTr.insertCell(oTr.cells.length);   //稅別
		oTd.innerHTML=whichtax(args[8]);				
		oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","width:4%;");       
		var oTd = oTr.insertCell(oTr.cells.length);   //付款方式
		oTd.innerHTML=args[9];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","width:8%;");      
		var oTd = oTr.insertCell(oTr.cells.length);   //送貨地點
		oTd.innerHTML=args[10];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","text-align:left;");      
		var oTd = oTr.insertCell(oTr.cells.length);   //出貨指示
		oTd.innerHTML=args[11];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","width:8%;");    
		oTr.setAttribute("style","font-weight:bold;color:#704214;");
		 //是否過帳
		var oTd = oTr.insertCell(oTr.cells.length);	
		oTd.setAttribute("class","indirectdata");					   
		oTd.innerHTML=nongs[6];	
		oTd.setAttribute("style","display:none;"); 											
    }else{  //整理表身新增資料	  
	    var oTd = oTr.insertCell(oTr.cells.length);   //料號
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //品名
	    oTd.innerHTML=nongs[0];
		oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","indirectdata");
	    var oTd = oTr.insertCell(oTr.cells.length);   //訂單號碼
	    oTd.innerHTML=args[1];
	    oTd.setAttribute("style","width:10%;text-align:left;");
	    oTd.setAttribute("class","directdata");		
		for(var i=2;i<4;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);   //數量&單價
		    oTd.innerHTML=args[i];
		    oTd.setAttribute("class","directdata");
		    oTd.setAttribute("style","width:8%;text-align:right;");
		}   
		var oTd = oTr.insertCell(oTr.cells.length);   //小計
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		oTd.innerHTML=Math.round((args[2]*args[3]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
		oTd.setAttribute("class","indirectdata");
		oTd.setAttribute("style","width:8%;text-align:right;");
		ttlcnt=ttlcnt+Math.round((args[2]*args[3]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
		document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額
	    var oTd = oTr.insertCell(oTr.cells.length);   //部門代號
	    oTd.innerHTML=args[4];
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //部門名稱
	    oTd.innerHTML=nongs[1];
	    oTd.setAttribute("style","width:8%;");
	    oTd.setAttribute("class","indirectdata");		
	    for(var i=5;i<7;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);
		    oTd.innerHTML=args[i];				
		    oTd.setAttribute("style","text-align:left;");
		    oTd.setAttribute("class","directdata");							   
	    }
	   
    }	
	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);	
    oTd.setAttribute("class","directdata");					   
    oTd.innerHTML=rsp.lastupdate;	
    oTd.setAttribute("style","display:none;"); //最後異動要隱藏
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
    var rnddgt=Cookies.get('INT_069');  //四捨五入到幾位     
    if (tbno==0){
	    var maintable=document.getElementById("maintbody1");					   			            	  
	    maintable.rows[args[arglth-1]].cells[8].innerHTML=paddingLeft(args[2].trim(),2); 	  
	    maintable.rows[args[arglth-1]].cells[9].innerHTML=args[3];					   
	    maintable.rows[args[arglth-1]].cells[10].innerHTML=nongs[5];	//業務姓名			   
	    var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
	    for (var j=11;j<14;j++){
		   maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-7];
	    }					   	  
	    maintable.rows[args[arglth-1]].cells[14].innerHTML=args[7];
	    maintable.rows[args[arglth-1]].cells[15].innerHTML=whichinvoice(args[7]);
	    maintable.rows[args[arglth-1]].cells[16].innerHTML=args[8];
	    maintable.rows[args[arglth-1]].cells[17].innerHTML=whichtax(args[8]);	   	 	    
	    for (var j=18;j<tbrlth-3;j++){       //18~20
		   maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-9];
	    }				      
	    maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動	22	   
	}
	else{
	    var maintable=document.getElementById("maintbody2");					   
		var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML)-Number(maintable.rows[args[arglth-1]].cells[6].innerHTML);
		var orderQty=Number(maintable.rows[args[arglth-1]].cells[4].innerHTML)+args[2];						
		maintable.rows[args[arglth-1]].cells[4].innerHTML=orderQty;						
		maintable.rows[args[arglth-1]].cells[5].innerHTML=args[3];						
		maintable.rows[args[arglth-1]].cells[6].innerHTML=Math.round((orderQty*args[3] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);						   													
		ttlcnt=ttlcnt+Math.round((orderQty*args[3] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					
		document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額						
		maintable.rows[args[arglth-1]].cells[7].innerHTML=args[4];	
		maintable.rows[args[arglth-1]].cells[8].innerHTML=nongs[0];	
		for (var j=9;j<tbrlth-2;j++){		            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-4];                           						
	    }						   
	    maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate;	                    
	}  		
}
function transConfirm(oTd){
    //oTd.innerHTML="<input type='text' name='c03update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 		
    return true;
}   
function searchOptionsKey(tbno,slt5){	
    if (tbno==0){
		 
		 slt5.options.add(new Option('出退單號','b05.F01'));
		 slt5.options.add(new Option('客戶編號','b05.F06'));
		 slt5.options.add(new Option('客戶簡稱','c01.F05'));
		 //slt5.options.add(new Option('出貨日期','b05.F02'));
		 slt5.options.add(new Option('業務編號','b05.F09'));
		 slt5.options.add(new Option('業務姓名','a01.F03'));
		 slt5.options.add(new Option('發票號碼','b05.F20')); 
		slt5.options.add(new Option('已確認?(Y/N)','b05.F10')); 
	
		
	}else{
		 slt5.options.add(new Option('料品編號','b0e.F03'));
		 slt5.options.add(new Option('品名規格','b01.F02'));
		 slt5.options.add(new Option('客戶品號','b0e.F08'));	
		 slt5.options.add(new Option('客戶PO','b0e.F09'));										  
	}
}



function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
	   return "請輸入報價單表頭資料：";
    }else{
	   return "請輸入出貨單內容資料："; 
    }		
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改出貨單表頭資料："; 
	}else{
		return "修改出貨單內容資料："; 
	}	 
}
/* function transRecordHint(tbno){
	if (tbno==0){  //表頭資料	
		return '出貨單號:'+sourceAccount(1,tbno)+",轉正式訂單?";
	}else{
		return '報價單號:'+document.getElementById('fatherkey').value+",轉正式訂單?";
	}  
} */
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋出貨退回單單頭欄位選擇";
	}else{
		return "搜尋出貨退回單單身欄位選擇";
	}
}
