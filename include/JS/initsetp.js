addLoadListener(initDialog);
//*************************//
let isInitializing = false;
let isRecovering = false;
//*************************//
var cko=[];  //利用閉包函數當計數器
for (let i=0;i<7;i++){
    cko[i] = chkCount();
}
//var cko = Array.from({ length: 7 }, chkCount);  //利用閉包函數當計數器
//cko[0]    此處紀錄首頁資料庫目前筆數，如果是月份單據類則紀錄是否已結轉
//cko[1]    判斷現在開窗中的gridlist
//cko[2]    首頁選擇計數(gridlist)
//cko[3]    次頁選擇計數(gridlist)
//cko[4]    第三頁選擇計數(gridlist)
//cko[5]    第四頁選擇計數(gridlist)
//cko[6]    紀錄上次搜尋選項的值(上面放大鏡按下去開窗搜尋鍵值),但選項內容如果為是否確?則強制歸零

///////
var getAuth=[];  //利用閉包函數當計數器
for (let j=0;j<8;j++){
    getAuth[j] = createArrayClosure();	 //帳號與上次執行功能
}
//var getAuth = Array.from({ length: 4 }, createArrayClosure);  //利用閉包函數當權限設定與其他系統參數紀錄器 var getAuth=[]; 
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
//getAuth[0]()[13] :  首頁分頁為月份外判斷是否多加部門別或其他類別分頁->D:多加部門別或其他類別下拉選項	
let pageNameIdx=14;//紀錄頁籤名稱之起始陣列索引值
//getAuth[0]()[14] :  第一頁頁籤名
//getAuth[0]()[15] :  第二頁頁籤名
//getAuth[0]()[16] :  第三頁頁籤名
//getAuth[1]  //帳號與上次執行功能
//getAuth[2] 	 //存放從a26資料表中撈出的系統參數
//getAuth[3]()[0] 	 //修改密碼時記錄登入者原密碼與ID 
//getAuth[4] 	 //第一頁搜尋選項
//getAuth[5] 	 //第二頁搜尋選項
//getAuth[6] 	 //第三頁搜尋選項
//getAuth[7]     //紀錄主目錄選項畫面
function initDialog()
{    
//****************************//
    if(isInitializing){
        return;
    }

    isInitializing=true;

    try{
//****************************//    
		var btmshowtme=document.getElementById('currentTime'); 
		var ftbtm=document.getElementById("footbottom");
		var scnd=btmshowtme.textContent.substr(-2);
		var mnte=btmshowtme.textContent.substr(-5,2);    
		var logincontainer=document.getElementById('login-Form');
		var divcontainer=document.getElementById('container');		
		var tabcsses=document.getElementsByClassName("tab_css");
		var links=document.getElementsByTagName('link');  	
		var myAccount=(getCookie('useraccount')?getCookie('useraccount'):getAuth[1]()[0] );
		if(!myAccount && getAuth[1]().length==0){    //如果沒有從登入畫面進來則必無登入帳號
		//if(getAuth[2]().length==0){    //如果沒有從登入畫面進來則必無登入帳號
		   if(divcontainer){
			   divcontainer.parentNode.removeChild(divcontainer);
			}
			for(let i=0;i<tabcsses.length;i++){
				tabcsses[i].parentNode.removeChild(tabcsses[i]);			
			}		
			 links[0].href="include/loginstyle.css?v=0.0.3" ;
			if(!logincontainer){
				var logincontainer = document.createElement("div");				 
				logincontainer.id="login-Form";		
				var footbtm=document.getElementById("footbottom");
				document.body.insertBefore(logincontainer,footbtm);
			}
		   
			btmshowtme.style.display="none";
			var urljsname='include/JS/login.js?v=0.0.3';		 	
			loadScript(urljsname,function(){loginInitForm();});  	
	 
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
									
				if(logincontainer){
				   logincontainer.parentNode.removeChild(logincontainer);
				}
				 links[0].href="include/Operate.css?v=0.1.5" ;						 
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
				for (let i=0;i<pages;i++){
					var bsechkbx=document.createElement('input'); 
					bsechkbx.type='radio';		       
					bsechkbx.setAttribute('name','tab');		
					bsechkbx.setAttribute('class','tab');
					bsechkbx.id='tab'+String(i+1);			
					var basechklbl=document.createElement('label'); 
					basechklbl.setAttribute('name','tablbl');					
					basechklbl.setAttribute('for',bsechkbx.id);
					basechklbl.setAttribute('title',`跳至第${String(i+1)}頁，快速鍵Alt+${String(i+1)}`);
					basechklbl.innerHTML=getAuth[0]()[pageNameIdx+i];    		//直接抓閉包變數裡的頁籤名	 				   
					if (i==0){   //預設值
						bsechkbx.checked='checked';
					}		
					////
					bsechkbx.setAttribute("accesskey",String(i+1));
					////
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
					   marklight.setAttribute("style","background:linear-gradient(to bottom, #B9B9FF 0%, #8E8EFF 100%);");  //8 #E4FAEF linear-gradient(to bottom, #B9B9FF 0%, #8E8EFF 100%)
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
				if(!(contentdiv[0])){   //如果同時觸發兩隻程式引發記憶體錯亂,強制中斷,以第一隻程式為準,重來一次			    																					
					tabCss.parentNode.removeChild(tabCss);                        										
					RecoverArg(left(nowExcute,3)).then(success => success && initDialog());				
				}else{
					var initFirstNode=(contentdiv[0].firstChild);
					const frag = document.createDocumentFragment();
					if (mthjudge!='M'){    //如果非月份檔	 
						if(contentdiv){
							var initFirstNode=(contentdiv[0].firstChild);						 

							var pageTopButton = btnManager.createBtn("TopPage", "\u{23EE}", "到首頁，快速鍵 Alt+T", "T", rollChange);
                            var pageLastButton = btnManager.createBtn("LastPage", "\u{25C0}", "到到上頁，快速鍵 Alt+J", "J", rollChange);
                            var pageNextButton = btnManager.createBtn("AfterPage", "\u{25B6}", "到下頁，快速鍵 Alt+K", "K", rollChange);
                            var pageBottomButton = btnManager.createBtn("BottomPage", "\u{23ED}", "到末頁，快速鍵 Alt+V", "V", rollChange); 
							var text1 = document.createTextNode('\u{A0}\u{00A0}第\u{A0}');				
							var sltPage=document.createElement("select");
							sltPage.id="recmth";
							var text2 = document.createTextNode('\u{A0}頁\u{A0}\u{A0}');
							var text3 = document.createTextNode('\u{A0}');
							var text4 = document.createTextNode('\u{A0}');
							var text5 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
							
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
						var text9 = document.createTextNode('登入者:');
						var text10=document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}目前作業:');
						var text11=document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
						var username=document.createElement("span");	
						var crntopr=document.createElement("span");
						crntopr.textContent=nowExcute;
						username.textContent=rslt.username;
						ftbtm.insertBefore(text9,btmshowtme);
						ftbtm.insertBefore(username,btmshowtme);
						ftbtm.insertBefore(text10,btmshowtme);
						ftbtm.insertBefore(crntopr,btmshowtme);
						ftbtm.insertBefore(text11,btmshowtme);				  
					}
					var mainSpan1=document.getElementById('lclbtnbk')
					if(mainSpan1){
						var text1 = document.createTextNode('\u{A0}');
						var text2 = document.createTextNode('\u{A0}');
						var text3 = document.createTextNode('\u{A0}');
						var text4 = document.createTextNode('\u{A0}');
						var text5 = document.createTextNode('\u{A0}');
						
						var orpButton1 = btnManager.createBtn("SEEK_BOTT", "\u{1F50E}", "搜尋紀錄，快速鍵Alt+L", "L", seekrec);
						mainSpan1.appendChild(text1);
						mainSpan1.appendChild(orpButton1);
						
                        var cokath1 = getAuth[0]()[1];
                        if (cokath1 !== 'E') {
                           var orpButton2 = btnManager.createBtn("NEW_BOTT", "\u{1F4DD}", "新增一筆紀錄，快速鍵Alt+N", "N", cokath1 === 'N' ? null : addrec);
                           if (cokath1 === 'N') orpButton2.style.display = "none";
                           mainSpan1.appendChild(text2);
                           mainSpan1.appendChild(orpButton2);
                        }
						
						
						var cokath2 = getAuth[0]()[2];
                        if (cokath2 !== 'E') {
                            var orpButton3 = btnManager.createBtn("EDIT_BOTT", "\u{270D}", "修改所選紀錄，快速鍵Alt+U", "U", cokath2 === 'N' ? null : edtrec);
                            if (cokath2 === 'N') orpButton3.style.display = "none";
                            mainSpan1.appendChild(text3);
                            mainSpan1.appendChild(orpButton3);
                        }
						
						var cokath3 = getAuth[0]()[3];
						if (cokath3 !== 'E') {
							var orpButton4 = btnManager.createBtn("DEL_BOTT", "\u{274C}", "刪除所選紀錄，快速鍵Alt+R", "R", cokath3 === 'N' ? null : delrec);
							if (cokath3 === 'N') orpButton4.style.display = "none";
							mainSpan1.appendChild(text4);
							mainSpan1.appendChild(orpButton4);
							mainSpan1.appendChild(text5);
						}
					}
					
					var maindiv=document.getElementsByClassName("tab_css");
					if(maindiv){
					
						//const orpButton5 = btnManager.createBtn("lgt", "\u{1F519}", "離開本作業，快速鍵Alt+Q", "Q", outprocs);
						const orpButton5 = btnManager.createBtn("lgt", "\u{1F3E1}", "離開本作業，快速鍵Alt+Q", "Q", outprocs);
						maindiv[0].appendChild(orpButton5);			
					}					
					 addHeadPageButtons(2);  // 原本 tab2Click 那一整段
					 addHeadPageButtons(3);  // 原本 tab3Click 那一整段 
				}	 							
			}else{               	           				 
				 if(logincontainer){
				   logincontainer.parentNode.removeChild(logincontainer);
				}
				for(let i=0;i<tabcsses.length;i++){
					tabcsses[i].parentNode.removeChild(tabcsses[i]);					
				}	
				btmshowtme.style.display="none";
				var ftchlds=ftbtm.childNodes;
				for(let i=ftchlds.length-3;i>0;i--){				
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
				 //links[0].href="RED/REDmenuBAKNEW.css?v="+jsvsn;	
	 			 links[0].href="RED/REDmenu.css?v="+jsvsn;	
				 links[1].href="digits/CYC25.gif";
				 nowExcute='RED.知訊數位營運管理系統';			
				 var urlfolder=document.getElementsByTagName('title');
				 urlfolder[0].textContent=nowExcute; 
				
			}		
			document.querySelectorAll("script[id]").forEach(s=>s.remove());	
			var urljsname=nowExcute.substr(0,3)+'/JS/'+nowExcute.substr(0,3)+'psdchg.js?v='+jsvsn;		 	
			loadScript(urljsname,function(){selfTag(jsvsn,nowExcute.substr(0,3)+'/JS/');});  	
		}	
//****************************//		
	}finally{
        isInitializing=false;
    }	
//****************************//	
}
////// 

function addHeadPageButtons(tabIndex) {
    var tabClick = document.getElementById("tab" + tabIndex);
    if (!tabClick) return;

    var idSuffix = tabIndex - 1;
    var contentdiv = document.getElementsByClassName("tab_content");
    var initFirstNode = contentdiv[tabIndex - 1].firstChild;

    var pageUpButton = btnManager.createBtn(
        "previousPage" + idSuffix,
        "\u{25B2}",
        "表頭上一筆，表身上一頁，快速鍵 Alt+I",
        "I",
        HeadPageChange
    );

    var pageDownButton = btnManager.createBtn(
        "nextPage" + idSuffix,
        "\u{25BC}",
        "表頭下一筆，表身下一頁，快速鍵 Alt+M",
        "M",
        HeadPageChange
    );

    var frag = document.createDocumentFragment();
    frag.appendChild(pageUpButton);
    frag.appendChild(document.createTextNode('\u{A0}'));
    frag.appendChild(pageDownButton);
    frag.appendChild(document.createTextNode('\u{A0}'));

    contentdiv[tabIndex - 1].insertBefore(frag, initFirstNode);
}
function chooserc(event) {
    var targetA;

    if (!isNaN(event)) {
        var recNo = event;
        var maintable;
        if (cko[1](0) > 0) {
            maintable = document.getElementById("stuffTbody");
        } else {
            var tabs = document.getElementsByClassName("tab");
            if (tabs[0].checked) {
                maintable = document.getElementById("maintbody1");
            } else if (tabs[1].checked) {
                maintable = document.getElementById("maintbody2");
            } else if (tabs[2].checked) {
                maintable = document.getElementById("maintbody3");
            }
        }
        if (recNo > 0) {
            var row = maintable.rows[recNo - 1];
            targetA = row.cells[row.cells.length - 1].childNodes[0];
            targetA.checked = true;
        }
    } else {
        event = (typeof event === "undefined") ? window.event : event;
        targetA = getEventTarget(event);
    }

    var targetTr = targetA.parentNode.parentNode;
    var targetG = targetTr.parentNode.parentNode;
    var chsntail = getTableIndex(targetG);

    if (targetA.checked) {
        applySingleSelect(targetTr, targetG, chsntail);
    } else {
        targetTr.style.backgroundColor = "";
        cko[chsntail + 2](-1);
    }
    return true;
}

function rowchoose(event) {
    event = (typeof event === "undefined") ? window.event : event;
    var target = getEventTarget(event);

    var targetTr = target.parentNode;
    var targetG = targetTr.parentNode.parentNode;
    var chsntail = getTableIndex(targetG);

    var checkbox = targetTr.lastChild.lastChild;
    if (!checkbox.checked) {
        checkbox.checked = true;
        applySingleSelect(targetTr, targetG, chsntail);

        // rowchoose 特有的例外處理,與 chooserc 的 choseExtraDeal/choseSecond 不同
        if (chsntail === 0) {
            rowchoseExtraDeal(targetTr);
        } else {
            rowchoseSecond(targetTr);
        }
    }
    return true;
}

// 共用邏輯:依表格 DOM id 反查是第幾頁(0-based)
function getTableIndex(targetG) {
    var tables = document.getElementsByClassName("gridlist");
    for (let i = 0; i < tables.length; i++) {
        if (targetG.id === tables[i].id) {
            return i;
        }
    }
    return 0;
}

//退回主選單

function outprocs(event){	  
    try {
        destroySubPage();
        // ... 其餘清理邏輯
		var baui=cko[6](0);
		cko[6](baui*(-1));	  //搜尋鍵選項指標要歸零
		if(getAuth[0]()[11]!='M'){
		   var bibau=cko[0](0);   //找出所有閉包首頁紀錄變數  
		   cko[0](bibau*(-1));    //將閉包變數歸零
		}
    } catch(err) {
        console.error('outprocs 清理階段發生錯誤:', err);
    } finally {
        // 確保不管清理過程是否出錯，都能回到主選單，不會卡死畫面
        getAuth[0]('Clear_All');
        for(let k=3;k<7;k++){ getAuth[k]('Clear_All'); }
        document.querySelectorAll("script[id]").forEach(s=>s.remove());
        var urlfolder = document.getElementsByTagName('title');
        if (urlfolder[0]) urlfolder[0].textContent = 'RED.知訊數位營運管理系統';
        initDialog();
    }
} 
 
function delConfirm(event){     //確定刪除
	if (typeof event=="undefined"){
		event=window.event;
    }	
	var target=getEventTarget(event);	  
	var mthjudge=getAuth[0]()[11];     //是否為月份檔
	var yesbill=getAuth[0]()[12];        //是否為單據檔
	var urlfolder=document.getElementsByTagName('title');
	var mainrightValue=urlfolder[0].textContent.slice(0, 3);	
	var ttls=document.getElementsByClassName('ttl');		//表頭或表身有無總計數字
	var tabs=document.getElementsByClassName('tab');	 	  
	var tbno=0;
	for(let i=0;i<tabs.length;i++){
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
				for(let i=0;i< maintable.rows.length; i++){			 
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
						for(let p=0;p<valueshows.length;p++){    //清空頁面資料
							valueshows[p].textContent="";
						}
					}						////
					var responseDiv=document.getElementById("serverResponse1");	 		   	           							       
					 ////  非月份單據檔						
					if (mthjudge!='M'){    //如果非月份檔 
						cko[0](-1);    //閉包記錄變數減一筆
						var ckrcd= parseInt(getAuth[2]()[0].INT_RCD);
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
					    for (let i=1;i<headtable.rows[rcdindex].cells.length-3;i++){  //要從編號開始計
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
	 var target=getEventTarget(event);	 
     var crntrec=0;	 
	 var slt2=document.getElementById('recmth');	
	 
	switch (target.id){
		 case 'TopPage':
		      crntrec=0;
		      break;
		 case 'BottomPage':		      
			   crntrec=slt2.length*1-1;
		      break;
		 case 'LastPage':
		       crntrec=slt2.value*1-2;
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

function RecoverArg(arg){    

    if (isRecovering){
        blkshow("RecoverArg 已在執行中");
        return Promise.resolve(false);
    }

    isRecovering = true;

    //const authKey = getAuth[1]()[0];
    const sendSrcRec =
        "filename=" + encodeURIComponent(arg);// +
        //"|" + encodeURIComponent(authKey);
    return fetch("ROL/BKND/FunDetail.php",{
        method:"POST",
        cache:"no-store",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:sendSrcRec
    })
    .then(response=>{
        if(!response.ok){
            throw new Error(response.status);
        }
        return response.json();
    })
    .then(rsp=>{
        if(rsp==="NO"){
            blkshow("您無 " + arg + " 操作權限");
            return false;
        }
        setArg(rsp);
        return true;
    })
    .catch(err=>{

        console.error(err);
        return false;

    })
    .finally(()=>{
        isRecovering = false;
    });
}

function setArg(arr){
        getAuth[0]('Clear_All');
		Object.values(arr[0]).forEach(value => {            
		getAuth[0](value);   //從這邊加入登入者在arg參數功能權限
			 
        }); 
     getAuth[1]()[1]= getAuth[0]()[0];
}	

	// 優化欄位解析邏輯
function parseFieldMeta(fieldName) {
    var parts = fieldName.split('_');
    var metaStr = parts[parts.length - 2];     // 取得如 "DSL"
    var widthStr = parts[parts.length - 1];    // 取得如 "010"

    if (!metaStr || metaStr.length !== 3) return null;   // 先驗證

    var widthNum = parseInt(widthStr, 10);
    if (isNaN(widthNum)) return null;                      // 補上寬度驗證

    var fldname = fieldName.substring(0, fieldName.indexOf('_'));  // 再算 name

    return {
        isDirect: metaStr[0] === 'D',
        isHidden: metaStr[1] === 'H',
        align: { 'L': 'left', 'C': 'center', 'R': 'right' }[metaStr[2]] || 'left',
        width: widthNum + '%',
        name: fldname
    };
}

//判斷字串最後一碼是否為小寫英文字母
function isLastCharLetter(str) {
    if (!str) return false; // 檢查空字串
    return /[a-z]$/.test(str);
}

// 共用邏輯:清除同表格其他選取,標記目前列為選取狀態
function applySingleSelect(targetTr, targetG, chsntail) {
    var recChecked = document.getElementsByName("chkbx" + targetG.id);
    var targetFirstCellText = targetTr.firstChild.textContent;

    for (let i = 0; i < recChecked.length; i++) {
        var otherTr = recChecked[i].parentNode.parentNode;
        if (otherTr.firstChild.textContent !== targetFirstCellText) {
            if (recChecked[i].checked) {
                recChecked[i].checked = false;
                cko[chsntail + 2](-1);
                //otherTr.style.backgroundColor = "";
				otherTr.style.background = "";
            }
        }
    }
    //targetTr.style.backgroundColor ="#B9B9FF"; 
	targetTr.style.background = "linear-gradient(to bottom, #C2C2FF 0%, #8E8EFF 100%)";
    cko[chsntail + 2](1);
    // 依所屬頁籤分派後續處理(表頭 or 表身)
    var targetTrChildren = targetTr.getElementsByTagName("td");
    if (chsntail === 0) {
        choseExtraDeal(targetTrChildren, targetTr);
    } else {
        choseSecond(targetTrChildren, targetTr);
    }

    /* var responseDiv = document.getElementById("serverResponse" + String(chsntail + 1));
    
	if (responseDiv && responseDiv.innerHTML !== 'Searching......') {
       responseDiv.innerHTML = '&nbsp;';
    } */
}

// 輔助工具：按鈕工廠

const btnManager = {
    createBtn(id, val, title, key, clickFn) {
        const btn = document.createElement("input");
        btn.type = "button";
        btn.className = "btn";
        btn.id = id;
        btn.value = val;
        btn.title = title;
        btn.accessKey = key;

        if (clickFn) {
            attachEventListener(btn, "click", clickFn, false);
        }
        return btn;
    }
};

function destroySubPage() {
    const mainSpan = document.getElementById('lclbtnbk');
    if (mainSpan) mainSpan.innerHTML = '';

    const tabcsses = document.getElementsByClassName("tab_css");
    Array.from(tabcsses).forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
}