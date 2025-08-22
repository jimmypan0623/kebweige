function crtElm(){	
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['幣別代號','幣別名稱','預設匯率', '最後異動'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['日期','匯率','最後異動'];
 
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell	
		th2.appendChild(text);
		thr2.appendChild(th2);		
	}		
    var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="設定採購幣別";
	tabnames[1].innerHTML="三旬匯率";	
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="幣別:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	
}