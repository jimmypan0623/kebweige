addLoadListener(initDialog);
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
		 if(Cookies.get('auth07')!='Y'){
			 var authcost=getElementsByAttribute('class','costauth');
		     for(var m=0;m<authcost.length;m++){			 
			     authcost[m].style.display='none';    //處理成本的權限			 
		    }			 
		 }	
        var toppge=document.getElementById("TopPage");
		 attachEventListener(toppge,"click",rollChange,false);  //在第一頁點 << 形按鈕(第一張)
		 var bottompge=document.getElementById("BottomPage");
		 attachEventListener(bottompge,"click",rollChange,false);  //在第一頁點 >> 形按鈕(最後一張)
		 var lastpge=document.getElementById("LastPage");
		 attachEventListener(lastpge,"click",rollChange,false);  //在第一頁點 < 形按鈕(上一張)
		 var afterpge=document.getElementById("AfterPage");		 
		 attachEventListener(afterpge,"click",rollChange,false);  //在第一頁點 > 形按鈕(下一張)
		 
		 var tab1Click=document.getElementById("tab1");
	     attachEventListener(tab1Click,"click",tab1View,false);
		 var tab2Click=document.getElementById("tab2");
		 attachEventListener(tab2Click,"click",tab2View,false);
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
/* 	if (cko[0](0)>0){      //只能在表身新增
	    
		blkshow("請取消勾選待修改或刪除的紀錄，再新增");
		return false;
 
	}	  */
	var responseDiv=document.getElementById("serverResponse1");
	responseDiv.innerHTML='&nbsp';	
	var Today=new Date();
   var nowday=Today.getFullYear()+ "-" + paddingLeft((Today.getMonth()+1).toString(),2) + "-" + paddingLeft((Today.getDate()).toString(),2) ;
	var myAccount=Cookies.get('useraccount');
	var flg=0;
	
	var targetTbody=document.getElementById("maintbody");;
	var targetTrs=targetTbody.getElementsByTagName("tr");   
	blkshow(1);
} 
 //修改紀錄
function edtrec(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var responseDiv=document.getElementById("serverResponse1");
	responseDiv.innerHTML='&nbsp';	
	if (cko[0](0)==0){      //只能在表身異動故用表身閉包變數
		blkshow("未點選任何紀錄，請點選一筆再按此鈕執行修改");
		return false;
	}else if(cko[0](0)>1){
		blkshow("一次只能修改一筆紀錄，請留一筆點選再執行");
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
	if (cko[0](0)==0){
		blkshow("未點選任何紀錄，請點選一筆再按此鈕執行刪除");	
		return false;	
    } 
	
	blkshow(4);

}




function keysrchchg(event){
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var target=getEventTarget(event);
	var tabs=getElementsByAttribute('class','tab');
	if (tabs[0].checked)
	    var responseDiv=document.getElementById("serverResponse1");
	else
		var responseDiv=document.getElementById("serverResponse2");
	 
	responseDiv.innerHTML='&nbsp';
	var tables=getElementsByAttribute("class","gridlist");
	if (tabs[0].checked){
       var ths=tables[0].getElementsByTagName("th");
    }else{
	   var ths=tables[1].getElementsByTagName("th");
	}
    var idx=(target.value.slice(-2));	
/* 	for (var i=1;i<ths.length;i++){  //
		if(i==idx){
			ths[i].style.backgroundColor="#FF9D6F";//background-color:#F2E6E6;;#778812
			 
			var strUser = target.options[i-1].value;
			
		}else{
			//ths[i].style.backgroundColor="#F2E6E6";//background-color:#F2E6E6;
			 ths[i].style.backgroundColor="#a16128";
		}
		
	} */

	
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

    
function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
		var maintable=document.getElementById("member");	  		
		var tablerowindex=0;
		for(var i=1;i< maintable.rows.length; i++){			 
		    if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){		 			 				 							
				tablerowindex=i;       //記住是目前table的哪一列			 
				break;
			}
		} 			
		 var bibau=cko[0](0);   //找出閉包變數現值
	     cko[0](bibau*(-1));    //將表身閉包變數歸零	  
		var crntpge=document.getElementById('recmth') ;
		if (crntpge.value*1>=1) {
		  choiceClick(crntpge.value);
		}
		 
}
function tab2View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
      if(Cookies.get('auth05')!='Y'){		     
		 blkshow("你無查看詢價紀錄權限");		 
	     document.getElementById("tab1").checked=true;			  
	  } 		  
}


function sourceAccount(){   //尋找被點選的帳號
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


