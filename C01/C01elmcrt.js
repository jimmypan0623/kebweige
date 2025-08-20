function crtElm(){	           
    var cntdiv=getElementsByAttribute('class','tab_content');  	
    var tbl1=document.getElementById("member1");
     tbl1.style.width="32%";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['編號','客戶名稱'];
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
	righttbl1.style.marginBottom='-438px'; 			
	var arrayRgt1=["客戶編號:","客戶名稱:","客戶簡稱:","重要等級:","統一編號:","客戶類型:",
	"主要產品:","地區別:","發票抬頭:","發票品號:","發票種類:","課稅別:",
	"英文名稱:","公司地址:","送貨地址:","英文地址:","出貨指示:","聯絡人:",
	"負責人:","電話:","傳真:","E-mail:","群組編號:","交易幣別:","結帳日期:","請款日:",
	"付款方式:","票期(T/T)天數:","業務擔當:","業務助理:","交貨方式:","收件人:","其他備註:","最後交易:",
	"最後報價:","最後更新:"];
     var arrayRgt2=["<span name='c01value' id='custom_no' ></span>","<span name='c01value' id='custom_name'></span>",
	 "<span name='c01value' id='custom_name_abbrv'></span>","<span name='c01value' id='level_of_impt'></span>",
	 "<span name='c01value' id='unite_no'></span>","<span name='c01value' id='business_type'>",
	 "<span name='c01value' id='main_product'></span>","<span name='c01value' id='area_domain'></span>",
	 "<span name='c01value' id='title_invoice'></span>","<span name='c01value' id='partno_invoice'>",
	 "<span name='c01value' id='typeofincoice'></span>","<span name='c01value' id='typeoftax'></span>",
	 "<span name='c01value' id='englishname'></span>","<span name='c01value' id='addrss'></span>",
	 "<span name='c01value' id='shipaddrss'></span>","<span name='c01value' id='englishaddrss'></span>",
	 "<span name='c01value' id='guide_ship'>","<span name='c01value' id='window_man'></span>",
	 "<span name='c01value' id='representive'></span>","<span name='c01value' id='tel_no'></span>",
	 "<span name='c01value' id='fax_no'></span>","<span name='c01value' id='emailaddrss'></span>",  
	 "<span name='c01value' id='gtoupno'></span>","<span name='c01value' id='typeofcrnt'></span>&nbsp&nbsp<span name='c01value' id='crnt_name'></span>",
	  "<span name='c01value' id='dayofincount'></span>","<span name='c01value' id='dayofcharge'></span>",
	 "<span name='c01value' id='typeofpay'></span>","<span name='c01value' id='paymentterm'></span>",
	 "<span name='c01value' id='sales_no'></span>&nbsp&nbsp<span name='c01value' id='sales_name'></span>","<span name='c01value' id='assistant_no'></span>&nbsp&nbsp<span name='c01value' id='assistant_name'></span>",
	 "<span name='c01value' id='wayofship'></span>","<span name='c01value' id='receiver'></span>",
	 "<span name='c01value' id='otherremark'></span>","<span name='c01value' id='lasttrade'></span>",
	 "<span name='c01value' id='lastquot'></span","<span name='c01value' id='lastchange'></span>"];  
	 var rowPop=[34,32,30,28,26,23,21,19,17,16,15,14,13,12,10,8,5,2,0]; //算好哪一欄要重新一列丟到陣列(逆排序)
	for(var i=0;i<arrayRgt1.length;i++){  //一陣列指示產生一列,完畢後pop掉
		if(i==rowPop[rowPop.length-1]){	
		    var oTr=righttbl1.insertRow(-1);		
			rowPop.pop();
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);
		 if (i==0 || i==22 ){
		     oTd.style.width='15%';		 
		 }
		  if (i==3){
		      oTd.style.width='5%';	
		  }
		 if(i==9 || i==33){
		     oTd.style.width='15%';		 
		 }
         oTd.innerHTML=arrayRgt2[i];
	}		
    cntdiv[0].appendChild(righttbl1);   //畫面右邊欄位	
///////////	
    var tabnames=getElementsByAttribute('name','tablbl');	
    tabnames[0].innerHTML="客戶基本資料";  
    var keynames=getElementsByAttribute('name','keyname');	
	var fatherkeys=getElementsByAttribute('name','fatherkey');	
    if(Cookies.get('auth05')=='Y'){	 //有查看報價紀錄權限時
	    var thr2=document.getElementById('headrow2');
        var array3 = ['料品編號','品名規格','客戶品號', '幣別','單價','包裝基量','最少訂購','報價單號','生效日期','有效期限','備註說明'];
	    var array4 = ['11.6%','11.6%','11%', '4%','8%','7%','7%','10%','8%','8%','10%'];
	    for (var k = 0; k < array3.length; k++) {
		    var th2 = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[k]); //cell		
		    th2.style.width=array4[k];
		    th2.appendChild(text);
		    thr2.appendChild(th2);		
	    }		    	     
	    tabnames[1].innerHTML="報價紀錄";  
		keynames[0].innerHTML="客戶編號:";	
	    var fatherkeys=getElementsByAttribute('name','fatherkey');	
	/*     fatherkeys[0].style.width="12%";
	    fatherkeys[0].size="6"; */
		var rspn2=document.getElementById('serverResponse2'); 
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    cntdiv[1].insertBefore(text01,rspn2);
	   var spn1=document.createElement('span');
	   spn1.id="ttltitle";
	   spn1.setAttribute("style","font-size:120%;font-weight:bold;");
       spn1.innerHTML="報價筆數:";
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


 
