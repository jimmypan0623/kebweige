<?php 
require_once('../../tcpdf/tcpdf.php');

// --- 1. 安全性檢查與變數初始化 ---
$queryNo = filter_input(INPUT_GET, 'queryNo', FILTER_SANITIZE_STRING);

// --- 2. 擴充 TCPDF 類別 ---
class MYPDF extends TCPDF {
    public function Header() {
        $this->SetFont('msungstdlight', '', 10);                
        
        // 1. 公司抬頭與報表名稱
        $headerHtml = '
        <h4 style="font-size: 18pt; font-weight: normal; text-align: center; margin-bottom: 0px; line-height: 0.8;">
         ' . $_GET['ourCompany'] . '
        </h4>        
		<h6 style="font-size: 12pt; font-weight: normal; text-align: center;">TEL:'.$_COOKIE['INT_078'].'</h6>       
        <table border="0" width="100%">
            <tr>
                <td style="text-align: center; font-size: 16pt; font-weight: bold; line-height: 1.0;">報價單 QUOTATION</td>
            </tr>
        </table>';
        
        // 2. 報價單基本資訊 (僅第一頁顯示)
        $infoTable = '';
        if ($this->getPage() == 1) {
            $infoTable = '
            <table cellpadding="1" style="font-size: 10pt;">
                <tr>
                    <td style="width:80%;">To: '.$_GET['windowMan'].' ('.$_GET['customNo'].')</td>
                    <td style="width:20%; text-align:right;">報價單號: '.$_GET['queryNo'].'</td>
                </tr>
                <tr>
                    <td style="width:50%;">業務擔當: '.$_GET['salesMan'].'  幣別: '.$_GET['curNcy'].'</td>
                    <td style="width:50%; text-align:right;">付款方式: '.$_GET['payMent'].'</td>
                </tr>
                <tr>
                    <td style="width:50%;">交貨方式: '.$_GET['shipWay'].'</td>
                    <td style="width:50%; text-align:right;">備註: '.$_GET['reMark'].'</td> 
                </tr>
            </table>';
        }

        // 3. 表頭欄位列 (每一頁都要有)
        $fields = '
        <table cellpadding="3" border="1" style="background-color: #f2f2f2; font-size: 9pt;">
            <tr style="font-weight: bold; text-align: center;">
                <td style="width: 80px;">料品編號</td>
                <td style="width: 90px;">品名規格</td>
                <td style="width: 28px;">單位</td>
                <td style="width: 45px;">數量</td>
                <td style="width: 45px;">單價</td>
                <td style="width: 50px;">小計</td>
                <td style="width: 70px;">客戶品號</td>
                <td style="width: 40px;">包裝</td>         
                <td style="width: 40px;">最少</td> 
                <td style="width: 35px;">LT</td>   
                <td style="width: 55px;">有效期</td>   
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
$pdf->SetMargins(5, 50, 5); // 根據 Header 高度調整
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(10);
$pdf->SetAutoPageBreak(TRUE, 25);

$pdf->AddPage();
  
// --- 4. 資料庫處理 (改為引用外部檔) ---
require_once("../../include/BKND/db_forreport.php"); // 引用您新建立的專用連線檔

// 假設 db_forreport.php 產生的連線變數是 $link
$sql = "SELECT c27.*, b01.F02 as F0B, b01.F04 as F0D, (b01.F28 + b01.F31) as F2A 
        FROM c27 
        LEFT OUTER JOIN b01 ON c27.F02 = b01.F01 
        WHERE c27.F01 = '".mysqli_real_escape_string($link, $_GET['queryNo'])."' 
        ORDER BY c27.F02";

$result = mysqli_query($link, $sql);
$tbody = '';
$grandTotal = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $subtotal = $row['F03'] * $row['F04'];
    $grandTotal += $subtotal;
    
    $tbody .= '
    <tr>
        <td style="width: 80px;">'.$row['F02'].'</td>
        <td style="width: 90px;">'.$row['F0B'].'</td>
        <td style="width: 28px; text-align:center;">'.$row['F0D'].'</td>
        <td style="width: 45px; text-align:right;">'.number_format($row['F03']).'</td>
        <td style="width: 45px; text-align:right;">'.number_format($row['F04'], 2).'</td>
        <td style="width: 50px; text-align:right;">'.number_format($subtotal, 2).'</td>
        <td style="width: 70px;">'.$row['F05'].'</td>
        <td style="width: 40px; text-align:right;">'.$row['F06'].'</td>   
        <td style="width: 40px; text-align:right;">'.$row['F07'].'</td>
        <td style="width: 35px; text-align:center;">'.$row['F2A'].'天</td>
        <td style="width: 55px; text-align:center;">'.$row['F15']."\n".$row['F17'].'</td>       
    </tr>';
}

// --- 5. 輸出內容 ---    
$pdf->SetFont('msungstdlight', '', 9); 

$tableHtml = '<table cellpadding="3" border="0.5" style="border-top:none;">' . $tbody . '
    <tr style="background-color: #fafafa; font-weight: bold;">
        <td colspan="5" style="text-align:right;">總計TOTAL:</td>
        <td style="text-align:right;">'.number_format($grandTotal, 2).'</td>
        <td colspan="5"></td>
    </tr>
</table>'; 

$pdf->writeHTML($tableHtml, true, false, false, false, '');

// --- 簽署區塊 ---
$pdf->Ln(5); // 換行
$pdf->SetFont('msungstdlight', '', 11); 

// 繪製「審核」
$pdf->MultiCell(40, 15, '審核:', 0, 'L', 0, 0); 

// 簽章圖片
if($_GET['isConfrim'] == 'Y'){
    $pdf->Image('../../digits/approve.gif', $pdf->getX() - 25, $pdf->getY() - 3, 12, 12);
}

// 拉開間距並繪製「開單」
$pdf->SetX($pdf->getX() + 30); 
$pdf->MultiCell(60, 15, '開單：' . $_GET['username'], 0, 'L', 0, 0);

mysqli_close($link);
$pdf->Output($queryNo.'.pdf', 'I');