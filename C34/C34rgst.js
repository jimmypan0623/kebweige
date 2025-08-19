
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
	var c34elements=document.getElementsByName('c34update');	
	var c34athments=document.getElementsByName('c34others');
	for(var r=0;r<c34athments.length;r++){        //關聯資料
	    nonjsn.push(c34athments[r].tagName.toUpperCase()=='SPAN'?c34athments[r].innerHTML:c34athments[r].value);		
	}

	for(var q=1;q<c34elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c34elements[q].value);	   
	}
	for(var j=1;j<c34elements.length-1;j++){  //最後一欄備註不過濾
        if(c34elements[j].value.trim()==="" ){		
		    if (j==1){
			  c34elements[j].placeholder="不得空白" ;
		     }else{
		        filtermsg(c34elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(c34elements[j].nextSibling){		      
			  c34elements[j].parentNode.removeChild(c34elements[j].nextSibling);
		   }	
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(c34elements[1].value!="" ){
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

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='資料來源:';
	  var oTd = oTr.insertCell(1);               	       
	oTd.innerHTML="<input type='text' name='c34update' id='dscrpt' class='txt' style='width:50%;' maxlength='30'/>";
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='客戶品號:';
	var oTd = oTr.insertCell(1);			     
	oTd.innerHTML="<input type='text' name='c34update' id='csurompartno' class='txt' style='width:70%;' maxlength='30' />";                             
   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	 oTd.innerHTML='客戶簡稱:';
	  var oTd = oTr.insertCell(1);               
	  oTd.innerHTML="<input type='text' name='c34others' id='customname' class='txt' style='width:25%;' maxlength='8'    />";  				 
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
	  oTd.innerHTML="<input type='text' name='c34update' id='customno' class='txt' style='width:20%;' maxlength='6'    />";  				
	  var srchButton3=document.createElement("input");				   
	   srchButton3.setAttribute("type","button");	
	   srchButton3.setAttribute("class","scopelook");				   
	   srchButton3.style.background="url('digits/brows1.png')";   
	  attachEventListener(srchButton3,"click",custnoshow,false);				
	  oTd.appendChild(srchButton3);		
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='品名規格:';
	  var oTd = oTr.insertCell(1);      
	   if(txtword==2){   //如果是修改
		  oTd.innerHTML="<input type='text' name='c34others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	   }else{
		   oTd.innerHTML="<input type='text' name='c34others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
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
		  oTd.innerHTML="<input type='text' name='c34update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	  }else{
		  oTd.innerHTML="<input type='text' name='c34update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	oTd.innerHTML="<input type='text' name='c34update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	oTr.setAttribute("style","display:none;");	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;
}


function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增
		   
		   document.getElementById("stockno").focus();	
		 
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("customno").focus();
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
		  
		   var editinit=document.getElementsByName('c34update');
		   document.getElementById('stockname').value=notWaitdata[0];
		   document.getElementById('customname').value=notWaitdata[1];
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
    var oTd = oTr.insertCell(oTr.cells.length);   //品名
    oTd.innerHTML=nongs[0];
    oTd.setAttribute("class","indirectdata");
	oTd.setAttribute("style","text-align:left;");
    var oTd = oTr.insertCell(oTr.cells.length);   //客戶編號
    oTd.innerHTML=args[1];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","text-align:left;width:8%;");
	var oTd = oTr.insertCell(oTr.cells.length);   //客戶簡稱
    oTd.innerHTML=nongs[1];
    oTd.setAttribute("class","indirectdata");
    oTd.setAttribute("style","text-align:left;width:8%;");
    var oTd = oTr.insertCell(oTr.cells.length);   //客戶品號
    oTd.innerHTML=args[2];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","text-align:left;");
    var oTd = oTr.insertCell(oTr.cells.length);   //來源資料
    oTd.innerHTML=args[3];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","text-align:left;width:10%;");
 	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);				       
    oTd.innerHTML=rsp.lastupdate;			
    oTd.setAttribute("style","display:none;");   	
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	var maintable=document.getElementById("maintbody1");	 
	var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
							
	maintable.rows[args[arglth-1]].cells[3].innerHTML=args[1];						 
	maintable.rows[args[arglth-1]].cells[4].innerHTML=nongs[1];			
	for (var j=5;j<tbrlth-2;j++){
		maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-3];			
	}
	/***********************************************************/                    
	maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動				
}
function searchOptionsKey(tbno,slt5){	
	 slt5.options.add(new Option('料品編號','c34.F02'));
	 slt5.options.add(new Option('品名規格','b01.F02'));
	 slt5.options.add(new Option('客戶品號','c34.F03'));
	 slt5.options.add(new Option('客戶編號','c34.F01'));
	 slt5.options.add(new Option('客戶簡稱','c01.F04'));
}
function  addNewRecordHint(tbno){
    return "請輸入相關料號：(新增完畢請按結束鈕)";	
}
function editRecordHint(tbno){
    return "修改相關料號："; 
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋客戶品號對照欄位選擇";
}