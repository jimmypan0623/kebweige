 addLoadListener(getStart);
//從這邊開始 

xmlFile='models/q78.xml';
function getStart(){     

   var xmlHttp;      
   getXML(xmlFile);
 
}    
function getXML(addressXML){
	var url = addressXML + "?timestamp=" + new Date();
	createXMLHttpRequest();
	xmlHttp.onreadystatechange = handleStateChange;
	xmlHttp.open("GET",url);
	xmlHttp.send(null);
}
function createXMLHttpRequest(){
	if(window.ActiveXObject)
		xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
	else if(window.XMLHttpRequest)
		xmlHttp = new XMLHttpRequest();
}


function DrawTable(myXML){
	//用DOM方法操作XML文檔
	var oMembers = myXML.getElementsByTagName("member");
	var oMember,sPage;
	for(var i=0;i<oMembers.length;i++){
		oMember = oMembers[i];			
		sPage = oMember.getElementsByTagName("pge")[0].firstChild.nodeValue;					

	}  
    commontemp();  //無參數直接執行插入UL跟LI標籤
}
function handleStateChange(){	
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200)	  
	DrawTable(xmlHttp.responseXML);	//responseXML獲取到XML文檔(初始畫面)   		  		 
}
function getProfile(str1) {   
    var authField='';    
    var tmpItemName='';
	var mainPrgNo=' ';
	var arr = str1; 	
	var mainUl=document.getElementById("listUL");    	 
	for(var i=0;i<arr.length;i++){		          
		  for(var jk in arr[i]){		   		  
		      if(jk=='prg_no'){
				 if(mainPrgNo!=arr[i][jk].slice(0,1)){				  
					 var oLiFather=document.createElement('li');
					 oLiFather.setAttribute("class","hasmenu");
					 attachEventListener(oLiFather,"click",redmenuchange,false);
					 var newA=document.createElement("a");
				     newA.setAttribute("href","#");
					 newA.appendChild(document.createTextNode(arr[i][jk].slice(0,1)+'.'+summaryName(arr[i][jk].slice(0,1))));
	       	         oLiFather.appendChild(newA);
		              mainUl.appendChild(oLiFather)
		             var oUl=document.createElement('ul');
		             oUl.setAttribute("class","myHide");					 
		             oLiFather.appendChild(oUl);
				     mainPrgNo=arr[i][jk].slice(0,1);					  
				   }
				   tmpItemName=arr[i][jk]+'.';
				   
			     }else if(jk=='dscrpt'){
	   			      tmpItemName+=arr[i][jk];
			          var oLison=document.createElement('li');               
			          var newB=document.createElement("a");
			          //newB.setAttribute("href",tmpItemName.slice(0,3)+'auth.php'); 
					  newB.setAttribute("href","#"); 
			          newB.appendChild(document.createTextNode(tmpItemName));					 
	                  oLison.appendChild(newB);			 
					  attachEventListener(oLison,"click",excuteFun,false);
	                  oUl.appendChild(oLison);
	                  tmpItemName='';
                      authField='';					  
			     }else{
				    authField+=arr[i][jk];
				   
			     }	
				  
		      }
		      //alert(authField);
			  var newSpan=document.createElement('span');
			  newSpan.setAttribute("style","display:none;");
			  newSpan.appendChild(document.createTextNode(authField));
			  oLison.appendChild(newSpan);
			 
         }
	      var oLiUncle=document.createElement('li');   //最底下再新增一個li tag修改密碼
		  attachEventListener(oLiUncle,"click",blockshow,false);  //修改密碼按鈕程序
		  var newC=document.createElement("a");
		  newC.setAttribute("href","#");
		  newC.appendChild(document.createTextNode("變更登入系統密碼"));
	      oLiUncle.appendChild(newC);
		  mainUl.appendChild(oLiUncle);
	       
}

function commontemp(){


	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;    
	var url="REDbrow.php?timestamp="+new Date().getTime();
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
	    
		    var myAccount=Cookies.get('useraccount'); 
	        var queryString ="filename="+"'"+myAccount+"'";
	    	
	    return queryString;	// 
	}
	 
    
	 
	  
	
	return
}

 
function evalinstead(str){   //取代eval()的改寫函數
	  var fn=Function;
	  return new fn('return '+str)();
	  
}

 
function getCookie(sName) {
    var aCookie = document.cookie.split('; ');
    for (var i=0; i < aCookie.length; i++) {
    var aCrumb = aCookie[i].split('=');
    if (sName == aCrumb[0])
    return decodeURI(aCrumb[1]);
 }
 return '';
}

function summaryName(dtshow){
	switch (dtshow) {
    case 'A':
          return '系統設定';
    break; 
    case 'B':
         return '庫存管理';
    break;
    case 'C':
         return '營業管理';
    break;
    case 'Q':
         return '品保文管';
    break;
    case 'S':
         return '出勤管理';
    break;	
    default: 
	     return '還沒想到';
        //當 expression 的值都不符合上述條件
        //要執行的陳述句
    break;
  }
}