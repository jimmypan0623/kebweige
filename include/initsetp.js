addLoadListener(initDialog);
var cko=[];  //利用閉包函數當計數器
cko[0] = chkCount();  //此處紀錄首頁資料庫目前筆數，如果是月份單據類則紀錄是否已結轉
cko[1] = chkCount();  //判斷現在開窗中的gridlist
cko[2] = chkCount();  //首頁選擇計數(gridlist)
cko[3] = chkCount();  //次頁選擇計數(gridlist)
cko[4] = chkCount();  //第三頁選擇計數(gridlist)
cko[5] = chkCount();  //第四頁選擇計數(gridlist)
cko[6] = chkCount();  //畫面主搜尋(也只有一個)功能目前鍵值紀錄指向計數

function initDialog()
{        	 
	 var myAccount=Cookies.get('useraccount');
	 var i;		 
	 if(!myAccount){
         (function myLoop(i) {
             setTimeout(function() {
               blkshow("請先從登入畫面登入帳號密碼"); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 9000)
          })(10);                   //  pass the number of iterations as an argument

		document.location.href="logOut.php";
    }else{	
        var nwdt=new Date();	
	    var nwsd=Math.floor(Math.random()*nwdt.getSeconds())%20;
	    var nowExcute=Cookies.get("funNo");
		if(nowExcute){
			var divcontainer=document.getElementById('container');
			divcontainer.style.display='none';
			var links=document.getElementsByTagName('link');
			 links[0].href="B04/B04.css?v=0.0.1" ;						 
			 var gifarray=['ROL','0','cell','1','fngbtn','2','spec','3','stckgood',
			 '4','00002','5','smlbulb','6','myrndm','7','openfile','8','enlight','9']; 			
			 links[1].href="digits/"+gifarray[nwsd]+".gif";			
	        var urlfolder=document.getElementsByTagName('title');
	        urlfolder[0].innerHTML=nowExcute; 				
	        var divcontents=getElementsByAttribute('class','tab_content');
            var tabs=getElementsByAttribute('name','tab');
	        var tablblnames=getElementsByAttribute('name','tablbl');	
	        var pages=Cookies.get("howpge");
	        for(var i=pages;i<tablblnames.length;i++){
	            tablblnames[i].parentNode.removeChild(tablblnames[i]);
	            tabs[i].parentNode.removeChild(tabs[i]);
	            divcontents[i].parentNode.removeChild(divcontents[i]);
	        }	
			
		    var urljsname=left(nowExcute,3)+'/'+left(nowExcute,3)+'elmcrt.js?v='+gifarray[nwsd]+
			(document.getElementById('currentTime').innerHTML.substr(-2));//1.6.9'; 
		
            loadScript(urljsname,function(){crtElm();});  
		    var mthjudge=Cookies.get("MorP");
	        var contentdiv=getElementsByAttribute('class','tab_content');
	        var initFirstNode=(contentdiv[0].firstChild);
		    if (mthjudge!='M'){    //如果非月份檔	 
	            if(contentdiv){
			        var initFirstNode=(contentdiv[0].firstChild);
		            var pageTopButton=document.createElement("input");		   
		            pageTopButton.setAttribute("type","button");
		            pageTopButton.setAttribute("class","btn");
		            pageTopButton.setAttribute("value","\u{23EE}");   
				    pageTopButton.setAttribute("title","到首頁，快速鍵 Alt+T");
				    pageTopButton.setAttribute("accesskey","T");					
				    pageTopButton.id="TopPage";		
				    attachEventListener(pageTopButton,"click",rollChange,false);  //在第一頁點 << 形按鈕(第一張)
				    var pageLastButton=document.createElement("input");		   
					pageLastButton.setAttribute("type","button");
					pageLastButton.setAttribute("class","btn");
					pageLastButton.setAttribute("value","\u{25C0}");  
					pageLastButton.setAttribute("title","到到上頁，快速鍵 Alt+J"); 
					pageLastButton.setAttribute("accesskey","J");					
					pageLastButton.id="LastPage";	
					attachEventListener(pageLastButton,"click",rollChange,false);  //在第一頁點 < 形按鈕(上一張)
					var text1 = document.createTextNode('\u{A0}\u{00A0}第\u{A0}');				
					var sltPage=document.createElement("select");
					sltPage.setAttribute("id","recmth");
					var text2 = document.createTextNode('\u{A0}頁\u{A0}\u{A0}');
					var text3 = document.createTextNode('\u{A0}');
					var text4 = document.createTextNode('\u{A0}');
					var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
					var pageNextButton=document.createElement("input");		   
					pageNextButton.setAttribute("type","button");
					pageNextButton.setAttribute("class","btn");
					pageNextButton.setAttribute("value","\u{25B6}");    
					pageNextButton.setAttribute("title","到下頁，快速鍵 Alt+K");   
					pageNextButton.setAttribute("accesskey","K");					
					pageNextButton.id="AfterPage";	   
					attachEventListener(pageNextButton,"click",rollChange,false);  //在第一頁點 > 形按鈕(下一張)
					var pageBottomButton=document.createElement("input");		   
					pageBottomButton.setAttribute("type","button");
					pageBottomButton.setAttribute("class","btn");
					pageBottomButton.setAttribute("value","\u{23ED}");   
					pageBottomButton.setAttribute("title","到末頁，快速鍵 Alt+V");
					pageBottomButton.setAttribute("accesskey","V");					
					pageBottomButton.id="BottomPage";	   
					attachEventListener(pageBottomButton,"click",rollChange,false);  //在第一頁點 >> 形按鈕(最後一張)
					contentdiv[0].insertBefore(pageTopButton, initFirstNode);
					contentdiv[0].insertBefore(text3, initFirstNode);
					contentdiv[0].insertBefore(pageLastButton, initFirstNode);
					contentdiv[0].insertBefore(text1, initFirstNode);
					contentdiv[0].insertBefore(sltPage, initFirstNode);
					contentdiv[0].insertBefore(text2, initFirstNode);
					contentdiv[0].insertBefore(pageNextButton, initFirstNode);
					contentdiv[0].insertBefore(text4, initFirstNode);
					contentdiv[0].insertBefore(pageBottomButton, initFirstNode);
					contentdiv[0].insertBefore(text5, initFirstNode);
	            }
			}else{                                                   //月份檔
				var mthspan=document.createElement("span");
				var text1 = document.createTextNode('年月\u{A0}');
				mthspan.appendChild(text1);
				mthspan.setAttribute("style","font-size:120%;");
				var sltPage=document.createElement("select");
				sltPage.setAttribute("id","recmth");
				var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
				contentdiv[0].insertBefore(mthspan, initFirstNode);
				contentdiv[0].insertBefore(sltPage, initFirstNode);
				contentdiv[0].insertBefore(text5, initFirstNode);
			}
		    var urlcmp=(decodeURI(window.location.search));
	        var rslt=getUrlParams2(urlcmp);
		    var text9 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}登入者:');
		    var username=document.createElement("span");	
		    username.innerHTML=rslt.username;
		    var ftbtm=document.getElementById("footbottom");
		    ftbtm.appendChild(text9);
	        ftbtm.appendChild(username);
        //document.getElementById('user_who').innerHTML=myAccount; 
		    var mainSpan1=document.getElementById('lclbtnbk')
			if(mainSpan1){
				var text1 = document.createTextNode('\u{A0}');
				var text2 = document.createTextNode('\u{A0}');
				var text3 = document.createTextNode('\u{A0}');
				var text4 = document.createTextNode('\u{A0}');
				var text5 = document.createTextNode('\u{A0}');
				var orpButton1=document.createElement("input");		   //搜尋
				orpButton1.setAttribute("type","button");
				orpButton1.setAttribute("class","btn");
				orpButton1.setAttribute("value","\u{1F50E}");  
				orpButton1.setAttribute("title","搜尋紀錄，快速鍵Alt+L");
				orpButton1.setAttribute("accesskey","L");					
				orpButton1.id="SEEK_BOTT";		 
				attachEventListener(orpButton1,"click",seekrec,false); 
				mainSpan1.appendChild(text1);
				mainSpan1.appendChild(orpButton1);
				var cokath1=Cookies.get('auth01');
				
				if (cokath1!='E'){                  //新增			 
					var orpButton2=document.createElement("input");		   
					orpButton2.setAttribute("type","button");
					orpButton2.setAttribute("class","btn");
					orpButton2.setAttribute("value","\u{1F4DD}");   
					orpButton2.setAttribute("title","新增一筆紀錄，快速鍵Alt+N");
					orpButton2.setAttribute("accesskey","N");	              			
					orpButton2.id="NEW_BOTT";						                 				    
					mainSpan1.appendChild(text2);
					mainSpan1.appendChild(orpButton2);
					if(cokath1=='N'){
					   orpButton2.setAttribute("style","display:none;");
					}else{
						attachEventListener(orpButton2,"click",addrec,false);  //新增紀錄按鈕程序
					}   
				}
				
				var cokath2=Cookies.get('auth02');
				
				if (cokath2!=='E'){			 
					var orpButton3=document.createElement("input");		   
					orpButton3.setAttribute("type","button");
					orpButton3.setAttribute("class","btn");
					orpButton3.setAttribute("value","\u{270D}");    		//1F58E	   270D
					orpButton3.setAttribute("title","修改所選紀錄，快速鍵Alt+U");
					orpButton3.setAttribute("accesskey","U");					
					orpButton3.id="EDIT_BOTT";											    
					mainSpan1.appendChild(text3);
					mainSpan1.appendChild(orpButton3);
					if(cokath2=='N'){
					   orpButton3.setAttribute("style","display:none;");
					}else{
						attachEventListener(orpButton3,"click",edtrec,false);  //修改紀錄按鈕程序
					}					
				}
				
				var cokath3=Cookies.get('auth03');
				if (cokath3!='E'){			
					var orpButton4=document.createElement("input");		   
					orpButton4.setAttribute("type","button");
					orpButton4.setAttribute("class","btn");
					orpButton4.setAttribute("value","\u{274C}");      
					orpButton4.setAttribute("title","刪除所選紀錄，快速鍵Alt+R");  
					orpButton4.setAttribute("accesskey","R");					
					orpButton4.id="DEL_BOTT";											   					
					mainSpan1.appendChild(text4);
					mainSpan1.appendChild(orpButton4);
					mainSpan1.appendChild(text5);			
					if(cokath3=='N'){
					   orpButton4.setAttribute("style","display:none;");
					}else{
						attachEventListener(orpButton4,"click",delrec,false);  //刪除紀錄按鈕程序
					}
				}			
			}
			var maindiv=getElementsByAttribute('class','tab_css');
			if(maindiv){
				var orpButton5=document.createElement("input");		   
				orpButton5.setAttribute("type","button");
				orpButton5.setAttribute("class","btn");		       
				orpButton5.setAttribute("value","\u{1F519}");		 //\u{1F3C3}
				orpButton5.setAttribute("style","font-size:130%;margin:0px;");		                	
				orpButton5.setAttribute("title","離開本作業，快速鍵Alt+Q");
				orpButton5.setAttribute("accesskey","Q");					        			
				orpButton5.id="lgt";		
				attachEventListener(orpButton5,"click",outprocs,false);  //登出按鈕程序
				maindiv[0].appendChild(orpButton5);			
			}
			var tab2Click=document.getElementById("tab2");
			if(tab2Click){			 
				var initTab2FirstNode=(contentdiv[1].firstChild);
					var pageUpButton=document.createElement("input");		   
					pageUpButton.setAttribute("type","button");
					pageUpButton.setAttribute("class","btn");
					pageUpButton.setAttribute("value","\u{25B2}");    
					pageUpButton.setAttribute("style","font-size:16px;");
					pageUpButton.setAttribute("title","表頭上一筆，表身上一頁，快速鍵 Alt+I");
					pageUpButton.setAttribute("accesskey","I");					
					pageUpButton.id="previousPage1";		
					attachEventListener(pageUpButton,"click",HeadPageChange,false);
					var text6 = document.createTextNode('\u{A0}');
					var pageDownButton=document.createElement("input");		   
					pageDownButton.setAttribute("type","button");
					pageDownButton.setAttribute("class","btn");
					pageDownButton.setAttribute("value","\u{25BC}");    
					pageDownButton.setAttribute("style","font-size:16px;");
					pageDownButton.setAttribute("title","表頭下一筆，表身下一頁，快速鍵 Alt+M");
					pageDownButton.setAttribute("accesskey","M");					
					pageDownButton.id="nextPage1";		
					attachEventListener(pageDownButton,"click",HeadPageChange,false);
					contentdiv[1].insertBefore(pageUpButton, initTab2FirstNode);
					contentdiv[1].insertBefore(text6, initTab2FirstNode);
					contentdiv[1].insertBefore(pageDownButton, initTab2FirstNode);
			} 
			var tab3Click=document.getElementById("tab3");
			if(tab3Click){	     
			   var initTab3FirstNode=(contentdiv[2].firstChild);
					var pageUpButton2=document.createElement("input");		   
					pageUpButton2.setAttribute("type","button");
					pageUpButton2.setAttribute("class","btn");
					pageUpButton2.setAttribute("value","\u{25B2}");    
					pageUpButton2.setAttribute("style","font-size:16px;");
					pageUpButton2.setAttribute("title","表頭上一筆，表身上一頁，快速鍵 Alt+I");
					pageUpButton2.setAttribute("accesskey","I");					
					pageUpButton2.id="previousPage2";		
					attachEventListener(pageUpButton2,"click",HeadPageChange,false);
					var text7 = document.createTextNode('\u{A0}');
					var pageDownButton2=document.createElement("input");		   
					pageDownButton2.setAttribute("type","button");
					pageDownButton2.setAttribute("class","btn");
					pageDownButton2.setAttribute("value","\u{25BC}");    
					pageDownButton2.setAttribute("style","font-size:16px;");
					pageDownButton2.setAttribute("title","表頭下一筆，表身下一頁，快速鍵 Alt+M");
					pageDownButton2.setAttribute("accesskey","M");					
					pageDownButton2.id="nextPage2";		
					attachEventListener(pageDownButton2,"click",HeadPageChange,false);
					contentdiv[2].insertBefore(pageUpButton2, initTab3FirstNode);
					contentdiv[2].insertBefore(text7, initTab3FirstNode);
					contentdiv[2].insertBefore(pageDownButton2, initTab3FirstNode);
			} 			
			 var seekrcd=document.getElementById("SEEK_BOTT");
			 if(seekrcd){
				attachEventListener(seekrcd,"click",seekrec,false);  //搜尋按鈕
			 }		 
		}else{  
		     var tabcsses=getElementsByAttribute('class','tab_css');	
			 for(var i=0;i<tabcsses.length;i++){
			    tabcsses[i].style.display='none';
			 }
			 var links=document.getElementsByTagName('link');
			 links[0].href="RED/REDmenu.css?v=1.1.8";			 			 
			 links[1].href="digits/CYC25.gif";
			nowExcute='RED.知訊數位營運管理系統';
			document.getElementsByTagName('title').innerHTML=nowExcute;			 
		}
		var jsvsn=nwsd.toString()+(document.getElementById('currentTime').innerHTML.substr(-2)).toString();
		var urljsname=nowExcute.substr(0,3)+'/'+nowExcute.substr(0,3)+'psdchg.js?v='+jsvsn;		 
        loadScript(urljsname,function(){selfTag(jsvsn);});  		
	}
}

function chooserc(event){   //初始或直接跳該筆	   從 1 開始計數!!!
    if(!isNaN(event)){  //初始畫面呼叫      	  
	    var recNo=event;	  
	    if(cko[1](0)>0){   //如果為開窗畫面選擇紀錄
		    switch (cko[1](0)){
		        case 1:
	                  var maintable=document.getElementById("stuffTbody"); //開窗選擇人員
			          break;
			    case 2:  
			          var maintable=document.getElementById("custTbody");  //開窗選擇客戶
			          break;
			    case 3:  
			          var maintable=document.getElementById("stockTbody"); //開窗選擇料號 
			          break;	  
			    case 4:  
			          var maintable=document.getElementById("vendTbody"); //開窗選擇廠商
			          break;
				case 5:  
			          var maintable=document.getElementById("deptTbody"); //開窗選擇部門
			          break;	    
				case 6:  
			          var maintable=document.getElementById("prgTbody"); //開窗選擇程式
			          break;	 	  
			   default:			
		    } 
	    }else{		   	
		    var tabs=getElementsByAttribute('class','tab');
	        if (tabs[0].checked){
	            var maintable=document.getElementById("maintbody1");	        	  
	        }else if(tabs[1].checked){
			    var maintable=document.getElementById("maintbody2");
		    }else if(tabs[2].checked){
			    var maintable=document.getElementById("maintbody3");
		    }				
	    }	  
	    if(recNo>0){  
	       var targetA=maintable.rows[recNo-1].cells[maintable.rows[recNo-1].cells.length-1].childNodes[0];	  	  
	       targetA.checked=true;	  
		}	 		    
    }else{
        if (typeof event=="undefined")
	   {
		  event=window.event;
	   }	 
   	   var targetA=getEventTarget(event);
    } 
	var chsntail=0;		 
    var tables=getElementsByAttribute("class","gridlist");		
    var targetG=targetA.parentNode.parentNode.parentNode.parentNode;       
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
		var recChecked=document.getElementsByName("chkbx"+targetG.id );    //尋找 
		for(var i=0;i<recChecked.length;i++){
			if(recChecked[i].parentNode.parentNode.firstChild.textContent!=targetTrChildren[0].textContent){
				 if (recChecked[i].checked){						
					recChecked[i].checked=false;					 
					  cko[chsntail+2](-1);					     						
					recChecked[i].parentNode.parentNode.style.backgroundColor="";					 
				 }
			 }
		}	 	 
		 targetTr.style.backgroundColor="#B9B9FF";	 
		 cko[chsntail+2](1);
		if(chsntail==0){			   
		  choseExtraDeal(targetTrChildren,targetTr);  //跳回所屬子程式處理特有程序(表頭)			   
		}else{
			choseSecond(targetTrChildren,targetTr);
		}
		var responseDiv=document.getElementById("serverResponse"+String(chsntail+1));			 
		if (isNaN(event)){
		   responseDiv.innerHTML='&nbsp'; 
		}		
	}else{
		targetTr.style.backgroundColor="";	 
		cko[chsntail+2](-1);	       			
	}
   return true;
}
function rowchoose(event){   //點選列ROW就可以選擇該筆資料
    if (typeof event=="undefined")
	{
		event=window.event;
	}	
 	var target=getEventTarget(event);
	 
    var chsntail=0;
	var targetRow=target.parentNode;
	var targetG=targetRow.parentNode.parentNode;	 
    
	var tables=getElementsByAttribute("class","gridlist");
	for(var i=0;i<tables.length;i++){		
		if(targetG.id==tables[i].id){
			 chsntail=i;
		     break;
		}
	}
	if(targetRow.lastChild.firstChild.checked==false){		     
	    var recChecked=document.getElementsByName("chkbx"+targetG.id );    //尋找表頭
		for(var i=0;i<recChecked.length;i++){
		    if(recChecked[i].parentNode.parentNode.firstChild.textContent!=targetRow.firstChild.textContent){
			    if (recChecked[i].checked){
				    recChecked[i].checked=false;				
				    cko[chsntail+2](-1);				
				    recChecked[i].parentNode.parentNode.style.backgroundColor="";				
			    }
		    }
	    }		
		targetRow.style.backgroundColor="#B9B9FF";
		targetRow.lastChild.lastChild.checked=true;
		
		if(chsntail==0){		   
		   rowchoseExtraDeal(targetRow);    //跳回所屬子程式處理例外程序(表頭)		
		}else{
			
			rowchoseSecond(targetRow);
		}			
        var responseDiv=document.getElementById("serverResponse"+String(chsntail+1));
		if(responseDiv){
		   responseDiv.innerHTML='&nbsp'; 	 
		}		 
		cko[chsntail+2](1);         
	} 	   
	
	return true;
}

function delConfirm(event){     //確定刪除
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	  
	var mthjudge=Cookies.get("MorP");   //是否為月份檔
	var yesbill=Cookies.get("kindofda");      //是否為單據檔
	var mainrightValue=left(Cookies.get("funNo"),3);
	var ttls=getElementsByAttribute('class','ttl');		//表頭或表身有無總計數字
	var tabs=getElementsByAttribute('class','tab');	 	  
	var tbno=0;
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}				   	 
	if (tbno==0){    //表頭處理		  
		 var url=mainrightValue+"/"+mainrightValue+"del.php?timestamp="+new Date().getTime();	 		
		 //if (mthjudge.innerHTML!='依月份顯示'){    //如果非月份檔
		 if (mthjudge!='M'){    //如果非月份檔
			var sendDeleRec="filename="+sourceAccount('0',tbno);  			//抓紀錄號碼用引號框住0以免被當成false				
		 }else{
			 var sendDeleRec="filename="+sourceAccount(1,tbno);  //抓單據編號 
		 }
	}else if (tbno==1){			   //表身處理
		var url=mainrightValue+"/"+mainrightValue+"bodydel.php?timestamp="+new Date().getTime();	//表身一律抓紀錄號碼
		var sendDeleRec="filename="+sourceAccount('0',tbno);
	}else if (tbno==2){		 
		var url=mainrightValue+"/"+mainrightValue+"hipsdel.php?timestamp="+new Date().getTime();	//表身一律抓紀錄號碼
		var sendDeleRec="filename="+sourceAccount('0',tbno);
	}				
	var rsp="";  		  
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	else if(window.XMLHttpRequest){
	   var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;			
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendDeleRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {     
			rsp=request.responseText;			      
			if(!isNaN(Number(rsp))){  //如果是數字                      				    
				var aWaitDelete=[];		 
				var rowidx=0;
				var currentNo=""; 
				var maintable=document.getElementById("maintbody"+(tbno+1).toString());	
				for(var i=0;i< maintable.rows.length; i++){			 
					if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 
						aWaitDelete.push(maintable.rows[i].cells[0].innerHTML);   //將待刪除資料存入陣列
						currentNo=maintable.rows[i].cells[1].innerHTML;    //將待刪號碼記起來 						
						if(ttls.length>0){  //如果表頭或表身有計算總額
						   calculateTtl(tbno,maintable,i);  //計算金額或筆數
						}   
						maintable.deleteRow(i);			
						rowidx=i;							
						i--;    //刪除一筆後記得把列數減一	       							
						cko[tbno+2](-1);		
						break;							
					}
				} 
				if (tbno==0){				
					var mainrightvalue=mainrightValue.toLowerCase() ;
					var valueshows=document.getElementsByName(mainrightValue+"value");  
					if(valueshows.length>0){                     //如果是主檔首頁
						for(var p=0;p<valueshows.length;p++){    //清空頁面資料
							valueshows[p].innerHTML="";
						}
					}						////
					var responseDiv=document.getElementById("serverResponse1");	 		   	           							       
					 ////  非月份單據檔						
					//if (mthjudge.innerHTML!='依月份顯示'){    //如果非月份檔 
					if (mthjudge!='M'){    //如果非月份檔 
						cko[0](-1);    //閉包記錄變數減一筆
						var ckrcd=parseInt(Cookies.get('INT_RCD'));
						var slt2=document.getElementById('recmth');	
						var pagecount=Math.ceil(cko[0](0)/ckrcd);
						if(slt2.options.length>pagecount){		//檢查頁數是否該減少.
							var lastvalue=parseInt(slt2.value-1);						  
							var optdigts=slt2.value.length;						
							slt2.options.remove(slt2.options.length-1);	
							if (lastvalue>0){
								choiceClick(paddingLeft(String(lastvalue),optdigts));
							}else{
							   choiceClick('001');
							}
						}else{
							var mbody=document.getElementById('maintbody1');
							if (mbody.rows.length>0){							 
								if (rowidx<mbody.rows.length){									
								    chooserc(rowidx+1);
								}else{									
									 chooserc(mbody.rows.length);
								}						      					    
							}      
						}  
					}else{    //月份檔
						  var mbody=document.getElementById('maintbody1');
						  if (mbody.rows.length>0){							 
							 if (rowidx<mbody.rows.length){								
								chooserc(rowidx+1);
							 }else{								
								chooserc(mbody.rows.length);
							 }						      					    
						  }  
					}							
					if(yesbill=='R'){   //如果為單據檔				
					   billNoReCreate(currentNo);  //刪除號碼丟到暫存檔
					}  
				}else{					 //第二頁以後的(含第二頁)
					var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString()); 
					var mbody=document.getElementById("maintbody"+(tbno+1).toString());		
                  			
					if (mbody.rows.length>0){							 
						if (rowidx<mbody.rows.length){							
							chooserc(rowidx+1);
						}else{							
							chooserc(mbody.rows.length);
						}						      					    
					}  					   
				}
				responseDiv.setAttribute("style","font-weight:bold;color:#536a60;"); 
				responseDiv.innerHTML="所勾選紀錄已刪除完畢....."; 						       					   
				blocksclose();  //關掉原視窗
			}else{
				 blkshow(rsp);	
			}              		  
		}
	}
}

function rollChange(event){    //按鈕翻頁
	 if (typeof event=="undefined"){
		event=window.event;		
     }
	 target=getEventTarget(event);	 
     var crntrec=0;	 
	 var slt2=document.getElementById('recmth');	
	 switch (target.id){
		 case 'TopPage':
		      crntrec=0;
		      break;
		 case 'BottomPage':		      
			   crntrec=slt2.length-1;
		      break;
		 case 'LastPage':
		       crntrec=slt2.value-2;
				if(crntrec<0){
					blkshow('已到第一頁');	
				    
				   crntrec=0;
				   return ;
				}
		      break;
		 case 'AfterPage':
			   crntrec=slt2.value*1;
			   if(crntrec==slt2.length){				  
				   blkshow('已到最後一頁');					    
				  crntrec=slt2.value*1-1;				  
				  return ;
			   }
			   break;
	     default:
			   crntrec=0;
	 }
	   //if(crntrec>0){
	      slt2.options[crntrec].selected=true;
		  choiceClick(slt2.value);
      // } 
       	 
	
}

