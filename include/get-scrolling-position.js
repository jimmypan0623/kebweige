function getScrollingPosition()
{
	var position=[0,0];
	if (typeof window.pageYOffset !='undefined')
	{
		position=[window.pageXOffset,window.pageXOffset];
	}
	else if (typeof document.documentElement.scrollTop!='undefined' && document.documentElement.scrollTop>0 && document.documentElement.scrollLeft>0)
	{
		position=[document.documentElement.scrollLeft,document.documentElement.scrollTop];
	}
	else if (typeof document.body.scrollTop!='undefined')
	{
		position=[document.body.scrollLeft,document.body.scrollTop];
	}
	return position;
}
function getPosition(theElement){
    var positionX=0;
	var positionY=0;
	while (theElement!=null)
	{
		positionX += theElement.offsetLeft;
		positionY += theElement.offsetTop;
		theElement=theElement.offsetparent;
	}
	return [positionX,positionY];

}