function crtElm(){	        
    var cntdiv=getElementsByAttribute('class','tab_content');	  
	var tabnames=getElementsByAttribute('name','tablbl');		
	tabnames[0].innerHTML="物料基本資料"; 
    var tbl1=document.getElementById("member1");
     tbl1.style.width="37%";
     var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','品名規格'];
	 var array2 = ['50%','40%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}	
////////	
    var righttbl1=document.createElement("table");
	righttbl1.id="rightMember1";	 
    var arrayRgt1=["料品編號","品名規格","管理類別","歸屬類別","採購單位:","計料單位:",
	"採/計單位比:","保管部門:","總庫存量:","在庫數量:","庫存上限:","安全存量:",
	"料架位置:","建立料表:","領料類別:","領用批量:","採購前置:","收發料前置:",
	"標準售價:","平均成本:","備註說明:","物料類別:","產    地:","最後更新:"];
     var arrayRgt2=["<span name='b01value' id='stock_no' ></span>","<span name='b01value' id='stock_name'></span>",
	 "<span name='b01value' id='type_of_mnge' ></span>","<span name='b01value' id='kind_of_belong_to'></span>",
	 "<span name='b01value' id='each_prchs' ></span>","<span name='b01value' id='each_count'></span>",
	 "<span name='b01value' id='dividing' ></span>","<span name='b01value' id='who_hold'></span>&nbsp&nbsp&nbsp<span name='b01value' id='depart_name'></span>",
	 "<mark><span name='b01value' id='totalqty' ></span></mark>","<mark><span name='b01value' id='qyt_on_hand'></span></mark>",
	 "<span name='b01value' id='maxlimit_of_inv' ></span>","<span name='b01value' id='qty_of_safe'></span>",
	 "<span name='b01value' id='where_is' ></span>","<span name='b01value' id='bom_should_be'></span>",
	 "<span name='b01value' id='type_of_apply' ></span>","<span name='b01value' id='lotQty'></span>",
	 "<span name='b01value' id='leadtm_prchs' ></span>","<span name='b01value' id='leadtm_ready'></span>",
	 "<span name='b01value' id='sales_cost' ></span>","<span name='b01value' id='avg_cost'></span>",
	 "<span name='b01value' id='remark1' ></span>","<span name='b01value' id='mtr_type'></span>",
	 "<span name='b01value' id='rorgin_from' ></span>","<span name='b01value' id='who_and_when'></span>"];  
	for(var i=0;i<arrayRgt1.length;i++){
	    if(i%2==0){
		    var oTr=righttbl1.insertRow(-1);
			if(i==18){
				 oTr.setAttribute("class","costauth");
				 if(Cookies.get('auth07')!='Y'){
				     oTr.setAttribute("style","display:none;");				
				 }
			}
		}
		 var oTd = oTr.insertCell(oTr.cells.length);			
		oTd.setAttribute("class","Rgtkey"); 
		oTd.innerHTML=arrayRgt1[i];
		 var oTd = oTr.insertCell(oTr.cells.length);	 
         oTd.innerHTML=arrayRgt2[i];
	}		
    cntdiv[0].appendChild(righttbl1);   //畫面右邊欄位
///////////	
    var keynames=getElementsByAttribute('name','keyname');	
	 var fatherkeys=getElementsByAttribute('name','fatherkey');	
    if(Cookies.get('auth05')=='Y'){	 //有查看報價紀錄權限時
	    var thr2=document.getElementById('headrow2');
        var array3 = ['客戶編號','客戶簡稱','客戶品號', '幣別','單價','包裝基量','最少訂購','付款方式','報價單號','生效日期','有效期限','備註說明'];
	    var array4 = ['7%','7%','10%', '4%','8%','7%','7%','10%','10%','10%','10%','10%'];
	    for (var k = 0; k < array3.length; k++) {
		    var th2 = document.createElement('th'); //column		   
		    var text = document.createTextNode(array3[k]); //cell		
		    th2.style.width=array4[k];
		    th2.appendChild(text);
		    thr2.appendChild(th2);		
	    }		
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
		tabnames[1].innerHTML="客戶報價紀錄";
	    keynames[0].innerHTML="料號:";	
/* 	    fatherkeys[0].style.width="20%";
	    fatherkeys[0].size="43";	 */			
    }else{
        cntdiv[1].style.display='none';
	    tabnames[1].style.display='none';        
    }	   
    if(Cookies.get('auth06')=='Y'){	        //有查看詢價紀錄權限時
        var thr3=document.getElementById('headrow3');
        var array5 = ['廠商編號','廠商簡稱','廠商品號', '幣別','單價','包裝基量','最少訂購','付款方式','前置天數','生效日期','有效期限','備註說明'];
	    var array6 = ['7%','7%','10%', '4%','8%','7%','7%','10%','7%','10%','10%','10%'];
	    for (var l = 0; l < array5.length; l++) {
		    var th3 = document.createElement('th'); //column		   
		    var text = document.createTextNode(array5[l]); //cell		
		    th3.style.width=array6[l];
		    th3.appendChild(text);
		    thr3.appendChild(th3);		
	    }
        var rspn3=document.getElementById('serverResponse3'); 
	    var text02 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    cntdiv[2].insertBefore(text02,rspn3);
	    var spn4=document.createElement('span');
	    spn4.id="ttltitle1";
	    spn4.setAttribute("style","font-size:120%;font-weight:bold;");
        spn4.innerHTML="詢價筆數:";
	    cntdiv[2].insertBefore(spn4,rspn3);
	    var spn5=document.createElement('span');
	    spn5.id="ttlmny1";
        spn5.setAttribute("style","font-size:120%;font-weight:bold;");
	    spn5.innerHTML='0';
	    cntdiv[2].insertBefore(spn5,rspn3);  	
	    tabnames[2].innerHTML="廠商詢價紀錄";
		keynames[1].innerHTML="料號:";
/* 		fatherkeys[1].style.width="20%";
	    fatherkeys[1].size="43"; */
    }else{
		 cntdiv[2].style.display='none';
	    tabnames[2].style.display='none';
	}
	
}




 
