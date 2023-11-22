 addLoadListener(getStart);
//從這邊開始 
var cko=[];  //利用閉包函數當計數器
cko[0] = chkCount();  //首頁選擇計數
cko[1] = chkCount();  //子頁選擇計數
cko[2] = chkCount();  //開窗選擇計數
cko[3] = chkCount();  //紀錄資料表頁數
cko[4] = chkCount();  //紀錄總筆數
//var ckm=  chkCount();
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
	var tabs=getElementsByAttribute("class","tab");
	if (tabs[0].checked){
	   
	   var cnfrm=document.getElementById('seekfrm');
	  
	   cnfrm.setAttribute("style","visibility:hidden;");
   	   var txtseek=document.getElementById('srch');
	  	   
	   var slt2=document.getElementById('recmth');	
       slt2.setAttribute('name','month');	    	   
	}
	  attachEventListener(cnfrm,'click',seekBtnClick,false); 
	  attachEventListener(txtseek,'focus',textFocuson,false); 
	  attachEventListener(txtseek,'keypress',textEnter,false);  
   if (tabs[0].checked){    //如果是表頭
		var item_no=paddingLeft(1,3);
		var varItem=new Option(item_no,item_no);
	 	slt2.options.add(varItem);	 
	    attachEventListener(slt2,'change',choiceClick,false);
	    slt2.options[0].selected=true;
		
        choiceClick('001');	
   }
}
function handleStateChange(){	
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200)	  
	   DrawTable(xmlHttp.responseXML);	//responseXML獲取到XML文檔(初始畫面)   		  		 
}
function getProfile(str1,reccount) {    
  
    var Today=new Date();
    var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
    var cnt=0;
	var arr = str1; 
    var tabs=getElementsByAttribute("class","tab");
        var pagecount=Math.ceil(reccount/12);
        var optdigts= (pagecount.toString()).length;
        var slt2=document.getElementById('recmth');
	    if (slt2.options.length<pagecount){
    		for (var i=slt2.options.length+1;i<=pagecount;i++){
			    var item_no=paddingLeft(i,optdigts);
		        var varItem=new Option(item_no,item_no);
	    	    slt2.options.add(varItem);	 
           }
		   		   //第一個選項位數修正		   
		   slt2.options[0].value=paddingLeft(1,optdigts);
		   slt2.options[0].text=paddingLeft(1,optdigts);
		    var bibau=cko[4](0);   //找出閉包筆數變數現值
	        cko[4](bibau*(-1));    //將閉包變數歸零
		    cko[4](reccount);      //將筆數記起來	
          
	    }
		var oTable = document.getElementById("maintbody");
		var fld=document.getElementById('recfield');
	    for(var i=0;i<arr.length;i++){		
	    	var oTr=oTable.insertRow(-1);	
            oTr.setAttribute("name","mainrow");	      		
            cnt++;		
	    	for(var jk in arr[i]){		   
	    	    var oTd = oTr.insertCell(oTr.cells.length);		     		  
	    		oTd.innerHTML=arr[i][jk];		 	  			 
	    	    if(jk=='rc_no'){			 
	    	     	oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");		  	  
	    	    }
	    	      else if(jk=='stock_no'){		    	
		                 oTd.setAttribute("style","text-align:left;width:226px");			 
                         attachEventListener(oTd,'click',rowchoose,false);		//點選資料		  
		        }else if(jk=='stock_name'){			 				
		               oTd.setAttribute("style","text-align:left;width:180px;");   
		    		   attachEventListener(oTd,'click',rowchoose,false);		//點選資料    
				 
				}else{						 
					   oTd.setAttribute("style","text-align:left;width:127px;display:none;");                         
				}             
                         
					 	   
		        
			
		   }
	
		  
	       var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:40px;display:none");   //勾選不顯示
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";		  
		   myCheck.setAttribute("name","recordchosen1");   //讓使用者勾選的checkbox表頭			
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);     
		   if(arr[i]['ntqty']*1>arr[i]['maxinv']*1 && arr[i]['maxinv']*1>0){  //庫存大於上限
			   oTr.setAttribute("style","font-weight:bold;color:#E60000;");  //#704214
		   } 
		   if(arr[i]['ntqty']*1<arr[i]['minuminv']*1 && arr[i]['minuminv']*1>0){  //庫存小於安全存量
			   oTr.setAttribute("style","font-weight:bold;color:#704214;");//#949100
		   } 
	}
	      var valueshows=document.getElementsByName("b01value");
	      for(var p=0;p<valueshows.length;p++){
		      valueshows[p].innerHTML="";
	      }
	     var txtfound=document.getElementById('srch');
		 var responseDiv=document.getElementById("serverResponse1");  		
	  if(txtfound.value.trim().length>1){		    //如果搜尋欄位有一個以上字元的字串代表檢索才顯示訊息		  		  	   
	      if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.innerHTML="無此資料！Not found!検索できません。";
	      }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
          }	
	  }
	  if(cnt>0){       //初始畫面呼叫
		  chooserc(1);
	  }	  
}
function choiceClick(initpage){   //頁次選擇
	if (initpage==event){	 
	   var target=getEventTarget(initpage);
    }	   
	var responseDiv=document.getElementById("serverResponse1");
	responseDiv.innerHTML='&nbsp'; 
	var txtseek=document.getElementById("srch");
	txtseek.value="";
	var cnfrm=document.getElementById('seekfrm');
	cnfrm.setAttribute("style","visibility:hidden;"); 
		 //從此切
	 commontemp(document.getElementById("recmth").value,"PGE");
	//切到此	 	
}
function seekBtnClick(event){   //檢索按鈕
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');	
    var responseDiv=document.getElementById("serverResponse1");
	var txtfound=document.getElementById('srch');	 	
	if(txtfound.value.trim().length<2){		
	   responseDiv.setAttribute("style","color:red;"); 
	   responseDiv.innerHTML="必須多於1個字元。Must be more than 1 character. 1 文字以上でなければなりません。";	
	}else{
        responseDiv.innerHTML='&nbsp';			
		   var slt2=document.getElementById('recmth');			 
	       slt2.value="0";
		   var fld=document.getElementById('recfield');	    	  
		commontemp(txtfound.value.trim(),fld.value);
	}
}
function textFocuson(event){
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	
	var tabs=getElementsByAttribute('class','tab');
	if (tabs[0].checked){
	    var cnfrm=document.getElementById('seekfrm');
	}else{
		var cnfrm=document.getElementById('seekfrm2');
	}
	cnfrm.setAttribute("style","visiblity:true;");	
}
function textEnter(event){	 
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');
	if (tabs[0].checked)
        var responseDiv=document.getElementById("serverResponse1"); 
	else
		 var responseDiv=document.getElementById("serverResponse2"); 
    if (event.keyCode == 13){
		 if (target.value.trim().length<2){
			 responseDiv.setAttribute("style","color:red;"); 
			 responseDiv.innerHTML="必須多於1個字元。Must be more than 1 character. 1 文字以上でなければなりません。";
		 }else{			 
		      responseDiv.innerHTML='&nbsp';
			 
			     var slt2=document.getElementById('recmth');
		         slt2.value="0";
			     var fld=document.getElementById('recfield');    
	
			  commontemp(target.value.trim(),fld.value);
		 }
	}		  	
}
function commontemp(idn,stk){
	var tabs=getElementsByAttribute("class","tab");
	
	   var bibau=cko[0](0);   //找出閉包變數現值
	   cko[0](bibau*(-1));    //將閉包變數歸零
	   
	   var aTable = document.getElementById("maintbody");	

	if (aTable.rows.length>0){    //表格內容先清空	
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
	var url="B01/B01brow.php?timestamp="+new Date().getTime();	
	var queryString=createQueryString();
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(queryString);	
	function respond(){
       if (request.readyState == 4 && request.status == 200) {	   
           rsp=JSON.parse(request.responseText);						   
           getProfile(rsp.recdrow,rsp.pgttl);	   		 	  
          //evalinstead(request.responseText);		  
	  }
    }
	function createQueryString(){	    	  		 
		if (stk=="PGE"){					        
	    		var queryString ="filename="+stk+idn+'|'+cko[4](0);
	    }else{			
				var queryString ="filename="+stk.substring(0,7)+"|"+idn;				
		}			
	    return queryString;
	}  
	    var maintable=document.getElementById("member");
		var txtfound=document.getElementById('srch');
		var responseDiv=document.getElementById("serverResponse1");
	
	  myThgrp=maintable.getElementsByTagName("th");
	  myThgrp[myThgrp.length-1].childNodes[0].textContent="選取";	
	  if(txtfound.value.trim().length>1 ){
		 responseDiv.setAttribute("style","color:red;");
	     responseDiv.innerHTML="Searching......";
	  }
	
	return true;
}
function chooserc(event)
{	  
  if(!isNaN(event)){  //初始畫面呼叫
      var recNo=event;
	  var maintable=document.getElementById("maintbody");
	  var invdtl=document.getElementById("INVDTL_BOTT");
	  targetA=maintable.rows[recNo-1].cells[maintable.rows[recNo-1].cells.length-1].childNodes[0];	  	  
	  targetA.checked=true;
  }else{
    if (typeof event=="undefined")
	   {
		event=window.event;
	   }	 
	var targetA=getEventTarget(event);
	
  }  
	var tables=getElementsByAttribute("class","gridlist");
	var targetG=targetA.parentNode.parentNode.parentNode.parentNode;
	var chsntail=0;
	for(var i=0;i<tables.length;i++){
		
		if(targetG.id==tables[i].id){
			 chsntail=i;
		     break;
		}
	}	 	
	var targetTd=targetA.parentNode;
	
	var targetTr=targetTd.parentNode;
	var targetTrChildren=targetTr.getElementsByTagName("td");
   
	if (targetA.checked){			
	   
       	   
		     var recChecked=document.getElementsByName("recordchosen"+String(chsntail+1));    //尋找 
			 
			 for(var i=0;i<recChecked.length;i++){
				 if(recChecked[i].parentNode.parentNode.firstChild.innerHTML!=targetTrChildren[0].innerHTML){
					 if (recChecked[i].checked){
						
					    recChecked[i].checked=false;
					 
						  cko[chsntail](-1);
					  
						
						recChecked[i].parentNode.parentNode.style.backgroundColor="";
					 }
				 }
			 }
	 
	   		   targetTr.style.backgroundColor="#B9B9FF";

		   if (cko[chsntail](0)==0){
			
			   var ths=tables[chsntail].getElementsByTagName("th");			 
			   ths[ths.length-1].childNodes[0].textContent="取消";	
			    
		   }		
		   var b01a_value_names=document.getElementsByName("b01value");
		   for(var i=0;i<7;i++){
			   b01a_value_names[i].innerHTML=targetTrChildren[i+1].innerHTML;
		   }

		   document.getElementById("kind_of_belong_to").innerHTML=belongtoshow( document.getElementById("kind_of_belong_to").innerHTML);
		   document.getElementById("who_hold").innerHTML=targetTrChildren[8].innerHTML+' '+targetTrChildren[9].innerHTML; 
	        
			for(var i=8;i<b01a_value_names.length;i++){
			    b01a_value_names[i].innerHTML=targetTrChildren[i+2].innerHTML;
		    }
	
			   document.getElementById("bom_should_be").innerHTML=(document.getElementById("bom_should_be").innerHTML=='Y'?'是':'否') ;
		       document.getElementById("leadtm_prchs").innerHTML+="天" ;
			   document.getElementById("leadtm_ready").innerHTML+="天" ;
			   document.getElementById("type_of_apply").innerHTML+=(document.getElementById("type_of_apply").innerHTML=='A'?'  個別領料':'  整批領料');			     	
		    cko[chsntail](1);
            var responseDiv=document.getElementById("serverResponse"+String(chsntail+1));			 
            if (isNaN(event)){
		       responseDiv.innerHTML='&nbsp'; 
            }
			if(b01a_value_names[8].innerHTML.trim()=="" && b01a_value_names[9].innerHTML.trim()==""){
				invdtl.setAttribute("style","visibility:hidden;");
				detachEventListener(invdtl,"click",srchshow,false);
			}else{
				invdtl.setAttribute("style","visibility:visible;");
				attachEventListener(invdtl,"click",srchshow,false);		  								
			}

    }else{
	 
	
		 targetTr.style.backgroundColor="";
	 
	        cko[chsntail](-1);
	        if (cko[chsntail](0)==0){
		   	  
			   var ths=tables[chsntail].getElementsByTagName("th");			 
			   ths[ths.length-1].childNodes[0].textContent="選取";	
               var valueshows=document.getElementsByName("b01value");
			   for(var p=0;p<valueshows.length;p++){
				    valueshows[p].innerHTML="";
			   }
           	   
	        }
			
	}	
   return true;
}
function rowchoose(event){   //點選列ROW就可以選擇該筆資料
    
    if (typeof event=="undefined")
	{
		event=window.event;
	}	
 	var target=getEventTarget(event);
	var invdtl=document.getElementById("INVDTL_BOTT");
    var chsntail=0;
	var targetRow=target.parentNode;
	var targetG=targetRow.parentNode.parentNode;	 
	var tabs=getElementsByAttribute('class','tab');
	var tables=getElementsByAttribute("class","gridlist");
	for(var i=0;i<tables.length;i++){		
		if(targetG.id==tables[i].id){
			 chsntail=i;
		     break;
		}
	}
	if(targetRow.lastChild.firstChild.checked==false){							     
		 var recChecked=document.getElementsByName("recordchosen"+String(chsntail+1));    //尋找表頭
	
		for(var i=0;i<recChecked.length;i++){
		   if(recChecked[i].parentNode.parentNode.firstChild.innerHTML!=targetRow.firstChild.innerHTML){
			  if (recChecked[i].checked){
				  recChecked[i].checked=false;				
				  cko[chsntail](-1);				
				 recChecked[i].parentNode.parentNode.style.backgroundColor="";
			  }
		   }
	    }
		targetRow.style.backgroundColor="#B9B9FF";
		targetRow.lastChild.lastChild.checked=true;
		var b01a_value_names=document.getElementsByName("b01value");
		for(var i=0;i<7;i++){
			b01a_value_names[i].innerHTML=targetRow.childNodes[i+1].innerHTML;
		}

		document.getElementById("kind_of_belong_to").innerHTML=belongtoshow(document.getElementById("kind_of_belong_to").innerHTML);
		document.getElementById("who_hold").innerHTML=targetRow.childNodes[8].innerHTML+' '+targetRow.childNodes[9].innerHTML;	   
		for(var i=8;i<b01a_value_names.length-1;i++){
			b01a_value_names[i].innerHTML=targetRow.childNodes[i+2].innerHTML;
		}
	    document.getElementById("bom_should_be").innerHTML=(document.getElementById("bom_should_be").innerHTML=='Y'?'是':'否') ;
		document.getElementById("leadtm_prchs").innerHTML+="天" ;
	    document.getElementById("leadtm_ready").innerHTML+="天" ;
        document.getElementById("type_of_apply").innerHTML+=(document.getElementById("type_of_apply").innerHTML=='A'?'  個別領料':'  整批領料');	      
		
		   if (cko[chsntail](0)==0){
			
			   var ths=tables[chsntail].getElementsByTagName("th");			 
			   ths[ths.length-1].childNodes[0].textContent="取消";			 
		   }		
		    cko[chsntail](1);
			
            var responseDiv=document.getElementById("serverResponse"+String(chsntail+1));	 	         		
		 responseDiv.innerHTML='&nbsp'; 	
		 if(b01a_value_names[8].innerHTML.trim()=="" && b01a_value_names[9].innerHTML.trim()==""){
				invdtl.setAttribute("style","visibility:hidden;");
				detachEventListener(invdtl,"click",srchshow,false);
		 }else{
				invdtl.setAttribute("style","visibility:visible;");
				attachEventListener(invdtl,"click",srchshow,false);
		 }
	} 
	   
	 return true;
	 
}
function belongtoshow(blg){
	var msgshow='';
	switch (blg) {
          case 'YNN': {    
                msgshow = '外購原料';    
                break;  
          }
          case 'YNY': {  
                msgshow = '買賣商品';    
                break;
          }
	      case 'NYY': {  
                msgshow = '自產銷售';    
                break;
          }
	      case 'NYN': {  
                msgshow = '在製組件';    
                break;
          }
	      case 'NNN': {  
                msgshow = '虛擬料號';    
                break;
          }
	      case 'YYY': {  
                msgshow = '無須定義';    
                break;
          }
          default: {
               break;
          }
     } 
  return msgshow;
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
 


