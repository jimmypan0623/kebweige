 addLoadListener(getStart);
//從這邊開始 
 
xmlFile='models/q78.xml';
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

    	
	slt1=document.getElementById('recyear');
	slt1.setAttribute('name','year');	 
	var ytmp=document.getElementById('currentTime').innerHTML.substring(0,4);	 
	for (var i=-2;i<2;i++){		
	    var varItem = new Option((1*ytmp+i) +'年',''+(1*ytmp+i));
		slt1.options.add(varItem);
		if (i==0)
			slt1.options[2].selected=true;	  
    }			 
	attachEventListener(slt1,'change',choiceClick,false);
	var slt2=document.getElementById('recmth');
	slt2.setAttribute('name','month');	     
	var mth=document.getElementById('currentTime').innerHTML.substring(5,7);
	for (var i=1;i<13;i++){
		var varItem = new Option((i<10?'0'+i:''+i)+'月', i<10?'0'+i:''+i);		 	
        slt2.options.add(varItem); 		
		if(mth== (i<10?'0'+i:''+i)){		 
			 slt2.options[slt2.length-1].selected=true;	         	
		}	 
    }
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
    var oTable = document.getElementById("member");		 
	    
	
	var oTbody=document.createElement("tbody");
	
	oTable.appendChild(oTbody);
	for(var i=0;i<arr.length;i++){		
	   
		  var oTr=oTbody.insertRow(oTbody.rows.length);
		  
         
		  for(var jk in arr[i]){
		 
		     var oTd = oTr.insertCell(oTr.cells.length);

		     oTd.innerHTML=arr[i][jk];

		 
		     if(jk=='REVENUE'){
			    cnt+=parseInt(oTd.innerHTML);
			    oTd.setAttribute("style","text-align:right;");   
                oTd.innerHTML=separator(parseInt(oTd.innerHTML));				
		     }else {
			  
			    oTd.setAttribute("style","text-align:left;");  
				
			  
	       }  		   
		} 
	  		
	}
    var totalAmountDiv=document.getElementById("ttlrevenue");
    totalAmountDiv.innerHTML=separator(cnt);
    var responseDiv=document.getElementById("serverResponse");
    responseDiv.innerHTML="";
}
function choiceClick(event){
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);		
	//
	 
	 
	var aTable = document.getElementById("member");	
	
	 delTbody("member",0);
	

	 var responseDiv=document.getElementById("serverResponse");
     responseDiv.innerHTML="";	
	 if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;   
	var url="C13/C13.php?timestamp="+new Date().getTime();
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
	    var yearRec = document.getElementById("recyear").value;
	    var mthRec = document.getElementById("recmth").value;	
	    var queryString ='filename='+yearRec+mthRec;
	    return queryString;	// 
	}
	var responseDiv=document.getElementById("serverResponse");
	var aTable = document.getElementById("member");
	if (aTable.rows.length<2){
		responseDiv.innerHTML="無此月份資料";
		var totalAmountDiv=document.getElementById("ttlrevenue");
		totalAmountDiv.innerHTML="";
		
	} 
	
}
function evalinstead(str){   //取代eval()的改寫函數
	  var fn=Function;
	  return new fn('return '+str)();
	  
}
function delTbody(n,i){   //刪除整張表身函數
     var t=document.getElementById(n);
     if (!t)return;
     var tbs=t.getElementsByTagName('tbody');
     if (tbs.length==0){
           // alert('tbody都被你幹掉了，你還想怎麼樣？');
         return;
      }
       if (!tbs[i]){
                alert('你指定的tbody索引號對應的tbody不存在');
                return;
       }
      t.removeChild(tbs[i]);
}

function separator(numb) {    //金額顯示逗號
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}