function stocknoshow(event)
{
    if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);		
    var noorname=target.parentNode.childNodes[0];
   
/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
    var dropext=document.getElementById('myModal4');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal4");
	dropsheet.setAttribute("class","modal4");
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
	dropsheet_content.setAttribute("id","modal4-content2");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width="60%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	
	dropsheet_content.style.boxShadow = "5px 5px 5px 5px #003153";  //
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
      
				 var headtitle="請選取料號";
			     dropsheet.style.paddingTop="20px"; /* Location of the box */
		         var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		         dialog.className="stocknoDialog"; 		 
		         dialog.style.position="relative";
             
		         var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","\u{2713}");			//確認				 
				 dialogButton1.setAttribute("style","position:relative;left:140px;color:green;font-size:17px;");
					
				 attachEventListener(dialogButton1,"click",stckchg,false);	
				
				 var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		        dialogButton3.setAttribute("value","\u{2715}"); //關閉
				 dialogButton3.setAttribute("style","position:relative;left:150px;color:red;font-size:17px;");
		         attachEventListener(dialogButton3,"click",stockblkclose,false);		  	      		  		  
				 var tblname=document.createElement("caption");
				 tblname.innerHTML=headtitle;	
				 				 
				 var srchTable=document.createElement("table");				  
		         srchTable.id="stockTable";						
				 srchTable.className="gridlist";                
				 var srchHead=document.createElement("thead");		
				  srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
                  srchHead.style.width="calc( 100% - 1em )";
				  srchTable.appendChild(tblname);
				 srchTable.appendChild(srchHead);				 				
                var oTr = document.createElement('tr');				 
                var array = ['料品編號', '品名規格'];
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); //column
					th.style.width=(240-Math.pow(-2,j)*15)+'px';
                    var text = document.createTextNode(array[j]); //cell
					
                    th.appendChild(text);
                    oTr.appendChild(th);
                }				
                srchHead.appendChild(oTr);	
				 var srchTbody=document.createElement("tbody");			
				 srchTbody.id='stockTbody';
			     srchTbody.style.display="block";
		         srchTbody.style.height="270px";
				 srchTbody.style.width="100%"; 
		         srchTbody.style.overflow="auto";		
				 srchTable.appendChild(srchTbody);  						 
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata2";	          								 
			    formJason.appendChild(srchTable);
				 formJason.appendChild(dialogButton1);
				 formJason.appendChild(dialogButton3);
				
		         dialog.appendChild(formJason)  				 
	             dropsheet_content.style.width="60%";	 	 //原訊息內框畫面寬度調整  		  
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="C34/B01srch.php?timestamp="+new Date().getTime();   	               				 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
                  		
                 if (noorname.id=='stockno'){		 
				    var stockno=document.getElementById('stockno').value; 
				    var queryString ="filename="+"b01.F01"+"|"+stockno;    
                 }else{
					 var stockname=document.getElementById('stockname').value; 
					 var queryString ="filename="+"b01.F02"+"|"+stockname;    
                 }					 
				 request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     
		            
                         rsp=JSON.parse(request.responseText);						   
                         srchStockNo(rsp);
				   
                         	  
	                }	  
                 }

    return true;
}
function stckchg(event)  //選擇料號
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	 
	 var stockNo=document.getElementById('stockno');
	 stockNo.value="";
       var stockName=document.getElementById('stockname');			
	 stockName.value="";  
	
	 var unitName=document.getElementById('unitname');
	 
	 var maintable=document.getElementById("stockTbody");  
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     stockNo.value=maintable.rows[i].cells[0].innerHTML;								 
				 stockName.value=maintable.rows[i].cells[1].innerHTML;	
				 if(unitName){
				    unitName.innerHTML=maintable.rows[i].cells[2].innerHTML;
			     }
				
				
				 break;
			   }				 
		}             
	stockblkclose(event);	
	return true;
}	

function stockblkclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dropsheet=document.getElementById("myModal4");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   
	  
	    var bibau=cko[1](0);   //找出閉包變數現值
	   cko[1](bibau*(-1));    //將閉包變數歸零	 
	return true;
}	


function srchStockNo(str1) {       //開窗顯示料號選項
    var cnt=0;
	var arr = str1; 
   var oTable = document.getElementById("stockTbody");		
  
	for(var i=0;i<arr.length;i++){		
		 
		var oTr=oTable.insertRow(-1);	
	     
		cnt++;
         
		for(var jk in arr[i]){		   
		 var oTd = oTr.insertCell(oTr.cells.length);
		  attachEventListener(oTd,'click',rowchoose,false);		//點選資料   
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='stock_no'){
			     oTd.setAttribute("style","text-align:left;width:120px;");
		  }else if(jk=='stock_name'){
			 
		        oTd.setAttribute("style","text-align:left;width:140px;");
		  }else{
		         oTd.setAttribute("style","display:none;");   
		  }		  		   
		}  		
		 
		 var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	      oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		    var tables=getElementsByAttribute("class","gridlist");
		   // var rcrdchsn="recordchosen"+tables.length.toString();
		     var rcrdchsn="chkbxstockTable"; 
		    myCheck.setAttribute("name",rcrdchsn);   //讓使用者勾選的checkbox表	
		    	  
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);   
	}
	 if (cnt>0){
		cko[1](3);
	    chooserc(1);
	 }
	   
}
