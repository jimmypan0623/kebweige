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
	dropsheet_content.style.width="50%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	  
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	
      
				 var headtitle="請選取欲授權程式";
			     dropsheet.style.paddingTop="20px"; /* Location of the box */
		         var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
		         dialog.className="customDialog"; 		 
		         dialog.style.position="relative";
                 var rspnsv=document.createElement("span");
				 rspnsv.id="serverResponse3";
		         var dialogButton1=document.createElement("input");		   
		        dialogButton1.setAttribute("type","button");
		        dialogButton1.setAttribute("class","btn");
		        dialogButton1.setAttribute("value","確認");
				attachEventListener(dialogButton1,"click",chseprg,false);	
				 var dialogButton3=document.createElement("input");
		         dialogButton3.setAttribute("type","button");
		         dialogButton3.setAttribute("class","btn");
		         dialogButton3.setAttribute("value","關閉");
		         attachEventListener(dialogButton3,"click",srchblkclose,false);		  	      		  		  
				 var tblname=document.createElement("caption");
				 tblname.innerHTML=headtitle;	
				 //tblname.appendChild(dialogButton3);				 
				 var srchTable=document.createElement("table");				  
		         srchTable.id="srchTable";						
				 srchTable.className="datalist";                
				 var srchHead=document.createElement("thead");		
				  srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
                  srchHead.style.width="calc( 100% - 1em )";
				  srchTable.appendChild(tblname);
				 srchTable.appendChild(srchHead);				 				
                var oTr = document.createElement('tr');				 
                var array = ['程式編號', '程式名稱','選取'];
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); //column
					th.style.width=(120-Math.pow(-2,j)*20)+'px';
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
				 srchTable.appendChild(srchTbody);  						 
				 var formJason=document.createElement('form');		   
		         formJason.id="formdata2";	          								 
			    formJason.appendChild(srchTable);
				 formJason.appendChild(dialogButton1);
				 formJason.appendChild(dialogButton3);
				 formJason.appendChild(rspnsv);
		         dialog.appendChild(formJason)  				 
	             dropsheet_content.style.width="38%";	 	 //原訊息內框畫面寬度調整  		  
		         dropsheet_content.appendChild(dialog);		
				 if(window.ActiveXObject){
		            var request = new ActiveXObject("Microsoft.XMLHttp");
	             }else if(window.XMLHttpRequest){
	   	              var request = new XMLHttpRequest();
				 }
	             request.onreadystatechange = respond;   
	             var url="A07/A07srch.php?timestamp="+new Date().getTime();   	               				 
	             request.open("POST",url);	 
	             request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
                 var secondkey=	document.getElementById('prg_no').value;
			     if(secondkey.trim().length>0){
				    var queryString ="filename="+"'"+document.getElementById('fatherkey').value+"') AND `F01` REGEXP '"+document.getElementById('prg_no').value+"'";
	             }else{
					var queryString ="filename="+"'"+document.getElementById('fatherkey').value+"')";
				 }
				 request.send(queryString);
	             function respond(){
                    if (request.readyState == 4 && request.status == 200) {	       	     
		           //window.eval(request.responseText);	
                         rsp=JSON.parse(request.responseText);						   
                         srchStockNo(rsp);
				   
                        //evalinstead(request.responseText);		  
	                }	  
                 }

    return true;
}
function chseprg(event)  //選擇紀錄
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
   var maintable2=document.getElementById("aplyform2");
	var maintable=document.getElementById("srchTbody");
	  
	  
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     document.getElementById('prg_no').value=maintable.rows[i].cells[0].innerHTML;
				 document.getElementById('serverResponse3').innerHTML=maintable.rows[i].cells[1].innerHTML;
				 var prgName=document.getElementById('prg_name');
				 if(prgName.nextSibling){			
		            prgName.parentNode.removeChild(prgName.nextSibling);
		         } 
				 prgName.innerHTML=maintable.rows[i].cells[1].innerHTML;
			 
				 var checkboxes = document.getElementsByName("typeOfChange");
				 var labelforchks = document.getElementsByName("lblchk");
				 for (var j=2;j<6;j++){
					 checkboxes[j-2].style.visibility=((maintable.rows[i].cells[j].innerHTML=="")?"hidden":"visible");
					 labelforchks[j-2].style.visibility=((maintable.rows[i].cells[j].innerHTML=="")?"hidden":"visible");
				 }
				 var auttt = document.getElementsByName("auth_attch");
				 var spanforchk = document.getElementsByName("authatt");
				 
				 for (var j=6;j<11;j++){
					auttt[j-6].style.visibility=((maintable.rows[i].cells[j].innerHTML=="")?"hidden":"visible");
					//spanforchk[j-6].style.visibility=((maintable.rows[i].cells[j].innerHTML=="")?"hidden":"visible");
					spanforchk[j-6].innerHTML=maintable.rows[i].cells[j].innerHTML;
					maintable2.rows[j-2].style.display=((maintable.rows[i].cells[j].innerHTML=="")?"none":"block");
				 }
				 break;
			  }
				 
		} 
       
     
	srchblkclose(event);
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
		  attachEventListener(oTd,'click',rowchoose,false);		//點選資料   
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='prg_no'){
			     oTd.setAttribute("style","text-align:left;width:100px;");
		  }else if(jk=='prg_name'){
			 
		        oTd.setAttribute("style","text-align:left;width:160px;");
		  }else{
		         oTd.setAttribute("style","display:none;");   
		  }		  		   
		}  		
		 
		 var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:40px;");   
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		   
		      myCheck.setAttribute("name","recordchosen3");   //讓使用者勾選的checkbox表	
		    	  
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);   
	}
	 
}
