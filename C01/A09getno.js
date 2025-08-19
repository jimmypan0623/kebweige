/////////
////單據編號
function objGetNo(idno,whichobj){
	var askForObjNo="filename="+whichobj;	//在此下SQL語法傳給後端PHP		 	
		
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="C01/A0isrch.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(askForObjNo);		
		function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    		   	  
		         var idfield=document.getElementById(idno);
				
			     idfield.value=request.responseText.trim();	           
	             idfield.readOnly=true;
			  }
	    }	
 	  			 
}
function discardNoRec(whichobj,crntNo)
{	var recileObjNo="filename="+whichobj+"|"+crntNo;	
	    if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	   var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;		 
		var url="C01/A0iwrt.php?timestamp="+new Date().getTime();	     		 
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(recileObjNo);		
		  function respond(){           
		  if (request.readyState == 4 && request.status == 200) {    		   	  
		          
			  }
	    }	  
 	  			 
}	

