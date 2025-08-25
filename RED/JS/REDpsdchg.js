function selfTag(jsvsn)
{        
	var myAccount=getCookie('useraccount');	 
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
		 loadScript(`RED/JS/RED.js?v=${jsvsn}`,function(){commontemp();});	
		 loadScript(`RED/JS/REDrgst.js?v=${jsvsn}`);	
	     var plsElmnts=document.getElementById('company_name').parentNode;
		 var iflm=document.createElement('iframe');
		 var htmfile='ROL/'+getCookie('INT_HTM');
		 iflm.id="frl";
		 iflm.src=htmfile;
		 plsElmnts.appendChild(iflm);
	 }		 
}
function redmenuchange(event){    //畫面展開縮起來
	//通過父元素li，找到兄弟元素ul
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);	 
	var oSecondDiv = target.parentNode.getElementsByTagName("ul")[0];
	//CSS交替更換來實現顯、隱		
	if(oSecondDiv!=undefined){			    
  	    if(oSecondDiv.className == "myHide"){	 	
		    var closeother=getElementsByAttribute('class','myShow');			   		 
		    for(var i=0;i<closeother.length;i++){
		        if(closeother[i].className="myShow"){					
		           closeother[i].className= "myHide";
			       closeother[i].parentNode.getElementsByTagName("a")[0].style.backgroundImage="url('digits/add.gif')";
			      break;
		        }
		    }						
	        oSecondDiv.className = "myShow";	 
			target.style.backgroundImage="url('digits/up.gif')";					
	    }
	    else{			 
	   	    oSecondDiv.className = "myHide";					
            target.style.backgroundImage="url('digits/add.gif')";				
	    }
		window.scrollTo(0,0);  //先置頂	
		target.scrollIntoView({
            behavior: 'smooth'
        }); 		
	}			 
}
function excuteFun(event){
	if (typeof event=="undefined"){
		event=window.event;
    }			 
	var target=getEventTarget(event);
	var exucPrgNo=target.childNodes[0].textContent;		
	setCookie('funNo',exucPrgNo);
	var authArray=target.parentNode.childNodes[1].textContent.split("");  //切割成陣列	
	for(var i=1;i<10;i++){   //該登入者之權限設定
		var authorder='auth'+paddingLeft(i.toString(),2);		 
		if(authArray[i-1]=='E'){  //auth01:新增  auth02:修改 auth03:刪除  auth04:列印....
		  setCookie(authorder,'E');
	    }else if(authArray[i-1]=='Y'){
	       setCookie(authorder,'Y');
		}else{
		   setCookie(authorder,'N');
		}					
	}	  
	////authArray[9]開始為該程式之屬性馬判別
	////[9]:數字表示該程式畫面有幾頁,
	////[10]:M首頁為月份分頁P為固定筆數分頁,
	////[11]:類別,R為單據,B為基本資料,A為分析資料,S為系統檔
	////[12]:首頁分頁為月份外判斷是否多加部門別分頁D:多加部門別下拉選項		
	setCookie('howpge',authArray[9]);
	setCookie('MorP',authArray[10]);
	setCookie('kindofda',authArray[11]);
	setCookie('adddpt',authArray[12]);
	var urlcmp=(decodeURI(window.location.search));
	var username=urlcmp.substr(urlcmp.indexOf('=')+1);	
	document.location.href='ZRO.html'+"?username="+username+"&ourcompany="+encodeURI(document.getElementById('company_name').innerHTML);	
    window.scrollTo(0,0);  //先置頂	 
	target.scrollIntoView({
        behavior: 'smooth' 
    }); 	
}	

function blockPsdshow()    //變更密碼程序
{
	 
  blkshow(1);    

}