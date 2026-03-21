addLoadListener(initDialog);
var cko=[];  //利用閉包函數當計數器
for (var i=0;i<7;i++){
    cko[i] = chkCount();
}
//cko[0]    此處紀錄首頁資料庫目前筆數，如果是月份單據類則紀錄是否已結轉
//cko[1]    判斷現在開窗中的gridlist
//cko[2]    首頁選擇計數(gridlist)
//cko[3]    次頁選擇計數(gridlist)
//cko[4]    第三頁選擇計數(gridlist)
//cko[5]    第四頁選擇計數(gridlist)
//cko[6]    畫面主搜尋(也只有一個)功能目前鍵值紀錄指向計數 
 
var getAuth=[];  //利用閉包函數當權限設定與其他系統參數紀錄器 var getAuth=[]; 
getAuth[0] = createArrayClosure();
//getAuth[0]()[0]    功能代號與名稱
//getAuth[0]()[1]    新增
//getAuth[0]()[2]    修改
//getAuth[0]()[3]    刪除
//getAuth[0]()[4]    列印
//getAuth[0]()[5]    附加權限一
//getAuth[0]()[6]    附加權限二
//getAuth[0]()[7]    附加權限三
//getAuth[0]()[8]    附加權限四
//getAuth[0]()[9]    附加權限五
////[10]~[13]平時儲存在a03.F03
//getAuth[0]()[10] :   功能頁面數
//getAuth[0]()[11] :   M首頁為月份分頁，P則為固定筆數(視參數INT_RCD設定)分頁,
//getAuth[0]()[12] :   類別，M為主檔或首頁有左右TABLE，R為單據，B為基本資料，A為分析資料，S為系統檔
//getAuth[0]()[13] :  首頁分頁為月份外判斷是否多加部門別分頁->D:多加部門別下拉選項	
//getAuth[0]()[14] :  第一頁頁籤名
//getAuth[0]()[15] :  第二頁頁籤名
//getAuth[0]()[16] :  第三頁頁籤名
getAuth[1] = createArrayClosure();	 //帳號與上次執行功能
getAuth[2] = createArrayClosure();	 //不列入COOKIE之系統參數
getAuth[3] = createArrayClosure();	 //各系統參數之屬性
function initDialog()
{       
    var btmshowtme=document.getElementById('currentTime'); 
	var ftbtm=document.getElementById("footbottom");
	var scnd=btmshowtme.textContent.substr(-2);
	var mnte=btmshowtme.textContent.substr(-5,2); 
    var loginform=document.getElementById('login');
    var divcontainer=document.getElementById('container');		
	var tabcsses=document.getElementsByClassName("tab_css");
	var links=document.getElementsByTagName('link');  	
	var myAccount=(getCookie('useraccount')?getCookie('useraccount'):getAuth[1]()[0] );
	if(!myAccount && getAuth[1]().length==0){    //如果沒有從登入畫面進來則必無登入帳號	   
	    btmshowtme.style.display="none";
		if(divcontainer){
		   divcontainer.parentNode.removeChild(divcontainer);
		}
		for(var i=0;i<tabcsses.length;i++){
			tabcsses[i].parentNode.removeChild(tabcsses[i]);			
		}					    	  		 
	 
		
		if (img1 && img2 && img3 && img4 ) {
			
			for (var i = 1; i <= 4; i++) {
                 var img = document.getElementById('img' + i);
                 if (img) {
                     img.style.cursor = 'pointer'; // 讓滑鼠移上去顯示手型
                     img.title = '看不清楚？可再點擊換一組'; // 增加提示文字
                    
					 attachEventListener(img,"click",refreshCaptcha,false);
                }
            }
			
           // 呼叫我們定義的刷新函式
           refreshCaptcha();
        }
		
		var errMsg = getCookie('errmsg');
		if (errMsg) {
			// 1. 自動填回之前輸入的帳密
			document.getElementById('account').value = getCookie('tmpacnt');
			document.getElementById('password').value = getCookie('tmppswd');
            
			// 2. 判斷錯誤類型
			if (errMsg == 'A1') {
				blkshow("帳號或密碼錯誤");
			} else if (errMsg == 'A2') {
				blkshow("驗證碼錯誤");
			} else {
				// A3: 重複登入處理
				blkshow("同一瀏覽器重複登入系統");
				// 移除驗證碼圖片
				for (let i = 1; i <= 4; i++) {
					let img = document.getElementById('img' + i);
					if (img) img.remove();
				}
				
				// 延遲跳轉至登出頁面清空狀態
				setTimeout(function() {
					document.location.href = "logOut.php";
				}, 2000); 
			}

			// 3. 重要：驗證失敗後，務必重新產生一組驗證碼圖片
			if (typeof refreshCaptcha === 'function' && errMsg !== 'A3') {
				refreshCaptcha();
			}

			// 4. 清除錯誤記錄 Cookie
			delCookie('errmsg');
			delCookie('tmpacnt');
			delCookie('tmppswd');
		} else {
			// 正常載入：綁定提交按鈕事件
			var sbmtclk = document.getElementById('submit');
			if (sbmtclk) {
				attachEventListener(sbmtclk, "click", clrinpt, false);
			}
		}
		
    }else{		
		var nwdt=new Date();	
		var nwsd=Math.floor(Math.random()*nwdt.getSeconds())%26;				
		var nowExcute=getAuth[0]()[0];   //getCookie("funNo");欲執行之功能編號
		var jsvsn=nwsd.toString()+scnd;		
		/* var showTime=document.getElementById('currentTime');
		var jsvsn=(showTime.textContent.substring(0,4)+'_'+showTime.textContent.substring(5,7)+'_'+showTime.textContent.substring(8,10));//+'_'+getAuth[1]()[0];
		 */
		if(nowExcute){	         
		    if(divcontainer){
			   divcontainer.parentNode.removeChild(divcontainer);		
		    }
			if(loginform){
			   loginform.parentNode.removeChild(loginform);
			}			 					
			 links[0].href="include/Operate.css?v=0.1.3" ;						 
			 var gifarray=['ROL','puto','0','cell','1','birthdaycake','2','spec','3','stckgood','S02',
			 '4','cddisk','5','smlbulb','6','myrndm','7','S03','openfile','8','penandrule','9','S04','calculator','foreignermoney']; 			
			 links[1].href="digits/"+gifarray[nwsd]+".gif";			
			 
			 
			var urlfolder=document.getElementsByTagName('title');
			urlfolder[0].textContent=nowExcute; 				     
			 btmshowtme.style.display="inline-block";		
			
			var pages=getAuth[0]()[10];
			var tabCss=document.createElement("div");						 
			tabCss.className="tab_css";
  			var bckgdColor=["background-color:#FCFCFC;","background-color:#F9FAD9;","background-color:#F3F3FA;"];
		    for (var i=0;i<pages;i++){
		        var bsechkbx=document.createElement('input'); 
		        bsechkbx.type='radio';		       
		        bsechkbx.setAttribute('name','tab');		
				bsechkbx.setAttribute('class','tab');
				bsechkbx.id='tab'+String(i+1);							
		        var basechklbl=document.createElement('label'); 
		        basechklbl.setAttribute('name','tablbl');					
		        basechklbl.setAttribute('for',bsechkbx.id);
				basechklbl.setAttribute('title',`跳至第${String(i+1)}頁，快速鍵Alt+${String(i+1)}`);
		        basechklbl.innerHTML=getAuth[0]()[14+i];    		//直接抓閉包變數裡的頁籤名	 				   
				if (i==0){   //預設值
					bsechkbx.checked='checked';
			    }				
				var tabContent=document.createElement("div");			 
				tabContent.setAttribute("class","tab_content");
				tabContent.setAttribute("style",bckgdColor[i]);
				var srvrSpnse=document.createElement("div");
				srvrSpnse.id="serverResponse"+(i+1).toString();
				srvrSpnse.setAttribute("style","color:red;text-align:center;");
				srvrSpnse.innerHTML='&nbsp';							 
				var lastLevelDiv=document.createElement("div");				 
				lastLevelDiv.setAttribute("class","table_cover");				  			    
				var tbleCntnt=document.createElement("table");    //一頁一基本TABLE
				tbleCntnt.id="member"+(i+1).toString();
				tbleCntnt.setAttribute("class","gridlist");				 
				var ctHead=document.createElement("thead");
				ctHead.id="mainthead"+(i+1).toString();
				var headRow=document.createElement("tr");
				headRow.id="headrow"+(i+1).toString();
				ctHead.appendChild(headRow);
				var ctBody=document.createElement("tbody");
				ctBody.id="maintbody"+(i+1).toString();
				tbleCntnt.appendChild(ctHead);
				tbleCntnt.appendChild(ctBody);				
				var text25 = document.createTextNode('\u{A0}\u{A0}\u{A0}');	
				if(i>0){				  
				   var keyName=document.createElement("span");
				   keyName.setAttribute("name","keyname");
				   keyName.setAttribute("class","tabCntntSpan");				   
				   var marklight=document.createElement("mark");
				   marklight.setAttribute("style","background-color:#BAF4D8;");
				   var father=document.createElement("span");
				   father.setAttribute("name","fatherkey");
				   father.setAttribute("class","tabCntntSpan");
				   father.id="fatherkey"+(i).toString();
				   marklight.appendChild(father);
				   var keydscrpt=document.createElement("span");
				   keydscrpt.setAttribute("class","tabCntntSpan");
				   keydscrpt.id="keydscrpt"+(i).toString();
				   tabContent.appendChild(keyName);
				   tabContent.appendChild(marklight);
				   tabContent.appendChild(text25);
				   tabContent.appendChild(keydscrpt);
				}				
				tabContent.appendChild(srvrSpnse); 
				lastLevelDiv.appendChild(tbleCntnt);				    
				tabContent.appendChild(lastLevelDiv);
				tabCss.appendChild(bsechkbx);
				tabCss.appendChild(basechklbl);
				tabCss.appendChild(tabContent);
	        } 
            var lclBtnBk=document.createElement("span");		
			lclBtnBk.id="lclbtnbk";
			lclBtnBk.className="lclbtnbk";			 
			tabCss.appendChild(lclBtnBk);
			var text26=document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');	
			tabCss.appendChild(text26);
			var text27=document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}'); 
			document.body.insertBefore(tabCss,ftbtm);
			 tabCss.insertBefore(text27,lclBtnBk);		
						 
			document.querySelectorAll("script[id]").forEach(s=>s.remove());	
			var mthjudge=getAuth[0]()[11];//判斷是否為月份檔
			
			var contentdiv=document.getElementsByClassName("tab_content");			
			if(!(contentdiv[0])){   //如果同時觸發兩隻程式引發記憶體錯亂,強制中斷以第一隻程式為準,重來一次			    							
			    tabCss.parentNode.removeChild(tabCss);				        
				RecoverArg(left(nowExcute,3));	
			}else{
				var initFirstNode=(contentdiv[0].firstChild);
				const frag = document.createDocumentFragment();
				if (mthjudge!='M'){    //如果非月份檔	 
					if(contentdiv){
						var initFirstNode=(contentdiv[0].firstChild);						 
						var pageTopButton=document.createElement("input");		   
						pageTopButton.type="button";
						pageTopButton.className="btn";
						pageTopButton.value="\u{23EE}";   
						pageTopButton.title="到首頁，快速鍵 Alt+T";
						pageTopButton.accessKey="T";					
						pageTopButton.id="TopPage";		
						attachEventListener(pageTopButton,"click",rollChange,false);  //在第一頁點 << 形按鈕(第一張)
						var pageLastButton=document.createElement("input");		   
						pageLastButton.type="button";
						pageLastButton.className="btn";
						pageLastButton.value="\u{25C0}";  
						pageLastButton.title="到到上頁，快速鍵 Alt+J"; 
						pageLastButton.accessKey="J";					
						pageLastButton.id="LastPage";	
						attachEventListener(pageLastButton,"click",rollChange,false);  //在第一頁點 < 形按鈕(上一張)
						var text1 = document.createTextNode('\u{A0}\u{00A0}第\u{A0}');				
						var sltPage=document.createElement("select");
						sltPage.id="recmth";
						var text2 = document.createTextNode('\u{A0}頁\u{A0}\u{A0}');
						var text3 = document.createTextNode('\u{A0}');
						var text4 = document.createTextNode('\u{A0}');
						var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
						var pageNextButton=document.createElement("input");		   
						pageNextButton.type="button";
						pageNextButton.className="btn";
						pageNextButton.value="\u{25B6}";    
						pageNextButton.title="到下頁，快速鍵 Alt+K";   
						pageNextButton.accessKey="K";					
						pageNextButton.id="AfterPage";	   
						attachEventListener(pageNextButton,"click",rollChange,false);  //在第一頁點 > 形按鈕(下一張)
						var pageBottomButton=document.createElement("input");		   
						pageBottomButton.type="button";
						pageBottomButton.className="btn";
						pageBottomButton.value="\u{23ED}";   
						pageBottomButton.title="到末頁，快速鍵 Alt+V";
						pageBottomButton.accessKey="V";					
						pageBottomButton.id="BottomPage";	   
						attachEventListener(pageBottomButton,"click",rollChange,false);  //在第一頁點 >> 形按鈕(最後一張)						
						
						frag.appendChild(pageTopButton);
						frag.appendChild(text3);
						frag.appendChild(pageLastButton);
						frag.appendChild(text1);
						frag.appendChild(sltPage);
						frag.appendChild(text2);
						frag.appendChild(pageNextButton);
						frag.appendChild(text4);
						frag.appendChild(pageBottomButton);
						contentdiv[0].insertBefore(frag, initFirstNode);
					}
				}else{                                                   //月份檔
				
					var mthspan=document.createElement("span");
					var text1 = document.createTextNode('年月\u{A0}');
					mthspan.appendChild(text1);
					
					mthspan.style.fontSize="120%;";
					var sltPage=document.createElement("select");
					sltPage.id="recmth";
					var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
					frag.appendChild(mthspan);
					frag.appendChild(sltPage);
					frag.appendChild(text5);
					contentdiv[0].insertBefore(frag, initFirstNode); 
				}			 
				if(ftbtm.childNodes.length<4){
				   var urlcmp=(decodeURI(window.location.search));			
				   var rslt=getUrlParams2(urlcmp);
				   var text9 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}登入者:');
				    var text10=document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}目前作業:');
				   var username=document.createElement("span");	
				   var crntopr=document.createElement("span");
				   crntopr.textContent=nowExcute;
				   username.textContent=rslt.username;		   
				   ftbtm.appendChild(text9);
				   ftbtm.appendChild(username); 
				   ftbtm.appendChild(text10);
				   ftbtm.appendChild(crntopr);
				}
				var mainSpan1=document.getElementById('lclbtnbk')
				if(mainSpan1){
					var text1 = document.createTextNode('\u{A0}');
					var text2 = document.createTextNode('\u{A0}');
					var text3 = document.createTextNode('\u{A0}');
					var text4 = document.createTextNode('\u{A0}');
					var text5 = document.createTextNode('\u{A0}');
					var orpButton1=document.createElement("input");		   //搜尋
					orpButton1.type="button";
					orpButton1.className="btn";
					orpButton1.value="\u{1F50E}";  
					orpButton1.title="搜尋紀錄，快速鍵Alt+L";
					orpButton1.accessKey="L";					
					orpButton1.id="SEEK_BOTT";		 
					attachEventListener(orpButton1,"click",seekrec,false); 
					mainSpan1.appendChild(text1);
					mainSpan1.appendChild(orpButton1);
					var cokath1=getAuth[0]()[1]; //getCookie('auth01');					
					if (cokath1!='E'){                  //新增			 
						var orpButton2=document.createElement("input");		   
						orpButton2.type="button";
						orpButton2.className="btn";
						orpButton2.value="\u{1F4DD}";   
						orpButton2.title="新增一筆紀錄，快速鍵Alt+N";
						orpButton2.accessKey="N";	              			
						orpButton2.id="NEW_BOTT";						                 				    
						mainSpan1.appendChild(text2);
						mainSpan1.appendChild(orpButton2);
						if(cokath1=='N'){
						   orpButton2.style.display="none";
						}else{
							attachEventListener(orpButton2,"click",addrec,false);  //新增紀錄按鈕程序
						}   
					}						
					var cokath2=getAuth[0]()[2]; //getCookie('auth02');				
					if (cokath2!=='E'){			 
						var orpButton3=document.createElement("input");		   
						orpButton3.type="button";
						orpButton3.className="btn";
						orpButton3.value="\u{270D}";    		//1F58E	   270D
						orpButton3.title="修改所選紀錄，快速鍵Alt+U";
						orpButton3.accessKey="U";					
						orpButton3.id="EDIT_BOTT";											    
						mainSpan1.appendChild(text3);
						mainSpan1.appendChild(orpButton3);
						if(cokath2=='N'){
						   orpButton3.style.display="none";
						}else{
							attachEventListener(orpButton3,"click",edtrec,false);  //修改紀錄按鈕程序
						}					
					}				
					var cokath3=getAuth[0]()[3];    //getCookie('auth03');
					if (cokath3!='E'){			
						var orpButton4=document.createElement("input");		   
						orpButton4.type="button";
						orpButton4.className="btn";
						orpButton4.value="\u{274C}";      
						orpButton4.title="刪除所選紀錄，快速鍵Alt+R";  
						orpButton4.accessKey="R";					
						orpButton4.id="DEL_BOTT";											   					
						mainSpan1.appendChild(text4);
						mainSpan1.appendChild(orpButton4);
						mainSpan1.appendChild(text5);			
						if(cokath3=='N'){
						   orpButton4.style.display="none";
						}else{
							attachEventListener(orpButton4,"click",delrec,false);  //刪除紀錄按鈕程序
						}
					}			
				}
				
				var maindiv=document.getElementsByClassName("tab_css");
				if(maindiv){
					var orpButton5=document.createElement("input");		   
					orpButton5.type="button";
					orpButton5.className="btn";		       
					orpButton5.value="\u{1F519}";		 //\u{1F3C3}
					orpButton5.setAttribute("style","font-size:130%;margin:0px;");		                	
					orpButton5.title="離開本作業，快速鍵Alt+Q";
					orpButton5.accessKey="Q";					        			
					orpButton5.id="lgt";		
					attachEventListener(orpButton5,"click",outprocs,false);  //登出按鈕程序
					maindiv[0].appendChild(orpButton5);			
				}
				var tab2Click=document.getElementById("tab2");
				if(tab2Click){			 
					var initTab2FirstNode=(contentdiv[1].firstChild);
					var pageUpButton=document.createElement("input");		   
					pageUpButton.type="button";
					pageUpButton.className="btn";
					pageUpButton.value="\u{25B2}";     
					pageUpButton.title="表頭上一筆，表身上一頁，快速鍵 Alt+I";
					pageUpButton.accessKey="I";					
					pageUpButton.id="previousPage1";		
					attachEventListener(pageUpButton,"click",HeadPageChange,false);
					var text6 = document.createTextNode('\u{A0}');					
					var pageDownButton=document.createElement("input");		   
					pageDownButton.type="button";
					pageDownButton.className="btn";
					pageDownButton.value="\u{25BC}";     					
					pageDownButton.title="表頭下一筆，表身下一頁，快速鍵 Alt+M";
					pageDownButton.accessKey="M";					
					pageDownButton.id="nextPage1";		
					attachEventListener(pageDownButton,"click",HeadPageChange,false);
					var text8 = document.createTextNode('\u{A0}');	
					  const frag2 = document.createDocumentFragment();
					frag2.appendChild(pageUpButton);
					frag2.appendChild(text6);
					frag2.appendChild(pageDownButton);
					frag2.appendChild(text8); 
					contentdiv[1].insertBefore(frag2, initTab2FirstNode); 
					
				} 
				var tab3Click=document.getElementById("tab3");
				if(tab3Click){	     
					var initTab3FirstNode=(contentdiv[2].firstChild);
					var pageUpButton2=document.createElement("input");		   
					pageUpButton2.type="button";
					pageUpButton2.className="btn";
					pageUpButton2.value="\u{25B2}";    
					pageUpButton2.title="表頭上一筆，表身上一頁，快速鍵 Alt+I";
					pageUpButton2.accessKey="I";					
					pageUpButton2.id="previousPage2";		
					attachEventListener(pageUpButton2,"click",HeadPageChange,false);
					const frag3 = document.createDocumentFragment();
					var text7 = document.createTextNode('\u{A0}');
					var pageDownButton2=document.createElement("input");		   
					pageDownButton2.type="button";
					pageDownButton2.className="btn";
					pageDownButton2.value="\u{25BC}";    
					pageDownButton2.title="表頭下一筆，表身下一頁，快速鍵 Alt+M";
					pageDownButton2.accessKey="M";					
					pageDownButton2.id="nextPage2";		
					attachEventListener(pageDownButton2,"click",HeadPageChange,false);
					var text10 = document.createTextNode('\u{A0}');	
					frag3.appendChild(pageUpButton2);
					frag3.appendChild(text7);
					frag3.appendChild(pageDownButton2);
					frag3.appendChild(text10);
					contentdiv[2].insertBefore(frag3, initTab3FirstNode);
				} 			
				 var seekrcd=document.getElementById("SEEK_BOTT");
				 if(seekrcd){
					attachEventListener(seekrcd,"click",seekrec,false);  //搜尋按鈕
				 }	
		    }	 
		}else{               	           
			 if(loginform){
			    loginform.parentNode.removeChild(loginform);
		     }
			 for(var i=0;i<tabcsses.length;i++){
				tabcsses[i].parentNode.removeChild(tabcsses[i]);
				
			 }	
			  btmshowtme.style.display="none";
		     var ftchlds=ftbtm.childNodes;
			 for(var i=ftchlds.length-1;i>2;i--){
			     ftbtm.removeChild(ftchlds[i]);
			}
             var conTainer=document.createElement("div");
			 conTainer.id="container";
			 var heaDer=document.createElement("header");
			 var menucoverdiv=document.createElement("div");
			 menucoverdiv.style.float='left';
			 var extenbtn=document.createElement("button");
			 extenbtn.id='menudivbtn';
			 extenbtn.className='btn';
			 extenbtn.setAttribute("style","border-style:none;background-color:transparent;text-decoration: none; cursor: pointer;");
			 extenbtn.title="開啟或隱藏主選單 Alt+V";
			 extenbtn.accessKey="V";		
			var btnimg = document.createElement('img');
			 btnimg.id='menubtnimg';
			 btnimg.style.width='12px';
			 btnimg.src = 'digits/widget_closed.gif';           
             extenbtn.appendChild(btnimg);						 
			 menucoverdiv.appendChild(extenbtn);
			  heaDer.appendChild(menucoverdiv);
			 var compAnyName=document.createElement("span");
			 compAnyName.id="company_name";			
			 heaDer.appendChild(compAnyName);
			 var logoutdiv=document.createElement("div");
			 logoutdiv.style.float='right';
			 var getoutbtn=document.createElement("button");
			 getoutbtn.id='getOutBtn';
			 getoutbtn.className='close';
			 getoutbtn.setAttribute("style","border-style:none;background-color:transparent;");
			 getoutbtn.title="登出系統，快速鍵 Alt+Q";
			 getoutbtn.accessKey="Q";		
			 var btnoutimg = document.createElement('img');
			  btnoutimg.id='btnoutimg';
			  btnoutimg.style.width='27px';
			  btnoutimg.src = 'digits/backexit.gif';
			  getoutbtn.appendChild(btnoutimg);
			  logoutdiv.appendChild(getoutbtn);
			  heaDer.appendChild(logoutdiv);
			 var navIgatIon=document.createElement("nav");
			 navIgatIon.id="navigation";
			 navIgatIon.className="vertical";			 
			 var ulList=document.createElement("ul");
			 ulList.id= "listUL";
			 navIgatIon.appendChild(ulList);
		     conTainer.appendChild(heaDer);
			 conTainer.appendChild(navIgatIon);			 
			 document.body.appendChild(conTainer);
			 links[0].href="RED/REDmenu.css?v="+jsvsn;		 			 
			 links[1].href="digits/CYC25.gif";
			 nowExcute='RED.知訊數位營運管理系統';			
			 var urlfolder=document.getElementsByTagName('title');
			 urlfolder[0].textContent=nowExcute; 				 			   
		}
		
		document.querySelectorAll("script[id]").forEach(s=>s.remove());	
		
		 
		var urljsname=nowExcute.substr(0,3)+'/JS/'+nowExcute.substr(0,3)+'psdchg.js?v='+jsvsn;		 	
    	loadScript(urljsname,function(){selfTag(jsvsn);});     
	}	
}

function chooserc(event){   //初始或直接跳該筆	   從 1 開始計數!!!
    
    if(!isNaN(event)){  //初始畫面呼叫            
	    var recNo=event;	  
	    if(cko[1](0)>0){   //如果為開窗畫面選擇紀錄		     
	        var maintable=document.getElementById("stuffTbody"); //開窗選取資料			  		     
	    }else{		   	
			var tabs=document.getElementsByClassName("tab");
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
	var tables=document.getElementsByClassName("gridlist");
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
    
	var tables=document.getElementsByClassName("gridlist");
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
	var mthjudge=getAuth[0]()[11];  //getCookie("MorP");   //是否為月份檔
	var yesbill=getAuth[0]()[12];   //getCookie("kindofda");      //是否為單據檔
	var urlfolder=document.getElementsByTagName('title');
	var mainrightValue=urlfolder[0].textContent.slice(0, 3);
	//var ttls=getElementsByAttribute('class','ttl');		//表頭或表身有無總計數字
	var ttls=document.getElementsByClassName('ttl');		//表頭或表身有無總計數字
	var tabs=document.getElementsByClassName('tab');	 	  
	var tbno=0;
	for(var i=0;i<tabs.length;i++){
		if(tabs[i].checked){
			tbno=i;
			break;
		}
	}				   	 
	if (tbno==0){    //表頭處理		  
		 var url=mainrightValue+"/BKND/"+mainrightValue+"del.php?timestamp="+new Date().getTime();	 				
		 if (yesbill!='R'){    //如果非單據檔		 
			var sendDeleRec="filename="+sourceAccount('0',tbno);  			//抓紀錄號碼用引號框住0以免被當成false				
		 }else{
			 var sendDeleRec="filename="+sourceAccount(1,tbno);  //抓單據編號 
		 }
	}else if (tbno==1){			   //表身處理
		var url=mainrightValue+"/BKND/"+mainrightValue+"bodydel.php?timestamp="+new Date().getTime();	//表身一律抓紀錄號碼
		var sendDeleRec="filename="+sourceAccount('0',tbno);
	}else if (tbno==2){		 
		var url=mainrightValue+"/BKND/"+mainrightValue+"hipsdel.php?timestamp="+new Date().getTime();	//表身一律抓紀錄號碼
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
					
						aWaitDelete.push(maintable.rows[i].cells[0].textContent);   //將待刪除資料存入陣列
						currentNo=maintable.rows[i].cells[1].textContent;    //將待刪號碼記起來 						
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
							valueshows[p].textContent="";
						}
					}						////
					var responseDiv=document.getElementById("serverResponse1");	 		   	           							       
					 ////  非月份單據檔						
					if (mthjudge!='M'){    //如果非月份檔 
						cko[0](-1);    //閉包記錄變數減一筆
						var ckrcd= parseInt(getCookie('INT_RCD'));
						var slt2=document.getElementById('recmth');	
						var pagecount=Math.ceil(cko[0](0)/ckrcd);
						if(slt2.options.length>pagecount){		//檢查頁數是否該減少.
							var lastvalue=parseInt(slt2.value-1);						  
							var optdigts=slt2.value.length;						
							slt2.options.remove(slt2.options.length-1);	
							if (lastvalue>0){
								choiceClick(paddingLeft(String(lastvalue),optdigts));
							}else{
							   // 建議這裡除了 choiceClick('001')，可以考慮清空表格標題或顯示「暫無資料」
							   responseDiv.innerHTML="清空表格，暫無資料....."; 	
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
				responseDiv.textContent="所勾選紀錄已刪除完畢....."; 		
				setTimeout(() => { responseDiv.textContent='\u{A0}'; }, 3000);
				blocksclose();  //關掉原視窗
			}else{    //刪除不成功
				 blkshow(rsp);	
				 var rcdindex=sourceAccount(null,0);	
	             var headtable=document.getElementById('maintbody1'); 
				 headtable.rows[rcdindex].cells[headtable.rows[rcdindex].cells.length-3].textContent='Y';
					    for (var i=1;i<headtable.rows[rcdindex].cells.length-3;i++){  //要從編號開始計
		                    headtable.rows[rcdindex].cells[i].style.color="#000";
		                    headtable.rows[rcdindex].cells[i].style.fontWeight="normal";					            
	                    }
				 
				 var ansbtt=document.getElementById("ANS_BOTT");
	             var editbtt=document.getElementById("EDIT_BOTT");
	             var delbtt=document.getElementById("DEL_BOTT");  
				 ansbtt.style.display="none";
				 detachEventListener(ansbtt,"click",ansproc,false);	
				 editbtt.style.visibility="hidden"; 
			     detachEventListener(editbtt,"click",edtrec,false);
				 delbtt.style.visibility="hidden";
				 detachEventListener(delbtt,"click",delrec,false);

				 document.getElementById("serverResponse1").innerHTML="\u{A0}";
				 document.getElementById("serverResponse2").innerHTML="\u{A0}";
				 document.getElementById("serverResponse3").innerHTML="\u{A0}";
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
	      slt2.options[crntrec].selected=true;
		  choiceClick(slt2.value);	
}
function clrinpt(){
	if (typeof event=="undefined"){
		   event=window.event;
    }
	var target=getEventTarget(event);    
	 var i;		 	
         (function myLoop(i) {
             setTimeout(function() {			    
               inptclr(); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 500)
          })(3);                   //  pass the number of iterations as an argument
    //detachEventListener(target,"click",false);
	 
}
function inptclr(){
    document.getElementById('account').value='';			 
	document.getElementById('password').value=''; 
	document.getElementById('validcode').value='';
}


function RecoverArg(arg){	

	var sendSrcRec="filename="+arg+"|"+ getAuth[1]()[0];		
	 
	var rsp="";  	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	       
	var url="ROL/BKND/FunDetail.php?timestamp="+new Date().getTime();			
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {    
			rsp=JSON.parse(request.responseText);					
			if(rsp=="NO"){			  
				   blkshow("您無"+arg+"操作權限");				 
			}else{
				setArg(rsp);
			}   
		}
	}
  
}	

function setArg(arr){
           getAuth[0]('Clear_All');
		 Object.values(arr[0]).forEach(value => {
            
			 getAuth[0](value);   //從這邊加入登入者在arg參數功能權限
			 
        }); 
     getAuth[1]()[1]= getAuth[0]()[0];
	 initDialog();
	 
}	

function fieldsSet(exucPrgNo){	   //剛進操作畫面之欄位設定
    var sendSrcRec="filename="+exucPrgNo.slice(0, 3); 	    
	var rsp="";  	
	
	if(window.ActiveXObject){
	   var request = new ActiveXObject("Microsoft.XMLHttp");
	}	
	   else if(window.XMLHttpRequest){
		  var request = new XMLHttpRequest();
	}			 
	request.onreadystatechange = respond;	   
	var url="include/BKND/pagesFieldsData.php?timestamp="+new Date().getTime();		
	request.open("POST",url);	 
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200){ 
		   
            rsp=JSON.parse(request.responseText);	
			
		     var widthttl=0;
			 var m=0;
			
		    for(var i=0;i<rsp.length;i++){		
			    
			    for(var jk in rsp[i]){	 
				    if(jk=='field_order' && parseInt(left(rsp[i][jk],1))!=m){

						m=parseInt(left(rsp[i][jk], 1));			
						
					    var thr=document.getElementById('headrow'+m.toString());
						 widthttl=0;						
					}
					if(jk=='field_name'){
						var th = document.createElement('th'); //column	
						var text = document.createTextNode(rsp[i][jk]);
					    th.appendChild(text);
				  
					}else if(jk=='width_ratio'){					  
					   th.style.width=rsp[i][jk]+'%';
					   widthttl+=rsp[i][jk]*1;
					}
					if(widthttl>100){
							
						  var oMember=document.getElementById('member'+m.toString());
						   oMember.style.width=widthttl.toString()+'%';
					}
			    }
				thr.appendChild(th);
				 
		    }
            if(m>1){
				
				var keynames=document.getElementsByName('keyname');	
				for(var k=0;k<keynames.length;k++){
	                   keynames[k].textContent=rsp[0]['field_name']+":";
				}
			}   
			 
		}
		return;
	}	
	
}	

// 這是最穩定的版本，能徹底解決 Chrome/Edge 的差異
function refreshCaptcha(event) {
    var ts = new Date().getTime();
    var i1 = document.getElementById('img1');
    var i2 = document.getElementById('img2');
    var i3 = document.getElementById('img3');
    var i4 = document.getElementById('img4');

    if (i1) {
        // 1. 先載入第一張，啟動伺服器 Session 更新
        i1.src = '/kebweige/include/BKND/captcha.php?id=1&t=' + ts;
        
        // 2. 當第一張圖確定「抓到了」，伺服器的答案也就定案了
        i1.onload = function() {
            i1.onload = null; // 避免重複觸發
            if(i2) i2.src = '/kebweige/include/BKND/captcha.php?id=2&t=' + ts;
            if(i3) i3.src = '/kebweige/include/BKND/captcha.php?id=3&t=' + ts;
            if(i4) i4.src = '/kebweige/include/BKND/captcha.php?id=4&t=' + ts;
           
        };
    }

}