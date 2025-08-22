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
		   if(maintable.rows.length>0){       //如果不為空檔
		       var query_no=maintable.rows[tablerowindex].cells[1].innerHTML;
		   }else{
		       query_no="CCxxxxxxxx";
		   }
	      if(document.getElementById('queryno')!=null){			  
	         var currentNo=document.getElementById('queryno').value;	            	 
	         if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號
		         var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		   	     discardNoRec('CC'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	         } 
	      }
	   }
    }
	if(target.value=="\u{274E}" && document.getElementById('newPono')!=null){
		var currentNo=document.getElementById('newPono').value;
		var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		discardNoRec('CA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
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
	    var c21elements=document.getElementsByName('c26update');
        var c21athments=document.getElementsByName('c26others');	
		
	}else{
		 var c21elements=document.getElementsByName('c27update');	
		 var c21athments=document.getElementsByName('c27others');			 
	}
	for(var r=0;r<c21athments.length;r++){        //關聯資料
		    nonjsn.push(c21athments[r].tagName.toUpperCase()=='SPAN'?c21athments[r].innerHTML:c21athments[r].value);		
	}
	for(var q=1;q<c21elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c21elements[q].value);	   
	}
	for(var j=1;j<c21elements.length-1;j++){
        if(c21elements[j].value.trim()=="" && !(j==4 && tbno==1)){		
		     if (j==1 ){
			    c21elements[j].placeholder="不得空白" ;
			 }else{
		        filtermsg(c21elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(c21elements[j].nextSibling ){				       
               if(!((j==4 && tbno==0) || (j==1 && tbno==1))){		   //非人名與料號移除
			      c21elements[j].parentNode.removeChild(c21elements[j].nextSibling);
			   }			   
		   }
		   if(tbno==1 && (j==2 || j==3 || j==5 || j==6) && c21elements[j].value == 0){			  
			  filtermsg(c21elements[j],"不得為 0");
		      return false ;
		   }
		   if(tbno==1 && (j==6)){
			 
			  if (c21elements[6].value % c21elements[5].value!=0){  
                  var sgstnumner=parseInt(c21elements[6].value)+parseInt(c21elements[5].value)-(c21elements[6].value % c21elements[5].value);			  
			      filtermsg(c21elements[j],"必須為包裝基量的倍數，建議："+sgstnumner);
		          return false ;
			  }
		   }
		   if(tbno==1 && (j==2)){			  
			  if (parseInt(c21elements[2].value)<parseInt(c21elements[6].value) ){    
			      filtermsg(c21elements[j],"不得小於最少採購");
		          return false ;
			  }
			  if (c21elements[2].value % c21elements[5].value!=0 && parseInt(c21elements[5].value)>0){
				  var sgstnumner=parseInt(c21elements[2].value)+parseInt(c21elements[5].value)-(c21elements[2].value % c21elements[5].value);			
			      filtermsg(c21elements[j],"必須為包裝基量的倍數，建議："+sgstnumner);
		          return false ;
			  }
		   }
		   
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 	   
        if(c21elements[1].value!="" ){

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
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
         var rspns=TableToJson(tbjsn,nonjsn,tbno); 	
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}

function calculateTtl(tbno,maintable,i){     //刪除確認(delConfirm)中挑出之個別程序 
    if (tbno==1){	//計算本單總金額
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var crntsum=Number(maintable.rows[i].cells[5].innerHTML);							
		document.getElementById('ttlmny').innerHTML=ttlcnt-crntsum;
	}
	return;
}
 function billNoReCreate(currentNo){         //刪除確認(delConfirm)中挑出之個別程序 
     if (Cookies.get('INT_099')=='Y' && Cookies.get('INT_127')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用						      
		 var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		 var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		 var crntmth=thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase();							  
		if(currentNo.substring(2,5)==crntmth){
			discardNoRec('CC'+crntmth,currentNo.trim());
		} 
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
	         document.getElementById('customfullname').value=rsp[0]['customfullname'];
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
	    oTd.innerHTML="<input type='text' name='c26update' id='dscrpt' class='txt' style='width:80%;' onkeyup='checkLength(this, 36);' />";  				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='付款方式:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c26update' id='howpay' class='txt' style='width:50%;' maxlength='30'    />";  				  
  	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='交貨方式:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c26update' id='howship' class='txt' style='width:80%;' maxlength='30'    />";  				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='聯絡人:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c26update' id='winman' class='txt' style='width:50%;' maxlength='10'    />";  				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='幣別:';
	    var oTd = oTr.insertCell(1);  
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crntopt");
	    slt4.setAttribute("name","c26update");
	    oTd.appendChild(slt4);						  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='業務擔當:';
	    var oTd = oTr.insertCell(1);               	              
  	    oTd.innerHTML="<input type='text' name='c26update' id='whono' class='txt' style='width:30%;' maxlength='8'    />";  				  
	    oTd.innerHTML+="<span name='c26others' id='whonameEx'></span>&nbsp&nbsp";  
	    var srchButton1=document.createElement("input");				   
	    srchButton1.setAttribute("type","button");	
	    srchButton1.setAttribute("class","scopelook");				   
	    srchButton1.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton1,"click",srchshow,false);				
	    oTd.appendChild(srchButton1);						
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='報價日期:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='date' name='c26update' id='querydate' class='txt' style='width:35%;'   />";  	
        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶全名:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c26others' id='customfullname' class='txt' style='width:50%;' maxlength='40'    />";  				
	    oTr.setAttribute("style","display:none;");   //整列隱藏
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶簡稱:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c26others' id='customname' class='txt' style='width:25%;' maxlength='8'    />";  				 
	    var srchButton2=document.createElement("input");				   
	    srchButton2.setAttribute("type","button");	
	    srchButton2.setAttribute("class","scopelook");				   
	    srchButton2.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton2,"click",custnoshow,false);				
	    oTd.appendChild(srchButton2);					
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶代號:';
	    var oTd = oTr.insertCell(1);               	            				  
	    oTd.innerHTML="<input type='text' name='c26update' id='customno' class='txt' style='width:20%;' maxlength='6'    />";  				
  	    var srchButton3=document.createElement("input");				   
	    srchButton3.setAttribute("type","button");	
	    srchButton3.setAttribute("class","scopelook");				   
	    srchButton3.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton3,"click",custnoshow,false);				
	    oTd.appendChild(srchButton3);					
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='報價單號:';
	    var oTd = oTr.insertCell(1);		                		
	    if(txtword==2){   //如果是修改		                
		    oTd.innerHTML="<input type='text' name='c26update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />"; 					
		    optionitem(aWaitUpdate[5],slt4.id,4,"C01/BKND/C00srch.php");		//幣別欄位	
	    }else{					
		   oTd.innerHTML="<input type='text' name='c26update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 					 
		   optionitem(Cookies.get('INT_011'),slt4.id,4,"C01/BKND/C00srch.php");	
	    }			 	              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);	    
	    oTd.innerHTML="<input type='text' name='c26update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
   }else{               //異動表身資料			      
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='有效期限:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='date' name='c27update' class='txt' id='validend'  style='width:35%;'  />"; 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
   	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='生效日期:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='date' name='c27update' class='txt' id='validstart'  style='width:35%;'  />";  				   				   			 	              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='最少採購:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='c27update' id='minumqty' value=1 class='txt' style='width:20%;text-align:right;' maxlength='6'    />";  				 				  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='包裝基量:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='c27update' id='basepack' value=1 class='txt' style='width:20%;text-align:right;' maxlength='6'    />";  				 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='客戶品號:';
	    var oTd = oTr.insertCell(1);		                						  		          				  
	    oTd.innerHTML="<input type='text' name='c27update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
	    if(txtword==1){   //如果是新增
		    var srchButton12=document.createElement("input");				   
		    srchButton12.setAttribute("type","button");	
		    srchButton12.setAttribute("class","scopelook");				   
		    srchButton12.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton12,"click",stocknoshow,false);				
		    oTd.appendChild(srchButton12);			
		}
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='單價:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='number' name='c27update' value=0 class='txt' style='width:20%;text-align:right;' />";  				 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='數量:';
	    var oTd = oTr.insertCell(1);      
	    oTd.innerHTML="<input type='number' name='c27update' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";  					  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='品名規格:';
	    var oTd = oTr.insertCell(1);      
	    if(txtword==2){   //如果是修改
		   oTd.innerHTML="<input type='text' name='c27others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	    }else{
		    oTd.innerHTML="<input type='text' name='c27others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
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
		   oTd.innerHTML="<input type='text' name='c27update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	    }else{
		   oTd.innerHTML="<input type='text' name='c27update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	    oTd.innerHTML="<input type='text' name='c27update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
	}				 
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
	dropsheet.style.paddingTop="25px";      // 高度也往上提 
	if (tbno==0 && txtword!=7){				
		var sales_no=document.getElementById('whono');			
		attachEventListener(sales_no,"focusout",lostfocus1,false);		
	}	 
	 
    return true;
}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
	switch (txtword) {
		case 1:                                   //如果是新增
		   var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		   var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        
		   if (tbno==0){					  
			   document.getElementById("querydate").value=thtdy;  //日期都設為今天
				if(Cookies.get('INT_127')=='Y'){       //如果參數設為系統自動編號
				  objGetNo('queryno','CC'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());
				   var cstNo=document.getElementById("customno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
				}else{	 
				   document.getElementById("queryno").focus();	
				}
		   }else{
				document.getElementById("validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
				var today=new Date();
				var endday=today.addDays(parseInt(Cookies.get('INT_126'))); //加上參數預設有效天數
				var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();						
				////////////////
				document.getElementById("validend").value=endaydash;  //日期往後推
				document.getElementById("stockno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			 var cstNo=document.getElementById("customno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱	  			 				  
			  var editinit=document.getElementsByName('c26update');
			  document.getElementById('customname').value=notWaitdata[0];
			   document.getElementById('customfullname').value=notWaitdata[1];
			  document.getElementById('whonameEx').innerHTML=notWaitdata[2];
		   }else{
			   document.getElementById("queryqty").focus();				  			 				  
			  var editinit=document.getElementsByName('c27update');
			  document.getElementById('stockname').value=notWaitdata[0];
		   }
		   for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k];                      				   
		   }	
		   break;
		case 6:   	   	//轉正式訂單
		   var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		   var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        				   				   				   		            
		   objGetNo('newPono','CA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());				   				
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
	    var oTd = oTr.insertCell(oTr.cells.length);   //客戶簡稱
	    oTd.innerHTML=nongs[0];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","width:7%;");			   
		 var oTd = oTr.insertCell(oTr.cells.length);   //客戶全稱
	    oTd.innerHTML=nongs[1];
	    oTd.setAttribute("class","indirectdata");		
		oTd.setAttribute("style","display:none;");			   
	    var oTd = oTr.insertCell(oTr.cells.length);   //報價日期 
		oTd.innerHTML=args[2];				
		oTd.setAttribute("class","directdata");		
		oTd.setAttribute("style","width:10%;");				
	    var oTd = oTr.insertCell(oTr.cells.length);    //業務編號
		oTd.innerHTML=args[3];				
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","display:none;"); //真正的業務編號要隱藏
	    var oTd = oTr.insertCell(oTr.cells.length);    //業務編號
		oTd.innerHTML=nongs[2];				
		oTd.setAttribute("class","indirectdata");  //業務名稱
		oTd.setAttribute("style","width:7%;");				
		for(var i=4;i<args.length-2;i++){ 
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=args[i];				
			oTd.setAttribute("class","directdata");	
			if(i==4){
			  oTd.setAttribute("style","width:4%;");		
			}							
		}						 
		oTr.setAttribute("style","font-weight:bold;color:#704214;");		
		 //是否轉單與確認
		for (var i=2;i<4;i++){ 
		   var oTd = oTr.insertCell(oTr.cells.length);	
		   oTd.setAttribute("class","indirectdata");					   
		   oTd.innerHTML=nongs[i];	
		   oTd.setAttribute("style","display:none;"); 
		}
    }else{  //整理表身新增資料				      
	    
	    var oTd = oTr.insertCell(oTr.cells.length);   //料號
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //品名
	    oTd.innerHTML=nongs[0];
		oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","indirectdata");
		for(var i=1;i<3;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);   //數量&單價
		    oTd.innerHTML=args[i];
		    oTd.setAttribute("class","directdata");
		    oTd.setAttribute("style","width:8%;text-align:right;");
		}   
		var oTd = oTr.insertCell(oTr.cells.length);   //小計
		    var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		    oTd.innerHTML=Math.round((args[1]*args[2]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
		    oTd.setAttribute("class","indirectdata");
		    oTd.setAttribute("style","width:8%;text-align:right;");
		    ttlcnt=ttlcnt+Math.round((args[1]*args[2]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					    
		    document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額
	    for(var i=3;i<args.length-2;i++){
		    var oTd = oTr.insertCell(oTr.cells.length);
		    oTd.innerHTML=args[i];				
		    oTd.setAttribute("class","directdata");	
		    switch (i){
			    case 3:
				/* 	oTd.setAttribute("style","text-align:right;"); */
					break;
			    case 4:
				   oTd.setAttribute("style","width:7%;text-align:right;");
					break;
			    case 5:	 
				   oTd.setAttribute("style","width:7%;text-align:right;");
				   break;
			    case 6:	 
					oTd.setAttribute("style","width:10%;text-align:center;");
				   break;	
				case 7:	 
					oTd.setAttribute("style","width:10%;text-align:center;");
				   break;		   
		    }
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
	    maintable.rows[args[arglth-1]].cells[2].innerHTML=args[1];						 			           
	    maintable.rows[args[arglth-1]].cells[3].innerHTML=nongs[0];
		maintable.rows[args[arglth-1]].cells[4].innerHTML=nongs[1];
	    maintable.rows[args[arglth-1]].cells[5].innerHTML=args[2]; 	  
	    maintable.rows[args[arglth-1]].cells[6].innerHTML=args[3];					   
	    maintable.rows[args[arglth-1]].cells[7].innerHTML=nongs[2];					   
	    var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
	    for (var j=8;j<tbrlth-4;j++){
		   maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-4];						  
	    }						   
	    maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動						   	                  
	}else{	               
	    var rnddgt=Cookies.get('INT_069');  //四捨五入到幾位
	    var maintable=document.getElementById("maintbody2");					   
		var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
		for (var j=3;j<5;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];						 
	    }
		 
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML)-Number(maintable.rows[args[arglth-1]].cells[5].innerHTML)					
		maintable.rows[args[arglth-1]].cells[5].innerHTML=Math.round((args[1]*args[2] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);			
		ttlcnt=ttlcnt+Math.round((args[1]*args[2] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					
		document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額
		for (var j=6;j<tbrlth-2;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-3];                           						
	    }	
	    maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate;		
	}  			
}
function transConfirm(oTd){
    oTd.innerHTML="<input type='text' name='c03update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 		
    return true;
}   
function searchOptionsKey(tbno,slt5){	
    if (tbno==0){
		 slt5.options.add(new Option('報價單號','c26.F01'));
		 slt5.options.add(new Option('客戶編號','c26.F03'));
		 slt5.options.add(new Option('客戶簡稱','c01.F05'));
		 slt5.options.add(new Option('報價日期','c26.F02'));
		 slt5.options.add(new Option('業務編號','c26.F06'));
		 slt5.options.add(new Option('業務姓名','a01.F03'));
    }else{
		 slt5.options.add(new Option('料品編號','c27.F0201'));
		 slt5.options.add(new Option('品名規格','b01.F0202'));
		 slt5.options.add(new Option('客戶品號','c02.F0503'));				   				      		 					  
	}
}



function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
	   return "請輸入報價單表頭資料：";
    }else{
	   return "請輸入報價單內容資料："; 
    }		
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改報價單表頭資料："; 
	}else{
		return "修改報價單內容資料："; 
	}
	 
}
function transRecordHint(tbno){
	if (tbno==0){  //表頭資料	
		return '報價單號:'+sourceAccount(1,tbno)+",轉正式訂單?";
	}else{
		return '報價單號:'+document.getElementById('fatherkey').innerHTML+",轉正式訂單?";
	}  
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋單頭欄位選擇";
	}else{
		return "搜尋單身欄位選擇";
	}  
}
