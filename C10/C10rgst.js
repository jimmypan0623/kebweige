
function blocksclose(event)  //關閉註冊彈出視窗
{	
	if (typeof event=="undefined"){
		event=window.event;
	}	
	var target=getEventTarget(event);
	
	var dropsheet=document.getElementById("myModal");
	dropsheet.style.display="none";       //關閉視窗 
	
	if (dropsheet!=null){		
        dropsheet.parentNode.removeChild(dropsheet);  //並將這些元素移除	 
	}   	 	
	return true;
}	
function topAndWidthModify(dropsheet_content,dropsheet,txtword){
	dropsheet_content.style.width="50%";   //原訊息內框畫面寬度調整  
    dropsheet.style.paddingTop="25px";      // 高度也往上提 	
    return true;
}
function initFocusField(txtword,tbno,aWaitUpdate,notWaitdata,ajTable){  //在此無作用但也要有此函數被呼叫
    if (txtword==7) {
        var txtseek=document.getElementById('searchWords');
		txtseek.focus();
		attachEventListener(txtseek,'keypress',textKeypress,false);
			  
	}			
    return true;	
}
function searchOptionsKey(tbno,slt5){	
	 slt5.options.add(new Option('料品編號','b0d.F03'));
	 slt5.options.add(new Option('出貨單號','b0d.F01'));
	 slt5.options.add(new Option('日期','b04.F02'));
	  slt5.options.add(new Option('訂單號碼','b0d.F07'));
	 slt5.options.add(new Option('客戶編號','b04.F06'));
	 slt5.options.add(new Option('客戶簡稱','c01.F05'));
	 slt5.options.add(new Option('客戶PO','b0d.F09'));	
	  slt5.options.add(new Option('業務編號','b04.F09')); 
     slt5.options.add(new Option('業務姓名','a01.F03')); 
}
function searchKeyHint(tbno){    //搜尋畫面出現提示
    return "搜尋出貨月報表對照欄位選擇";
}


function tab1View(event){	  
       if (typeof event=="undefined"){
		   event=window.event;
    	}
	
		 var bibau=cko[2](0);   //找出閉包變數現值
	     cko[2](bibau*(-1));    //將表身閉包變數歸零	  
		  bibau=cko[6](0);   //找出閉包變數現值
	     cko[6](bibau*(-1));    //將表身閉包變數歸零 
		var crntpge=document.getElementById('recmth').value ;
		
		//if (crntpge*1>=1) {
		  choiceClick(left(crntpge,7));
		//}
	

}

