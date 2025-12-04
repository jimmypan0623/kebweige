function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');		
    for(var i=0;i<tabs.length;i++){
		tabs[i].setAttribute("accesskey",(i+1).toString());
	}	
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
    }else if(txtword==101){
		dropsheet_content.style.width="90%";   //原訊息內框畫面寬度調整
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
	 var url="B25/BKND/B26srch.php?timestamp="+new Date().getTime();   	               				 
	 request.open("POST",url);	 
	 request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
	  
	 var queryString ="filename="+sourceAccount(1,0)+'|'+document.getElementById('departNoOption').value+'|'+document.getElementById('recmth').value+'|'+sourceAccount(2,0)*1;	 
  
	request.send(queryString);
	 function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		
			 rsp=JSON.parse(request.responseText);						   
			 searchHaveshiped(rsp,ajTable);		  		
		}			
	 }	 
}
function searchHaveshiped(str1,ajTable) {       //搜尋相關料號
    var cnt=0;
	var arr = str1;     	 
	var initqty=sourceAccount(2,0);    //
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
	    }	    
	}	
	  
    if(cnt==0){
	  blkshow("無資料!");
	  return false;
	}else{
	    var array = ['異動日期','單據類別','單據編號', '異動數量','累計數量','備註說明'];
		var array4 = ['10%','12%','12%', '14%','14%','38%'];
	    var oTr=ajTable.insertRow(ajTable,ajTable.length);
	    for (var j = 0; j < array.length; j++) {
		    var th = document.createElement('th'); //column		   
		    var text = document.createTextNode(array[j]); //cell	
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
	var x = document.getElementById("departNoOption");
	var i = x.selectedIndex;		
	var iniyqty=sourceAccount(2,0)*1 ; 
	 
    return "\u{1F4C5}:\u{300E}"+document.getElementById('recmth').value+"\u{300F}\u{1F6AA}:\u{300E}"+ x.options[i].text+"\u{300F}\u{1F4E6}:\u{300E}"
+sourceAccount(1,0)+"\u{300F}之異動紀錄"+"\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}期初數量:\u{300C}"+iniyqty.toString()+"\u{300D}";   
}
