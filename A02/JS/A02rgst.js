
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
	    var a02elements=document.getElementsByName('a02update');	
		var a02athments=document.getElementsByName('a02others');
	}else{
		 var a02elements=document.getElementsByName('a0bupdate');	
		 var a02athments=document.getElementsByName('a0bothers');	
	}
	for(var r=0;r<a02athments.length;r++){        //關聯資料
		    nonjsn.push(a02athments[r].tagName.toUpperCase()=='SPAN'?a02athments[r].innerHTML:a02athments[r].value);		
	}
	for(var q=1;q<a02elements.length;q++){  	    //開始堆疊待異動資料陣列
		 tbjsn.push(a02elements[q].value);	   
	}
	if (tbno==1){
	    var checkboxes = document.getElementsByName("typeOfChange");                            
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
            if(a02elements[j].value.trim()==="" ){		
		        if (j<3){
				   if(j==1){
			         a02elements[j].placeholder="不得空白" ;	
				    	  
			      }else{					
					 filtermsg( a02elements[j],"不得空白");
				  }	  
			    }
		         return false ;
            }else{		     
		        if(a02elements[j].nextSibling){		
				  if(j!=1 ){
			          a02elements[j].parentNode.removeChild(a02elements[j].nextSibling);
				  }
		        }			
	        }   
	    }
	}else{
	    if(a02elements[1].value.trim()==="" ){	
		     a02elements[1].placeholder="不得空白" ;
			  return false ;
		}  
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(a02elements[1].value!="" ){
 
		   tbjsn.push(0);
		   tbjsn.push(0);
	        if (tbno==0){
		       var selectElement=document.getElementById("dptnoopt");
			    var slicelth=selectElement.value.length;
		        nonjsn[0]=( selectElement.options[selectElement.selectedIndex].text.slice(slicelth));  //取得部門名稱內容		    
			}
		   var rspns=TableToJson(tbjsn,nonjsn,tbno);        
	    } 
	    else{
		    blkshow("功能資料不齊全無法新增權限");
        }		
    }else{    //如果是修改
        if (typeof updflg=="undefined"){
		    updflg=window.event;
        }	
	    var target=getEventTarget(updflg);	     
        			 							
        if (tbno==0){		
		    var maintable=document.getElementById("maintbody1");
			 var selectElement=document.getElementById("dptnoopt");		
			 var slicelth=selectElement.value.length;
			  nonjsn[0]=(selectElement.options[selectElement.selectedIndex].text.slice(slicelth));			//變更部門名稱				
        }else{
			 var maintable=document.getElementById("maintbody2");			 
			    
		}			
		var tablerowindex=0;
		for(var i=0;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 				 
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);				
         var rspns=TableToJson(tbjsn,nonjsn,tbno);

   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}

function authEnter(event){  //權限複製小視窗TEXTBOX ENTER
	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
	 if (event.keyCode == 13){
		 if (target.value.trim().length<2){
			blkshow('無效帳號');
		 }else{			 
		    var responseDiv=document.getElementById("serverResponse1");	
	         responseDiv.innerHTML=='權限複製中.....';
			 athcpy(event);			
		 }
	}		  	
	
     return;    			
}

function athcpy(event){        //權限複製
	if (typeof event=="undefined"){
		event=window.event;
	}
	  var target=getEventTarget(event);
	  
	  var rsp=atjtb(sourceAccount(1,0),document.getElementById('authcopy_no').value);
	 blocksclose();			//關掉原視窗
   
     return true;	 		
}

function atjtb(sourceaccount,objaccount){
	   var args=arguments; //記錄傳進了的參數
	 
        var rsp="";        
		var order_head="{";
		for (var n=0;n<args.length;n++){
			order_head+="\""+"elem"+String(n)+"\""+":"+"\""+args[n]+"\""+",";
		}
		var json=order_head.slice(0,-1)+"}";   //去掉最後一個逗號再加上右大引號

     var str_json=JSON.stringify(json);	 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respond;
     request.open("POST", "A02/BKND/A02ath.php", true);        //新增記錄的php檔
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=JSON.parse(request.responseText);								     			
			if(!isNaN(Number(rsp))){     			   
			   var responseDiv=document.getElementById("serverResponse1");	 
		   	   responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	           responseDiv.innerHTML="已授權"+objaccount+" "+rsp+"筆程式功能..."; 		
			   
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息				
            }										
        }
    }  
    
	return true; 	
}

function removeAuthAll(event){     //確定移除所有權限
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');
	 
		 var sendDeleRec="filename="+sourceAccount(1,0);  
	 
		var rsp="";  	
        
	

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;
		 
		var url="A02/A02rmv.php?timestamp="+new Date().getTime();	     
		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);
		
		function respond(){
               	     
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
		     
			  if(!isNaN(Number(rsp))){  //如果是數字
				 			
				   
				       var responseDiv=document.getElementById("serverResponse1");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選帳號其權限已全部移除完畢....."; 		
				  
				  
			     blocksclose();  //關掉原視窗
			  }else{
		          blkshow(rsp);	
			  }
               		  
	      }
        }

}

function modifyFields(tbno,txtword,ajTable,aWaitUpdate){   //新增修改時出現之欄位
    if (tbno==0){   //如果異動表頭資料
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='員工編號:';
	    var oTd = oTr.insertCell(1);				 
		oTd.innerHTML="<input type='text' name='a02update' class='txt' style='width:70%;' maxlength='10'/>";  			     
		var oTd = oTr.insertCell(2);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='失效日期:';
	    var oTd = oTr.insertCell(3);
		oTd.innerHTML="<input type='date' name='a02update' class='txt' style='width:70%;' value='2999-12-31' maxlength='10'/>"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='電子郵件:';
	    var oTd = oTr.insertCell(1);
		oTd.colspan=3;
	    oTd.innerHTML="<input type='email' name='a02update' class='txt' style='width:60%;' maxlength='50'/>";  
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='部門:';
	    var oTd = oTr.insertCell(1);
		var slt3=document.createElement("select");
		slt3.setAttribute("id","dptnoopt");
		slt3.setAttribute("name","a02update");
		slt3.setAttribute("style","width:90%;");
		oTd.appendChild(slt3);			
	    var oTd = oTr.insertCell(2);	   
        oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='連絡電話:';
	    var oTd = oTr.insertCell(3);               
	    oTd.innerHTML="<input type='tel' name='a02update' class='txt' style='width:70%;' maxlength='25'    />";  				 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='登入帳號:';
	    var oTd = oTr.insertCell(1);		                		
		if(txtword==2){   //如果是修改		                
			oTd.innerHTML="<input type='text' name='a02update' id='accountNo' class='txt' style='background-color:#B9B9FF;width:50%;' maxlength='10' readOnly=true  />"; 
		    optionitem(aWaitUpdate[3],slt3.id,6,"A02/A14srch.php");	
		}else{
			oTd.innerHTML="<input type='text' name='a02update' id='accountNo' class='txt' style='width:50%;' maxlength='10'/>"; 
			optionitem(Cookies.get("INT_193"),slt3.id,6,"A02/A14srch.php");	
		}			 
	    var oTd = oTr.insertCell(2);	   
        oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='人員姓名:';
	    var oTd = oTr.insertCell(3);               	            
		oTd.innerHTML="<input type='text' name='a02update' id='staffname' class='txt' style='width:70%;' maxlength='40'    />";  				
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
        oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='a02update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
        oTr.setAttribute("style","display:none;");	
	}else{               //異動表身資料			  
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
			bsechkbx.id='tpchg'+String(l);
			bsechkbx.name='typeOfChange';
			bsechkbx.setAttribute('style','visibility:hidden;');
			var basechklbl=document.createElement('label'); 
			basechklbl.setAttribute('name','lblchk');
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
	    oTd.innerHTML='功能編號:';
	    var oTd = oTr.insertCell(1);		                		
		if(txtword==2){   //如果是修改		                
			oTd.innerHTML="<input type='text' name='a0bupdate' id='prg_no' class='txt' style='background-color:#B9B9FF;width:25%;' maxlength='3' readOnly=true  />"; 
		}else{
			oTd.innerHTML="<input type='text' name='a0bupdate' id='prg_no' class='txt' style='width:25%;' maxlength='3'/>"; 				   
			var srchButton4=document.createElement("input");				   
            srchButton4.setAttribute("type","button");	
            srchButton4.setAttribute("class","scopelook");				   
			srchButton4.style.background="url('digits/brows1.png')";   
			attachEventListener(srchButton4,"click",PrgSrch,false);				
			oTd.appendChild(srchButton4);										  
		}			 
	    var oTd = oTr.insertCell(2);	   
        oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='功能名稱:';
	    var oTd = oTr.insertCell(3);  
		oTd.innerHTML="<span name='a0bothers' id='prg_name'></span>&nbsp&nbsp";
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	    var oTd = oTr.insertCell(0);	             
	    oTd.innerHTML='紀錄號碼';
	    var oTd = oTr.insertCell(1);
        oTd.colspan=3;
	    oTd.innerHTML="<input type='text' name='a0bupdate' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
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
                case 1:                                   //如果是新增
				   if (tbno==0){
			          document.getElementById("accountNo").focus();	
			       }else{
				       document.getElementById("prg_no").focus();
				   }
				   break;
			    case 2:           
                                          //如果是修改，要先顯示目前該筆資料										  
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來	
				   if (tbno==0){
  				      document.getElementById("staffname").focus();				  			 				  				     					  
					   var editinit=document.getElementsByName('a02update');
				      
					    document.getElementById("dptnoopt").value= aWaitUpdate[3];       //部門代號		
						
				   }else{							 
				      
				       document.getElementById('prg_name').innerHTML=notWaitdata[0];
					  
				       var basechk=document.getElementsByName('typeOfChange');
				       var baselbl=document.getElementsByName('lblchk');
				      
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
						
				      var editinit=document.getElementsByName('a0bupdate');
					
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
				case 8:
				      var authTxt=document.getElementById('authcopy_no');
					  authTxt.focus();
						
				
			 }	

}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動
    if (tbno==0){  //處理表頭新增
		for(var i=0;i<3;i++){
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=args[i];		
			oTd.setAttribute("class","directdata");						 
			oTd.setAttribute("style","text-align:left;width:8%;");						 
		}				 
		var oTd = oTr.insertCell(oTr.cells.length);					
		oTd.innerHTML=nongs[0];
		oTd.setAttribute("class","indirectdata");
		oTd.setAttribute("style","text-align:left;width:8%;");
		for(var i=3;i<args.length-2;i++){
			var oTd = oTr.insertCell(oTr.cells.length);
			oTd.innerHTML=args[i];		
			oTd.setAttribute("class","directdata");
			switch (i) {
			    case 3:
				    oTd.setAttribute("style","text-align:left;width:12%;");   //連絡電話
				    break;
				case 4:
					oTd.setAttribute("style","text-align:left;width:20%;");   //e-mail
					break;
				default:
					oTd.setAttribute("style","text-align:left;width:8%;");
					break;
			}
						  
		}				 
	}else{           //處理表身新增				    
		var oTd = oTr.insertCell(oTr.cells.length);  //功能編號
		oTd.innerHTML=args[0];				
        oTd.setAttribute("class","directdata");	
		oTd.setAttribute("style","width:8%;text-align:center;");
		var oTd = oTr.insertCell(oTr.cells.length);  //功能名稱
		oTd.innerHTML=nongs[0];				
        oTd.setAttribute("class","indirectdata");	
		oTd.setAttribute("style","width:17%;");	
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
	var oTd = oTr.insertCell(oTr.cells.length);	  //最後更新
	oTd.setAttribute("class","directdata");	
	oTd.setAttribute("style","display:none");	
	oTd.innerHTML=rsp.lastupdate;		
}

function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動
	if (tbno==0){     //處理表頭修改
	    var maintable=document.getElementById("maintbody1");
		for (var j=2;j<4;j++){				        
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];						     
		}											
		maintable.rows[args[arglth-1]].cells[4].innerHTML=nongs[0];					     
		for(j=5;j<arglth;j++){
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];						    
		}												 
		maintable.rows[args[arglth-1]].cells[arglth].innerHTML=rsp.lastupdate;						   
	}
	else{                //處理表身修改
	    var maintable=document.getElementById("maintbody2");	
		maintable.rows[args[arglth-1]].cells[2].innerHTML=nongs[0];				
		for (var j=3;j<12;j++){				            
			maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-2];						 
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
		slt5.options.add(new Option('登入帳號','a01.F01'));
		slt5.options.add(new Option('人員姓名','a01.F03'));
	    slt5.options.add(new Option('部門編號','a01.F04'));
		slt5.options.add(new Option('部門名稱','a14.F02'));
		slt5.options.add(new Option('員工編號','a01.F12'));
	} else{
		slt5.options.add(new Option('功能代號','a02.F03'));
		slt5.options.add(new Option('功能名稱','a03.F02')); 	
		slt5.options.add(new Option('附加權限一','a03.F08')); 
		slt5.options.add(new Option('附加權限二','a03.F09')); 
		slt5.options.add(new Option('附加權限三','a03.F10')); 
		slt5.options.add(new Option('附加權限四','a03.F11')); 
		slt5.options.add(new Option('附加權限五','a03.F12')); 
	}
}

function bodyCopyList(ajTable){
    var oTr=ajTable.insertRow(ajTable,ajTable.length);  
	var oTd = oTr.insertCell(0);	
    oTd.setAttribute('style','text-align:right;width:20%');					
	oTd.innerHTML='操作帳號';
	var oTd = oTr.insertCell(1);
	var authTxt=document.createElement('input');
	authTxt.type='text';
	authTxt.setAttribute('id','authcopy_no');
	authTxt.setAttribute('class','txt');				
	authTxt.setAttribute('placeholder','請輸入未授權帳號');
	attachEventListener(authTxt,'keypress',authEnter,false);  
	oTd.appendChild(authTxt);				 
}

function  addNewRecordHint(tbno){

    if (tbno==0){  //表頭資料
        return "請新增登入帳號：";
    }else{
		return "請新增："+document.getElementById('fatherkey').innerHTML+'\u{A0}'+document.getElementById('keydscrpt').innerHTML+"的功能授權資料："; 
	}		

}

function editRecordHint(tbno){
    if (tbno==0){  
	   return "修改帳號資料："; 
	}else{
		return "請修改："+document.getElementById('fatherkey').innerHTML+'\u{A0}'+document.getElementById('keydscrpt').innerHTML+"，本功能授權"; 					   
	}
}

function copyToOtherList(tbno){
   return "將帳號"+sourceAccount(1,0)+":"+sourceAccount(2,0)+"的權限複製到";
}
function removeAllList(tbno){
  return "是否確定移除"+sourceAccount(1,0)+":"+sourceAccount(2,0)+"的所有權限?";   //只會出現在首頁
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
   if(tbno==0){
	   return "搜尋人員帳號欄位選擇";
   }else{
       return "搜尋"+document.getElementById('fatherkey').innerHTML+"帳號授權欄位選擇";
   }	   
}
 