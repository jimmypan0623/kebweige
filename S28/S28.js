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
function handleStateChange(){	
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200)	  
	  DrawTable(xmlHttp.responseXML);	//responseXML獲取到XML文檔(初始畫面)   		  		 
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
	for (var i=-3;i<1;i++){		
	    var varItem = new Option((1*ytmp+i) +'年',''+(1*ytmp+i));
		slt1.options.add(varItem);		 
    }			 
	slt1.options[slt1.length-1].selected=true;	 
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


function getProfile(str1) {    

  var cnt=0;
	var arr = str1; 
    var oTable = document.getElementById("member");		 
	    
	var oThead=document.createElement("thead");
	
	oTable.appendChild(oThead);	
	var oTbody=document.createElement("tbody");
	
	oTable.appendChild(oTbody);
	for(var i=0;i<arr.length;i++){		
	    if (i==0){
			var rowTh = oThead.insertRow(-1);
			//oThead.appendChild(rowTh);
			
            for (var bk in arr[0]) {
                var headerCell = document.createElement("th");                
				headerCell.innerHTML = arr[0][bk];
                rowTh.appendChild(headerCell);
            }

		}else{
		  //var oTr=oTable.insertRow(oTable.rows.length);
		  var oTr=oTbody.insertRow(oTbody.rows.length);
		  cnt++;
         
		  for(var jk in arr[i]){
		 
		  var oTd = oTr.insertCell(oTr.cells.length);

		  oTd.innerHTML=arr[i][jk];

		 
		  if(jk=='STAFFNO'|jk=='STAFFNAME' |jk=='DPTNAME'){
			 oTd.setAttribute("style","text-align:left;");   
		  } else {
			 if(oTd.innerHTML=="全日到勤" | oTd.innerHTML=="尚未下班"){//
				 oTd.innerHTML="";
			   
			 }else{
			
				   if (oTd.innerHTML.slice(-1)=='假'){
					    if (oTd.innerHTML.slice(-2)=='公假'){
					       oTd.setAttribute("style","text-align:center;background-color:#BAFFDA;");  
					   }else if(oTd.innerHTML.slice(-2)=='婚假'){
						   oTd.setAttribute("style","text-align:center;background-color:#FF9797;");  	
                       }else if(oTd.innerHTML.slice(-2)=='喪假'){
						   oTd.setAttribute("style","text-align:center;background-color:#8E8E8E;");  
                       }else if(oTd.innerHTML.slice(-2)=='產假'){
						   oTd.setAttribute("style","text-align:center;background-color:#FFBFFF;");  	
                       }else if(oTd.innerHTML.slice(-2)=='病假'){
						   oTd.setAttribute("style","text-align:center;background-color:#B9B973;");  	 						   
					   }else{
					      oTd.setAttribute("style","text-align:center;background-color:#AED6F1;");  						  
					   }	  
				   }else if(oTd.innerHTML.slice(-2)=='缺勤'){   
			          oTd.setAttribute("style","text-align:center;background-color:#F9E79F;"); 
				   }else{
					   oTd.setAttribute("style","text-align:left;");
				   }
				
			 }
		  }  		   
		} 
	  }		
	}


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
	 aTable.deleteTHead();

	 var responseDiv=document.getElementById("serverResponse");
     responseDiv.innerHTML="";	
	 if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;   
	var url="S28/S28.php?timestamp="+new Date().getTime();
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
	    var queryString ='filename='+'json/S28'+yearRec+mthRec;
	    return queryString;	// 
	}
	var responseDiv=document.getElementById("serverResponse");
	var aTable = document.getElementById("member");
	if (aTable.rows.length<5){
		responseDiv.innerHTML="無此月份資料";
		
	} 
	
}
function evalinstead(str){   //取代eval()的改寫函數
	  var fn=Function;
	  return new fn('return '+str)();
	  
}
function delTbody(n,i){   // 
     var t=document.getElementById(n);
     if (!t)return;
     var tbs=t.getElementsByTagName('tbody');
     if (tbs.length==0){          
         return;
      }
       if (!tbs[i]){
                alert('what you refer to is not exist');
                return;
       }
      t.removeChild(tbs[i]);
}
