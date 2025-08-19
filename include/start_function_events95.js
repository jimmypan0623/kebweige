
   function attachEventListener(target,eventType,functionRef,capture)
   {
	   if (typeof target.addEventListener!="undefined")
	   {
		   target.addEventListener(eventType,functionRef,capture);
	   }
	   else if (typeof target.addachEvent!="undefined")
	   {
		   var functionString=eventType+functionRef;
		   target["e"+functionString]=functionRef;
	       target[functionString]=function(event)
		   {
			   if (typeof event=="undefined")
			   {
				   event=window.event;
			   }
			   target["e"+functionString](event);
		   };		   
		   target.attachEvent("on"+eventType,target[functionString]);
	   }
	   else
	   {
		   eventType="on"+eventType;
		   if (typeof target[eventType]=="function")
		   {
			   var oldListener=target[eventType];
			   target[eventType]=function()
			   {
				   oldListener();
				   return functionRef();
			   };
		   }
		   else
		   {
			   target[eventType]=functionRef;
		   }
	   }
   }
   function detachEventListener(target,eventType,functionRef,capture)
   {
	   if (target.removeEventListener !="undefined")
	   {
		   target.removeEventListener(eventType,functionRef,capture);
	   }
	   else if (typeof target.detachEvent!="undefined")
	   {
		   var functionString=eventType+functionRef;
		   target.detachEvent("on"+eventType,target[functionString]);
		   target["e"+functionString]=null;
		   target[functionString]=null;
	   }
	   else
	   {
		   target["on"+eventType]=null;
	   }
   }
   function stopEvent(event)
   {
	   if (typeof event.stopPropagation!="undefined")
	   {
		   event.stopPropagation();
	   }
	   else
	   {
		   event.cancleBubble=true;
	   }
   }
function getEventTarget(event)
{
   var targetElement=null;
   if (typeof event.target!=="undefined")
   {
	   targetElement=event.target;
   }
   else
   {
	   targetElement=event.srcElement;
   }
   while (targetElement.nodeType==3 && targetElement.parentNode!=null)
   {
	   targetElement=targetElement.parentNode;
   }
   return targetElement;
}
function stopDefaultAction(event)
{ 
/*    event.returnValue=false; 
   if (typeof event.preventDefault!="undefined")
   {
      event.preventDefault();
   } */
   return false;
}   

function paddingLeft(str,lenght){  //左邊補0字串
	if(str.length >= lenght)
	return str;
	else
	return right(paddingLeft("0" +str,lenght),lenght);
}
function paddingRight(str,lenght){  //右邊補0字串
	if(str.length >= lenght)
	return str;
	else
	return right(paddingRight(str+"0",lenght),lenght);
}
function left(str, num)
{
    return str.substring(0,num)
}

function right(str, num)
{
    return str.substring(str.length-num,str.length)
}
function escapeHTML(a){
    a = "" + a;
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");;
}
function unescapeHTML(a){
    a = "" + a;
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
//  SELECT選項
function optionitem(adored,id_no,select_width,url_path){	
	if(window.ActiveXObject)
		var request = new ActiveXObject("Microsoft.XMLHttp");
	 else if(window.XMLHttpRequest)
		var request = new XMLHttpRequest();
	request.onreadystatechange = respond;    
	var url=url_path+"?timestamp="+new Date().getTime();   
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);	
	function respond(){
       if (request.readyState == 4 && request.status == 200) {	
           
		  var rsp=JSON.parse(request.responseText);	 
		 
		  optionadd(rsp.recdrow,rsp.crntkey,id_no,select_width);	   	
	  }
    }
	function createQueryString(){	    		 			
	     var queryString ="filename="+adored;
	    return queryString;	 
	}	
	return
}
function optionadd(opt3,crntslt,idNo,slctWdth){
	
	var slt4 = document.getElementById(idNo);	    	//crntopt
	var item_no="";
	var item_value="";
	 
	for(var i=0;i<opt3.length;i++){		
		var item_no="";
		var varItem="";
		for(var jk in opt3[i]){		   
			item_no+=opt3[i][jk]+"    ";	
	       	varItem=new Option(item_no,item_no.substring(0,slctWdth).trim());	//4		     
		}
		slt4.options.add(varItem);  		 
 	   if(slt4.options[i].value.trim()==crntslt){	
	       slt4.options[i].selected=true;	
         	   
       }
	}
	
}

 function checkLength (dom, maxLength){   //中英文限制字數辨別
	 var l = 0;
	 for(var i=0; i<dom.value.length; i++) {
		if (/[\u4e00-\u9fa5]/.test(dom.value[i])) {
		   l+=2;
		} else {
		   l++;
		}
		if (l > maxLength) {
		   dom.value = dom.value.substr(0,i);
		  break;
		}
	 }
}
//計算天數
Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + days);
  return this;
}

function outprocs(event){	  
    if (typeof event=="undefined"){
		event=window.event;
	}    
	
	delCookie("funNo");	 
	delCookie('howpge');
	delCookie('MorP');
	delCookie('kindofda');
	delCookie('adddpt'); 
	for(var i=1;i<10;i++){   //該登入者之權限設定
		var authorder='auth'+paddingLeft(i.toString(),2);	
	 
		delCookie(authorder); 
	}
	var scriptall=document.getElementsByTagName("script");
	for(var j=0;j<scriptall.length;j++){
	    if(scriptall[j].id){
	       scriptall[j].parentNode.removeChild(scriptall[j]);
		}
	}
	
	history.back();	
}

//起始畫面
function DrawTable(){

	var tabs=getElementsByAttribute("class","tab");
	if (tabs[0].checked){
	   var slt2=document.getElementById('recmth');	
       var yesmth=Cookies.get("MorP");
       //if (document.getElementById('ismonthfile').innerHTML!='依月份顯示'){  //如果非月份檔
	    if (yesmth=='P'){  //如果非月份檔
		   var item_no=paddingLeft(1,3);
		   var varItem=new Option(item_no,item_no);
	 	   slt2.options.add(varItem);	 
	       attachEventListener(slt2,'change',choiceClick,false);
	       slt2.options[0].selected=true;		
           choiceClick('001');	
	   }else{
		   	var showTime=document.getElementById('currentTime'); //利用djtime.js顯示畫面的預設日期日期輸入欄之值為今天
		   var thtdy=(showTime.innerHTML.substring(0,4)+'-'+showTime.innerHTML.substring(5,7)+'-'+showTime.innerHTML.substring(8,10)); //中間一定要用減號分隔年月日
	       optionitem(left(thtdy,7),slt2.id,7,"B04/A23srch.php");
	       attachEventListener(slt2,'change',choiceClick,false);       	
          choiceClick(left(thtdy,7));	
	   }
   }  
}

function choiceClick(initpage){   //頁次選擇
	if (initpage==event){	 
	   var target=getEventTarget(initpage);
	   var ckc=document.getElementById("recmth").value;
    }else{
		var ckc=initpage;
    }		
   
	var responseDiv=document.getElementById("serverResponse1");
	responseDiv.innerHTML='&nbsp'; 
	
	 
		 //從此切
	 commontemp(ckc,"PGE");
	
	//切到此	 	
}
//抓取初始資料紀錄



function commontemp(idn,stk){
	var tabs=getElementsByAttribute("class","tab");
	var tbno=0;
	
	if(tabs.length>0 ){
		for(var i=0;i<tabs.length;i++){
		    if (tabs[i].checked){
			    var bibau=cko[i+2](0);   //找出閉包變數現值
	            cko[i+2](bibau*(-1));    //將閉包變數歸零		
	            var aTable = document.getElementById("maintbody"+(i+1).toString());	
				tbno=i;
				break;
			}
		}
	   
	    if (aTable.rows.length>0){
		    var i=0;
	        while (i<aTable.rows.length){
		    
		       aTable.deleteRow(i);		    	    
		       i--;		    
		     i++; 	     
	        }	 		    
	    }
	}
	if(window.ActiveXObject){
		var request = new ActiveXObject("Microsoft.XMLHttp");
	}else if(window.XMLHttpRequest){
		var request = new XMLHttpRequest();
	}
 	request.onreadystatechange = respond;    
	    var urlfolder=document.getElementsByTagName('title');  //菜單主畫面程式還是抓取title前三碼
	    var urlpath=(left(urlfolder[0].innerHTML,3));          //所以其他程式沿用 
	    
		if(!urlpath){    //此段甚為重要!!有時會抓不到title,一開始就使用Cookies.get("funNo")則菜單無法執行,更容易造成null值
		    var nowExcute=left(Cookies.get("funNo"),3);
		    urlpath=nowExcute;
		}

	 
	//if(tabs.length>0 && urlpath!='RED'){
    if(urlpath!='RED'){		
	    if (tbno==0){
	        var url=urlpath+"/"+urlpath+"brow.php?timestamp="+new Date().getTime();	
	    }else if (tbno==1){
		     var url=urlpath+"/"+urlpath+"bodybrow.php?timestamp="+new Date().getTime();
	    }else if (tbno==2){
		     var url=urlpath+"/"+urlpath+"hipsbrow.php?timestamp="+new Date().getTime();
	    }
	}else{
	    var url=urlpath+"/"+urlpath+"brow.php?timestamp="+new Date().getTime();	
	}
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);	
	function respond(){
        if (request.readyState == 4 && request.status == 200) {	   
           rsp=JSON.parse(request.responseText);						   
           getProfile(rsp.recdrow,rsp.pgttl,tbno);	   		 	           	  
	    }
    }
	function createQueryString(){	
	     
		if(tabs.length>0 && urlpath!='RED'){	
			var yesmth=Cookies.get("MorP");
			var yesdpt=Cookies.get("adddpt");
		    if (stk=="PGE"){	

				if (yesmth=='P'){  //如果非月份檔
	    		    var queryString ="filename="+stk+idn+'|'+cko[0](0);				
			    }else{

					if(yesdpt=='D'){   //如果為部門別檔
					   var dptoption= document.getElementById('departNoOption').value;
					 
				       var queryString ="filename="+stk+idn+'|'+((dptoption)?dptoption:Cookies.get("INT_193"));
					   
					}else{
					   var queryString ="filename="+stk+idn+'|';
					}
			    }
	        }else{		
                if (tbno==0){		
					if (yesmth=='P'){  //如果非月份檔
				       var queryString ="filename="+stk.substring(0,7)+"|"+idn;	
				    }else{

						if(yesdpt=='D'){   //如果為部門別檔
						     var dptoption= document.getElementById('departNoOption').value;
					         var queryString ="filename="+stk.substring(0,7)+"|"+idn+"_"+document.getElementById('recmth').value+"~"+((dptoption)?dptoption:Cookies.get("INT_193"));
					    }else{  
					 
					        var queryString ="filename="+stk.substring(0,7)+"|"+idn+"_"+document.getElementById('recmth').value;
				        }
					}
			    }else if (tbno==1){				 
				    var fthkey=document.getElementById('fatherkey');   
				    var queryString ="filename="+fthkey.innerHTML+"|"+stk.substring(0,7)+"|"+idn;				
			    }else if (tbno==2){				 
				    var fthkey=document.getElementById('fatherkey1');  
				
				    var queryString ="filename="+fthkey.innerHTML+"|"+stk.substring(0,7)+"|"+idn;				
			    }				 				 
		    }		
        }else{
			if(urlpath=='RED'){  //如果是主目錄
              var myAccount=Cookies.get('useraccount'); 
	          var queryString ="filename="+"'"+myAccount+"'";
			}  
		}
	    return queryString;
	}  
	 
   // if(tabs.length> && urlpath!='RED'){
	if(urlpath!='RED'){ 
			    var maintable=document.getElementById("member"+(tbno+1).toString());	
				var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());
			  
	    
		
    }
	
	return true; 
}



//新增紀錄按鈕程序
function addrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}

	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');
	for(var i=0;i<tabs.length;i++){
	    if (tabs[i].checked){
	        var responseDiv=document.getElementById("serverResponse"+(i+1).toString());
            var targetTbody=document.getElementById("maintbody"+(i+1).toString());		
			break;
	    }
	}
	
	responseDiv.innerHTML='&nbsp';	
	var Today=new Date();
   var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
	var myAccount=Cookies.get('useraccount');
	var flg=0;

	var targetTrs=targetTbody.getElementsByTagName("tr");   
	blkshow(1);
	
} 
 //修改紀錄
function edtrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var tabs=getElementsByAttribute('class','tab');
	for(var i=0;i<tabs.length;i++){
		if (tabs[i].checked){
		    var responseDiv=document.getElementById("serverResponse"+(i+1).toString());
		    if (cko[i+2](0)==0){      //只能在表身異動故用表身閉包變數
	   	      blkshow("未點選任何紀錄，請點選一筆再按此鈕執行修改");
		      return false;
	        }else if(cko[i+2](0)>1){
		       blkshow("一次只能修改一筆紀錄，請留一筆點選再執行");
		       return false;
	        } 
			break;
		}
	}	

	responseDiv.innerHTML='&nbsp';	
    blkshow(2); 		
} 

//刪除紀錄
function delrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var tabs=getElementsByAttribute('class','tab');
	for(var i=0;i<tabs.length;i++){
		if (tabs[i].checked){
		    if (cko[i+2](0)==0){
		        blkshow("未點選任何紀錄，請點選一筆再按此鈕執行刪除");	
		        return false;	
            }
			break;
		}
	}

	blkshow(4);

}

function ansproc(event){   //確認程序
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	 var target=getEventTarget(event);
	blkshow(3);
}
function vrsproc(event){  //反確認程序
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	 var target=getEventTarget(event);
	blkshow(5);
}
function trnsproc(event){        //轉單程序
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	 var target=getEventTarget(event);
	blkshow(6);

}

//搜尋紀錄
function seekrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
     var target=getEventTarget(event);	 
     blkshow(7);		 
}
//複製權限
function authCopy(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[2](0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行複製權限");	
		return false;	
    } 

	blkshow(8);

}
//移除該帳號所有權限
function authRemove(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[2](0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行移除權限");	
		return false;	
    } 
	blkshow(9);
}
//第一頁面其他按鈕功能
function page1OtherButton1(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}	
	if (cko[2](0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行複製權限");	
		return false;	
    } 
	blkshow(101);
}
//第二頁面其他按鈕功能
function page2OtherButton1(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[3](0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行複製權限");	
		return false;	
    } 
	blkshow(201);
}




function HeadPageChange(event){       //在表身按上下一張按鈕(正三角形與倒三角形)翻表頭頁面隨即連動表身資料
	 if (typeof event=="undefined"){
		event=window.event;		
     }
	 target=getEventTarget(event);	 
	
	 if(target.id.indexOf("previousPage")>-1){  //判斷往上或往下翻頁
		 var crntrec=0;
	 }else {
		  var crntrec=2;
	 } 
	 var tabs=getElementsByAttribute("class","tab");	
	
	 tabs[0].checked=true;
	 		 
	 var recChecked=document.getElementsByName("chkbxmember1"); 
	 for(var i=0;i<recChecked.length;i++){				 
		if (recChecked[i].checked==true){					     
			if(i+(crntrec==2?1:0)==(crntrec==2?recChecked.length:0)){		
               var tablbl=document.getElementsByName('tablbl');			
			   blkshow('資料已到表頭頁最'+(crntrec==2?'下':'上')+'筆，請點擊頁籤\u{300E}'+"<mark style='background-color:olive;color:white;'>"+tablbl[0].innerHTML+"</mark>\u{300F}以翻"+(crntrec==2?'下':'上')+'一頁');			   
			}else{						                 				 
                 var hghtvth=(recChecked[i].parentNode.parentNode.scrollHeight);   				 
                 document.getElementById('maintbody1').scrollBy(0,(hghtvth)*(crntrec==2?1:-1));			
				 crntrec+=i;
				  chooserc(crntrec);      
			}
			break; 	 
		}				  
	}
	var nowTabNo=(right(target.id,1)).toString();   //目前button的id的尾數與頁次對應
	 tabs[nowTabNo].checked=true;
     if(nowTabNo==1){
	    tab2View(event);
	 }else if(nowTabNo==2){				      
	     tab3View(event);				
	}
	
}


function sourceAccount(fldNo,tbno){   //尋找被點選的紀錄
   var respAccount; 
   var maintable=document.getElementById("maintbody"+(tbno+1).toString());	
   
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     if(fldNo){
				    respAccount=maintable.rows[i].cells[fldNo].innerHTML;
				 }else{
					 respAccount=i;
				 }					 
				 break;
			  }
		}
		return respAccount;    
}   	

	 


function searchConfirm(event){   //檢索按鈕
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');
	if (tabs[0].checked){
        var responseDiv=document.getElementById("serverResponse1");	     
	}else if (tabs[1].checked){
		var responseDiv=document.getElementById("serverResponse2");	     	 
	}else if (tabs[2].checked){
		var responseDiv=document.getElementById("serverResponse3");
	}
	 
	responseDiv.innerHTML='&nbsp';    
	var srchelements=document.getElementById('searchWords');
	var x = document.getElementById('filterField');	 
	 //var slt = x.selectedIndex;	
	var slt = cko[6](0);   //目前指向的選項預設值

	if(srchelements.value.trim().length<2 && x.options[slt].text.indexOf('(Y/N)')<0){
		filtermsg(srchelements,"少於2個字");
		return false;
	}else{		    
		if(srchelements.nextSibling ){	
			srchelements.parentNode.removeChild(srchelements.nextSibling);
		}
		if(x.options[slt].text.indexOf('(Y/N)')>0){
			var rdchgs=getElementsByAttribute('name','rdchg');			 
			for (var i=0;i<rdchgs.length;i++){
				if (rdchgs[i].checked) {						
					srchelements.value= rdchgs[i].value;							
					break;
				}			 
			}
		}			 
	}	    
	var txtfound=srchelements;	      	
	if (tabs[0].checked){
	   var slt2=document.getElementById('recmth');	
		if (slt2.value.search('-')==-1){
			  slt2.value="000";	
		}  		   	    
	
	}else{
		var ansbtt=document.getElementById('ANS_BOTT');
		var vrsbtt=document.getElementById('VRS_BOTT');
		var trnsbtt=document.getElementById("TRN_BOTT");	
		if(ansbtt){
			ansbtt.setAttribute("style","display:none;");
			detachEventListener(ansbtt,"click",ansproc,false);
			
		}
		if(vrsbtt){
			vrsbtt.setAttribute("style","display:none;");
			detachEventListener(vrsbtt,"click",vrsproc,false);
		}
		if(trnsbtt){
			trnsbtt.setAttribute("style","display:none;");
			detachEventListener(trnsbtt,"click",trnsproc,false);
		}
	}			
	var fld=document.getElementById('filterField');	 
	commontemp(txtfound.value.trim(),fld.value);
	responseDiv.innerHTML='Searching......';   
	blocksclose();
}

function textKeypress(event){  //搜尋彈出小畫面按Enter	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');	
	if(event.keyCode == 13){        	  	 	
	    if (tabs[0].checked){
           var responseDiv=document.getElementById("serverResponse1");	     
	    }else if (tabs[1].checked){
		   var responseDiv=document.getElementById("serverResponse2");	     	 
	    }else if (tabs[2].checked){
		   var responseDiv=document.getElementById("serverResponse3");	     	 
	    }
	    responseDiv.innerHTML='&nbsp';    
	    var x = document.getElementById('filterField');
	    //var slt = x.selectedIndex;	
		var slt = cko[6](0);      //目前指向的選項預設值
	    if(target.value.trim().length>1 || (x.options[slt].text.indexOf('是否')>0 && target.value.trim().length>0 )){	 	
            if (tabs[0].checked){
			    var slt2=document.getElementById('recmth');			 
			    if (slt2.value.search('-')==-1){
		          slt2.value="000";	
			    }  
		    }else{
			    var ansbtt=document.getElementById('ANS_BOTT');
			    var vrsbtt=document.getElementById('VRS_BOTT');
			    var trnsbtt=document.getElementById("TRN_BOTT");	
			    if(ansbtt){
			  	   ansbtt.setAttribute("style","display:none;");
				   detachEventListener(ansbtt,"click",ansproc,false);				
			    }
			    if(vrsbtt){
				   vrsbtt.setAttribute("style","display:none;");
			       detachEventListener(vrsbtt,"click",vrsproc,false);
			    }
			    if(trnsbtt){
			       trnsbtt.setAttribute("style","display:none;");
				   detachEventListener(trnsbtt,"click",trnsproc,false);
			    }			  
		    }			  
		    var fld=document.getElementById('filterField'); 		   
	        commontemp(target.value.trim(),fld.value);
		    responseDiv.innerHTML='Searching......';   
	    }else{
		   responseDiv.setAttribute("style","color:red;"); 
		   responseDiv.innerHTML="搜尋關鍵字少於2個字元，無法搜尋。";			   
	    }			 	
	    blocksclose();	       
	} 	 	  	
}
//新增修改時過濾回應敘述
function filtermsg(vlobj,msgtxt){
           if(!vlobj.nextSibling ){
		      var errorSpan1=document.createElement("span");		
			  errorSpan1.style.color="red";
			  errorSpan1.style.fontFamily="標楷體";
		      var errorMessage1=document.createTextNode(msgtxt);
		      errorSpan1.appendChild(errorMessage1);
		      errorSpan1.classId="errorMsg";
		      vlobj.parentNode.appendChild(errorSpan1);				 
		   }	 
		   vlobj.focus();
		   return;
}		   



function thousands(num){  //三位點逗號
    return num.toLocaleString();
}


function getElementsByAttribute(attribute,attributeValue)   //同屬性物件
{
	var elementArray=new Array();
	var matchedArray=new Array();
	if (document.all)
	{
		elementArray=document.all;
	}
	else
	{
		elementArray=document.getElementsByTagName("*");
	}
	for (var i=0;i<elementArray.length;i++)
	{
        if (attribute=="class")
		{
			var pattern=new RegExp("(^| )"+attributeValue+"( |$)");
			if (pattern.test(elementArray[i].className))
			{
				matchedArray[matchedArray.length]=elementArray[i];
			}
		}
		else if (attribute=="for")
		{
			if (elementArray[i].getAttribute("htmlFor")||elementArray[i].getAttribute("for"))
			{
				if (elementArray[i].htmlFor==attributeValue)
				{
					matchedArray[matchedArray.length]=elementArray[i];
				}
			}
		}
		else if (elementArray[i].getAttribute(attribute)==attributeValue)
		{
			matchedArray[matchedArray.length]=elementArray[i];
		}
	}
	return matchedArray;
}

function getUrlParams2(url){  //解析url成物件
   let urlStr=url.split('?')[1];
   const urlSearchParams=new URLSearchParams(urlStr);
   const result=Object.fromEntries(urlSearchParams.entries());
   return result;

}
//閉包函數紀錄CHECKBOX點了幾個
function chkCount() {
      var x = 0;
       function f(y) {
           return x += y;
       };
       return f;
}	

function loadScript(url, callback) {        //動態加入js
  var script = document.createElement("script");
  script.type = "text/javascript";
  var stdps=url.indexOf('/');
  var endps=url.indexOf('?v');
  script.id=url.substr(stdps+1,endps-stdps-1);
  // 檢查是否有callback函數
  if (callback) {
    // 確保script載入完成後執行callback
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.head.appendChild(script); // 或 document.body.appendChild(script);
}


function delCookie(name) {
	var expDate = new Date();
	expDate.setTime(expDate.getTime()-1);	// 設定 Cookie 的失效時間比目前時間還早
	document.cookie = escape(name) + "=; expires=" + expDate.toGMTString();	// 重新設定 Cookie
}