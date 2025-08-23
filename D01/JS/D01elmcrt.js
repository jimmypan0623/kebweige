function crtElm(){	         
    var cntdiv=getElementsByAttribute('class','tab_content');		
    var tbl1=document.getElementById("member1");
     tbl1.style.width="32%";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['編號','廠商名稱'];
	 var array2 = ['22%','78%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}	
////////	
    righttbl1=document.createElement("table");
	righttbl1.id="rightMember1";	
	righttbl1.style.width='68%';
	righttbl1.style.left='32.3%';	
	righttbl1.style.height='432px';
    righttbl1.style.top='-88.5%';
	righttbl1.style.marginBottom='-432px'; 		
	
	var arrayRgt1=["廠商編號:","廠商名稱:","廠商簡稱:","品質等級:","統一編號:","營業項目:",
	"交貨方式:","公司地址:","工廠地址:","聯絡人:","負責人:","電話:",
	"傳真:","E-mail:","交易幣別:","結帳日期:","請款日:","付款方式:",
	"票期(T/T)天數:","採購人員:","其他備註:","最後交易:","最後更新:"];
     var arrayRgt2=["<td><span name='d01value' id='vender_no'></span>","<span name='d01value' id='vender_name'></span>",
	 "<span name='d01value' id='vender_name_abbrv'></span>","<span name='d01value' id='level_of_impt'></span>",
	 "<span name='d01value' id='unite_no'></span>","<span name='d01value' id='main_product'>",
	 "<span name='d01value' id='way_of_ship'></span>","<span name='d01value' id='addrss'></span>",
	 "<span name='d01value' id='shipaddrss'></span>","<span name='d01value' id='window_man'>",
	 "<span name='d01value' id='representive'></span>","<span name='d01value' id='tel_no'></span>",
	 "<span name='d01value' id='fax_no'></span>","<span name='d01value' id='emailaddrss'></span>",
	 "<span name='d01value' id='typeofcrnt'></span>&nbsp&nbsp<span span name='d01value' id='crnt_name'></span>","<span name='d01value' id='dayofincount'></span>",
	 "<span name='d01value' id='dayofcharge'>","<span name='d01value' id='typeofpay'></span>",
	 "<span name='d01value' id='paymentterm'></span>","<span name='d01value' id='proc_no'></span>&nbsp&nbsp<span name='d01value' id='proc_name'></span>",
	 "<span name='d01value' id='otherremark'></span>","<span name='d01value' id='lasttrade'></span>",  
	 "<span name='d01value' id='lastchange'></span>"];  
	 var rowPop=[21,20,19,17,14,13,11,9,8,7,5,2,0]; //算好哪一欄要重新一列丟到陣列(逆排序)
	for(var i=0;i<arrayRgt1.length;i++){  //一陣列指示產生一列,完畢後pop掉
		if(i==rowPop[rowPop.length-1]){
		  	
		    var oTr=righttbl1.insertRow(-1);		
			rowPop.pop();
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);
		 if (i==0 ){
		     oTd.style.width='12%';		 
		 }
		
         oTd.innerHTML=arrayRgt2[i];
	}		
    cntdiv[0].appendChild(righttbl1);   //畫面右邊欄位	
///////////	
    var tabnames=getElementsByAttribute('name','tablbl');	
	tabnames[0].innerHTML="廠商基本資料";
    var keynames=getElementsByAttribute('name','keyname');	
	 
    if(getCookie('auth05')=='Y'){	 //有查看報價紀錄權限時
	    var thr2=document.getElementById('headrow2');
        var array3 = ['料品編號','品名規格','廠商品號', '幣別','單價','包裝基量','最少訂購','前置天數','生效日期','有效期限','備註說明'];
	    var array4 = ['12%','12%','12%', '4%','7%','7%','7%','7%','8%','8%','12%'];
	    for (var k = 0; k < array3.length; k++) {
		    var th2 = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[k]); //cell		
		    th2.style.width=array4[k];
		    th2.appendChild(text);
		    thr2.appendChild(th2);		
	    }		    	     
	  
	    tabnames[1].innerHTML="詢價紀錄";  
		keynames[0].innerHTML="廠商編號:";	
	    var fatherkeys=getElementsByAttribute('name','fatherkey');	
	    /* fatherkeys[0].style.width="12%";
	    fatherkeys[0].size="6"; */
		var rspn2=document.getElementById('serverResponse2'); 
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    cntdiv[1].insertBefore(text01,rspn2);
	   var spn1=document.createElement('span');
	   spn1.id="ttltitle";
	   spn1.setAttribute("style","font-size:120%;font-weight:bold;");
       spn1.innerHTML="詢價筆數:";
	   cntdiv[1].insertBefore(spn1,rspn2);
	   var spn3=document.createElement('span');
	   spn3.id="ttlmny";
       spn3.setAttribute("style","font-size:120%;font-weight:bold;");
	   spn3.innerHTML='0';
	   cntdiv[1].insertBefore(spn3,rspn2);	 
	}else{
	    cntdiv[1].style.display='none';
	    tabnames[1].style.display='none';        
	}
 
}


 
