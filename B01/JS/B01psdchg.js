/**
 * B01psdchg.js 重構優化版本
 * 1. 使用現代 JavaScript 語法 (const/let, Array API, DOM 標準 API)。
 * 2. 抽離重複邏輯（閉包歸零 resetCko、按鈕控制 setupButtons、AccessKey 切換、選取資料列解析）。
 * 3. 採用 DocumentFragment 與 Object.assign 提升 DOM 操作效能與可讀性。
 */

function selfTag(jsvsn, jsPth) {
    const contentdiv = document.querySelectorAll('.tab_content');
    const tabnames = document.getElementsByName('tablbl');

    // --- 1. 建立右側資料欄位結構 ---
    const firstCover = document.querySelector('.table_cover');
    if (firstCover) {
        firstCover.style.width = "37%";
    }

    const secondCover = document.createElement('div');
    secondCover.className = "table_cover";
    secondCover.style.width = "63%";

    const righttbl1 = document.createElement("table");
    righttbl1.id = "rightMember1";

    const arrayRgt1 = [
        "料品編號", "品名規格", "管理類別", "歸屬類別", "保存期限:", "計料單位:",
        "標準售價:", "保管部門:", "總庫存量:", "在庫數量:", "庫存上限:", "安全存量:",
        "料架位置:", "建立料表:", "領料類別:", "領用批量:", "採購前置:", "收發料前置:",
        "標準進價:", "平均成本:", "備註說明:", "物料類別:", "產    地:", "最後更新:"
    ];

    const arrayRgt2 = [
        "<span name='b01value' id='stock_no'></span>", "<span name='b01value' id='stock_name'></span>",
        "<span name='b01value' id='type_of_mnge'></span>", "<span name='b01value' id='kind_of_belong_to'></span>",
        "<span name='b01value' id='keepdays'></span>", "<span name='b01value' id='each_count'></span>",
        "<span name='b01value' id='dividing'></span>", "<span name='b01value' id='who_hold'></span>&nbsp;&nbsp;&nbsp;<span name='b01value' id='depart_name'></span>",
        "<mark><span name='b01value' id='totalqty'></span></mark>", "<mark><span name='b01value' id='qyt_on_hand'></span></mark>",
        "<span name='b01value' id='maxlimit_of_inv'></span>", "<span name='b01value' id='qty_of_safe'></span>",
        "<span name='b01value' id='where_is'></span>", "<span name='b01value' id='bom_should_be'></span>",
        "<span name='b01value' id='type_of_apply'></span>", "<span name='b01value' id='lotQty'></span>",
        "<span name='b01value' id='leadtm_prchs'></span>", "<span name='b01value' id='leadtm_ready'></span>",
        "<span name='b01value' id='sales_cost'></span>", "<span name='b01value' id='avg_cost'></span>",
        "<span name='b01value' id='remark1'></span>", "<span name='b01value' id='mtr_type'></span>",
        "<span name='b01value' id='rorgin_from'></span>", "<span name='b01value' id='who_and_when'></span>"
    ];

    let currentTr = null;
    arrayRgt1.forEach((label, i) => {
        if (i % 2 === 0) {
            currentTr = righttbl1.insertRow(-1);
            if (i === 18) {
                currentTr.className = "costauth";
                if (getAuth[0]()[7] !== 'Y') {
                    currentTr.style.display = "none";
                }
            }
        }
        const tdLabel = currentTr.insertCell(-1);
        tdLabel.className = "Rgtkey";
        tdLabel.innerHTML = label;

        const tdVal = currentTr.insertCell(-1);
        tdVal.innerHTML = arrayRgt2[i];
    });

    secondCover.appendChild(righttbl1);
    if (contentdiv[0]) {
        contentdiv[0].appendChild(secondCover);
    }

    // --- 2. 報價筆數權限判斷 (Tab 2) ---
    if (getAuth[0]()[5] === 'Y') {
        const rspn2 = document.getElementById('serverResponse2');
        if (contentdiv[1] && rspn2) {
            const frag1 = document.createDocumentFragment();
            const spn1 = document.createElement('span');
            spn1.id = "ttltitle";
            spn1.textContent = "報價筆數:";

            const spn3 = document.createElement('span');
            spn3.id = "ttlmny";
            spn3.className = "ttl";
            spn3.textContent = '0';

            frag1.append(document.createTextNode('\u00A0'.repeat(6)), spn1, spn3);
            contentdiv[1].insertBefore(frag1, rspn2);
        }
    } else {
        if (contentdiv[1]) contentdiv[1].style.display = 'none';
        if (tabnames[1]) tabnames[1].style.display = 'none';
    }

    // --- 3. 詢價筆數權限判斷 (Tab 3) ---
    if (getAuth[0]()[6] === 'Y') {
        const rspn3 = document.getElementById('serverResponse3');
        if (contentdiv[2] && rspn3) {
            const frag2 = document.createDocumentFragment();
            const spn4 = document.createElement('span');
            spn4.id = "ttltitle1";
            spn4.textContent = "詢價筆數:";

            const spn5 = document.createElement('span');
            spn5.id = "ttlmny1";
            spn5.className = "ttl";
            spn5.textContent = '0';

            frag2.append(document.createTextNode('\u00A0'.repeat(6)), spn4, spn5);
            contentdiv[2].insertBefore(frag2, rspn3);
        }
    } else {
        if (contentdiv[2]) contentdiv[2].style.display = 'none';
        if (tabnames[2]) tabnames[2].style.display = 'none';
    }

    // --- 4. 插入各庫別明細按鈕 ---
    const svrSpns1 = document.getElementById('serverResponse1');
    if (contentdiv[0] && svrSpns1) {
        const invDetailButton = btnManager.createBtn("INVDTL_BOTT", "\u{1F4E6}", "各庫別明細，快速鍵 Alt+B", "B", page1OtherButton1);
        
		//"\u{1F3E1}"
		const mrpListButton = btnManager.createBtn("IFUTURE_BOTT", "\u{1F453}", "預期庫存異動明細，快速鍵 Alt+R", "R", page1OtherButton2);
	    mrpListButton.setAttribute("style","font-size:120%;margin:0px;");
		 contentdiv[0].insertBefore(document.createTextNode('\u{00A0}'.repeat(5)), svrSpns1);
		 contentdiv[0].insertBefore(invDetailButton, svrSpns1);
		  contentdiv[0].insertBefore(document.createTextNode('\u{00A0}'.repeat(2)), svrSpns1);
        contentdiv[0].insertBefore(mrpListButton, svrSpns1);
    }

    // --- 5. 腳本清理與動態載入 ---
    document.querySelectorAll("script[id]").forEach(s => s.remove());

    const prefix = jsPth + jsPth.substr(0, 3);
    loadScript(`${prefix}.js?v=${jsvsn}`, () => { if (window.DrawTable) DrawTable(); });
    loadScript(`${prefix}rgst.js?v=${jsvsn}`);
    loadScript(`include/JS/commonsrch.js?v=${jsvsn}`);

    // --- 6. 事件監聽綁定 ---
    const tabMap = { tab1: tab1View, tab2: tab2View, tab3: tab3View };
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

// 輔助函式：設定按鈕 AccessKey (支援目標 index 選擇)
function updateAccessKeys(removeKeys, targetIMIndex = null) {
    let countI = 0;
    let countM = 0;

    document.querySelectorAll('.btn').forEach(btn => {
        const lastChar = btn.title.slice(-1);

        if (removeKeys.includes(btn.accessKey)) {
            btn.removeAttribute("accesskey");
        }

        if (['T', 'J', 'K', 'V', 'B'].includes(lastChar)) {
            btn.accessKey = lastChar;
        }

        if (targetIMIndex !== null) {
            if (lastChar === 'I') {
                countI++;
                if (countI === targetIMIndex) btn.accessKey = 'I';
                else if (btn.accessKey === 'I') btn.removeAttribute("accesskey");
            }
            if (lastChar === 'M') {
                countM++;
                if (countM === targetIMIndex) btn.accessKey = 'M';
                else if (btn.accessKey === 'M') btn.removeAttribute("accesskey");
            }
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
    const totalQty = (document.getElementById('totalqty')?.textContent || 0) * 1;
    const qtyOnHand = (document.getElementById('qyt_on_hand')?.textContent || 0) * 1;

    setupButtons([
        { id: 'NEW_BOTT', visible: auth[1] === 'Y', handler: addrec },
        { id: 'SEEK_BOTT', visible: true, handler: seekrec },
        { id: 'EDIT_BOTT', visible: auth[2] === 'Y', handler: edtrec },
        { id: 'DEL_BOTT', visible: auth[3] === 'Y' && totalQty === 0 && qtyOnHand === 0, handler: delrec }
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
    updateAccessKeys(['I', 'M']);
}

function tab2View(event) {
    const e = event || window.event;

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

        if (keydescription) keydescription.textContent = aWaitUpdate[2];
        if (fthkey) fthkey.innerHTML = aWaitUpdate[1];

        const isAllowUpdate = aWaitUpdate[4]?.trim().endsWith('Y');
        const auth = getAuth[0]();

        setupButtons([
            { id: 'NEW_BOTT', visible: isAllowUpdate && auth[1] === 'Y', handler: addrec },
            { id: 'EDIT_BOTT', visible: isAllowUpdate && auth[2] === 'Y', handler: edtrec },
            { id: 'DEL_BOTT', visible: isAllowUpdate && auth[3] === 'Y', handler: delrec },
            { id: 'SEEK_BOTT', visible: isAllowUpdate, handler: seekrec }
        ]);

        const responseDiv = document.getElementById("serverResponse2");
        if (responseDiv) responseDiv.innerHTML = '&nbsp;';

        resetCko([3, 6]);

        if (e !== 'GY') {
            updateAccessKeys(['T', 'J', 'K', 'V', 'B'], 1);
        }

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "c02.F03");
    }
}

function tab3View(event) {
    const e = event || window.event;

    const localbottoncl = document.getElementById('lclbtnbk');
    if (localbottoncl) {
        Object.assign(localbottoncl.style, {
            backgroundColor: "#F3F3FA",
            border: "2px solid #F3F3FA",
            boxShadow: "skyblue 5px 10px 10px 7px"
        });
    }

    if (getAuth[0]()[6] !== 'Y') {
        if (window.blkshow) blkshow("你無查看詢價紀錄權限");
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
        const keydescription = document.getElementById('keydscrpt2');
        const fthkey = document.getElementById("fatherkey2");

        if (keydescription) keydescription.textContent = aWaitUpdate[2];
        if (fthkey) fthkey.innerHTML = aWaitUpdate[1];

        const isAllowUpdate = aWaitUpdate[4]?.trim().startsWith('Y');
        const auth = getAuth[0]();

        setupButtons([
            { id: 'NEW_BOTT', visible: isAllowUpdate && auth[1] === 'Y', handler: addrec },
            { id: 'EDIT_BOTT', visible: isAllowUpdate && auth[2] === 'Y', handler: edtrec },
            { id: 'DEL_BOTT', visible: isAllowUpdate && auth[3] === 'Y', handler: delrec },
            { id: 'SEEK_BOTT', visible: isAllowUpdate, handler: seekrec }
        ]);

        const responseDiv = document.getElementById("serverResponse3");
        if (responseDiv) responseDiv.innerHTML = '&nbsp;';

        resetCko([4, 6]);

        if (e !== 'GY') {
            updateAccessKeys(['T', 'J', 'K', 'V', 'B'], 2);
        }

        if (window.commontemp && fthkey) commontemp(fthkey.innerHTML, "d02.F03");
    }
}