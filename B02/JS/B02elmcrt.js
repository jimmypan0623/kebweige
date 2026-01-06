function crtElm(){	     
    var maindiv=getElementsByAttribute('class','tab_css');	
	var beinsertedid=document.getElementById('tab1');
	var spn=document.createElement('span');
	spn.id="APPRVE";
	maindiv[0].insertBefore(spn,beinsertedid);
    var cntdiv=getElementsByAttribute('class','tab_content');	
	var rspn2=document.getElementById('serverResponse2'); 
	 var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	 cntdiv[1].insertBefore(text01,rspn2);
	var spn1=document.createElement('span');
	spn1.id="ttltitle";
     spn1.innerHTML='總金額:';
	cntdiv[1].insertBefore(spn1,rspn2);
	var spn2=document.createElement('span');
	spn2.id="crncy" ;
    cntdiv[1].insertBefore(spn2,rspn2);
	var spn3=document.createElement('span');
	spn3.id="ttlmny";
	spn3.innerHTML='0';
	 cntdiv[1].insertBefore(spn3,rspn2);
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['進貨單號','廠商編號','廠商簡稱', '日','採購人員','幣別','匯率','發票號碼','類別','稅別','付款方式','廠商送貨單號','到貨方式'];
	 var array2 = ['10%','7%','7%', '3%','7%','4%','7%','10%','5%','4%','8%','12%','12%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);
		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['料品編號','品名規格','採購單號', '進貨數量','單價','小計','收貨部門','廠商品號','需求用途','備註'];
	 var array4 = ['13%','13%','10%', '7%','7%','7%','7%','13%','11%','12%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell	
	
		th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);
		
	}			
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="單號:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	
}
 






 
