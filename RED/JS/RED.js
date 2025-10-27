function getProfile(str1,cmpnme) {  
    //以下為儲存所有參數含現存於cookie的，到閉包變數裡 
	if(getAuth[2]().length<1){
		var paraObj={};
		var paraTpe={};
	    for(j=0;j<cmpnme.length;j++){	       
			paraObj[cmpnme[j]['paraNo']]=cmpnme[j]['cngpra'];
			paraTpe[cmpnme[j]['paraNo']]=cmpnme[j]['gTYPE'];
	    }
		paraObj['svripmd5']=getCookie('svripmd5');
		paraTpe['svripmd5']='C';
		paraObj['userid']=getCookie('userid');
		paraTpe['userid']='C';
	    getAuth[2](paraObj);
		getAuth[3](paraTpe);
    }else{                       //若重複登入系統者登出時洗掉cookie裡的變數
	    if(!getCookie('INT_HTM')){
	         const myObject = getAuth[2]()[0];       //再呼叫第一次複製在閉包變數裡的再設一次cookie
             for (const key in myObject) {
                 if (Object.hasOwnProperty.call(myObject, key)) {
					if (getAuth[3]()[0][key]!='T'){
                        setCookie(key,getAuth[2]()[0][key]); 
				    }
                }
            } 	       
	    }  
	}		
	document.getElementById('company_name').innerHTML=getAuth[2]()[0].INT_000;   //顯示公司名稱
    var authField='';    
    var tmpItemName='';
	var mainPrgNo=' ';
	var arr = str1; 	
	var mainUl=document.getElementById("listUL");    	 
	var oLiTop=document.createElement('li');   //最上面先新增一個li 	 
	attachEventListener(oLiTop,"click",accountDele,false);  
	var LastFunc=getAuth[1]()[1]; //getCookie('lastFuncInt');
	var newA=document.createElement("a");
	newA.setAttribute("accesskey","Q");
	newA.setAttribute("href","logOut.php");
	newA.appendChild(document.createTextNode("返回登入畫面"));
	oLiTop.appendChild(newA);
	mainUl.appendChild(oLiTop);	    	
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
					 if(LastFunc && left(arr[i][jk],1)==left(LastFunc,1)){  //如果從子功能返回主選單恢復原狀					                        				
						oUl.setAttribute("class","myShow");								 
					 }else{
					    oUl.setAttribute("class","myHide");								 	
					 }						
					 oLiFather.appendChild(oUl);
					 mainPrgNo=arr[i][jk].slice(0,1);						
				}				 
				if(LastFunc && arr[i][jk]==LastFunc){					    
			 		oUl.parentNode.childNodes[0].style.backgroundImage="url('digits/up.gif')";
					var ndeLth=(oUl.childNodes.length);
					oUl.scrollIntoView({
						 behavior: 'smooth' 
						}); 	                   				    
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
	if(getAuth[1]().length>0){
	  delCookie('useraccount');	
	}
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
