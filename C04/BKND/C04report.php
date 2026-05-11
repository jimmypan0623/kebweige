<?php
// 啟動緩衝，防止非預期輸出導致 PDF 損壞
ob_start(); 
require_once('../../tcpdf/tcpdf.php');

// --- 1. 安全性檢查與變數初始化 ---
$queryNo = filter_input(INPUT_GET, 'queryNo', FILTER_SANITIZE_STRING);

// --- 2. 擴充 TCPDF 類別 ---
class MYPDF extends TCPDF {
    // 定義屬性存放外部資料，供 Header/Footer 調用
    public $customData = [];
    
    public function Header() {
        $this->SetFont('msungstdlight', '', 10);                
        
        // 1. 公司抬頭與報表名稱
        $headerHtml = '
        <div style="text-align: center;">
            <span style="font-size: 18pt;">' . ($this->customData['ourCompany'] ?? '') . '</span><br />
        </div>
        <table border="0" width="100%">
            <tr>
                <td style="width:70%; text-align: right; font-size: 16pt; font-weight: bold;">客戶訂單 CUSTOMER ORDER</td>
				<td style="width:30%; text-align: right; font-size: 8pt;">頁次: '.$this->getAliasNumPage().'/'.$this->getAliasNbPages().'</td>
            </tr>
        </table>';
        
        // 2. 訂單基本資訊 (僅第一頁顯示)
        $infoTable = '';
        if ($this->getPage() == 1) {
            $infoTable = '
            <table cellpadding="1" style="font-size: 10pt;">
                <tr>
                    <td style="width:75%;">客戶編號: '.($this->customData['customNo'] ?? '').'</td>
                    <td style="width:25%; text-align:right;">訂單號碼: '.($this->customData['queryNo'] ?? '').'</td>
                </tr>
                <tr>
                    <td style="width:78%;">客戶單號: '.($this->customData['customerPo'] ?? '').' &nbsp; 業務擔當: '.($this->customData['salesMan'] ?? '').' &nbsp; 交易幣別: '.($this->customData['curNcy'] ?? '').' '.($this->customData['curName'] ?? '').'</td>
                    <td style="width:22%; text-align:right;">接單日期: '.date('Y/m/d').'</td>
                </tr>
                <tr>
                    <td style="width:50%;">交貨地點: '.($this->customData['shipAddress'] ?? '').'</td>
                    <td style="width:50%; text-align:right;">出貨指示: '.($this->customData['shipDirect'] ?? '').'</td> 
                </tr>
            </table>';
        }

        // 3. 表頭欄位列 (每一頁都要有)
        $fields = '
        <table cellpadding="3" border="1" style="background-color: #f2f2f2; font-size: 9pt; text-align: center; font-weight: bold;">
            <tr>
                <td style="width: 100px;">料品編號</td>
                <td style="width: 110px;">品名規格</td>
                <td style="width: 30px;">單位</td>
                <td style="width: 50px;">數量</td>
                <td style="width: 60px;">單價</td>
                <td style="width: 70px;">小計</td>
                <td style="width: 80px;">客戶品號</td>
                <td style="width: 60px;">希望交期</td>   
            </tr>
        </table>';

        $this->writeHTML($headerHtml . $infoTable . $fields, true, false, false, false, '');
    }

    public function Footer() {
        $this->SetY(-20);
        $this->SetFont('msungstdlight', '', 11); 

        // 2. 簽核欄位定位
        $startX = $this->GetX();
        $this->Cell(40, 10, '審核:', 0, 0, 'L'); 
        
        // 3. 簽核章 (判斷 isConfirm)
        $confirmStatus = strtoupper(trim($this->customData['isConfirm'] ?? ''));
        if ($confirmStatus == 'Y') {
            // 根據「審核:」文字位置精確貼圖
            $this->Image('../../digits/approve.gif', $startX + 12, $this->GetY() - 1, 12, 12, 'GIF');              
        }

        $this->SetX($startX + 70); 
        $this->Cell(80, 10, '開單：' .($this->customData['username'] ?? ''), 0, 0, 'L'); 
    }
}

// --- 3. 初始化 PDF ---
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->customData = $_GET; // 關鍵：將 GET 資料注入物件供 Header/Footer 使用

$pdf->SetMargins(5, 45, 5); 
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(15);
$pdf->SetAutoPageBreak(TRUE, 25);
$pdf->AddPage();

// --- 4. 資料庫處理 ---
require_once("../../include/BKND/db_forreport.php");

$sql = "SELECT c04.*, b01.F02 as F0B, b01.F04 as F0D 
        FROM c04 
        LEFT JOIN b01 ON c04.F02 = b01.F01 
        WHERE c04.F01 = ? 
        ORDER BY c04.F02";

$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "s", $queryNo);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tbody = '';
$grandTotal = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $subtotal = $row['F03'] * $row['F04'];
    $grandTotal += $subtotal;
    
    $tbody .= '
    <tr>
        <td style="width: 100px;">'.$row['F02'].'</td>
        <td style="width: 110px;">'.$row['F0B'].'</td>
        <td style="width: 30px; text-align:center;">'.$row['F0D'].'</td>
        <td style="width: 50px; text-align:right;">'.number_format($row['F03']).'</td>
        <td style="width: 60px; text-align:right;">'.number_format($row['F04'], 2).'</td>
        <td style="width: 70px; text-align:right;">'.number_format($subtotal, 2).'</td>
        <td style="width: 80px;">'.$row['F05'].'</td>
        <td style="width: 60px; text-align:center;">'.$row['F06'].'</td>       
    </tr>';
}

// --- 5. 輸出內容 ---    
$pdf->SetFont('msungstdlight', '', 9); 

$tableHtml = '
<table cellpadding="3" border="0.5" style="border-top:none;">
    <tbody>' . $tbody . '</tbody>
    <tr style="background-color: #fafafa; font-weight: bold;">
        <td colspan="5" style="text-align:right;">總計 TOTAL:</td>
        <td style="text-align:right;">'.number_format($grandTotal, 2).'</td>
        <td colspan="2"></td>
    </tr>
</table>'; 

$pdf->writeHTML($tableHtml, true, false, false, false, '');

mysqli_close($link);

// 清除緩衝並輸出 PDF
ob_end_clean();
$pdf->Output($queryNo.'.pdf', 'I');