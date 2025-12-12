function crtElm(){	
	var tablblnames=getElementsByAttribute('name','tablbl');	 
	tablblnames[0].innerHTML="發票管理";
	var oMember = document.getElementById("member1");	 
	oMember.setAttribute("style","width:120%;");
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['日','發票號碼','對象編號','對象簡稱','統一編號','稅別','幣別','匯率','銷售金額','稅額','發票總額','憑證單號','收發部門','擔當人員'];
	 var array2 = ['3%','10%','7%', '7%','7%','4%','4%','8%','9%','9%','9%','10%','7%','7%'];	
	for (var j = 0; j < array1.length; j++) {
		var th = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell	
		 th.style.width=array2[j];
		th.appendChild(text);
		thr1.appendChild(th);		
	}					
	 

}


