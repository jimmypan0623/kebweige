/**
 * C01psdchg.js 重構優化版本
 * 1. 採用 ES6+ 現代化 JavaScript 語法 (const/let, Array API, DOM 標準 API)。
 * 2. 抽離與重用輔助函式（resetCko 閉包歸零、setupButtons 按鈕顯隱與事件繫結、updateAccessKeys 等）。
 * 3. 使用 DocumentFragment 最佳化 DOM 節點插入，提升渲染效能與維護性。
 */

function selfTag(jsvsn, jsPth) {
    const cntdiv = document.querySelectorAll('.tab_content');
    const tabnames = document.getElementsByName('tablbl');

    // --- 1. 建立右側資料欄位結構 ---
    const firstCover = document.querySelector('.table_cover');
    if (firstCover) {
        firstCover.style.width = "32%";
    }

    const secondCover = document.createElement('div');
    secondCover.className = "table_cover";
    secondCover.style.width = "68%";

    const righttbl1 = document.createElement("table");
    righttbl1.id = "rightMember1";

    const arrayRgt1 = [
        "客戶編號:", "客戶名稱:", "客戶簡稱:", "重要等級:", "統一編號:", "客戶類型:",
        "主要產品:", "地區別:", "發票抬頭:", "發票品號:", "發票種類:", "課稅別:",
        "英文名稱:", "公司地址:", "送貨地址:", "英文地址:", "出貨指示:", "聯絡人:",
        "負責人:", "電話:", "傳真:", "E-mail:", "母公司編號:", "交易幣別:", "結帳日期:", "請款日:",
        "付款方式:", "票期(T/T)天數:", "業務擔當:", "業務助理:", "交貨方式:", "收件人:", "其他備註:", "最後交易:",
        "最後報價:", "最後更新:"
    ];

    const arrayRgt2 = [
        "<span name='c01value' id='custom_no'></span>", "<span name='c01value' id='custom_name'></span>",
        "<span name='c01value' id='custom_name_abbrv'></span>", "<span name='c01value' id='level_of_impt'></span>",
        "<span name='c01value' id='unite_no'></span>", "<span name='c01value' id='business_type'></span>",
        "<span name='c01value' id='main_product'></span>", "<span name='c01value' id='area_domain'></span>",
        "<span name='c01value' id='title_invoice'></span>", "<span name='c01value' id='partno_invoice'></span>",
        "<span name='c01value' id='typeofincoice'></span>", "<span name='c01value' id='typeoftax'></span>",
        "<span name='c01value' id='englishname'></span>", "<span name='c01value' id='addrss'></span>",
        "<span name='c01value' id='shipaddrss'></span>", "<span name='c01value' id='englishaddrss'></span>",
        "<span name='c01value' id='guide_ship'></span>", "<span name='c01value' id='window_man'></span>",
        "<span name='c01value' id='representive'></span>", "<span name='c01value' id='tel_no'></span>",
        "<span name='c01value' id='fax_no'></span>", "<span name='c01value' id='emailaddrss'></span>",
        "<span name='c01value' id='gtoupno'></span>", "<span name='c01value' id='typeofcrnt'></span>&nbsp;&nbsp;<span name='c01value' id='crnt_name'></span>",
        "<span name='c01value' id='dayofincount'></span>", "<span name='c01value' id='dayofcharge'></span>",
        "<span name='c01value' id='typeofpay'></span>", "<span name='c01value' id='paymentterm'></span>",
        "<span name='c01value' id='sales_no'></span>&nbsp;&nbsp;<span name='c01value' id='sales_name'></span>", "<span name='c01value' id='assistant_no'></span>&nbsp;&nbsp;<span name='c01value' id='assistant_name'></span>",
        "<span name='c01value' id='wayofship'></span>", "<span name='c01value' id='receiver'></span>",
        "<span name='c01value' id='otherremark'></span>", "<span name='c01value' id='lasttrade'></span>",
        "<span name='c01value' id='lastquot'></span>", "<span name='c01value' id='lastchange'></span>"
    ];

    // 換列索引集合 (Set 查詢時間複雜度為 O(1))
    const rowBreaks = new Set([0, 2, 5, 8, 10, 12, 13, 14, 15, 16, 17, 19, 21, 23, 26, 28, 30, 32, 34]);

    let currentTr = null;
    arrayRgt1.forEach((label, i) => {
        if (rowBreaks.has(i)) {
            currentTr = righttbl1.insertRow(-1);
        }

        const tdLabel = currentTr.insertCell(-1);
        tdLabel.className = "Rgtkey";
        tdLabel.innerHTML = label;

        const tdVal = currentTr.insertCell(-1);
        if (i === 0 || i === 22 || i === 9 || i === 33) {
            tdVal.style.width = '15%';
        } else if (i === 3) {
            tdVal.style.width = '5%';
        }
        tdVal.innerHTML = arrayRgt2[i];
    });

    secondCover.appendChild(righttbl1);
    if (cntdiv[0]) {
        cntdiv[0].appendChild(secondCover);
    }

    // --- 2. 報價筆數權限判斷 (Tab 2) ---
    if (getAuth[0]()[5] === 'Y') {
        const rspn2 = document.getElementById('serverResponse2');
        if (cntdiv[1] && rspn2) {
            const frag1 = document.createDocumentFragment();
            const spn1 = document.createElement('span');
            spn1.id = "ttltitle";
            spn1.textContent = "報價筆數:";

            const spn3 = document.createElement('span');
            spn3.id = "ttlmny";
            spn3.className = "ttl";
            spn3.textContent = '0';

            frag1.append(document.createTextNode('\u00A0'.repeat(6)), spn1, spn3);
            cntdiv[1].insertBefore(frag1, rspn2);
        }
    } else {
        if (cntdiv[1]) cntdiv[1].style.display = 'none';
        if (tabnames[1]) tabnames[1].style.display = 'none';
    }

    // --- 3. 腳本清理與動態載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    loadScript(`${prefix}.js?v=${jsvsn}`, () => { if (window.DrawTable) DrawTable(); });
    loadScript(`${prefix}rgst.js?v=${jsvsn}`);
    loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);
    loadScript(`C01/JS/A09getno.js?v=${jsvsn}`);
    loadScript(`C01/JS/A01Name.js?v=${jsvsn}`);

    // --- 4. 事件監聽綁定 ---
    const tabMap = { tab1: tab1View, tab2: tab2View };
    Object.keys(tabMap).forEach(id => {
        const tab = document.getElementById(id);
        if (tab) attachEventListener(tab, "click", tabMap[id], false);
    });
}

// 輔助函式：閉包數值歸零
function resetCko(indices) {
    indices.forEach(idx => {
        if (cko[idx]) {
            const current = cko[idx](0);
            cko[idx](current * -1);
        }
    });
}

// 輔助函式：控制按鈕顯隱與事件綁定
function setupButtons(btnConfigs) {
    btnConfigs.forEach(({ id, visible, handler }) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.style.visibility = visible ? "visible" : "hidden";
        if (handler) {
            if (visible) {
                attachEventListener(btn, "click", handler, false);
            } else {
                detachEventListener(btn, "click", handler, false);
            }
        }
    });
}

// 輔助函式：切換 AccessKey
function updateAccessKeys(activeKeys, removeKeys) {
    document.querySelectorAll('.btn').forEach(btn => {
        const lastChar = btn.title.slice(-1);
        if (removeKeys.includes(btn.accessKey)) {
            btn.removeAttribute("accesskey");
        }
        if (activeKeys.includes(lastChar)) {
            btn.accessKey = lastChar;
        }
    });
}

// 輔助函式：取得表格中已勾選的 row 資料列
function getSelectedRowData() {
    const maintable = document.getElementById("maintbody1");
    if (!maintable) return null;

    const selectedRow = Array.from(maintable.rows).find(row => {
        const cb = row.cells[row.cells.length - 1]?.querySelector('input') || row.cells[row.cells.length - 1]?.childNodes[0];
        return cb && cb.checked;
    });

    if (!selectedRow) return null;

    return Array.from(selectedRow.cells)
        .slice(0, -1)
        .map(cell => cell.textContent);
}

function tab1View() {
    const auth = getAuth[0]();

    setupButtons([
        { id: 'NEW_BOTT', visible: auth[1] === 'Y', handler: addrec }
    ]);

    const localbottoncl = document.getElementById('lclbtnbk');
    if (localbottoncl) {
        Object.assign(localbottoncl.style, {
            backgroundColor: "#FCFCFC",
            border: "2px solid #FCFCFC",
            boxShadow: "sandybrown 5px 10px 10px 7px"
        });
    }

    resetCko([3, 6]);
    updateAccessKeys(['T', 'J', 'K', 'V'], ['I', 'M']);
}

function tab2View() {
    const localbottoncl = document.getElementById('lclbtnbk');
    if (localbottoncl) {
        Object.assign(localbottoncl.style, {
            backgroundColor: "#F9FAD9",
            border: "2px solid #F9FAD9",
            boxShadow: "olivedrab 5px 10px 10px 7px"
        });
    }

    if (getAuth[0]()[5] !== 'Y') {
        if (window.blkshow) blkshow("你無查看報價紀錄權限");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }

    if (cko[2](0) === 0) {
        if (window.blkshow) blkshow("未勾選任何紀錄，請勾選一筆再編輯表身內容");
        const t1 = document.getElementById("tab1");
        if (t1) t1.checked = true;
        return false;
    }

    const aWaitUpdate = getSelectedRowData();
    if (aWaitUpdate) {
        const keydescription = document.getElementById('keydscrpt1');
        const fthkey = document.getElementById("fatherkey1");

        if (keydescription) keydescription.textContent = aWaitUpdate[3];
        if (fthkey) fthkey.innerHTML = aWaitUpdate[1];

        const isMatchGroup = aWaitUpdate[23] === fthkey.innerHTML;
        const auth = getAuth[0]();

        setupButtons([
            { id: 'NEW_BOTT', visible: isMatchGroup && auth[1] === 'Y', handler: addrec },
            { id: 'EDIT_BOTT', visible: isMatchGroup && auth[2] === 'Y', handler: edtrec },
            { id: 'DEL_BOTT', visible: isMatchGroup && auth[3] === 'Y', handler: delrec },
            { id: 'SEEK_BOTT', visible: isMatchGroup, handler: seekrec }
        ]);

        const responseDiv = document.getElementById("serverResponse2");
        if (responseDiv) responseDiv.innerHTML = '&nbsp;';

        resetCko([3, 6]);
        updateAccessKeys(['I', 'M'], ['T', 'J', 'K', 'V']);

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "c02.F01");
    }
}