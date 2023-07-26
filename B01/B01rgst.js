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
	dropsheet_content.style.width="38%";		
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
		closeSpan.style.backgroundColor="#E0E0E0";
        closeSpan.innerHTML = '&times';   
	 
        attachEventListener(closeSpan,"click",blocksclose,false);	//按叉叉關視窗
	   	dropsheet_content.appendChild(closeSpan);        //加進內容框		
	    var p_tx=document.createElement('p');            //主畫面登入錯誤訊息顯示內容
		p_tx.style.color="blue";
	    p_tx.innerHTML=txtword;	                         //將傳來的這一段文字加入準備顯示
		dropsheet_content.appendChild(p_tx);				
		dropsheet_content.style.width="38%";	
    }else{

		       //新增||修改||刪除||權限複製 || 移除權限
			 if(txtword==1){       //是新增
               var headtitle="請輸入料號基本資料：";
			
	         }else if(txtword==4){
				 
				 var headtitle="確定刪除所勾選紀錄?";
			 }else if(txtword==3){
				 var headtitle=sourceAccount()+":的權限複製到";
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
				 var headtitle="修改料號基本資料："; //aWaitUpdate[1];
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
		    attachEventListener(dialogButton3,"click",blocksclose,false);		 	  	      		  
		    var oTd = oTr.insertCell(0);	   		      
			if ((txtword==2 || txtword==4) || txtword==3 ||txtword==5){
			
               oTd.appendChild(dialogButton1);	         //修改刪除與權限複製		   
			}
			
			 if(txtword==1){    //如果是新增
			    
			    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	            var oTd = oTr.insertCell(0);	                 
			    oTd.innerHTML="<input type='button' class='btn' id='btn_uploadfile' value='確認' onclick='sendFilePrc(1);' >";   			   
		
 	         }
            oTd.appendChild(dialogButton3);		   		  //新增只有一個按鈕加入畫面  
       	    oTd.setAttribute('colspan',2); 
	 	    oTd.setAttribute('style','text-align:center');
		   if(txtword==1 || txtword==2){  //如果是新增或修改
		   
		   
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='備註說明:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='rmkdescription' class='txt' maxlength='11' autosize  />";                             
	             
		        var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='銷售成本:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='salescost' class='txt' maxlength='11' autosize  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='平均成本:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='averagecost' class='txt' maxlength='11' autosize  />"; 
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
	            oTd.innerHTML='批號管理:';
	            var oTd = oTr.insertCell(3);
				var slt7=document.createElement("select");
				slt7.options.add(new Option('否','N'));
				slt7.options.add(new Option('是','Y'));
				slt7.setAttribute("id","lotmange");
				slt7.setAttribute("name","b01update");
				oTd.appendChild(slt7);
	          
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採購/生產前置:';				
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='leadtime' class='txt' title='請輸入採購或生產所需天數' maxlength='20' autosize  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='收發料前置:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='timeforshipping' class='txt' title='請輸入倉庫收料上架所需天數' maxlength='2' autosize  />"; 
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
	            oTd.innerHTML="<input type='text' name='b01update' id='maxlimit' class='txt' maxlength='5' autosize  />";                             
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='安全存量:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='minlimit' class='txt' maxlength='5' autosize  />"; 
		       var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採購/計料換算:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='rateofps' class='txt' maxlength='5' autosize  />"; 
                            
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='保管部門:';
	            var oTd = oTr.insertCell(3);
				var slt3=document.createElement("select");
				slt3.setAttribute("id","dptnoopt");
				 slt3.setAttribute("name","b01update");
				oTd.appendChild(slt3);
				
	            //oTd.innerHTML="<input type='text' name='b01update' id='holdingdepart' class='txt' maxlength='5' autosize  />";  
		         var oTr=ajTable.insertRow(ajTable,ajTable.length);
	             var oTd = oTr.insertCell(0);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='採購單位:';
	            var oTd = oTr.insertCell(1);
	            oTd.innerHTML="<input type='text' name='b01update' id='purchseach' class='txt' maxlength='4' autosize  />"; 
                            
	             var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='庫存計料單位:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='stockeach' class='txt' maxlength='4' autosize  />";    
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
	                
					oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' style='background-color:#B9B9FF;' maxlength='43' readOnly=true autosize  />"; 
		         }else{
					oTd.innerHTML="<input type='text' name='b01update' id='stockno' class='txt' maxlength='43'  autosize  />"; 
				 }
			 
	            var oTd = oTr.insertCell(2);
	             oTd.setAttribute('style','text-align:right;width:15%');	
	            oTd.innerHTML='品名規格:';
	            var oTd = oTr.insertCell(3);
	            oTd.innerHTML="<input type='text' name='b01update' id='stockname' class='txt' maxlength='40' autosize  />"; 
                if(txtword==2){   //如果是修改	
                   //oTr.setAttribute("style","display:none;");			
				   
			    }		
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
				    for(var k=9;k<20;k++){
					   editinit[k].value=aWaitUpdate[k+1];
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
			if(!isNaN(Number(rsp.order_no))){     			   
			   if(args[19]==0){     //如果回傳為新增記錄號碼表示新增成功就做表格插入一列		
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
				   for(var i=8;i<19;i++){
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
                        //blkshow(1);
					 
			   }else{            //如果是修改原列更改內容
			        
					 var b01a_value_names=document.getElementsByName("b01value");
		             
			        var maintable=document.getElementById("member");
	               
				    for (var j=2;j<9;j++){
				        
						maintable.rows[args[20]].cells[j].innerHTML=args[j-1];
						b01a_value_names[j-1].innerHTML=args[j-1];
			        }
					document.getElementById("kind_of_belong_to").innerHTML=belongtoshow( document.getElementById("kind_of_belong_to").innerHTML);
					maintable.rows[args[20]].cells[9].innerHTML=rsp.dpt_name;
					document.getElementById("who_hold").innerHTML=maintable.rows[args[20]].cells[8].innerHTML+' '+maintable.rows[args[20]].cells[9].innerHTML
					for(j=10;j<21;j++){
						maintable.rows[args[20]].cells[j].innerHTML=args[j-2];
						b01a_value_names[j].innerHTML=args[j-2];
					}
					maintable.rows[args[20]].cells[21].innerHTML=rsp.lastupdate;
					b01a_value_names[21].innerHTML=rsp.lastupdate;
					document.getElementById("bom_should_be").innerHTML=(document.getElementById("bom_should_be").innerHTML=='Y'?'是':'否') ;
		            document.getElementById("leadtm_prchs").innerHTML+="天" ;
			        document.getElementById("leadtm_ready").innerHTML+="天" ;
				    document.getElementById("type_of_apply").innerHTML+=(document.getElementById("type_of_apply").innerHTML=='A'?'  個別領料':'  整批領料');
			        document.getElementById("lotNoUse").innerHTML=(document.getElementById("lotNoUse").innerHTML=='Y'?'是':'否');
			   }
			}else{
				blkshow(rsp);   //新增不成功才顯示訊息				
            }										
        }
    }      
	return true; 
}  
function sendFilePrc(updflg){     //新增資料上傳檔案及修改程序   
    
	var tbjsn=[];
	var recordNo=document.getElementById("rcrd_no");
	var stockNo=document.getElementById("stockno");
	
	var stockName=document.getElementById("stockname");	
   
	var b01elements=document.getElementsByName('b01update');
    for(var h=1;h<20;h++){
		tbjsn.push(b01elements[h].value);
	}
			for(j=1;j<8;j++){
            if(b01elements[j].value.trim()===""){		
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
    if (updflg==1){     //如果是新增	 
	    //if(stockNo.value.trim()===""){	

/* 		if(stockName.value.trim()===""){        
		    if(!stockName.nextSibling){
		      var errorSpan2=document.createElement("span");		
			  errorSpan2.style.color="red";
			  errorSpan2.style.fontFamily="標楷體";
		      var errorMessage2=document.createTextNode("不得空白");
		      errorSpan2.appendChild(errorMessage2);
		      errorSpan2.classId="errorMsg";
		      stockName.parentNode.appendChild(errorSpan2);
		    }	 
		    stockName.focus();
		    return false ;
        }else{
	
			if(stockName.nextSibling){			
		       stockName.parentNode.removeChild(stockName.nextSibling);
		    } 
	    }		 */
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
		      //rsp=JSON.parse(request.responseText);
			  //if (rsp.length!='移除成功'){   //如果此程式已被使用
			  if(!isNaN(Number(rsp))){  //如果是數字
				 			

				       var myThgrp=maintable.getElementsByTagName("th");
		               myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
				       var aWaitDelete=[];		 
		               for(var i=1;i< maintable.rows.length; i++){			 
		                  if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
				             aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
				            maintable.deleteRow(i);
				            i--;    //刪除一筆後記得把列數減一
			  	            cko[0](-1);				
			              }
		               } 
					   var valueshows=document.getElementsByName("b01value");  //清空頁面資料
			           for(var p=0;p<valueshows.length;p++){
				          valueshows[p].innerHTML="";
			           }
			 	       var responseDiv=document.getElementById("serverResponse1");	 
		   	           responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
	                   responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 		
				  
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
	var url="B01/B01srch.php?timestamp="+new Date().getTime();
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



//
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



