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


function sendFilePrc(updflg){     //新增資料上傳檔案及修改程序
    var tbjsn=[];
	var nonjsn=[];
	var recordNo=document.getElementById("rcrd_no");
    var tbno=0;
	
	var a09elements=document.getElementsByName('a09update');	
    for(var q=1;q<3;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(a09elements[q].value);	   
	}
    var tpchgs=getElementsByAttribute("class","tpchg");
	for(var i=0;i<tpchgs.length;i++){
		 tbjsn.push(tpchgs[i].checked?'Y':' ');	   
	}
    
	tbjsn.push(a09elements[7].value);

	for(var j=1;j<a09elements.length;j++){  //最後一欄備註不過濾
       
	 
	       if(!/^[a-zA-Z0-9]/.test(a09elements[j].value) && j==1){
		       filtermsg(a09elements[j],"請輸入英文字母或數字");		       
		       return false ;
		   }else if(a09elements[j].value.trim()=="" && j==2){   
			   filtermsg(a09elements[j],"不得空白");		       
		       return false ;
            }else{
		        if(a09elements[j].nextSibling ){		              
			      a09elements[j].parentNode.removeChild(a09elements[j].nextSibling);
		        }
	        }


    }
   if(updflg==1){    //如果有新增 
      if(a09elements[1].value!="" !="" && a09elements[2].value!=""){	
           tbjsn.push(0);
		   tbjsn.push(0);	
		   var rspns=TableToJson(tbjsn,nonjsn,tbno);        
      }else{
		 blkshow("欄位資料不齊全無法新增部門");
      }
	  
   }else {
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
	            oTd.innerHTML='備註說明';
	            var oTd = oTr.insertCell(1);
			    var editSrs=document.createElement("textarea");
		   	    editSrs.rows=6;
			    editSrs.cols=30;
			    editSrs.id="remark";
			    editSrs.name="a09update";
				editSrs.setAttribute('style','font-size:18px;width:80%;');	
			    editSrs.placeholder="描述此部門的功能。";
				 
			    oTd.appendChild(editSrs);			
	            

			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	          oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='部門性質';
	            var oTd = oTr.insertCell(1);
				var baseauthdiv=document.createElement('div');   //從外層元素開始加入				
	            baseauthdiv.setAttribute('style','background:#FFFFB9;width:90%;');
				var baseorder=['物料存放 ','生產加工 ','庫存計價 ','庫存可用 '];   
				for (var l=1;l<baseorder.length+1;l++){
					 var bsechkbx=document.createElement('input'); 
				     bsechkbx.type='checkbox';
				     bsechkbx.id='tpchg'+String(l);
				     bsechkbx.name='a09update';
					  bsechkbx.className='tpchg';
				    
				     var basechklbl=document.createElement('label'); 
				     basechklbl.setAttribute('name','lblchk');
					
					 basechklbl.setAttribute('for',bsechkbx.id);
					 basechklbl.innerHTML=baseorder[l-1]+'&nbsp&nbsp';
					 baseauthdiv.appendChild(bsechkbx);
					 baseauthdiv.appendChild(basechklbl);					 
				}			
                 oTd.appendChild(baseauthdiv);			   	
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right;width:15%;');	
	            oTd.innerHTML='部門名稱';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='a09update' id='depart_name' class='txt' maxlength='8' style='width:40%;'  />"; 	 			
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right;width:15%;');	
	            oTd.innerHTML='部門編號';
	            var oTd = oTr.insertCell(1);	           
				 if(txtword==2){   //如果是修改	
                    oTd.innerHTML="<input type='text' name='a09update' id='depart_no' class='txt' maxlength='6' style='background-color:#B9B9FF;width:30%;'  readOnly=true  />"; 
			     }else{
					  oTd.innerHTML="<input type='text' name='a09update' id='depart_no' class='txt' style='width:25%;' maxlength='6'    />";
				  }   
		
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right');
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='a09update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	

}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;

}

function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
   switch (txtword) {
                case 1:                                     //如果是新增
			      document.getElementById("depart_no").focus();	
			     var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		         var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
 	
				   break;
			    case 2:        //如果是修改
			    
				  var editinit=document.getElementsByName('a09update');
				  for(var k=0;k<3;k++){ 
					   editinit[k].value=aWaitUpdate[k];
				   }		
				  
				  var tpchgs=getElementsByAttribute("class","tpchg");
				  for(var i=0;i<tpchgs.length;i++){
				     tpchgs[i].checked=(aWaitUpdate[i+3]=="Y");
				  }
				
				   editinit[7].value=aWaitUpdate[7];
				
				  
				  document.getElementById("depart_name").focus();	
				  	
				   
		          break;
			    case 7:
				     var txtseek=document.getElementById('searchWords');
					  txtseek.focus();
				      attachEventListener(txtseek,'keypress',textKeypress,false);
				      break;        
				 
			 }			

}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動
            if(tbno==0){
                   var oTd = oTr.insertCell(oTr.cells.length);   //部門編號
				   oTd.innerHTML=args[0];
				   oTd.setAttribute("class","directdata");	
				    oTd.setAttribute("style","text-align:left;width:8%;");
				 
				   var oTd = oTr.insertCell(oTr.cells.length);   //部門名稱
				   oTd.innerHTML=args[1];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:left;width:10%;");
				
				   var oTd = oTr.insertCell(oTr.cells.length);   //物料存放
				   oTd.innerHTML=args[2];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:center;width:8%;");
				   var oTd = oTr.insertCell(oTr.cells.length);   //生產加工
				   oTd.innerHTML=args[3];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:center;width:8%;");
				    var oTd = oTr.insertCell(oTr.cells.length);   //庫存計價
				   oTd.innerHTML=args[4];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:center;width:8%;");
				   var oTd = oTr.insertCell(oTr.cells.length);   //庫存可用
				   oTd.innerHTML=args[5];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:center;width:8%;");
				    var oTd = oTr.insertCell(oTr.cells.length);   //備註說明
				   oTd.innerHTML=args[6];
				   oTd.setAttribute("class","directdata");
				   oTd.setAttribute("style","text-align:left;width:30%;");
				    //最後異動					   
				  var oTd = oTr.insertCell(oTr.cells.length);				       
				  oTd.innerHTML=rsp.lastupdate;			
                  
			}  		    				   				 			  	
		         
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	var maintable=document.getElementById("maintbody1");	 					
	for (var j=2;j<arglth-1;j++){				       //表頭表身都是一樣的格式  
		maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 			         
	}										
	maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;		
}

function searchOptionsKey(tbno,slt5){	
	 slt5.options.add(new Option('部門編號','a14.F01'));
	 slt5.options.add(new Option('部門名稱','a14.F02'));
}


function  addNewRecordHint(tbno){

     
        return "請輸入以下各欄位資料：";
     

}

function editRecordHint(tbno){
   
	   return "修改該部門資料";
	 
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
  
	   return "搜尋部門搜尋欄位選擇";
   
}