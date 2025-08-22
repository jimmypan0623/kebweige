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
	 slt5.options.add(new Option('料品編號','c04.F02'));
	 slt5.options.add(new Option('品名規格','b01.F02'));
	 slt5.options.add(new Option('訂單編號','c04.F01'));
	 slt5.options.add(new Option('預定交期','c04.F06'));
	 slt5.options.add(new Option('客戶編號','c03.F03'));	
     slt5.options.add(new Option('客戶簡稱','c01.F05'));
	 slt5.options.add(new Option('客戶品號','c04.F05'));
	 slt5.options.add(new Option('客戶PO','c03.F14'));
	 slt5.options.add(new Option('業務編號','c03.F07'));
	 slt5.options.add(new Option('業務姓名','a01.F03'));
}

function page1Detail01(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";	
	ajTable.className="gridlist";                 	 	 		
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	 }
	 request.onreadystatechange = respond;   
	 var url="C05/BKND/B04srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		    	 
	 var queryString ="filename="+sourceAccount(1,0)+'|'+sourceAccount(3,0);	 
	 request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 searchReadyship(rsp,ajTable);		  
		
		}			
	 }	 
}
function searchReadyship(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     
	for(var i=0;i<arr.length;i++){				 		 
		var oTr=ajTable.insertRow(ajTable,ajTable.length);
		cnt++;         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];    		    		 
		    if(jk=='dpt_no' || jk=='dpt_name' || jk=='ship_date'){
			     oTd.setAttribute("style","text-align:center;");		   
		    }else if(jk=='ship_qty'){		  
		        oTd.setAttribute("style","text-align:right;");		   		   
			}				
	    }	
     
	}
    var array = ['出貨單號','預出貨日','部門編號', '部門名稱','預出貨量'];
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		
		var text = document.createTextNode(array[j]); //cell		
		th.appendChild(text);
		oTr.appendChild(th);
	}						
}

function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋出貨月報表對照欄位選擇";
}
function page1OtherWindow1(){
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{1F4E4}:\u{300E}"+sourceAccount(3,0)+"\u{300F}開單未過帳明細";
}