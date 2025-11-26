function srchshow(event)
{
    if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);		
    var presentNo=target.parentNode.childNodes[0];
	//setCookie("presentNoID",presentNo.id);
	getAuth[1]()[2]=presentNo.id;
	var orgArg=srcArgobj(presentNo.id);

    var btns=getElementsByAttribute('class','btn');	
	for (var i=btns.length-1;i>btns.length-3;i--){	        
	    btns[i].removeAttribute("accesskey");				 	  
	}	
/*'<div id="myModal" class="modal" style="display:block"><div class="modal-content"><span class="close">&times;</span><p>'.$error_msg.'(或是註冊申請表)</p></div></div>'*/
/*用JavaScript DOM 的建立方式建立如上列顯示之html標籤，同時把該有的css屬性加入以作彈跳視窗*/
    var dropext=document.getElementById('myModal20');  //由於與帳號登入錯誤訊息視窗共用一個DOM元素所建立的訊息畫面故先檢查該組元素是否還隱藏在畫面內有的話移除再重建
	if (dropext){	//如果有殘留訊息畫面的DOM則移除
	    dropext.parentNode.removeChild(dropext);
    }		
	var dropsheet=document.createElement('div');   //從外層元素開始加入
	dropsheet.setAttribute("id","myModal20");
	dropsheet.setAttribute("class","modal");
	dropsheet.style.display="block";	   
    dropsheet.style.position="fixed"; /* Stay in place */       		
    dropsheet.style.left="0";
    dropsheet.style.top="0";
    dropsheet.style.width="100%"; /* Full width */
    dropsheet.style.height="100%";  
	dropsheet.style.zIndex="1";
	dropsheet.style.paddingTop="100px"; /* Location of the box */
	dropsheet.style.overflow="auto";     /* Enable scroll if needed */	
    dropsheet.style.backgroundColor = "rgba(0,0,0,0.4)"; /* Black w/ opacity 外層黑透內層白底*/
	var body=document.getElementsByTagName("body")[0];
	body.appendChild(dropsheet);            //最外層<div>加入body
    var dropsheet_content=document.createElement('div');
	dropsheet_content.setAttribute("id","modal-content2");
	dropsheet_content.style.backgroundColor="#fefefe";		
	dropsheet_content.style.margin="auto";
	dropsheet_content.style.padding="20px";
	dropsheet_content.style.width=orgArg['drpshtWidth']//"28%";	
	dropsheet_content.style.border="1px solid #888";
	dropsheet_content.style.fontSize="22px";	  	  
	dropsheet_content.style.boxShadow = "5px 5px 5px 5px #003153";  //
	dropsheet.appendChild(dropsheet_content);  //訊息內框加入	      
	var headtitle=orgArg['headtitle'];//"請選取人員帳號姓名";
	dropsheet.style.paddingTop="20px"; /* Location of the box */
	var dialog=document.createElement("div");		//開始從畫面產生新增紀錄欄位			 
	dialog.className="customDialog"; 		 
	dialog.style.position="relative";
	var btnsdiv=document.createElement("div");	 
	btnsdiv.style.textAlign="center";
	var dialogButton1=document.createElement("input");		   
	dialogButton1.setAttribute("type","button");
	dialogButton1.setAttribute("class","btn");
	dialogButton1.setAttribute("value","\u{2713}");			//確認				 
	dialogButton1.setAttribute("style","color:green;font-size:17px;");
	dialogButton1.setAttribute("title","確認此筆選項，快速鍵 Alt+Y");		
	dialogButton1.setAttribute("accesskey","Y");	 
	attachEventListener(dialogButton1,"click",orgArg["clickfunc"],false);	
	var textyesno = document.createTextNode('\u{A0}');
	var dialogButton3=document.createElement("input");
	dialogButton3.setAttribute("type","button");
	dialogButton3.setAttribute("class","btn");
	dialogButton3.setAttribute("value","\u{2715}"); //關閉
	dialogButton3.setAttribute("style","color:red;font-size:17px;");
	dialogButton3.setAttribute("title","關閉此視窗，快速鍵 Alt+C");	
	dialogButton3.setAttribute("accesskey","C");	
	attachEventListener(dialogButton3,"click",srchblkclose,false);		  	      		  		  
	var tblname=document.createElement("caption");
	tblname.innerHTML=headtitle;					 				 
	var srchTable=document.createElement("table");				  
	srchTable.id="stuffTable";						
	srchTable.setAttribute("class","gridlist");                
	var srchHead=document.createElement("thead");		
	srchHead.setAttribute("style","display:table;width:100%;table-layout:fixed;");				  
	srchHead.style.width=orgArg['mendwidth'];  //"calc( 100% - 1em )";
	srchTable.appendChild(tblname);
	srchTable.appendChild(srchHead);				 				
	var oTr = document.createElement('tr');				 
	var array1 = orgArg['thCntnt'];    //表頭欄名
	var array2 = orgArg['thWidth'];    //表頭欄寬度
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
	    th.style.width=array2[j];
		th.appendChild(text);
		oTr.appendChild(th);		 
	}				
	srchHead.appendChild(oTr);	
	var srchTbody=document.createElement("tbody");			
	srchTbody.id='stuffTbody';
	srchTbody.style.display="block";
	srchTbody.style.height="250px";
	srchTbody.style.width="100%"; 
	srchTbody.style.overflow="auto";		
	srchTable.appendChild(srchTbody);  						 
	var formJason=document.createElement('form');		   
	formJason.id="formdata2";	          								 
	formJason.appendChild(srchTable);		
	btnsdiv.appendChild(dialogButton1);
	btnsdiv.appendChild(textyesno);
	btnsdiv.appendChild(dialogButton3);				
	formJason.appendChild(btnsdiv);
	dialog.appendChild(formJason)  				  
	dropsheet_content.appendChild(dialog);		
	if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	}else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
	}
	request.onreadystatechange = respond;   		 
	var url=srcArgobj(presentNo.id)['urlPth']+"?timestamp="+new Date().getTime();   //"A01/BKND/A01srch.php?timestamp="+new Date().getTime();                				
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");		
    var queryString = "filename="+orgArg['qryString'];  //presentNo.value;          
	request.send(queryString);
	function respond(){
		if (request.readyState == 4 && request.status == 200) {	       	     		            
			 rsp=JSON.parse(request.responseText);						   
			 srchStuffNo(rsp);				                            	  
		}	  
	}

    return true;
}

function srchblkclose(event)  //關閉註冊彈出視窗
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);
	var dropsheet=document.getElementById("myModal20");
	dropsheet.style.display="none";       //關閉視窗 
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   	  
	var bibau=cko[1](0);   //找出閉包變數現值
	cko[1](bibau*(-1));    //將閉包變數歸零	 
	var btns=getElementsByAttribute('class','btn');		
    for (var i=btns.length-1;i>btns.length-3;i--){		
		btns[i].setAttribute("accesskey",btns[i].title.substr(-1));				 
	}	   
	document.getElementById(getAuth[1]()[2]).focus();
	//document.getElementById(getCookie("presentNoID")).focus();
	//delCookie("presentNoID");	
	return true;
}	

function srchStuffNo(str1) {       //開窗顯示人員選項
    var cnt=0;
	var arr = str1; 
    var oTable = document.getElementById("stuffTbody");		 
	for(var i=0;i<arr.length;i++){				 
		var oTr=oTable.insertRow(-1);		     
		cnt++;        
		for(var jk in arr[i]){		   				
		    var oTd = oTr.insertCell(oTr.cells.length);
			oTd.textContent=arr[i][jk];	
		    var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R				
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";
			   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			}   
		}  				 
		var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	    oTd.setAttribute("style","display:none");   //勾選不顯示
	 	var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";		
		var rcrdchsn="chkbxstuffTable"; 
		myCheck.setAttribute("name",rcrdchsn);   //讓使用者勾選的checkbox表			    	  
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);   
	}
	if (cnt>0){
		cko[1](1);
	    chooserc(1);
	}
	   
}
