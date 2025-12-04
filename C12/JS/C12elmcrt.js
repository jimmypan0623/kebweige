function crtElm(){	
	var cntdiv=getElementsByAttribute('class','tab_content');	
	
    var rspn1=document.getElementById('serverResponse1'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[0].insertBefore(text01,rspn1);		
	var spn1=document.createElement('span');
	spn1.id="ttltitle";	 
     spn1.innerHTML='總金額:';
	cntdiv[0].insertBefore(spn1,rspn1);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
    cntdiv[0].insertBefore(spn2,rspn1);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";  
	spn3.innerHTML='0';
	 cntdiv[0].insertBefore(spn3,rspn1);		
	
	
	var firstCover=getElementsByAttribute('class','table_cover');	
	firstCover[0].style.width="16%";

     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['編號','客戶簡稱'];
	 var array2 = ['6%','10%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}	
     var secondCover=document.createElement('div');
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="84%";
    righttbl1=document.createElement("table");
	righttbl1.id="rightContent1";	
	righttbl1.className="gridlist";
	righttbl1.setAttribute("style","width:120%;");
	 var thr2=document.createElement("thead"); 
	 var array3 = ['出貨日期','發票號碼','料號','出貨單號','數量','單價','幣別','匯率','小計','客戶PO','客戶品號'];
	 var array4 = ['8%','9%','12%','9%','7%','7%','4%','7%','8%','9%','11%'];
	for (var i = 0; i < array3.length; i++) {
		var th2 = document.createElement('th'); //column	
		
		var text2 = document.createTextNode(array3[i]); //cell	
      
		th2.style.backgroundColor="#D6D6AD";	
		th2.style.color="#000000";	
		th2.style.width=array4[i];
		th2.appendChild(text2);
		
		thr2.appendChild(th2);		
	}	
	var tbdy2=document.createElement("tbody"); 
	tbdy2.id="contentTbody";
	righttbl1.appendChild(thr2);
	righttbl1.appendChild(tbdy2);    
	secondCover.appendChild(righttbl1); 	 
	cntdiv[0].appendChild(secondCover); 		
	 var tabnames=getElementsByAttribute('name','tablbl');	
    tabnames[0].innerHTML="應收帳款對帳單";  
	return;
}