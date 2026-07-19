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
	if (target.value=="\u{274E}"  && getAuth[2]()[0].INT_003 =='Y'){	   //直接點結束按鈕(新增修改刪除共用)
	   if(document.getElementById('customno')!=null){   //非於放棄刪除的狀態下
	      var currentNo=document.getElementById('customno').value;	   
	      if (currentNo.trim()!="" && currentNo.trim()!=document.getElementById('custom_no').innerHTML){ //如果非修改
		     discardNoRec('C0000',currentNo.trim());
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
	//document.getElementById('typeofpay').innerHTML+document.getElementById('paymentterm').innerHTML+'天'
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
	    var c01elements=document.getElementsByName('c01update');
        var c01athments=document.getElementsByName('c01others');	
		
	}else{
		 var c01elements=document.getElementsByName('c02update');	
		 var c01athments=document.getElementsByName('c02others');			 
	}
	for(var r=0;r<c01athments.length;r++){        //關聯資料
		    nonjsn.push(c01athments[r].tagName.toUpperCase()=='SPAN'?c01athments[r].innerHTML:c01athments[r].value);		
	}
	for(var q=1;q<c01elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c01elements[q].value);	   
	}
    if(tbno==1){   //如果是表身另外再特別處理一個付款條件塞入最後
	   tbjsn.push(document.getElementById('typeofpay').innerHTML+document.getElementById('paymentterm').innerHTML+'天');
	
	}
	for(var j=1;j<c01elements.length-3;j++){
        if(c01elements[j].value.trim()===""){		
		   if(j==1 || j==2 || j==3  || j==6 || j==8 || j==14 || j==15 || j==18 || j==19 || j==20 || j==23 || j==29 || j==30){
		      if ((j==1 || j==2 || j==3) && tbno==1){
			    c01elements[j].placeholder="不得空白" ;
			 }else{
		        filtermsg(c01elements[j],"不得空白");
			 }		     
		   
		     c01elements[j].focus();
		     return false ;
			}
			//if(!/^(\(\d+\)?)?(\d+[\-])*\d+$/.test(customerPhone.value))
		}else if(tbno==0 && j==5 && !/\d{8}/.test(c01elements[j].value)){	
	        filtermsg(c01elements[j],"統編錯誤");
		     c01elements[j].focus();
		     return false ;		
		}else if(tbno==0 && j==22 && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(c01elements[j].value)){
			filtermsg(c01elements[j],"電郵帳號錯誤!");
		     c01elements[j].focus();
		     return false ;		
		}else if(tbno==1 && (j==4 || j==5 || j==6) && c01elements[j].value == 0){
              
			filtermsg(c01elements[j],"不得為 0");
		      return false ;			
		   
			
        }else{		     
		   if(c01elements[j].nextSibling && !(((j==29 || j==30) && tbno==0 ) || ((j==1 || j==2 || j==3 ) && tbno==1))){		
 			   c01elements[j].parentNode.removeChild(c01elements[j].nextSibling);			  
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
        if(c01elements[1].value!="" ){
      
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


function calculateTtl(tbno,maintable,i){  //刪除後計算總數量   
    if (tbno==1){	//計算本單總金額	    
	   var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);		  					
	   document.getElementById('ttlmny').innerHTML=ttlcnt-1;	 
	}
	return;
}


function lostfocus3(event){        //新增修改時客戶名稱帶到發票抬頭與簡稱
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('customabbrv').value.trim()==""){
		document.getElementById('customabbrv').value=target.value.substring(0,4);
	 }
	 
     if(document.getElementById('invtitle').value.trim()==""){
		document.getElementById('invtitle').value=target.value;
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
function lostfocus5(event){        //新增修改時客戶編號帶到群組號碼
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('noofgroup').value.trim()==""){
		document.getElementById('noofgroup').value=target.value;
	 }
    return;	
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料
	   //如果異動表頭資料
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);		   
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='其他備註:';				
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=5;				
		 oTd.innerHTML="<input type='text' name='c01update' id='hokaremark' class='txt' maxlength='60' style='width:60%;'  />";                             	              		   
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='交貨方式:';				
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=3;				
		 oTd.innerHTML="<input type='text' name='c01update' id='howship' class='txt' maxlength='40' style='width:90%;'  />";                             	              		   
		 var oTd = oTr.insertCell(2);				
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='收件人:';				
		 var oTd = oTr.insertCell(3);	                
		 oTd.innerHTML="<input type='text' name='c01update' id='whorecive' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   		   
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);				
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='業務擔當:';				
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=2;				
		 oTd.innerHTML="<input type='text' name='c01update' id='whono' class='txt' maxlength='10' style='width:30%;'  />";                             	              		   
		 oTd.innerHTML+="<span name='c01others' id='whonameEx'></span>&nbsp&nbsp"; 		  
		 var srchButton1=document.createElement("input");				   
		 srchButton1.setAttribute("type","button");	
		 srchButton1.setAttribute("class","scopelook");				   
		 srchButton1.style.background="url('digits/brows1.png')";   
		 attachEventListener(srchButton1,"click",srchshow,false);				
		 oTd.appendChild(srchButton1);						
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='業務助理:';				
		 var oTd = oTr.insertCell(3);	
		 oTd.colspan=2;	                
		 oTd.innerHTML="<input type='text' name='c01update' id='assistno' class='txt' maxlength='10' style='width:30%;'  />";			     
		 oTd.innerHTML+="<span name='c01others' id='assistnameEx'></span>&nbsp&nbsp"; 
		 var srchButton2=document.createElement("input");				   
		 srchButton2.setAttribute("type","button");		
		 srchButton2.setAttribute("class","scopelook");						  
		 srchButton2.style.background="url('digits/brows1.png')"; 
		 attachEventListener(srchButton2,"click",srchshow,false);
		 oTd.appendChild(srchButton2);
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
		 slt11.setAttribute("name","c01update");
		 oTd.appendChild(slt11);	  				
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='票期(T/T)天數:';				
		 var oTd = oTr.insertCell(3);	
		 oTd.colspan=2;	                
		 oTd.innerHTML="<input type='number' name='c01update' id='daysofpay' class='txt' maxlength='2' value=0 style='text-align:right;width:20%;'  />";                             	              		   		              
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='交易幣別:';						
		 var oTd = oTr.insertCell(1);	     		
		 var slt4=document.createElement("select");
		 slt4.setAttribute("id","crntopt");
		 slt4.setAttribute("name","c01update");
		 oTd.appendChild(slt4);				 
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='結帳日:';				
		 var oTd = oTr.insertCell(3);	                
		 oTd.innerHTML="<input type='text' name='c01update' id='dayline' class='txt' value='31' maxlength='2' style='width:20%;'  />";                             	              		   		   
		 var oTd = oTr.insertCell(4);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='每月請款日:';				
		 var oTd = oTr.insertCell(5);	                
		 oTd.innerHTML="<input type='text' name='c01update' id='dayforapply' class='txt' value='01' maxlength='2' style='width:20%;'  />";				
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%;');	
		 oTd.innerHTML='E-mail:';				
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=3;				
		 oTd.setAttribute('style','width:55%;');	
		 oTd.innerHTML="<input type='email' name='c01update' id='mailaddress' class='txt' maxlength='50' style='width:70%;'  />";                             	              		   
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='母公司編號:';				
		 var oTd = oTr.insertCell(3);	                             
		 oTd.innerHTML="<input type='text' name='c01update' id='noofgroup' class='txt' maxlength='6' style='width:50%;'  />";                             	              		   		                              		    
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='電話:';				
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=2;				
		 oTd.innerHTML="<input type='tel' name='c01update' id='telNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='傳真:';				
		 var oTd = oTr.insertCell(3);	
		 oTd.colspan=2;					
		 oTd.innerHTML="<input type='tel' name='c01update' id='faxNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='聯絡人:';		               		
		 var oTd = oTr.insertCell(1);	
		 oTd.colspan=2;				
		 oTd.innerHTML="<input type='text' name='c01update' id='winman' class='txt' maxlength='20' style='width:60%;'  />";                             	             
		 var oTd = oTr.insertCell(2);	             
		 oTd.innerHTML='負責人:';		
		 oTd.setAttribute('style','text-align:right;width:12%');		
		 var oTd = oTr.insertCell(3);		
		 oTd.colspan=2;				
		 oTd.innerHTML="<input type='text' name='c01update' id='represent' class='txt' maxlength='20' style='width:60%;'  />";                             	             
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='出貨指示:';				
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=5;
		 oTd.innerHTML="<input type='text' name='c01update' id='directofship' class='txt'  maxlength='40'  style='width:25%;'  />";                             	             
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);				
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='英文地址:';	
		 oTd.colspan=5;				
		 var oTd = oTr.insertCell(1);
		 oTd.innerHTML="<input type='text' name='c01update' id='salescost' class='txt' maxlength='142' style='width:95%;'  />";                             
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='送貨地址:';				
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=5;
		 oTd.innerHTML="<input type='text' name='c01update' id='shipplace' class='txt'  maxlength='137'  style='width:90%;'  />";                             	             
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='公司地址:';				
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=5;
		 oTd.innerHTML="<input type='text' name='c01update' id='coaddrss' class='txt' maxlength='100' style='width:90%;' />";            	             
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='英文名稱:';				
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=5;
		 oTd.innerHTML="<input type='text' name='c01update' id='engname' class='txt' maxlength='95' style='width:90%;'  />";                             	            				           
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='發票種類:';
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=2;
		 var slt8=document.createElement("select");
		 slt8.options.add(new Option('三聯式','31'));
		 slt8.options.add(new Option('二聯式','32'));
		 slt8.setAttribute("id","invtype");
		 slt8.setAttribute("name","c01update");
		 oTd.appendChild(slt8);	  
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='課稅別:';
		 var oTd = oTr.insertCell(3);
		 oTd.colspan=2;
		 var slt6=document.createElement("select");
		 slt6.options.add(new Option('應稅','1'));
		 slt6.options.add(new Option('零稅','2'));
		 slt6.options.add(new Option('免稅','3'));
		 slt6.setAttribute("id","taxtype");
		 slt6.setAttribute("name","c01update");
		 oTd.appendChild(slt6);	                        	         
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='發票抬頭:';
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=3;
		 oTd.setAttribute('style','width:55%');
		 oTd.innerHTML="<input type='text' name='c01update' id='invtitle' class='txt' maxlength='40'  style='width:90%;'/>";                             
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='發票品號:';
		 var oTd = oTr.insertCell(3);
		 var slt3=document.createElement("select");				 
		 slt3.options.add(new Option('我方','1'));
		 slt3.options.add(new Option('客方','2'));								
		 slt3.setAttribute("id","invpnopt");
		 slt3.setAttribute("name","c01update");
		 oTd.appendChild(slt3);				
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='客戶類型:';
		 var oTd = oTr.insertCell(1);
		 oTd.innerHTML="<input type='text' name='c01update' id='customertype' class='txt' maxlength='20' style='width:80%;text-align:left;'  />";                             
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='主要產品:';
		 var oTd = oTr.insertCell(3);
		 oTd.innerHTML="<input type='text' name='c01update' id='forproduct' class='txt' maxlength='20' style='width:80%;text-align:left;' />";    
		 var oTd = oTr.insertCell(4);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='地區別:';
		 var oTd = oTr.insertCell(5);
		 oTd.innerHTML="<input type='text' name='c01update' id='whereis' class='txt' maxlength='20' style='width:80%;' />";    	   
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='客戶簡稱:';
		 var oTd = oTr.insertCell(1);
		 oTd.innerHTML="<input type='text' name='c01update' id='customabbrv' class='txt' maxlength='8' style='width:45%;'  />";                             
		 var oTd = oTr.insertCell(2);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='重要等級:';
		 var oTd = oTr.insertCell(3);
		 var slt9=document.createElement("select");
		 slt9.options.add(new Option('A','A'));
		 slt9.options.add(new Option('B','B'));
		 slt9.options.add(new Option('C','C'));
		 slt9.options.add(new Option('X','X'));
		 slt9.setAttribute("id","mngtpe");
		 slt9.setAttribute("name","c01update");
		 oTd.appendChild(slt9);	                                        
		 var oTd = oTr.insertCell(4);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='統一編號:';
		 var oTd = oTr.insertCell(5);
		 oTd.innerHTML="<input type='text' name='c01update' id='unino' class='txt' maxlength='8' style='width:50%;text-align:left;'  />";                             				
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:12%');	
		 oTd.innerHTML='客戶編號:';
		 var oTd = oTr.insertCell(1);		
		 oTd.setAttribute('style','width:15%');				
		 if(txtword==2){   //如果是修改			   
		    oTd.innerHTML="<input type='text' name='c01update' id='customno' class='txt' style='background-color:#B9B9FF;width:65%;' maxlength='6' readOnly=true  />"; 
		    optionitem(aWaitUpdate[24],slt4.id,4,"C01/BKND/C00srch.php");		//幣別欄位			 
		 }else{
			oTd.innerHTML="<input type='text' name='c01update' id='customno' class='txt' style='width:65%;' maxlength='6'/>"; 
			optionitem(getAuth[2]()[0].INT_011,slt4.id,4,"C01/BKND/C00srch.php");				//參數預設幣別
		 }			 
		 var oTd = oTr.insertCell(2);	   
		 oTd.setAttribute('style','text-align:right;width:12%');					
		 oTd.innerHTML='客戶名稱:';
		 var oTd = oTr.insertCell(3);
		 oTd.colspan=3;		
		 oTd.innerHTML="<input type='text' name='c01update' id='customname' class='txt' style='width:80%;' maxlength='40'    />";  				
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		 var oTd = oTr.insertCell(0);	             
		 oTd.innerHTML='紀錄號碼';
		 var oTd = oTr.insertCell(1);
		 oTd.colspan=5;
		 oTd.innerHTML="<input type='text' name='c01update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		 oTr.setAttribute("style","display:none;");		
	}else{    //表身報價紀錄
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='備註說明:';
		  var oTd = oTr.insertCell(1);
		  oTd.colspan=3;
		  oTd.innerHTML="<input type='text' name='c02update' class='txt' id='remark'  style='width:40%;'  />"; 	
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='生效日期:';
		  var oTd = oTr.insertCell(1);
		  oTd.innerHTML="<input type='date' name='c02update' class='txt' id='validstart'  style='width:45%;'  />";  
		  var oTd = oTr.insertCell(2);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='有效期限:';
		  var oTd = oTr.insertCell(3);
		  oTd.innerHTML="<input type='date' name='c02update' class='txt' id='validend'  style='width:45%;'  />"; 
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='報價單號:';
		  var oTd = oTr.insertCell(1);
		  oTd.colspan=3;
		  oTd.innerHTML="<input type='text' name='c02update' class='txt' id='queryno'  style='width:35%;'/>";  					
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
		  oTd.innerHTML="<input type='number' name='c02update' id='minumqty' value=1 class='txt' style='width:30%;text-align:right;'/>";  
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='幣別:';
		  var oTd = oTr.insertCell(1);        
		  var slt4=document.createElement("select");
		  slt4.setAttribute("id","crnttype");
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
		  oTd.innerHTML="<input type='text' name='c02update' id='custompartno' class='txt' style='width:50%;' maxlength='30'/>"; 				 		 
		if(txtword==1){   //如果是新增
			   var srchButton12=document.createElement("input");				   
			   srchButton12.setAttribute("type","button");	
			   srchButton12.setAttribute("class","scopelook");				   
			   srchButton12.style.background="url('digits/brows1.png')";   			 
                attachEventListener(srchButton12,"click",srchshow,false);				  
			   oTd.appendChild(srchButton12);			
		}
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='品名規格:';
		  var oTd = oTr.insertCell(1);      
		   oTd.colspan=3;
		   if(txtword==2){   //如果是修改
			  oTd.innerHTML="<input type='text' name='c02others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />"; 			  
			  optionitem(aWaitUpdate[3],slt4.id,4,"C01/BKND/C00srch.php");		   		   
		   }else{
			  oTd.innerHTML="<input type='text' name='c02others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
			  var crn=document.getElementById('typeofcrnt').innerHTML;					   
			  optionitem(crn,slt4.id,4,"C01/BKND/C00srch.php");
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
		   oTd.colspan=3;
		 if(txtword==2){   //如果是修改	
			  oTd.innerHTML="<input type='text' name='c02update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
		 }else{
			  oTd.innerHTML="<input type='text' name='c02update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	    oTd.innerHTML="<input type='text' name='c02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");			   
	}
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	
	if(txtword==7){
		dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整 
	}else{	
        if (tbno==0){	
	        dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整 
		}else{
		     dropsheet_content.style.width="65%";   //原訊息內框畫面寬度調整 
		}
	}		
    dropsheet.style.paddingTop="20px";      // 高度也往上提 	
	if ((tbno==0) && txtword!=7){			
	    var cstmname=document.getElementById('customname');
	    attachEventListener(cstmname,"focusout",lostfocus3,false);	
	    var cstadrs=document.getElementById('coaddrss');
	    attachEventListener(cstadrs,"focusout",lostfocus4,false);	
	    var cstno=document.getElementById('customno');
	    attachEventListener(cstno,"focusout",lostfocus5,false);	
	}
    return true;
}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增
			 if (tbno==0){	
				if(getAuth[2]()[0].INT_003 =='Y'){       //如果參數設為系統自動編號
				    objGetNo('customno','C0000');
				}	 
				var cstNo=document.getElementById("customno");
				cstNo.focus();	
				var acntNo1=document.getElementById("whono");				 
				attachEventListener(acntNo1,"change",a01AccountName,false);	//找帳號姓名
				var acntNo2=document.getElementById("assistno");				 
				attachEventListener(acntNo2,"change",a01AccountName,false);	//找帳號姓名
			 }else{
				 var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
				 var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        
				 document.getElementById("validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
				var today=new Date();
				var endday=today.addDays(parseInt(getAuth[2]()[0].INT_126)); //加上參數預設有效天數
				var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();	
				document.getElementById("validend").value=endaydash;  //日期往後推			 
			 }
		     break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
			 if (tbno==0){
				document.getElementById("customname").focus();
				document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 		  
				var editinit=document.getElementsByName('c01update');								 
				document.getElementById('whonameEx').innerHTML=notWaitdata[1];//aWaitUpdate[30];	
				document.getElementById('assistnameEx').innerHTML=notWaitdata[2]; //aWaitUpdate[32];
				var acntNo1=document.getElementById("whono");				 
				attachEventListener(acntNo1,"change",a01AccountName,false);	//找帳號姓名
				var acntNo2=document.getElementById("assistno");				 
				attachEventListener(acntNo2,"change",a01AccountName,false);	//找帳號姓名
			 }else{
				 document.getElementById("custompartno").focus();				  			 				  
				 var editinit=document.getElementsByName('c02update');
				 document.getElementById('stockname').value=notWaitdata[0];				 
			 }	
			 for(var k=0;k<editinit.length;k++){ //8
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
        var fldidx=0;
		var argsNo=0;
		var nongsNo=0;	
		while(rsp.fldsatrr[fldidx]){
			var oTd = oTr.insertCell(oTr.cells.length); 			
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				oTd.innerHTML=args[argsNo];
				if(argsNo==22){
					if(args[22]!=rsp.group_no){
			           oTr.cells[23].innerHTML=rsp.group_no;  //修正群組號碼以免亂打
					}
		        }				
				argsNo++;
			}else{						
				if(fldidx>35){
				   nongs[nongsNo]='0000-00-00';
				}					
				oTd.innerHTML=nongs[nongsNo];	
				nongsNo++;
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
		if(tbno==1){
		   var ttlcnt=Number(document.getElementById('ttlmny').innerHTML);					        			   											
		   document.getElementById('ttlmny').innerHTML=ttlcnt+1;  //更新畫面上的筆數
		}
  
		 //最後異動		
	  var oTd = oTr.insertCell(oTr.cells.length);	
	  oTd.setAttribute("class","directdata");					   
	  oTd.innerHTML=rsp.lastupdate;	
	  oTd.setAttribute("style","display:none;"); //最後異動要隱藏
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	
	if (tbno==0){     //處理表頭修改   	   								
		var maintable=document.getElementById("maintbody1");
		var c01a_value_names=document.getElementsByName("c01value");
	 }else{
	    var maintable=document.getElementById("maintbody2");	
	 }		 	         		             			   	 	
	var fldidx=1;
	var argsNo=1;
	var nongsNo=0;	
	while(rsp.fldsatrr[fldidx]){			
		if(rsp.fldsatrr[fldidx][0]=='directdata'){
			 maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];	
			 if (tbno==0){     //處理表頭修改  
			     c01a_value_names[fldidx].innerHTML=args[argsNo];
			 }
			argsNo++;
		}else{
			if (tbno==0){     //處理表頭修改  
			    if(nongs[nongsNo]){
			        c01a_value_names[fldidx].innerHTML=nongs[nongsNo].trim();
				}				
			 }
			 if(nongs[nongsNo]){
			    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo].trim();	
			 }			
			 nongsNo++;
		}		
		fldidx++;
	}
	if (tbno==0){     //處理表頭修改  
	    c01a_value_names[9].innerHTML=(c01a_value_names[9].innerHTML=='1'?'我方':'客方') ; //發票顯示
	    c01a_value_names[10].innerHTML=(c01a_value_names[10].innerHTML=='31'?'三聯式':'二聯式') ; //稅別								
	    c01a_value_names[11].innerHTML=(c01a_value_names[11].innerHTML=='1'?'應稅':(c01a_value_names[11].innerHTML=='2'?'零稅':'免稅')) ; //稅別
	  	var telno=c01a_value_names[19].innerHTML;
		c01a_value_names[19].innerHTML="<a href='tel:+" + telno + "'>" + telno + "</a>";
	    var tpy=c01a_value_names[27].innerHTML;
	    c01a_value_names[27].innerHTML=paycondition(tpy);
		if(args[22]!=rsp.group_no){					   	
		    maintable.rows[args[arglth-1]].cells[23].innerHTML=rsp.group_no; //修正群組號碼以免亂打
		    c01a_value_names[22].innerHTML=rsp.group_no; 
		    blkshow('母公司編號'+args[22]+'不在客戶主檔中!系統自動修正與客戶編號相同!')
	    }		
		c01a_value_names[c01a_value_names.length-1].innerHTML=rsp.lastupdate;	
	}		
	maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=rsp.lastupdate;			   
}

function  addNewRecordHint(tbno){
   if (tbno==0){  //表頭資料
        return "請輸入客戶基本資料：";
	}else{
		return "請輸入此客戶報價紀錄：";
	}						 

}
function editRecordHint(tbno){
    if (tbno==0){  
		return "修改客戶基本資料："; 
	}else{
		return "修改客戶報價紀錄："; 
	}
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋客戶基本資料欄位選擇";
	}else{
		return "搜尋報價紀錄欄位選擇";
	}
}

function srcArgobj(srcId){
    if(srcId=='whono'){
	   var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取業務人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};	  
    }else if(srcId=='assistno'){
	    var qrystring=document.getElementById(srcId).value;
        return {"headtitle":"請選取助理人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg2,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
	}else{
		var cstno=document.getElementById('keydscrpt1').innerHTML;
		var stockNo=document.getElementById(srcId).value;
		 
		var tttlt='';
	    if(srcId=='stockno'){			     
		    var qrystring ="b01.F01"+"|"+stockNo+"_"+left(cstno,6);
			tttlt="請選取料號";          			
	    }else if(srcId=='stockname'){			 
		    var qrystring ="b01.F02"+"|"+stockNo+"_"+left(cstno,6); 			 
			tttlt="請選取品名";
		}else{
		    var qrystring ="c34.F03"+"|"+stockNo+"_"+left(cstno,6);  
		    tttlt="請選取客戶料號";
		}
		return {"headtitle":tttlt,"drpshtWidth":"60%","thCntnt":['料品編號', '品名規格','客戶品號'],"thWidth":['30%','40%','30%'],"urlPth":"C21/BKND/B01srch.php","clickfunc":stckchg,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
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
function chseprg2(event)  //選擇助理
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	
	var stuffNo=document.getElementById('assistno');
	stuffNo.value="";
	var stuffName=document.getElementById('assistnameEx');
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
	 var unitName=document.getElementById('unitname');
	 var basicqty=document.getElementById('basepack');
	 var minumorder=document.getElementById('minumqty');
	 var custstockno=document.getElementById('custompartno');
	 var queryquintity=document.getElementById('queryqty');	 
	 var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stockNo.value=maintable.rows[i].cells[0].innerHTML;	
			 if(stockName){
				stockName.value=maintable.rows[i].cells[1].innerHTML;	
			 }	
			 if(unitName){
				unitName.innerHTML=maintable.rows[i].cells[2].innerHTML;
			 }		
			 if(basicqty){
				basicqty.value=maintable.rows[i].cells[3].innerHTML ;
			 }			 
			 if(minumorder){
				minumorder.value=maintable.rows[i].cells[4].innerHTML;
			   }
			 if(custstockno){
				custstockno.value=maintable.rows[i].cells[5].innerHTML;
			 }  
			 if(queryquintity){
				queryquintity.value=minumorder.value;
			 }  
			 break;
		}				 
	}             
	
	srchblkclose(event);	
	 
	return true;
}	