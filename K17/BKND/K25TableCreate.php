<?php
   header("Content-Type:text/html; charset=utf-8");   

 include("../../include/BKND/mysqli_server.php");                              //引用檔
 CREATE TABLE `k09` (
  `F00` int NOT NULL AUTO_INCREMENT COMMENT '序號',
  `F01` varchar(2) NOT NULL COMMENT '沖帳日',
  `F02` varchar(6) NOT NULL COMMENT '對象編號',
  `F03` varchar(10) NOT NULL COMMENT '憑證單號',
  `F04` varchar(10) DEFAULT NULL COMMENT '發票號碼',
  `F05` varchar(10) NOT NULL COMMENT '沖帳單號',
  `F06` date NOT NULL COMMENT '提報單號碼',
  `F07` varchar(10) NOT NULL COMMENT '發票日期',
   `F08` varchar(1) NOT NULL COMMENT '收款方式',
  `F09` varchar(20) NOT NULL COMMENT '支票號碼',
  `F10` date NOT NULL COMMENT '兌現日',  
  `F22` varchar(1) NOT NULL COMMENT '應收或應付', 
  `F90` varchar(7) NOT NULL COMMENT '所屬年月',
  PRIMARY KEY (`F00`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

?>  

 