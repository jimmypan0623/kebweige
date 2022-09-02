 addLoadListener(getStart);
//從這邊開始 
var cko = chkCount(); //利用閉包函數當計數器
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
	
	var cnfrm=document.getElementById('seekfrm');
	attachEventListener(cnfrm,'click',seekBtnClick,false); 
	cnfrm.setAttribute("style","visibility:hidden;");
	var txtseek=document.getElementById('srch');
	attachEventListener(txtseek,'focus',textFocuson,false); 
	attachEventListener(txtseek,'keypress',textEnter,false); 
	var slt2=document.getElementById('recmth');	 
	slt2.setAttribute('name','month');	     
	
	
 

		var item_no=paddingLeft(1,3);
		var varItem=new Option(item_no,item_no);
		slt2.options.add(varItem);
	 
 
	 attachEventListener(slt2,'change',choiceClick,false);
	 slt2.options[0].selected=true;
     choiceClick('001');	
}
function handleStateChange(){	
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200)	  
	DrawTable(xmlHttp.responseXML);	//responseXML獲取到XML文檔(初始畫面)   		  		 
}
function getProfile(str1,pagecount) {    

    var slt2=document.getElementById('recmth');
	if (slt2.options.length<pagecount){
		for (var i=slt2.options.length+1;i<=pagecount;i++){

		var item_no=paddingLeft(i,3);
		var varItem=new Option(item_no,item_no);
		slt2.options.add(varItem);
	 
        }
	}
	
    var Today=new Date();
　  var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
    var cnt=0;
	var arr = str1; 
    var oTable = document.getElementById("maintbody");		 
	for(var i=0;i<arr.length;i++){		
		var oTr=oTable.insertRow(-1);	
        oTr.setAttribute("name","mainrow");		
        cnt++;		
		for(var jk in arr[i]){		   
		  var oTd = oTr.insertCell(oTr.cells.length);
		      
		  if (!isNaN(parseInt(arr[i][jk]*1))){
			  oTd.innerHTML=parseInt(arr[i][jk]*1)>0?arr[i][jk]:"";
		  } else{
			  oTd.innerHTML=arr[i][jk];
		  }		  	
		  
		if(jk=='rc_no'){
			 
			oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	  
		  }else if(jk.slice(-2)=='dt'){
			 if (oTd.innerHTML<nowday)
		        oTd.setAttribute("style","text-align:center;width:110px;color:#7f8890;");  
			 else
				oTd.setAttribute("style","text-align:center;width:110px;");
          }else if(jk=='acc_no'){
			 if (oTr.cells[1].innerHTML<nowday)
			    oTd.setAttribute("style","text-align:left;width:90px;color:#7f8890;");
			 else
		        oTd.setAttribute("style","text-align:left;width:90px;");			 
          }else if(jk.slice(-2)=='tm'){
			 if (oTr.cells[1].innerHTML<nowday)
				 oTd.setAttribute("style","text-align:center;width:76px;color:#7f8890;");
		     else		 
		        oTd.setAttribute("style","text-align:center;width:76px;");    
		  }else if(jk.slice(-3)=='man'){
			 if (oTr.cells[1].innerHTML<nowday)
				 oTd.setAttribute("style","text-align:left;width:100px;color:#7f8890;"); 
		     else		 
		        oTd.setAttribute("style","text-align:left;width:100px;"); 
		  }else if(jk.slice(-4)=='name'){
			 if (oTr.cells[1].innerHTML<nowday) 
				oTd.setAttribute("style","text-align:left;width:81px;color:#7f8890;"); 
		     else		 
		        oTd.setAttribute("style","text-align:left;width:81px;"); 	 
		  }else if(jk=='lve_for'){
			 if (oTr.cells[1].innerHTML<nowday) 
				 oTd.setAttribute("style","text-align:left;width:224px;color:#7f8890;"); 
		     else		 
			    oTd.setAttribute("style","text-align:left;width:224px;"); 
		  }else if(jk.slice(-3)=='rsn'){
			 if (oTr.cells[1].innerHTML<nowday)   
				 oTd.setAttribute("style","text-align:left;width:124px;color:#7f8890;"); 
			 else	 
			    oTd.setAttribute("style","text-align:left;width:124px;"); 
          }else if(jk=='tel_no'){
			  if (oTr.cells[1].innerHTML<nowday)  
				 oTd.setAttribute("style","text-align:left;width:127px;color:#7f8890;"); 
			  else	  
			     oTd.setAttribute("style","text-align:left;width:127px;"); 			 
		  }else{
			  if (oTr.cells[1].innerHTML<nowday)  
				 oTd.setAttribute("style","text-align:left;width:60px;color:#7f8890;"); 
			  else	  
			     oTd.setAttribute("style","text-align:left;width:60px;");
		  }
	      if(jk=='bck_tm'){        //如果還在外面就顯示粗體咖啡色
              if (oTd.innerHTML=="" && oTr.cells[1].innerHTML==nowday)  
				 oTd.parentNode.setAttribute("style","font-weight:bold;color:#704214;"); 			  	  		       
		  }	  
		}
	  
	     
         
	       var myAccount=Cookies.get('useraccount');
		   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:30px;");   
		   
	 	      var myCheck=document.createElement('input'); 
		      myCheck.type="checkbox";
		      myCheck.setAttribute("name","recordchosen");   //讓使用者勾選的checkbox	
			  if(myAccount==oTr.cells[4].innerHTML && oTr.cells[1].innerHTML==nowday &&oTr.cells[10].innerHTML==''){
		         attachEventListener(myCheck,'click',chooserc,false); 
			  }	 
			  else{
				   myCheck.style.display="none"
				     
			  }
		      oTd.appendChild(myCheck);           
           
	}
	  var txtfound=document.getElementById('srch');
	  if(txtfound.value.trim().length>1){		    //如果搜尋欄位有一個以上字元的字串代表檢索才顯示訊息
		  var responseDiv=document.getElementById("serverResponse");  		  	   
	      if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此資料！Not found!　検索できません。";
	      }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
          }	
	  }
	
}
function choiceClick(initpage){   //頁次選擇
	
	/*if (typeof initpage=="undefined"){
		initpage=window.event;
    }*/		
	if (initpage==event){
	 
	   var target=getEventTarget(initpage);
    }	   
	var responseDiv=document.getElementById("serverResponse");
	responseDiv.innerHTML='&nbsp'; 
	var txtseek=document.getElementById("srch");
	txtseek.value="";
	var cnfrm=document.getElementById('seekfrm');
	cnfrm.setAttribute("style","visibility:hidden;"); 
		 //從此切
	 commontemp("recmth","PGE");
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
		var fld=document.getElementById('recfield');
		
		commontemp("srch",fld.value);
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
		      slt2.value="000";
			  var fld=document.getElementById('recfield');    
			  
			  commontemp("srch",fld.value);
		 }
	}	
	  
	
}
function commontemp(idn,stk){
	var bibau=cko(0);   //找出閉包變數現值
	cko(bibau*(-1));    //將閉包變數歸零
	var aTable = document.getElementById("maintbody");	
	if (aTable.rows.length>0){
		var i=0;
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
	var url="S27brow.php?timestamp="+new Date().getTime();
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
		if (stk=="PGE"){			
	        var queryString ="filename="+stk+mthRec ;
	    }else{
			
			var queryString ="filename="+stk.slice(0,7)+" REGEXP "+"'"+mthRec+"'";

		}			
	    return queryString;	// 
	}
	if(idn!="recmth"){
	  var responseDiv=document.getElementById("serverResponse");
	  responseDiv.setAttribute("style","color:red;");
	  responseDiv.innerHTML="Searching......";
	}  
    
	  var maintable=document.getElementById("member");
	  myThgrp=maintable.getElementsByTagName("th");
	  myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
	
	return
}
function chooserc(event)
{
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	 //recordchosen
	var targetA=getEventTarget(event);
	var targetTd=targetA.parentNode;
	
	var targetTr=targetTd.parentNode;
	var targetTrChildren=targetTr.getElementsByTagName("td");
   
	if (targetA.checked){			
	   // if(Cookies.get('delauth')!='Y'){   //沒有刪除權限一次只能選一筆	 
			 var recChecked=document.getElementsByName("recordchosen")
			 for(var i=0;i<recChecked.length;i++){
				 if(recChecked[i].parentNode.parentNode.firstChild.innerHTML!=targetTrChildren[0].innerHTML){
					 if (recChecked[i].checked){
					    recChecked[i].checked=false;
						cko(-1);
						recChecked[i].parentNode.parentNode.style.backgroundColor="#BAF4D8";
					 }
				 }
			 }
		//}
		targetTr.style.backgroundColor="#B9B9FF";
	    
		if (cko(0)==0){
			var tables=getElementsByAttribute("class","datalist");
			var ths=tables[0].getElementsByTagName("th");			 
			ths[ths.length-1].childNodes[0].textContent="取消";			 
		}		
		cko(1);
         var responseDiv=document.getElementById("serverResponse");	 
	     responseDiv.innerHTML='&nbsp'; 			
    }else{
	
	     targetTr.style.backgroundColor="#BAF4D8";
	   cko(-1);
	  if (cko(0)==0){
			var tables=getElementsByAttribute("class","datalist");
			var ths=tables[0].getElementsByTagName("th");			 
			ths[ths.length-1].childNodes[0].textContent="選取";			
           	
	  }
 
	  
	}
	
   return true;
}
 
function evalinstead(str){   //取代eval()的改寫函數
	  var fn=Function;
	  return new fn('return '+str)();
	  
}
//閉包函數紀錄CHECKBOX點了幾個
function chkCount() {
      var x = 0;
       function f(y) {
           return x += y;
       };
       return f;
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

