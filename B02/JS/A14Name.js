function a14DepartName(event){	
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetDepartNo=getEventTarget(event);	
    
	var sendSrcRec="filename="+targetDepartNo.value;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="B02/BKND/A14DepartName.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);	             		 
			  		     
		        document.getElementById('deptname').innerHTML=rsp[0]['departname'];	
	          					 	          
		}
	}
	return;
}


function deptchoose(event)  //部門編號選擇
{
	if (typeof event=="undefined"){
		event=window.event;
	}
	var target=getEventTarget(event);	 
	var deptNo=document.getElementById('deptno');
	deptNo.value="";
    var deptName=document.getElementById('deptname');			
	deptName.innerHTML="";
	var maintable=document.getElementById("stuffTbody");  
	for(var i=0;i< maintable.rows.length; i++){			 
		if(maintable.rows[i].cells[maintable.rows[i].cells.length-1].childNodes[0].checked){
			deptNo.value=maintable.rows[i].cells[0].innerHTML;								 
			deptName.innerHTML=maintable.rows[i].cells[1].innerHTML;				
			break;
		}				 
	}             
	srchblkclose(event);	
	return true;
}	