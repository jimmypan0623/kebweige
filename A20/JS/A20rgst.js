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
	var tabs=getElementsByAttribute('class','tab');	
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}					 							                
    if (tbno==0){
	    var a20elements=document.getElementsByName('a20update');	
	}else{
		 var a20elements=document.getElementsByName('a22update');	
	}
	for(var q=1;q<a20elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(a20elements[q].value);	   
	}
	for(var j=1;j<a20elements.length-1;j++){
        if(a20elements[j].value.trim()==="" ){		
		   if(!a20elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      a20elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   a20elements[j].focus();
		   return false ;
        }else{		     
		   if(a20elements[j].nextSibling){		      
			  a20elements[j].parentNode.removeChild(a20elements[j].nextSibling);
		   }			
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(a20elements[1].value!="" ){
 
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
    if (tbno==0){   //如果異動表頭資料
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='類別:';
	    var oTd = oTr.insertCell(1);
	    var slt11=document.createElement("select");
	    slt11.options.add(new Option('基本檔','0'));
	    slt11.options.add(new Option('月份檔','1'));
	    slt11.options.add(new Option('年度檔','2'));
	    slt11.options.add(new Option('奇月檔','3'));
	    slt11.options.add(new Option('暫存檔','9'));
	    slt11.options.add(new Option('系統檔','z'));
	    slt11.setAttribute("id","tabletype");
	    slt11.setAttribute("name","a20update");
	    oTd.appendChild(slt11);	  				 
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='備註:';
	    var oTd = oTr.insertCell(3);               
	    oTd.innerHTML="<input type='text' name='a20update' class='txt' style='width:90%;' maxlength='40'    />";  				 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='表格代號:';
	    var oTd = oTr.insertCell(1);		                		
	    if(txtword==2){   //如果是修改		                
		  oTd.innerHTML="<input type='text' name='a20update' id='tableno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='4' readOnly=true  />"; 
	    }else{
		  oTd.innerHTML="<input type='text' name='a20update' id='tableno' class='txt' style='width:25%;' maxlength='4'/>"; 
	    }			 
	    var oTd = oTr.insertCell(2);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='表格名稱:';
	    var oTd = oTr.insertCell(3);               	            
	    oTd.innerHTML="<input type='text' name='a20update' id='tablename' class='txt' style='width:70%;' maxlength='40'    />";  				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='a20update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	    oTr.setAttribute("style","display:none;");	
    }else{               //異動表身資料
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='小數位數:';
		  var oTd = oTr.insertCell(1);
		  oTd.innerHTML="<input type='number' name='a22update' value=0 class='txt' style='width:25%;' maxlength='4' />"; 				 
		  var oTd = oTr.insertCell(2);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='預設值:';
		  var oTd = oTr.insertCell(3);
		  oTd.innerHTML="<input type='text' name='a22update' class='txt' style='width:40%;' maxlength='10' />";  				   				   			 
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='欄位型態:';
		  var oTd = oTr.insertCell(1);
		  oTd.innerHTML="<input type='text' name='a22update' class='txt' style='width:80%;' maxlength='40' />";  				   				   			 
		  var oTd = oTr.insertCell(2);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='欄位長度:';
		  var oTd = oTr.insertCell(3);               
		  oTd.innerHTML="<input type='number' name='a22update' value=0 class='txt' style='width:30%;' maxlength='3'    />";  				 
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);
		  var oTd = oTr.insertCell(0);
		  oTd.setAttribute('style','text-align:right;width:15%');	
		  oTd.innerHTML='欄位代號:';
		  var oTd = oTr.insertCell(1);		                		
		  if(txtword==2){   //如果是修改		                
			oTd.innerHTML="<input type='text' name='a22update' id='fieldno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='4' readOnly=true  />"; 
		  }else{
			oTd.innerHTML="<input type='text' name='a22update' id='fieldno' class='txt' style='width:25%;' maxlength='4'/>"; 
		  }			 
		  var oTd = oTr.insertCell(2);	   
		  oTd.setAttribute('style','text-align:right;width:15%');					
		  oTd.innerHTML='欄位名稱:';
		  var oTd = oTr.insertCell(3);               	            
		  oTd.innerHTML="<input type='text' name='a22update' id='fieldname' class='txt' style='width:70%;' maxlength='40'    />";  				              
		  var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		  var oTd = oTr.insertCell(0);	             
		  oTd.innerHTML='紀錄號碼';
		  var oTd = oTr.insertCell(1);
		  oTd.colspan=3;
		  oTd.innerHTML="<input type='text' name='a22update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		  oTr.setAttribute("style","display:none;");	
	}		
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	 dropsheet_content.style.width="65%";   //原訊息內框畫面寬度調整  
     dropsheet.style.paddingTop="25px";      // 高度也往上提 		
    return true;
}


function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
		case 1:                                   //如果是新增
		   if (tbno==0){
			  document.getElementById("tableno").focus();	
		   }else{
			   document.getElementById("fieldno").focus();
		   }
		   break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
		   if (tbno==0){
			  document.getElementById("tablename").focus();				  			 				  
			  var editinit=document.getElementsByName('a20update');
		   }else{
			   document.getElementById("fieldname").focus();				  			 				  
			  var editinit=document.getElementsByName('a22update');
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
   
	if (tbno==0){
		for(var i=0;i<3;i++){
		var oTd = oTr.insertCell(oTr.cells.length);
		oTd.innerHTML=args[i];				
        oTd.setAttribute("class","directdata");		
		if(i==0){
		   oTd.setAttribute("style","text-align:center;");
		}
	}			 
		oTd.setAttribute("style","text-align:left;color:#7f8890;display:none;"); //真正的type要隱藏
		var oTd = oTr.insertCell(oTr.cells.length);
		oTd.innerHTML=whichtable(args[2]);		
		var oTd = oTr.insertCell(oTr.cells.length);
		oTd.setAttribute("class","directdata");	
		oTd.innerHTML=args[3];	
	}else{
		for(var i=0;i<args.length-2;i++){
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=args[i];				
			if(i==0){
				  oTd.setAttribute("style","text-align:center;");					  
			}
            oTd.setAttribute("class","directdata");					  
		}				
	}

	    //最後異動
	var oTd = oTr.insertCell(oTr.cells.length);	
	oTd.setAttribute("class","directdata");	
	oTd.innerHTML=rsp.lastupdate;		
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	if (tbno==0){
	    var maintable=document.getElementById("maintbody1");
		for (var j=2;j<4;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
		}	
		maintable.rows[args[arglth-1]].cells[4].innerHTML=whichtable(args[2]); //多一欄	            
		maintable.rows[args[arglth-1]].cells[5].innerHTML=args[3];
        var tbrlth=maintable.rows[args[arglth-1]].cells.length;				   
        maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動						   
	}else{
	    var maintable=document.getElementById("maintbody2");	
		for (var j=2;j<arglth-1;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
		}	
		 maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;
	}  					
}
function searchOptionsKey(tbno,slt5){	
	if (tbno==0){
		slt5.options.add(new Option('表格代號','a20.F01'));
		slt5.options.add(new Option('表格名稱','a20.F07'));
	} else{
		slt5.options.add(new Option('欄位代號','a22.F01'));
		slt5.options.add(new Option('欄位名稱','a22.F06')); 					  
	}   
}
function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
        return "請輸入表格資料：";
    }else{
		return "請輸入欄位資料："; 
	}			

}
function editRecordHint(tbno){
    if (tbno==0){  
		return "修改表格資料："; 
	}else{
		return "修改欄位資料："; 
	}
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
	    return "搜尋資料表格選擇";
	}else{
		return "搜尋表格欄位選擇";
	}
}