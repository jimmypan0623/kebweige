function blocksclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
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
	var tbno=0;
	var tabs=getElementsByAttribute('class','tab');	
	  for(var i=0;i<tabs.length;i++){
			  if(tabs[i].checked){
				  tbno=i;
				  break;
			}
	  }			
	var recordNo=document.getElementById("rcrd_no");  
    //----資料寫入資料庫前過濾程序區-----//
	 
	if (tbno==0){
	    var b01elements=document.getElementsByName('b01update');
        var b01athments=document.getElementsByName('b01others');	
		
	}else if (tbno==1){
		 var b01elements=document.getElementsByName('c02update');	
		 var b01athments=document.getElementsByName('c02others');			 
	}else if (tbno==2){
		 var b01elements=document.getElementsByName('d02update');	
		 var b01athments=document.getElementsByName('d02others');			 
	}
	for(var r=0;r<b01athments.length;r++){        //關聯資料
		    nonjsn.push(b01athments[r].tagName.toUpperCase()=='SPAN'?b01athments[r].innerHTML:b01athments[r].value);		
	}
	for(var q=1;q<b01elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(b01elements[q].value);	   
	}

	if (tbno==0){
	    for(var j=1;j<b01elements.length-3;j++){
            if(b01elements[j].value.trim()==="" && !(j==8 || j==11 || j==12 || j==13)){		
		        if(!b01elements[j].nextSibling){
		          var errorSpan1=document.createElement("span");		
			      errorSpan1.style.color="red";
			      errorSpan1.style.fontFamily="標楷體";
		          var errorMessage1=document.createTextNode("不得空白");
		          errorSpan1.appendChild(errorMessage1);
		          errorSpan1.classId="errorMsg";
		          b01elements[j].parentNode.appendChild(errorSpan1);				 
		        }	 
		        b01elements[j].focus();
		        return false ;
            }else{		     
		        if(b01elements[j].nextSibling){		      
			       b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
		        }			
	        }
	    }
	    for(var k=9;k<11;k++){
	        if(b01elements[k].value*1<b01elements[10].value*1 || b01elements[k].value*1<0){
	            if(!b01elements[k].nextSibling){
		          var errorSpan1=document.createElement("span");		
			      errorSpan1.style.color="red";
			      errorSpan1.style.fontFamily="標楷體";
			      if (b01elements[k].value*1<0){
				      var errorMessage1=document.createTextNode("不得小於 0");
		           }else{
				    var errorMessage1=document.createTextNode("小於安全存量");
			      }
		          errorSpan1.appendChild(errorMessage1);
		          errorSpan1.classId="errorMsg";
		          b01elements[k].parentNode.appendChild(errorSpan1);				 
		        }	 
		        b01elements[k].focus();
		       return false ;	
	        }else{
	    	   if(b01elements[k].nextSibling){		      
			     b01elements[k].parentNode.removeChild(b01elements[k].nextSibling);
		        }		
	        }
	    }
	    for(var p=13;p<15;p++){
	        if(p==14 && b01elements[p].value*1<=0 && b01elements[p-1].value.substr(0,1)=='B'){
	            if(!b01elements[p].nextSibling){
		           var errorSpan1=document.createElement("span");		
			       errorSpan1.style.color="red";
			       errorSpan1.style.fontFamily="標楷體";
		           var errorMessage1=document.createTextNode("整批領料須大於0");
		           errorSpan1.appendChild(errorMessage1);
		           errorSpan1.classId="errorMsg";
		           b01elements[p].parentNode.appendChild(errorSpan1);				 
		        }	 
		        b01elements[p].focus();
		       return false ;	
	        }else{
	    	    if(b01elements[p].nextSibling){		      
			       b01elements[p].parentNode.removeChild(b01elements[p].nextSibling);
		        }		
	        }
	    }   
	    for(var m=14;m<19;m++){
	       if(b01elements[m].value*1<0){
	            if(!b01elements[m].nextSibling){
		           var errorSpan1=document.createElement("span");		
			       errorSpan1.style.color="red";
			       errorSpan1.style.fontFamily="標楷體";
		           var errorMessage1=document.createTextNode("不得小於 0");
		           errorSpan1.appendChild(errorMessage1);
		           errorSpan1.classId="errorMsg";
		           b01elements[m].parentNode.appendChild(errorSpan1);				 
		        }	 
		        b01elements[m].focus();
		        return false ;	
	        }else{
	    	     if(b01elements[m].nextSibling){		      
			       b01elements[m].parentNode.removeChild(b01elements[m].nextSibling);
		        }		
	        }
	    }
	}else if (tbno==1){
	     for(var j=1;j<b01elements.length-3;j++){
            if(b01elements[j].value.trim()==="" && !(j==2 || j==3 || j==8 )){		
		        if(!b01elements[j].nextSibling){		      
			       if (j==1 ){
			         b01elements[j].placeholder="不得空白" ;
			       }else{
				      filtermsg(b01elements[j],"不得空白");
				   }
		        }	            
				  
				return false ;
			}else{	     
		        if(b01elements[j].nextSibling){		
				  if(j!=1 ){
			         b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
				  }
		        }			
	        }
			if(b01elements[j].value<=0 && (j==4 || j==5 || j==6 )){
				if(!b01elements[j].nextSibling){
		         
		          filtermsg(b01elements[j],"不得小於等於 0");
		       		 
		        }	 		       
		        return false ;
			}else{
			   if(b01elements[j].nextSibling){		
			      if(j!=1 ){
			         b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
				  }
		        }	
			}
	    }   
	}else if (tbno==2){
	    for(var j=1;j<b01elements.length-3;j++){
            if(b01elements[j].value.trim()=="" && !(j==2 || j==3 || j==8 )){		
		        if(!b01elements[j].nextSibling){		      
				  if (j==1){
					  b01elements[j].placeholder="不得空白" ;
			      }else{					
					 filtermsg(b01elements[j],"不得空白");
				  }		     		 
				  
		        }	        
				return false;
			}else{	     
		        if(b01elements[j].nextSibling){		
				  if(j!=1 ){
			         b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
				  }
		        }			
	        }
			if(b01elements[j].value<=0 && (j==4 || j==5 || j==6 || j==8)){
				if(!b01elements[j].nextSibling){
		         
		          filtermsg(b01elements[j],"不得小於等於 0");
		       		 
		        }	 		       
		        return false ;
			}else{
			   if(b01elements[j].nextSibling){		
			      if(j!=1 ){
			         b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
				  }
		        }	
			}
	    }   
	}
    //--------過濾區結束----------//				
   
    if (updflg==1){     //如果是新增	 
        if(b01elements[1].value!="" ){
          
		   tbjsn.push(0);
		   tbjsn.push(0);
		   if (tbno==0){
		       var selectElement=document.getElementById("dptnoopt");
			   var slicelth=selectElement.value.length;
		       nonjsn[0]=( selectElement.options[selectElement.selectedIndex].text.slice(slicelth));  //取得部門名稱內容
		   }
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
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
		 if (tbno==0){
			 var maintable=document.getElementById("maintbody1");	  	
			  var selectElement=document.getElementById("dptnoopt");
			  var slicelth=selectElement.value.length;
			  nonjsn[0]=(selectElement.options[selectElement.selectedIndex].text.slice(slicelth));			//變更部門名稱		   
		    if(selectElement.value!==maintable.rows[tablerowindex].cells[8].innerHTML){  //如果變更保管部門			      				 
				(b11InvHoldQty(selectElement.value,maintable.rows[tablerowindex].cells[1].innerHTML));				
			}           
		 }
         var rspns=TableToJson(tbjsn,nonjsn,tbno);

   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}
/* */
function calculateTtl(tbno,maintable,i){  //刪除後計算總數量
    if (tbno==1){	//計算本單總金額
	   var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);		  					
		  document.getElementById('ttlmny').innerHTML=ttlcnt-1;
	}else if(tbno==2){
		   var ttlcnt=Number(document.getElementById('ttlmny1').innerHTML);
		   document.getElementById('ttlmny1').innerHTML=ttlcnt-1;
	}

	return;
}
function c20PackQty(fatherkey){	
	var sendSrcRec="filename="+fatherkey;	
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B01/BKND/C20srch.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
		     document.getElementById('basepack').value= rsp[0]['basic_qty'];
	         document.getElementById('minumqty').value= rsp[0]['mini_qty'];   
		  }
	}
	return;
}

function c34CustomPartNo(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetPartNo=getEventTarget(event);	
	
	var sendSrcRec="filename="+document.getElementById('customno').value+"|"+document.getElementById('fatherkey').innerHTML;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B01/BKND/C34srch.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			 targetPartNo.value=rsp[0]['custompartno']?rsp[0]['custompartno']:targetPartNo.value;
	          
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
       
		var url="B01/BKND/C01CustomName.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			 document.getElementById('customname').value=rsp[0]['customname'];			 
	          
		  }
	}
	return;
}

function b11InvHoldQty(dptno,stckno){
	var sendSrcRec="filename="+dptno+"|"+stckno;
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B01/BKND/B11InvHldQty.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
	 
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			document.getElementById('qyt_on_hand').innerHTML=rsp[0]['QtyOnHand'];
	         
		  }
		
	}
	return  ;


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
       
		var url="B01/BKND/D01VendorName.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			 document.getElementById('vendorname').value=rsp[0]['vendorname'];			 
	          
		  }
	}
	return;
}

function d34VendorPartNo(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetPartNo=getEventTarget(event);	
	
	var sendSrcRec="filename="+document.getElementById('vendorno').value+"|"+document.getElementById('fatherkey1').innerHTML;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="B01/BKND/D34srch.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			 targetPartNo.value=rsp[0]['vendorpartno']?rsp[0]['vendorpartno']:targetPartNo.value;
	          
		  }
	}
	return;
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料
        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='產    地:';				
	    var oTd = oTr.insertCell(1);		
		oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='b01update' id='originplace' class='txt' maxlength='20' style='width:30%;'  />";                             	              		   
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='備註說明:';				
	    var oTd = oTr.insertCell(1);				
	    oTd.innerHTML="<input type='text' name='b01update' id='rmkdescription' class='txt' maxlength='40' style='width:90%;'  />";                             	             
		var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='物料類別:';				
	    var oTd = oTr.insertCell(3);				
	    oTd.innerHTML="<input type='text' name='b01update' id='materialtype' class='txt' maxlength='20' style='width:40%;'  />";                             	             
		var oTr=ajTable.insertRow(ajTable,ajTable.length);				
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='標準售價:';				
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='number' name='b01update' id='salescost' class='txt' maxlength='11' value=0.000 style='width:30%;text-align:right;'  />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='平均成本:';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='number' name='b01update' id='averagecost' class='txt' maxlength='11' value=0.000 style='width:30%;text-align:right;'  />"; 
		if(getCookie('auth07')!='Y'){    //如果無權限處理成本欄位則不顯示
			oTr.style.display='none';
		}		                
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='採購前置(天):';				
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='number' name='b01update' id='leadtime' class='txt' title='請輸入採購或生產所需天數' maxlength='20' value=0 style='width:30%;text-align:right'  />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='收發料前置(天):';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='number' name='b01update' id='timeforshipping' class='txt' title='請輸入倉庫收料上架所需天數' maxlength='2' value= 0 style='width:30%;text-align:right'  />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='領料類別:';				
	    var oTd = oTr.insertCell(1);
		var slt5=document.createElement("select");
		slt5.options.add(new Option('A  個別領料','A'));
		slt5.options.add(new Option('B  整批領料','B'));
		slt5.setAttribute("id","tpeaply");
		slt5.setAttribute("name","b01update");
		oTd.appendChild(slt5);	                                    
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='領用批量:';
	    var oTd = oTr.insertCell(3);
		oTd.innerHTML="<input type='number' name='b01update' id='lotqty' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />";                             		
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='料架位置:';				
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='b01update' id='shelf' class='txt' maxlength='20' style='width:60%;'  />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='建立料表:';
	    var oTd = oTr.insertCell(3);
	    var slt8=document.createElement("select");
	    slt8.options.add(new Option('否','N'));
	    slt8.options.add(new Option('是','Y'));
	    slt8.setAttribute("id","billofmaterial");
	    slt8.setAttribute("name","b01update");
	    oTd.appendChild(slt8);	             
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='庫存上限:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='number' name='b01update' id='maxlimit' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='安全存量:';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='number' name='b01update' id='minlimit' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />"; 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='採/計單位比:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='number' name='b01update' id='rateofps' class='txt' maxlength='5' value=1.000 style='width:30%;text-align:right;'/>";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='保管部門:';
	    var oTd = oTr.insertCell(3);
	    var slt3=document.createElement("select");
	    slt3.setAttribute("id","dptnoopt");
  	    slt3.setAttribute("name","b01update");
	    slt3.setAttribute("style","width:60%;");
	    oTd.appendChild(slt3);			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='採購單位:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='b01update' id='purchseach' class='txt' maxlength='4' value='PCS' style='width:30%;text-align:left;'  />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='計料單位:';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='text' name='b01update' id='stockeach' class='txt' maxlength='4' value='PCS' style='width:30%;text-align:left;' />";    
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='管理類別:';
	    var oTd = oTr.insertCell(1);
	    var slt9=document.createElement("select");
	    slt9.options.add(new Option('A','A'));
	    slt9.options.add(new Option('B','B'));
	    slt9.options.add(new Option('C','C'));
	    slt9.options.add(new Option('X','X'));
	    slt9.setAttribute("id","mngtpe");
	    slt9.setAttribute("name","b01update");
	    oTd.appendChild(slt9);	                                        
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='歸屬類別:';
	    var oTd = oTr.insertCell(3);
	    var slt10=document.createElement("select");
	    slt10.setAttribute("style","width:40%;");
	    slt10.options.add(new Option('外購原料','YNN'));
	    slt10.options.add(new Option('買賣商品','YNY'));
	    slt10.options.add(new Option('自產銷售','NYY'));
	    slt10.options.add(new Option('在製組件','NYN'));
	    slt10.options.add(new Option('虛擬料號','NNN'));
	    slt10.options.add(new Option('無須定義','YYY'));
	    slt10.setAttribute("id","belongto");
	    slt10.setAttribute("name","b01update");
	    oTd.appendChild(slt10);			  					
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	   var oTd = oTr.insertCell(0);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='料品編號:';
	   var oTd = oTr.insertCell(1);
	   if(txtword==2){   //如果是修改		                
		  oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' style='background-color:#B9B9FF;width:90%;' maxlength='43' readOnly=true  />"; 
		  optionitem(aWaitUpdate[8],slt3.id,6,"B01/BKND/A14srch.php");	
 
	   }else{
		oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' style='width:90%;' maxlength='43' />"; 
		optionitem(getCookie("INT_193"),slt3.id,6,"B01/BKND/A14srch.php");	
		 
	   }			 
	   var oTd = oTr.insertCell(2);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='品名規格:';
	   var oTd = oTr.insertCell(3);
	   oTd.innerHTML="<input type='text' name='b01update' id='stockname' class='txt' maxlength='40' style='width:90%;'  />";  
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	   var oTd = oTr.insertCell(0);	             
	   oTd.innerHTML='紀錄號碼';
	   var oTd = oTr.insertCell(1);
	   oTd.colspan=3;
	   oTd.innerHTML="<input type='text' name='b01update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	   oTr.setAttribute("style","display:none;");	
	}else if(tbno==1){
	  //表身報價紀錄
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	   var oTd = oTr.insertCell(0);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='備註說明:';
	   var oTd = oTr.insertCell(1);
	   oTd.colspan=3;
	   oTd.innerHTML="<input type='text' name='c02update' class='txt' id='remak'  style='width:45%;'  />"; 
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='生效日期:';
	   var oTd = oTr.insertCell(1);
	   oTd.innerHTML="<input type='date' name='c02update' class='txt' id='c02validstart'  style='width:40%;'  />";
	   var oTd = oTr.insertCell(2);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='有效期限:';
	   var oTd = oTr.insertCell(3);
	   oTd.innerHTML="<input type='date' name='c02update' class='txt' id='c02validend'  style='width:40%;'  />"; 
		   
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='付款方式:';
	   var oTd = oTr.insertCell(1);				 
	   oTd.innerHTML="<input type='text' name='c02update' class='txt' id='howpay'  style='width:50%;'  />";  	
	   var oTd = oTr.insertCell(2);
	   oTd.setAttribute('style','text-align:right;width:15%');	
	   oTd.innerHTML='報價單號:';
	   var oTd = oTr.insertCell(3);				 
	   oTd.innerHTML="<input type='text' name='c02update' class='txt' id='queryno'  style='width:35%;'  />";  	
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	   var oTd = oTr.insertCell(0);	   
	   oTd.setAttribute('style','text-align:right;width:15%');					
	   oTd.innerHTML='包裝基量:';
	   var oTd = oTr.insertCell(1);               
	   oTd.innerHTML="<input type='number' name='c02update' id='basepack' value=1 class='txt' style='width:30%;text-align:right;' />";  				 
	   var oTd = oTr.insertCell(2);	   
	   oTd.setAttribute('style','text-align:right;width:15%');					
	   oTd.innerHTML='最少採購:';
	   var oTd = oTr.insertCell(3);               
	   oTd.innerHTML="<input type='number' name='c02update' id='minumqty' value=1 class='txt' style='width:30%;text-align:right;'     />";  				 				  
	   if(txtword==1){
		  c20PackQty(document.getElementById('fatherkey').innerHTML);
	   }
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='幣別:';
	    var oTd = oTr.insertCell(1);        
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crntopt");
	    slt4.setAttribute("name","c02update");
	    oTd.appendChild(slt4);	
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='單價:';
	    var oTd = oTr.insertCell(3);               
	    oTd.innerHTML="<input type='number' name='c02update' value=0 class='txt' style='width:30%;text-align:right;' />";  				 	 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='客戶品號:';
	    var oTd = oTr.insertCell(1);		         
		oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='c02update' id='custompartno' class='txt' style='width:30%;' maxlength='30'/>"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='客戶編號:';
		var oTd = oTr.insertCell(1);     
		if(txtword==2){   //如果是修改	
		  oTd.innerHTML="<input type='text' name='c02update' id='customno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='6' readOnly=true  />";  				              
	    }else{
		   oTd.innerHTML="<input type='text' name='c02update' id='customno'  class='txt' style='width:30%;' maxlength='6'    />";
		   var srchButton4=document.createElement("input");				   
		   srchButton4.setAttribute("type","button");	
		   srchButton4.setAttribute("class","scopelook");				   
		   srchButton4.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton4,"click",custnoshow,false);				
		   oTd.appendChild(srchButton4);						
		}  
		var oTd = oTr.insertCell(2);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='客戶簡稱:';
		var oTd = oTr.insertCell(3);      
		if(txtword==2){   //如果是修改		 
			oTd.innerHTML="<input type='text' name='c02others' id='customname' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='8' readOnly=true />"; 		  
			optionitem(aWaitUpdate[3],slt4.id,4,"C01/BKND/C00srch.php");	   	   
		}else{
		   oTd.innerHTML="<input type='text' name='c02others' id='customname' class='txt' style='width:30%;' maxlength='8'    />";  				 					  
		   optionitem(getCookie('INT_011'),slt4.id,4,"C01/BKND/C00srch.php");				//參數預設幣別
		   var srchButton8=document.createElement("input");				   
		   srchButton8.setAttribute("type","button");	
		   srchButton8.setAttribute("class","scopelook");				   
		   srchButton8.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton8,"click",custnoshow,false);				
		   oTd.appendChild(srchButton8);								 
		}				  				  			 	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		var oTd = oTr.insertCell(0);	             
		oTd.innerHTML='紀錄號碼';
		var oTd = oTr.insertCell(1);   
		oTd.colspan=3;
		oTd.innerHTML="<input type='text' name='c02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");					
	}else if(tbno==2){  //表身詢價紀錄
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='備註說明:';
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='d02update' class='txt' id='othernotes'  style='width:45%;'  />"; 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='生效日期:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='date' name='d02update' class='txt' id='d02validstart'  style='width:40%;'  />";
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='有效期限:';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='date' name='d02update' class='txt' id='d02validend'  style='width:40%;'  />"; 				       
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='付款方式:';
	    var oTd = oTr.insertCell(1);				 
	    oTd.innerHTML="<input type='text' name='d02update' class='txt' id='payment'  style='width:50%;'  />";  	
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='前置天數:';
	    var oTd = oTr.insertCell(3);				 
	    oTd.innerHTML="<input type='number' name='d02update' class='txt' id='ltdays'  style='width:35%;text-align:right;' />";  	
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='包裝基量:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='d02update' id='basepack' value=1 class='txt' style='width:30%;text-align:right;' />";  				 
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='最少採購:';
	    var oTd = oTr.insertCell(3);               
	    oTd.innerHTML="<input type='number' name='d02update' id='minumqty' value=1 class='txt' style='width:30%;text-align:right;'     />";  				 				  
	    if(txtword==1){
	 	  c20PackQty(document.getElementById('fatherkey').innerHTML);
	    }
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='幣別:';
	    var oTd = oTr.insertCell(1);        
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crcyopt");
	    slt4.setAttribute("name","d02update");
	    oTd.appendChild(slt4);	
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='單價:';
	    var oTd = oTr.insertCell(3);               
	    oTd.innerHTML="<input type='number' name='d02update' value=0 class='txt' style='width:30%;text-align:right;' />";  				 				 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='廠商品號:';
	    var oTd = oTr.insertCell(1);		         
		oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='d02update' id='vendorpartno' class='txt' style='width:30%;' maxlength='30'/>"; 				 		 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='廠商編號:';
		var oTd = oTr.insertCell(1);     
		if(txtword==2){   //如果是修改	
		   oTd.innerHTML="<input type='text' name='d02update' id='vendorno' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='6' readOnly=true  />";  				              
	    }else{
		   oTd.innerHTML="<input type='text' name='d02update' id='vendorno'  class='txt' style='width:30%;' maxlength='6'    />";
		   var srchButton4=document.createElement("input");				   
		   srchButton4.setAttribute("type","button");	
		   srchButton4.setAttribute("class","scopelook");				   
		   srchButton4.style.background="url('digits/brows1.png')";   
		   attachEventListener(srchButton4,"click",vendornoshow,false);				
		   oTd.appendChild(srchButton4);						
		}  
		var oTd = oTr.insertCell(2);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='廠商簡稱:';
		var oTd = oTr.insertCell(3);      
		if(txtword==2){   //如果是修改
			oTd.innerHTML="<input type='text' name='d02others' id='vendorname' class='txt' style='background-color:#B9B9FF;width:30%;' maxlength='8' readOnly=true />";  				 				     					  
			optionitem(aWaitUpdate[3],slt4.id,4,"D01/BKND/D00srch.php");				   				   
		}else{
		    oTd.innerHTML="<input type='text' name='d02others' id='vendorname' class='txt' style='width:30%;' maxlength='8'    />";  				 				    					  
		    optionitem(getCookie('INT_011'),slt4.id,4,"D01/BKND/D00srch.php");				//參數預設幣別
		    var srchButton8=document.createElement("input");				   
		    srchButton8.setAttribute("type","button");	
		    srchButton8.setAttribute("class","scopelook");				   
		    srchButton8.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton8,"click",vendornoshow,false);				
		    oTd.appendChild(srchButton8);								 
		}				  				  			 	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		var oTd = oTr.insertCell(0);	             
		oTd.innerHTML='紀錄號碼';
		var oTd = oTr.insertCell(1);   
		oTd.colspan=3;
		oTd.innerHTML="<input type='text' name='d02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");			
	}	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	if(txtword==7){
		dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    }else if(txtword==101){
		dropsheet_content.style.width="70%";   //原訊息內框畫面寬度調整
	}else{
	    dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
	}
    dropsheet.style.paddingTop="20px";      // 高度也往上提 		
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:             				//如果是新增
			 var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
			 var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
			 if (tbno==0){
				document.getElementById("stockno").focus();	
				
			 }else if (tbno==1){						 
				document.getElementById("c02validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
				var today=new Date();
				var endday=today.addDays(parseInt(getCookie('INT_126'))); //加上參數預設有效天數
				var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
				document.getElementById("c02validend").value=endaydash;  //日期往後推
				var cstNo=document.getElementById("customno");
				cstNo.focus();	
				 attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
				 var cstPtNo=document.getElementById('custompartno');
				attachEventListener(cstPtNo,"focus",c34CustomPartNo,false);	//找客戶品號
			 }else if (tbno==2){						 						 
				 document.getElementById("d02validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
				var today=new Date();
				var endday=today.addDays(parseInt(getCookie('INT_126'))); //加上參數預設有效天數
				var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
				document.getElementById("d02validend").value=endaydash;  //日期往後推
				var vndNo=document.getElementById("vendorno");
				vndNo.focus();	
				 attachEventListener(vndNo,"change",d01VendorName,false);	//找廠商名稱
				 var vndPtNo=document.getElementById('vendorpartno');
				 attachEventListener(vndPtNo,"focus",d34VendorPartNo,false);	//找廠商品號
				 document.getElementById('ltdays').value=parseInt(document.getElementById('leadtm_prchs').textContent);
			 }
		     break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
			if (tbno==0){
			   document.getElementById("stockname").focus();
			   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
			   document.getElementById('stockname').innerHTML=aWaitUpdate[2];
			   document.getElementById("dptnoopt").value= aWaitUpdate[8];       //部門代號	
			   var editinit=document.getElementsByName('b01update');
			   for(var k=0;k<8;k++){
				  editinit[k].value=aWaitUpdate[k];
			   }	
			}else if (tbno==1){
				 document.getElementById("custompartno").focus();				  			 				  
				 var editinit=document.getElementsByName('c02update');
				 document.getElementById('customname').value=notWaitdata[0];
			}else if (tbno==2){
				  document.getElementById("vendorpartno").focus();				  			 				  
				 var editinit=document.getElementsByName('d02update');
				 document.getElementById('vendorname').value=notWaitdata[0];
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
    if (tbno==0){     //先整理表頭新增後的資料				       
	    var oTd = oTr.insertCell(oTr.cells.length);
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;width:50%;");
	    oTd.setAttribute("class","directdata");
	    var oTd = oTr.insertCell(oTr.cells.length);				  
	    oTd.innerHTML=args[1];				  
	    oTd.setAttribute("style","text-align:left;width:40%;"); 
	    oTd.setAttribute("class","directdata");
	    for(var i=2;i<8;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);
		    oTd.innerHTML=args[i];
		    oTd.setAttribute("style","display:none;");
		    oTd.setAttribute("class","directdata");
	    }					 
	    var oTd = oTr.insertCell(oTr.cells.length);					
	    oTd.innerHTML=nongs[0];
	    oTd.setAttribute("class","indirectdata");
	    oTd.setAttribute("style","display:none;");
	    //以下兩欄為總庫存數量與在庫量由於是新增料號所以庫存一定都是0
	    var oTd = oTr.insertCell(oTr.cells.length);
	    oTd.innerHTML=0;
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","indirectdata");
	    var oTd = oTr.insertCell(oTr.cells.length);
	    oTd.innerHTML=0;
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","indirectdata");
	  //******************************************//
	    for(var i=8;i<args.length-2;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);
		    oTd.innerHTML=args[i];
		    oTd.setAttribute("style","display:none;");
		    oTd.setAttribute("class","directdata");
	    }
    }else if (tbno==1){   //處理表身新增資料  
	    var oTd = oTr.insertCell(oTr.cells.length);   //客戶編號
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;width:7%;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //客戶簡稱
	    oTd.innerHTML=nongs[0];
		oTd.setAttribute("style","text-align:left;width:7%");
	    oTd.setAttribute("class","indirectdata");
		var oTd = oTr.insertCell(oTr.cells.length);   //客戶品號
	    oTd.innerHTML=args[1];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //幣別
	    oTd.innerHTML=args[2];
	    oTd.setAttribute("style","width:4%;");
	    oTd.setAttribute("class","directdata");	
	    var oTd = oTr.insertCell(oTr.cells.length);   //單價
	    oTd.innerHTML=args[3];
	    oTd.setAttribute("style","width:8%;text-align:right;");
	    oTd.setAttribute("class","directdata");	
		for(var i=4;i<6;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //包裝基量&最少訂購 
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		   oTd.setAttribute("style","width:7%;text-align:right;");
		}   
		var oTd = oTr.insertCell(oTr.cells.length);   //付款方式
		oTd.innerHTML=args[6];					  
		oTd.setAttribute("class","directdata");	 
		oTd.setAttribute("style","text-align:left;");
		var oTd = oTr.insertCell(oTr.cells.length);   //報價單號
		oTd.innerHTML=args[7];
		oTd.setAttribute("style","width:10%;text-align:left;");
		oTd.setAttribute("class","directdata");	 
		for(var i=8;i<10;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //生效日與期限  
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		   //oTd.setAttribute("style","width:8%;");
		}    
		var oTd = oTr.insertCell(oTr.cells.length);   //備註
		oTd.innerHTML=args[10];
		oTd.setAttribute("style","width:10%;text-align:left;");
		oTd.setAttribute("class","directdata");	 
	    var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);					        			   										
	    document.getElementById('ttlmny').innerHTML=ttlcnt+1;  //更新畫面上的總金額
    }else if (tbno==2){   //處理表身新增資料(詢價)					  
	    var oTd = oTr.insertCell(oTr.cells.length);   //廠商編號
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;width:7%;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //廠商簡稱
	    oTd.innerHTML=nongs[0];
		oTd.setAttribute("style","text-align:left;width:7%");
	    oTd.setAttribute("class","indirectdata");
		var oTd = oTr.insertCell(oTr.cells.length);   //廠商品號
	    oTd.innerHTML=args[1];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //幣別
	    oTd.innerHTML=args[2];
	    oTd.setAttribute("style","width:4%;");
	    oTd.setAttribute("class","directdata");	
	    var oTd = oTr.insertCell(oTr.cells.length);   //單價
	    oTd.innerHTML=args[3];
	    oTd.setAttribute("style","width:8%;text-align:right;");
	    oTd.setAttribute("class","directdata");	
		for(var i=4;i<6;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //包裝基量&最少訂購 
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		   oTd.setAttribute("style","width:7%;text-align:right;");
		}   
		var oTd = oTr.insertCell(oTr.cells.length);   //付款方式
		oTd.innerHTML=args[6];					  
		oTd.setAttribute("class","directdata");	 
		 oTd.setAttribute("style","text-align:left;");
		var oTd = oTr.insertCell(oTr.cells.length);   //前置時間
		oTd.innerHTML=args[7];
		oTd.setAttribute("style","width:7%;text-align:right;");
		oTd.setAttribute("class","directdata");	 
		for(var i=8;i<10;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //生效日與期限  
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		  // oTd.setAttribute("style","width:8%;");
		}    
		var oTd = oTr.insertCell(oTr.cells.length);   //備註
		oTd.innerHTML=args[10];
		oTd.setAttribute("style","width:10%;text-align:left;");
		oTd.setAttribute("class","directdata");	 
	   var ttlcnt=Number(document.getElementById('ttlmny1').innerHTML);					        			   										
	   document.getElementById('ttlmny1').innerHTML=ttlcnt+1;  //更新畫面上的總金額
  }				  
	 //最後異動	
  var oTd = oTr.insertCell(oTr.cells.length);	
  oTd.setAttribute("class","directdata");					   
  oTd.innerHTML=rsp.lastupdate;	
  oTd.setAttribute("style","display:none;"); //最後異動要隱藏
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	if (tbno==0){  				   
		var b01a_value_names=document.getElementsByName("b01value");		             
		var maintable=document.getElementById("maintbody1");	               
		for (var j=2;j<9;j++){				        
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];
			b01a_value_names[j-1].innerHTML=args[j-1];
		}							
		maintable.rows[args[arglth-1]].cells[9].innerHTML=nongs[0];		
		b01a_value_names[8].innerHTML=nongs[0];		 
		b01a_value_names[3].innerHTML=belongtoshow(b01a_value_names[3].innerHTML);  //歸屬類別		 
		maintable.rows[args[arglth-1]].cells[11].innerHTML=b01a_value_names[10].innerHTML;   //變更部門後的在庫數量
		for(j=8;j<arglth-1;j++){
			maintable.rows[args[arglth-1]].cells[j+4].innerHTML=args[j];
			b01a_value_names[j+3].innerHTML=args[j]; //中間跳過總庫存數量與在庫數量兩欄
		}			
		//14~18資料導入後的修正顯示					
		b01a_value_names[14].innerHTML=(b01a_value_names[14].innerHTML=='Y'?'是':'否') ; //是否建BOM
		b01a_value_names[15].innerHTML=(b01a_value_names[15].innerHTML=='A'?'A 個別領料':'B 整批領料') ; //領料方式					
		b01a_value_names[17].innerHTML+="天" ; //採購/生產前置天數
		b01a_value_names[18].innerHTML+="天" ; //倉庫收料發料前置天數			        
		/***********************************************************/
		maintable.rows[args[arglth-1]].cells[b01a_value_names.length].innerHTML=rsp.lastupdate;
		b01a_value_names[b01a_value_names.length-1].innerHTML=rsp.lastupdate;  //安全資料(最後異動)
		//以下檢查庫存上下限與總庫存量比較結果看是否應該文字變色或還原						
		if(b01a_value_names[9].innerHTML*1>b01a_value_names[11].innerHTML*1 && b01a_value_names[11].innerHTML*1>0){
		maintable.rows[args[arglth-1]].setAttribute("style","font-weight:bold;color:#E60000;background-color:#B9B9FF;");
		}else if(b01a_value_names[9].innerHTML*1<b01a_value_names[12].innerHTML*1){
		  maintable.rows[args[arglth-1]].setAttribute("style","font-weight:bold;color:#704214;background-color:#B9B9FF;");
		}else{
			maintable.rows[args[arglth-1]].setAttribute("style","font-weight:Normal;color:#000;background-color:#B9B9FF;");
		}
	}else {    //第二頁與第三頁修改	   
	    if (tbno==1){
		  var maintable=document.getElementById("maintbody2");	
	    }else{
			var maintable=document.getElementById("maintbody3");	
	    }	  
	    var tbrlth=maintable.rows[args[arglth-1]].cells.length;			 
		for (var j=3;j<tbrlth-2;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];						 
	    }					    					   
	    maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate;   
    }
}

function searchOptionsKey(tbno,slt5){	
	if (tbno==0){      //表頭資料
		slt5.options.add(new Option('料品編號','b01.F01'));
	    slt5.options.add(new Option('品名規格','b01.F02'));
		slt5.options.add(new Option('部門編號','b01.F07'));
		slt5.options.add(new Option('部門名稱','a14.F02'));
		slt5.options.add(new Option('物料類別','b01.F42'));
		slt5.options.add(new Option('產    地','b01.F49'));				     				     
	} else if(tbno==1){
		slt5.options.add(new Option('客戶編號','c02.F01'));
		slt5.options.add(new Option('客戶簡稱','c01.F05'));
		slt5.options.add(new Option('客戶品號','c02.F04'));		   				      		 					  
	} else if(tbno==2){
		slt5.options.add(new Option('廠商編號','d02.F01'));
		slt5.options.add(new Option('廠商簡稱','d01.F04'));
		slt5.options.add(new Option('廠商品號','d02.F04'));	
	}
}

function page1Detail01(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";
	ajTable.className="gridlist";                 	 		
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	 }
	 request.onreadystatechange = respond;   
	 var url="B01/BKND/B11srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		 			    
	 var queryString ="filename="+document.getElementById("stock_no").innerHTML;
	  
	 request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 srchStockNo(rsp,ajTable);		  
		}	  
	 }
	 
}
function srchStockNo(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     
	for(var i=0;i<arr.length;i++){				 
        var oTr=ajTable.insertRow(ajTable,ajTable.length);		
		cnt++;         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];    		    		 
		    if(jk=='dpt_no'){
			     oTd.setAttribute("style","text-align:center;width:18%;");
		    }else if(jk=='dpt_name'){			 
		        oTd.setAttribute("style","text-align:center;");
		    }else if(jk=='stock_qty'){		  
		        oTd.setAttribute("style","text-align:right;");
		    }else if(jk=='last_update'){		  
		        oTd.setAttribute("style","text-align:center;");
		    }else if (jk=='apply'){		  
		        oTd.setAttribute("style","text-align:left;"); 														  		
		    }else if(jk=='diffdate'){
				oTd.setAttribute("style","display:none;");
			}				
	    }	
        if(arr[i]['diffdate']>210){  //最後異動日期距今超過210天紅字
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");
		}else if(arr[i]['diffdate']>90){//最後異動日期距今超過90天低於210天棕色字
			oTr.setAttribute("style","font-weight:bold;color:#704214;");
		}
	}	
    var array = ['部門編號', '部門名稱','庫存數量','最後異動','預計用途'];
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		
		var text = document.createTextNode(array[j]); //cell
        if(j==0){
		   th.style.width='18%';
		}			
		th.appendChild(text);
		oTr.appendChild(th);
	}				
}

function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料	
        return "請輸入新料號基本資料：";	
    }else if(tbno==1){
		return "請輸入"+document.getElementById('fatherkey').innerHTML+"新的報價資料：";	
	}else if(tbno==2){
		return "請輸入"+document.getElementById('fatherkey1').innerHTML+"新的詢價資料：";	
	} 
}

function editRecordHint(tbno){
    if (tbno==0){ 
		return "修改料號基本資料："; 
	}else if (tbno==1){
		return "修改:"+document.getElementById('fatherkey').innerHTML+":報價紀錄："; 
	}else if (tbno==2){
		return "修改:"+document.getElementById('fatherkey1').innerHTML+":詢價紀錄："; 
	} 
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋物料基本檔欄位選擇";
	}else if (tbno==1){ 
		return "搜尋報價紀錄欄位選擇";
	}else{ 
		return "搜尋詢價紀錄欄位選擇";
	}
}

function page1OtherWindow1(){
   return "品號:\u{300E}"+document.getElementById("stock_no").innerHTML+"\u{300F}庫存明細";
}




