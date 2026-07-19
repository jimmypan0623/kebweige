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
		
		

async function FunDetailArg(arg) {
    // 1. 重構參數與 URL
    const sendSrcRec = `filename=${arg.substr(0, 3)}|${window.parent.getAuth[1]()[0]}`;
    //const url = `BKND/FunDetail.php?timestamp=${Date.now()}`;
    const url = "BKND/FunDetail.php";
    try {
        // 2. 使用 fetch 發送 POST 請求
        const response = await fetch(url, {
            method: 'POST',
			cache: 'no-store', // 👈 關鍵：強制每次都向伺服器重新請求
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: sendSrcRec
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 3. 解析 JSON 
        const rsp = await response.json();

        // 4. 權限與資料處理
        if (rsp === "NO") {
            window.parent.blkshow(`您無${arg}操作權限`);
        } else {
            setArg(rsp);
        }
    } catch (error) {
        console.error("請求失敗:", error);
        // 可依需求加入錯誤提示，例如：alert("系統連線失敗，請稍後再試");
		alert("系統連線失敗，請稍後再試");
    }
}