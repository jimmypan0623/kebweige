addLoadListener(initDialog);
function initDialog()
{        
	  var myAccount=Cookies.get('useraccount');
	  //var myAccount=getCookie('useraccount');
	  //var myNam=decodeURI(getCookie('username'));
	  //var myNam=decodeURI(Cookies.get('username'));
	 var i;
	 //if(myAccount==null){		 
	 if(!myAccount){
         (function myLoop(i) {
             setTimeout(function() {
               blkshow("請先從登入畫面登入帳號密碼"); //  your code here                
               if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, 9000)
          })(10);                   //  pass the number of iterations as an argument

        
		document.location.href="logOut.php";
     }else	{
	      
         document.getElementById('user_who').innerHTML=myAccount;
    	 var logoutbtn=document.getElementById('lgt');     	 //登出按鈕
	   
    	 attachEventListener(logoutbtn,"click",outprocs,false);  //登出按鈕程序
		 var newrcath=document.getElementById('NEW_BOTT');       //新增按鈕
		 if (Cookies.get('auth01')=='Y'){
             newrcath.style.visibility="visible";	
			 attachEventListener(newrcath,"click",addrec,false);  //新增紀錄按鈕程序
         }else{
			 newrcath.style.visibility="hidden";
         }			 
	     var edtrcath=document.getElementById('EDIT_BOTT');
		 if (Cookies.get('auth02')=='Y'){			 
	        edtrcath.style.visibility="visible";
			attachEventListener(edtrcath,"click",edtrec,false);  //修改紀錄按鈕程序
		 }else{
			edtrcath.style.visibility="hidden";
		 }
	     var delrcath=document.getElementById('DEL_BOTT');
		 if (Cookies.get('auth03')=='Y'){
			 delrcath.style.visibility="visible";
			 attachEventListener(delrcath,"click",delrec,false);  //刪除紀錄按鈕程序
		 }else{
		     delrcath.style.visibility="hidden";
		 }
       
	     var keyfield=document.getElementById('recfield');
		 attachEventListener(keyfield,"change",keysrchchg,false);  //搜尋鍵值選項
		 var keyfield2=document.getElementById('recfield2');
		  attachEventListener(keyfield2,"change",keysrchchg,false);  //搜尋鍵值選項
		 //var myRow=document.getElementById("headrow");
	 
		 document.getElementById("headrow").cells[1].style.backgroundColor="#FF9D6F";  //"#1AFD9C"; //初始值設定第一個欄位為預設搜尋鍵值故顯示顏色
         document.getElementById("headrow2").cells[1].style.backgroundColor="#FF9D6F";   //"#1AFD9C";
			  /* var newth=document.createElement('th');
			  newth.setAttribute("style","width:24px;");
			  
			  newth.setAttribute("id","AUTH");
			  newth.innerHTML="選取";
			  
			  myRow.appendChild(newth);
			  myRow.childNodes[myRow.childNodes.length-3].setAttribute("style","width:41px;");	 */	  
        //以下從原A07.html搬過來的	切換畫面
		var tab1Click=document.getElementById("tab1");
	    attachEventListener(tab1Click,"click",tab1View,false);
        var tab2Click=document.getElementById("tab2");
	    attachEventListener(tab2Click,"click",tab2View,false);
	   ///////////////
	   //複製帳號權限
	    var copyClick=document.getElementById("COPY_BOTT");
		 if (Cookies.get('auth05')=='Y'){			 
	        copyClick.style.visibility="visible";
			 attachEventListener(copyClick,"click",authCopy,false);  //複製權限按鈕程序
		 }else{
			copyClick.style.visibility="hidden";
		 }
	     //移除權限
		 var removeClick=document.getElementById("REMOVE_BOTT");
		 if (Cookies.get('auth06')=='Y'){			 
	          removeClick.style.visibility="visible";
			 attachEventListener(removeClick,"click",authRemove,false);  //複製權限按鈕程序
		 }else{
			copyClick.style.visibility="hidden";
		 }
		 var toppge=document.getElementById("TopPage");
		 attachEventListener(toppge,"click",rollChange,false);  //在第一頁點 << 形按鈕(第一張)
		 var bottompge=document.getElementById("BottomPage");
		 attachEventListener(bottompge,"click",rollChange,false);  //在第一頁點 >> 形按鈕(最後一張)
		 var lastpge=document.getElementById("LastPage");
		 attachEventListener(lastpge,"click",rollChange,false);  //在第一頁點 < 形按鈕(上一張)
		 var afterpge=document.getElementById("AfterPage");
		 attachEventListener(afterpge,"click",rollChange,false);  //在第一頁點 > 形按鈕(下一張)
		 var prvspge=document.getElementById("previousPage");
		 attachEventListener(prvspge,"click",HeadPageChange,false);  //在第二頁點正三角形按鈕(上一張)
		 var nxtpge=document.getElementById("nextPage");
		 attachEventListener(nxtpge,"click",HeadPageChange,false);  //在第二頁點倒三角形按鈕(下一張)
     }
}
function outprocs(event){	  
    if (typeof event=="undefined"){
		event=window.event;
	}

	history.back();
	
}

//新增紀錄按鈕程序
 function addrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[3](0)>0){      //只能在表身新增
		blkshow("請取消勾選待修改或刪除的紀錄，再新增");
		return false;
 
	}	 
	var Today=new Date();
   var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
	var myAccount=Cookies.get('useraccount');
	var flg=0;
	
	var targetTbody=document.getElementById("maintbody2");;
	var targetTrs=targetTbody.getElementsByTagName("tr");   
	blkshow(1);
} 
 //修改紀錄
function edtrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[3](0)==0){      //只能在表身異動故用表身閉包變數
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行修改");
		return false;
	}else if(cko[3](0)>1){
		blkshow("一次只能修改一筆紀錄，請留一筆勾選再執行");
		return false;
	} 
    blkshow(2); 		
} 


//刪除紀錄
function delrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[3](0)==0){
		blkshow("未勾選任何紀錄，請至少勾選一筆再按此鈕執行刪除");	
		return false;	
    } 
	
	blkshow(4);

}

function authCopy(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	if (cko[2](0)==0){
		blkshow("未勾選任何紀錄，請勾選一筆再按此鈕執行複製權限");	
		return false;	
    } 

	blkshow(3);

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
	blkshow(5);
}

function keysrchchg(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');
	if (tabs[0].checked){
	    var responseDiv=document.getElementById("serverResponse1");
	}else{
		var responseDiv=document.getElementById("serverResponse2");
	}
	responseDiv.innerHTML='&nbsp';
	var tables=getElementsByAttribute("class","datalist");
	if (tabs[0].checked)
       var ths=tables[0].getElementsByTagName("th");
    else
	   var ths=tables[1].getElementsByTagName("th");
    var idx=(target.value.slice(-2));	
	for (var i=1;i<ths.length;i++){
		if(i==idx){
			ths[i].style.backgroundColor="#FF9D6F";//background-color:#F2E6E6;;#778812
			 
			var strUser = target.options[i-1].value;
			
		}else{
			//ths[i].style.backgroundColor="#F2E6E6";//background-color:#F2E6E6;
			 ths[i].style.backgroundColor="#a16128";
		}
		
	}
	
}

function HeadPageChange(event){       //在表身按上下一張按鈕(正三角形與倒三角形)翻表頭頁面隨即連動表身資料
	    if (typeof event=="undefined"){
		event=window.event;		
     }
	 target=getEventTarget(event);	 
	 if(target.id=="previousPage"){  //判斷往上或往下翻頁
		 var crntrec=0;
	 }else{
		  var crntrec=2;
	 }
	 var tabs=getElementsByAttribute("class","tab");	 	
	 tabs[0].checked=true;
	 var recChecked=document.getElementsByName("recordchosen1");    //尋找表頭每一筆CHCKBOX			 
	 for(var i=0;i<recChecked.length;i++){				 
		if (recChecked[i].checked==true){					     
			if(i+(crntrec==2?1:0)==(crntrec==2?recChecked.length:0)){
			   blkshow('請至表頭翻到'+(crntrec==2?'下':'上')+'一頁');				
			}else{									
				 crntrec+=i;
				  chooserc(crntrec);      
			}
			break; 	 
		}				  
	}
   
	tabs[1].checked=true;
	tab2View(event);
}
function rollChange(event){       //按鈕翻頁
	 if (typeof event=="undefined"){
		event=window.event;		
     }
	 target=getEventTarget(event);	 
     var crntrec=0;	 
	 var slt2=document.getElementById('recmth');	
	 switch (target.id){
		 case 'TopPage':     //首頁
		      crntrec=0;
		      break;
		 case 'BottomPage':		      //最後一頁
			   crntrec=slt2.length-1;
		      break;
		 case 'LastPage':
		       crntrec=slt2.value-2;
				if(crntrec<0){
					 blkshow('已到第一頁');	
				   crntrec=0;
				}
		      break;
		 case 'AfterPage':
			   crntrec=slt2.value*1;
			   if(crntrec==slt2.length){
				   blkshow('已到最後一頁');	
				  crntrec=slt2.value*1-1;
			   }
			   break;
		  case 'nextPage':  
		        crntrec=slt2.value*1;
			   
			   break;
	     default:
			   crntrec=0;
	 }
	   slt2.options[crntrec].selected=true;
        choiceClick();	 
	
}
	function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		 var bibau=cko[3](0);   //找出閉包變數現值
	     cko[3](bibau*(-1));    //將表身閉包變數歸零		
	}

function tab2View(event){	  
       if (typeof event=="undefined"){
		event=window.event;
    	}
	
	   if (cko[2](0)==0){
		  blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");	
	  	  document.getElementById("tab1").checked="checked";		
		  return false;	
       }
           var keydescription=document.getElementById('keydscrpt');    
           var fthkey=document.getElementById("fatherkey");

	       var aWaitUpdate=[];	//準備記錄修改時欄位的內容資料
				 var maintable=document.getElementById("member");
				 myThgrp=maintable.getElementsByTagName("th");		 				 				 	 
	             for(var i=1;i< maintable.rows.length; i++){			 
		            if(maintable.rows[i].cells[myThgrp.length-1].childNodes[0].checked){
					   for (j=0;j<myThgrp.length-1;j++){
						   aWaitUpdate.push(maintable.rows[i].cells[j].innerHTML);  //將待修改欄位資料存入陣列
					   }					   
			   	   
                       break;					   
			         }
		          } 
                             keydescription.innerHTML=aWaitUpdate[2];
							 fthkey.value=aWaitUpdate[1];//+"  "+aWaitUpdate[2];
					        var responseDiv=document.getElementById("serverResponse2"); 
		                    responseDiv.innerHTML='&nbsp';
	            	       var bibau=cko[3](0);   //找出閉包變數現值
	                      cko[3](bibau*(-1));    //將表身閉包變數歸零
						   
						   var cnfrm=document.getElementById('seekfrm2');
	 
	                          cnfrm.setAttribute("style","visibility:hidden;");
   	                          var txtseek=document.getElementById('srch2');
							  txtseek.value="";
						  	  attachEventListener(cnfrm,'click',seekBtnClick,false); 
	                           attachEventListener(txtseek,'focus',textFocuson,false); 
	                           attachEventListener(txtseek,'keypress',textEnter,false); 
						  commontemp(fthkey.value,"a02.F01");
						  
}
	


function sourceAccount(){   //尋找被勾選的帳號
	var maintable=document.getElementById("member");
	var respAccount; 
	  
		for(var i=0;i< maintable.rows.length; i++){
			 
		      if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			     respAccount=maintable.rows[i].cells[1].innerHTML;
				 break;
			  }
		}
		return respAccount; 
}

