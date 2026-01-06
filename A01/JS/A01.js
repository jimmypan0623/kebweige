function getProfile(str1,reccount,tbno) {    
    var cnt=0;
	var arr = str1; 
     var pagecount=Math.ceil(reccount/parseInt(getAuth[2]()[0].INT_RCD));  
    var optdigts= (pagecount.toString()).length;
	if (tbno==0){     //如果是表頭       
        var slt2=document.getElementById('recmth');
	    if (slt2.options.length<pagecount){
    		for (var i=slt2.options.length+1;i<=pagecount;i++){
			    var item_no=paddingLeft(i,optdigts);				
		        var varItem=new Option(item_no,item_no);
	    	    slt2.options.add(varItem);	 
           }		  
		   		   //第一個選項位數修正		   
		   slt2.options[0].value=paddingLeft(1,optdigts);
		   slt2.options[0].text=paddingLeft(1,optdigts);
		    var bibau=cko[0](0);   //找出閉包筆數變數現值
	        cko[0](bibau*(-1));    //將閉包變數歸零
		    cko[0](reccount);      //將筆數記起來	          
	    }
		var oTable = document.getElementById("maintbody1");
		var fld=document.getElementById('recfield'); 
	}else{
	    var oTable = document.getElementById("maintbody2");
		var fld=document.getElementById('recfield2');
	}				
	for(var i=0;i<arr.length;i++){		
	    var oTr=oTable.insertRow(-1);	
        oTr.setAttribute("name","mainrow");	      		
        cnt++;		
		var fildcnt=0;
	    for(var jk in arr[i]){		   
	    	var oTd = oTr.insertCell(oTr.cells.length);		     		  
	    	oTd.innerHTML=arr[i][jk];	
			fildcnt++;
			var ara=jk.substr(jk.lastIndexOf('_')-3,3);		
			var ks=ara.split('');		
			//ks[0]:直接或間接 D/I
			//ks[1]:是否顯示   S/H
			//ks[2]:靠左中或右 L/C/R	
			if(ks[0]=="D"){
				oTd.setAttribute("class","directdata");	
			  	if(jk.indexOf('_auth_')>-1 && tbno==1){
				    if(arr[i][jk]=='E'){
						oTd.setAttribute("style","width:5%;;text-align:center;color:#BAF4D8;")  
					}else{
						oTd.setAttribute("style","width:5%;text-align:center;");
					}				 
				} 
			}else{
				oTd.setAttribute("class","indirectdata");	
				if(jk.substr(5,7)=='_remark'){
				    if(oTr.cells[fildcnt-6].innerHTML!='Y'){									  
				    	oTd.setAttribute("style","width:11%;text-decoration: line-through;color:#7f8890;");
				    }else{
					    oTd.setAttribute("style","width:11%;");
				    }
				}
			}				 
			if(ks[1]=='H'){
				oTd.setAttribute("style","display:none;");		
			}else{
			   oTd.style.textAlign=(ks[2]=="L"?"left":(ks[2]=="C"?"center":"right"));
			   var wdthln=jk.substr(jk.lastIndexOf('_')+1,3);  	  	
			   oTd.style.width=wdthln+"%";
			   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			}					 			
		} 	
        var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	    oTd.setAttribute("style","display:none");   //勾選不顯示
	 	var myCheck=document.createElement('input'); 
		myCheck.type="checkbox";  		  
		myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());   //讓使用者勾選的checkbox表頭				 	
		attachEventListener(myCheck,'click',chooserc,false);		   
		oTd.appendChild(myCheck);           
	}	  
	var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());  	
	if(responseDiv.innerHTML=='Searching......'){	
		if (cnt==0){
			responseDiv.setAttribute("style","color:red;"); 
	   	    responseDiv.innerHTML="無此資料！Not found!検索できません。";
	    }else{ 		 
		    responseDiv.setAttribute("style","color:#536a60;"); 
            responseDiv.innerHTML="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
        }	
	}
	if(cnt>0){       //初始畫面呼叫
		chooserc(1);
	}	  
}

function choseExtraDeal(targetTrChildren,targetTr){   //初始或搜尋換首頁紀錄移動額外處理事項
    var authbase=document.getElementsByName('authBase');
	if(authbase.length>0){
	   for(var j=0;j<authbase.length;j++){
	      authbase[j].innerHTML=targetTrChildren[j+3].textContent;
	   }
	}
    var authextra=document.getElementsByName('authExtra');
	if(authextra.length>0){
	   for(var i=0;i<authextra.length;i++){
	      authextra[i].innerHTML=targetTrChildren[i+7].textContent;
	   }
	}
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){	 
   return true;	
}

function rowchoseExtraDeal(targetRow){    //首頁紀錄點選移動額外處理事項     
    var authbase=document.getElementsByName('authBase');
	if(authbase.length>0){
	   for(var j=0;j<authbase.length;j++){
	      authbase[j].innerHTML=targetRow.cells[j+3].textContent;
	   }
	}
    var authextra=document.getElementsByName('authExtra');
	if(authextra.length>0){
	   for(var i=0;i<authextra.length;i++){
	      authextra[i].innerHTML=targetRow.cells[i+7].textContent;
	   }
	}
    return true;			   
}	

function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}

function fldsgsroup(fidx,tbno){
	 var groups=[];
	if(tbno==0){
        var groups=[['directdata','block','center','7'],     
	                ['directdata','block','left','17'],   
	                ['directdata','block','center','5'],   
				    ['directdata','block','center','5'],   
					['directdata','block','center','5'],   
					['directdata','block','center','5'],   
	                ['directdata','block','left','10'],   	 
				    ['directdata','block','left','10'],   
					['directdata','block','left','10'],   
					['directdata','block','left','10'],   
					['directdata','block','left','10'],   
	                ['directdata','block','left','5'],  
                    ['directdata','block','left','10'], 
                    ['directdata','block','left','10'], 
                    ['directdata','block','left','10']
	              ];
	}else{
	    var groups=[['directdata','block','left','10'],    
	                ['indirectdata','block','left','15'], 
	                ['directdata','block','center','5'], 
	                ['directdata','block','center','5'],  
	                ['directdata','block','center','5'],  
	                ['directdata','block','center','5'],  
					['directdata','none','center','0'], 
	                ['directdata','none','center','0'],  
	                ['directdata','none','center','0'],  
	                ['directdata','none','center','0'],  
					['directdata','none','center','0'],  
					['indirectdata','block','left','11'], 
	                ['indirectdata','block','left','11'],  
	                ['indirectdata','block','left','11'],  
	                ['indirectdata','block','left','11'],  
					['indirectdata','block','left','11']
 	               ]; 	
	}		
    return groups[fidx];			  
}