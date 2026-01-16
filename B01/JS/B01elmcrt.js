function crtElm(){	        
  /*   var contentdiv=getElementsByAttribute('class','tab_content');	  
	var tabnames=getElementsByAttribute('name','tablbl');			
     var firstCover=getElementsByAttribute('class','table_cover');	
	 firstCover[0].style.width="37%"; */
    /*  var thr1=document.getElementById('headrow1');	 
	 var array1 = ['料品編號','品名規格'];
	 var array2 = ['50%','40%'];
	for (var j = 0; j < array1.length; j++) {
		var th1 = document.createElement('th'); //column		   
		var text = document.createTextNode(array1[j]); //cell		
		th1.style.width=array2[j];
		th1.appendChild(text);
		thr1.appendChild(th1);		
	}	 */
   /*  var secondCover=document.createElement('div');	 
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="63%";
    var righttbl1=document.createElement("table");
	righttbl1.id="rightMember1";	 
    var arrayRgt1=["料品編號","品名規格","管理類別","歸屬類別","保存期限:","計料單位:",
	"標準售價:","保管部門:","總庫存量:","在庫數量:","庫存上限:","安全存量:",
	"料架位置:","建立料表:","領料類別:","領用批量:","採購前置:","收發料前置:",
	"標準進價:","平均成本:","備註說明:","物料類別:","產    地:","最後更新:"];
     var arrayRgt2=["<span name='b01value' id='stock_no' ></span>","<span name='b01value' id='stock_name'></span>",
	 "<span name='b01value' id='type_of_mnge' ></span>","<span name='b01value' id='kind_of_belong_to'></span>",
	 "<span name='b01value' id='keepdays' ></span>","<span name='b01value' id='each_count'></span>",
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
				 if(getAuth[0]()[7]!='Y'){
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
	secondCover.appendChild(righttbl1); 
    contentdiv[0].appendChild(secondCover);   //畫面右邊欄位
  //  var keynames=getElementsByAttribute('name','keyname');	
	 var fatherkeys=getElementsByAttribute('name','fatherkey');	 */
    /* if(getAuth[0]()[5]=='Y'){	 //有查看報價紀錄權限時
	   
		var rspn2=document.getElementById('serverResponse2'); 
	    var text01 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    contentdiv[1].insertBefore(text01,rspn2);
	    var spn1=document.createElement('span');
	    spn1.id="ttltitle";
        spn1.innerHTML="報價筆數:";
	    contentdiv[1].insertBefore(spn1,rspn2);
	    var spn3=document.createElement('span');
	    spn3.id="ttlmny";       
	    spn3.innerHTML='0';
	    contentdiv[1].insertBefore(spn3,rspn2);	 
	    //keynames[0].innerHTML="料號:";	
 	
    }else{
        contentdiv[1].style.display='none';
	    tabnames[1].style.display='none';        
    }	   
    if(getAuth[0]()[6]=='Y'){	        //有查看詢價紀錄權限時
      
        var rspn3=document.getElementById('serverResponse3'); 
	    var text02 = document.createTextNode('\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}\u{A0}');
	    contentdiv[2].insertBefore(text02,rspn3);
	    var spn4=document.createElement('span');
	    spn4.id="ttltitle1";
        spn4.innerHTML="詢價筆數:";
	    contentdiv[2].insertBefore(spn4,rspn3);
	    var spn5=document.createElement('span');
	    spn5.id="ttlmny1";
	    spn5.innerHTML='0';
	    contentdiv[2].insertBefore(spn5,rspn3);  	
		
    }else{
		contentdiv[2].style.display='none';
	    tabnames[2].style.display='none';
	} */
	
}




 
