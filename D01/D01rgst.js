function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	if (target.value=="\u{274E}"  && Cookies.get('INT_004')=='Y'){
	   if(document.getElementById('venderno')!=null){
	      var currentNo=document.getElementById('venderno').value;	   
	      if (currentNo.trim()!="" && currentNo.trim()!=document.getElementById('vender_no').innerHTML){ //如果非修改且自動編號
		      discardNoRec('V0000',currentNo.trim());
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
	    var d01elements=document.getElementsByName('d01update');
        var d01athments=document.getElementsByName('d01others');	
		
	}else{
		 var d01elements=document.getElementsByName('d02update');	
		 var d01athments=document.getElementsByName('d02others');			 
	}
	for(var r=0;r<d01athments.length;r++){        //關聯資料
		    nonjsn.push(d01athments[r].tagName.toUpperCase()=='SPAN'?d01athments[r].innerHTML:d01athments[r].value);		
	}
	for(var q=1;q<d01elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(d01elements[q].value);	   
	}
    if(tbno==1){   //如果是表身另外再特別處理一個付款條件塞入最後
	   tbjsn.push(document.getElementById('typeofpay').innerHTML+document.getElementById('paymentterm').innerHTML+'天');
	
	}
	 
	 //----資料寫入資料庫前過濾程序區-----//
	for(var j=1;j<d01elements.length-3;j++){
        if(d01elements[j].value.trim()==="" && !(j==5 || j==6 || j==7 || j==9 || j==11 || j==13 || j==14 || j==22)){		
		   if(!d01elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      d01elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   d01elements[j].focus();
		   return false ;
        }else{		     
		   if(d01elements[j].nextSibling){		      
			  d01elements[j].parentNode.removeChild(d01elements[j].nextSibling);
		   }			
	    }
	}	
    //--------過濾區結束----------//	
    if (tbno==0){    //處理幣別名稱
		var selectElement=document.getElementById("crntopt");
		var slicelth=selectElement.value.length;		
		nonjsn.unshift( selectElement.options[selectElement.selectedIndex].text.slice(slicelth));  //取得幣別名稱內容
	}
    if (updflg==1){     //如果是新增	 
        if(d01elements[1].value!="" ){
 
		   tbjsn.push(0);
		   tbjsn.push(0);
	
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
/*  */
function calculateTtl(tbno,maintable,i){  //刪除後計算總數量
   
    if (tbno==1){	//計算本單總金額
	    
	   var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);		  					
	   document.getElementById('ttlmny').innerHTML=ttlcnt-1;
	 
	}

	return;
}

function lostfocus1(event){     
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var prcno="";
	var maintable=document.getElementById("maintbody1");				 				 	 
	for(var i=0;i< maintable.rows.length; i++){			 		            
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		   	
           prcno=maintable.rows[i].cells[20].innerHTML;	   
           break;					   
	    }
	} 		
	 
	if (target.value!=prcno){	       //業務欄位資料變動	
        target.parentNode.childNodes[1].innerHTML="";   //名字清空	
	    srchshow(event);
	}
    return;	
}

function lostfocus3(event){        //新增修改時廠商名稱帶到簡稱
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('venderabbrv').value.trim()==""){
		document.getElementById('venderabbrv').value=target.value.substring(0,4);
	 }
	 
    
    return;	
}
function lostfocus4(event){        //新增修改時公司地址帶到送貨地址
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('shipplace').value.trim()==""){
		document.getElementById('shipplace').value=target.value;
	 }
    return;	
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);		   
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='其他備註:';				
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=5;				
	    oTd.innerHTML="<input type='text' name='d01update' id='hokaremark' class='txt' maxlength='60' style='width:90%;'  />";                             	              		                   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);				
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='採購人員:';				
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=5;				
	    oTd.innerHTML="<input type='text' name='d01update' id='whono' class='txt' maxlength='10' style='width:30%;'/>";                             	              		   
	    oTd.innerHTML+="<span name='d01others' id='whonameEx'></span>&nbsp&nbsp"; 
	    var srchButton1=document.createElement("input");				   
	    srchButton1.setAttribute("type","button");	
	    srchButton1.setAttribute("class","scopelook");					   
	    srchButton1.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton1,"click",srchshow,false);				
	    oTd.appendChild(srchButton1);									   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='付款方式:';				
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=2;		
	    var slt11=document.createElement("select");
	    slt11.options.add(new Option('現結','0'));
	    slt11.options.add(new Option('月結','1'));
	    slt11.options.add(new Option('次月結','2'));
	    slt11.options.add(new Option('T/T','3'));
	    slt11.setAttribute("id","howpay");
	    slt11.setAttribute("name","d01update");
	    oTd.appendChild(slt11);	  				
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='票期(T/T)天數:';				
	    var oTd = oTr.insertCell(3);	
	    oTd.colspan=2;	                
	    oTd.innerHTML="<input type='number' name='d01update' id='daysofpay' class='txt' maxlength='2' value=0 style='text-align:right;width:20%;'  />";                             	              		   		              
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='交易幣別:';				
	    var oTd = oTr.insertCell(1);	     
	    var slt4=document.createElement("select");
	    slt4.setAttribute("id","crntopt");
	    slt4.setAttribute("name","d01update");
	    oTd.appendChild(slt4);				
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='結帳日:';				
	    var oTd = oTr.insertCell(3);	                
	    oTd.innerHTML="<input type='text' name='d01update' id='dayline' class='txt' value='31' maxlength='2' style='width:20%;'  />";                             	              		   		   
	    var oTd = oTr.insertCell(4);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='請款日:';				
	    var oTd = oTr.insertCell(5);	                
	    oTd.innerHTML="<input type='text' name='d01update' id='dayforapply' class='txt' value='01' maxlength='2' style='width:20%;'  />";                             	              		   		   						
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%;');	
	    oTd.innerHTML='E-mail:';				
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=5;				
	    oTd.setAttribute('style','width:55%;');	
	    oTd.innerHTML="<input type='text' name='d01update' id='mailaddress' class='txt' maxlength='50' style='width:80%;'  />";                             	              		   		         
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='電話:';				
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=2;				
	    oTd.innerHTML="<input type='text' name='d01update' id='telNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='傳真:';				
	    var oTd = oTr.insertCell(3);	
	    oTd.colspan=2;					
	    oTd.innerHTML="<input type='text' name='d01update' id='faxNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='聯絡人:';		               		
	    var oTd = oTr.insertCell(1);	
	    oTd.colspan=2;				
	    oTd.innerHTML="<input type='text' name='d01update' id='winman' class='txt' maxlength='20' style='width:60%;'  />";                             	             
	    var oTd = oTr.insertCell(2);	             
	    oTd.innerHTML='負責人:';		
	    oTd.setAttribute('style','text-align:right;width:12%');		
	    var oTd = oTr.insertCell(3);		
	    oTd.colspan=2;				
	    oTd.innerHTML="<input type='text' name='d01update' id='represent' class='txt' maxlength='20' style='width:60%;'  />";                             	             						  
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='工廠地址:';				
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=5;
	    oTd.innerHTML="<input type='text' name='d01update' id='shipplace' class='txt'  maxlength='137'  style='width:90%;'  />";                             	             
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='公司地址:';				
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=5;
	    oTd.innerHTML="<input type='text' name='d01update' id='coaddrss' class='txt' maxlength='100' style='width:90%;' />";            	             			                  	         		       
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);	             
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='營業項目:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='d01update' id='forproduct' class='txt' maxlength='40' style='width:80%;text-align:left;' />";    
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='交貨方式:';
	    var oTd = oTr.insertCell(3);
	    oTd.innerHTML="<input type='text' name='d01update' id='whereis' class='txt' maxlength='20' style='width:80%;' />";    		       
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='廠商簡稱:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='d01update' id='venderabbrv' class='txt' maxlength='8' style='width:45%;'  />";                             
	    var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='品質等級:';
	    var oTd = oTr.insertCell(3);
	    var slt9=document.createElement("select");
	    slt9.options.add(new Option('A','A'));
	    slt9.options.add(new Option('B','B'));
	    slt9.options.add(new Option('C','C'));
	    slt9.options.add(new Option('X','X'));
	    slt9.setAttribute("id","mngtpe");
	    slt9.setAttribute("name","d01update");
	    oTd.appendChild(slt9);	                                        
	    var oTd = oTr.insertCell(4);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='統一編號:';
	    var oTd = oTr.insertCell(5);
	    oTd.innerHTML="<input type='text' name='d01update' id='unino' class='txt' maxlength='9' style='width:50%;text-align:left;'  />";                             				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:12%');	
	    oTd.innerHTML='廠商編號:';
	    var oTd = oTr.insertCell(1);		
	    oTd.setAttribute('style','width:15%');				
	    if(txtword==2){   //如果是修改		                
	  	   oTd.innerHTML="<input type='text' name='d01update' id='venderno' class='txt' style='background-color:#B9B9FF;width:65%;' maxlength='6' readOnly=true  />"; 
		   optionitem(aWaitUpdate[15],slt4.id,4,"D01/D00srch.php");						   
	    }else{
	  	   oTd.innerHTML="<input type='text' name='d01update' id='venderno' class='txt' style='width:65%;' maxlength='6'/>"; 				    
		   optionitem(Cookies.get('INT_011'),slt4.id,4,"D01/D00srch.php");				//參數預設幣別	
	    }			 
	    var oTd = oTr.insertCell(2);	   
 	    oTd.setAttribute('style','text-align:right;width:12%');					
	    oTd.innerHTML='廠商名稱:';
	    var oTd = oTr.insertCell(3);
	    oTd.colspan=3;		
	    oTd.innerHTML="<input type='text' name='d01update' id='vendername' class='txt' style='width:80%;' maxlength='40'    />";  				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=5;
	    oTd.innerHTML="<input type='text' name='d01update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
 
	}else{      //詢價紀錄異動
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
		oTd.innerHTML="<input type='date' name='d02update' class='txt' id='validstart'  style='width:50%;'  />";  				   				   			 	              
		var oTd = oTr.insertCell(2);
		oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='有效期限:';
		var oTd = oTr.insertCell(3);
		oTd.innerHTML="<input type='date' name='d02update' class='txt' id='validend'  style='width:50%;'  />"; 

		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
		oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='前置天數:';
		var oTd = oTr.insertCell(1);
		 oTd.colspan=3;
		oTd.innerHTML="<input type='number' name='d02update' value=1 class='txt' id='ltdays'  style='width:20%;text-align:right;'  />";  	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='包裝基量:';
		var oTd = oTr.insertCell(1);               
		oTd.innerHTML="<input type='number' name='d02update' id='basepack' value=1 class='txt' style='width:35%;text-align:right;'   />";  				 
		var oTd = oTr.insertCell(2);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='最少採購:';
		var oTd = oTr.insertCell(3);               
		oTd.innerHTML="<input type='number' name='d02update' id='minumqty' value=1 class='txt' style='width:35%;text-align:right;'     />";  				 				  	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='幣別:';
		var oTd = oTr.insertCell(1);        
		var slt4=document.createElement("select");
		slt4.setAttribute("id","crnttype");
		slt4.setAttribute("name","d02update");
		oTd.appendChild(slt4);	
		 var oTd = oTr.insertCell(2);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='單價:';
		var oTd = oTr.insertCell(3);               
		oTd.innerHTML="<input type='number' name='d02update' value=0 class='txt' style='width:35%;text-align:right;' />";  	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
		oTd.setAttribute('style','text-align:right;width:15%');	
		oTd.innerHTML='廠商品號:';
		var oTd = oTr.insertCell(1);		    
		 oTd.colspan=3;
		oTd.innerHTML="<input type='text' name='d02update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
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
		oTd.innerHTML='品名規格:';
		var oTd = oTr.insertCell(1);   
		 oTd.colspan=3;
		if(txtword==2){   //如果是修改
		   oTd.innerHTML="<input type='text' name='d02others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 				     
		  
		   optionitem(aWaitUpdate[3],slt4.id,4,"D01/D00srch.php");				   				   
		}else{
		   oTd.innerHTML="<input type='text' name='d02others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
		   var crn=document.getElementById('typeofcrnt').innerHTML;					   
		   optionitem(crn,slt4.id,4,"D01/D00srch.php");
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
		 oTd.colspan=3;
		if(txtword==2){   //如果是修改	
			oTd.innerHTML="<input type='text' name='d02update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
		}else{
			oTd.innerHTML="<input type='text' name='d02update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
		oTd.innerHTML="<input type='text' name='d02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");  
	}					
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){
	if(txtword==7){
	   dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整
	    dropsheet.style.paddingTop="20px"; 
	}else{
	   if (tbno==0){
	       dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
		   dropsheet.style.paddingTop="10px"; 
	   }else{
	      dropsheet_content.style.width="65%";   //原訊息內框畫面寬度調整  
		   dropsheet.style.paddingTop="20px"; 
	   }
	}
	     // 高度也往上提 	
	if (tbno==0 && (txtword!=7)){	
	   var procurement_no=document.getElementById('whono');			
	   attachEventListener(procurement_no,"focusout",lostfocus1,false);	
	   var cstmname=document.getElementById('vendername');
	   attachEventListener(cstmname,"focusout",lostfocus3,false);	
	   var cstadrs=document.getElementById('coaddrss');
	  attachEventListener(cstadrs,"focusout",lostfocus4,false);	
	} 

}


function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增
			if (tbno==0){
			   if(Cookies.get('INT_004')=='Y'){       //如果參數設為系統自動編號
			      objGetNo('venderno','V0000');
			   }
			   document.getElementById("venderno").focus();	
			   
			}else{
			   var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
				 var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        
				 document.getElementById("validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
				var today=new Date();
				var endday=today.addDays(parseInt(Cookies.get('INT_126'))); //加上參數預設有效天數
				var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
				document.getElementById("validend").value=endaydash;  //日期往後推 	
			}
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
			if (tbno==0){
			    document.getElementById("vendername").focus();
			    document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 		  			 
			    document.getElementById("vender_name").focus();
				document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來			
				var editinit=document.getElementsByName('d01update');
				document.getElementById('whonameEx').innerHTML=notWaitdata[1];//aWaitUpdate[30];				   
			}else{
				document.getElementById("custompartno").focus();				  			 				  
				 var editinit=document.getElementsByName('d02update');
				 document.getElementById('stockname').value=notWaitdata[0];
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
		 oTd.setAttribute("style","text-align:left;width:22%;");
		  oTd.setAttribute("class","directdata");
		 var oTd = oTr.insertCell(oTr.cells.length);				  
		 oTd.innerHTML=args[1];				  
		 oTd.setAttribute("style","text-align:left;width:78%;"); 
		 oTd.setAttribute("class","directdata");
	    for(var i=2;i<15;i++){    
		   var oTd = oTr.insertCell(oTr.cells.length);
		  oTd.innerHTML=args[i];
		  oTd.setAttribute("style","display:none;");
		  oTd.setAttribute("class","directdata");
	    }
		var oTd = oTr.insertCell(oTr.cells.length); //15
	    oTd.innerHTML=nongs[0];     //幣別名稱
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","indirectdata");
		
		for(var i=15;i<20;i++){    //-2
		  var oTd = oTr.insertCell(oTr.cells.length);
		  oTd.innerHTML=args[i];
		  oTd.setAttribute("style","display:none;");
		  oTd.setAttribute("class","directdata");
	    }
	    var oTd = oTr.insertCell(oTr.cells.length); 
	    oTd.innerHTML=nongs[1];     //採購員名字
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","indirectdata");
	    var oTd = oTr.insertCell(oTr.cells.length);  //備註
	    oTd.innerHTML=args[20];
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","directdata");	  
	    var oTd = oTr.insertCell(oTr.cells.length);  //最後交易  
	    oTd.setAttribute("style","display:none;");
	    oTd.setAttribute("class","directdata");
	    var oTd = oTr.insertCell(oTr.cells.length);	//最後異動		  	       
	    oTd.innerHTML=rsp.lastupdate;
	    oTd.setAttribute("style","text-align:left;display:none;");
	    oTd.setAttribute("class","directdata");	
	 
    }else{
	    var oTd = oTr.insertCell(oTr.cells.length);   //料號
	    oTd.innerHTML=args[0];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //品名
	    oTd.innerHTML=nongs[0];
		oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","indirectdata");
		var oTd = oTr.insertCell(oTr.cells.length);   //客戶品號
	    oTd.innerHTML=args[1];
	    oTd.setAttribute("style","text-align:left;");
	    oTd.setAttribute("class","directdata");		
	    var oTd = oTr.insertCell(oTr.cells.length);   //幣別
	    oTd.innerHTML=args[2];
	    oTd.setAttribute("style","width:4%;");
	    oTd.setAttribute("class","directdata");		
		for(var i=3;i<7;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //單價&&包裝基量&最少訂購&&前置天數
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		   oTd.setAttribute("style","width:7%;text-align:right;");
		}   
	
		for(var i=7;i<9;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);   //生效日與期限
		   oTd.innerHTML=args[i];
		   oTd.setAttribute("class","directdata");
		   oTd.setAttribute("style","width:8%;");
		}    
		var oTd = oTr.insertCell(oTr.cells.length);   //備註
		oTd.innerHTML=args[9];
		oTd.setAttribute("style","text-align:left;");
		oTd.setAttribute("class","directdata");	 
	    var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);					        			   										
	    document.getElementById('ttlmny').innerHTML=ttlcnt+1;  //更新畫面上的總金額
    }					  
	 //最後異動	
    var oTd = oTr.insertCell(oTr.cells.length);	
    oTd.setAttribute("class","directdata");					   
    oTd.innerHTML=rsp.lastupdate;	
    oTd.setAttribute("style","display:none;"); //最後異動要隱藏
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
    if (tbno==0){  		   					   
		var d01a_value_names=document.getElementsByName("d01value");
		
		var maintable=document.getElementById("maintbody1");	               
		for (var j=2;j<16;j++){				       
		   maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];
		   
		   d01a_value_names[j-1].innerHTML=args[j-1];
		}			
       
		maintable.rows[args[arglth-1]].cells[16].innerHTML=nongs[0];  //幣別名稱
	    d01a_value_names[15].innerHTML=nongs[0];
		for (var j=17;j<22;j++){				       
		   maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];		   
		   d01a_value_names[j-1].innerHTML=args[j-2];
		}						
		maintable.rows[args[arglth-1]].cells[22].innerHTML=nongs[1];  //採購人員姓名
	   d01a_value_names[21].innerHTML=nongs[1];
	   
		maintable.rows[args[arglth-1]].cells[23].innerHTML=args[20];  //備註  
		d01a_value_names[22].innerHTML=args[20];    
		
		var tpy=paycondition(d01a_value_names[18].innerHTML);	
		
		d01a_value_names[18].innerHTML=tpy;		
		
		maintable.rows[args[arglth-1]].cells[d01a_value_names.length].innerHTML=rsp.lastupdate;
		d01a_value_names[d01a_value_names.length-1].innerHTML=rsp.lastupdate;  //安全資料(最後異動)		
	}else{  //第二頁修改					 
		var maintable=document.getElementById("maintbody2");	                      					   
		var tbrlth=maintable.rows[args[arglth-1]].cells.length;			 
		for (var j=3;j<tbrlth-2;j++){				            
			 maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];						 
		}
		maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate;   
	}						
}
function searchOptionsKey(tbno,slt5){	
	if (tbno==0){
		slt5.options.add(new Option('廠商編號','d01.F01'));
		slt5.options.add(new Option('廠商名稱','d01.F04'));
		slt5.options.add(new Option('統一編號','d01.F06'));
		slt5.options.add(new Option('廠商地址','d01.F05'));		 		 
	} else{
		slt5.options.add(new Option('料品編號','d02.F03'));
		slt5.options.add(new Option('品名規格','b01.F02'));
		slt5.options.add(new Option('廠商品號','d02.F04'));				   									  
	}
}
function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
        return "請輸入廠商基本資料：";
    }else{
		return "請輸入此廠商詢價紀錄：";
	}						  
}
function editRecordHint(tbno){
    if (tbno==0){  
		return "修改廠商基本資料："; 
	}else{
		return "修改廠商詢價紀錄："; 
	}
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋廠商基本資料欄位選擇";
	}else{
		return "搜尋詢價紀錄欄位選擇";
	}
}

