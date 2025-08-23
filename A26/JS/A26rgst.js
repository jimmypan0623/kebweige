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
	var tbno=0;

	var recordNo=document.getElementById("rcrd_no");
    //----資料寫入資料庫前過濾程序區-----//
	var a26elements=document.getElementsByName('a26update');	
	for(var q=1;q<a26elements.length;q++){  	    //開始堆疊待異動資料陣列 a26elements.length	
		tbjsn.push(a26elements[q].value);	   
	}
	 
	for(var j=1;j<a26elements.length ;j++){
        if(a26elements[j].value.trim()==="" ){		
		   if(!a26elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      a26elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   a26elements[j].focus();
		   return false ;
        }else{		     
		   if(a26elements[j].nextSibling){		      
			  a26elements[j].parentNode.removeChild(a26elements[j].nextSibling);
		   }			
	    }
	}
	var tmpfoumula=decodeHTMLText(a26elements[8].value);	
	if(!eval(tmpfoumula.trim())){		//instead
		   if(!a26elements[6].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("設定內容不符");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      a26elements[6].parentNode.appendChild(errorSpan1);				 
		   }	 
		   a26elements[6].focus();
		   return false ;
        }else{		     
		   if(a26elements[6].nextSibling){		      
			  a26elements[6].parentNode.removeChild(a26elements[6].nextSibling);
		   }			
	 }
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(a26elements[1].value!="" ){
 
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
	 oTd.innerHTML='檢查字串:';
	 var oTd = oTr.insertCell(1);				 	            
								  
 
		oTd.innerHTML="<input type='text' name='a26update' id='varcheck' class='txt' style='width:90%;'  />";
	 
   
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='內容說明:';
	var oTd = oTr.insertCell(1);	
	
	var editSrs=document.createElement("textarea");
	editSrs.rows=5;
	editSrs.cols=30;
	editSrs.id="vardscrpt";
	editSrs.name="a26update";
	editSrs.className='txt';
	editSrs.setAttribute('style','font-size:18px;width:80%;');	
	editSrs.placeholder="描述此參數設定的用途與限制。";				 
	oTd.appendChild(editSrs);			

   // oTd.innerHTML="<input type='text' name='a26update' id='vardscrpt' class='txt'  style='width:90%;'  />";                             				
   
	var oTr=ajTable.insertRow(ajTable,ajTable.length);	            
	var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='設定內容:';
	var oTd = oTr.insertCell(1);				 
	oTd.innerHTML="<input type='text' name='a26update' id='varcontain' class='txt' style='width:90%;'  />";                              
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='變數長度:';
	var oTd = oTr.insertCell(1);	
	oTd.innerHTML="<input type='number' name='a26update' id='varlength' class='txt' value=1 style='width:20%;'  />";			
  
	var oTr=ajTable.insertRow(ajTable,ajTable.length);	            
	var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='變數型態:';
	var oTd = oTr.insertCell(1);		
	oTd.innerHTML="<input type='text' name='a26update' id='vartype' class='txt'  style='width:25%;'  />";
	
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	 oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='使用範圍:';
	var oTd = oTr.insertCell(1);	                		
	oTd.innerHTML="<input type='text' name='a26update' id='varrange' class='txt'  style='width:60%;'  />";                                             			
	
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);		 
	var oTd = oTr.insertCell(0);	   
	 oTd.setAttribute('style','text-align:right;width:15%');					
	oTd.innerHTML='參數說明:';
	var oTd = oTr.insertCell(1);  
 
	   oTd.innerHTML="<input type='text' name='a26update' id='varname' class='txt' style='width:50%;'  />";  				
				
	 var oTr=ajTable.insertRow(ajTable,ajTable.length);
	 var oTd = oTr.insertCell(0);
	oTd.setAttribute('style','text-align:right;width:15%');	
	oTd.innerHTML='參數編號:';
	var oTd = oTr.insertCell(1);		
	if(txtword==2){   //如果是修改		                
		oTd.innerHTML="<input type='text' name='a26update' id='varno' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='7' readOnly=true  />"; 
	 }else{
		oTd.innerHTML="<input type='text' name='a26update' id='varno' class='txt' style='width:25%;' maxlength='7'/>"; 
	 }		
	var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	var oTd = oTr.insertCell(0);	             
	oTd.innerHTML='紀錄號碼';
	var oTd = oTr.insertCell(1);
	oTd.colspan=3;
	oTd.innerHTML="<input type='text' name='a26update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
	oTr.setAttribute("style","display:none;");	

}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	  dropsheet_content.style.width="55%";   //原訊息內框畫面寬度調整  
      dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
	         
   			 switch (txtword) {
                case 1:                                   //如果是新增
				   
			       document.getElementById("varno").focus();	
			     
				   break;
			    case 2:                                                     //如果是修改，要先顯示目前該筆資料
				    var ath1=getCookie('auth01');  //cookie新增
			        var ath2=getCookie('auth02');  //cookie修改
					var ath3=getCookie('auth03');  //cookie刪除
					var notOnlyEdit=(ath1=='Y' && ath2=='Y' && ath3=='Y');
				  
				    if (!notOnlyEdit){
				       document.getElementById("varcheck").parentNode.parentNode.style.visibility="hidden";
					   document.getElementById("varcontain").focus();
					}else{
					  document.getElementById("varname").focus();
					}						
				   
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
				  
				   var editinit=document.getElementsByName('a26update');				    				   
					    for(var k=0;k<editinit.length;k++){ //8				        
					       editinit[k].value=aWaitUpdate[k];
						   if (!notOnlyEdit){
						   if(k!=6){							   
						      editinit[k].readOnly=true;
						     }
						   } 
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
	 for(var i=0;i<args.length-2;i++){
	    var oTd = oTr.insertCell(oTr.cells.length);
	    oTd.innerHTML=args[i];	
	    oTd.setAttribute("style","word-break: break-all;");	
	    if(i==0){
		    oTd.setAttribute("style","width:7%;");	
	    }
	    if(i==3 || i==4){	
	       oTd.setAttribute("style","width:5%;text-align:center");				   
	     }  
	     if(i==5){	 
	    	 oTd.setAttribute("style","text-align:center");			
	    }	  
    }				 
	//最後異動
    var oTd = oTr.insertCell(oTr.cells.length);				       
    oTd.innerHTML=rsp.lastupdate;		
    oTd.setAttribute("style","width:12%;");	 
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	     var maintable=document.getElementById("maintbody1");	               
				    for (var j=2;j<arglth-1;j++){				        
						maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
			        }										 
					/***********************************************************/                    
					maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;
}

function searchOptionsKey(tbno,slt5){	
	slt5.options.add(new Option('參數編號','a26.F01'));
	slt5.options.add(new Option('參數說明','a26.F02'));
	slt5.options.add(new Option('設定內容','a26.F06'));	    
}



function  addNewRecordHint(tbno){

    return "修改參數資料：";
}

function editRecordHint(tbno){
   
	   return "修改參數資料：";	
	 
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
  
	   return "搜尋參數設定欄位選擇";	;
   
}



// encode 編碼
function encodeHTMLText(msgText){
    let textarea = document.createElement("textarea");
    textarea.innerText = msgText;
    return textarea.innerHTML;
}

// decode 解碼
function decodeHTMLText(msgText){
    let textarea = document.createElement("textarea");
    textarea.innerHTML = msgText.replace(/\r\n/g, "\\r\\n"); // 轉換換行符號
    return textarea.value;
}