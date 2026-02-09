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
			  var query_no="BExxxxxxxx";
			}
	      if(document.getElementById('queryno')!=null){			  
	         var currentNo=document.getElementById('queryno').value;	            	 
	         if (currentNo.trim()!="" && currentNo.trim()!=query_no){ //如果非修改且自動編號		         
		   	     var thtdy=document.getElementById('recmth').value;
				 discardNoRec('BE'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
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
	    var b06elements=document.getElementsByName('b06update');
        var b06athments=document.getElementsByName('b06others');			
	}else{
		 var b06elements=document.getElementsByName('b0fupdate');	
		 var b06athments=document.getElementsByName('b0fothers');			 
	}
	for(var r=0;r<b06athments.length;r++){        //關聯資料
		    nonjsn.push(b06athments[r].tagName.toUpperCase()=='SPAN'?b06athments[r].innerHTML:b06athments[r].value);		
	}
	for(var q=1;q<b06elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(b06elements[q].value);	   
	}
	for(var j=1;j<b06elements.length-1;j++){
		if(tbno==0 && j==2){
			  let oDate=new Date(document.getElementById('recmth').value+'-'+b06elements[j].value);
		      let cYear = oDate.getFullYear();
              let cMonth = oDate.getMonth() + 1;
              let cDate = oDate.getDate();
			  let iYear=left(document.getElementById('recmth').value,4);
			  let iMonth=right(document.getElementById('recmth').value,2);
			  let iDate=paddingLeft(b06elements[j].value.trim(),2);
			  let result = (iYear == cYear) && (iMonth == cMonth) && (iDate == cDate);
			  if(!result){
				  filtermsg(b06elements[j],"日期格式不對");
				  return false ;
			  }else{
	    	    if(b06elements[j].nextSibling){		      
			       b06elements[j].parentNode.removeChild(b06elements[j].nextSibling);
		        }		
	          }
	    }
		
        if(b06elements[j].value.trim()=="" && !(j==3 && tbno==1) && !(j==5  && tbno==0)){		//|| j==8 || j==9
		     
			    b06elements[j].placeholder="不得空白" ;
				
			  
		     return false ;
        }else{		     
		   if(b06elements[j].nextSibling ){		
		       if(!((j==4 && tbno==0) || (j==1 && tbno==1))){		   //非人名與料號移除
             
			      b06elements[j].parentNode.removeChild(b06elements[j].nextSibling);
				  
			   }			   
		   }
		   if(tbno==1 && j==2){			      
		      if(b06elements[j].value == 0){
			     filtermsg(b06elements[j],"不得為 0");
				  return false ;
			  }
		     
		   } 
		   if(tbno==0 && j==4){
		      if(b06elements[4].value==b06elements[3].value){
				   filtermsg(b06elements[j],"轉出跟轉入部門不得相同!");
				  return false ;
			  }
		   }
	    }	    
	}
    //--------過濾區結束----------//		
    if (updflg==1){     //如果是新增	 	   
        if(b06elements[1].value!="" ){		 
		    if(tbno==0){ //表頭新增
                var blngmth=document.getElementById('recmth').value;
		        tbjsn.push(blngmth);   //要多一個所屬年月參數						 
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
		
		var tablerowindex=sourceAccount(null,tbno);   //記住是目前table的哪一列	
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
         var rspns=TableToJson(tbjsn,nonjsn,tbno); 	
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}

function billNoReCreate(currentNo){         //刪除確認(delConfirm)中挑出之個別程序
    if (getCookie('INT_099')=='Y' && getCookie('INT_127')=='Y'){ //如果是系統參數設為自動編號且刪掉號碼重用			
		var thtdy=document.getElementById('recmth').value;
		discardNoRec('BE'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase(),currentNo.trim());
	} 
    return;
}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料			     				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='備註說明:';
	    var oTd = oTr.insertCell(1);   	     
	    oTd.innerHTML="<input type='text' name='b06update' id='shipdirect' class='txt' style='width:55%;' maxlength='40'    />";  		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='轉入部門:';
	    var oTd = oTr.insertCell(1);               	              
	    oTd.innerHTML="<input type='text' name='b06update' id='deptno2' class='txt' style='width:15%;' maxlength='6'    />";  				  
	    oTd.innerHTML+="<span name='b06others' id='deptname2'></span>&nbsp&nbsp";  
	    var srchButton6=document.createElement("input");				   
	    srchButton6.setAttribute("type","button");	
	    srchButton6.setAttribute("class","scopelook");				   
	    srchButton6.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton6,"click",srchshow,false);		//		
	    oTd.appendChild(srchButton6);								    	   
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='轉出部門:';
	    var oTd = oTr.insertCell(1);               	              
	    oTd.innerHTML="<input type='text' name='b06update' id='deptno1' class='txt' style='width:15%;' maxlength='6'    />";  				  
	    oTd.innerHTML+="<span name='b06others' id='deptname1'></span>&nbsp&nbsp";  
	    var srchButton5=document.createElement("input");				   
	    srchButton5.setAttribute("type","button");	
	    srchButton5.setAttribute("class","scopelook");				   
	    srchButton5.style.background="url('digits/brows1.png')";   
	    attachEventListener(srchButton5,"click",srchshow,false);		//		
	    oTd.appendChild(srchButton5);								  		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='移轉日:';
	    var oTd = oTr.insertCell(1);            		
	    oTd.innerHTML="<input type='text' name='b06update' id='shipdate' class='txt' style='width:8%;' maxlength='2'   />";  	 	 			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='移轉單號:';
	    var oTd = oTr.insertCell(1);		
	    oTd.colspan=3;				  
	    if(txtword==2){   //如果是修改		                    
	 	   oTd.innerHTML="<input type='text' name='b06update' id='queryno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='10' readOnly=true  />";		    				 	         
		}else{
		   oTd.innerHTML="<input type='text' name='b06update' id='queryno' class='txt' style='width:25%;' maxlength='10'/>"; 		     	 
	    }			             
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);	  
	    oTd.innerHTML="<input type='text' name='b06update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
    }else{               //異動表身資料			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='備註:';
	    var oTd = oTr.insertCell(1);		
		oTd.innerHTML="<input type='text' name='b0fupdate' id='extradsp' class='txt' style='width:50%;' maxlength='20'/>"; 				 		    
 	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
   	    oTd.innerHTML='數量:';
	    var oTd = oTr.insertCell(1);      
	    oTd.innerHTML="<input type='number' name='b0fupdate' id='queryqty' value=1 class='txt' style='width:20%;text-align:right;' />";	    
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='品名規格:';
	    var oTd = oTr.insertCell(1);      
	    if(txtword==2){   //如果是修改
		   oTd.innerHTML="<input type='text' name='b06others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	    }else{
		   oTd.innerHTML="<input type='text' name='b0fothers' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
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
		    oTd.innerHTML="<input type='text' name='b0fupdate' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	    }else{
		    oTd.innerHTML="<input type='text' name='b0fupdate' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	    oTd.innerHTML="<input type='text' name='b0fupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
	}				  			             	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno){	 	 
	dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整  
		dropsheet.style.paddingTop="25px";      // 高度也往上提 
		if(txtword==7){		
		    dropsheet_content.style.width="65%"; 
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
				objGetNo('queryno','BE'+thtdy.substring(2,4)+parseInt(thtdy.substring(5,7)).toString(16).toUpperCase());
				document.getElementById("shipdate").focus();		
                var dptNo1=document.getElementById("deptno1");
				var dptNo2=document.getElementById("deptno2"); 					 
				attachEventListener(dptNo1,"change",a14DepartName,false);	//找轉出部門名稱
				attachEventListener(dptNo2,"change",a14DepartName,false);	//找轉入部門名稱
		   }else{
																
				document.getElementById("stockno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			  document.getElementById("shipdate").focus();				  			 				  
			  var editinit=document.getElementsByName('b06update');
			  document.getElementById('deptname1').innerHTML=notWaitdata[0];
			  document.getElementById('deptname2').innerHTML=notWaitdata[1];  
			  var dptNo1=document.getElementById("deptno1");
			  var dptNo2=document.getElementById("deptno2"); 					 
			  attachEventListener(dptNo1,"change",a14DepartName,false);	//找轉出部門名稱
			  attachEventListener(dptNo2,"change",a14DepartName,false);	//找轉入部門名稱
		   }else{
			   document.getElementById("queryqty").focus();				  			 				  
			  var editinit=document.getElementsByName('b0fupdate');
			  document.getElementById('stockname').value=notWaitdata[0];
			  
		   }
		   for(var k=0;k<editinit.length;k++){ 
			   editinit[k].value=aWaitUpdate[k]			 							   
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
		while(rsp.fldsatrr[fldidx]){
			var oTd = oTr.insertCell(oTr.cells.length); 			
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				oTd.innerHTML=args[argsNo];
				argsNo++;
			}else{		               			   
				if(tbno==0 && fldidx==7){   //確認				 
				   oTd.innerHTML='N';				   
				}				
			    if(tbno==1 && fldidx==1){   //品名
				   oTd.innerHTML=nongs[0];				    
				}
				if(tbno==0 && fldidx==3){   //轉出部門名稱
				   oTd.innerHTML=nongs[0];				   
				}
			   	if(tbno==0 && fldidx==5){   //轉入部門名稱
				   oTd.innerHTML=nongs[1];				   
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
	 
       oTd.setAttribute("style","width:12%;text-align:center;"); 
	 
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動       
	if (tbno==0){
	    var maintable=document.getElementById("maintbody1");		
	    var fldidx=1;
		var argsNo=1;
		var nongsNo=0;				
	}
	else{
	   var maintable=document.getElementById("maintbody2");
	    var fldidx=2;
		var argsNo=1;
		var nongsNo=0;								
	} 
		while(rsp.fldsatrr[fldidx]){			
		    	
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				 		
			   	   maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];	
				  
				argsNo++;
			}else{				
			      maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=nongs[nongsNo];
				
				nongsNo++;
			}		 		
			fldidx++;
		}		
		maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=rsp.lastupdate;

}
function transConfirm(oTd){
   
    return true;
}   
function searchOptionsKey(tbno,slt5){	
    if (tbno==0){		 
		 slt5.options.add(new Option('移轉單號','b06.F01'));		  		 
		 slt5.options.add(new Option('移轉日期','b06.F02'));
		 slt5.options.add(new Option('轉出部門編號','b06.F05')); 
		 slt5.options.add(new Option('轉出部門名稱','a1A.F02')); 
		 slt5.options.add(new Option('轉入部門編號','b06.F07')); 
		 slt5.options.add(new Option('轉入部門名稱','a1B.F02')); 
		 slt5.options.add(new Option('已確認?(Y/N)','b06.F10')); 			
	}else{
		 slt5.options.add(new Option('料品編號','b0f.F03'));
		 slt5.options.add(new Option('品名規格','b01.F02'));
							  
	}
}

function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
	   return "請輸入移轉單表頭資料：";
    }else{
	   return "請輸入移轉單:"+sourceAccount(1,0)+"內容資料："; 
    }		
}

function editRecordHint(tbno){
    if (tbno==0){  
		return "修改移轉單表頭資料："; 
	}else{
		return "修改移轉單:"+sourceAccount(1,0)+"內容資料："; 
	}	 
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋移轉單單頭欄位選擇";
	}else{
		return "搜尋移轉單單身欄位選擇";
	}
}
////部門名稱抓取
function a14DepartName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetDepartNo=getEventTarget(event);	
    
	var sendSrcRec="filename="+targetDepartNo.value;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="B06/BKND/A14DepartName.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);	             		 
			 if(targetDepartNo.id=='deptno1'){		     
		        document.getElementById('deptname1').innerHTML=rsp[0]['departname'];	
	         }else{
		         document.getElementById('deptname2').innerHTML=rsp[0]['departname'];	
	         }		 					 	          
		}
	}
	return;
}



////以下處理回呼資料傳送給開窗選擇頁面
function srcArgobj(srcId){
	
	if(srcId=='deptno1'){
		var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取轉出部門","drpshtWidth":"28%","thCntnt":['部門編號', '部門名稱'],"thWidth":['50%','50%'],"urlPth":"B06/BKND/A14srch.php","clickfunc":deptchoose1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};    
	}else if(srcId=='deptno2'){
		var qrystring=document.getElementById(srcId).value;
       return {"headtitle":"請選取轉入部門","drpshtWidth":"28%","thCntnt":['部門編號', '部門名稱'],"thWidth":['50%','50%'],"urlPth":"B06/BKND/A14srch.php","clickfunc":deptchoose2,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};     
	}else{
		
		var stockNo=document.getElementById(srcId).value;		 
		var tttlt='';
	    if(srcId=='stockno'){			     
		    var qrystring ="b01.F01"+"|"+stockNo;
			tttlt="請選取料號";          			
	    }else if(srcId=='stockname'){			 
		    var qrystring ="b01.F02"+"|"+stockNo;			 
			tttlt="請選取品名";		
		}
		return {"headtitle":tttlt,"drpshtWidth":"45%","thCntnt":['料品編號', '品名規格'],
		"thWidth":['50%','50%'],"urlPth":"B06/BKND/B01srch.php","clickfunc":stckchg,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
	}
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
	
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			 stockNo.value=maintable.rows[i].cells[0].innerHTML;								 
			 stockName.value=maintable.rows[i].cells[1].innerHTML;	
			 
			 break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	


function deptchoose1(event)  //轉出部門編號選擇
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	let target=getEventTarget(event);	 
	
	let deptNo1=document.getElementById('deptno1');
	deptNo1.value="";
    let deptName1=document.getElementById('deptname1');			
	deptName1.innerHTML="";
	let maintable=document.getElementById("stuffTbody");  
	for(let i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			deptNo1.value=maintable.rows[i].cells[0].innerHTML;								 
			deptName1.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	

function deptchoose2(event)  //轉入部門編號選擇
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	let target=getEventTarget(event);	 
	
	let deptNo2=document.getElementById('deptno2');
	deptNo2.value="";
    let deptName2=document.getElementById('deptname2');			
	deptName2.innerHTML="";
	let maintable=document.getElementById("stuffTbody");  
	for(let i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			deptNo2.value=maintable.rows[i].cells[0].innerHTML;								 
			deptName2.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	