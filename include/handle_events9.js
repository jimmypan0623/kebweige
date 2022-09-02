
   function attachEventListener(target,eventType,functionRef,capture)
   {
	   if (typeof target.addEventListener!="undefined")
	   {
		   target.addEventListener(eventType,functionRef,capture);
	   }
	   else if (typeof target.addachEvent!="undefined")
	   {
		   var functionString=eventType+functionRef;
		   target["e"+functionString]=functionRef;
	       target[functionString]=function(event)
		   {
			   if (typeof event=="undefined")
			   {
				   event=window.event;
			   }
			   target["e"+functionString](event);
		   };		   
		   target.attachEvent("on"+eventType,target[functionString]);
	   }
	   else
	   {
		   eventType="on"+eventType;
		   if (typeof target[eventType]=="function")
		   {
			   var oldListener=target[eventType];
			   target[eventType]=function()
			   {
				   oldListener();
				   return functionRef();
			   };
		   }
		   else
		   {
			   target[eventType]=functionRef;
		   }
	   }
   }
   function detachEventListener(target,eventType,functionRef,capture)
   {
	   if (target.removeEventListener !="undefined")
	   {
		   target.removeEventListener(eventType,functionRef,capture);
	   }
	   else if (typeof target.detachEvent!="undefined")
	   {
		   var functionString=eventType+functionRef;
		   target.detachEvent("on"+eventType,target[functionString]);
		   target["e"+functionString]=null;
		   target[functionString]=null;
	   }
	   else
	   {
		   target["on"+eventType]=null;
	   }
   }
   function stopEvent(event)
   {
	   if (typeof event.stopPropagation!="undefined")
	   {
		   event.stopPropagation();
	   }
	   else
	   {
		   event.cancleBubble=true;
	   }
   }
function getEventTarget(event)
{
   var targetElement=null;
   if (typeof event.target!=="undefined")
   {
	   targetElement=event.target;
   }
   else
   {
	   targetElement=event.srcElement;
   }
   while (targetElement.nodeType==3 && targetElement.parentNode!=null)
   {
	   targetElement=targetElement.parentNode;
   }
   return targetElement;
}
function stopDefaultAction(event)
{ 
/*    event.returnValue=false; 
   if (typeof event.preventDefault!="undefined")
   {
      event.preventDefault();
   } */
   return false;
}   

function paddingLeft(str,lenght){
	if(str.length >= lenght)
	return str;
	else
	return right(paddingLeft("0" +str,lenght),lenght);
}
function paddingRight(str,lenght){
	if(str.length >= lenght)
	return str;
	else
	return right(paddingRight(str+"0",lenght),lenght);
}
function left(str, num)
{
    return str.substring(0,num)
}

function right(str, num)
{
    return str.substring(str.length-num,str.length)
}