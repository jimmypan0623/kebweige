function crtElm(){	     
    var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text01,rspn2);
	 var spn2=document.createElement('span');
	spn2.id="dntOrRjt" ;
	spn2.setAttribute("style","font-size:150%;");
    cntdiv[1].insertBefore(spn2,rspn2); 
	
	  var text0a = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0a,rspn2);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
	spn1.setAttribute("style","font-size:120%;font-weight:bold;");
     spn1.innerHTML='收款金額:';
	cntdiv[1].insertBefore(spn1,rspn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
    spn3.setAttribute("style","font-size:120%;font-weight:bold;");
	spn3.innerHTML='0';
	 cntdiv[1].insertBefore(spn3,rspn2); 
	///// 
	  var text0b = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0b,rspn2);
	var spn4=document.createElement('span');
	spn4.id="ttltitle2";
	spn4.setAttribute("style","font-size:120%;font-weight:bold;");
     spn4.innerHTML='已沖金額:';
	cntdiv[1].insertBefore(spn4,rspn2);
	var spn5=document.createElement('span');
	spn5.id="ttlmny2";
	spn5.className="ttl";
    spn5.setAttribute("style","font-size:120%;font-weight:bold;");
	spn5.innerHTML='0';
	 cntdiv[1].insertBefore(spn5,rspn2);  
	 ////
	   var text0c = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text0c,rspn2);
	var spn6=document.createElement('span');
	spn6.id="ttltitle2";
	spn6.setAttribute("style","font-size:120%;font-weight:bold;");
     spn6.innerHTML='待沖金額:';
	cntdiv[1].insertBefore(spn6,rspn2);
	var spn7=document.createElement('span');
	spn7.id="ttlmny3";
    spn7.setAttribute("style","font-size:120%;font-weight:bold;");
	spn7.innerHTML='0';
	 cntdiv[1].insertBefore(spn7,rspn2);  

     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['沖銷單號','廠商編號','廠商簡稱', '日','採購擔當','收款方式','支票/單據號碼','兌現日期','收款金額','備註'];
	 var array2 = ['10%','8%','8%', '4%','8%','10%','10%','8%','10%','12%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);
		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['憑證單號','發票號碼','發票日期', '原始金額','沖銷金額','備註說明','最後異動'];
	  var array4 = ['12%','12%','12%','12%','12%','14%','12%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell		
		th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);		
	}			
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="應付沖銷單瀏覽";
	tabnames[1].innerHTML="應付沖銷單內容";
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="單號:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	

}







 
