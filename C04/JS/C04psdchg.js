/**
 * 優化建議：
 * 1. 統一按鈕建立工廠 (createBtn)，簡化重複的 setAttribute。
 * 2. 修正 visiblity -> visibility 拼字錯誤。
 * 3. 採用 DocumentFragment 一次性插入，提升渲染效能。
 * 4. 強化分頁切換時 AccessKey 的自動分配邏輯。
 */
function selfTag(jsvsn, jsPth) {
	 var contentdiv=getElementsByAttribute('class','tab_content');	
    const maindiv = document.getElementsByClassName('tab_css')[0];
    const beinsertedid = document.getElementById('tab1');
    const cntdiv1 = document.querySelectorAll('.tab_content')[1];
    const rspn2 = document.getElementById('serverResponse2');
    const orpButton5 = document.getElementById("lgt"); // 離開按鈕
	////
    var firstCover=getElementsByAttribute('class','table_cover');
	firstCover[1].style.width="83%";	
	 var secondCover=document.createElement('div');
	secondCover.setAttribute("class","table_cover");
	secondCover.style.width="17%";
    righttbl1=document.createElement("table");
	righttbl1.id="rightContent1";	
	righttbl1.className="gridlist";
	righttbl1.setAttribute("style","width:100%;");
	 var thr2=document.createElement("thead"); 
	 var array3 = ['預出日期','數量'];
	 var array4 = ['50','50'];
	for (var i = 0; i < array3.length; i++) {
		var th2 = document.createElement('th'); //column	
		
		var text2 = document.createTextNode(array3[i]); //cell	
      
		th2.style.backgroundColor="#D6D6AD";
		th2.style.color="#000000";	
		 
		th2.style.width=array4[i];
		th2.appendChild(text2);
		
		thr2.appendChild(th2);		
	}	
	var tbdy2=document.createElement("tbody"); 
	tbdy2.id="contentTbody";
	righttbl1.appendChild(thr2);
	righttbl1.appendChild(tbdy2);    
	secondCover.appendChild(righttbl1); 	 
	contentdiv[1].appendChild(secondCover); 	
	
	////
	
	
    if (!maindiv || !beinsertedid) return;

    // --- 區塊 1: 狀態標籤與金額欄位 ---
    const spnApprove = document.createElement('span');
    spnApprove.id = "APPRVE";
    maindiv.insertBefore(spnApprove, beinsertedid);

    const fragInfo = document.createDocumentFragment();
    
    // 按鈕：查看出貨紀錄 (訂單特有)
    const btnOutRcd = btnManager.createBtn("OUTRCD_BOTT", "\u{1F4DC}", "查看出貨紀錄，快速鍵 Alt+W", "W", page2OtherButton1);
    btnOutRcd.setAttribute("style","font-size:120%;margin:0px;");
    const invDetailButton = btnManager.createBtn("INVDTL_BOTT", "\u{1F4E6}", "各庫別明細，快速鍵 Alt+B", "B", page2OtherButton2);
	invDetailButton.setAttribute("style","font-size:130%;margin:0px;");
	const mrpListButton = btnManager.createBtn("IFUTURE_BOTT", "\u{1F453}", "預期庫存異動明細，快速鍵 Alt+H", "H", page2OtherButton3);
	mrpListButton.setAttribute("style","font-size:120%;margin:0px;");
    const createSpan = (id, text, className) => {
        const s = document.createElement('span');
        s.id = id;
        if (text) s.innerHTML = text;
        if (className) s.className = className;
        return s;
    };

    fragInfo.append(
        document.createTextNode('\u00A0\u00A0'),
        btnOutRcd,
		document.createTextNode('\u00A0'.repeat(2)), // 合併空白
		invDetailButton,
        document.createTextNode('\u00A0'.repeat(2)), // 合併空白
		mrpListButton,
		document.createTextNode('\u00A0'.repeat(7)), // 合併空白
        createSpan("ttltitle", "總金額:"),
        createSpan("crncy", ""),
        createSpan("ttlmny", "0", "ttl")
    );
    if (cntdiv1) cntdiv1.insertBefore(fragInfo, rspn2);

    // --- 區塊 2: 功能按鈕 (確認/反確/轉單/列印) ---
    const fragButtons = document.createDocumentFragment();
    const btnStyle = "visibility:visible; font-size:130%; margin:0; color:black;";

    const btnAns = btnManager.createBtn("ANS_BOTT", "\u{2714}", "確認本訂單所有紀錄，快速鍵Alt+A", "A", ansproc);
    const btnVrs = btnManager.createBtn("VRS_BOTT", "\u{21A9}", "反確認本訂單所有紀錄，快速鍵Alt+Z", "Z", vrsproc);  //"\u{1F504}"
    const btnTrn = btnManager.createBtn("TRN_BOTT", "\u{1F4E4}", "直接轉出貨單，快速鍵Alt+G", "G", null); // 轉單

    [btnAns, btnVrs, btnTrn].forEach(btn => btn.style.cssText = btnStyle);

    fragButtons.append(btnAns, btnVrs, btnTrn, document.createTextNode('\u00A0'));

    // 權限判斷：列印按鈕
    if (getAuth[0]()[4] === 'Y') {
        const btnPrnt = btnManager.createBtn("PRNT_BOTT", "\u{1F5A8}", "列印所選紀錄，快速鍵Alt+P", "P", prntproc);
        btnPrnt.style.cssText = btnStyle;
        fragButtons.append(btnPrnt, document.createTextNode('\u00A0\u00A0'));
    }

    maindiv.insertBefore(fragButtons, orpButton5);

    // --- 區塊 3: 腳本清理與載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    const scriptList = [
        [`${prefix}.js?v=${jsvsn}`, () => { if(window.DrawTable) DrawTable(); }],
		[`${prefix}dlvdte.js?v=${jsvsn}`],
        [`${prefix}rgst.js?v=${jsvsn}`],		
        [`include/JS/commonsrch.js?v=${jsvsn}`],
        [`C01/JS/A09getno.js?v=${jsvsn}`],
        [`include/JS/confirmfun.js?v=${jsvsn}`],
        [`C01/JS/A01Name.js?v=${jsvsn}`],
		[`B01/JS/B01mrp.js?v=${jsvsn}`]
		 
    ];

    scriptList.forEach(cfg => loadScript(cfg[0], cfg[1] || null));

    // 事件監聽
    ['tab1', 'tab2'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", (id === 'tab1' ? tab1View : tab2View), false);
    });
}

// 輔助工具：閉包歸零
function resetCko() {
    [3, 6].forEach(idx => {
        if (cko[idx]) {
            const current = cko[idx](0);
            cko[idx](current * -1);
        }
    });
}

function tab1View() {
    const newBtn = document.getElementById('NEW_BOTT');
    const hasAuth = getAuth[0]()[1] === 'Y';
    
    if (newBtn) {
        newBtn.style.visibility = hasAuth ? "visible" : "hidden";
        if (hasAuth) attachEventListener(newBtn, "click", addrec, false);
        else detachEventListener(newBtn, "click", addrec, false);
    }

    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko();

    // 切換 AccessKey: tab1 啟動 T, J, K, V
    document.querySelectorAll('.btn').forEach(btn => {
        const lastChar = btn.title.slice(-1);
        if (['I', 'M', 'B'].includes(btn.accessKey)) btn.removeAttribute("accesskey");
        if (['T', 'J', 'K', 'V'].includes(lastChar)) btn.accessKey = lastChar;
    });
}

function tab2View(event) {
    const lclbk = document.getElementById('lclbtnbk');
    if (lclbk) {
        Object.assign(lclbk.style, {
            backgroundColor: "#F9FAD9",
            border: "2px solid #F9FAD9",
            boxShadow: "olivedrab 5px 10px 10px 7px"
        });
    }

    if (cko[2](0) === 0) {
        if (window.blkshow) blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }   
	if (typeof contentShow === 'function') {
        contentShow([]); // 清空右側預排資料
    }
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return;

    // 尋找選中的行
    const selectedRow = Array.from(maintable.rows).find(row => {
        const cb = row.cells[row.cells.length - 1].querySelector('input');
        return cb && cb.checked;
    });

    if (selectedRow) {
        const cells = Array.from(selectedRow.cells).map(c => c.innerHTML);
        const shrno = cells[cells.length - 3];
        
        document.getElementById('crncy').innerHTML = cells[cells.length - 9] + '&nbsp;';
        document.getElementById('keydscrpt1').innerHTML = `${cells[2]}&nbsp;${cells[3]}`;
        document.getElementById("fatherkey1").innerHTML = cells[1];
        document.getElementById("serverResponse2").innerHTML = '&nbsp;';

        resetCko();

        // 新增按鈕權限
        const newBtn = document.getElementById('NEW_BOTT');
        if (newBtn) {
            const canAdd = (shrno !== 'Y' && getAuth[0]()[1] === 'Y');
            newBtn.style.visibility = canAdd ? "visible" : "hidden";
            if (canAdd) attachEventListener(newBtn, "click", addrec, false);
            else detachEventListener(newBtn, "click", addrec, false);
        }

        // 切換 AccessKey: tab2 啟動 I, M, B
        if (event !== 'GY') {
            document.querySelectorAll('.btn').forEach(btn => {
                const lastChar = btn.title.slice(-1);
                if (['T', 'J', 'K', 'V'].includes(btn.accessKey)) btn.removeAttribute("accesskey");
                if (['I', 'M', 'B'].includes(lastChar)) btn.accessKey = lastChar;
            });
        }
        if (window.commontemp) commontemp(cells[1], "c04.F01");
    }
}

function prntproc() {
    const maintable = document.getElementById("maintbody1");
    const checked = maintable ? maintable.querySelector('input:checked') : null;
    
    if (!checked) {
        alert("請先選擇一筆訂單單據");
        return;
    }

    const row = checked.closest('tr');
    const cells = Array.from(row.cells).map(c => c.textContent.trim());

    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        ourCompany: (typeof getAuth !== 'undefined') ? getAuth[2]()[0].INT_000 : "",
        queryNo: cells[1],
        customNo: `${cells[2]}\u00A0${cells[4]}`,
        salesMan: `${cells[6]}\u00A0${cells[7]}\u00A0\u00A0\u00A0`,
        curNcy: cells[8],
        curName: cells[9],
        shipAddress: cells[11],
        shipDirect: cells[12],
        customerPo: `${cells[10]}\u00A0\u00A0\u00A0\u00A0`,
        isConfirm: cells[14],
        username: urlParams.get('username') || ""
    };

    const qs = new URLSearchParams(params).toString();
    window.open(`C04/BKND/C04report.php?${qs}`, "_blank");
}