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
	var recordNo=document.getElementById("rcrd_no");
    //----資料寫入資料庫前過濾程序區-----//
	var tbno=0;
	 	
	var d02elements=document.getElementsByName('d02update');	
	var d02athments=document.getElementsByName('d02others');
	for(var r=0;r<d02athments.length;r++){        //關聯資料
		    nonjsn.push(d02athments[r].tagName.toUpperCase()=='SPAN'?d02athments[r].innerHTML:d02athments[r].value);		
	}

	for(var q=1;q<d02elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(d02elements[q].value);	   
	}
	for(var j=1;j<d02elements.length-1;j++){  //最後一欄備註不過濾
        if(d02elements[j].value.trim()==="" ){		
		    if (j==1){
			  d02elements[j].placeholder="不得空白" ;
		     }else{
		        filtermsg(d02elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(d02elements[j].nextSibling){		      
			  d02elements[j].parentNode.removeChild(d02elements[j].nextSibling);
		   }	
	    }
		if(d02elements[j].value<=0 && (j==5 || j==6 || j==7 || j==9)){
				if(!d02elements[j].nextSibling){
		         
		          filtermsg(d02elements[j],"不得小於等於 0");
		       		 
		        }	 		       
		        return false ;
			}else{
			   if(d02elements[j].nextSibling){		
			      if(j!=1 ){
			         d02elements[j].parentNode.removeChild(d02elements[j].nextSibling);
				  }
		        }	
			}
		
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(d02elements[1].value!="" ){
           //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
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
			 var vndnm=document.getElementById('vendorname');
			 vndnm.value=rsp[0]['vendorname'];
			 if (!vndnm.value){
				targetVendorNo.placeholder='無此編號';
				targetVendorNo.focus();
			 }
	          
		  }
	}
	return;
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='備註:';
	  var oTd = oTr.insertCell(1);       
	   oTd.colspan=3;
	  oTd.innerHTML="<input type='text' name='d02update' id='dscrpt' class='txt' style='width:80%;' maxlength='40'/>";  				  	
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='生效日期:';
	  var oTd = oTr.insertCell(1);
	  oTd.innerHTML="<input type='date' name='d02update' class='txt' id='validstart'  style='width:70%;'  />";  				   				   			 	              
	  var oTd = oTr.insertCell(2);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='有效期限:';
	  var oTd = oTr.insertCell(3);
	  oTd.innerHTML="<input type='date' name='d02update' class='txt' id='validend'  style='width:70%;'  />"; 
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='前置天數:';
	  var oTd = oTr.insertCell(1);           
	  oTd.colspan=3;
	  oTd.innerHTML="<input type='number' name='d02update' class='txt'  id='ltdays' value=1 style='width:20%;text-align:right;'  maxlength='3'/>";
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='付款條件:';
	  var oTd = oTr.insertCell(1);           
	  oTd.colspan=3;
	  oTd.innerHTML="<input type='text' name='d02update' id='payment' class='txt' style='width:50%;' maxlength='30'/>";		   
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='最少訂購:';
	  var oTd = oTr.insertCell(1);               	       
	  oTd.innerHTML="<input type='number' name='d02update' id='minumqty' class='txt' value=1 style='width:50%;text-align:right;' maxlength='3' />";		
	  var oTd = oTr.insertCell(2);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='包裝基量:';
	  var oTd = oTr.insertCell(3);               	       
	  oTd.innerHTML="<input type='number' name='d02update' id='basepack' class='txt' value=1 style='width:50%;text-align:right;' maxlength='30'/>";			     
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
	  oTd.innerHTML="<input type='number' name='d02update' id='unitprice' class='text' value=0 style='width:50%;text-align:right;' />";				  
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='廠商品號:';
	  var oTd = oTr.insertCell(1);			     
	  oTd.innerHTML="<input type='text' name='d02update' id='csurompartno' class='txt' style='width:70%;' maxlength='30' />";                             			 
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='廠商代號:';
	  var oTd = oTr.insertCell(1);               	            				  
	  oTd.innerHTML="<input type='text' name='d02update' id='vendorno' class='txt' style='width:35%;' maxlength='6'    />"; 				  
	  var srchButton3=document.createElement("input");				   
	  srchButton3.setAttribute("type","button");	
	  srchButton3.setAttribute("class","scopelook");				   
	  srchButton3.style.background="url('digits/brows1.png')";   
	  attachEventListener(srchButton3,"click",vendornoshow,false);				
	  oTd.appendChild(srchButton3);							  
	  var oTd = oTr.insertCell(2);
	  oTd.setAttribute('style','text-align:right;width:15%');	
	  oTd.innerHTML='廠商簡稱:';
	  var oTd = oTr.insertCell(3);               
	  oTd.innerHTML="<input type='text' name='d02others' id='vendorname' class='txt' style='width:35%;' maxlength='8'    />";  				 
	  var srchButton2=document.createElement("input");				   
	  srchButton2.setAttribute("type","button");	
	  srchButton2.setAttribute("class","scopelook");				   
	  srchButton2.style.background="url('digits/brows1.png')";   
	  attachEventListener(srchButton2,"click",vendornoshow,false);				
	  oTd.appendChild(srchButton2);									  
	  var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='料品編號:';
	  var oTd = oTr.insertCell(1);     
	  oTd.colspan=3;
	  if(txtword==2){   //如果是修改	
		  oTd.innerHTML="<input type='text' name='d02update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  	
		   optionitem(aWaitUpdate[4],slt4.id,4,"D01/BKND/D00srch.php");		//幣別欄位	
	  }else{
		  oTd.innerHTML="<input type='text' name='d02update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
		   optionitem(Cookies.get('INT_011'),slt4.id,4,"D01/BKND/D00srch.php");	
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
	  oTd.colspan=3;
	  oTd.innerHTML="<input type='text' name='d02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	  oTr.setAttribute("style","display:none;");	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="15px";      // 高度也往上提 	
    return true;
}


function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增		   
		    var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		    var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日			        
		    document.getElementById("validstart").value=thtdy;  //日期都設為今天
				//以下這一串是在算往後推的日期
			var today=new Date();
			var endday=today.addDays(parseInt(Cookies.get('INT_126'))); //加上參數預設有效天數
			var endaydash=endday.getFullYear()+'-'+MyMonth(endday.getMonth())+'-'+((endday.getDate()<10) ? "0" : "") + endday.getDate();						
			////////////////
			document.getElementById("validend").value=endaydash;  //日期往後推
			document.getElementById("stockno").focus(); 
			var cstNo=document.getElementById("vendorno");						 
			 attachEventListener(cstNo,"change",d01VendorName,false);	//找廠商名稱
			break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
			var vndNo=document.getElementById("vendorno");
			vndNo.focus();	
			attachEventListener(vndNo,"change",d01VendorName,false);	//找廠商名稱			
			document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 		  
			var editinit=document.getElementsByName('d02update');		   
			document.getElementById('vendorname').value=notWaitdata[0];
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
    var oTd = oTr.insertCell(oTr.cells.length);   //料號
	oTd.innerHTML=args[0];
	oTd.setAttribute("class","directdata");	
    oTd.setAttribute("style","text-align:left;");				   
	var oTd = oTr.insertCell(oTr.cells.length);   //廠商編號
	oTd.innerHTML=args[1];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:left;width:7%;");
	var oTd = oTr.insertCell(oTr.cells.length);   //廠商簡稱
	oTd.innerHTML=nongs[0];
	oTd.setAttribute("class","indirectdata");
	oTd.setAttribute("style","text-align:left;width:7%;");
	var oTd = oTr.insertCell(oTr.cells.length);   //廠商品號
	oTd.innerHTML=args[2];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:left;");
	var oTd = oTr.insertCell(oTr.cells.length);   //幣別
	oTd.innerHTML=args[3];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:left;width:4%;");
	for(var i=4;i<7;i++){
		var oTd = oTr.insertCell(oTr.cells.length);   //單價最少採購包裝基量
		oTd.innerHTML=args[i];
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","text-align:right;width:7%;");
	}
	var oTd = oTr.insertCell(oTr.cells.length);   //付款條件
	oTd.innerHTML=args[7];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:left;");
	var oTd = oTr.insertCell(oTr.cells.length);   //前置天數
	oTd.innerHTML=args[8];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:right;width:7%;");
	for (var i=9;i<11;i++){
		var oTd = oTr.insertCell(oTr.cells.length);   //生效日期失效日期
		oTd.innerHTML=args[i];
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","text-align:left;width:8%;");
	}
	var oTd = oTr.insertCell(oTr.cells.length);   //備註
	oTd.innerHTML=args[11];
	oTd.setAttribute("class","directdata");
	oTd.setAttribute("style","text-align:left;");
	//最後異動
	var oTd = oTr.insertCell(oTr.cells.length);				       
	oTd.innerHTML=rsp.lastupdate;			
	oTd.setAttribute("style","display:none;");   		
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	var maintable=document.getElementById("maintbody1");	 
	var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
							
	maintable.rows[args[arglth-1]].cells[2].innerHTML=args[1];						 
	maintable.rows[args[arglth-1]].cells[3].innerHTML=nongs[0];			
	for (var j=4;j<tbrlth-2;j++){
		maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];			
	}
	/***********************************************************/                    
	maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動						   
}
function searchOptionsKey(tbno,slt5){	
	slt5.options.add(new Option('料品編號','d02.F03'));
	slt5.options.add(new Option('廠商品號','d02.F04'));
	slt5.options.add(new Option('廠商編號','d02.F01'));
	slt5.options.add(new Option('廠商簡稱','d01.F04'));
}
function  addNewRecordHint(tbno){
   return "請輸入相關料號：";		
}
function editRecordHint(tbno){
     return "修改相關料號："; 
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
   return "搜尋詢價紀錄欄位選擇";		
}