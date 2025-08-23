 addLoadListener(draw_m);
//從這邊開始 
var wgp=[];  //設定閉包變數與函數
 wgp[0] = wgpCount();
 wgp[1] = wgpCount();
function wgpCount() {
      var x = 0;
       function f(y) {
           return x += y;
       };
       return f;
}		 
function draw_m(){ 
    var metas=document.getElementsByTagName('meta');		 
    var htmfile=getCookie('INT_HTM');
	var urlfolder=document.getElementsByTagName('title');
	var urlpath=urlfolder[0].innerHTML;
	var dataIp=getCookie('svripmd5');	
	if(htmfile==urlpath && dataIp==metas[1].content){
	   //////
	    var rat=0.6;      //倍率
	    var S=100*rat;   //圓心x座標
	    var T=100*rat;   //圓心y座標
	    var U=60*rat;        //整個圓的半徑
	    var V=U/2;   //30*rat;   //圓心與魚眼中心距離及等於魚頭半徑
	   // var W=V;   //30*rat;   //魚頭半徑
	   var X=U/6;   //10*rat;   //魚眼半徑	
       setInterval(drawtai,150,S,T,U,V,X);   //每轉一步停留150毫秒(不含畫圖時間) 	  
    }else{	  		
	    alert('資料與程式不齊!');
		window.parent.document.location.href="../logOut.php";     
	}		
}  
function drawtai(x1,y1,rd,d1,r2){
    var canvas=document.getElementById('m_draw');   
    var ctx=canvas.getContext("2d");
    var flg=wgp[0](1);
	//順時鐘旋轉(北半球)
	var i=2.99+flg/100;  //每次轉動小數兩位會比較smooth
	var j=i%4;
	var k=(i+2)%4;
	var l=k;
	var m=(k+2)%4;
	
	// 畫右半圓黑	  
    ctx.beginPath();
	/* 	ctx.arc(100,100,60,Math.PI/2,Math.PI*3/2,true);	*/
    ctx.arc(x1,y1,rd,Math.PI*(l/2),Math.PI*(m/2),true);		
	ctx.fillStyle="rgb(0,0,0)";       //BLACK    		
	ctx.fill();			 
    //畫左邊半圓白		
    ctx.beginPath();
   	/*     ctx.arc(100 ,100 ,60,Math.PI*3/2,Math.PI/2,true);  //1 		*/	
	ctx.arc(x1,y1,rd,Math.PI*(j/2),Math.PI*(k/2),true);		
    ctx.fillStyle="rgb(240,230,140)";   //Light Khaki	 	 	 
    ctx.fill();		

	//畫下半部黑魚頭與右半邊黑魚尾連成一片
	var x2=x1+d1*Math.cos(Math.PI*(l/2));
	var y2=y1+d1*Math.sin(Math.PI*(l/2)); 
	ctx.beginPath();
	ctx.arc(x2,y2,d1,0,Math.PI*2,true);		 
	/* ctx.arc(x2,y2,d1,Math.PI*(j/2),Math.PI*(k/2),true);	*/
	ctx.fillStyle="rgb(0,0,0)";   
	ctx.fill();	 		  
	//畫上半部白魚頭與左半邊白魚尾連成一片
	var x3=x1+d1*Math.cos(Math.PI*(l/2)+Math.PI);
	var y3=y1+d1*Math.sin(Math.PI*(l/2)+Math.PI);
	ctx.beginPath();		
	ctx.arc(x3,y3,d1,0,Math.PI*2,true);		 
	/*  ctx.arc(x3,y3,d1,Math.PI*(l/2),Math.PI*(m/2),true);		*/
	ctx.fillStyle="rgb(240,230,140)";     		  
	ctx.fill();	 		
	//畫黑魚頭的白眼睛
    ctx.beginPath();		
	ctx.arc(x3,y3,r2,0,Math.PI*2,true);		
	ctx.fillStyle="rgb(0,0,0)";    
	ctx.fill();	
    //畫白魚頭的黑眼睛		  
    ctx.beginPath();		
	ctx.arc(x2,y2,r2,0,Math.PI*2,true);		
	ctx.fillStyle="rgb(240,230,140)";      		  
	ctx.fill();	 		
	if(flg==401){
		var bau=wgp[0](0);   //找出閉包筆數變數現值
	    wgp[0](bau*(-1));    //將閉包變數歸零			
		var lastRcd=wgp[1](0); 		   
		ctx.font="15pt Arial Black";       	 
		ctx.strokeStyle="rgb(255,255,255)";
	    //    ctx.strokeText(lastRcd, 90, 198);		
		if(lastRcd==60){
			bau=wgp[1](0);   //找出閉包筆數變數現值
			wgp[1](bau*(-1));    //將閉包變數歸零 			
		}
		var nowRcd=wgp[1](1);					
		ctx.font="15pt Arial Black";       	 
		ctx.strokeStyle="rgb(255,0,0)";
	    // ctx.strokeText(nowRcd, 90, 198);
		wgp[0](1);           //修正
	} 		    		 
}