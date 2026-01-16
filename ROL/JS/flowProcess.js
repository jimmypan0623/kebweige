function setArg(arr){
          window.parent.getAuth[0]('Clear_All');
		 Object.values(arr[0]).forEach(value => {
            
			window.parent.getAuth[0](value);   //從這邊加入登入者在arg參數功能權限
			 
        }); 
     window.parent.getAuth[1]()[1]=window.parent.getAuth[0]()[0];
	 
	 window.parent.fieldsSet(window.parent.getAuth[1]()[1].substr(0,3));   //欄位直接設定
	 
	 window.parent.initDialog();
	 
}	
	const config = {
            startOnLoad: true,
			flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'cardinal' },
            securityLevel: 'loose', // Important for enabling click events
        };

        mermaid.initialize(config);
		
		
	function FunDetailArg(arg){	
         ;
	    var sendSrcRec="filename="+arg.substr(0,3)+"|"+window.parent.getAuth[1]()[0];		
		 
	    var rsp="";  	
        if(window.ActiveXObject){
		   var request = new ActiveXObject("Microsoft.XMLHttp");
	    }	
	       else if(window.XMLHttpRequest){
	   	      var request = new XMLHttpRequest();
        }			 
		request.onreadystatechange = respond;	       
		var url="BKND/FunDetail.php?timestamp="+new Date().getTime();			
	    request.open("POST",url);	 
	    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	    request.send(sendSrcRec);		
	    function respond(){           
		    if (request.readyState == 4 && request.status == 200) {    
                rsp=JSON.parse(request.responseText);					
			    if(rsp=="NO"){
				  
				       window.parent.blkshow("您無"+arg+"操作權限");
				     
			    }else{
			         
					  setArg(rsp);  
				}   
		    }
	    }
	  return;
    }	