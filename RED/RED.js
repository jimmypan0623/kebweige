 addLoadListener(commontemp);
//從這邊開始 DrawTable  commontemp

function getProfile(str1,cmpnme) {       
    document.getElementById('company_name').innerHTML=cmpnme; 
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
			  var newSpan=document.createElement('span');
			  newSpan.setAttribute("style","display:none;");
			  newSpan.appendChild(document.createTextNode(authField));
			  oLison.appendChild(newSpan);			 
         }
	      var oLiUncle=document.createElement('li');   //最底下再新增一個li tag修改密碼
		  attachEventListener(oLiUncle,"click",blockPsdshow,false);  //修改密碼按鈕程序
		  var newC=document.createElement("a");
		  newC.setAttribute("href","#");
		  newC.appendChild(document.createTextNode("變更登入系統密碼"));
	      oLiUncle.appendChild(newC);
		  mainUl.appendChild(oLiUncle);	      
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
	    case 'D':          
            return '採購管理';
           break;    
	    case 'E':          
            return '生產管理';
           break;    	
	    case 'F':          
            return '料表管理';
            break;   	
	    case 'G':          
            return '成本管理';
            break;   		
        case 'Q':
            return '品保文管';
            break;
        case 'S':
             return '出勤管理';
             break;	
         default: 
	       return '其他';
        //當 expression 的值都不符合上述條件
        //要執行的陳述句
          break;
  }
}
