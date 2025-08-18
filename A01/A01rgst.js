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
	    var a01elements=document.getElementsByName('a01update');	
		var a01athments=document.getElementsByName('a01others');
	}else{
		 var a01elements=document.getElementsByName('a02update');	
		 var a01athments=document.getElementsByName('a02others');	
	}
	
	for(var r=0;r<a01athments.length;r++){        //關聯資料
		    nonjsn.push(a01athments[r].tagName.toUpperCase()=='SPAN'?a01athments[r].innerHTML:a01athments[r].value);		
	}
	var chks=getElementsByAttribute('class','tpchg');			 
	for(var q=1;q<a01elements.length;q++){  	    //開始堆疊待異動資料陣列
	     if(q==3){
			if(tbno==0){ 
		       for(var r=0;r<chks.length;r++){
		          tbjsn.push(chks[r].checked?'Y':'');
	            }
			} 
		 }
		 tbjsn.push(a01elements[q].value);	   
	}
	
	if(tbno==1){
  
	    var checkboxes = document.getElementsByName("typeOfChange1");                            
	    for(var r=0;r<checkboxes.length;r++){
		    tbjsn.push((checkboxes[r].style.visibility=='hidden')?'E':(checkboxes[r].checked?'Y':'N'));
	    }
	    var attchedchk=document.getElementsByName('auth_attch');
        for(var s=0;s<attchedchk.length;s++){
		    tbjsn.push((attchedchk[s].style.visibility=='hidden')?'E':(attchedchk[s].checked?'Y':'N'));
	    }
	    var checklabels = document.getElementsByName("authatt"); 
		for(var m=0;m<checklabels.length;m++){
			 nonjsn.push(checklabels[m].innerHTML);
		}
	}
	if (tbno==0){
	    for(var j=1;j<3;j++){  
            if(a01elements[j].value.trim()==="" ){		
		        if (j<3){
				   if(j==1){
			         a01elements[j].placeholder="不得空白" ;	
				    	  
			      }else{					
					 filtermsg( a01elements[j],"不得空白");
				  }	  
			    }
		         return false ;
            }else{		     
		        if(a01elements[j].nextSibling){		
				  if(j!=1 ){
			          a01elements[j].parentNode.removeChild(a01elements[j].nextSibling);
				  }
		        }			
	        }   
	    }
	}else{
	    if(a01elements[1].value.trim()==="" ){	
		     a01elements[1].placeholder="不得空白" ;
			  return false ;
		}  
	}	
    if (updflg==1){     //如果是新增
	    if(a01elements[1].value!=""){	
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



function removeAuthAll(event){     //確定移除所有權限
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	
	//var tabs=getElementsByAttribute('class','tab');	 
	var sendDeleRec="filename="+sourceAccount(1,0);  	 
	var rsp="";  	
    if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	}else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
    }			 
	request.onreadystatechange = respond;		 
	var url="A01/A01rmv.php?timestamp="+new Date().getTime();	     		 
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendDeleRec);		
	function respond(){               	     
	    if (request.readyState == 4 && request.status == 200) {     
		    rsp=request.responseText;			     
		    if(!isNaN(Number(rsp))){  //如果是數字				   
			    var responseDiv=document.getElementById("serverResponse1");	 
		   	    responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	            responseDiv.innerHTML="所勾選功能其所有人權限已全部移除完畢....."; 		
			     blocksclose();  //關掉原視窗
		    }else{
		        blkshow(rsp);	
		    }
               		  
	    }
    }
}


function modifyFields(tbno,txtword,ajTable){   //新增修改時出現之欄位
    if(tbno==0){
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='功能屬性';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='prg_attr' class='txt' maxlength='4' style='width:10%;'  required />"; 	 							
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');
	    oTd.innerHTML='附加權限五';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='auth5_attch' class='txt' maxlength='20' style='width:70%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='附加權限四';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='auth4_attch' class='txt' maxlength='20' style='width:70%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='附加權限三';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='auth3_attch' class='txt' maxlength='20' style='width:70%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='附加權限二';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='auth2_attch' class='txt' maxlength='20' style='width:70%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='附加權限一';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='auth1_attch' class='txt' maxlength='20' style='width:70%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='基本權限';
	    var oTd = oTr.insertCell(1);			   			   	
		var baseauthdiv=document.createElement('div');   //從外層元素開始加入				
	    baseauthdiv.setAttribute('style','background:#FFFFB9;width:80%;');
		var baseorder=['新增 ','修改 ','刪除 ','列印 '];   
		for (var l=1;l<baseorder.length+1;l++){
		    var bsechkbx=document.createElement('input'); 
		    bsechkbx.type='checkbox';
		    bsechkbx.id='tpchg'+String(l);
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
	    oTd.innerHTML='功能說明';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='prg_name' class='txt' maxlength='20' style='width:80%;'  required />"; 	 			
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='功能編號';
	    var oTd = oTr.insertCell(1);	            
        if(txtword==2){   //如果是修改	
		    oTd.innerHTML="<input type='text' name='a01update' id='prg_no' class='txt' style='background-color:#B9B9FF;width:20%;' maxlength='3' readOnly=true  />";  				                             		
	    }else{
	    	oTd.innerHTML="<input type='text' name='a01update' id='prg_no' class='txt' maxlength='3' style='width:20%;'  required />"; 
	    }				
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);
    	oTd.setAttribute('style','text-align:right;width:15%;');
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
    	oTd.innerHTML="<input type='text' name='a01update' id='rcrd_no' class='txt' maxlength='14' style='width:40%;'   />";                 
        oTr.setAttribute("style","display:none;");		
	}else {
		var authorder=['\u4E00','\u4E8C','\u4E09','\u56DB','\u4E94'];  //一 二 三 四 五
		for(var k=5;k>0;k--){                                          //附加權限五到一
			var oTr=ajTable.insertRow(ajTable,ajTable.length);
	        var oTd = oTr.insertCell(0);
	        oTd.setAttribute('style','text-align:right;width:20%');	
	        oTd.innerHTML='附加權限'+authorder[k-1]+':';
			var oTd = oTr.insertCell(1);
			var authdiv=document.createElement('div');   //從外層元素開始加入
	        authdiv.setAttribute('style','background:#FFFFB9;width:70%;');
			var chkbx=document.createElement('input'); 
			chkbx.type='checkbox';
			chkbx.id='auth'+String(k)+'_attch';
			chkbx.name='auth_attch';
			chkbx.setAttribute('style','visibility:hidden;');
			var chklbl=document.createElement('label'); 
			chklbl.setAttribute('name','authatt');				 			
			chklbl.setAttribute('for',chkbx.id);			
			authdiv.appendChild(chkbx);
			authdiv.appendChild(chklbl);
			oTd.appendChild(authdiv);
			oTr.setAttribute("style","display:none;");
		}
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:20%');
	    oTd.innerHTML='基本權限:';
	    var oTd = oTr.insertCell(1);
		var baseauthdiv=document.createElement('div');   //從外層元素開始加入				
	    baseauthdiv.setAttribute('style','background:#FFFFB9;width:75%;');
		var baseorder=['新增','修改','刪除','列印'];   
		for (var l=1;l<5;l++){
			var bsechkbx=document.createElement('input'); 
			bsechkbx.type='checkbox';
			bsechkbx.id='tpchg1'+String(l);
			bsechkbx.name='typeOfChange1';
			bsechkbx.setAttribute('style','visibility:hidden;');
			var basechklbl=document.createElement('label'); 
			basechklbl.setAttribute('name','lblchk1');
			basechklbl.setAttribute('style','visibility:hidden;');
			basechklbl.setAttribute('for',bsechkbx.id);
			basechklbl.innerHTML=baseorder[l-1]+'&nbsp&nbsp';
			baseauthdiv.appendChild(bsechkbx);
			baseauthdiv.appendChild(basechklbl);					 
		}			
        oTd.appendChild(baseauthdiv);	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='人員帳號:';
	    var oTd = oTr.insertCell(1);		                		
		if(txtword==2){   //如果是修改		                
			oTd.innerHTML="<input type='text' name='a02update' id='whono' class='txt' style='background-color:#B9B9FF;width:50%;' maxlength='10' readOnly=true  />"; 
		}else{
			oTd.innerHTML="<input type='text' name='a02update' id='whono' class='txt' style='width:50%;' maxlength='10' required/>"; 				   
			var srchButton4=document.createElement("input");				   
            srchButton4.setAttribute("type","button");	
            srchButton4.setAttribute("class","scopelook");				   
			srchButton4.style.background="url('digits/brows1.png')";   
			attachEventListener(srchButton4,"click",srchshow,false);				
			oTd.appendChild(srchButton4);										  
		}			 
	    var oTd = oTr.insertCell(2);	   
        oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='人員姓名:';
	    var oTd = oTr.insertCell(3);    
		oTd.innerHTML="<span name='a02others' id='whonameEx'></span>&nbsp&nbsp"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
        oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='a02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
        oTr.setAttribute("style","display:none;");	
	}
}

function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="25px";      // 高度也往上提 		
    return true;

}


function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){
    switch (txtword) {
        case 1:                                     //如果是新增
			if (tbno==0){						 
			    document.getElementById("prg_no").focus();	
			}else if(tbno==1){
				 
				var acntNo=document.getElementById("whono");
				acntNo.focus();	
				attachEventListener(acntNo,"change",a01AccountName,false);	//找帳號姓名
				
				
				var baseSpan=document.getElementsByName('authBase');  //從首頁找過來
				var basechk=document.getElementsByName('typeOfChange1');
				var baselbl=document.getElementsByName('lblchk1');				      
				for (var i=0;i<basechk.length;i++){     //將可勾選的恢復成可視
				    basechk[i].style.visibility=((baseSpan[i].innerHTML)?"visible":"hidden");					 
					baselbl[i].style.visibility=((baseSpan[i].innerHTML)?"visible":"hidden");					      			  
				}				
				var extraSpan=document.getElementsByName('authExtra');
				var attchedchk=document.getElementsByName('auth_attch');
				var spanforchk=document.getElementsByName('authatt');					
		        for (var j=0;j<attchedchk.length;j++){     //將可勾選的恢復成可視					      						
					spanforchk[j].innerHTML=extraSpan[j].innerHTML;
					attchedchk[j].style.visibility=((spanforchk[j].innerHTML)?"visible":"hidden");
					ajTable.rows[j+3].style.display=((spanforchk[j].innerHTML)?"block":"none");									
				}										
			}			     	
			break;
		case 2:        //如果是修改
			document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
			if (tbno==0){
				document.getElementById("prg_name").focus();	
				var editinit=document.getElementsByName('a01update');
				for(var k=0;k<3;k++){ 
					editinit[k].value=aWaitUpdate[k];
				}		
				var tpchgs=getElementsByAttribute("class","tpchg");
				for(var i=0;i<tpchgs.length;i++){
				    tpchgs[i].checked=(aWaitUpdate[i+3]=="Y");
				}						
				for(var m=3;m<editinit.length;m++){
				    editinit[m].value=aWaitUpdate[m+4];				
				}  
			}else if(tbno==1){
				document.getElementById('whonameEx').innerHTML=notWaitdata[0];					  
			    var basechk=document.getElementsByName('typeOfChange1');
				var baselbl=document.getElementsByName('lblchk1');				      
				for (var i=0;i<basechk.length;i++){     //將可勾選的恢復成可視
				    basechk[i].style.visibility=(aWaitUpdate[i+2]=="E"?"hidden":"visible");					 
					baselbl[i].style.visibility=(aWaitUpdate[i+2]=="E"?"hidden":"visible");
					basechk[i].checked=(aWaitUpdate[i+2]=="Y");					  
				}				 
				var attchedchk=document.getElementsByName('auth_attch');
				var spanforchk=document.getElementsByName('authatt');					
		        for (var j=0;j<attchedchk.length;j++){     //將可勾選的恢復成可視
					attchedchk[j].style.visibility=(aWaitUpdate[j+6]=="E"?"hidden":"visible");
					attchedchk[j].checked=(aWaitUpdate[j+6]=="Y")					 				  
					spanforchk[j].innerHTML=notWaitdata[j+1];
					ajTable.rows[j+3].style.display=(aWaitUpdate[j+6]=="E"?"none":"block");						  
				}						
				var editinit=document.getElementsByName('a02update');
				for(var k=0;k<editinit.length;k++){
					editinit[k].value=aWaitUpdate[k];
				}		
			}					   				    			    
		    break;
		case 7:
			var txtseek=document.getElementById('searchWords');
			txtseek.focus();
			attachEventListener(txtseek,'keypress',textKeypress,false);
			break;        				 
	}
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動
    if (tbno==0){  //處理表頭新增
        var oTd = oTr.insertCell(oTr.cells.length);   //程式編號
		oTd.innerHTML=args[0];
		oTd.setAttribute("class","directdata");	
		oTd.setAttribute("style","text-align:center;width:7%;");				 
		var oTd = oTr.insertCell(oTr.cells.length);   //程式名稱
		oTd.innerHTML=args[1];
		oTd.setAttribute("class","directdata");
		oTd.setAttribute("style","text-align:left;width:17%;");	
		
		for(var i=2;i<7;i++){
			var oTd = oTr.insertCell(oTr.cells.length);   //屬性||新增||修改||刪除||列印
			oTd.innerHTML=args[i];
			oTd.setAttribute("class","directdata");
			oTd.setAttribute("style","text-align:center;width:5%;");
		}
		for(var i=7;i<12;i++){
			var oTd = oTr.insertCell(oTr.cells.length);    //附加功能一到五
			oTd.innerHTML=args[i];
			oTd.setAttribute("class","directdata");
			oTd.setAttribute("style","width:11%;");
		}
	}else{           //處理表身新增				    					   
		var oTd = oTr.insertCell(oTr.cells.length);  //帳務號碼
		oTd.innerHTML=args[0];				
        oTd.setAttribute("class","directdata");	
		oTd.setAttribute("style","width:10%;");
		var oTd = oTr.insertCell(oTr.cells.length);  //人員姓名
		oTd.innerHTML=nongs[0];				
        oTd.setAttribute("class","indirectdata");	
		oTd.setAttribute("style","width:15%;");	
		for(var i=1;i<10;i++){
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=args[i];	
			oTd.setAttribute("class","directdata");	
			if(i<5){
				if( oTd.innerHTML=='E'){
					oTd.setAttribute("style","width:5%;;text-align:center;color:#BAF4D8;");
				}else{ 
					oTd.setAttribute("style","width:5%;text-align:center;");
				}
			}else{
				oTd.setAttribute("style","display:none;");  
			}  
		}
		for(var j=1;j<6;j++){
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=nongs[j];	
			oTd.setAttribute("class","indirectdata");	
			oTd.setAttribute("style","width:11%;");
			if(nongs[j]){												        
				if(oTr.cells[j+6].innerHTML!='Y'){	
					oTd.setAttribute("style","width:11%;text-decoration: line-through;color:#7f8890;");
				}else{
					oTd.setAttribute("style","width:11%;");
				}						     							 
			} 
		}
				      	
	}
			//最後更新
	var oTd = oTr.insertCell(oTr.cells.length);	
	oTd.setAttribute("class","directdata");	
	oTd.setAttribute("style","display:none");	
	oTd.innerHTML=rsp.lastupdate;			
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	if (tbno==0){     //處理表頭修改   	   								
		var maintable=document.getElementById("maintbody1");	 					
		for (var j=2;j<arglth-1;j++){				       //表頭表身都是一樣的格式  					     
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						 
		}											
		maintable.rows[args[arglth-1]].cells[arglth-1].innerHTML=rsp.lastupdate;			
	}else{                //處理表身修改
	    var maintable=document.getElementById("maintbody2");				
		for (var j=1;j<10;j++){				            
			maintable.rows[args[arglth-1]].cells[j+2].innerHTML=args[j];								
	    }											
	    for (var k=12;k<17;k++){						       
		    if(nongs[k-11]){						
			    maintable.rows[args[arglth-1]].cells[k].innerHTML=nongs[k-11];
			    	if(maintable.rows[args[arglth-1]].cells[k-5].innerHTML!='Y'){	
			    		maintable.rows[args[arglth-1]].cells[k].setAttribute("style","width:11%;text-decoration: line-through;color:#7f8890;");
			    	}else{
			    		maintable.rows[args[arglth-1]].cells[k].setAttribute("style","width:11%;");
			    	}						     							 
		    } 
	    }						   
	    maintable.rows[args[arglth-1]].cells[arglth+5].innerHTML=rsp.lastupdate;
	}
}
function searchOptionsKey(tbno,slt5){	
	if (tbno==0){
		slt5.options.add(new Option('功能編號','a03.F01'));
		slt5.options.add(new Option('功能名稱','a03.F02'));		
		slt5.options.add(new Option('屬性','a03.F03'));		
	}else{
		slt5.options.add(new Option('人員帳號','a02.F01'));
		slt5.options.add(new Option('人員姓名','a01.F03')); 										  
	}   
}
function  addNewRecordHint(tbno){

        if (tbno==0){
            return "請輸入新功能編號與名稱：";
	    }else{
			return "請新增："+document.getElementById('fatherkey').value+'\u{A0}'+document.getElementById('keydscrpt').innerHTML+'\u{A0}'+'使用帳號';
		}						

}
function editRecordHint(tbno){
   if (tbno==0){  
	   return "修改功能預設授權狀況";
	}else{
	   return "修改此帳號授權："+document.getElementById('fatherkey').innerHTML+'\u{A0}'+document.getElementById('keydscrpt').innerHTML;
	}

}
function removeAllList(tbno){
  return "是否確定移除"+sourceAccount(1,tbno)+":"+sourceAccount(2,tbno)+"的所有權限?";   //只會出現在首頁
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
   if(tbno==0){
	   return "功能搜尋欄位選擇";
   }else{
       return "搜尋"+document.getElementById('fatherkey').innerHTML+"功能帳號欄位選擇";
   }	   
}

function a01AccountName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetCustomNo=getEventTarget(event);		
	var sendSrcRec="filename="+targetCustomNo.value;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	
       
		var url="A01/A01AccountName.php?timestamp="+new Date().getTime();
			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);
			 
			 document.getElementById('whonameEx').innerHTML=rsp[0]['accountname'];			 
	          
		  }
	}
	return;
}