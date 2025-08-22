function crtElm(){
	
     var thr1=document.getElementById('headrow1');
	 
	 var array1 = ['登入帳號','人員姓名','部門編號', '部門名稱','連絡電話','電子郵件','員工編號','失效日期'];
	 var array2 = ['8%','8%','8%', '8%','12%','20%','8%','8%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
	
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);
		
	}			
	  var thr2=document.getElementById('headrow2');
     var array3 = ['功能編號','功能說明','新增', '修改','刪除','列印','附加權限一','附加權限二','附加權限三','附加權限四','附加權限五'];
	 var array4 = ['8%','17%','5%', '5%','5%','5%','11%','11%','11%','11%','11%'];
	for (var k = 0; k < array3.length; k++) {
		var th2 = document.createElement('th'); //column		   
		var text = document.createTextNode(array3[k]); //cell	
	
		th2.style.width=array4[k];
		th2.appendChild(text);
		thr2.appendChild(th2);
		
	}			
	var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="設定人員帳號";
	tabnames[1].innerHTML="帳號權限設定";
	var keynames=getElementsByAttribute('name','keyname');	
	keynames[0].innerHTML="帳號:";
	var fatherkeys=getElementsByAttribute('name','fatherkey');	
	/* fatherkeys[0].style.width="12%";
	fatherkeys[0].size="10"; */
}

 
