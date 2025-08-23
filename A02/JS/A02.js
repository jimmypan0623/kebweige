function getProfile(str1,reccount,tbno) {      
    var cnt=0;
	var arr = str1;     
    var pagecount=Math.ceil(reccount/parseInt(getCookie('INT_RCD')));
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
				fildcnt++;				
	    		oTd.innerHTML=arr[i][jk];				
                if (tbno==0){				
	    	        if(jk=='rc_no' || jk=='lastupdate'){			 //表頭資料匯入
	    	     	   oTd.setAttribute("style","text-align:center;color:#7f8890;display:none;");		  	  
					   oTd.setAttribute("class","directdata"); 
				    }else {					   
					    if(jk=='email_add'){
							 oTd.setAttribute("style","width:20%;");
						      oTd.setAttribute("class","directdata");		
						}else if(jk=='tel_no'){
							 oTd.setAttribute("style","width:12%;");		
							 oTd.setAttribute("class","directdata");	
						}else if(jk=='dpt_name'){
							 oTd.setAttribute("style","width:8%;");			
							 oTd.setAttribute("class","indirectdata");					
						}else{
						   oTd.setAttribute("style","width:8%;");		
					       oTd.setAttribute("class","directdata");							   
						}  
						attachEventListener(oTd,'click',rowchoose,false);		//點選資料	    	        					   
				    }
                }else{      //表身資料a02匯入
			        if(jk=='rc_no' || jk=='lastupdate'){			 
		    	      oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	          oTd.setAttribute("class","directdata"); 		         				  
			        		   
		            }else {
						if(jk=='prg_no'){
							 oTd.setAttribute("style","width:8%;;text-align:center;");
							 oTd.setAttribute("class","directdata"); 
							 attachEventListener(oTd,'click',rowchoose,false);		//點選資料
						}else if(jk=='prg_name'){
						      oTd.setAttribute("style","width:17%;");
							  oTd.setAttribute("class","indirectdata"); 
							attachEventListener(oTd,'click',rowchoose,false);		//點選資料
			            }else if(right(jk,5)=='_auth'){							    
							   if(arr[i][jk]=='E'){
								  oTd.setAttribute("style","width:5%;;text-align:center;color:#BAF4D8;")  
							   }else{
							      oTd.setAttribute("style","width:5%;text-align:center;");
							   }
						       oTd.setAttribute("class","directdata"); 
							   attachEventListener(oTd,'click',rowchoose,false);		//點選資料
						}else if(right(jk,7)=='_remark'){
							if(arr[i][jk]){
								if(oTr.cells[fildcnt-6].innerHTML!='Y'){	
								  	 oTd.setAttribute("style","width:11%;text-decoration: line-through;color:#7f8890;");
								}else{
								     oTd.setAttribute("style","width:11%;");
								}
							}else{
							    oTd.setAttribute("style","width:11%;");							
							}
							oTd.setAttribute("class","indirectdata");
                            attachEventListener(oTd,'click',rowchoose,false);		//點選資料							  
						}else{
							 oTd.setAttribute("style","text-align:center;color:#7f8890;font-style:italic;display:none;");
		  	                 oTd.setAttribute("class","directdata"); 		         				  			        		   
						}					   
		            }					  		  
	           }	
			   
		    }		   
		   var oTd = oTr.insertCell(oTr.cells.length);		//再新增一欄 	
	       oTd.setAttribute("style","width:40px;display:none");   
	 	   var myCheck=document.createElement('input'); 
		   myCheck.type="checkbox";
		  
		    myCheck.setAttribute("name","chkbxmember"+(tbno+1).toString());   //讓使用者勾選的checkbox表頭	
		    
		   attachEventListener(myCheck,'click',chooserc,false);		   
		   oTd.appendChild(myCheck);  		   		  
	}
	   
	    
		 var responseDiv=document.getElementById("serverResponse"+(tbno+1).toString());  		
	  	  		  	   
	 
	   if(responseDiv.textContent=='Searching......'){	
		 if (cnt==0){
			 responseDiv.setAttribute("style","color:red;"); 
	   	     responseDiv.textContent="無此資料！Not found!検索できません。";
	      }else{ 		 
		     responseDiv.setAttribute("style","color:#536a60;"); 
             responseDiv.textContent="搜尋到 "+String(cnt)+" 筆資料。" +String(cnt)+" record"+(cnt>1?"s":"")+" match your search. " +String(cnt)+" レコードを検索。";            		 
          }	
	  }
	  if(cnt>0){       //初始畫面呼叫
		  chooserc(1);
	  }	  
}

function choseExtraDeal(targetTrChildren){   //紀錄移動
    
    return true;			   
}
function choseSecond(targetTrChildren,targetTr){
	 
   return true;	
}
function rowchoseExtraDeal(targetRow){    //紀錄移動
    
    return true;			   
}	
function rowchoseSecond(targetRow){    //紀錄移動
   return true;	
}

