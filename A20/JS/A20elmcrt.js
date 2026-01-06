function crtElm(){	
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['表格代號','表格名稱','表格類別', '備註說明','最後異動'];
     var array2 = ['20%','20%','20%', '20%','13%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
	    th1.style.width=array2[j];  
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['欄位代號','欄位說明','欄位型態', '欄位長度','小數位數','預設值','最後異動'];
	 var array4 = ['14%','14%','14%', '14%','14%','14%','13%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell	
	
	    th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);
		
	}			
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="檔名:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	

}


 
