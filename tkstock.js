 addLoadListener(getStart);
//從這邊開始 
xmlFile='tkstock.xml';
function getStart(){     
    
   var xmlHttp;      
   getXML(xmlFile);
   
}    
function createXMLHttpRequest(){
	if(window.ActiveXObject)
		xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
	else if(window.XMLHttpRequest)
		xmlHttp = new XMLHttpRequest();
}
function getXML(addressXML){
	var url = addressXML + "?timestamp=" + new Date();
	createXMLHttpRequest();
	xmlHttp.onreadystatechange = handleStateChange;
	xmlHttp.open("GET",url);
	xmlHttp.send(null);
}

function DrawTable(myXML){
	//用DOM方法操作XML文檔
	var oMembers = myXML.getElementsByTagName("member");
	var oMember,sPage;
	for(var i=0;i<oMembers.length;i++){
		oMember = oMembers[i];			
		sPage = oMember.getElementsByTagName("pge")[0].firstChild.nodeValue;					
		 
		 
	}  
	
	var cnfrm=document.getElementById('seekfrm');
	attachEventListener(cnfrm,'click',seekBtnClick,false); 
	cnfrm.setAttribute("style","visibility:hidden;");
	var txtseek=document.getElementById('srch');
	attachEventListener(txtseek,'focus',textFocuson,false); 
	attachEventListener(txtseek,'keypress',textEnter,false); 
	var slt2=document.getElementById('recmth');
	slt2.setAttribute('name','month');	     
	var mth=document.getElementById('currentTime').innerHTML.substring(5,7);
	
	//var mth=1;
	for (var i=1;i<sPage;i++){
		/*var varItem = new Option((i<100?'0'+i:''+i), i<100?'0'+i:''+i);		 	
        slt2.options.add(varItem); 		
		if(mth== (i<10?'0'+i:''+i)){		 
			 slt2.options[0].selected=true;	         	
		}*/
		var item_no=paddingLeft(i,3);
		var varItem=new Option(item_no,item_no);
		slt2.options.add(varItem);
		//slt2.options[0].selected=true;	
    }
	 slt2.options[0].selected=true;
	attachEventListener(slt2,'change',choiceClick,false);   
	
    choiceClick();	
}
function handleStateChange(){	
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200)	  
		  DrawTable(xmlHttp.responseXML);	//responseXML獲取到XML文檔(初始畫面)   		  		 
}
function getProfile(str1) {    
    var cnt=0;
	var arr = str1; 
    var oTable = document.getElementById("maintbody");		 
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(oTable.rows.length);
		cnt++;
         
		for(var jk in arr[i]){		   
		  var oTd = oTr.insertCell(oTr.cells.length);
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }
		 
		  if(jk=='stockno'|jk=='dscrpt'){
			 oTd.setAttribute("style","text-align:left;");   
		  } else if (jk=='item'){
			 oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;") 
		  }else{
		     oTd.setAttribute("style","text-align:right;");      
		  }		  		   
		}  				 	 	     		 
	}
	  var txtfound=document.getElementById('srch');
	  if(txtfound.value.trim().length>1){		    //如果搜尋欄位有一個以上自元的字串代表檢索才顯示訊息
		  var responseDiv=document.getElementById("serverResponse");  		  	   
	      if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此品號！Not found!　検索できません。";
	      }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
          }	
	  }  
}
function choiceClick(event){   //頁次選擇
	
	if (typeof event=="undefined"){
		event=window.event;
    }		
	var target=getEventTarget(event);		
	var responseDiv=document.getElementById("serverResponse");
	responseDiv.innerHTML='&nbsp'; 
	var txtseek=document.getElementById("srch");
	txtseek.value="";
	var cnfrm=document.getElementById('seekfrm');
	cnfrm.setAttribute("style","visibility:hidden;"); 
		 //從此切
	 commontemp("recmth","STOCK");
	//切到此	 	
}
function seekBtnClick(event){   //檢索按鈕
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var responseDiv=document.getElementById("serverResponse");
	var txtfound=document.getElementById('srch');
	if(txtfound.value.trim().length<2){		
	    responseDiv.setAttribute("style","color:red;"); 
	    responseDiv.innerHTML="必須多於1個字元。Must be more than 1 character. 1 文字以上でなければなりません。";
	}else{
	    responseDiv.innerHTML='&nbsp';
		var slt2=document.getElementById('recmth');
		slt2.value="000";
		commontemp("srch","TTL");
	}
}
function textFocuson(event){
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var cnfrm=document.getElementById('seekfrm');
	cnfrm.setAttribute("style","visiblity:true;");
	
}
function textEnter(event){
	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
	var responseDiv=document.getElementById("serverResponse");
    if (event.keyCode == 13){
		 if (target.value.trim().length<2){
			 responseDiv.setAttribute("style","color:red;"); 
			 responseDiv.innerHTML="必須多於1個字元。Must be more than 1 character. 1 文字以上でなければなりません。";
		 }else{
			  responseDiv.innerHTML='&nbsp';
			  var slt2=document.getElementById('recmth');
		      slt2.value="00";
			  commontemp("srch","TTL");
		 }
	}	
	  
	
}
function commontemp(idn,stk){
	var aTable = document.getElementById("member");	
	if (aTable.rows.length>1){
		var i=1;
	    while (i<aTable.rows.length){
		    
		       aTable.deleteRow(i);		    	    
		       i--;
		    
		     i++; 	     
	    }	 		    
	}
	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;   
	var url="tkstock.php?timestamp="+new Date().getTime();
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
    
	    var mthRec = document.getElementById(idn).value.trim();		 
		if (stk=="STOCK"){			
	        var queryString ='filename='+stk+mthRec;
	    }else{
			
			var queryString ='filename='+mthRec;
		}			
	    return queryString;	// 
	}
	if(idn!="recmth"){
	  var responseDiv=document.getElementById("serverResponse");
	  responseDiv.setAttribute("style","color:red;");
	  responseDiv.innerHTML="Searching......";
	}  
           
	return
}
function evalinstead(str){   //取代eval()的改寫函數
	  var fn=Function;
	  return new fn('return '+str)();
	  
}

