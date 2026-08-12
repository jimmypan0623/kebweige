function selfTag(jsvsn,jsPth)
{        
	var myAccount=(getCookie('useraccount')?getCookie('useraccount'):getAuth[1]()[0] );
	var i;	 
	 if(!myAccount && getAuth[1]().length<1){
         (function myLoop(i) {
             setTimeout(function() {
               blkshow("請先從登入畫面登入帳號密碼"); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 9000)
          })(10);                   //  pass the number of iterations as an argument       
		document.location.href="logOut.php";	
		//initDialog();
     }else{		 
	    if(getAuth[1]().length<1){
		   getAuth[1](myAccount);          	   
		}
		document.querySelectorAll("script[id]").forEach(s=>s.remove());			
     	let axtmpl1=jsPth+jsPth.substr(0,3)+'.js?v='+jsvsn;
	    let axtmpl2=jsPth+jsPth.substr(0,3)+'rgst.js?v='+jsvsn;
		if(getAuth[2]().length<1){  //如果尚未登入系統
	       loadScript(`${axtmpl1}`,function(){commontemp();});
		}else{      
		   loadScript(`${axtmpl1}`,function(){getProfile([],[]);});//已登入則依照閉包變數直接渲染主選單,無須再傳入參數(所以傳入空陣列即可)
		}
	    loadScript(`${axtmpl2}`);	 
	    var plsElmnts=document.getElementById('company_name').parentNode;
		var menubarcover=document.getElementById('menudivbtn');
	    attachEventListener(menubarcover,"click",toggleMenu,false);  
		var logoutDivBtn=document.getElementById('getOutBtn');
		attachEventListener(logoutDivBtn,"click",accountDele,false);  
		var iflm=document.createElement('iframe');
		//if(getAuth[1]()[1] && (left(getAuth[1]()[1],1)=='C' || left(getAuth[1]()[1],1)=='D' || left(getAuth[1]()[1],1)=='B' || left(getAuth[1]()[1],1)=='K')){		  
		var auth1 = getAuth[1]();
        if(auth1[1] && ['C','D','B','K'].includes(auth1[1].slice(0,1))){	
			var htmfile='ROL/flowProcess'+getAuth[1]()[1].slice(0,1)+'.html?v=${jsvsn}';			
		}else{	      		     
			  var htmfile='ROL/rollingtaichi.html';
		}
		iflm.id="frl";		 
		iflm.src=htmfile;
		plsElmnts.appendChild(iflm);
	 }		 
}
function redmenuchange(e){    //畫面展開縮起來

    var event = e || window.event;
    if (event.preventDefault) {
        event.preventDefault(); // 現代瀏覽器
    } else {
        event.returnValue = false; // 舊版 IE
    }

	//通過父元素li，找到兄弟元素ul
	if (typeof event=="undefined"){
	   event=window.event;
	}
	var target=getEventTarget(event);	 
	var oSecondDiv = target.parentNode.getElementsByTagName("ul")[0];
	var iflm=document.getElementById("frl");		 
	//CSS交替更換來實現顯、隱		
	if(oSecondDiv!=undefined){			    
  	    if(oSecondDiv.className == "myHide"){	 	
		    var closeother=getElementsByAttribute('class','myShow');			   		 
		    for(var i=0;i<closeother.length;i++){
		        if(closeother[i].className=="myShow"){					
		           closeother[i].setAttribute("class","myHide");
			       closeother[i].parentNode.getElementsByTagName("a")[0].style.backgroundImage="url('digits/add.gif')";
			      break;
		        }
		    }						
			oSecondDiv.setAttribute("class","myShow");
			target.style.backgroundImage="url('digits/up.gif')";	    
			switch (target.innerHTML.slice(0,1)){
			    case 'B':
                case 'C':
                case 'D':
                case 'K':
                    var htmfile = 'ROL/flowProcess' +target.innerHTML.slice(0,1) + '.html';
               break;
			   default :
			      
				  var htmfile='ROL/rollingtaichi.html';
				  break;			      
			} 
             		
	    }else{			 		    
            var htmfile='ROL/rollingtaichi.html';
			oSecondDiv.setAttribute("class","myHide");
            target.style.backgroundImage="url('digits/add.gif')";				
	    }
		iflm.src=htmfile; 	
		window.scrollTo(0,0);  //先置頂	
		target.scrollIntoView({
            behavior: 'smooth',
			block: 'start'
        }); 		
	}else{
         
	}		
}
function excuteFun(event){
	if (typeof event=="undefined"){
		event=window.event;
    }			 	 
	var target=getEventTarget(event);
	var exucPrgNo=target.childNodes[0].textContent;		
	var authArray=target.parentNode.childNodes[1].textContent.trim().split(",");  //切割成陣列
	if( getAuth[0]().length<1){ 	          
	    getAuth[0](exucPrgNo);
		for(var i=0;i<authArray.length;i++){   //該登入者之權限設定與執行作業畫面之頁籤
		   getAuth[0](authArray[i]);
		}	    		
    }
	////以下為抓取資料庫中設定的欄位資料產生欄位TITLE
	fieldsSet(exucPrgNo);
	////
    /* var urlcmp=(decodeURI(window.location.search));
	 var username=urlcmp.substr(urlcmp.indexOf('=')+1);	
	 document.location.href='ZRO.html'+"?username="+username+"&ourcompany="+encodeURI(document.getElementById('company_name').innerHTML);	     */
    getAuth[1]()[1]=getAuth[0]()[0];     //left( exucPrgNo,3);
 	initDialog();
	window.scrollTo(0,0);  //先置頂	 
	target.scrollIntoView({
        behavior: 'smooth',
		block: 'start'
    }); 		 
}	

function blockPsdshow(event)    //變更密碼程序
{
    if (typeof event=="undefined"){
		event=window.event;
    }			
    var target=getEventTarget(event);	 	
    var closeother=getElementsByAttribute('class','myShow');			   		 
	for(var i=0;i<closeother.length;i++){
		if(closeother[i].className=="myShow"){					
		    closeother[i].setAttribute("class","myHide");
			closeother[i].parentNode.getElementsByTagName("a")[0].style.backgroundImage="url('digits/add.gif')";
			break;
		}
	}					
    var iflm=document.getElementById("frl");		 		    	
	var htmfile='ROL/rollingtaichi.html';	 
    iflm.src=htmfile; 		
    blkshow(1);    
}

function accountDele(event){    //刪除帳號cookie
    if (typeof event=="undefined"){
		event=window.event;
    }			
    var target=getEventTarget(event);
	
	/*	const cookiesToClear = ['useraccount', 'CAPTCHA', 'tmpacnt', 'tmppswd', 'errmsg']; //刪除其他COOKIE
	cookiesToClear.forEach(delCookie);
     for (let key in getAuth[2]()[0]) {	   //刪除系統參數COOKIE
       delCookie(key);
    } */

	for(let i=0;i<7;i++){       //閉包變數清空
	    getAuth[i]('Clear_All');		
	}
	
	getAuth[7]=[];
	
	var mainUl=document.getElementById("listUL");   
	mainUl.remove();	
	var iflm=document.getElementById("frl");
	iflm.remove();
	Array.from(document.querySelectorAll("script[id]")).forEach(s=>{
    s.remove();
    });
	 
      
	
	//document.location.href='index.html';
	//initDialog();
    document.location.href="logOut.php";	 
    return;	 
}

function toggleMenu() {   //主選單隱藏或顯示
     btnimg=document.getElementById('menubtnimg');
	var menu = document.getElementById("navigation"); 
	var frlm=document.getElementById('frl');
	if (menu.style.display === "none") {
		menu.style.display = "block";		
		btnimg.src = 'digits/widget_closed.gif';		
		frlm.style.width='75%';
		frlm.style.left='25.3%';
	} else {
		menu.style.display = "none";	 
		btnimg.src = 'digits/widget_open.gif';		 
		frlm.style.width='100%';
		frlm.style.left='0%';
	}
	
}


function fieldsSet(exucPrgNo) {
	  //記錄三個頁面搜尋選項的閉包變數清空
    for(let k=3;k<7;k++){
	   getAuth[k]('Clear_All');	
	}  
	 // 剛進操作畫面之欄位設定
    const sendSrcRec = "filename=" + encodeURIComponent(exucPrgNo.slice(0, 3));
    const url = "include/BKND/pagesFieldsData.php" ;
    fetch(url, {
        method: 'POST',
		cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: sendSrcRec
    })
    .then(response => {
        if (!response.ok) throw new Error('網路回應不成功: ' + response.status);
        return response.json(); // fetch 的 response.json() 會自動將 JSON 字串轉成物件/陣列
    })
    .then(rsp => {
        let widthttl = 0;
        let m = 0;
        let thr = null;

        for (let i = 0; i < rsp.length; i++) {
            let item = rsp[i];
            
            // 使用 .slice 取代原有的 left 函數
            let currentM = item.field_order ? parseInt(item.field_order.toString().slice(0, 1)) : m;

            if (currentM !== m) {
                m = currentM;
                thr = document.getElementById('headrow' + m.toString());
                widthttl = 0;
            }

            if (item.field_name !== undefined && item.show_hide=='S') {
                const th = document.createElement('th');
                const text = document.createTextNode(item.field_name);
                th.appendChild(text);

                if (item.width_ratio !== undefined && item.show_hide=='S') {
                    th.style.width = item.width_ratio + '%';
                    widthttl += item.width_ratio * 1;
                }

                if (widthttl > 100) {
                    const oMember = document.getElementById('member' + m.toString());
                    if (oMember) oMember.style.width = widthttl.toString() + '%';
                }

                if (thr) thr.appendChild(th);
				
            }
			var ptm={};
			if (isLastCharLetter(item.field_order.trim())) {
				ptm['text']=item.field_name.trim()=='日'?'日期':item.field_name;
				ptm['value']=item.field_content;
				ptm['order']=item.field_order.trim().at(-1);
			    getAuth[3 + m ](ptm);
			}
        }

        if (m > 1 && rsp[1] && rsp[1]['field_name']) {
            const keynames = document.getElementsByName('keyname');
            for (let k = 0; k < keynames.length; k++) {
                keynames[k].textContent = rsp[1]['field_name'] + ":";
            }
        }
    })
    .catch(error => {
        console.error("fieldsSet 發生錯誤:", error);
    });
}