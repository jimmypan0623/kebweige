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
	    closeSpan.style.fontSize="32px";
	    closeSpan.style.fontWeight="bold";
		closeSpan.style.backgroundColor="#E0E0E0";
        closeSpan.innerHTML = '&times';   	 
        attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	dropsheet_content.appendChild(closeSpan);        //加進內容框		
	    var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		p_tx.style.color="blue";
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
		dropsheet_content.style.width="28%";			
    }else{
		       //新增||修改||刪除||
			 if(txtword==1){       //是新增
               var headtitle="請輸入料號基本資料：(新增完畢請按結束鈕)";			
	         }else if(txtword==4){				 
				var headtitle="確定刪除所勾選紀錄?";
			 }else if(txtword==3){
				 /* var headtitle=sourceAccount()+":的權限複製到"; */
			 }
			 if(txtword==2){   //如果是修改
			     var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var tabs=getElementsByAttribute('class','tab');				 			
				var maintable=document.getElementById("member");				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 		            
					if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
					   for (j=0;j<maintable.rows[i].cells.length-1;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   			   	   
                       break;					   
			         }
		          } 
				 var headtitle="修改料號基本資料："; 
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
			dialogButton3.setAttribute("title","放棄或結束並離開，快速鍵Alt+X");
			dialogButton3.setAttribute("accesskey","X");
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if ((txtword==2 || txtword==4) ){			
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
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='產    地:';				
	            var oTd = oTr.insertCell(1);				
	            oTd.innerHTML="<input type='text' name='b01update' id='originplace' class='txt' maxlength='20' style='width:30%;'  />";                             	              		   
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='備註說明:';				
	            var oTd = oTr.insertCell(1);				
	            oTd.innerHTML="<input type='text' name='b01update' id='rmkdescription' class='txt' maxlength='40' style='width:90%;'  />";                             	             
		        var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='物料類別:';				
	            var oTd = oTr.insertCell(3);				
	            oTd.innerHTML="<input type='text' name='b01update' id='materialtype' class='txt' maxlength='20' style='width:40%;'  />";                             	             
			  var oTr=ajTable.insertRow(ajTable,ajTable.length);				
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='標準售價:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='number' name='b01update' id='salescost' class='txt' maxlength='11' value=0.000 style='width:30%;text-align:right;'  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='平均成本:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='number' name='b01update' id='averagecost' class='txt' maxlength='11' value=0.000 style='width:30%;text-align:right;'  />"; 
				if(Cookies.get('auth07')!='Y'){    //如果無權限處理成本欄位則不顯示
				   oTr.style.display='none';
				}		                
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採購前置:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='number' name='b01update' id='leadtime' class='txt' title='請輸入採購或生產所需天數' maxlength='20' value=0 style='width:30%;text-align:right'  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='收發料前置:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='number' name='b01update' id='timeforshipping' class='txt' title='請輸入倉庫收料上架所需天數' maxlength='2' value= 0 style='width:30%;text-align:right'  />"; 
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='領料類別:';				
	            var oTd = oTr.insertCell(1);
				var slt5=document.createElement("select");
				slt5.options.add(new Option('A  個別領料','A'));
				slt5.options.add(new Option('B  整批領料','B'));
				slt5.setAttribute("id","tpeaply");
				slt5.setAttribute("name","b01update");
				oTd.appendChild(slt5);	                                    
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='領用批量:';
	            var oTd = oTr.insertCell(3);
				oTd.innerHTML="<input type='number' name='b01update' id='lotqty' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />";                             		
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='料架位置:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='shelf' class='txt' maxlength='20' autosize  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='建立料表:';
	            var oTd = oTr.insertCell(3);
				var slt8=document.createElement("select");
				slt8.options.add(new Option('否','N'));
				slt8.options.add(new Option('是','Y'));
				slt8.setAttribute("id","billofmaterial");
				slt8.setAttribute("name","b01update");
				oTd.appendChild(slt8);	             
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='庫存上限:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='number' name='b01update' id='maxlimit' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='安全存量:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='number' name='b01update' id='minlimit' class='txt' maxlength='11' value=0 style='width:30%;text-align:right;' />"; 
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採/計單位比:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='number' name='b01update' id='rateofps' class='txt' maxlength='5' value=1.000 style='width:30%;text-align:right;'/>";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='保管部門:';
	            var oTd = oTr.insertCell(3);
				var slt3=document.createElement("select");
				slt3.setAttribute("id","dptnoopt");
				 slt3.setAttribute("name","b01update");
				oTd.appendChild(slt3);				
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採購單位:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='purchseach' class='txt' maxlength='4' style='width:30%;text-align:left;'  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='計料單位:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='stockeach' class='txt' maxlength='4' style='width:30%;text-align:left;' />";    
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='管理類別:';
	            var oTd = oTr.insertCell(1);
			    var slt9=document.createElement("select");
				slt9.options.add(new Option('A','A'));
				slt9.options.add(new Option('B','B'));
				slt9.options.add(new Option('C','C'));
				slt9.setAttribute("id","mngtpe");
				slt9.setAttribute("name","b01update");
				oTd.appendChild(slt9);	                                        
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='歸屬類別:';
	            var oTd = oTr.insertCell(3);
				var slt10=document.createElement("select");
				slt10.options.add(new Option('外購原料','YNN'));
				slt10.options.add(new Option('買賣商品','YNY'));
				slt10.options.add(new Option('自產銷售','NYY'));
				slt10.options.add(new Option('在製組件','NYN'));
				slt10.options.add(new Option('虛擬料號','NNN'));
				slt10.options.add(new Option('無須定義','YYY'));
				slt10.setAttribute("id","belongto");
				slt10.setAttribute("name","b01update");
				oTd.appendChild(slt10);			  					
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='料號:';
	            var oTd = oTr.insertCell(1);
				 if(txtword==2){   //如果是修改		                
					oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' style='background-color:#B9B9FF;width:90%;' maxlength='43' readOnly=true autosize  />"; 
		         }else{
					oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' style='width:90%;' maxlength='43' />"; 
				 }			 
	            var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='品名規格:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='stockname' class='txt' maxlength='40' autosize  />";  
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);	             
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	
				var slt6=document.getElementById('tpeaply');
				if(txtword==2){						
				   optionitem(aWaitUpdate[8]);							     
                }else{
					optionitem("xx");				
				}								
             }			 	
             var formJason=document.createElement('form');		   
		     formJason.id="formdata";
	         formJason.appendChild(ajTable);		     		  		  		   	  	   
		     dialog.appendChild(formJason)	        	 	 
		     dropsheet_content.appendChild(dialog);	
             if(txtword==1 || txtword==2){			 
			    dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
                dropsheet.style.paddingTop="20px";      // 高度也往上提 				
			 }
			 switch (txtword) {
                case 1:                                   //如果是新增
			       document.getElementById("stockno").focus();	
			       var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		           var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
				   break;
			    case 2:                                                     //如果是修改，要先顯示目前該筆資料
				   document.getElementById("stockname").focus();
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
				   document.getElementById('stockname').innerHTML=aWaitUpdate[2];
				   document.getElementById("dptnoopt").value= aWaitUpdate[8];       //部門代號	
				   var editinit=document.getElementsByName('b01update');
				   for(var k=0;k<8;k++){
					   editinit[k].value=aWaitUpdate[k];
				   }				   
				    for(var k=9;k<editinit.length;k++){
					   editinit[k].value=aWaitUpdate[k+3];  //中間隔部門名稱總庫存量與在庫量三欄
				   }
				   break;			   
			 }				 
    }	   
	  return true;
}
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

/////  將table內容資料轉為jason
//function TableToJson(loginno,prgno,newauth,editauth,delauth,prntauth,auth1attach,auth2attach,auth3attach,auth4attach,auth5attach,nbrflag,rowno) {   //由此紀錄剩餘的table內容開始轉jason資料   
	//以下為新增內容
function TableToJson(args){	
	//var args=arguments; //記錄傳進了的參數
	 	//var tabs=getElementsByAttribute('class','tab');			
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
     request.open("POST", "B01/B01wrt.php", true);        //新增記錄的php檔
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=JSON.parse(request.responseText);	
            var arglth=	args.length;		
			if(!isNaN(Number(rsp.order_no))){     			   
			   if(args[arglth-3]==0){     //如果回傳為新增記錄號碼且旗標值為0表示新增成功就做表格插入一列		
			      var oTable = document.getElementById("maintbody");	
				  var oTr=oTable.insertRow(0);	
                  oTr.setAttribute("name","mainrow");
				  var oTd = oTr.insertCell(oTr.cells.length);				
				  oTd.innerHTML=rsp.order_no;
				  oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                  var oTd = oTr.insertCell(oTr.cells.length);
				  oTd.innerHTML=args[0];
				  oTd.setAttribute("style","text-align:left;width:226px;");
				  var oTd = oTr.insertCell(oTr.cells.length);				  
				  oTd.innerHTML=args[1];				  
				  oTd.setAttribute("style","text-align:left;width:180px;"); 
				  for(var i=2;i<8;i++){
					  var oTd = oTr.insertCell(oTr.cells.length);
					  oTd.innerHTML=args[i];
					  oTd.setAttribute("style","display:none;");
				  }
				  var oTd = oTr.insertCell(oTr.cells.length);
				  oTd.innerHTML=rsp.dpt_name;
				  oTd.setAttribute("style","display:none;");
				  //以下兩欄為總庫存數量與在庫量由於是新增料號所以庫存一定都是0
				  var oTd = oTr.insertCell(oTr.cells.length);
				  oTd.innerHTML=0;
				  oTd.setAttribute("style","display:none;");
				  var oTd = oTr.insertCell(oTr.cells.length);
				  oTd.innerHTML=0;
				  oTd.setAttribute("style","display:none;");
				  //******************************************//
				   for(var i=8;i<arglth-3;i++){
					  var oTd = oTr.insertCell(oTr.cells.length);
					  oTd.innerHTML=args[i];
					  oTd.setAttribute("style","display:none;");
				  }
				  var oTd = oTr.insertCell(oTr.cells.length);				       
					  oTd.innerHTML=rsp.lastupdate;
					  oTd.setAttribute("style","text-align:left;display:none;");		
				  for (var i=1;i<3;i++){					 
					  attachEventListener(oTr.cells[i],'click',rowchoose,false);		//點選資料   
				  }				    				   				 			  	
		             var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	                 oTd.setAttribute("style","width:41px;display:none");   
	 	             var myCheck=document.createElement('input'); 
		             myCheck.type="checkbox";
		             myCheck.setAttribute("name","recordchosen1");   //讓使用者勾選的checkbox		
		             attachEventListener(myCheck,'click',chooserc,false);
                     oTd.appendChild(myCheck); 			
                   	 chooserc(1);        
                     oTable.scrollTo(0,0)	;	//滾動到此表格第一筆	 	
                     cko[4](1);                 //閉包變數紀錄多一筆
					 var slt2=document.getElementById('recmth');	
					 var pagecount=Math.ceil(cko[4](0)/12);
					 if(slt2.options.length<Math.ceil(pagecount)){						 
						 var optdigts= (pagecount.toString()).length;
						 var item_no=paddingLeft(pagecount,optdigts);
		                 var varItem=new Option(item_no,item_no);
	    	             slt2.options.add(varItem);	 
					 }
                     blkshow(1);					  
					 
			   }else{            //如果是修改則原列更改內容		
                    		   
					var b01a_value_names=document.getElementsByName("b01value");		             
			        var maintable=document.getElementById("member");	               
				    for (var j=2;j<9;j++){				        
						maintable.rows[args[arglth-2]].cells[j].innerHTML=args[j-1];
						b01a_value_names[j-1].innerHTML=args[j-1];
			        }					
					b01a_value_names[3].innerHTML=belongtoshow(b01a_value_names[3].innerHTML);  //歸屬類別
					maintable.rows[args[arglth-2]].cells[9].innerHTML=rsp.dpt_name;					
					b01a_value_names[7].innerHTML=maintable.rows[args[arglth-2]].cells[8].innerHTML+' '+rsp.dpt_name;  //保管部門
					for(j=8;j<arglth-3;j++){
						maintable.rows[args[arglth-2]].cells[j+4].innerHTML=args[j];
						b01a_value_names[j+2].innerHTML=args[j]; //中間跳過總庫存數量與在庫數量兩欄
					}			
                    //13~17資料導入後的修正顯示					
					b01a_value_names[13].innerHTML=(b01a_value_names[13].innerHTML=='Y'?'是':'否') ; //是否建BOM
                    b01a_value_names[14].innerHTML=(b01a_value_names[14].innerHTML=='A'?'A 個別領料':'B 整批領料') ; //領料方式					
					b01a_value_names[16].innerHTML+="天" ; //採購/生產前置天數
		            b01a_value_names[17].innerHTML+="天" ; //倉庫收料發料前置天數			        
					/***********************************************************/
					maintable.rows[args[arglth-2]].cells[b01a_value_names.length+1].innerHTML=rsp.lastupdate;
					b01a_value_names[b01a_value_names.length-1].innerHTML=rsp.lastupdate;  //安全資料(最後異動)
					//以下檢查庫存上下限與總庫存量比較結果看是否應該文字變色或還原
					if(b01a_value_names[8].innerHTML*1>b01a_value_names[10].innerHTML*1 && b01a_value_names[10].innerHTML*1>0){
						maintable.rows[args[arglth-2]].setAttribute("style","font-weight:bold;color:#E60000;background-color:#B9B9FF;");
					}else if(b01a_value_names[8].innerHTML*1<b01a_value_names[11].innerHTML*1 && b01a_value_names[11].innerHTML*1>0){
					      maintable.rows[args[arglth-2]].setAttribute("style","font-weight:bold;color:#704214;background-color:#B9B9FF;");
					}else{
						maintable.rows[args[arglth-2]].setAttribute("style","font-weight:Normal;color:#000;background-color:#B9B9FF;");
					}
			   }
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息				
            }										
        }
    }      
	return true; 
}  
function sendFilePrc(updflg){     //新增資料及修改程序       
	var tbjsn=[];
	var recordNo=document.getElementById("rcrd_no");  
    //----資料寫入資料庫前過濾程序區-----//
    var b01elements=document.getElementsByName('b01update');
	for(var h=1;h<b01elements.length;h++){   ////開始堆疊待異動資料陣列
		tbjsn.push(b01elements[h].value);
	}	
	for(var j=1;j<b01elements.length-3;j++){
        if(b01elements[j].value.trim()==="" && !(j==8 || j==11 || j==12 || j==13)){		
		   if(!b01elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      b01elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   b01elements[j].focus();
		   return false ;
        }else{		     
		   if(b01elements[j].nextSibling){		      
			  b01elements[j].parentNode.removeChild(b01elements[j].nextSibling);
		   }			
	    }
	}
	for(var k=9;k<11;k++){
	   if(b01elements[k].value*1<b01elements[10].value*1 || b01elements[k].value*1<0){
	      if(!b01elements[k].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
			  if (b01elements[k].value*1<0){
				  var errorMessage1=document.createTextNode("不得小於 0");
		      }else{
				  var errorMessage1=document.createTextNode("小於安全存量");
			  }
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      b01elements[k].parentNode.appendChild(errorSpan1);				 
		   }	 
		   b01elements[k].focus();
		   return false ;	
	   }else{
	    	if(b01elements[k].nextSibling){		      
			  b01elements[k].parentNode.removeChild(b01elements[k].nextSibling);
		   }		
	   }
	}
	for(var p=13;p<15;p++){
	   if(p==14 && b01elements[p].value*1<=0 && b01elements[p-1].value.substr(0,1)=='B'){
	      if(!b01elements[p].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("整批領料須大於0");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      b01elements[p].parentNode.appendChild(errorSpan1);				 
		   }	 
		   b01elements[p].focus();
		   return false ;	
	   }else{
	    	if(b01elements[p].nextSibling){		      
			  b01elements[p].parentNode.removeChild(b01elements[p].nextSibling);
		   }		
	   }
	}
	for(var m=14;m<19;m++){
	   if(b01elements[m].value*1<0){
	      if(!b01elements[m].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得小於 0");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      b01elements[m].parentNode.appendChild(errorSpan1);				 
		   }	 
		   b01elements[m].focus();
		   return false ;	
	   }else{
	    	if(b01elements[m].nextSibling){		      
			  b01elements[m].parentNode.removeChild(b01elements[m].nextSibling);
		   }		
	   }
	}
    //--------過濾區結束----------//				
   
    if (updflg==1){     //如果是新增	 
        if(b01elements[1].value!="" ){
           //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
		   tbjsn.push(0);
		   tbjsn.push(0);
		   var selectElement=document.getElementById("dptnoopt");
		   tbjsn.push( selectElement.options[selectElement.selectedIndex].text.slice(5));  //取得部門名稱內容
		   
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
		var maintable=document.getElementById("member");	  		
		var tablerowindex=0;
		for(var i=1;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 				 
	     //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,recordNo.value,tablerowindex); 	   
         tbjsn.push(recordNo.value);	
         tbjsn.push(tablerowindex);			
		  var selectElement=document.getElementById("dptnoopt");
         tbjsn.push( selectElement.options[selectElement.selectedIndex].text.slice(5));		 
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
		 var maintable=document.getElementById("member");
		 var sendDeleRec="filename="+"F01='"+sourceAccount()+"'";	//在此下SQL語法傳給後端PHP	DELETE FROM a02 where F00 = 	 	
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="B01/B01del.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendDeleRec);		
		function respond(){           
		  if (request.readyState == 4 && request.status == 200) {     
		   	  rsp=request.responseText;	
		      
			  if(!isNaN(Number(rsp))){  //如果是數字                      
				       var myThgrp=maintable.getElementsByTagName("th");
		               myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
				       var aWaitDelete=[];		 
					   var rowidx=0;
		               for(var i=1;i< maintable.rows.length; i++){			 
		                  if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
				             aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
				            maintable.deleteRow(i);			
                            rowidx=i;							
				            i--;    //刪除一筆後記得把列數減一	                                  						
			  	            cko[0](-1);	           
                            break;							
			              }
		               } 
					   var valueshows=document.getElementsByName("b01value");  //清空頁面資料
			           for(var p=0;p<valueshows.length;p++){
				          valueshows[p].innerHTML="";
			           }
			 	       var responseDiv=document.getElementById("serverResponse1");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
				       cko[4](-1);    //閉包記錄變數減一筆
					   var slt2=document.getElementById('recmth');	
					   var pagecount=Math.ceil(cko[4](0)/12);
					   if(slt2.options.length>pagecount){		//檢查頁數是否該減少.
					      var lastvalue=parseInt(slt2.value-1);						  
						  var optdigts=slt2.value.length;						
						  slt2.options.remove(slt2.options.length-1);	
						  if (lastvalue>0){
						     choiceClick(paddingLeft(String(lastvalue),optdigts));
						  }
					   }   else{
						   var mbody=document.getElementById('maintbody');
						   if (mbody.rows.length>0){							 
							   if (rowidx<mbody.rows.length){
						          chooserc(rowidx);
							   }else{
								   chooserc(mbody.rows.length);
							   }						      					    
						   }  
					   }  
					   
			     blocksclose();  //關掉原視窗
			  }else{
		          blkshow(rsp);	
			  }
               		  
	      }
        }
}
//  選取部門
function optionitem(adored){	
	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;    
	var url="B01/A14srch.php?timestamp="+new Date().getTime();
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);	
	function respond(){
       if (request.readyState == 4 && request.status == 200) {	       	     
		  //window.eval(request.responseText);		  
          evalinstead(request.responseText);		  
	  }
    }
	function createQueryString(){	    		 			
	     var queryString ="filename="+"'"+adored+"'" ;
	    return queryString;	// 
	}	
	return
}
function optionadd(opt3,crntslt){
	var slt4 = document.getElementById("dptnoopt");	    	
	var item_no="";
	var item_value="";
	for(var i=0;i<opt3.length;i++){		
		var item_no="";
		var varItem="";
		for(var jk in opt3[i]){		   
			item_no+=opt3[i][jk]+"    ";	
	       	varItem=new Option(item_no,item_no.substring(0,5).trim());			     
		}
		slt4.options.add(varItem);  //item_no.substring(0,5).trim()==crntslt		 
 	    if(slt4.options[i].value.trim()==crntslt){		  
           slt4.options[i].selected=true;		
        }
	}
	
}







