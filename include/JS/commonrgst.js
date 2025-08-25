function blkshow(txtword)
{
/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
    var dropext=document.getElementById('myModal');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal");
	dropsheet.setAttribute("class","modal");	
	dropsheet.style.display="block";	   
    dropsheet.style.position="fixed"; /* Stay in place */       		
    dropsheet.style.left="0";
    dropsheet.style.top="0";
    dropsheet.style.width="100%"; /* Full width */	
    dropsheet.style.height="100%";  	 
	dropsheet.style.zIndex="1";
	dropsheet.style.paddingTop="100px"; /* Location of the box */
	dropsheet.style.overflow="auto";     /* Enable scroll if needed */	
    dropsheet.style.backgroundColor = "rgba(0,0,0,0.4)"; /* Black w/ opacity 外層黑透內層白底*/
	var body=document.getElementsByTagName("body")[0];
	body.appendChild(dropsheet);            //最外層<div>加入body
    var dropsheet_content=document.createElement('div');
	dropsheet_content.setAttribute("id","modal-content");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="28%";		
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="18px";	  	  
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
    if (isNaN(Number(txtword))){         //如果傳進來的參數是字串	   
	    var closeSpan = document.createElement('span')
 	    closeSpan.setAttribute("class","close");
	    closeSpan.style.color="#000";
	    closeSpan.style.float="right";
	    closeSpan.style.fontSize="28px";
	    closeSpan.style.fontWeight="bold";		
        closeSpan.innerHTML = '\u{274E}';           //'\u{274E}'//'&times';  
        attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	dropsheet_content.appendChild(closeSpan);        //加進內容框		
	    var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		p_tx.style.color="blue";
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
		dropsheet_content.style.width="28%";		
		dropsheet_content.style.boxShadow = "5px 5px 5px 5px #2F0000";  //#424200
    }else{
		dropsheet_content.style.boxShadow = "5px 5px 5px 5px black";  //
		   //新增||修改||刪除||
		var tbno=0;
		var tabs=getElementsByAttribute('class','tab');	
		for(var i=0;i<tabs.length;i++){
		    if(tabs[i].checked){
			   var tbno=i;
			   break;
		    }
		}
		//新增修改畫面提示訊息
		switch(txtword){
			case 1:	 			    //新增
				    if(addNewRecordHint(tbno)=="修改密碼："){
				        var headtitle= addNewRecordHint(tbno);
				    }else{
					  var headtitle= addNewRecordHint(tbno)+"(新增完畢請按\u{274E}結束鈕)"; 
				    }
				    break;					  
			case 4:				                //刪除
				    var headtitle="確定刪除所點選紀錄?";
				    break;	   
			case 3:				 	      //確認或過帳
				    if (tbno==0){  //表頭資料	
				        if(sourceAccount(1,0)){
					       var headtitle='單號:'+sourceAccount(1,0)+",核准確認?";
					    }else{
						   blkshow("無資料可確認!");
						   return false;
					    }
				    }else{				 
					    var headtitle='單號:'+document.getElementById('fatherkey').innerHTML+",核准確認?";					 
				    }
				    break;
			case 5:                             //反確認或反過帳
				    if (tbno==0){  //表頭資料	
				        if(sourceAccount(1,0)){
					        var headtitle='單號:'+sourceAccount(1,0)+",反確認修正?";
					    }else{
						   blkshow("無資料可反確認!");
						   return false;
					   }
				    }else{
					    var headtitle='單號:'+document.getElementById('fatherkey').innerHTML+",反確認修正?";
				    }	                   
				    break;
			case 6:                                    //轉單				 
				    var headtitle=transRecordHint(tbno);
				    break;	  
			case 7:                                  //搜尋				      
				    var headtitle=searchKeyHint(tbno);
				    break;		   	  
			case 8:	              //複製該表頭之表身所有紀錄到另一個表頭下
				   var headtitle=copyToOtherList(tbno);
				   break;
			case 9:                            //表頭保留但移除該表頭的表身所有紀錄
				   var headtitle=removeAllList(tbno);
				   break;	   					 
			case 101:                                  //第一頁其他第一按鈕功能開窗			 			       
				    var headtitle=page1OtherWindow1();					
				   break;		  
			case 201:                                  //第二頁其他第一按鈕功能開窗			      
				   var headtitle=page2OtherWindow1();
				   break;		 	   
			case 2:                             //修改
				    var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				    var notWaitdata=[];    //不直接異動的資料	 											  
				    var maintable=document.getElementById("maintbody"+(tbno+1).toString());							  
				    for(var i=0;i< maintable.rows.length; i++){			 		            
					    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
					  	    for (j=0;j<maintable.rows[i].cells.length-1;j++){
						   	    if(maintable.rows[i].cells[j].className=='directdata'){							
								   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
							    }else{
							      notWaitdata.push(maintable.rows[i].cells[j].innerHTML);  // 直接傳入後端的資料也先收集起來
							    }
						    }					   			   	   
						    break;					   
					    }
				    } 				 			
				    var headtitle=editRecordHint(tbno);
				    break;					  
		} 		    
		var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		dialog.className="crncyDialog"; 		 
		dialog.style.position="relative";		  		    
		var dialogTitle=document.createElement("div");		
		dialogTitle.setAttribute("style","font-size:medium;font-family:Arial;font-weight:bold; color:#336666;");
		dialogTitle.appendChild(document.createTextNode(headtitle));	
		dialog.appendChild(dialogTitle);		  
		var ajTable=document.createElement("table");	
		ajTable.setAttribute("id","aplyform2");
		ajTable.style.width='100%';						
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		if(txtword==2 || txtword==4 || txtword==3 || txtword==5 || txtword==6 || txtword==7 || txtword==8 || txtword==9 || txtword>100){
			var dialogButton1=document.createElement("input");		   
			dialogButton1.setAttribute("type","button");
			dialogButton1.setAttribute("class","btn");
			if(txtword==5 || txtword==6 || txtword==3){
				dialogButton1.setAttribute("value",txtword==5?"\u{1F197}":(txtword==6?"\u{1F251}":"\u{2705}"));    //\u{2713}\u{1F250} \u{1F44C}
			}else{
				dialogButton1.setAttribute("value","\u{2B55}");
			}					
			dialogButton1.setAttribute("title","確認此筆異動資料，快速鍵Alt+S");
			dialogButton1.setAttribute("accesskey","S");				 
			switch(txtword){
				case 2:
					attachEventListener(dialogButton1,"click",sendFilePrc,false);
					break;
				case 3:
					attachEventListener(dialogButton1,"click",shurePrc,false);
					break;
				case 5:
					attachEventListener(dialogButton1,"click",vrshrPrc,false);	
					break;							
				case 6: 
				    attachEventListener(dialogButton1,"click",shurePrc,false);
				     break;
				case 4:
					attachEventListener(dialogButton1,"click",delConfirm,false);
					break;	
				case 7: 
					attachEventListener(dialogButton1,'click',searchConfirm,false);    
					break;  						      
				case 8:
				   attachEventListener(dialogButton1,"click",athcpy,false);
				   break;
				case 9:	
				   attachEventListener(dialogButton1,"click",removeAuthAll,false);
				   break;		
			}								
		}
		var dialogButton3=document.createElement("input");
		dialogButton3.setAttribute("type","button");
		dialogButton3.setAttribute("class","btn");
		dialogButton3.setAttribute("value","\u{274E}");
		dialogButton3.setAttribute("title","放棄或結束並離開，快速鍵Alt+X");
		dialogButton3.setAttribute("accesskey","X");					
		attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		var oTd = oTr.insertCell(0);	   		      
		if (txtword==2 || txtword==4 || txtword==3 || txtword==5 || txtword==6 || txtword==7 || txtword==8 || txtword==9){			
		   oTd.appendChild(dialogButton1);	         //修改刪除	確認  反確認
		}			
		if(txtword==1){    //如果是新增			    
			var oTr=ajTable.insertRow(ajTable,ajTable.length);
			var oTd = oTr.insertCell(0);	                 
			oTd.innerHTML="<input type='button' class='btn' id='btn_uploadfile' value='\u{2B55}' title='確認此筆新增，快速鍵Alt+S' accesskey='S' onclick='sendFilePrc(1);' >";   			   		
		}
		oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
		oTd.setAttribute('colspan',2); 
		oTd.setAttribute('style','text-align:center');
		if(txtword==1 || txtword==2){  //如果是新增或修改	   
			modifyFields(tbno,txtword,ajTable,aWaitUpdate);      //新增或修改的待填欄位			
		}			 
		if(txtword==6){    //轉單		
			var oTr=ajTable.insertRow(ajTable,ajTable.length);
			var oTd = oTr.insertCell(0);	         
			transConfirm(oTd);							 			 
        }		
		 if(txtword==7){   //搜尋
			var oTr=ajTable.insertRow(ajTable,ajTable.length);				
			var oTd = oTr.insertCell(0);						
			var oTr=ajTable.insertRow(ajTable,ajTable.length);	 
			var oTd = oTr.insertCell(0);	 
			oTd.setAttribute('style','text-align:center;width:25%');					 
			var slt5=document.createElement("select");
			 searchOptionsKey(tbno,slt5);  //搜尋畫面鍵值選項
			 slt5.setAttribute("id","filterField");
			 slt5.setAttribute("name","srchfld");
			 slt5.setAttribute("style","width:100%;");
			 attachEventListener(slt5,'change',notIceChg,false);   
			 oTd.appendChild(slt5);	           
			 if(slt5.options[cko[6](0)].text.indexOf('(Y/N)')>0){   //如果是過濾選項則歸零
			     var baui=cko[6](0);
				 cko[6](baui*(-1));				  
			  }
			  slt5.value=(slt5.options[cko[6](0)].value);
			   var oTd = oTr.insertCell(1);
			   oTd.setAttribute('style','text-align:right;width:6%');	
			   oTd.innerHTML="欄=";
			  var oTd = oTr.insertCell(2);	         
            	  
			 oTd.innerHTML="<input type='search' id='searchWords' class='txt' placeholder='輸入搜尋關鍵字' size='43' tabindex='1' style='width:80%;' />";                   
		      
		}				  
		if(txtword==8){         //複製提示畫面新增欄位
			bodyCopyList(ajTable);			    			 
		} 
		if(txtword==101){  
		    page1Detail01(ajTable);
		}
		if(txtword==201){  
		    page2Detail01(ajTable);
		}
		var formJason=document.createElement('form');		   
		formJason.id="formdata";
		formJason.appendChild(ajTable);	             		 
		dialog.appendChild(formJason)	        	 	 
		dropsheet_content.appendChild(dialog);	
		if(txtword==1 || txtword==2 || txtword==7 || txtword==8 || txtword==9 || txtword>100){			 			   
			topAndWidthModify(dropsheet_content,dropsheet,txtword,tbno);  //微調異動畫面的高度與寬度
		}	
	        
		initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable);  //新增修改時預設focus欄位
		
    }	   
	return true;
}

/////  將table內容資料轉為jason

	//以下為新增內容
function TableToJson(args,nongs,tbno){	
	
    
		var yesbill=getCookie("kindofda");  //	判斷是否為單據
        var rsp="";      
        if (tbno==0){		
		    var order_head="{";
		}else if(tbno==1){
			var fthkey=document.getElementById('fatherkey');  
		    var order_head="{"+"\""+"elema"+"\""+":"+"\""+fthkey.innerHTML.trim()+"\""+",";
		}else if(tbno==2){
		      var fthkey=document.getElementById('fatherkey1');  
		    var order_head="{"+"\""+"elema"+"\""+":"+"\""+fthkey.innerHTML.trim()+"\""+",";
		}
		for (var n=0;n<args.length;n++){
			order_head+="\""+"elem"+String(n)+"\""+":"+"\""+args[n]+"\""+",";
		}									
		var json=order_head.slice(0,-1)+"}";   //去掉最後一個逗號再加上右大引號	 	 
	
     var str_json=JSON.stringify(json);	
	  var mainright=document.getElementsByTagName('title'); 
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }	
	 else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
     }		
	 request.onreadystatechange = respondUpdate;
	 var mainrightValue=(left(mainright[0].innerHTML,3)).toUpperCase();
	 if (tbno==0){	
	      var url=mainrightValue+"/BKND/"+mainrightValue+"wrt.php?timestamp="+new Date().getTime();	
          
	 }else if(tbno==1){
		   var url=mainrightValue+"/BKND/"+mainrightValue+"bodywrt.php?timestamp="+new Date().getTime();	
	       
	 }else if (tbno==2){
		 var url=mainrightValue+"/BKND/"+mainrightValue+"hipswrt.php?timestamp="+new Date().getTime();		  
	 }
	 
	 request.open("POST",url);	
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respondUpdate() {		
        if (request.readyState == 4 && request.status == 200) {   
           		
			rsp=JSON.parse(request.responseText);	
			var lastmodifydate=rsp.lastupdate;    //最後異動先丟入變數,否則丟入之函數無法呼叫			
		  
            var arglth=	args.length;		
			if(!isNaN(Number(rsp.order_no))){     			   
			   if(args[arglth-2]==0){     //如果回傳為新增記錄號碼且旗標值為0表示新增成功就做表格插入一列		
				  var oTable = document.getElementById("maintbody"+(tbno+1).toString());
				  var oTr=oTable.insertRow(0);	
                  oTr.setAttribute("name","mainrow");
				  var oTd = oTr.insertCell(oTr.cells.length);				
				  oTd.innerHTML=rsp.order_no;
				  oTd.setAttribute("class","directdata");
				  oTd.setAttribute("style","display:none;");				  			
				  colomnAfterChange(tbno,oTr,args,nongs,rsp);   //新增確認後表格欄位處理					   
				  for (var i=1;i<oTr.cells.length;i++){					 
					  attachEventListener(oTr.cells[i],'click',rowchoose,false);		//點選資料   
				  }				    				   				 			  	
		             var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                 oTd.setAttribute("style","width:41px;display:none");   
	 	             var myCheck=document.createElement('input'); 
		             myCheck.type="checkbox";
				     myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());
					 attachEventListener(myCheck,'click',chooserc,false);
                     oTd.appendChild(myCheck); 			
                   	 chooserc(1);        
                     oTable.scrollTo(0,0)	;	//滾動到此表格第一筆
                     if (tbno==0){			//表頭才需要		                         						  
						 if(yesbill=='R'){   //如果為單據檔	 
						   var tabs=getElementsByAttribute('class','tab');	
					        tabs[1].checked=true;			//表頭新增完畢立即跳到表身處理單據內容新增			
	                        tab2View(event);
					     }	 
						 blkshow(1);	
					 }else{
                        blkshow(1);	
					 }				 
			   }else{            //如果是修改則原列更改內容		                    		   								

					colomnContextChange(tbno,args,nongs,arglth,rsp);   //修改確認後表格欄位處理

			   }			   
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息					
            }										
        }
    }      
	return true; 
}  

function notIceChg(event){
    if (typeof event=="undefined"){
		event=window.event;		
    }			 
	var target=getEventTarget(event);
   
    var slt = target.selectedIndex;		
	if(slt!=cko[6](0)){   //如果紀錄的鍵值不等於現在選得鍵值
	   var bau=cko[6](0);
	   cko[6](bau*(-1));   
	   cko[6](slt);
	} 
	var srch=document.getElementById('searchWords');
	var srchPar=srch.parentNode;	
	
	var rdochk=document.getElementById('rdchg1');	
	if(target.options[slt].text.indexOf('(Y/N)')>0){		 			
		srch.style.display="none";		 			
		if (!rdochk){
			 if(srch.nextSibling ){
				 srch.parentNode.removeChild(srch.nextSibling);
			 }
			var sureChoice=['不限定 ','已確認 ','未確認 '];   			
		    for (var l=1;l<sureChoice.length+1;l++){
		        var bsechkbx=document.createElement('input'); 
		        bsechkbx.type='radio';		       
		        bsechkbx.setAttribute('name','rdchg');			
				bsechkbx.id='rdchg'+String(l);				
		        var basechklbl=document.createElement('label'); 
		        basechklbl.setAttribute('name','lblrdo');					
		        basechklbl.setAttribute('for',bsechkbx.id);
		        basechklbl.innerHTML=sureChoice[l-1]+'&nbsp&nbsp';
				bsechkbx.value=((l==1)?' ':((l==2)?'Y':'N'));
				
		        srchPar.appendChild(bsechkbx);
		        srchPar.appendChild(basechklbl);					 
				if (l==1){   //預設值
					bsechkbx.checked='checked';
			    }
	        } 			
		}  
	}else{
		 srch.style.display="block";
		 var rdochk=document.getElementById('rdchg1');
		 if (rdochk){			  
			 var rdchgs=getElementsByAttribute('name','rdchg');			 
			 for (var j=0;j<rdchgs.length;j++){
			     srchPar.removeChild(rdchgs[j]);				 
			 }
			 var lblrdos=getElementsByAttribute('name','lblrdo');
			  for (var k=0;k<lblrdos.length;k++){
			     srchPar.removeChild(lblrdos[k]);				 
			 }
		 }
	}

}