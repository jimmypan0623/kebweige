<?php 
require_once('../../tcpdf/tcpdf.php');

// --- 1. 安全性檢查 ---
$queryNo = filter_input(INPUT_GET, 'queryNo', FILTER_SANITIZE_STRING);
$ourCompany = filter_input(INPUT_GET, 'ourCompany', FILTER_SANITIZE_STRING);

// --- 2. 擴充 TCPDF 類別 ---
class MYPDF extends TCPDF {
    public function Header() {
        $this->SetFont('msungstdlight', '', 10);                
        // 1. 公司抬頭與報表名稱
        // 【修正】將下方 td 的 border-bottom: 1px solid black; 移除
        
		
		$headerHtml = '
        <h4 style="font-size: 18pt; font-weight: normal; text-align: center; margin-bottom: 0px; line-height: 0.8;">
         ' . $_GET['ourCompany'] . '
         </h4>        
         <table border="0" width="100%">
             <tr>
                 <td style="text-align: center; font-size: 16pt; font-weight: bold; line-height: 1.0;">客戶訂單</td>
             </tr>
         </table>';
		
        // 2. 訂單基本資訊 (僅第一頁顯示)
		
        $infoTable = '';
        if ($this->getPage() == 1) {
            $infoTable = '
            <table cellpadding="1">
                <tr>
                    <td style="width:80%;">客戶編號: '.$_GET['customNo'].'</td>
                    <td style="width:20%; text-align:right;">訂單號碼: '.$_GET['queryNo'].'</td>
                </tr>
                <tr>
                    <td style="width:80%;">客戶單號:'.$_GET['customerPo'].'業務擔當: '.$_GET['salesMan'].'  交易幣別: '.$_GET['curNcy'].'</td>
                    <td style="width:20%; text-align:right;">接單日期: '.date('Y/m/d').'</td>
                </tr>
				<tr>
                    <td style="width:50%;">交貨地點: '.$_GET['shipAddress'].'</td>
                    <td style="width:50%; text-align:right;">出貨指示: '.$_GET['shipDirect'].'</td> 
                </tr>
            </table>';
        }

        // 3. 表頭欄位列 (每一頁都要有)
        $fields = '
        <table cellpadding="3" border="1" style="background-color: #f2f2f2;">
            <tr style="font-weight: bold; text-align: center;">
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
        $this->SetY(-15);
        $this->SetFont('msungstdlight', 'I', 8);        
        $this->Cell(0, 10, '頁次: '.$this->getAliasNumPage().' / '.$this->getAliasNbPages(), 0, false, 'C');
    }
}

// --- 3. 初始化 PDF ---
$pdf = new MYPDF('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetMargins(5, 43, 5); 
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(10);
$pdf->SetAutoPageBreak(TRUE, 20);

$pdf->AddPage();
  
// --- 4. 資料庫處理 (保持不變) ---
require_once('../../include/BKND/db_forreport.php'); // 引入設定檔        
// 使用 mysqli_real_escape_string 保護 SQL (保持不變)
$sql = "SELECT c04.*, b01.F02 as F0B, b01.F04 as F0D 
        FROM c04 LEFT JOIN b01 ON c04.F02 = b01.F01 
        WHERE c04.F01 = '".mysqli_real_escape_string($link, $_GET['queryNo'])."' 
        ORDER BY c04.F02";

$result = mysqli_query($link, $sql);
$tbody = '';
$grandTotal = 0;

////
while ($row = mysqli_fetch_assoc($result)) {
    $subtotal = $row['F03'] * $row['F04'];
    $grandTotal += $subtotal;
    
    $tbody .= '
    <tr>
        <td style="width: 100px;font-size:10pt;">'.$row['F02'].'</td>
        <td style="width: 110px;font-size:10pt;">'.$row['F0B'].'</td>
        <td style="width: 30px; text-align:center;font-size:10pt;">'.$row['F0D'].'</td>
        <td style="width: 50px; text-align:right;font-size:10pt;">'.number_format($row['F03']).'</td>
        <td style="width: 60px; text-align:right;font-size:10pt;">'.number_format($row['F04'], 2).'</td>
        <td style="width: 70px; text-align:right;font-size:10pt;">'.number_format($subtotal, 2).'</td>
        <td style="width: 80px;font-size:10pt;">'.$row['F05'].'</td>
        <td style="width: 60px; text-align:center;font-size:10pt;">'.$row['F06'].'</td>        
    </tr>';
}

// --- 5. 輸出內容 ---    
$pdf->SetFont('msungstdlight', '', 9); 

$tableHtml = '<table cellpadding="3" border="0.5" style="border-top:none;">' . $tbody . '
    <tr style="background-color: #fafafa; font-weight: bold;">
        <td colspan="5" style="text-align:right;">總計TOTAL:</td>
        <td style="text-align:right;font-size:10pt;">'.number_format($grandTotal, 2).'</td>
        <td colspan="2"></td>
    </tr>
</table>'; 

$pdf->writeHTML($tableHtml, true, false, false, false, '');

// --- 調整「審核」與「開單」區塊 ---

// 1. 設定較大的字體 (例如 12pt)
$pdf->SetFont('msungstdlight', '', 11); 

// 2. 繪製「審核」
$pdf->MultiCell(40, 15, '審核:', 0, 'L', 0, 0); 

// 3. 處理簽章圖片 (位置會隨著 X 軸調整)
if($_GET['isConfrim'] == 'Y'){
    // 將圖片往右移動一點，避免壓到「審核」二字
    $pdf->Image('../../digits/approve.gif', $pdf->getX() - 25, $pdf->getY() - 3, 12, 12);
}

// 4. 拉開間距：增加一個空白的 MultiCell 或者加大前一個 Cell 的寬度
// 這裡我們直接增加 X 座標，移動 30mm 的距離
$pdf->SetX($pdf->getX() + 30); 

// 5. 繪製「開單」
$pdf->MultiCell(60, 15, '開單：' . $_GET['username'], 0, 'L', 0, 0);
//----//

mysqli_close($link);
$pdf->Output($queryNo.'.pdf', 'I');