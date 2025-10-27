function blocksclose(clsevt)  //關閉註冊彈出視窗
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
	   if (target.value=="\u{274E}"  && getCookie('INT_013')=='Y'){
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
		       query_no="CAxxxxxxxx";
		   }		   
	      if(document.getElementById('queryno')!=null){			  
	         var currentNo=document.getElementById('queryno').value;	            	 
	         if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號
		         var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		   	     discardNoRec('CA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	         } 
	      }
	   }
    }
	if(target.value=="\u{274E}" && document.getElementById('newPono')!=null){
		var currentNo=document.getElementById('newPono').value;
		var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		discardNoRec('BC'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	}
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   	 
	var btns=getElementsByAttribute('class','btn');			 
    for (var i=0;i<btns.length;i++){		
        if (tabs[0].checked){
			if(right(btns[i].title,1)=='M' || right(btns[i].title,1)=='I' || right(btns[i].title,1)=='B'){		      
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
	    var c04elements=document.getElementsByName('c03update');
        var c04athments=document.getElementsByName('c03others');			
	}else{
		 var c04elements=document.getElementsByName('c04update');	
		 var c04athments=document.getElementsByName('c04others');			 
	}
	for(var r=0;r<c04athments.length;r++){        //關聯資料
		    nonjsn.push(c04athments[r].tagName.toUpperCase()=='SPAN'?c04athments[r].innerHTML:c04athments[r].value);		
	}
	for(var q=1;q<c04elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c04elements[q].value);	   
	}
	for(var j=1;j<c04elements.length-1;j++){
        if(c04elements[j].value.trim()=="" && !(j==4 && tbno==1)){		
		     if (j==1 ){
			    c04elements[j].placeholder="不得空白" ;
			 }else{
		        filtermsg(c04elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(c04elements[j].nextSibling ){		
               if((j!=4 && tbno!=0) && (j!=1 && tbno!=1)){		   //非人名與料號移除
			      c04elements[j].parentNode.removeChild(c04elements[j].nextSibling);
			   }			   
		   }
		   if(tbno==1 && (j==2 || j==3)){	
		      if(c04elements[j].value == 0){
			     filtermsg(c04elements[j],"不得為 0");
		         return false ;
			  }
			    if(j==2 && updflg!=1){
					 
			        if(c04elements[2].value*1 < sourceAccount(8,1)*1+sourceAccount(9,1)*1+sourceAccount(11,1)*1){
			           filtermsg(c04elements[2],"不得小於已出量加取消量加開單未出量");
		              return false ;
			        }
			    }
		   }
		   
	    }
		
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 	   
        if(c04elements[1].value!="" ){

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
/* */
function calculateTtl(tbno,maintable,i){
    if (tbno==1){	//計算本單總金額
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var crntsum=Number(maintable.rows[i].cells[5].innerHTML);							
		document.getElementById('ttlmny').innerHTML=ttlcnt-crntsum;
	}
	return;
}
 function billNoReCreate(currentNo){
     if (getCookie('INT_099')=='Y' && getCookie('INT_013')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用						      
		var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日				  
		var crntmth=thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase();							  
		if(currentNo.substring(2,5)==crntmth){
			discardNoRec('CA'+crntmth,currentNo.trim());
		} 							  
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
		var url="C04/BKND/C01CustomName.php?timestamp="+new Date().getTime();			
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
		oTd.innerHTML='出貨指示:';
		var oTd = oTr.insertCell(1);   
		oTd.innerHTML="<input type='text' name='c03update' id='shipdirect' class='txt' style='width:80%;' maxlength='40'    />";  				  			 				  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='交貨地點:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='text' name='c03update' id='dlvrplace' class='txt' style='width:80%;' maxlength='40'    />";  				  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='客戶PO:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='text' name='c03update' id='custompo' class='txt' style='width:50%;' maxlength='20'    />";  				  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='幣別:';
		var oTd = oTr.insertCell(1);  
		var slt4=document.createElement("select");
		slt4.setAttribute("id","crntopt");
		slt4.setAttribute("name","c03update");
		oTd.appendChild(slt4);						  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='業務擔當:';
		var oTd = oTr.insertCell(1);               	              
		oTd.innerHTML="<input type='text' name='c03update' id='whono' class='txt' style='width:30%;' maxlength='8'    />";  				  
		oTd.innerHTML+="<span name='c03others' id='whonameEx'></span>&nbsp&nbsp";  
		var srchButton1=document.createElement("input");				   
		srchButton1.setAttribute("type","button");	
		srchButton1.setAttribute("class","scopelook");				   
		srchButton1.style.background="url('digits/brows1.png')";   
		attachEventListener(srchButton1,"click",srchshow,false);				
		oTd.appendChild(srchButton1);						
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='接單日期:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='date' name='c03update' id='querydate' class='txt' style='width:35%;'   />";  				  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='客戶全名:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='c03others' id='customfullname' class='txt' style='width:50%;' maxlength='40'    />";  				
	    oTr.setAttribute("style","display:none;");   //整列隱藏
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='客戶簡稱:';
		var oTd = oTr.insertCell(1);           
        if (txtword==1){		
		    oTd.innerHTML="<input type='text' name='c03others' id='customname' class='txt' style='width:25%;' maxlength='8'    />";  				 
		    var srchButton2=document.createElement("input");				   
		    srchButton2.setAttribute("type","button");	
		    srchButton2.setAttribute("class","scopelook");				   
		    srchButton2.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton2,"click",srchshow,false);				
		    oTd.appendChild(srchButton2);		
		}else{		    
		    oTd.innerHTML="<input type='text' name='c03others' id='customname' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='8' readOnly=true  />";  	
		}			
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='客戶代號:';
		var oTd = oTr.insertCell(1);           
        if (txtword==1){			
		    oTd.innerHTML="<input type='text' name='c03update' id='customno' class='txt' style='width:20%;' maxlength='6'    />";  				
		    var srchButton3=document.createElement("input");				   
		    srchButton3.setAttribute("type","button");	
		    srchButton3.setAttribute("class","scopelook");				   
		    srchButton3.style.background="url('digits/brows1.png')";   
		    attachEventListener(srchButton3,"click",srchshow,false);				
		    oTd.appendChild(srchButton3);	
        }else{
		    oTd.innerHTML="<input type='text' name='c03update' id='customno' class='txt' style='background-color:#B9B9FF;width:20%;' maxlength='6' readOnly=true   />";  				
		}			
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
		oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='訂單號碼:';
		var oTd = oTr.insertCell(1);		                		
		if(txtword==2){   //如果是修改		                
			oTd.innerHTML="<input type='text' name='c03update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />"; 					
			optionitem(aWaitUpdate[5],slt4.id,4,"C01/BKND/C00srch.php");		//幣別欄位					 
		}else{
			oTd.innerHTML="<input type='text' name='c03update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 
			optionitem(getCookie('INT_011'),slt4.id,4,"C01/BKND/C00srch.php");	
		}			 	              
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		var oTd = oTr.insertCell(0);	             
		oTd.innerHTML='紀錄號碼';
		var oTd = oTr.insertCell(1);		  
		oTd.innerHTML="<input type='text' name='c03update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");	
	}else{               //異動表身資料			      		 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='預定交期:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='date' name='c04update' id='deliverydate' class='txt' style='width:30%;' maxlength='10'    />";  				 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
		oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='客戶品號:';
		var oTd = oTr.insertCell(1);		                						  		          				  
		oTd.innerHTML="<input type='text' name='c04update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 		  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='單價:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='number' name='c04update' value=0 id='price' class='txt' style='text-align:right;width:20%;' />";  				 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='數量:';
		var oTd = oTr.insertCell(1);      
		oTd.innerHTML="<input type='number' name='c04update' id='queryqty' value=1 class='txt' style='text-align:right;width:20%;' />";  					  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='品名規格:';
		var oTd = oTr.insertCell(1);      
		if(txtword==2){   //如果是修改
			oTd.innerHTML="<input type='text' name='c04others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
		}else{
			oTd.innerHTML="<input type='text' name='c04others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
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
			oTd.innerHTML="<input type='text' name='c04update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
		}else{
			oTd.innerHTML="<input type='text' name='c04update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
		oTd.innerHTML="<input type='text' name='c04update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");	
	}				  						 
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
	dropsheet.style.paddingTop="25px";      // 高度也往上提 	
	if (tbno==0 && (txtword!=7)){				
		var sales_no=document.getElementById('whono');			
		//attachEventListener(sales_no,"focusout",lostfocus1,false);		
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
				if(getCookie('INT_013')=='Y'){       //如果參數設為系統自動編號
				  objGetNo('queryno','CA'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());
				   var cstNo=document.getElementById("customno");
				   cstNo.focus();	
				   attachEventListener(cstNo,"change",c01CustomName,false);	//找客戶名稱
				  
				}else{	 

				   document.getElementById("queryno").focus();
				}   
		   }else{
				document.getElementById("deliverydate").value=thtdy;  //日期都設為今天												
				document.getElementById("stockno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		    document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		    if (tbno==0){
			    document.getElementById("querydate").focus();				  			 				  
			    var editinit=document.getElementsByName('c03update');
			    document.getElementById('customname').value=notWaitdata[0];
			    document.getElementById('customfullname').value=notWaitdata[1];
			    document.getElementById('whonameEx').innerHTML=notWaitdata[2];
		    }else{
			     document.getElementById("queryqty").focus();				  			 				  
			     var editinit=document.getElementsByName('c04update');
			     document.getElementById('stockname').value=notWaitdata[0];
		    }
		    for(var k=0;k<editinit.length;k++){ 
			    editinit[k].value=aWaitUpdate[k];
							   
		    }									
		    break;	
		case 6:   	   	//轉出貨單
		   var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		   var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        				   				  
		   objGetNo('newPono','BC'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());				   				
		   break;			
		case 7:   	   	//搜尋   
			  var txtseek=document.getElementById('searchWords');
			  txtseek.focus();
			  attachEventListener(txtseek,'keypress',textKeypress,false);
			 break;
	 }		
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動 
    var rnddgt=getAuth[2]()[0].INT_069;  //四捨五入到幾位     
	var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);
		var fldidx=0;
		var argsNo=0;
		var nongsNo=0;	
		while(fldsgsroup(fldidx,tbno)){
			var oTd = oTr.insertCell(oTr.cells.length); 			
			if(fldsgsroup(fldidx,tbno)[0]=='directdata'){
				oTd.innerHTML=args[argsNo];
				argsNo++;
			}else{		
                
			    if(tbno==0 && fldidx==2){   //客戶簡稱
				   oTd.innerHTML=nongs[0];				   
				}
				 if(tbno==0 && fldidx==3){   //客戶全稱
				   oTd.innerHTML=nongs[1];				  
				}
				 if(tbno==0 && fldidx==6){   //業務名稱
				   oTd.innerHTML=nongs[2];				  
				}
				if(tbno==0 && fldidx==11){   //確認
				   nongs[3]='N';
				   oTd.innerHTML='N';				   
				}
				if(tbno==0 && fldidx==12){   //  //轉單
				   nongs[4]='N';
				   oTd.innerHTML='N';				   
				}
			    if(tbno==1 && fldidx==1){   //品名
				   oTd.innerHTML=nongs[nongsNo];
				   nongsNo++;
				}
			    if(tbno==1 && fldidx==4){				   	//小計
				   oTd.innerHTML=Math.round((args[1]*args[2]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);			
				   ttlcnt=ttlcnt+Math.round((args[1]*args[2]+ Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);	
				   document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額				   
				}
				if(tbno==1 && fldidx==9){      //未出數量					 
				     oTd.innerHTML=args[1];
				}
				if(tbno==1 && fldidx==10){      //開單未出					 
				     oTd.innerHTML=0;
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
    var rnddgt=getCookie('INT_069');  //四捨五入到幾位     
    if (tbno==0){
	    var maintable=document.getElementById("maintbody1");		
	    var fldidx=4;
		var argsNo=2;
		var nongsNo=2;		   
	}
	else{
	   var maintable=document.getElementById("maintbody2");
	    var fldidx=2;
		var argsNo=1;
		var nongsNo=1;	
		var ttlcnt=Number(document.getElementById('ttlmny').innerHTML)-Number(maintable.rows[args[arglth-1]].cells[5].innerHTML);					
	} 
		while(fldsgsroup(fldidx,tbno)){			
			if(fldsgsroup(fldidx,tbno)[0]=='directdata'){
				 maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];				
				argsNo++;
			}else{				
			    if (tbno==0){
				   maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo];
				}
		        if(fldidx==4 && tbno==1){
				  nongs[nongsNo]=Math.round((args[1]*args[2] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);							  
			      ttlcnt=ttlcnt+Math.round((args[1]*args[2] + Number.EPSILON) * Math.pow(10,rnddgt) )/Math.pow(10,rnddgt);					
		          document.getElementById('ttlmny').innerHTML=ttlcnt;  //更新畫面上的總金額
				   maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo];	
				}	
				if(fldidx==7 && tbno==1){
				   nongs[nongsNo]=maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML;	
				}
				if(fldidx==8 && tbno==1){	
				   nongs[nongsNo]=maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML;	
				}
				if(fldidx==9 && tbno==1){					 
					 nongs[nongsNo]=args[1]*1-(nongs[nongsNo-2]*1+nongs[nongsNo-1]*1);
					 maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo];	
				}			
				if(fldidx==10 && tbno==1){	
				   nongs[nongsNo]=maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML;	
				}
				nongsNo++;
			}		 
			fldidx++;
		}		
		maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=rsp.lastupdate;
}
function transConfirm(oTd){      			 
	oTd.innerHTML="<input type='text' name='b04update' id='newPono' class='txt' style='display:none;' maxlength='10'/>"; 				 
    return true;
}   
function searchOptionsKey(tbno,slt5){	     	 
     if (tbno==0){
		 slt5.options.add(new Option('訂單號碼','c03.F01'));
		 slt5.options.add(new Option('客戶編號','c03.F03'));
		 slt5.options.add(new Option('客戶簡稱','c01.F05'));
		 slt5.options.add(new Option('接單日期','c03.F02'));
		 slt5.options.add(new Option('業務編號','c03.F07'));
		 slt5.options.add(new Option('業務姓名','a01.F03'));
		 slt5.options.add(new Option('客戶PO','c03.F14')); 				     
	  }else{
		 slt5.options.add(new Option('料品編號','c04.F02'));
		 slt5.options.add(new Option('品名規格','b01.F02'));
		 slt5.options.add(new Option('客戶品號','c04.F05'));				   				      		 					  
	  }
}

function page2Detail01(ajTable){
	    ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
		ajTable.id="srchTable";		
		ajTable.className="gridlist";               
		 if(window.ActiveXObject){
			var request = new ActiveXObject("Microsoft.XMLHttp");
		 }else if(window.XMLHttpRequest){
			  var request = new XMLHttpRequest();
		 }
		 request.onreadystatechange = respond;   
		 var url="C04/BKND/C10srch.php?timestamp="+new Date().getTime();   	               				 
		 request.open("POST",url);	 
		 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		 			    
		 var queryString ="filename="+document.getElementById("fatherkey1").innerHTML+'|'+sourceAccount(1,1);
		  
		 request.send(queryString);
		 function respond(){
			if (request.readyState == 4 && request.status == 200) {	       	     		
				 rsp=JSON.parse(request.responseText);						   
				 srchOutRcd(rsp,ajTable);		  
			}	  
		 }	
    
}

function srchOutRcd(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;  	  
	for(var i=0;i<arr.length;i++){				 
	   var oTr=ajTable.insertRow(ajTable,ajTable.length);	     
		cnt++;         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];    		    		 		    		    			 
		    oTd.setAttribute("style","text-align:center;");		 
	    }	        
	}
    var array = ['出貨日期', '出貨單號','出貨數量'];  //表頭最後再加
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		
		var text = document.createTextNode(array[j]); //cell		
		th.appendChild(text);
		oTr.appendChild(th);
	}		
   
}

function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
        return "請輸入客戶訂單表頭資料：";
    }else{
		return "請輸入客戶訂單內容資料："; 
	}				 
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改客戶訂單表頭資料："; 
	}else{
		return "修改客戶訂單內容資料："; 
	}	 
}

function transRecordHint(tbno){
	if (tbno==0){  //表頭資料	
		return '客戶訂單:'+sourceAccount(1,tbno)+",轉出貨單?";
	}else{
		return '客戶訂單:'+document.getElementById('fatherkey1').innerHTML+",轉出貨單?";
	}  
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋單頭欄位選擇";
	}else{
		return "搜尋單身欄位選擇";
	}  
}
function page2OtherWindow1(){
   return "\u{1F4E4}"+document.getElementById("fatherkey1").innerHTML+"\u{A0}\u{1F4E6}:\u{300C}"+sourceAccount(1,1)+"\u{300D}的出貨紀錄";

}

function srcArgobj(srcId){
	if(srcId=='customno' || srcId=='customname'){
		var custno=document.getElementById(srcId).value; 
		var tttlt='';
		if (srcId=='customno'){		 		    
		    var qrystring = "c01.F01"+"|"+custno; 
			 tttlt='請選擇客戶編號';
	   }else{		    
		    var qrystring = "c01.F05"+"|"+custno;
			tttlt='請選擇客戶簡稱';
	    }					 
		
        return {"headtitle":tttlt,"drpshtWidth":"28%","thCntnt":['客戶編號', '客戶簡稱'],"thWidth":['50%','50%'],"urlPth":"C04/BKND/C01srch.php","clickfunc":chsecust,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
	}if(srcId=='whono'){
	   var qrystring=document.getElementById(srcId).value;
      return {"headtitle":"請選取業務人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
  	
	}else{	
		var cstno=document.getElementById('keydscrpt1').innerHTML;
		var stockNo=document.getElementById(srcId).value;		 
		var tttlt='';
	    if(srcId=='stockno'){			     
		   var qrystring ="b01.F01"+","+stockNo+","+left(cstno,6)+","+document.getElementById('crncy').innerHTML; 
			tttlt="請選取料號";          			
	    }else if(srcId=='stockname'){			 
		    var qrystring = "b01.F02"+","+stockNo+","+left(cstno,6)+","+document.getElementById('crncy').innerHTML; 			 
			tttlt="請選取品名";		
		}		
		return {"headtitle":tttlt,"drpshtWidth":"80%","thCntnt":['料品編號', '品名規格','客戶品號','有效日期','報價'],"thWidth":['30%','25%','25%','10%','10%'],"urlPth":"C04/BKND/B01srch.php","clickfunc":stckchg,"qryString":qrystring,"mendwidth":"calc( 100%  )"};
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
	var unitName=document.getElementById('unitname');
	var orderPrice=document.getElementById('price');
	var orderQty=document.getElementById('queryqty');
	var custstockno=document.getElementById('custompartno');
	var dlvdate=document.getElementById('deliverydate');		
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stockNo.value=maintable.rows[i].cells[1].innerHTML;								 
			 stockName.value=maintable.rows[i].cells[2].innerHTML;	
			 if(unitName){
				unitName.innerHTML=maintable.rows[i].cells[3].innerHTML;
			 }
		
			 if(orderQty){
				 orderQty.value=maintable.rows[i].cells[5].innerHTML;
			 }
			 
			 if(custstockno){
				custstockno.value=maintable.rows[i].cells[6].innerHTML;
			 }  
			  if(orderPrice){
				 orderPrice.value=maintable.rows[i].cells[8].innerHTML;
			 }
			
			if(dlvdate){
				var outdate=new Date(sourceAccount(5,0)); //接單日
			 
				var endday=outdate.addDays(parseInt(maintable.rows[i].cells[9].innerHTML));
			
				 dlvdate.value=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
			 }
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
	var custFullName=document.getElementById('customfullname');
	var rprsntno=document.getElementById('whono');
	var rprsntname=document.getElementById('whonameEx');
	var crnttpe=document.getElementById('crntopt');
	var contactman=document.getElementById('winman');
    var shipway=document.getElementById('howship');
	var paymenttp=document.getElementById('howpay');
	var shipplace=document.getElementById('dlvrplace');
	var shipdirect=document.getElementById('shipdirect');
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
			if(crnttpe){
				crnttpe.value=maintable.rows[i].cells[4].innerHTML;
			}
			if(contactman){
				contactman.value=maintable.rows[i].cells[5].innerHTML;
			}
			if(shipway){
				shipway.value=maintable.rows[i].cells[6].innerHTML;
			}
			if(custFullName){
			    custFullName.value=maintable.rows[i].cells[11].innerHTML;
			}  
			if(paymenttp){
				var tpy=maintable.rows[i].cells[7].innerHTML;
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
				paymenttp.value=tpy+(maintable.rows[i].cells[8].innerHTML==0?'':maintable.rows[i].cells[8].innerHTML+'天');
			}	
			if(shipplace){
				 shipplace.value=maintable.rows[i].cells[9].innerHTML;
			}
				if(shipdirect){
				 shipdirect.value=maintable.rows[i].cells[10].innerHTML;
				}  
			break;
		}						   
	}             
	srchblkclose(event);	
	return true;
}	
