
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
function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	if(txtword==7){
		dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    }else if(txtword==101){
		dropsheet_content.style.width="80%";   //原訊息內框畫面寬度調整
	}else{
	    dropsheet_content.style.width="75%";   //原訊息內框畫面寬度調整  
	}
	 dropsheet.style.paddingTop="20px";      // 高度也往上提 	
    return true;
}
function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){  //在此無作用但也要有此函數被呼叫
    if (txtword==7) {
        var txtseek=document.getElementById('searchWords');
		txtseek.focus();
		attachEventListener(txtseek,'keypress',textKeypress,false);
			  
	}			  
  return true;	
}
function searchOptionsKey(tbno,slt5){	
	 slt5.options.add(new Option('料品編號','b25.F02'));	
}

function page1Detail01(ajTable,dialogButton3){
    ajTable.id="srchTable";
	ajTable.childNodes[0].removeChild(ajTable.childNodes[0].childNodes[0]);  //先把關閉按鈕移除
	ajTable.className="gridlist";                 
	var oTr = document.createElement('tr');				 
	var array = ['異動日期','單據類別','單據編號', '異動數量','累計數量','備註說明'];
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array[j]); //cell	
		 if (j==5){		
		   th.setAttribute("style","width:20%;");
		   
		}
		th.appendChild(text);
		oTr.appendChild(th);
		
	}					
	 var div = document.createElement('div');
	 div.appendChild(dialogButton3);    
	 var text20 = document.createTextNode('\u{A0}\u{A0}');
	 ajTable.appendChild(text20 );
	 ajTable.appendChild(div);     //再把關閉按鈕加到最後	 
	 dialogButton3.setAttribute("style","position:relative;left:250px;");			
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	 }
	 request.onreadystatechange = respond;   
	 var url="B25/B26srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
	  
	 var queryString ="filename="+sourceAccount(1,0)+'|'+document.getElementById('departNoOption').value+'|'+document.getElementById('recmth').value+'|'+sourceAccount(2,0)*1;	 
	 request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 searchHaveshiped(rsp,ajTable,dialogButton3);		  
		
		}			
	 }	 
}
function searchHaveshiped(str1,ajTable,dialogButton3) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     
	for(var i=0;i<arr.length;i++){				 
		var oTr=ajTable.insertRow(-1);		 		
		cnt++;         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];    		    		 
		    if(jk=='order_type' || jk=='ship_date' || jk=='ship_order'){
			     oTd.setAttribute("style","text-align:center;");		   
		    }else if(jk=='ship_qty' || jk=='calc_qty'){		  
		        oTd.setAttribute("style","text-align:right;");		   		   
			}else if(jk=='remark'){
				oTd.setAttribute("style","width:20%;"); 
			
			}				
	    }	
     
	}
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}		
}



function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋出貨月報表對照欄位選擇";
}

function page1OtherWindow1(){
	var x = document.getElementById("departNoOption");
	var i = x.selectedIndex;		
    return "\u{1F4C5}:\u{300E}"+document.getElementById('recmth').value+"\u{300F}\u{1F6AA}:\u{300E}"+ x.options[i].text+"\u{300F}\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}之庫存異動紀錄";   
}
