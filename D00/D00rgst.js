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
	
	var tabs=getElementsByAttribute('class','tab');	
	var tbno=0;
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}			
    if (tbno==0){
	    var d00elements=document.getElementsByName('d00update');	
    }else{
	     var d00elements=document.getElementsByName('d0Zupdate');	
	}
	for(var q=1;q<d00elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(d00elements[q].value);	   
	}

	for(var j=1;j<d00elements.length;j++){
        if(d00elements[j].value.trim()=="" ){				      
		    filtermsg(d00elements[j],"不得空白");			 
		    return false ;
        }else if(d00elements[j].value == 0){		  		    		      
			  filtermsg(d00elements[j],"不得為 0");
		      return false ;		 
		}else if(j==1 && tbno==1 && right(d00elements[j].value,1)!=1){ 
		      filtermsg(d00elements[j],"非該旬首日");
		      return false ;
		}else{
		   if(d00elements[j].nextSibling ){		              
			      d00elements[j].parentNode.removeChild(d00elements[j].nextSibling);
		   }
	    }
		
		 
	}

    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(d00elements[1].value!="" ){
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
 
function modifyFields(tbno,txtword,ajTable){   //新增修改時出現之欄位
    if(tbno==0){   //如果異動表頭資料
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='匯率:';
	    var oTd = oTr.insertCell(1);
	    oTd.colspan=3;
	    oTd.innerHTML="<input type='number' name='d00update' id='crncyabbrv' class='txt' value=0 style='width:25%;'  />";                             	 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='幣別代號:';
	    var oTd = oTr.insertCell(1);					
		if(txtword==2){   //如果是修改		                
		   oTd.innerHTML="<input type='text' name='d00update' id='crncyno' class='txt' style='background-color:#B9B9FF;width:45%;' maxlength='4' readOnly=true  />"; 
		}else{
		   oTd.innerHTML="<input type='text' name='d00update' id='crncyno' class='txt' style='width:45%;' maxlength='4'/>"; 
		}			 
		var oTd = oTr.insertCell(2);	   
		oTd.setAttribute('style','text-align:right;width:15%');					
		oTd.innerHTML='幣別名稱:';
		var oTd = oTr.insertCell(3);               
		oTd.innerHTML="<input type='text' name='d00update' id='crncyname' class='txt' style='width:50%;' maxlength='8'    />";  				
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		var oTd = oTr.insertCell(0);	             
		oTd.innerHTML='紀錄號碼';
		var oTd = oTr.insertCell(1);
		oTd.colspan=3;
		oTd.innerHTML="<input type='text' name='d00update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		oTr.setAttribute("style","display:none;");		 
	}else{	  //三旬匯率			 
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);	   
		 oTd.setAttribute('style','text-align:right;width:15%');					
		 oTd.innerHTML='匯率:';
		 var oTd = oTr.insertCell(1);               
		 oTd.innerHTML="<input type='number' name='d0Zupdate' value=0 class='txt' id='rte3h' style='width:20%;' />";  				 
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);
		 var oTd = oTr.insertCell(0);
		 oTd.setAttribute('style','text-align:right;width:15%');	
		 oTd.innerHTML='三旬日期:';
		 var oTd = oTr.insertCell(1);
		 if(txtword==2){   //如果是修改	
			oTd.innerHTML="<input type='date' name='d0Zupdate' class='txt' id='dtestd3'  style='background-color:#B9B9FF;width:35%;' readOnly=true />"; 
		 }else{
			oTd.innerHTML="<input type='date' name='d0Zupdate' class='txt' id='dtestd3'  style='width:35%;'  />"; 
		 }					
		 
		 var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		 var oTd = oTr.insertCell(0);	             
		 oTd.innerHTML='紀錄號碼';
		 var oTd = oTr.insertCell(1);                 
		 oTd.innerHTML="<input type='text' name='d0Zupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
		 oTr.setAttribute("style","display:none;");	
	}	
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
    dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
	switch (txtword) {
		case 1:                                   //如果是新增
			if (tbno==0){
				document.getElementById("crncyno").focus();
			}else{
				var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天						  
				var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,9)+'1'); //設定本詢第一天								  
				document.getElementById("dtestd3").value=thtdy;  
				document.getElementById("dtestd3").focus();
			}		 
		    break;
		case 2:                                                     //如果是修改，要先顯示目前該筆資料
			if (tbno==0){
			    document.getElementById("crncyname").focus();
			    document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 		  
			    var editinit=document.getElementsByName('d00update');
			}else{
				 document.getElementById("rte3h").focus();				  			 				  
				 var editinit=document.getElementsByName('d0Zupdate');					    						 
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
    if (tbno==0){     //先整理表頭新增後的資料
	    for(var i=0;i<args.length-2;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);
		   oTd.innerHTML=args[i];		
		   oTd.setAttribute("class","directdata");
		   oTd.setAttribute("style","text-align:center;");
	    }				 
	   //最後異動
	    var oTd = oTr.insertCell(oTr.cells.length);	
	    oTd.setAttribute("style","text-align:center;");
	    oTd.innerHTML=rsp.lastupdate;				 					  	   	
    }else{
	    for(var i=0;i<args.length-2;i++){
		   var oTd = oTr.insertCell(oTr.cells.length);
	  	   oTd.innerHTML=args[i];				
		   oTd.setAttribute("class","directdata");			
		   oTd.setAttribute("style","text-align:center;");
	    }		
	   //最後異動
	    var oTd = oTr.insertCell(oTr.cells.length);				       
	    oTd.innerHTML=rsp.lastupdate;	
	    oTd.setAttribute("style","text-align:center;");	   
    }				
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動	  		 							                
	if (tbno==0){		   								
	   var maintable=document.getElementById("maintbody1");	 
	}else{
		var maintable=document.getElementById("maintbody2");	
	}	
	for (var j=2;j<arglth-1;j++){				       //表頭表身都是一樣的格式  
	  maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
	}										 					              
	maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;	
}
function searchOptionsKey(tbno,slt5){	
	if (tbno==0){
        slt5.options.add(new Option('幣別代號','d00.F01'));
		slt5.options.add(new Option('幣別名稱','d00.F04'));
	}else{   
		slt5.options.add(new Option('日    期','d0Z.F02'));
	} 
}
function  addNewRecordHint(tbno){
    if (tbno==0){  //表頭資料
        return "請輸入幣別資料：";
	}else{
		return "請輸入"+document.getElementById('fatherkey').innerHTML+"本旬匯率：";
	}							
}
function editRecordHint(tbno){
    if (tbno==0){  
		return "修改本幣別資料："; 
	}else{
		return "修改"+document.getElementById('fatherkey').innerHTML+"三旬匯率："; 
	}
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    if (tbno==0){  //表頭資料	
		return "搜尋幣別欄位選擇";	
	}else{
		return "搜尋三旬匯率欄位選擇";	
	}					
}
