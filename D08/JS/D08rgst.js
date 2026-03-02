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
    var btns=getElementsByAttribute('class','btn');		
	var bttssn1=[];
    for (var i=0;i<btns.length;i++){
		bttssn1.push(btns[i].title);
		btns[i].setAttribute("accesskey",right(bttssn1[i],1));				 
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
	 slt5.options.add(new Option('料品編號','d04.F02'));
	 slt5.options.add(new Option('品名規格','b01.F02'));
	 slt5.options.add(new Option('採購單號','d04.F01'));
	 slt5.options.add(new Option('預定交期','d04.F06'));
	 slt5.options.add(new Option('廠商編號','d03.F03'));	
     slt5.options.add(new Option('廠商簡稱','d01.F04'));
	 slt5.options.add(new Option('廠商品號','d04.F05'));
	 slt5.options.add(new Option('採購備註','d03.F14'));
	 slt5.options.add(new Option('採購編號','d03.F07'));
	 slt5.options.add(new Option('採購姓名','a01.F03'));
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
	 var url="D08/BKND/B02srch.php?timestamp="+new Date().getTime();   	               				 
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

function page1Detail02(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";
	ajTable.className="gridlist";                 	 		
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	 }
	 request.onreadystatechange = respond;   
	 var url="B01/BKND/B11srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		 			    
	 var queryString ="filename="+sourceAccount(1,0);
	  
	 request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 srchStockNo(rsp,ajTable);		  
		}	  
	 }	 
}

function page1Detail03(ajTable){
	ajTable.childNodes[0].childNodes[0].style.backgroundColor='white';
    ajTable.id="srchTable";	
	ajTable.className="gridlist";                 	 			
	 if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 }else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	 }
	 request.onreadystatechange = respond;   
	 var url="D08/BKND/E07srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
	  
	 var queryString ="filename="+sourceAccount(1,0)+'|'+sourceAccount(8,0)*1;	 
  
	request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 searchHaveshiped(rsp,ajTable);		  		
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
    var array = ['進貨單號','預進貨日','部門編號', '部門名稱','預進貨量'];
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		
		var text = document.createTextNode(array[j]); //cell		
		th.appendChild(text);
		oTr.appendChild(th);
	}						
}

function srchStockNo(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     
	for(var i=0;i<arr.length;i++){				 
        var oTr=ajTable.insertRow(ajTable,ajTable.length);		
		cnt++;         
		for(var jk in arr[i]){		   
		   var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];    		    		 
		    if(jk=='dpt_no'){
			     oTd.setAttribute("style","text-align:center;width:18%;");
		    }else if(jk=='dpt_name'){			 
		        oTd.setAttribute("style","text-align:center;");
			
		    }else if(jk=='stock_qty'){		  
			    if(oTr.cells[2].innerHTML!='Y'){									  
				    	oTd.setAttribute("style","text-align:right;text-decoration: line-through;color:#7f8890;");
				    }else{
					    oTd.setAttribute("style","text-align:right;");
				}
			
		    }else if(jk=='last_update'){		  
		        oTd.setAttribute("style","text-align:center;");
		    }else if (jk=='apply'){		  
		        oTd.setAttribute("style","text-align:left;"); 														  		
		    }else if(jk=='diffdate' || jk=='avail'){
				oTd.setAttribute("style","display:none;");
			}				
	    }	
        if(arr[i]['diffdate']>210 ){  //最後異動日期距今超過210天紅字		   
			oTr.setAttribute("style","font-weight:bold;color:#E60000;");			
		}else if(arr[i]['diffdate']>90 ){//最後異動日期距今超過90天低於210天棕色字
			oTr.setAttribute("style","font-weight:bold;color:#704214;");			
		}
	}	
    var array = ['部門編號', '部門名稱','庫存數量','最後異動','預計用途'];
	var oTr=ajTable.insertRow(ajTable,ajTable.length);
	for (var j = 0; j < array.length; j++) {
		var th = document.createElement('th'); //column		
		var text = document.createTextNode(array[j]); //cell
        if(j==0){
		   th.style.width='18%';
		}			
		th.appendChild(text);
		oTr.appendChild(th);
	}				
}

function searchHaveshiped(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     	 
	var initqty=sourceAccount(2,0);    
	for(var i=arr.length-1;i>-1;i--){				 
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
		cnt++;         
		for(var jk in arr[i]){		   
		    var oTd = oTr.insertCell(oTr.cells.length); 
			oTd.innerHTML=arr[i][jk];	
			var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[0]:直接或間接 D/I
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R	
			if(ks[0]=="D"){
				oTd.setAttribute("class","directdata");	
			}else{
				oTd.setAttribute("class","indirectdata");	
			}				 
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";		
			}
			 
			if(arr[i]['rc_no_IHC_000']==left(sourceAccount(3,0),2)+sourceAccount('0',0)){			
			     oTr.style.backgroundColor='#B9B9FF';
			}
	    }	    
	}	
	
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}else{
	    var array3 = ['單據號碼','異動','異動日期', '異動數量','預期結餘','對象編號','對象簡稱'];
		var array4 = ['10%','4%','10%', '10%','10%','7%','8%'];
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    for (var j = 0; j < array3.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[j]); //cell	
			th.style.width=array4[j];
		    th.appendChild(text);
		    oTr.appendChild(th);		
	    }						
	}		
	
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋出貨月報表對照欄位選擇";
}
function page1OtherWindow1(){
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{1F4E5}:\u{300E}"+sourceAccount(3,0)+"\u{300F}開單未過帳明細";
}
function page1OtherWindow2(){
    return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{26A1}:\u{300E}"+sourceAccount(2,0)+"\u{300F}\u{A0}\u{A0}之庫存明細\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{1F4C4}庫存總計:"+sourceAccount(8,0);
}

function page1OtherWindow3(){		 
   return "\u{1F4E6}:\u{300E}"+sourceAccount(1,0)+"\u{300F}\u{A0}\u{A0}預期異動明細\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{1F4C4}目前庫存:"+sourceAccount(8,0);
}