// ==========================================
// C04dlvdte動態分批出貨明細控制模組 (sourceAccount綁定與顯隱控制版)
// 【修正版】修正修改模式下歷史數量被覆蓋、currentUnassigned 空值防呆、浮點數比對與顯示誤差
// ==========================================

/**
 * 取得當前可分配/可出貨的淨數量上限
 * 計算公式：訂單數量 - 已出數量 - 取消數量
 * 已出數量 = sourceAccount(8, 1)
 * 取消數量 = sourceAccount(9, 1)
 */
function getAvailableQty() {
    var totalQtyInput = document.getElementById('queryqty');
    var totalQty = totalQtyInput ? (parseFloat(totalQtyInput.value) || 0) : 0;

    // 取得已出數量與取消數量
    var shippedQty = (typeof sourceAccount === 'function') ? (parseFloat(sourceAccount(8, 1)) || 0) : 0;
    var canceledQty = (typeof sourceAccount === 'function') ? (parseFloat(sourceAccount(9, 1)) || 0) : 0;

    // 計算剩餘可出貨數 (未出數量)
    var available = totalQty - shippedQty - canceledQty;
    return available < 0 ? 0 : available; // 避免為負數
}

/**
 * 安全取得目前「未分配」數量。
 */
function getCurrentUnassignedQty() {
    var el = document.getElementById('currentUnassigned');
    if (!el) return 0;
    return parseFloat(el.textContent) || 0;
}

/**
 * 控制分批出貨整列/區域的顯示與隱藏
 */
function toggleShipmentRowVisibility() {
    var availableQty = getAvailableQty();
    
    // 取得分批出貨所在的容器列
    var shipmentRow = document.getElementById('shipmentRow') || 
                       (document.getElementById('shipmentContainer') ? document.getElementById('shipmentContainer').closest('tr') : null);

    if (shipmentRow) {
        if (availableQty <= 0) {
            shipmentRow.style.display = 'none'; // 剩餘可出貨量 <= 0 時隱藏
        } else {
            shipmentRow.style.display = ''; // 大於 0 時恢復顯示
        }
    }
}

// 初始化分批出貨介面
function initShipmentContainer(defaultQty, NewOrEdit) {
    var container = document.getElementById('shipmentContainer');
    if (!container) return;

    container.innerHTML = ''; // 清空容器

    // 1. 將 (未分配：0) 與警告訊息掛到「訂單數量 (queryqty)」右側
    var qtyInput = document.getElementById('queryqty');
    if (qtyInput) {
        if (defaultQty !== undefined && defaultQty !== '') qtyInput.value = defaultQty;

        // 避免重複建立提示標籤
        var oldInfo = document.getElementById('qtyInfoWrapper');
        if (oldInfo) oldInfo.remove();

        var qtyInfoWrapper = document.createElement('span');
        qtyInfoWrapper.id = 'qtyInfoWrapper';
        qtyInfoWrapper.style.cssText = 'margin-left: 10px; font-size: 13px; color: #555; vertical-align: middle;';
        qtyInfoWrapper.innerHTML = `
            (未分配：<span id="currentUnassigned" style="font-weight:bold; color:#0056b3;">0</span>)
            <span id="shipmentErrMsg" style="color: red; font-weight: bold; font-size: 12px; display: none; margin-left: 5px;">⚠️ 超出可分配數量</span>
        `;
        // 插入到 queryqty 的右邊
        if (qtyInput.parentNode) {
            qtyInput.parentNode.appendChild(qtyInfoWrapper);
        }

        // 監聽訂單數量變更事件：重新驗證並更新顯隱狀態
        qtyInput.removeEventListener('input', onQtyInputChange);
        qtyInput.addEventListener('input', onQtyInputChange);
    }
    
    // 2. 建立專屬的 +/- 按鈕群組
    var actionBtnGroup = document.createElement('span');
    actionBtnGroup.id = 'shipmentActionGroup';
    actionBtnGroup.style.cssText = 'margin-left: 4px; display: inline-flex; gap: 4px; align-items: center; vertical-align: middle; flex-shrink: 0;';

    var baseBtnStyle = 'padding: 2px 8px; font-weight: bold; border-radius: 4px; border: none; cursor: pointer; color: white; font-size: 14px; transition: all 0.2s; flex-shrink: 0;';
    actionBtnGroup.innerHTML = `
        <button type="button" class="btn btn-add" id="btnAddRow" onclick="addShipmentRow()" 
                style="${baseBtnStyle} background-color: #28a745; box-shadow: 0 2px 4px rgba(40,167,69,0.3);" 
                title="數量減少後才能新增一列">＋</button>
        <button type="button" class="btn btn-remove" id="btnRemoveRow" onclick="removeLastShipmentRow()" 
                style="${baseBtnStyle} background-color: #dc3545; box-shadow: 0 2px 4px rgba(220,53,69,0.3);" 
                title="刪除最後一列">－</button>
    `;

    // 3. 依新增/修改模式渲染出貨列
    if (NewOrEdit == 1) { // 新增模式
        var defaultDate = document.getElementById('deliverydate') ? document.getElementById('deliverydate').value : _getUiDateStr();
        var availableQty = getAvailableQty();
        addShipmentRow(defaultDate, availableQty > 0 ? availableQty : 0, actionBtnGroup);
    } else { // 修改模式：從既有表格 (contentTbody) 讀出並渲染
        var oTable = document.getElementById("contentTbody");
        var hasRowLoaded = false;

        if (oTable && oTable.rows.length > 0) {
            for (var i = 0; i < oTable.rows.length; i++) {
                var row = oTable.rows[i];
                if (row.cells.length >= 2) {
                    var col1Value = row.cells[0].innerText.trim(); // 出貨日期
                    var col2Value = row.cells[1].innerText.trim(); // 出貨數量

                    // 只在渲染「最後一列」時傳入 actionBtnGroup 進行附掛
                    var isLast = (i === oTable.rows.length - 1);
                    addShipmentRow(col1Value, col2Value, isLast ? actionBtnGroup : null);
                    hasRowLoaded = true;
                }
            }
        }
       
        // 如果 contentTbody 完全沒有歷史明細，降級建立一列預設空白框
        if (!hasRowLoaded) {
            var defaultDate = document.getElementById('deliverydate') ? document.getElementById('deliverydate').value : _getUiDateStr();
            var availableQty = getAvailableQty();
            addShipmentRow(defaultDate, availableQty > 0 ? availableQty : 0, actionBtnGroup);
        }
    }
    
    // 初次載入時判定是否隱藏
    toggleShipmentRowVisibility();
}

// 訂單數量變更處理
function onQtyInputChange() {
    toggleShipmentRowVisibility();
    validateShipmentQuantities();
}

// 新增列 (響應式比例版)
function addShipmentRow(dateVal, qtyVal, btnGroupEl) {
    var container = document.getElementById('shipmentContainer');
    if (!container) return;    
    var row = document.createElement('div');
    row.className = 'shipment-item-row';
    row.style.cssText = 'display: flex; align-items: center; width: 100%; margin-bottom: 5px; font-size: 14px; gap: 4px; flex-wrap: wrap;';
    var dateInit = dateVal || _getUiDateStr();

    var qtyInit;
    if (qtyVal !== undefined && qtyVal !== null && qtyVal !== '') {
        qtyInit = qtyVal;
    } else {
        var unassigned = getCurrentUnassignedQty();
        qtyInit = unassigned > 0 ? unassigned : '';
    }

    row.innerHTML = `
        <label style="white-space: nowrap;">日期：</label>
        <input type="date" class="shipment-date txt" value="${dateInit}" 
               style="flex: 2 1 110px; min-width: 100px; max-width: 160px; width: 100%; box-sizing: border-box;" />
        
        <label style="white-space: nowrap; margin-left: 4px;">數量：</label>
        <input type="number" class="shipment-qty txt" value="${qtyInit}" min="1" 
               style="flex: 1 1 60px; min-width: 50px; max-width: 90px; width: 100%; text-align: right; box-sizing: border-box;" 
               oninput="validateShipmentQuantities()" />
    `;
    container.appendChild(row);

    // 把 +/- 按鈕移動到最後一列
    var actionGroup = btnGroupEl || document.getElementById('shipmentActionGroup');
    if (actionGroup) {
        row.appendChild(actionGroup);
    }
    validateShipmentQuantities();
}

/* // 刪除最後一列
function removeLastShipmentRow() {
    var container = document.getElementById('shipmentContainer');
    if (!container) return;

    var rows = container.getElementsByClassName('shipment-item-row');
    
    if (rows.length > 1) {
        var actionGroup = document.getElementById('shipmentActionGroup');
        var targetRow = rows[rows.length - 2];

        if (actionGroup && targetRow) {
            targetRow.appendChild(actionGroup);
        }

        container.lastElementChild.remove();
        validateShipmentQuantities();
    }
} */

// 刪除最後一列 (並將被刪除的數量加回前一列)
function removeLastShipmentRow() {
    var container = document.getElementById('shipmentContainer');
    if (!container) return;

    var rows = container.getElementsByClassName('shipment-item-row');
    
    // 至少保留一列才允許刪除
    if (rows.length > 1) {
        // 1. 取得最後一列 (即將被刪除的列) 與 倒數第二列 (刪除後的最後一列)
        var lastRow = rows[rows.length - 1];
        var targetRow = rows[rows.length - 2];

        // 2. 擷取即將被刪除列的數量
        var lastQtyInput = lastRow.querySelector('.shipment-qty');
        var deletedQty = lastQtyInput ? (parseFloat(lastQtyInput.value) || 0) : 0;

        // 3. 移動 +/- 按鈕群組到倒數第二列
        var actionGroup = document.getElementById('shipmentActionGroup');
        if (actionGroup && targetRow) {
            targetRow.appendChild(actionGroup);
        }

        // 4. 將刪除列的數量加回倒數第二列
        if (deletedQty > 0 && targetRow) {
            var targetQtyInput = targetRow.querySelector('.shipment-qty');
            if (targetQtyInput) {
                var currentTargetQty = parseFloat(targetQtyInput.value) || 0;
                // 使用 Math.round 避免浮點數加總誤差 (如 1000 + 2000.1000000001)
                var newQty = Math.round((currentTargetQty + deletedQty) * 10000) / 10000;
                targetQtyInput.value = newQty;
            }
        }

        // 5. 移除最後一列並重新計算/驗證
        lastRow.remove();
        validateShipmentQuantities();
    }
}

// 計算與驗證數量
function validateShipmentQuantities() {
    var availableQty = getAvailableQty(); // 可分配總量 = 訂單數量 - 已出數量 - 取消數量

    var container = document.getElementById('shipmentContainer');
    if (!container) return true;

    var qtyInputs = container.querySelectorAll('.shipment-qty');
    var currentSum = 0;

    // 加總目前已填寫的分批數量
    qtyInputs.forEach(function(input) {
        currentSum += (parseFloat(input.value) || 0);
    });

    // 計算剩餘未分配數量（未分配 = 可分配總量 - 分批總數）並修飾小數點誤差
    var unassignedQty = Math.round((availableQty - currentSum) * 10000) / 10000;

    // 更新未分配數量的顯示數字與顏色
    var currentUnassignedEl = document.getElementById('currentUnassigned');
    if (currentUnassignedEl) {
        currentUnassignedEl.textContent = unassignedQty;
        currentUnassignedEl.style.color = (unassignedQty < 0) ? '#dc3545' : '#0056b3';
    }

    var btnAdd = document.getElementById('btnAddRow');
    var btnRemove = document.getElementById('btnRemoveRow');
    var errMsg = document.getElementById('shipmentErrMsg');
    var totalQtyInput = document.getElementById('queryqty');

    var rows = container.getElementsByClassName('shipment-item-row');

    // 控制 [+] 按鈕 (當未分配數量 <= 0 時禁止新增)
    var isFullOrExceeded = (availableQty > 0 && unassignedQty <= 0);
    if (btnAdd) {
        btnAdd.disabled = isFullOrExceeded;
        btnAdd.style.opacity = isFullOrExceeded ? '0.4' : '1';
        btnAdd.style.cursor = isFullOrExceeded ? 'not-allowed' : 'pointer';
        btnAdd.style.boxShadow = isFullOrExceeded ? 'none' : '0 2px 4px rgba(40,167,69,0.3)';
    }

    // 控制 [-] 按鈕
    var isOnlyOne = (rows.length <= 1);
    if (btnRemove) {
        btnRemove.disabled = isOnlyOne;
        btnRemove.style.opacity = isOnlyOne ? '0.4' : '1';
        btnRemove.style.cursor = isOnlyOne ? 'not-allowed' : 'pointer';
        btnRemove.style.boxShadow = isOnlyOne ? 'none' : '0 2px 4px rgba(220,53,69,0.3)';
    }

    // 超額警告處理
    if (availableQty > 0 && unassignedQty < 0) {
        if (errMsg) errMsg.style.display = 'inline';
        if (totalQtyInput) totalQtyInput.style.backgroundColor = '#fff8f8';
        return false;
    } else {
        if (errMsg) errMsg.style.display = 'none';
        if (totalQtyInput) totalQtyInput.style.backgroundColor = '';
        return true;
    }
}

// 取得分批出貨 JSON 資料
function getShipmentDetailData() {
    var availableQty = getAvailableQty();

    // 如果可分配數量 <= 0，傳回空陣列
    if (availableQty <= 0) {
        return [];
    }

    var container = document.getElementById('shipmentContainer');
    if (!container) return null;

    var dates = container.querySelectorAll('.shipment-date');
    var qtys = container.querySelectorAll('.shipment-qty');
    var currentSum = 0;
    var list = [];

    for (var i = 0; i < dates.length; i++) {
        var dVal = dates[i].value;
        var qVal = parseFloat(qtys[i].value) || 0;

        if (!dVal || qVal <= 0) {
            alert('第 ' + (i + 1) + ' 組出貨日期或數量未填寫正確！');
            return null;
        }

        currentSum += qVal;
        list.push({ date: dVal, qty: qVal });		
    }

    // 容許極小誤差(0.0001)的比對方式
    if (Math.abs(currentSum - availableQty) > 0.0001) {
        alert('分批出貨數量總和 (' + currentSum + ') 與未出數量 (' + availableQty + ') 不符！');        
        return null;
    }

    // 合併相同日期的資料並累加數量
    var mergedMap = list.reduce(function(acc, item) {
        acc[item.date] = (acc[item.date] || 0) + item.qty;
        return acc;
    }, {});

    // 轉成陣列並依日期排序
    var result = Object.keys(mergedMap).map(function(dateKey) {
        return { date: dateKey, qty: mergedMap[dateKey] };
    }).sort(function(a, b) {
        return a.date.localeCompare(b.date);
    });

    return result;
}