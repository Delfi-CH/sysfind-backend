/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.2.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: sysfind
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Operating Systems`
--

DROP TABLE IF EXISTS `Operating Systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Operating Systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `family` enum('PC-DOS','Windows 9x','Windows NT','Classic MacOS','MacOSX','UNIX','UNIX-Like','BSD','Linux','Other') NOT NULL,
  `description` varchar(100) NOT NULL,
  `imageDownloadURL` varchar(100) DEFAULT NULL,
  `homepage` varchar(100) DEFAULT NULL,
  `version` varchar(100) NOT NULL,
  `isSupported` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Operating Systems`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Operating Systems` WRITE;
/*!40000 ALTER TABLE `Operating Systems` DISABLE KEYS */;
/*!40000 ALTER TABLE `Operating Systems` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `OperatingSystemArchitectures`
--

DROP TABLE IF EXISTS `OperatingSystemArchitectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `OperatingSystemArchitectures` (
  `operatingSystemId` int(11) NOT NULL,
  `architectureId` int(11) NOT NULL,
  PRIMARY KEY (`operatingSystemId`,`architectureId`),
  KEY `OperatingSystemArchitectures_Processor_Architectures_FK` (`architectureId`),
  CONSTRAINT `OperatingSystemArchitectures_Operating_Systems_FK` FOREIGN KEY (`operatingSystemId`) REFERENCES `Operating Systems` (`id`),
  CONSTRAINT `OperatingSystemArchitectures_Processor_Architectures_FK` FOREIGN KEY (`architectureId`) REFERENCES `Processor Architectures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OperatingSystemArchitectures`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `OperatingSystemArchitectures` WRITE;
/*!40000 ALTER TABLE `OperatingSystemArchitectures` DISABLE KEYS */;
/*!40000 ALTER TABLE `OperatingSystemArchitectures` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Processor Architectures`
--

DROP TABLE IF EXISTS `Processor Architectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Processor Architectures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Processor_Architecture_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Processor Architectures`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Processor Architectures` WRITE;
/*!40000 ALTER TABLE `Processor Architectures` DISABLE KEYS */;
INSERT INTO `Processor Architectures` VALUES
(9,'8086'),
(11,'Aarch32'),
(12,'Aarch64'),
(18,'Apple Silicon'),
(13,'ARMv5'),
(14,'ARMv6'),
(15,'ARMv7'),
(16,'ARMv8'),
(17,'ARMv9'),
(28,'DEC Alpha'),
(27,'DEC VAX'),
(1,'i386'),
(2,'i486'),
(3,'i586'),
(4,'i686'),
(10,'IA64'),
(29,'IBM s/370'),
(30,'IBM s/390'),
(31,'IBM z/Architeture'),
(21,'m68k'),
(24,'PowerISA'),
(22,'ppc32'),
(23,'ppc64'),
(19,'RiscV 32'),
(20,'RiscV 64'),
(25,'Sparc32'),
(26,'Sparc64'),
(32,'Unknown'),
(5,'x86-64'),
(6,'x86-64-v2'),
(7,'x86-64-v3'),
(8,'x86-64-v4');
/*!40000 ALTER TABLE `Processor Architectures` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-03-11 19:11:45
