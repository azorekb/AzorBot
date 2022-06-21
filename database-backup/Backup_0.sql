-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 16, 2022 at 01:13 PM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `azorbot`
--

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `user` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `specie` varchar(50) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `IV` varchar(13) NOT NULL,
  `ability` varchar(50) NOT NULL,
  `EV` varchar(17) NOT NULL DEFAULT '0,0,0,0,0,0',
  `level` int(11) NOT NULL DEFAULT 5,
  `EXP` int(11) NOT NULL DEFAULT 0,
  `damage` int(11) NOT NULL DEFAULT 0,
  `belly` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
CREATE TABLE IF NOT EXISTS `playlists` (
  `name` varchar(50) NOT NULL,
  `owner` varchar(20) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`name`, `owner`) VALUES
('test', '303821168245342218');

-- --------------------------------------------------------

--
-- Table structure for table `pokemonlist`
--

DROP TABLE IF EXISTS `pokemonlist`;
CREATE TABLE IF NOT EXISTS `pokemonlist` (
  `name` varchar(50) NOT NULL,
  `types` varchar(5) NOT NULL,
  `ability1` varchar(30) NOT NULL,
  `ability2` varchar(30) NOT NULL,
  `hp` int(11) NOT NULL,
  `attack` int(11) NOT NULL,
  `defence` int(11) NOT NULL,
  `specialattack` int(11) NOT NULL,
  `specialdefence` int(11) NOT NULL,
  `speed` int(11) NOT NULL,
  `femalechance` float NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
CREATE TABLE IF NOT EXISTS `songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist` varchar(50) NOT NULL,
  `url` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `playlist`, `url`, `name`) VALUES
(1, 'test', 'https://www.youtube.com/watch?v=aO8dYTDVsEg', 'Umbreon - The Night.wmv');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
