function initSoccerBall()
{
	document.getElementById("filestand").animationTimer=
	setInterval('moveObjectDecelerate(document.getElementById("filestand"),800,100,25)',50);
}
//path2
function moveObjectDecelerate(target,destinationLeft,destinationTop,maxSpeed)
{
	var currentLeft=parseInt(retrieveComputedStyle(target,"left"));
	var currentTop=parseInt(retrieveComputedStyle(target,"top"));	
	if (isNaN(currentLeft))
	{
		currentLeft=0;
	}
	if (isNaN(currentTop))
	{
		currentTop=0;
	}
    if (typeof target.floatingPointLeft=="undefined")
	{
        target.floatingPointLeft=currentLeft;
        target.floatingPointTop=currentTop;
	}
	var decelerateLeft=1+Math.abs(destinationLeft-target.floatingPointLeft)/50;
	var decelerateTop=1+Math.abs(destinationTop-target.floatingPointTop)/50;
	if (decelerateLeft>maxSpeed)
	{
		decelerateLeft=maxSpeed;
	}
	if (decelerateTop>maxSpeed)
	{
		decelerateTop=maxSpeed;
	}
	if (target.floatingPointLeft<destinationLeft)
	{
		target.floatingPointLeft+=decelerateLeft;
		if (target.floatingPointLeft>destinationLeft)
		{
			target.floatingPointLeft>destinationLeft;
		}
	}
	else
	{
		target.floatingPointLeft -= decelerateLeft;
		if (target.floatingPointLeft<destinationLeft)
		{
			target.floatingPointLeft=destinationLeft;
		}
	}
	if (target.floatingPointTop<destinationTop)
	{
		target.floatingPointTop+=decelerateTop;
		if (target.floatingPointTop>destinationTop)
		{
			target.floatingPointTop=destinationTop;
		}
	}
	else 
	{
		target.floatingPointTop-=decelerateTop;
		if (target.floatingPointTop<destinationTop)
		{
			target.floatingPointTop=destinationTop;
		}
	}
	target.style.left=parseInt(target.floatingPointLeft)+"px";
	target.style.top=parseInt(target.floatingPointTop)+"px";
	if (target.floatingPointLeft==destinationLeft && target.floatingPointTop==destinationTop)
	{
		clearInterval(target.animationTimer);
	}
}