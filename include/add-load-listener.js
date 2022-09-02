function addLoadListener(fn)
{
    if(typeof window.addEventListener !='undefined')
    {
        window.addEventListener('load',fn,false);
    }
    else if(typeof document.addEventListener !='undefined')
    {
        document.addEventListener('load',fn,false);
    }
    else if(typeof window.attachEvent !='undefined')
    {
        window.attachEvent('onload',fn);
    }
    else
    {
        var old=window.onload;
        if(window.onload !='function')
        {
            window.onload=fn;
        }
        else
        {
            window.onload=function()
            {
                old();
                fn();
            }
        }
    }
} 