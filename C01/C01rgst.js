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
               var headtitle="請輸入客戶基本資料：(新增完畢請按結束鈕)";			
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
				 var headtitle="修改客戶基本資料："; 
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
               oTd.appendChild(dialogButton1);	         //修改刪除	   
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
	            oTd.innerHTML='其他備註:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=5;				
	            oTd.innerHTML="<input type='text' name='c01update' id='hokaremark' class='txt' maxlength='60' style='width:90%;'  />";                             	              		   
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='交貨方式:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=3;				
	            oTd.innerHTML="<input type='text' name='c01update' id='howship' class='txt' maxlength='40' style='width:90%;'  />";                             	              		   
		         var oTd = oTr.insertCell(2);				
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='收件人:';				
	            var oTd = oTr.insertCell(3);	                
	            oTd.innerHTML="<input type='text' name='c01update' id='whorecive' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   		   
				var oTr=ajTable.insertRow(ajTable,ajTable.length);
				
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='業務擔當:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=2;				
	            oTd.innerHTML="<input type='text' name='c01update' id='whono' class='txt' maxlength='10' style='width:30%;'  />";                             	              		   
		        oTd.innerHTML+="<span name='c01update' id='whonameEx'></span>&nbsp&nbsp";  
			   var srchButton1=document.createElement("input");				   
                   srchButton1.setAttribute("type","button");	
                   srchButton1.setAttribute("class","scopelook");				   
				  srchButton1.style.background="url('digits/brows1.png')";   
				  attachEventListener(srchButton1,"click",srchshow,false);				
				oTd.appendChild(srchButton1);						
			   var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='業務助理:';				
	            var oTd = oTr.insertCell(3);	
                oTd.colspan=2;	                
	            oTd.innerHTML="<input type='text' name='c01update' id='assistno' class='txt' maxlength='10' style='width:30%;'  />";
			    oTd.innerHTML+="<span name='c01update' id='assistnameEx'></span>&nbsp&nbsp"; 
				var srchButton2=document.createElement("input");				   
                   srchButton2.setAttribute("type","button");		
                   srchButton2.setAttribute("class","scopelook");						   
				   srchButton2.style.background="url('digits/brows1.png')"; 
				   attachEventListener(srchButton2,"click",srchshow,false);
				   oTd.appendChild(srchButton2);
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='付款方式:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=2;		
                var slt11=document.createElement("select");
				slt11.options.add(new Option('現結','0'));
				slt11.options.add(new Option('月結','1'));
				slt11.options.add(new Option('次月結','2'));
				slt11.options.add(new Option('T/T','3'));
				slt11.setAttribute("id","howpay");
				slt11.setAttribute("name","c01update");
	            oTd.appendChild(slt11);	  				
		       var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='票期(T/T)天數:';				
	            var oTd = oTr.insertCell(3);	
                oTd.colspan=2;	                
	            oTd.innerHTML="<input type='number' name='c01update' id='daysofpay' class='txt' maxlength='2' value=0 style='text-align:right;width:20%;'  />";                             	              		   		              
   			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='交易幣別:';				
	            var oTd = oTr.insertCell(1);	     
                var slt4=document.createElement("select");
				 slt4.setAttribute("id","crntopt");
				 slt4.setAttribute("name","c01update");
				oTd.appendChild(slt4);				
		       var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='結帳日:';				
	            var oTd = oTr.insertCell(3);	                
	            oTd.innerHTML="<input type='text' name='c01update' id='dayline' class='txt' value='31' maxlength='2' style='width:20%;'  />";                             	              		   		   
               var oTd = oTr.insertCell(4);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='請款日:';				
	            var oTd = oTr.insertCell(5);	                
	            oTd.innerHTML="<input type='text' name='c01update' id='dayforapply' class='txt' value='1' maxlength='2' style='width:20%;'  />";                             	              		   		   
						
		  	   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%;');	
	            oTd.innerHTML='E-mail:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=3;				
				 oTd.setAttribute('style','width:55%;');	
	            oTd.innerHTML="<input type='text' name='c01update' id='mailaddress' class='txt' maxlength='50' style='width:80%;'  />";                             	              		   
		         var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='群組編號:';				
	            var oTd = oTr.insertCell(3);	                             
	            oTd.innerHTML="<input type='text' name='c01update' id='noofgroup' class='txt' maxlength='6' style='width:50%;'  />";                             	              		   		                              		    
                var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='電話:';				
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=2;				
	            oTd.innerHTML="<input type='text' name='c01update' id='telNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
		      var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='傳真:';				
	            var oTd = oTr.insertCell(3);	
                oTd.colspan=2;					
	            oTd.innerHTML="<input type='text' name='c01update' id='faxNo' class='txt' maxlength='30' style='width:60%;'  />";                             	              		   
               var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='聯絡人:';		
               		
	            var oTd = oTr.insertCell(1);	
                oTd.colspan=2;				
	            oTd.innerHTML="<input type='text' name='c01update' id='winman' class='txt' maxlength='20' style='width:60%;'  />";                             	             
		        var oTd = oTr.insertCell(2);	             
	            oTd.innerHTML='負責人:';		
      			oTd.setAttribute('style','text-align:right;width:12%');		
	            var oTd = oTr.insertCell(3);		
               oTd.colspan=2;				
	            oTd.innerHTML="<input type='text' name='c01update' id='represent' class='txt' maxlength='20' style='width:60%;'  />";                             	             
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='出貨指示:';				
	            var oTd = oTr.insertCell(1);
				oTd.colspan=5;
	            oTd.innerHTML="<input type='text' name='c01update' id='directofship' class='txt'  maxlength='137'  style='width:90%;'  />";                             	             
			  var oTr=ajTable.insertRow(ajTable,ajTable.length);				
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='英文地址:';	
                oTd.colspan=5;				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='c01update' id='salescost' class='txt' maxlength='142' style='width:95%;'  />";                             
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='送貨地址:';				
	            var oTd = oTr.insertCell(1);
				oTd.colspan=5;
	            oTd.innerHTML="<input type='text' name='c01update' id='shipplace' class='txt'  maxlength='137'  style='width:90%;'  />";                             	             
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='公司地址:';				
	            var oTd = oTr.insertCell(1);
				oTd.colspan=5;
				 oTd.innerHTML="<input type='text' name='c01update' id='coaddrss' class='txt' maxlength='100' style='width:90%;' />";            	             
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='英文名稱:';				
	            var oTd = oTr.insertCell(1);
				oTd.colspan=5;
	            oTd.innerHTML="<input type='text' name='c01update' id='engname' class='txt' maxlength='95' style='width:90%;'  />";                             	            				           
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='發票種類:';
	            var oTd = oTr.insertCell(1);
				oTd.colspan=2;
				var slt8=document.createElement("select");
				slt8.options.add(new Option('三聯式','31'));
				slt8.options.add(new Option('二聯式','32'));
				slt8.setAttribute("id","invtype");
				slt8.setAttribute("name","c01update");
	            oTd.appendChild(slt8);	  
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='課稅別:';
	            var oTd = oTr.insertCell(3);
				oTd.colspan=2;
				var slt5=document.createElement("select");
				slt5.options.add(new Option('應稅','1'));
				slt5.options.add(new Option('零稅','2'));
				slt5.options.add(new Option('免稅','3'));
				slt5.setAttribute("id","taxtype");
				slt5.setAttribute("name","c01update");
				oTd.appendChild(slt5);	                        	         
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='發票抬頭:';
	            var oTd = oTr.insertCell(1);
				oTd.colspan=3;
				 oTd.setAttribute('style','width:55%');
	            oTd.innerHTML="<input type='text' name='c01update' id='invtitle' class='txt' maxlength='40'  style='width:90%;'/>";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='發票品號:';
	            var oTd = oTr.insertCell(3);
				var slt3=document.createElement("select");				 
				slt3.options.add(new Option('我方品號','1'));
				slt3.options.add(new Option('客戶品號','2'));								
				slt3.setAttribute("id","invpnopt");
				 slt3.setAttribute("name","c01update");
				oTd.appendChild(slt3);				
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='客戶類型:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='c01update' id='customertype' class='txt' maxlength='20' style='width:80%;text-align:left;'  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='主要產品:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='c01update' id='forproduct' class='txt' maxlength='20' style='width:80%;text-align:left;' />";    
		         var oTd = oTr.insertCell(4);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='地區別:';
	            var oTd = oTr.insertCell(5);
	            oTd.innerHTML="<input type='text' name='c01update' id='whereis' class='txt' maxlength='20' style='width:80%;' />";    
		       
			   var oTr=ajTable.insertRow(ajTable,ajTable.length);
				 var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='客戶簡稱:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='c01update' id='customabbrv' class='txt' maxlength='8' style='width:45%;'  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='重要等級:';
	            var oTd = oTr.insertCell(3);
			    var slt9=document.createElement("select");
				slt9.options.add(new Option('A','A'));
				slt9.options.add(new Option('B','B'));
				slt9.options.add(new Option('C','C'));
				slt9.options.add(new Option('X','X'));
				slt9.setAttribute("id","mngtpe");
				slt9.setAttribute("name","c01update");
				oTd.appendChild(slt9);	                                        
	            var oTd = oTr.insertCell(4);
	             oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='統一編號:';
	            var oTd = oTr.insertCell(5);
	            oTd.innerHTML="<input type='text' name='c01update' id='unino' class='txt' maxlength='9' style='width:50%;text-align:left;'  />";                             				
			     var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	            oTd.setAttribute('style','text-align:right;width:12%');	
	            oTd.innerHTML='客戶編號:';
	            var oTd = oTr.insertCell(1);		
                oTd.setAttribute('style','width:15%');				
				 if(txtword==2){   //如果是修改		                
					oTd.innerHTML="<input type='text' name='c01update' id='customno' class='txt' style='background-color:#B9B9FF;width:65%;' maxlength='6' readOnly=true  />"; 
		         }else{
					oTd.innerHTML="<input type='text' name='c01update' id='customno' class='txt' style='width:65%;' maxlength='6'/>"; 
				 }			 
	            var oTd = oTr.insertCell(2);	   
                 oTd.setAttribute('style','text-align:right;width:12%');					
	            oTd.innerHTML='客戶名稱:';
	            var oTd = oTr.insertCell(3);
                oTd.colspan=3;		
	            oTd.innerHTML="<input type='text' name='c01update' id='customname' class='txt' style='width:80%;' maxlength='40'    />";  				
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);  //以下第一列都隱藏起來當變數
	            var oTd = oTr.insertCell(0);	             
	            oTd.innerHTML='紀錄號碼';
	            var oTd = oTr.insertCell(1);
                oTd.colspan=5;
	            oTd.innerHTML="<input type='text' name='c01update' id='rcrd_no' class='txt' maxlength='14' autosize  />";                 
                oTr.setAttribute("style","display:none;");	
				var slt6=document.getElementById('tpeaply');
				if(txtword==2){				                   	
				   optionitem(aWaitUpdate[24]);						 
                }else{
					optionitem('NT');				
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
				var sales_no=document.getElementById('whono');			
                attachEventListener(sales_no,"focusout",lostfocus1,false);	
				 var assist_no=document.getElementById('assistno');
				attachEventListener(assist_no,"focusout",lostfocus2,false);	  
				var cstmname=document.getElementById('customname');
				attachEventListener(cstmname,"focusout",lostfocus3,false);	
                var cstadrs=document.getElementById('coaddrss');
				attachEventListener(cstadrs,"focusout",lostfocus4,false);	
                 var cstno=document.getElementById('customno');
				 attachEventListener(cstno,"focusout",lostfocus5,false);						
			 }
			 switch (txtword) {
                case 1:                                   //如果是新增
				   objGetNo('customno','C000');
			       document.getElementById("customno").focus();	
			       /* var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		           var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日 */
				   break;
			    case 2:                                                     //如果是修改，要先顯示目前該筆資料
				   document.getElementById("customname").focus();
				   document.getElementById("rcrd_no").value=aWaitUpdate[0];       //把紀錄號碼也存起來				 
				  
				   var editinit=document.getElementsByName('c01update');
				   for(var k=0;k<editinit.length;k++){ //8
					   editinit[k].value=aWaitUpdate[k];
				   }		
                   document.getElementById('whonameEx').innerHTML=aWaitUpdate[30];	
                   document.getElementById('assistnameEx').innerHTML=aWaitUpdate[32];				   				
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
	if (target.value=="結束" ){	   //直接點結束按鈕(新增修改刪除共用)
	   if(document.getElementById('customno')!=null){   //非於放棄刪除的狀態下
	      var currentNo=document.getElementById('customno').value;	   
	      if (currentNo.trim()!="" && currentNo.trim()!=document.getElementById('custom_no').innerHTML){ //如果非修改
		     discardNoRec('C000',currentNo.trim());
	      } 
	   }
	}
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
     request.open("POST", "C01/C01wrt.php", true);        //新增記錄的php檔
     request.setRequestHeader("Content-type", "application/json");
     request.send(str_json);
    function respond() {		
        if (request.readyState == 4 && request.status == 200) {     
			rsp=JSON.parse(request.responseText);	
            var arglth=	args.length;		
			if(!isNaN(Number(rsp.order_no))){     			   
			   if(args[arglth-2]==0){     //如果回傳為新增記錄號碼且旗標值為0表示新增成功就做表格插入一列		
			      var oTable = document.getElementById("maintbody");	
				  var oTr=oTable.insertRow(0);	
                  oTr.setAttribute("name","mainrow");
				  var oTd = oTr.insertCell(oTr.cells.length);				
				  oTd.innerHTML=rsp.order_no;
				  oTd.setAttribute("style","text-align:left;color:#7f8890;font-style:italic;display:none;");
                  var oTd = oTr.insertCell(oTr.cells.length);
				  oTd.innerHTML=args[0];
				  oTd.setAttribute("style","text-align:left;width:80px;");
				  var oTd = oTr.insertCell(oTr.cells.length);				  
				  oTd.innerHTML=args[1];				  
				  oTd.setAttribute("style","text-align:left;width:285px;"); 
				  for(var i=2;i<arglth-2;i++){
					  var oTd = oTr.insertCell(oTr.cells.length);
					  oTd.innerHTML=args[i];
					  oTd.setAttribute("style","display:none;");
				  }
				  var oTd = oTr.insertCell(oTr.cells.length);  //最後交易
				  oTd.innerHTML="0000-00-00";
				  oTd.setAttribute("style","display:none;");
				  var oTd = oTr.insertCell(oTr.cells.length);  //最後報價
				  oTd.innerHTML="0000-00-00";   
				  oTd.setAttribute("style","display:none;");    //最後異動
				  var oTd = oTr.insertCell(oTr.cells.length);				       
				  oTd.innerHTML=rsp.lastupdate;
				  oTd.setAttribute("style","text-align:left;display:none;");
	
				  if(args[22]!=rsp.group_no){
				     oTr.cells[23].innerHTML=rsp.group_no;  //修正群組號碼以免亂打
				  }
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
                    		   					
					var c01a_value_names=document.getElementsByName("c01value");
			        var maintable=document.getElementById("member");	               
				    for (var j=2;j<arglth-1;j++){				        
						maintable.rows[args[arglth-1]].cells[j].innerHTML=args[j-1];
						c01a_value_names[j-1].innerHTML=args[j-1];
			        }					
					
                    //9~11資料導入後的修正顯示			arglth-1		
					c01a_value_names[9].innerHTML=(c01a_value_names[9].innerHTML=='1'?'我方品號':'客戶品號') ; //發票顯示
                    c01a_value_names[10].innerHTML=(c01a_value_names[10].innerHTML=='31'?'三聯式':'二聯式') ; //稅別								
					c01a_value_names[11].innerHTML=(c01a_value_names[11].innerHTML=='1'?'應稅':(c01a_value_names[11].innerHTML=='2'?'零稅':'免稅')) ; //稅別
		            switch(c01a_value_names[26].innerHTML){
						case '0':
					        c01a_value_names[26].innerHTML='現結';
					        break;
						case '1':	
						    c01a_value_names[26].innerHTML='月結';
							break;
						case '2':	
						    c01a_value_names[26].innerHTML='次月結';
							break;	
					    case '3':	
						    c01a_value_names[26].innerHTML='T/T';
							break;			
						default:
						    c01a_value_names[26].innerHTML='現結';
					}
					/***********************************************************/                    
					maintable.rows[args[arglth-1]].cells[c01a_value_names.length].innerHTML=rsp.lastupdate;
					c01a_value_names[c01a_value_names.length-1].innerHTML=rsp.lastupdate;  //安全資料(最後異動)
					if(args[22]!=rsp.group_no){
					   	
					   maintable.rows[args[arglth-1]].cells[23].innerHTML=rsp.group_no; //修正群組號碼以免亂打
					   c01a_value_names[22].innerHTML=rsp.group_no; 
					   blkshow('群組編號'+args[22]+'不在客戶主檔中!系統自動修正與客戶編號相同!')
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
	var c01elements=document.getElementsByName('c01update');	
	for(var h=1;h<30;h++){  	     //開始堆疊待異動資料陣列
		 tbjsn.push(c01elements[h].value);	   
	}
	tbjsn.push(document.getElementById('whonameEx').innerHTML);
	tbjsn.push(c01elements[31].value);
	tbjsn.push(document.getElementById('assistnameEx').innerHTML);
	for(var q=33;q<c01elements.length;q++){  	   
		 tbjsn.push(c01elements[q].value);	   
	}
	for(var j=1;j<c01elements.length-3;j++){
        if(c01elements[j].value.trim()==="" && !(j==5 || j==6 || j==7 || j==13 || j==16 || j==17 || j==19 || j==21 || j==22)){		
		   if(!c01elements[j].nextSibling){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode("不得空白");
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      c01elements[j].parentNode.appendChild(errorSpan1);				 
		   }	 
		   c01elements[j].focus();
		   return false ;
        }else{		     
		   if(c01elements[j].nextSibling){		      
			  c01elements[j].parentNode.removeChild(c01elements[j].nextSibling);
		   }			
	    }
	}
    //--------過濾區結束----------//	
	
    if (updflg==1){     //如果是新增	 
        if(c01elements[1].value!="" ){
           //var rspns=TableToJson(loginNo.value,stockNo.value,newAuth,editAuth,delAuth,prntAuth,auth1Attach,auth2Attach,auth3Attach,auth4Attach,auth5Attach,0,0);        
		   tbjsn.push(0);
		   tbjsn.push(0);
	
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
		var sendDeleRec="filename="+sourceAccount();
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="C01/C01del.php?timestamp="+new Date().getTime();	     		 
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
					   var valueshows=document.getElementsByName("c01value");
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
//  選取幣別
function optionitem(adored){	
	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;    
	var url="C01/C00srch.php?timestamp="+new Date().getTime();
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);	
	function respond(){
       if (request.readyState == 4 && request.status == 200) {	
           
		  var rsp=JSON.parse(request.responseText);	 
		 
		  optionadd(rsp.recdrow,rsp.crntkey);	   	
	  }
    }
	function createQueryString(){	    		 			
	     var queryString ="filename="+adored;
	    return queryString;	 
	}	
	return
}
function optionadd(opt3,crntslt){
	
	var slt4 = document.getElementById("crntopt");	    	
	var item_no="";
	var item_value="";
	 
	for(var i=0;i<opt3.length;i++){		
		var item_no="";
		var varItem="";
		for(var jk in opt3[i]){		   
			item_no+=opt3[i][jk]+"    ";	
	       	varItem=new Option(item_no,item_no.substring(0,4).trim());			     
		}
		slt4.options.add(varItem);  		 
 	  if(slt4.options[i].value.trim()==crntslt){	
	       slt4.options[i].selected=true;	
         	   
       }
	}
	
}

function lostfocus1(event){     
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var slsno="";
	var maintable=document.getElementById("member");				 				 	 
	for(var i=1;i< maintable.rows.length; i++){			 		            
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		   	
           slsno=maintable.rows[i].cells[29].innerHTML;	   
           break;					   
	    }
	} 		
	if (target.value!=slsno){	       //業務欄位資料變動	
        target.parentNode.childNodes[1].innerHTML="";   //名字清空	
	    srchshow(event);
	}
    return;	
}
function lostfocus2(event){        
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var assno="";
	var maintable=document.getElementById("member");				 				 	 
	for(var i=1;i< maintable.rows.length; i++){			 		            
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		   	
           assno=maintable.rows[i].cells[31].innerHTML;	   
           break;					   
	    }
	} 		
	if (target.value!=assno){	   //業助欄位資料變動	
        target.parentNode.childNodes[1].innerHTML="";   //名字清空	
	    srchshow(event);
	}
    return;	
}
function lostfocus3(event){        //新增修改時客戶名稱帶到發票抬頭與簡稱
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('customabbrv').value.trim()==""){
		document.getElementById('customabbrv').value=target.value.substring(0,4);
	 }
	 
     if(document.getElementById('invtitle').value.trim()==""){
		document.getElementById('invtitle').value=target.value;
	 }
    return;	
}
function lostfocus4(event){        //新增修改時公司地址帶到送貨地址
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('shipplace').value.trim()==""){
		document.getElementById('shipplace').value=target.value;
	 }
    return;	
}
function lostfocus5(event){        //新增修改時客戶編號帶到群組號碼
   if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
     if(document.getElementById('noofgroup').value.trim()==""){
		document.getElementById('noofgroup').value=target.value;
	 }
    return;	
}

function objGetNo(idno,whichobj){
	var askForObjNo="filename="+whichobj;	//在此下SQL語法傳給後端PHP	DELETE FROM a02 where F00 = 	 	
		
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="include/A0isrch.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(askForObjNo);		
		function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    		   	  
		         var idfield=document.getElementById(idno);
			     idfield.value=request.responseText.trim();	           
	             idfield.readOnly=true;
			  }
	    }	
 	  			 
}
function discardNoRec(whichobj,crntNo)
{	var recileObjNo="filename="+whichobj+"|"+crntNo;	
	    if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="include/A0iwrt.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(recileObjNo);		
		  function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    		   	  
		          
			  }
	    }	  
 	  			 
}	
