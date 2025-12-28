<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔
 CREATE TABLE `k0i` (
  `F00` int NOT NULL COMMENT '序號',
  `F01` varchar(2) NOT NULL COMMENT '沖帳單號',
  `F02` varchar(8) NOT NULL COMMENT '發票號碼',
  `F03` varchar(10) NOT NULL COMMENT '憑證單號',
  `F04` decimal(14,2) NOT NULL COMMENT '待沖金額',
  `F05` decimal(14,2) NOT NULL COMMENT '沖銷金額',
  `F11` varchar(20) NOT NULL COMMENT '最後異動'
   `F14` varchar(20) NOT NULL COMMENT '發票日期'
  `F12` varchar(40) NOT NULL COMMENT '備註'
 
 
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

?>  

 