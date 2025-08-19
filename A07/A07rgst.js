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
		closeSpan.style.backgroundColor="#00DD00";
        closeSpan.innerHTML = '\u{274E}'//'\u{274E}'//'&times';  	 
        attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	dropsheet_content.appendChild(closeSpan);        //加進內容框		
	    var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		p_tx.style.color="blue";
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
		dropsheet_content.style.width="28%";	
    }else{
		       //新增||修改||刪除||權限複製 || 移除權限
			 if(txtword==1){       //是新增
               var headtitle="請輸入程式編號：";
			
	         }else if(txtword==4){
				 
				 var headtitle="確定刪除所勾選紀錄?";
			 }else if(txtword==3){
				 var headtitle=sourceAccount()+":的權限複製到";
			 }else if(txtword==5){
				   var headtitle="是否確定移除"+sourceAccount()+":的所有程式功能?";
			 }

			 if(txtword==2){   //如果是修改
			     var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var tabs=getElementsByAttribute('class','tab');				 
				 
				 if (tabs[0].checked)     //畫面在表頭狀態下
				 {
					 var maintable=document.getElementById("member");
					 
				 }else{                   //畫面在表身
				     var maintable=document.getElementById("member2");					 
				 }

				 	 				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 
		            
					if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
					   for (j=0;j<maintable.rows[i].cells.length-1;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   
			   	   
                       break;					   
			         }
		          } 
				 var headtitle="程式編號："+aWaitUpdate[1];
		     } 
		    
		    var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		    dialog.className="customDialog"; 		 
		    dialog.style.position="relative";		  		    
		    var dialogTitle=document.createElement("div");		
			dialogTitle.setAttribute("style","font-size:medium;font-family:Arial;font-weight:bold; color:#336666;");
		    dialogTitle.appendChild(document.createTextNode(headtitle));	
		    dialog.appendChild(dialogTitle);		  
		    var ajTable=document.createElement("table");	
		    ajTable.setAttribute("id","aplyform2");
	        ajTable.style.width='100%';						
		    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	        if(txtword==2 || txtword==4 || txtword==3 || txtword==5){
			    var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","確認");
				dialogButton1.setAttribute("title","確認此筆異動資料，快速鍵Alt+S");
				dialogButton1.setAttribute("accesskey","S");
				
				if(txtword==2){
		           attachEventListener(dialogButton1,"click",sendFilePrc,false);	
			    } else if(txtword==3){
					 attachEventListener(dialogButton1,"click",athcpy,false);
				}else{
				   attachEventListener(dialogButton1,"click",delConfirm,false);	
				}								
			}
		    var dialogButton3=document.createElement("input");
		    dialogButton3.setAttribute("type","button");
		    dialogButton3.setAttribute("class","btn");
		    dialogButton3.setAttribute("value","結束");
			dialogButton3.setAttribute("title","放棄或結束並離開，快速鍵Alt+Q");
			dialogButton3.setAttribute("accesskey","Q");
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if ((txtword==2 || txtword==4) || txtword==3 ||txtword==5){
			
               oTd.appendChild(dialogButton1);	         //修改刪除與權限複製		   
			}
			
			 if(txtword==1){    //如果是新增
			    
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);	                 
			    oTd.innerHTML="<input type='button' class='btn' id='btn_uploadfile' value='確認' title='確認此筆新增，快速鍵Alt+S' accesskey='S' onclick='sendFilePrc(1);' >";   			   
		
 	         }
            oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
		   if(txtword==1 || txtword==2){  //如果是新增或修改		  
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
                 //oTr.setAttribute("style","display:none;");							
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:20%');	
	            oTd.innerHTML='程式名稱:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<div id='prg_name'></div>"; 
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:20%');	
	            oTd.innerHTML='程式編號:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='prg_no' id='prg_no' class='txt' maxlength='3' autosize  />"; 
                if(txtword==2){   //如果是修改	
                   oTr.setAttribute("style","display:none;");			
			    }else{
				   var srchButton1=document.createElement("input");				   
                   srchButton1.setAttribute("type","button");
		           srchButton1.setAttribute("class","btn");
		           srchButton1.setAttribute("value","瀏覽");
				   attachEventListener(srchButton1,"click",srchshow,false);
				   oTd.appendChild(srchButton1);					
				} 				
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);	             
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='rcrd_no' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	
             }else if(txtword==3){                 //複製權限
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
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);		     		  		  		   	  	   
		     dialog.appendChild(formJason)	        	 	 
		     dropsheet_content.appendChild(dialog);	
             if(txtword==1 || txtword==2){			 
			    dropsheet_content.style.width="45%";   //原訊息內框畫面寬度調整  
                dropsheet.style.paddingTop="20px";      // 高度也往上提 				
			 }
			 switch (txtword) {
                case 1:                                   //如果是新增
			       document.getElementById("prg_no").focus();	
			       var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		           var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
				   break;
			    case 2:                                                     //如果是修改，要先顯示目前該筆資料
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
				   document.getElementById('prg_name').innerHTML=aWaitUpdate[2];
				   var basechk=document.getElementsByName('typeOfChange');
				   var baselbl=document.getElementsByName('lblchk');
				   var ctt=0;
				   for (var i=0;i<basechk.length;i++){     //將可勾選的恢復成可視
				  	   basechk[i].style.visibility=(aWaitUpdate[i+3]=="E"?"hidden":"visible");					 
					   baselbl[i].style.visibility=(aWaitUpdate[i+3]=="E"?"hidden":"visible");
					   basechk[i].checked=(aWaitUpdate[i+3]=="Y");					  
				   }				 
				   var attchedchk=document.getElementsByName('auth_attch');
				   var spanforchk=document.getElementsByName('authatt');
		           for (var j=0;j<attchedchk.length;j++){     //將可勾選的恢復成可視
					  attchedchk[j].style.visibility=(aWaitUpdate[j+7]=="E"?"hidden":"visible");
					  attchedchk[j].checked=(aWaitUpdate[j+7]=="Y")					 				  
					  spanforchk[j].innerHTML=aWaitUpdate[j+12];
					  ajTable.rows[j+4].style.display=(aWaitUpdate[j+7]=="E"?"none":"block");						  
				  }
                    break;				  
			    case 3: 
				   document.getElementById('authcopy_no').focus();
			 }				 
    }	   
	  return true;
}
function blocksclose(event){  //關閉註冊彈出視窗
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
/////  將table內容資料轉為jason
//function TableToJson(loginno,prgno,newauth,editauth,delauth,prntauth,auth1attach,auth2attach,auth3attach,auth4attach,auth5attach,nbrflag,rowno) {   //由此紀錄剩餘的table內容開始轉jason資料   
function TableToJson(args){
	//以下為新增內容		   
	 	var tabs=getElementsByAttribute('class','tab');	
        var rsp="";        
		var order_head="{";
		for (var n=0;n<args.length;n++){
			order_head+="\""+"elem"+String(n)+"\""+":"+"\""+args[n]+"\""+",";
		}
		var json=order_head.slice(0,-1)+"}";   //去掉最後一個逗號再加上右大引號         
		var str_json=JSON.stringify(json);	 
	    if(window.ActiveXObject){
	    	var request = new ActiveXObject("Microsoft.XMLHttp");
	    }else if(window.XMLHttpRequest){
		   var request = new XMLHttpRequest();
        }		
	    request.onreadystatechange = respond;
        request.open("POST", "A07/A07wrt.php", true);        //新增記錄的php檔
        request.setRequestHeader("Content-type", "application/json");
        request.send(str_json);
        function respond() {		
            if (request.readyState == 4 && request.status == 200) {     
		    	rsp=JSON.parse(request.responseText);								     			
		    	if(!isNaN(Number(rsp.order_no))){     			   
			       if(args[11]==0){     //如果回傳為新增記錄號碼表示新增成功就做表格插入一列		
			          var oTable = document.getElementById("maintbody2");	
			    	  var oTr=oTable.insertRow(0);	
                      oTr.setAttribute("name","mainrow");
				      var oTd = oTr.insertCell(oTr.cells.length);				
				      oTd.innerHTML=rsp.order_no;
				      oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML= args[1];//prgno;
				      oTd.setAttribute("style","text-align:left;width:70px;");
				      var oTd = oTr.insertCell(oTr.cells.length);
				      if(args[11]==0){
				    	  oTd.innerHTML=rsp.prg_name;
				      }else{
				        oTd.innerHTML=document.getElementById('srch2').value;
				      }
				      oTd.setAttribute("style","text-align:left;width:224px;"); 
				      for(var v=2;v<6;v++){         //新增||修改||刪除||列印
				    	  var oTd = oTr.insertCell(oTr.cells.length);
				          oTd.innerHTML=args[v]; //newauth editauth delauth prntauth;
				          oTd.setAttribute("style","text-align:center;width:47px;"); 
				      }
				      for(var x=6;x<11;x++){      //附加權限一到五
					      var oTd = oTr.insertCell(oTr.cells.length);
				          oTd.innerHTML=args[x];
				          oTd.setAttribute("style","text-align:center;width:93px;");
				      }
				      for (var i=1;i<oTr.cells.length-1;i++){					 
					      attachEventListener(oTr.cells[i],'click',rowchoose,false);		//點選資料   
				      }				    				  
				      //以下不顯示				 
	           	      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML=rsp.auth1remark;
				      oTd.setAttribute("style","display:none;");
				      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML=rsp.auth2remark;
				      oTd.setAttribute("style","display:none;");
				      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML=rsp.auth3remark;
				      oTd.setAttribute("style","display:none;");
				      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML=rsp.auth4remark;
				      oTd.setAttribute("style","display:none;");
				      var oTd = oTr.insertCell(oTr.cells.length);
				      oTd.innerHTML=rsp.auth5remark;
				      oTd.setAttribute("style","display:none;");
				     //以上不顯示				  	
		              var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                  oTd.setAttribute("style","width:41px;");   
	 	              var myCheck=document.createElement('input'); 
		              myCheck.type="checkbox";
		              myCheck.setAttribute("name","recordchosen2");   //讓使用者勾選的checkbox		
		              attachEventListener(myCheck,'click',chooserc,false);
                      oTd.appendChild(myCheck); 	
					  chooserc(1);
					  oTable.scrollTo(0,0); //滾動到第一筆
                   	  if(args[11]==0){		//如果是新增才重複顯示新增畫面
                         blkshow(1);
					  }else{
					  	 document.getElementById('srch2').value="";
					  }					 
			       }else{            //如果是修改原列更改內容
			          if (tabs[0].checked){
			             var maintable=document.getElementById("member");
	                  }else{
	                     var maintable=document.getElementById("member2");
		              }					
				      for (var j=2;j<11;j++){				        
						maintable.rows[args[12]].cells[j+1].innerHTML=args[j];
			          }
			       }
			  }else{
				blkshow(rsp);   //新增不成功才顯示訊息				
              }										
          }
        }      
	    return true; 
}  
function sendFilePrc(updflg){     //新增資料上傳檔案及修改程序   
    var tabs=getElementsByAttribute('class','tab');	
	var tbjsn=[];
	var recordNo=document.getElementById("rcrd_no");
	//var loginNo=document.getElementById("fatherkey");
	tbjsn.push(document.getElementById("fatherkey").value);
	var prgNo=document.getElementById("prg_no");	
	tbjsn.push(prgNo.value);	
    var prgName=document.getElementById("prg_name");		
	var checkboxes = document.getElementsByName("typeOfChange");                            
	for(var r=0;r<checkboxes.length;r++){
		tbjsn.push((checkboxes[r].style.visibility=='hidden')?'E':(checkboxes[r].checked?'Y':'N'));
	}
	var attchedchk=document.getElementsByName('auth_attch');
    for(var s=0;s<attchedchk.length;s++){
		tbjsn.push((attchedchk[s].style.visibility=='hidden')?'E':(attchedchk[s].checked?'Y':'N'));
	}
	//var uploadFilebtn=document.getElementById("btn_uploadfile");	 
    if (updflg==1){     //如果是新增	 
	    if(!/^[a-zA-Z0-9]/.test(prgNo.value)){			 		     
			if(!prgNo.parentNode.childNodes[2]){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("此欄不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      prgNo.parentNode.appendChild(errorSpan1);
		    }	 
		    prgNo.focus();
		    return false ;
        }else{		     
			if(prgNo.parentNode.childNodes[2]){		      
			   prgNo.parentNode.removeChild(prgNo.parentNode.childNodes[2]);
		    }			
	    }
		if(prgName.innerHTML.trim()===""){        
		    if(!prgName.nextSibling){
		      var errorSpan2=document.createElement("span");		
			  errorSpan2.style.color="red";
			  errorSpan2.style.fontFamily="標楷體";
		      var errorMessage2=document.createTextNode("請點選瀏覽按鈕選擇");
		      errorSpan2.appendChild(errorMessage2);
		      errorSpan2.classId="errorMsg";
		      prgName.parentNode.appendChild(errorSpan2);
		    }	 
		    prgNo.focus();
		    return false ;
        }else{
	
			if(prgName.nextSibling){			
		       prgName.parentNode.removeChild(prgName.nextSibling);
		    } 
	    }		
        if(prgNo.value!="" ){
		   tbjsn.push(0);
		   tbjsn.push(0);		  
           //var rspns=TableToJson(loginNo.value,prgNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
	       var rspns=TableToJson(tbjsn);
		} 
	    else{
		    blkshow("欄位資料不齊全無法新增權限");
        }		
    }else{    //如果是修改
        if (typeof updflg=="undefined"){
		    updflg=window.event;
        }	
	    var target=getEventTarget(updflg);	
        
	    if (tabs[0].checked){
			var maintable=document.getElementById("member");
	    }else{
	       var maintable=document.getElementById("member2");
		}
		var baseauth=document.getElementsByName('typeOfChange');
		var baselbl=document.getElementsByName('lblchk');
	 
		var prg_name=document.getElementById('srch2'); 
		var tablerowindex=0;
		for(var i=1;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 
				prg_name.value=maintable.rows[i].cells[2].innerHTML;   //將待異動資料存入陣列				
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 				 
	     //var rspns=TableToJson(loginNo.value,prgNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,recordNo.value,tablerowindex); 	   
		 tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			 
         var rspns=TableToJson(tbjsn); 	   		 
   }   
   blocksclose();			//關掉原視窗   
   return true;	 	
}
function delConfirm(event){     //確定刪除
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');
	 if(tabs[0].checked){  //如果目前畫面是表頭
		 var maintable=document.getElementById("member");
		 var sendDeleRec="filename="+"F01='"+sourceAccount()+"'";	//在此下SQL語法傳給後端PHP	DELETE FROM a02 where F00 = 
	 }else{                //畫面是表身
         var maintable=document.getElementById("member2");
		 var aWaitDelete=[];		 
		  for(var i=1;i< maintable.rows.length; i++){			 
		     if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
				aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
			 }			 
		  }
	      var sendDeleRec="filename="+" F00 in("+aWaitDelete.toString()+")";	//在此下SQL語法傳給後端PHP	DELETE FROM a02 where F00 in 		  
     }	
		var rsp="";  	
        
	

        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;
		 
		var url="A07/A07del.php?timestamp="+new Date().getTime();	     
		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);
		
		function respond(){
               	     
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
		     
			  if(!isNaN(Number(rsp))){  //如果是數字
				 			
				   if(tabs[0].checked){  //如果目前畫面是表頭
				       var responseDiv=document.getElementById("serverResponse1");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選帳號其權限已全部移除完畢....."; 		
				  
				  }else{
				       var myThgrp=maintable.getElementsByTagName("th");
		               myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
				       var aWaitDelete=[];		 
		               for(var i=1;i< maintable.rows.length; i++){			 
		                  if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
				             aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
				            maintable.deleteRow(i);
				            i--;    //刪除一筆後記得把列數減一
			  	            cko[3](-1);				
			              }
		               } 
			 	       var responseDiv=document.getElementById("serverResponse2");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
				  }
			     blocksclose();  //關掉原視窗
			  }else{
		          blkshow(rsp);	
			  }
               		  
	      }
        }

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
	  var rsp=atjtb(sourceAccount(),document.getElementById('authcopy_no').value);
	 blocksclose();			//關掉原視窗
   
     return true;	 		
}
function atjtb(sourceaccount,objaccount){
	   var args=arguments; //記錄傳進了的參數
	 	var tabs=getElementsByAttribute('class','tab');	
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
     request.open("POST", "A07/A07ath.php", true);        //新增記錄的php檔
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

