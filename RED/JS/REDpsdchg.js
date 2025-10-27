function selfTag(jsvsn)
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
     }else{		 
	    if(getAuth[1]().length<1){
		   getAuth[1](myAccount); 
          	   
		}
		
		 loadScript(`RED/JS/RED.js?v=${jsvsn}`,function(){commontemp();});	
		 loadScript(`RED/JS/REDrgst.js?v=${jsvsn}`);
     		 
	    var plsElmnts=document.getElementById('company_name').parentNode;
	    
		
		    var iflm=document.createElement('iframe');
		    var htmfile='ROL/'+(getCookie('INT_HTM')?getCookie('INT_HTM'):getAuth[2]()[0].INT_HTM);		
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
	    }else{			 
	   	    oSecondDiv.className = "myHide";					
            target.style.backgroundImage="url('digits/add.gif')";				
	    }
		window.scrollTo(0,0);  //先置頂	
		target.scrollIntoView({
            behavior: 'smooth'
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
	var authArray=target.parentNode.childNodes[1].textContent.split("");  //切割成陣列		
	if( getAuth[0]().length<1){ 
	   getAuth[0](exucPrgNo);
	    for(var i=1;i<10;i++){   //該登入者之權限設定
			var authorder='auth'+paddingLeft(i.toString(),2);		 
			if(authArray[i-1]=='E'){  //auth01:新增  auth02:修改 auth03:刪除  auth04:列印....			  
			  getAuth[0]('E');
			}else if(authArray[i-1]=='Y'){			    
			    getAuth[0]('Y');
			}else{			   
			    getAuth[0]('N');
			}					
	    }	  	 
	    for (var i=9;i<13;i++){ 
	        getAuth[0](authArray[i]);
        }
    }
    /* var urlcmp=(decodeURI(window.location.search));
	 var username=urlcmp.substr(urlcmp.indexOf('=')+1);	
	 document.location.href='ZRO.html'+"?username="+username+"&ourcompany="+encodeURI(document.getElementById('company_name').innerHTML);	     */
    getAuth[1]()[1]=left( exucPrgNo,3);
 	initDialog();
	window.scrollTo(0,0);  //先置頂	 
	target.scrollIntoView({
        behavior: 'smooth' 
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
		if(closeother[i].className="myShow"){					
		    closeother[i].className= "myHide";
			closeother[i].parentNode.getElementsByTagName("a")[0].style.backgroundImage="url('digits/add.gif')";
			break;
		}
	}						
    blkshow(1);    

}

function accountDele(event){    //刪除帳號cookie
    if (typeof event=="undefined"){
		event=window.event;
    }			
    var target=getEventTarget(event);
	getAuth[1]('Clear_All');
	getAuth[2]('Clear_All');
	//delCookie("lastFuncInt");	 	
	var mainUl=document.getElementById("listUL");   
	mainUl.remove();		 
    return;	 
}