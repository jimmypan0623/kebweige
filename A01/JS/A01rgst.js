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
	}else if(tbno==1){
		 var a01elements=document.getElementsByName('a02update');	
		 var a01athments=document.getElementsByName('a02others');	
	}else{
	    var a01elements=document.getElementsByName('a04update');	
		var a01athments=document.getElementsByName('a04others');	
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

function removeAuthAll(event) {          //確定移除所有權限
    var evt = event || window.event;
    var sendDeleRec = "filename=" + encodeURIComponent(sourceAccount(1, 0)); 
    var url = "A01/BKND/A01rmv.php?timestamp=" + Date.now();   

    var request = new XMLHttpRequest(); // 直接實例化，移除 IE 檢查
    request.open("POST", url);   
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {      
            var rsp = request.responseText;             
            var responseDiv = document.getElementById("serverResponse1");    
            
            if (rsp.trim() !== '' && !isNaN(Number(rsp))) {                   
                if (responseDiv) {
                    responseDiv.style.fontWeight = "bold";
                    responseDiv.style.color = "#536a60";
                    responseDiv.innerHTML = "所勾選功能其所有人權限已全部移除完畢.....";         
                }
                blocksclose();  
            } else {
                blkshow(rsp);   
            }
        }
    };  
    request.send(sendDeleRec);      
}

function modifyFields(tbno,txtword,ajTable){   //新增修改時出現之欄位
    if(tbno==0){				
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');
	    oTd.innerHTML='頁籤三';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='page3_name' class='txt' maxlength='20' style='width:50%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');
	    oTd.innerHTML='頁籤二';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='page2_name' class='txt' maxlength='20' style='width:50%;'   />"; 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');
	    oTd.innerHTML='頁籤一';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a01update' id='page1_name' class='txt' maxlength='20' style='width:50%;'   />"; 
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
	}else if(tbno==1){
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
	}else{
	     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='資料關聯:';
	    var oTd = oTr.insertCell(1);	   
	    oTd.innerHTML="<input type='text' name='a04update' class='txt' id='datarelative' maxlength='50' style='width:70%;'  />"; 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='欄位內容:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='text' name='a04update' class='txt' id='fieldcontent' maxlength='50' style='width:70%;'  />";
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='欄寬百分比:';
	    var oTd = oTr.insertCell(1);
	    oTd.innerHTML="<input type='number' name='a04update' class='txt' id='widthpercent'  value=1  style='width:15%;text-align:right;'  />"; 				       
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='顯示位置:';
	    var oTd = oTr.insertCell(1);		
		var slt11=document.createElement("select");
	    slt11.options.add(new Option('靠左','L'));
	    slt11.options.add(new Option('置中','C'));
	    slt11.options.add(new Option('靠右','R'));
		 slt11.setAttribute("id","whichlocate");
	    slt11.setAttribute("name","a04update");
	    oTd.appendChild(slt11);	  		
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);		
	    var oTd = oTr.insertCell(0);
	    oTd.setAttribute('style','text-align:right;width:15%');	
	    oTd.innerHTML='是否顯示:';
	    var oTd = oTr.insertCell(1);		
		var slt12=document.createElement("select");
	    slt12.options.add(new Option('是','S'));
	    slt12.options.add(new Option('否','H'));	    
		slt12.setAttribute("id","showorhide");
	    slt12.setAttribute("name","a04update");
	    oTd.appendChild(slt12);	  			    
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='讀取來源:';
	    var oTd = oTr.insertCell(1);    
		var slt13=document.createElement("select");
	    slt13.options.add(new Option('直接','D'));
	    slt13.options.add(new Option('關聯','I'));	  
	    slt13.options.add(new Option('DOM','M'));
		slt13.setAttribute("id","wrfrom");
	    slt13.setAttribute("name","a04update");
	    oTd.appendChild(slt13);	  			    
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='欄位名稱:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='a04update' id='fieldname'   class='txt' style='width:45%;'  maxlength='20'/>";  				 				  
	    
	   	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    var oTd = oTr.insertCell(0);	   
	    oTd.setAttribute('style','text-align:right;width:15%');					
	    oTd.innerHTML='欄位順序:';
	    var oTd = oTr.insertCell(1);               
	    oTd.innerHTML="<input type='text' name='a04update' id='fieldorder'  class='txt'  style='width:25%;'  maxlength='4'/>";  				 				  		  			 	
		var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
		var oTd = oTr.insertCell(0);	             
		oTd.innerHTML='紀錄號碼';
		var oTd = oTr.insertCell(1);   
		
		oTd.innerHTML="<input type='text' name='a04update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
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
			}else{
			   var fldOrd=document.getElementById("fieldorder");
			   fldOrd.focus();	
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
			}else{
				document.getElementById("fieldorder").focus();
			    var editinit=document.getElementsByName('a04update');
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
		case 8:
			var authTxt=document.getElementById('authcopy_no');
			 authTxt.focus();		
	}
}

function  colomnAfterChange(tbno,oTr,args,nongs,rsp){    //TableToJson(args,nongs,tbno)函數內新增紀錄後呼叫的畫面更動
   	var fldidx=0;
	var argsNo=0;
	var nongsNo=0;	
		//while(fldsgsroup(fldidx,tbno)){
		while(rsp.fldsatrr[fldidx]){		
			var oTd = oTr.insertCell(oTr.cells.length); 			
			if(rsp.fldsatrr[fldidx][0]=='directdata'){
				oTd.innerHTML=args[argsNo];
				if(tbno==1 && fldidx<6){
				    if( oTd.innerHTML=='E'){
					   oTd.setAttribute("style","width:5%;;text-align:center;color:#BAF4D8;");
				    }else{ 
					   oTd.setAttribute("style","width:5%;text-align:center;");
				    }
				}
				argsNo++;
			}else{					
               oTd.innerHTML=nongs[nongsNo];	
			   	                
				if(fldidx>10 && tbno==1){
				    if(args[fldidx-6]!='Y'){	
				   	   oTd.setAttribute("style","width:11%;text-decoration: line-through;color:#7f8890;text-align:center;");
				    }else{
					   oTd.setAttribute("style","width:11%;text-align:center;");
				    }	
				}
				
				if(tbno==2 && fldidx==3){   //資料來源
				    oTd.innerHTML=whichDIM(args[2]);	
				}				
				if(tbno==2 && fldidx==5){   //是否顯示
				    oTd.innerHTML=showOrNot(args[3]);	
				}			
				if(tbno==2 && fldidx==7){   //顯示位子
				    oTd.innerHTML=locateLCR(args[4]);	
				}
				nongsNo++; 	
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
			//最後更新
	var oTd = oTr.insertCell(oTr.cells.length);	
	oTd.setAttribute("class","directdata");	
	oTd.setAttribute("style","display:none");	
	oTd.innerHTML=rsp.lastupdate;			
}
function colomnContextChange(tbno,args,nongs,arglth,rsp){    //TableToJson(args,nongs,tbno)函數修改紀錄後呼叫的畫面更動	
	if (tbno==0){     //處理表頭修改   	   								
		var maintable=document.getElementById("maintbody1");	 
	}else if(tbno==1){
	    var maintable=document.getElementById("maintbody2");	
	}else{
	     var maintable=document.getElementById("maintbody3");	
	}		
	var fldidx=0;
	var argsNo=0;	
	 	
	 while(rsp.fldsatrr[fldidx]){	
		if(rsp.fldsatrr[fldidx][0]=='directdata'){
			 maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=args[argsNo];				
			argsNo++;
		}else{
			
			if(fldidx==3 && tbno==2){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=whichDIM(args[2]);    
			}
			if(fldidx==5 && tbno==2){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=showOrNot(args[3]);    
			}
			if(fldidx==7 && tbno==2){
				    maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=locateLCR(args[4]);    
			}
			if(fldidx > 10 && tbno==1){
			    if(args[fldidx-6]!='Y'){	
				   	maintable.rows[args[arglth-1]].cells[fldidx+1].setAttribute("style","text-align:left;width:11%;text-decoration: line-through;color:#7f8890;");
				}else{
					maintable.rows[args[arglth-1]].cells[fldidx+1].setAttribute("style","text-align:left;width:11%;");
				}				    				     			
			}							 
		}
		fldidx++;
	}
	maintable.rows[args[arglth-1]].cells[fldidx+1].innerHTML=rsp.lastupdate;	
}

function bodyCopyList(ajTable){
    var oTr=ajTable.insertRow(ajTable,ajTable.length);  
	var oTd = oTr.insertCell(0);	
    oTd.setAttribute('style','text-align:right;width:20%');					
	oTd.innerHTML='功能編號';
	var oTd = oTr.insertCell(1);
	var authTxt=document.createElement('input');
	authTxt.type='text';
	authTxt.setAttribute('id','authcopy_no');
	authTxt.setAttribute('class','txt');				
	authTxt.setAttribute('placeholder','請輸入未設定欄位之功能編號');
	attachEventListener(authTxt,'keypress',authEnter,false);  
	oTd.appendChild(authTxt);				 
}

function  addNewRecordHint(tbno){
        if (tbno==0){
            return "請輸入新功能編號與名稱：";
	    }else if(tbno==1){
			return "請新增："+sourceAccount(1,0)+'\u{A0}'+document.getElementById('keydscrpt1').innerHTML+'\u{A0}'+'使用帳號';
		}else{
		   return "請新增："+sourceAccount(1,0)+'\u{A0}'+document.getElementById('keydscrpt2').innerHTML+'\u{A0}'+'欄位設定';
		}			
}

function editRecordHint(tbno){
   if (tbno==0){  
	   return "修改功能預設授權狀況";
	}else if(tbno==1){
	   return "修改此帳號授權："+document.getElementById('fatherkey1').innerHTML+'\u{A0}'+document.getElementById('keydscrpt1').innerHTML;
	}else{
	    return "修改此程式欄位："+document.getElementById('fatherkey2').innerHTML+'\u{A0}'+document.getElementById('keydscrpt2').innerHTML;
	}

}
function copyToOtherList(tbno){
   return "將功能"+sourceAccount(1,0)+":"+sourceAccount(2,0)+"的畫面欄位複製到";
}

function removeAllList(tbno){
  return "是否確定移除"+sourceAccount(1,tbno)+":"+sourceAccount(2,tbno)+"的所有權限?";   //只會出現在首頁
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
   if(tbno==0){
	   return "功能搜尋欄位選擇";
   }else{
       return "搜尋"+document.getElementById('fatherkey1').innerHTML+"功能帳號欄位選擇";
   }	   
}

function srcArgobj(srcId){
    if(srcId=='whono'){
	   var qrystring=document.getElementById(srcId).value;
      //return {"headtitle":"請選取人員帳號姓名","drpshtWidth":"28%","thCntnt":['人員編號', '人員姓名'],"thWidth":['50%','50%'],"urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
       return {"headtitle":"請選取人員帳號姓名","drpshtWidth":"28%","urlPth":"C01/BKND/A01srch.php","clickfunc":chseprg1,"qryString":qrystring,"mendwidth":"calc( 100% - 1em )"};
	}
}

function chseprg1(event)  //選擇資料後填入目前form之textbox
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	 
	 var stuffNo=document.getElementById('whono');
	 stuffNo.value="";
     var stuffName=document.getElementById('whonameEx');			
	 stuffName.innerHTML="";
	var maintable=document.getElementById("stuffTbody");  
		for(var i=0;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			    stuffNo.value=maintable.rows[i].cells[0].innerHTML;								 
				stuffName.innerHTML=maintable.rows[i].cells[1].innerHTML;				
				break;
			}				 
		}             
	srchblkclose(event);	
	return true;
}	


/////
function authEnter(event){  //權限複製小視窗TEXTBOX ENTER
	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
	 var responseDiv=document.getElementById("serverResponse3");	
	 responseDiv.style.textAlign='center';	
	 responseDiv.innerHTML='<img src="digits/Loading.gif" width="1.5%" height="1.5%" border="0">';
	 if (event.keyCode == 13){
		 if (target.value.trim().length<3){
			blkshow('非系統功能');
			responseDiv.innerHTML=='&nbsp';
		 }else{			 
			 athcpy(event);			
		 }
	}		  		
    return;    			
}

function athcpy(event){        //欄位屬性複製
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
    request.open("POST", "A01/BKND/A04cpy.php", true);        //新增記錄的php檔
    request.setRequestHeader("Content-type", "application/json");
    request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=JSON.parse(request.responseText);			
            var responseDiv=document.getElementById("serverResponse3");	 
		   	responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 			
			if(!isNaN(Number(rsp))){     			   			   
	           responseDiv.innerHTML="已複製"+objaccount+" "+rsp+"畫面欄位屬性..."; 					   
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息	
				responseDiv.innerHTML="&nbsp";
            }										
        }
    }      
	return true; 	
}