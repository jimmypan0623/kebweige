
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
	var c20elements=document.getElementsByName('c20update');	
	var c20athments=document.getElementsByName('c20others');
	for(var r=0;r<c20athments.length;r++){        //關聯資料
		    nonjsn.push(c20athments[r].tagName.toUpperCase()=='SPAN'?c20athments[r].innerHTML:c20athments[r].value);		
	}

	for(var q=1;q<c20elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(c20elements[q].value);	   
	}
	for(var j=1;j<c20elements.length-1;j++){  //最後一欄備註不過濾
        if(c20elements[j].value.trim()==="" ){		
		    if (j==1){
			  c20elements[j].placeholder="不得空白" ;
		     }else{
		        filtermsg(c20elements[j],"不得空白");
			 }
		   return false ;
        }else{		     
		   if(c20elements[j].nextSibling){		      
			  c20elements[j].parentNode.removeChild(c20elements[j].nextSibling);
		   }	
           if((j==2 || j==4|| j==5 ) && c20elements[j].value == 0){			  
			  filtermsg(c20elements[j],"不得為 0");
		      return false ;
		   }
           if(j==4){  
		     
		      if (c20elements[4].value % c20elements[2].value!=0 && parseInt(c20elements[2].value)>0){  
                  var sgstnumner=parseInt(c20elements[4].value)+parseInt(c20elements[2].value)-(c20elements[4].value % c20elements[2].value);			  
			      filtermsg(c20elements[j],"必須為包裝基量的倍數，建議："+sgstnumner);
		          return false ;
			  }
		   }
		    if(j==5){  
			   if (c20elements[5].value % c20elements[2].value!=0){
				    var sgstnumner=parseInt(c20elements[5].value)+parseInt(c20elements[2].value)-(c20elements[5].value % c20elements[2].value);			
				    filtermsg(c20elements[j],"必須為包裝基量的倍數，建議："+sgstnumner);
		          return false ;
			   } 
			}
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(c20elements[1].value!="" ){
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
	  oTd.innerHTML='備註:';
	  var oTd = oTr.insertCell(1);      
	 oTd.colspan=3; 
	oTd.innerHTML="<input type='text' name='c20update' id='dscrpt' class='txt' style='width:80%;' maxlength='40'/>";
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='單位毛重:';
	var oTd = oTr.insertCell(1);			     
	oTd.innerHTML="<input type='number' name='c20update' id='rossweight' class='txt' value=0 style='width:50%;text-align:right;'  />";                             
   
	 var oTd = oTr.insertCell(2);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='單位淨重:';
	var oTd = oTr.insertCell(3);			     
	oTd.innerHTML="<input type='number' name='c20update' id='newtweight' class='txt' value=0 style='width:50%;text-align:right;' />";                             
  
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='外箱才積:';
	var oTd = oTr.insertCell(1);
	 oTd.colspan=3; 
	oTd.innerHTML="<input type='number' name='c20update' id='cubicmeter' class='txt' value=0 style='width:20%;text-align:right;'  />";                             
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='外箱數量:';
	var oTd = oTr.insertCell(1);			     
	oTd.innerHTML="<input type='number' name='c20update' id='outpackqty' class='txt' value=1 style='width:50%;text-align:right;'  />";                             
	 var oTd = oTr.insertCell(2);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='最少出貨:';
	var oTd = oTr.insertCell(3);			     
	oTd.innerHTML="<input type='number' name='c20update' id='minmumpship' class='txt' value=1 style='width:50%;text-align:right;' />";                             			   
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='包裝基量:';
	var oTd = oTr.insertCell(1);			     
	oTd.innerHTML="<input type='number' name='c20update' id='unitpack' class='txt' value=1 style='width:50%;text-align:right;' />";                             
	

	  var oTd = oTr.insertCell(2);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='包裝方式:';
	  var oTd = oTr.insertCell(3);               	       
	oTd.innerHTML="<input type='text' name='c20update' id='wayofpack' class='txt' style='width:50%;' maxlength='20'/>";	            

   
	
   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='單位:';
	var oTd = oTr.insertCell(1);	
	 oTd.colspan=3; 
	oTd.innerHTML="<span name='c20others' id='unitname'></span>&nbsp&nbsp"              

	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	  var oTd = oTr.insertCell(0);	   
	  oTd.setAttribute('style','text-align:right;width:15%');					
	  oTd.innerHTML='品名規格:';
	  var oTd = oTr.insertCell(1);     
	   oTd.colspan=3; 
	   if(txtword==2){   //如果是修改
		  oTd.innerHTML="<input type='text' name='c20others' id='stockname' class='txt' style='background-color:#B9B9FF;width:70%;' maxlength='40' readOnly=true />";  				 
	   }else{
		   oTd.innerHTML="<input type='text' name='c20others' id='stockname' class='txt' style='width:70%;' maxlength='40'    />";  				 
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
		  oTd.innerHTML="<input type='text' name='c20update' id='stockno' class='txt' style='background-color:#B9B9FF;width:60%;' maxlength='43' readOnly=true  />";  				              
	  }else{
		  oTd.innerHTML="<input type='text' name='c20update' id='stockno' class='txt' style='width:60%;' maxlength='43'    />";
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
	oTd.innerHTML="<input type='text' name='c20update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
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
		   document.getElementById("unitpack").focus();
		   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
		  
		   var editinit=document.getElementsByName('c20update');
		   document.getElementById('stockname').value=notWaitdata[0];
		   document.getElementById('unitname').innerHTML=notWaitdata[1];
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
    oTd.setAttribute("style","text-align:left;");	
    oTd.setAttribute("class","directdata");		
    var oTd = oTr.insertCell(oTr.cells.length);   //品名
    oTd.innerHTML=nongs[0];
	oTd.setAttribute("style","text-align:left;");	
    oTd.setAttribute("class","indirectdata");
    var oTd = oTr.insertCell(oTr.cells.length);   //單位
    oTd.innerHTML=nongs[1];
    oTd.setAttribute("class","indirectdata");
    oTd.setAttribute("style","width:5%;");
	var oTd = oTr.insertCell(oTr.cells.length);   //包裝基量
    oTd.innerHTML=args[1];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","width:8%;");
    var oTd = oTr.insertCell(oTr.cells.length);   //包裝方式
    oTd.innerHTML=args[2];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","width:7%;"); 
    for(var i=3;i<5;i++){
		var oTd = oTr.insertCell(oTr.cells.length);   //外箱數量&最少出貨
		oTd.innerHTML=args[i];
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","width:8%;text-align:right;");
    }   
    var oTd = oTr.insertCell(oTr.cells.length);   //外箱才積
    oTd.innerHTML=args[5];
    oTd.setAttribute("class","directdata");
    oTd.setAttribute("style","width:8%;text-align:right;"); 
    for(var i=6;i<8;i++){
		var oTd = oTr.insertCell(oTr.cells.length);   //單位毛重&單位淨重
		oTd.innerHTML=args[i];
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","width:8%;text-align:right;");
    }    
    var oTd = oTr.insertCell(oTr.cells.length);   //備註
    oTd.innerHTML=args[8];
	oTd.setAttribute("style","text-align:left;");	
    oTd.setAttribute("class","directdata");
	
	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);				       
    oTd.innerHTML=rsp.lastupdate;			
    oTd.setAttribute("style","display:none;");   	
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	var maintable=document.getElementById("maintbody1");	 
	var tbrlth=maintable.rows[args[arglth-1]].cells.length;	
	for (var j=4;j<tbrlth-2;j++){				        
		maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-3];						 
	}										 
	/***********************************************************/                    
	maintable.rows[args[arglth-1]].cells[tbrlth-2].innerHTML=rsp.lastupdate; //最後異動		
}
function searchOptionsKey(tbno,slt5){	
	slt5.options.add(new Option('料品編號','c20.F01'));
	slt5.options.add(new Option('品名規格','b01.F02'));
}
function  addNewRecordHint(tbno){
    return "請輸入產品包裝資料：";	

}
function editRecordHint(tbno){
     return "修改產品包裝資料："; 
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋產品包裝欄位選擇";		
}