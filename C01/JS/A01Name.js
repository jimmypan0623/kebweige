function a01AccountName(event){	   //////找出人員姓名
   if (typeof event=="undefined")
	{
		event=window.event;
	}	
	var targetCustomNo=getEventTarget(event);		
	var sendSrcRec="filename="+targetCustomNo.value;		
		var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="A01/BKND/A01AccountName.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    
             rsp=JSON.parse(request.responseText);			 			
			 if(targetCustomNo.id=='whono'){		     
		        document.getElementById('whonameEx').innerHTML=rsp[0]['accountname'];		
	         }else{
		        document.getElementById('assistnameEx').innerHTML=rsp[0]['accountname'];		
	         }		 	
		  }
	}
	return;
}
