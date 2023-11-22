function srchshow(event)
{
    if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);

/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
    var dropext=document.getElementById('myModal2');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal2");
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
	dropsheet_content.setAttribute("id","modal-content2");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="60%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	  
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
      
				 var headtitle="品號:"+document.getElementById("stock_no").innerHTML;
			     dropsheet.style.paddingTop="20px"; /* Location of the box */
		         var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		         dialog.className="customDialog"; 		 
		         dialog.style.position="relative";
                 var rspnsv=document.createElement("span");
				 rspnsv.id="serverResponse3";
		     
				 var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		         dialogButton3.setAttribute("value","關閉");	
				 dialogButton3.setAttribute("title","關閉查詢，快速鍵Alt+X");
			     dialogButton3.setAttribute("accesskey","X");
                  dialogButton3.setAttribute("style","position:relative;left:220px;");				 
		         attachEventListener(dialogButton3,"click",srchblkclose,false);		  	      		  		  
				 var tblname=document.createElement("caption");
				 
				 tblname.innerHTML=headtitle;	
				 tblname.style.fontSize='18px';		 
				 var srchTable=document.createElement("table");				  
		         srchTable.id="srchTable";						
				 srchTable.className="gridlist";                
				 var srchHead=document.createElement("thead");		
				  srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
                  srchHead.style.width="calc( 100% - 1em )";
				  srchTable.appendChild(tblname);
				 srchTable.appendChild(srchHead);				 				
                var oTr = document.createElement('tr');				 
                var array = ['部門編號', '部門名稱','庫存量','最後異動','用途'];
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); //column
					th.style.width=20+'%';
                    var text = document.createTextNode(array[j]); //cell
					
                    th.appendChild(text);
                    oTr.appendChild(th);
                }				
                srchHead.appendChild(oTr);	
				 var srchTbody=document.createElement("tbody");			
				 srchTbody.id='srchTbody';
			     srchTbody.style.display="block";
		         srchTbody.style.height="310px";
				 srchTbody.style.width="100%"; 
		         srchTbody.style.overflow="auto";		
				 srchTbody.style.backgroundColor="#F0F0F0";
				 srchTable.appendChild(srchTbody);  						 
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata2";	          								 
			    formJason.appendChild(srchTable);
				 
				 formJason.appendChild(dialogButton3);
				 formJason.appendChild(rspnsv);
		         dialog.appendChild(formJason)  				 
	             dropsheet_content.style.width="50%";	 	 //原訊息內框畫面寬度調整  		  
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="B01/B11srch.php?timestamp="+new Date().getTime();   	               				 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		 			    
				 var queryString ="filename="+document.getElementById("stock_no").innerHTML;
				  
				 request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     
		            
                         rsp=JSON.parse(request.responseText);						   
                         srchStockNo(rsp);
				   
                        //evalinstead(request.responseText);		  
	                }	  
                 }

    return true;
}

function srchblkclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dropsheet=document.getElementById("myModal2");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
	   var bibau=cko[2](0);   //找出閉包變數現值
	   cko[2](bibau*(-1));    //將閉包變數歸零	
	return true;
}	


function srchStockNo(str1) {       //搜尋相關料號
    var cnt=0;
	var arr = str1; 
   var oTable = document.getElementById("srchTbody");		
  
	for(var i=0;i<arr.length;i++){		
		 
		var oTr=oTable.insertRow(-1);	
	     
		cnt++;
         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length);
		    
		    if (!isNaN(parseInt(arr[i][jk]*1))){
		  	   oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		    } else{
			  oTd.innerHTML=arr[i][jk];    
		    }		 
		    if(jk=='dpt_no'){
			     oTd.setAttribute("style","text-align:left;width:18%;");
		    }else if(jk=='dpt_name'){			 
		        oTd.setAttribute("style","text-align:left;width:18%;");
		    }else if(jk=='stock_qty'){		  
		        oTd.setAttribute("style","text-align:right;width:18%;");
		    }else if(jk=='last_update'){		  
		        oTd.setAttribute("style","text-align:left;width:18%;");
		    }else if (jk=='apply'){		  
		        oTd.setAttribute("style","text-align:left;width:18%;"); 									
					  		
		    }else if(jk=='diffdate'){
				oTd.setAttribute("style","display:none;");
			}				
	    }	
        if(arr[i]['diffdate']>210){  //最後異動日期距今超過210天紅字
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");
		}else if(arr[i]['diffdate']>90){//最後異動日期距今超過90天低於210天棕色字
			oTr.setAttribute("style","font-weight:bold;color:#704214;");
		}
	}	
}
