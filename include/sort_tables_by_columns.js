addLoadListener(initSortabletables);

function initSortabletables()
{
	if (identifyBrowser() !="ie5mac")
	{
		var tables=getElementsByAttribute("class","datalist");
		for (var i=0;i<tables.length;i++)
		{
			var ths=tables[i].getElementsByTagName("th");
			for (var k=0;k<ths.length;k++)
			{ 
		     
				var newA=document.createElement("a");
				newA.setAttribute("href","#");
				if (k<ths.length-1)				    
				    newA.setAttribute("title","以此欄位為鍵值由小到大排序"); //newA.setAttribute("title","Sort by this column in descending order");
				else
					newA.setAttribute("title","全部選取");
				for (var m=0;m<ths[k].childNodes.length;m++)
				{
					newA.appendChild(ths[k].childNodes[m]);
				}
				ths[k].appendChild(newA);	
				if (k<ths.length-1)
				   attachEventListener(newA,"click",sortColumn,false);
			    else
				    attachEventListener(newA,"click",canCelshr,false);
			}
		}
	}
	return true;
}
function sortColumn(event)
{
	if (typeof event=="undefined")
	{
		event=window.event;
	}
	var targetA=getEventTarget(event);
	while (targetA.nodeName.toLowerCase() !="a")
	{
		targetA=targetA.parentNode;
	}
	
	
	var targetTh=targetA.parentNode;
	var targetTr=targetTh.parentNode;
	var targetTrChildren=targetTr.getElementsByTagName("th");
	var targetTable=targetTr.parentNode.parentNode;
	var targetTbody=targetTable.getElementsByTagName("tbody")[0];
	var targetTrs=targetTbody.getElementsByTagName("tr");
	var targetColumn=0;
	for (var i=0;i<targetTrChildren.length;i++)
	{
		targetTrChildren[i].className=targetTrChildren[i].className.replace(/(^| )sortedDescending( |$)/,"$1");
		targetTrChildren[i].className=targetTrChildren[i].className.replace(/(^| )sortedAscending( |$)/,"$1");
		if (targetTrChildren[i]==targetTh)
		{
			targetColumn=i;
			if (targetTrChildren[i].sortOrder=="descending" && targetTrChildren[i].clicked)
			{
			   if(i<targetTrChildren.length-1){
				  targetTrChildren[i].sortOrder="ascending";
				  targetTrChildren[i].className+="sortedAscending";
				//targetA.setAttribute("title","Sort by this column in descending order");
			   
				   targetA.setAttribute("title","以此欄位為鍵值由大到小排序");
			   }
			}
			else
			{
				if (targetTrChildren[i].sortOrder=="ascending" && !targetTrChildren[i].clicked)
				{
					targetTrChildren[i].className+="sortedAscending";
				}
				else
				{
				   if (i<targetTrChildren.length-1){
					targetTrChildren[i].sortOrder="descending";
					targetTrChildren[i].className+="sortedDescending";
					//targetA.setAttribute("title","Sort by this column in ascending order");
				   
					   targetA.setAttribute("title","以此欄位為鍵值由小到大排序");
				   }   
				}
			}
			targetTrChildren[i].clicked=true;
		}
		else
		{
			targetTrChildren[i].clicked=false;
			if (targetTrChildren[i].sortOrder=="ascending")
			{
			  if(i<targetTrChildren.length-1){
				//targetTrChildren[i].firstChild.setAttribute("title","Sort by this column in ascending order");
				targetTrChildren[i].firstChild.setAttribute("title","以此欄位為鍵值由小到大排序");
			  }
			}
			else
			{
				if(i<targetTrChildren.length-1){
				  //targetTrChildren[i].firstChild.setAttribute("title","Sort by this column in desscending order");
			  	  targetTrChildren[i].firstChild.setAttribute("title","以此欄位為鍵值由小到大排序");
				}
			}
		}
	}
	var newTbody=targetTbody.cloneNode(false);
	for (var i=0;i<targetTrs.length;i++)
	{
		var newTrs=newTbody.childNodes;
		var targetValue=getInternalText(targetTrs[i].getElementsByTagName("td")[targetColumn]);
		for (var j=0;j<newTrs.length;j++)
		{
			var newValue=getInternalText(newTrs[j].getElementsByTagName("td")[targetColumn]);
			if (targetValue==parseInt(targetValue,10) && newValue==parseInt(newValue,10))
			{
				targetValue=parseInt(targetValue,10);
				newValue=parseInt(newValue,10);
			}
			else if (targetValue==parseFloat(targetValue) && newValue==parseFloat(newValue))
			{
				targetValue=parseFloat(targetValue,10);
				newValue=parseFloat(newValue,10);
			}
			if (targetTrChildren[targetColumn].sortOrder=="descending")
			{
				if (targetValue>=newValue)
				{					
				  break;					
				}
			}
			else
			{
				if (targetValue<=newValue)
				{
					break;
				}
			}
		}
		if (j>=newTrs.length)
		{
			newTbody.appendChild(targetTrs[i].cloneNode(true));
		}
		else
		{
			newTbody.insertBefore(targetTrs[i].cloneNode(true),newTrs[j]);
		}
	}
	if (Cookies.get('auth02')=='Y' || Cookies.get('auth03')=='Y'){  //如果有修改刪除權限
	   for(var i=0;i<newTbody.rows.length;i++){   //再把最後一欄的chekbox click動作加回去
		   var myCheck=newTbody.rows[i].childNodes[targetTbody.rows[i].childNodes.length-1].childNodes[0];		 
		   attachEventListener(myCheck,'click',chooserc,false);	 
       }	
	}   
	targetTable.replaceChild(newTbody,targetTbody);    	
	stopDefaultAction(event);	
	var responseDiv=document.getElementById("serverResponse");	 
	responseDiv.innerHTML='&nbsp'; 	 
	return false;
}

function getInternalText(target)
{
	var elementChildren=target.childNodes;
	var internalText="";
	for (var i=0;i<elementChildren.length;i++)
	{
		if (elementChildren[i].nodeType==3)
		{
			if (!/^\s*$/.test(elementChildren[i].nodeValue))
			{
				internalText+=elementChildren[i].nodeValue;
			}
		}
		else
		{
			internalText+=getInternalText(elementChildren[i]);
		}
	}
	return internalText;
}
function canCelshr(event)  //最後一欄取消選取或全選
{
	if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetA=getEventTarget(event);
	var targetTh=targetA.parentNode;
	var targetTr=targetTh.parentNode;
	var targetTrChildren=targetTr.getElementsByTagName("th");
	var targetTable=targetTr.parentNode.parentNode;
	var targetTbody=targetTable.getElementsByTagName("tbody")[0];
	var targetTrs=targetTbody.getElementsByTagName("tr");
	 
	if (targetA.textContent=="選取"){	
        	
	    for (var i=0;i<targetTbody.rows.length;i++){
			if (!targetTrs[i].lastChild.childNodes[0].checked && targetTrs[i].lastChild.childNodes[0].style.display!='none'){
			    targetTrs[i].lastChild.childNodes[0].checked="checked";
				targetTrs[i].style.backgroundColor="#B9B9FF";
	
				cko(1);			 
			}
		}
	    targetA.textContent="取消";
		targetA.setAttribute("title","全部取消勾選");
        var responseDiv=document.getElementById("serverResponse");	 
	    responseDiv.innerHTML='&nbsp'; 	 
   }else{	
    
		  for (var i=0;i<targetTbody.rows.length;i++){
			if (targetTrs[i].lastChild.childNodes[0].checked){
			    targetTrs[i].lastChild.childNodes[0].checked=false;
				targetTrs[i].style.backgroundColor="#BAF4D8";
				cko(-1);		  
			} 
			
		}
        targetA.textContent="選取";
		targetA.setAttribute("title","全部選取");
   }	
	return true;		
}				