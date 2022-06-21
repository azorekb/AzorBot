-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 11, 2022 at 10:44 AM
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
-- Table structure for table `levelup_channel`
--

DROP TABLE IF EXISTS `levelup_channel`;
CREATE TABLE IF NOT EXISTS `levelup_channel` (
  `guild` varchar(30) NOT NULL,
  `channel` varchar(30) NOT NULL,
  PRIMARY KEY (`guild`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `levelup_channel`
--

INSERT INTO `levelup_channel` (`guild`, `channel`) VALUES
('869632448617644053', '921089041766703104'),
('969625262578864158', 'here'),
('934796480240291893', 'here');

-- --------------------------------------------------------

--
-- Table structure for table `levelup_people`
--

DROP TABLE IF EXISTS `levelup_people`;
CREATE TABLE IF NOT EXISTS `levelup_people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild` varchar(30) NOT NULL,
  `member` varchar(30) NOT NULL,
  `date` datetime NOT NULL,
  `exp` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `levelup_people`
--

INSERT INTO `levelup_people` (`id`, `guild`, `member`, `date`, `exp`, `level`) VALUES
(2, '869632448617644053', '303821168245342218', '2022-05-11 11:39:43', 82, 8),
(3, '869632448617644053', '915265869851021353', '2022-05-11 11:34:13', 99, 7),
(4, '969625262578864158', '303821168245342218', '2022-05-11 10:38:04', 16, 2),
(5, '969625262578864158', '806033254909739018', '2022-05-11 11:34:57', 26, 4),
(6, '969625262578864158', '915265869851021353', '2022-05-11 11:10:37', 46, 4),
(7, '969625262578864158', '951525948132556830', '2022-05-11 11:29:19', 5, 2),
(8, '969625262578864158', '405097906442469387', '2022-05-10 17:49:53', 4, 0),
(9, '969625262578864158', '816660362996482109', '2022-05-10 18:58:19', 2, 4),
(10, '969625262578864158', '852618472298774611', '2022-05-10 20:38:30', 4, 2),
(11, '969625262578864158', '523788602920927233', '2022-05-10 21:01:15', 17, 1),
(12, '934796480240291893', '303821168245342218', '2022-05-09 15:49:47', 27, 2),
(13, '969625262578864158', '480975561343369216', '2022-05-10 12:05:53', 23, 1),
(14, '969625262578864158', '936080506280374343', '2022-05-10 16:59:26', 4, 0),
(15, '969625262578864158', '496298196440711169', '2022-05-11 09:36:01', 51, 3),
(16, '934796480240291893', '490576799164530717', '2022-05-09 15:48:49', 5, 1),
(17, '969625262578864158', '490576799164530717', '2022-05-11 09:33:59', 8, 0);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) NOT NULL,
  `server` varchar(30) NOT NULL,
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
  PRIMARY KEY (`id`)
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
('Night', '303821168245342218'),
('GothicRap', '303821168245342218'),
('Cezik', '303821168245342218'),
('CyberMarian', '303821168245342218'),
('RiseAgainst', '303821168245342218'),
('enrique', '303821168245342218'),
('Mocha’s_Jukebox', '816660362996482109');

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

--
-- Dumping data for table `pokemonlist`
--

INSERT INTO `pokemonlist` (`name`, `types`, `ability1`, `ability2`, `hp`, `attack`, `defence`, `specialattack`, `specialdefence`, `speed`, `femalechance`) VALUES
('vulpix', '2,0', 'flash_fire', '-', 38, 41, 40, 50, 65, 65, 75),
('ninetales', '2,0', 'flash_fire', '-', 73, 76, 75, 81, 100, 100, 75),
('pikachu', '4,0', 'static', '-', 35, 55, 40, 50, 50, 90, 50),
('eevee', '1,0', 'run_away', 'adaptability', 55, 55, 50, 45, 64, 55, 12.5),
('charmander', '2,0', 'blaze', '-', 39, 52, 43, 60, 50, 65, 12.5),
('oshawott', '3,0', 'torrent', '-', 55, 55, 45, 63, 45, 45, 12.5),
('umbreon', '16,0', 'synchronize', '-', 95, 65, 110, 60, 130, 65, 12.5),
('sylveon', '18,0', 'cute_charm', '-', 95, 65, 65, 110, 130, 60, 12.5),
('squirtle', '3,0', 'torrent', '-', 44, 48, 65, 50, 64, 43, 12.5),
('bulbasaur', '5,8', 'overgrow', '-', 45, 49, 49, 65, 65, 45, 12.5),
('snowpix', '6,0', 'snow_cloak', '-', 38, 41, 40, 50, 65, 65, 75),
('ivysaur', '5,8', 'overgrow', '-', 60, 62, 63, 80, 80, 60, 12.5),
('venusaur', '5,8', 'overgrow', '-', 80, 82, 83, 100, 100, 80, 12.5),
('charmeleon', '2,0', 'blaze', '-', 58, 64, 58, 80, 65, 80, 12.5),
('charizard', '2,10', 'blaze', '-', 78, 84, 78, 109, 85, 100, 12.5),
('wartortle', '3,0', 'torrent', '-', 59, 63, 80, 65, 80, 58, 12.5),
('blastoise', '3,0', 'torrent', '-', 79, 83, 100, 85, 105, 78, 12.5),
('caterpie', '12,0', 'shield_dust', '-', 45, 30, 35, 20, 20, 45, 50),
('metapod', '12,0', 'shed_skin', '-', 50, 20, 55, 25, 25, 30, 50),
('butterfree', '12,10', 'compound_eyes', '-', 60, 45, 50, 90, 80, 70, 50),
('weedle', '12,8', 'shield_dust', '-', 40, 35, 30, 20, 20, 50, 50),
('kakuna', '12,8', 'shed_skin', '-', 45, 25, 50, 25, 25, 35, 50),
('beedrill', '12,8', 'swarm', '-', 65, 90, 40, 45, 80, 75, 50),
('pidgey', '1,10', 'keen_eye', 'tangled_feet', 40, 45, 40, 35, 35, 56, 50),
('pidgeotto', '1,10', 'keep_eye', 'tangled_feet', 63, 60, 55, 50, 50, 71, 50),
('pidgeot', '1,10', 'keep_eye', 'tangled_feet', 83, 80, 75, 70, 70, 101, 50),
('rattata', '1,0', 'run_away', 'guts', 30, 56, 35, 25, 35, 72, 50),
('raticate', '1,0', 'run_away', 'guts', 55, 81, 60, 50, 70, 97, 50),
('spearow', '1,10', 'keen_eye', '-', 40, 60, 30, 31, 31, 70, 50),
('fearow', '1,10', 'keen_eye', '-', 65, 90, 65, 61, 61, 100, 50),
('ekans', '8,0', 'intimidate', 'shed_skin', 35, 60, 44, 40, 54, 55, 50),
('arbok', '8,0', 'intimidate', 'shed_skin', 60, 95, 69, 65, 79, 80, 50),
('raichu', '4,0', 'static', '-', 60, 90, 55, 90, 80, 110, 50),
('sandshrew', '9,0', 'sand_veil', '-', 50, 75, 85, 20, 30, 40, 50),
('sandslash', '9,0', 'sand_veil', '-', 75, 100, 110, 45, 55, 65, 50),
('nidoran-f', '8,0', 'poison_point', 'rivalry', 55, 47, 52, 40, 40, 41, 100),
('nidorina', '8,0', 'poison_point', 'rivalry', 70, 62, 67, 55, 55, 56, 100),
('nidoqueen', '8,9', 'poison_point', 'rivalry', 90, 82, 87, 75, 85, 76, 100),
('nidoran-m', '8,0', 'poison_point', 'rivalry', 46, 57, 40, 40, 40, 50, 0),
('nidorino', '8,0', 'poison_point', 'rivalry', 61, 72, 57, 55, 55, 65, 0),
('nidoking', '8,9', 'poison_point', 'rivalry', 81, 102, 77, 85, 75, 85, 0),
('clefairy', '18,0', 'cute_charm', 'magic_guard', 70, 45, 48, 60, 65, 35, 75),
('clefable', '18,0', 'cute_charm', 'magic_guard', 95, 70, 73, 95, 90, 60, 75),
('jigglypuff', '1,18', 'cute_charm', 'competitive', 115, 45, 20, 45, 25, 20, 75),
('wigglytuff', '1,18', 'cute_charm', 'competitive', 140, 70, 45, 85, 50, 45, 75),
('zubat', '8,10', 'inner_focus', '-', 40, 45, 35, 30, 40, 55, 50),
('golbat', '8,10', 'inner_focus', '-', 75, 80, 70, 65, 75, 90, 50),
('oddish', '5,8', 'chlorophyll', '-', 45, 50, 55, 75, 65, 30, 50),
('gloom', '5,8', 'chlorophyll', '-', 60, 65, 70, 85, 75, 40, 50),
('vileplume', '5,8', 'chlorophyll', '-', 75, 80, 85, 110, 90, 50, 50),
('paras', '12,5', 'effect_spore', 'dry_skin', 35, 70, 55, 45, 55, 25, 50),
('parasect', '12,5', 'effect_spore', 'dry_skin', 60, 95, 80, 60, 80, 30, 50),
('venonat', '12,8', 'compound_eyes', 'tinted_lens', 60, 55, 50, 40, 55, 45, 50),
('venomoth', '12,8', 'shield_dust', 'tinted_lens', 70, 65, 60, 90, 75, 90, 50),
('diglett', '9,0', 'sand_veil', 'arena_trap', 10, 55, 25, 35, 45, 95, 50),
('dugtrio', '9,0', 'sand_veil', 'arena_trap', 35, 100, 50, 50, 70, 120, 50),
('meowth', '1,0', 'pickup', 'technician', 40, 45, 35, 40, 40, 90, 50),
('persian', '1,0', 'limber', 'technician', 65, 70, 60, 65, 65, 115, 50),
('psyduck', '3,0', 'damp', 'cloud_nine', 50, 52, 48, 65, 50, 55, 50),
('golduck', '3,0', 'damp', 'cloud_nine', 80, 82, 78, 95, 80, 85, 50),
('mankey', '7,0', 'vital_spirit', 'anger_point', 40, 80, 35, 35, 45, 70, 50),
('primeape', '7,0', 'vital_spirit', 'anger_point', 65, 105, 60, 60, 70, 95, 50),
('growlithe', '2,0', 'intimidate', 'flash_fire', 55, 70, 45, 70, 50, 60, 25),
('arcanine', '2,0', 'intimidate', 'flash_fire', 90, 110, 80, 100, 80, 95, 25),
('poliwhirl', '3,0', 'water_absorb', 'damp', 65, 65, 65, 50, 50, 90, 50),
('poliwrath', '3,7', 'water_absorb', 'damp', 90, 95, 95, 70, 90, 70, 50),
('abra', '11,0', 'synchronise', 'inner_focus', 25, 20, 15, 105, 55, 90, 25),
('kadabra', '11,0', 'synchronise', 'inner_focus', 40, 35, 30, 120, 70, 105, 25),
('alakazam', '11,0', 'synchronise', 'inner_focus', 55, 50, 45, 135, 95, 120, 25),
('machop', '7,0', 'guts', 'no_guard', 70, 80, 50, 35, 35, 35, 25),
('machoke', '7,0', 'guts', 'no_guard', 80, 100, 70, 50, 60, 45, 25),
('machamp', '7,0', 'guts', 'no_guard', 90, 130, 80, 65, 85, 55, 25),
('bellsprout', '5,8', 'chlorophyll', '-', 50, 75, 35, 70, 30, 40, 50),
('weepinbell', '5,8', 'chlorophyll', '-', 65, 90, 50, 85, 45, 55, 50),
('victreebel', '5,8', 'chlorophyll', '-', 80, 105, 65, 100, 70, 70, 50),
('tentacool', '3,8', 'clear_body', 'liquid_ooze', 40, 40, 35, 50, 100, 70, 50),
('tentacruel', '3,8', 'clear_body', 'liquid_ooze', 80, 70, 65, 80, 120, 100, 50),
('geodude', '13,9', 'rock_head', 'sturdy', 40, 80, 100, 30, 30, 20, 50),
('graveler', '13,9', 'rock_head', 'sturdy', 55, 95, 115, 45, 45, 35, 50),
('golem', '13,9', 'rock_head', 'sturdy', 80, 120, 130, 55, 65, 45, 50),
('ponyta', '2,0', 'run_away', 'flash_fire', 50, 85, 55, 65, 65, 90, 50),
('rapidash', '2,0', 'run_away', 'flash_fire', 65, 100, 70, 80, 80, 105, 50),
('slowpoke', '3,11', 'oblivious', 'own_tempo', 90, 65, 65, 40, 40, 15, 50),
('slowbro', '3,11', 'oblivious', 'own_tempo', 95, 75, 110, 100, 80, 30, 50),
('magnemite', '4,17', 'magnet_pull', 'sturdy', 25, 35, 70, 95, 55, 45, -1),
('magneton', '4,17', 'magnet_pull', 'sturdy', 50, 60, 95, 120, 70, 70, -1),
('farfetch\'d', '1,10', 'keen_eye', 'inner_focus', 52, 90, 55, 58, 62, 60, 50),
('doduo', '1,10', 'run_away', 'early_bird', 35, 85, 45, 35, 35, 75, 50),
('dodrio', '1,10', 'run_away', 'early_bird', 60, 110, 70, 60, 60, 110, 50),
('seel', '3,0', 'thick_fat', 'hydration', 65, 45, 55, 45, 70, 45, 50),
('dewgong', '3,6', 'thick_fat', 'hydration', 90, 70, 80, 70, 95, 70, 50),
('grimer', '8,0', 'stench', 'sticky_hold', 80, 80, 50, 40, 50, 25, 50),
('muk', '8,0', 'stench', 'sticky_hold', 105, 105, 75, 65, 100, 50, 50),
('shellder', '3,0', 'shell_armor', 'skill_link', 30, 65, 100, 45, 25, 40, 50),
('cloyster', '3,6', 'shell_armor', 'skill_link', 50, 95, 180, 85, 45, 70, 50),
('gastly', '14,8', 'levitate', '-', 30, 35, 30, 100, 35, 80, 50),
('haunter', '14,8', 'levitate', '-', 45, 50, 45, 115, 55, 95, 50),
('gengar', '14,8', 'cursed_body', '-', 60, 65, 60, 130, 75, 110, 50),
('onix', '13,9', 'rock_head', 'sturdy', 35, 45, 160, 30, 45, 70, 50),
('drowzee', '11,0', 'insomnia', 'foreyawn', 60, 48, 45, 43, 90, 42, 50),
('hypno', '11,0', 'insomnia', 'foreyawn', 85, 73, 70, 73, 115, 67, 50),
('krabby', '3,0', 'hyper_cutter', 'shell_armor', 30, 105, 90, 25, 25, 50, 50),
('kingler', '3,0', 'hyper_cutter', 'shell_armor', 55, 130, 115, 50, 50, 75, 50),
('voltorb', '4,0', 'soundproof', 'static', 40, 30, 50, 55, 55, 100, -1),
('electrode', '4,0', 'soundproof', 'static', 60, 50, 70, 80, 80, 150, -1),
('exeggcute', '5,11', 'chlorophyll', '-', 60, 40, 80, 60, 45, 40, 50),
('exeggutor', '5,11', 'chlorophyll', '-', 95, 95, 85, 125, 75, 55, 50),
('cubone', '9,0', 'rock_head', 'lightning_rod', 50, 50, 95, 40, 50, 35, 50),
('marowak', '9,0', 'rock_head', 'lightning_rod', 60, 80, 110, 50, 80, 45, 50),
('hitmonlee', '7,0', 'limber', 'reckless', 50, 120, 53, 35, 110, 87, 0),
('hitmonchan', '7,0', 'keen_eye', 'iron_fist', 50, 105, 79, 35, 110, 76, 0),
('lickitung', '1,0', 'own_tempo', 'oblivious', 90, 55, 75, 60, 75, 30, 50),
('koffing', '8,0', 'levitate', 'neutralizing_gas', 40, 65, 95, 60, 45, 35, 50),
('weezing', '8,0', 'levitate', 'neutralizing_gas', 65, 90, 120, 85, 70, 60, 50),
('rhyhorn', '9,13', 'lightning_rod', 'rock_head', 80, 85, 95, 30, 30, 25, 50),
('rhydon', '9,13', 'lightning_rod', 'rock_head', 105, 130, 120, 45, 45, 40, 50),
('chansey', '1,0', 'natural_cure', 'serene_grace', 250, 5, 5, 35, 105, 50, 100),
('tangela', '5,0', 'chlorophyll', 'leaf_guard', 65, 55, 115, 100, 40, 60, 50),
('kangaskhan', '1,0', 'early_bird', 'scrappy', 105, 95, 80, 40, 80, 90, 100),
('horsea', '3,0', 'swift_swim', 'sniper', 30, 40, 70, 70, 25, 60, 50),
('seadra', '3,0', 'poison_point', 'sniper', 55, 65, 95, 95, 45, 85, 50),
('goldeen', '3,0', 'swift_swim', 'water_veil', 45, 67, 60, 35, 50, 63, 50),
('seaking', '3,0', 'swift_swim', 'water_veil', 80, 92, 65, 65, 80, 68, 50),
('staryu', '3,0', 'illuminate', 'natural_cure', 30, 45, 55, 70, 55, 85, -1),
('starmie', '3,11', 'illuminate', 'natural_cure', 60, 75, 85, 100, 85, 115, -1),
('mr.mime', '11,18', 'soundproof', 'filter', 40, 45, 65, 100, 120, 90, 50),
('scyther', '12,10', 'swarm', 'technician', 70, 110, 80, 55, 80, 105, 50),
('jynx', '6,11', 'oblivious', 'foreyawn', 65, 50, 35, 115, 95, 95, 100),
('electabuzz', '4,0', 'static', '-', 65, 83, 57, 95, 85, 105, 25),
('magmar', '2,0', 'flame_body', '-', 65, 95, 57, 100, 85, 93, 25),
('pinsir', '12,0', 'hyper_cutter', 'mold_breaker', 65, 125, 100, 55, 70, 85, 50),
('tauros', '1,0', 'intimidate', 'anger_point', 75, 100, 95, 40, 70, 110, 0),
('magikarp', '3,0', 'swift_swim', '-', 20, 10, 55, 15, 20, 80, 50),
('gyarados', '3,10', 'intimidate', '-', 95, 125, 79, 60, 100, 81, 50),
('lapras', '3,6', 'water_absorb', 'shell_armor', 130, 85, 80, 85, 95, 60, 50),
('ditto', '1,0', 'limber', '-', 48, 48, 48, 48, 48, 48, -1),
('vaporeon', '3,0', 'water_absorb', '-', 130, 65, 60, 110, 95, 65, 12.5),
('jolteon', '4,0', 'volt_absorb', '-', 65, 65, 60, 110, 95, 130, 12.5),
('flareon', '2,0', 'flash_fire', '-', 65, 130, 60, 95, 110, 65, 12.5),
('porygon', '1,0', 'trace', 'download', 65, 60, 70, 85, 75, 40, -1),
('omanyte', '13,3', 'swift_swim', 'shell_armor', 35, 40, 100, 90, 55, 35, 12.5),
('omastar', '13,3', 'swift_swim', 'shell_armor', 70, 60, 125, 115, 70, 55, 12.5),
('kabuto', '13,3', 'swift_swim', 'battle_armor', 30, 80, 90, 55, 45, 55, 12.5),
('kabutops', '13,3', 'swift_swim', 'battle_armor', 60, 115, 105, 65, 70, 80, 12.5),
('aerodactyl', '13,10', 'rock_head', 'pressure', 80, 105, 65, 60, 75, 130, 12.5),
('snorlax', '1,0', 'immunity', 'thick_fat', 160, 110, 65, 65, 110, 30, 12.5),
('articuno', '6,10', 'pressure', '-', 90, 85, 100, 95, 125, 85, -1),
('zapdos', '4,10', 'pressure', '-', 90, 90, 85, 125, 90, 100, -1),
('moltres', '2,10', 'pressure', '-', 90, 100, 90, 125, 85, 90, -1),
('dratini', '15,0', 'shed_skin', '-', 41, 64, 45, 50, 50, 50, 50),
('dragonair', '15,0', 'shed_skin', '-', 61, 84, 65, 70, 70, 70, 50),
('dragonite', '15,10', 'inner_focus', '-', 91, 134, 95, 100, 100, 80, 50),
('mewtwo', '11,0', 'pressure', '-', 106, 110, 90, 154, 90, 130, -1),
('new', '11,0', 'synchronize', '-', 100, 100, 100, 100, 100, 100, -1),
('chikorita', '5,0', 'overgrow', '-', 45, 49, 65, 49, 65, 45, 12.5),
('bayleef', '5,0', 'overgrow', '-', 60, 62, 80, 63, 80, 60, 12.5),
('meganium', '5,0', 'overgrow', '-', 80, 82, 100, 83, 100, 80, 12.5),
('cyndaquil', '2,0', 'blaze', '-', 39, 52, 43, 60, 50, 65, 12.5),
('quilava', '2,0', 'blaze', '-', 58, 64, 58, 80, 65, 80, 12.5),
('typhlosion', '2,0', 'blaze', '-', 78, 84, 78, 109, 85, 100, 12.5),
('totodile', '3,0', 'torrent', '-', 50, 65, 64, 44, 48, 43, 12.5),
('croconaw', '3,0', 'torrent', '-', 65, 80, 80, 59, 63, 58, 12.5),
('feraligatr', '3,0', 'torrent', '-', 85, 105, 100, 79, 83, 78, 12.5),
('sentret', '1,0', 'run_away', 'keen_eye', 35, 46, 34, 35, 45, 20, 50),
('furret', '1,0', 'run_away', 'keen_eye', 85, 76, 64, 45, 55, 90, 50),
('hoothoot', '1,10', 'insomnia', 'keen_eye', 60, 30, 30, 36, 56, 50, 50),
('noctowl', '1,10', 'insomnia', 'keen_eye', 100, 50, 50, 86, 96, 70, 50),
('ledyba', '12,10', 'swarm', 'early_bird', 40, 20, 30, 40, 80, 55, 50),
('ledian', '12,10', 'swarm', 'early_bird', 55, 35, 50, 55, 110, 85, 50),
('spinarak', '12,8', 'swarm', 'insomnia', 40, 60, 40, 40, 40, 30, 50),
('ariados', '12,8', 'swarm', 'insomnia', 70, 90, 70, 60, 70, 40, 50),
('crobat', '8,10', 'inner_focus', '-', 85, 90, 80, 70, 80, 130, 50),
('chinchou', '3,4', 'volt_absorb', 'illuminate', 75, 38, 38, 56, 56, 67, 50),
('lanturn', '3,4', 'volt_absorb', 'illuminate', 125, 58, 58, 76, 76, 67, 50),
('pichu', '4,0', 'static', '-', 20, 40, 15, 35, 35, 60, 50),
('cleffa', '18,0', 'cute_charm', 'magic_guard', 50, 25, 28, 45, 55, 15, 75),
('igglybuff', '1,18', 'cute_charm', 'competitive', 90, 30, 15, 40, 20, 15, 75),
('togepi', '18,0', 'hustle', 'serene_grace', 35, 20, 65, 40, 65, 20, 12.5),
('togetic', '18,10', 'hustle', 'serene_grace', 55, 40, 85, 80, 105, 40, 12.5),
('natu', '11,10', 'synchronize', 'early_bird', 40, 50, 45, 70, 45, 70, 50),
('xatu', '11,10', 'synchronize', 'early_bird', 65, 75, 70, 95, 70, 95, 50),
('mareep', '4,0', 'static', '-', 55, 40, 40, 65, 45, 35, 50),
('flaaffy', '4,0', 'static', '-', 70, 55, 55, 80, 60, 45, 50),
('ampharos', '4,0', 'static', '-', 90, 75, 85, 115, 90, 55, 50),
('bellossom', '5,0', 'chlorophyll', '-', 75, 80, 95, 90, 100, 50, 50),
('marill', '3,18', 'thick_fat', 'huge_power', 70, 20, 50, 20, 50, 40, 50),
('azumarill', '3,18', 'thick_fat', 'huge_power', 100, 50, 80, 60, 80, 50, 50),
('sudowoodo', '13,0', 'sturdy', 'rock_head', 70, 100, 115, 30, 65, 30, 50),
('politoed', '3,0', 'water_absorb', 'damp', 90, 75, 75, 90, 100, 70, 50),
('hoppip', '5,10', 'chlorophyll', 'leaf_guard', 35, 35, 40, 35, 55, 50, 50),
('skiploom', '5,10', 'chlorophyll', 'leaf_guard', 55, 45, 50, 45, 65, 80, 50),
('jumpluff', '5,10', 'chlorophyll', 'leaf_guard', 75, 55, 70, 55, 95, 110, 50),
('aipom', '1,0', 'run_away', 'pickup', 55, 70, 55, 40, 55, 85, 50),
('sunkern', '5,0', 'chlorophyll', 'solar_power', 30, 30, 30, 30, 30, 30, 50),
('sunflora', '5,0', 'chlorophyll', 'solar_power', 75, 75, 55, 105, 85, 30, 50),
('yanma', '12,10', 'speed_boost', 'compound_eyes', 65, 65, 45, 75, 45, 95, 50),
('wooper', '3,9', 'damp', 'water_absorb', 55, 45, 45, 25, 25, 15, 50),
('quagsire', '3,9', 'damp', 'water_absorb', 95, 85, 85, 65, 65, 35, 50),
('espeon', '11,0', 'synchronize', '-', 65, 65, 60, 130, 95, 110, 12.5),
('murkrow', '16,10', 'insomnia', 'super_luck', 60, 85, 42, 85, 42, 91, 50),
('slowking', '3,11', 'oblivious', 'own_tempo', 95, 75, 80, 100, 110, 30, 50),
('misdreavus', '14,0', 'levitate', '-', 60, 60, 60, 85, 85, 85, 50),
('unown', '11,0', 'levitate', '-', 48, 72, 48, 72, 48, 48, -1),
('wobbuffet', '11,0', 'shadow_tag', '-', 190, 33, 58, 33, 58, 33, 50),
('girafarig', '1,11', 'inner_focus', 'early_bird', 70, 80, 65, 90, 65, 85, 50),
('pineco', '12,0', 'sturdy', '-', 50, 65, 90, 35, 35, 15, 50),
('forretress', '12,17', 'sturdy', '-', 75, 90, 140, 60, 60, 40, 50),
('dunsparce', '1,0', 'serene_grace', 'run_away', 100, 70, 70, 65, 65, 45, 50),
('gligar', '9,10', 'hyper_cutter', 'sand_veil', 65, 75, 105, 35, 65, 85, 50),
('steelix', '17,9', 'rock_head', 'sturdy', 75, 85, 200, 55, 65, 30, 50),
('snubbull', '18,0', 'intimidate', 'run_away', 60, 80, 50, 40, 40, 30, 75),
('granbull', '18,0', 'intimidate', 'quick_feet', 90, 120, 75, 60, 60, 45, 75),
('qwilfish', '3,8', 'poison_point', 'swift_swim', 65, 95, 85, 55, 55, 85, 50),
('scizor', '12,8', 'swarm', 'technician', 70, 130, 100, 55, 80, 65, 50),
('shuckle', '12,13', 'sturdy', 'gluttony', 20, 10, 230, 10, 230, 5, 50),
('heracross', '12,7', 'swarm', 'guts', 80, 125, 75, 40, 95, 85, 50),
('sneasel', '16,6', 'inner_focus', 'keen_eye', 55, 95, 55, 35, 75, 115, 50),
('teddiursa', '1,0', 'pickup', 'quick_feet', 60, 80, 50, 50, 50, 40, 50),
('ursaring', '1,0', 'guts', 'quick_feet', 90, 130, 75, 75, 75, 55, 50),
('slugma', '2,0', 'magma_armor', 'flame_body', 40, 40, 40, 70, 40, 20, 50),
('magcargo', '2,13', 'magma_armor', 'flame_body', 60, 50, 120, 90, 80, 30, 50),
('swinub', '6,9', 'oblivious', 'snow_cloak', 50, 50, 40, 30, 30, 50, 50),
('piloswine', '6,9', 'oblivious', 'snow_cloak', 100, 100, 80, 60, 60, 50, 50),
('corsola', '3,13', 'hustle', 'natural_cure', 65, 55, 95, 65, 95, 35, 75),
('remoraid', '3,0', 'hustle', 'sniper', 35, 65, 35, 65, 35, 65, 50),
('octillery', '3,0', 'suction_cups', 'sniper', 75, 105, 75, 105, 75, 45, 50),
('delibird', '6,10', 'vital_spirit', 'hustle', 45, 55, 45, 65, 45, 75, 50),
('mantine', '3,10', 'swift_swim', 'water_absorb', 85, 40, 70, 80, 140, 70, 50),
('skarmory', '17,10', 'keen_eye', 'sturdy', 65, 80, 140, 40, 70, 70, 50),
('houndour', '16,2', 'early_bird', 'flash_fire', 45, 60, 30, 80, 50, 65, 50),
('houndoom', '16,2', 'early_bird', 'flash_fire', 75, 90, 50, 110, 80, 95, 50),
('kingdra', '3,15', 'swift_swim', 'sniper', 75, 95, 95, 95, 95, 85, 50),
('phanpy', '9,0', 'pickup', '-', 90, 60, 60, 40, 40, 40, 50),
('donphan', '9,0', 'sturdy', '-', 90, 120, 120, 60, 60, 50, 50),
('porygon2', '1,0', 'trace', 'download', 85, 80, 90, 105, 95, 60, -1),
('stantler', '1,0', 'intimidate', 'frisk', 73, 95, 62, 85, 65, 85, 50),
('smeargle', '1,0', 'own_tempo', 'technician', 55, 20, 35, 20, 45, 75, 50),
('tyrogue', '7,0', 'guts', 'steadfast', 35, 35, 35, 35, 35, 35, 0),
('hitmontop', '7,0', 'intimidate', 'technician', 50, 95, 95, 35, 110, 70, 0),
('smoochum', '6,11', 'oblivious', 'foreyawn', 45, 30, 15, 85, 65, 65, 100),
('elekid', '4,0', 'static', '-', 45, 63, 37, 65, 55, 95, 25),
('magby', '2,0', 'flame_body', '-', 45, 75, 37, 70, 55, 83, 25),
('miltank', '1,0', 'thick_fat', 'scrappy', 95, 80, 105, 40, 70, 100, 100),
('blissey', '1,0', 'natural_cure', 'serene_grace', 255, 10, 10, 75, 135, 55, 100),
('raikou', '4,0', 'pressure', '-', 90, 85, 75, 115, 100, 115, -1),
('entei', '2,0', 'pressure', '-', 115, 115, 85, 90, 75, 100, -1),
('suicune', '3,0', 'pressure', '-', 100, 75, 115, 90, 115, 85, -1),
('larvitar', '13,9', 'guts', '-', 50, 64, 50, 45, 50, 41, 50),
('pupitar', '13,9', 'shed_skin', '-', 70, 84, 70, 65, 70, 51, 50),
('tyranitar', '13,16', 'sand_stream', '-', 100, 134, 110, 95, 100, 61, 50),
('lugia', '11,10', 'pressure', '-', 106, 90, 130, 90, 154, 110, -1),
('ho-oh', '2,10', 'pressure', '-', 106, 130, 90, 110, 154, 90, -1),
('celebi', '11,5', 'natural_cure', '-', 100, 100, 100, 100, 100, 100, -1),
('treecko', '5,0', 'overgrow', '-', 40, 45, 35, 65, 55, 70, 12.5),
('grovyle', '5,0', 'overgrow', '-', 50, 65, 45, 85, 65, 95, 12.5),
('sceptile', '5,0', 'overgrow', '-', 70, 85, 65, 105, 85, 120, 12.5),
('torchic', '2,0', 'blaze', '-', 45, 60, 40, 70, 50, 45, 12.5),
('combusken', '2,7', 'blaze', '-', 60, 85, 60, 85, 60, 55, 12.5),
('blaziken', '2,7', 'blaze', '-', 80, 120, 70, 110, 70, 80, 12.5),
('mudkip', '3,0', 'torrent', '-', 50, 70, 50, 50, 50, 40, 12.5),
('marshtomp', '3,9', 'torrent', '-', 70, 85, 70, 60, 70, 50, 12.5),
('swampert', '3,9', 'torrent', '-', 100, 110, 90, 85, 90, 60, 12.5),
('poochyena', '16,0', 'run_away', 'quick_feet', 35, 55, 35, 30, 30, 35, 50),
('mightyena', '16,0', 'intimidate', 'quick_feet', 70, 90, 70, 60, 60, 70, 50),
('zigzagoon', '1,0', 'pickup', 'gluttony', 38, 30, 41, 30, 41, 60, 50),
('linoone', '1,0', 'pickup', 'gluttony', 78, 70, 61, 50, 61, 100, 50),
('wurmple', '12,0', 'shield_dust', '-', 45, 45, 35, 20, 30, 20, 50),
('silcoon', '12,0', 'shed_skin', '-', 50, 35, 55, 25, 25, 15, 50),
('beautifly', '12,10', 'swarm', '-', 60, 70, 50, 100, 50, 65, 50),
('cascoon', '12,0', 'shed_skin', '-', 50, 35, 55, 25, 25, 15, 50),
('dustox', '12,8', 'shield_dust', '-', 60, 50, 70, 50, 90, 65, 50),
('lotad', '3,5', 'swift_swim', 'rain_dash', 40, 30, 30, 40, 50, 30, 50),
('lombre', '3,5', 'swift_swim', 'rain_dash', 60, 50, 50, 60, 70, 50, 50),
('ludicolo', '3,5', 'swift_swim', 'rain_dash', 80, 70, 70, 90, 100, 70, 50),
('seedot', '5,0', 'chlorophyll', 'early_bird', 40, 40, 50, 30, 30, 30, 50),
('nuzleaf', '5,16', 'chlorophyll', 'early_bird', 70, 70, 40, 60, 40, 60, 50),
('shiftry', '5,16', 'chlorophyll', 'early_bird', 90, 100, 60, 90, 60, 80, 50),
('taillow', '1,10', 'guts', '-', 40, 55, 30, 30, 30, 85, 50),
('swellow', '1,10', 'guts', '-', 60, 85, 60, 75, 50, 125, 50),
('wingull', '3,10', 'keen_eye', 'hydration', 40, 30, 30, 55, 30, 85, 50),
('pelipper', '3,10', 'keen_eye', 'drizzle', 60, 50, 100, 95, 70, 65, 50),
('ralts', '11,18', 'synchronize', 'trace', 28, 25, 25, 45, 35, 40, 50),
('kirlia', '11,18', 'synchronize', 'trace', 38, 35, 35, 65, 55, 50, 50),
('gardevoir', '11,18', 'synchronize', 'trace', 68, 65, 65, 125, 115, 80, 50),
('surskit', '12,3', 'swift_swim', '-', 40, 30, 32, 50, 52, 65, 50),
('masquerain', '12,10', 'intimidate', '-', 70, 60, 62, 100, 82, 80, 50),
('shroomish', '5,0', 'effect_spore', 'poison_heal', 60, 40, 60, 40, 60, 35, 50),
('breloom', '5,7', 'effect_spore', 'poison_heal', 60, 130, 80, 60, 60, 70, 50),
('slakoth', '1,0', 'truant', '-', 60, 60, 60, 35, 35, 30, 50),
('vigoroth', '1,0', 'vital_spirit', '-', 80, 80, 80, 55, 55, 90, 50),
('slaking', '1,0', 'truant', '-', 150, 160, 100, 95, 65, 100, 50),
('nincada', '12,9', 'compound_eyes', '-', 31, 45, 90, 30, 30, 40, 50),
('ninjask', '12,10', 'speed_boost', '-', 61, 90, 45, 50, 50, 160, 50),
('shedinja', '12,14', 'wonder_guard', '-', 1, 90, 45, 30, 30, 40, -1),
('whismur', '1,0', 'soundproof', '-', 64, 51, 23, 51, 23, 28, 50),
('loudred', '1,0', 'soundproof', '-', 84, 71, 43, 71, 43, 48, 50),
('exploud', '1,0', 'soundproof', '-', 104, 91, 63, 91, 73, 68, 50),
('makuhita', '7,0', 'thick_fat', 'guts', 71, 60, 30, 20, 30, 25, 25),
('hariyama', '7,0', 'thick_fat', 'guts', 144, 120, 60, 40, 60, 50, 25),
('azurill', '1,18', 'thick_fat', 'huge_power', 50, 20, 40, 20, 40, 20, 75),
('nosepass', '13,0', 'sturdy', 'magnet_pull', 30, 45, 135, 40, 90, 30, 50),
('skitty', '1,0', 'cute_charm', 'normalize', 50, 45, 45, 35, 35, 50, 75),
('delcatty', '1,0', 'cute_charm', 'normalize', 70, 65, 65, 55, 55, 90, 75),
('sableye', '16,14', 'keen_eye', 'stall', 50, 75, 75, 65, 65, 50, 50),
('mawile', '17,18', 'hyper_cutter', 'intimidate', 50, 85, 85, 55, 55, 50, 50),
('aron', '17,13', 'sturdy', 'rock_head', 50, 70, 100, 40, 40, 30, 50),
('lairon', '17,13', 'sturdy', 'rock_head', 60, 90, 140, 50, 50, 40, 50),
('aggron', '17,13', 'sturdy', 'rock_head', 70, 110, 180, 60, 60, 50, 50);

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
) ENGINE=MyISAM AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `playlist`, `url`, `name`) VALUES
(1, 'night', 'https://www.youtube.com/watch?v=aO8dYTDVsEg', 'Umbreon - The Night.wmv'),
(2, 'night', 'https://www.youtube.com/watch?v=cs4RG9u8IVU', 'Nights in White Satin - The Moody Blues - in Paris.  Restored video!'),
(3, 'night', 'https://www.youtube.com/watch?v=xrJd059ibws', 'Sandra - In The Heat Of The Night (Official Video 1985)'),
(4, 'gothicrap', 'https://www.youtube.com/watch?v=dLLRUtql_ys', '[REMIX] KUCHNIA SNAFA - GOTHIC REMIX'),
(5, 'gothicrap', 'https://www.youtube.com/watch?v=05aPGgNXLAc', '[REMIX] MY LUBIMY PALIĆ - GOTHIC REMIX'),
(6, 'gothicrap', 'https://www.youtube.com/watch?v=l4KqQkaggis', '[REMIX] NAJWIĘKSZY WRÓG - GOTHIC REMIX (DRABINA)'),
(7, 'gothicrap', 'https://www.youtube.com/watch?v=kVEAmDth044', 'Gothic Rap - Jestem Bohaterem'),
(8, 'gothicrap', 'https://www.youtube.com/watch?v=kzx77wPQ6Bk', 'Gothic Rap/Remix - Łatwo zapomnieć'),
(9, 'gothicrap', 'https://www.youtube.com/watch?v=Cx3CvgOl5D0', 'Gothic Rap - Onar'),
(10, 'gothicrap', 'https://www.youtube.com/watch?v=ww9pHXl4Clk', '[REMIX] CEBULOWA ZEMSTA - GOTHIC REMIX'),
(11, 'gothicrap', 'https://www.youtube.com/watch?v=amcFq5lCvNM', 'Gothic Rap - Czarne Szaty'),
(12, 'gothicrap', 'https://www.youtube.com/watch?v=y_ifjEYEMuY', '[REMIX] DŻIN Z KUFRA - GOTHIC REMIX (feat. Kaktus)'),
(13, 'gothicrap', 'https://www.youtube.com/watch?v=HsQ1zjIOpJA', 'Gothic Rap/Remix - Górnicza Brać'),
(14, 'gothicrap', 'https://www.youtube.com/watch?v=C5tJKZE65CQ', 'Gothic Rap - Nie zbroja zdobi człowieka'),
(15, 'gothicrap', 'https://www.youtube.com/watch?v=1f2Ak8VjfvU', 'GothicRap - Orkowie'),
(16, 'gothicrap', 'https://www.youtube.com/watch?v=quJ2XxZTXUM', 'GothicRap - Straciłem Robotę'),
(17, 'gothicrap', 'https://www.youtube.com/watch?v=KVbz3wSQgMQ', 'GothicRap - Ulu Mulu'),
(18, 'Cezik', 'https://www.youtube.com/watch?v=DYg1fAXHWmM', 'Szajka CeZika - Wzniosłe treści obcych pieśni'),
(19, 'Cezik', 'https://www.youtube.com/watch?v=W56E3FbTTyA', 'CeZik - uCześka z internetu [muzyKontakty - pilot]'),
(20, 'Cezik', 'https://www.youtube.com/watch?v=ChvLzcUGkeY', 'Te ostatnie niedziele by CeZik'),
(21, 'Cezik', 'https://www.youtube.com/watch?v=wOqYxP79xrU', 'Serialowy Burdel Cover by CeZik'),
(22, 'Cezik', 'https://www.youtube.com/watch?v=LgNeikLhrMI', 'Lech Janerka - Rower Cover by CeZik'),
(23, 'Cezik', 'https://www.youtube.com/watch?v=mz83od-rIR0', 'Szajka CeZika i polska muzyka'),
(24, 'Cezik', 'https://www.youtube.com/watch?v=vU34pdvi07c', 'Hey - [sic!] kuchnia cover by CeZik'),
(25, 'Cezik', 'https://www.youtube.com/watch?v=DEhJgRveaV8', 'CeZik? Co To Za Pedał?'),
(26, 'CyberMarian', 'https://www.youtube.com/watch?v=1upP4u1EKEs', 'Cyber Marian - Bo życie to jest life!'),
(27, 'CyberMarian', 'https://www.youtube.com/watch?v=w0vup71Sv58', 'Das Little Car - Cyber Marian feat. Czwarta Fala (prod. IVE) [Kraftwerk - Das Model COVER]'),
(28, 'CyberMarian', 'https://www.youtube.com/watch?v=0kwua5kRP24', 'Cyber Marian - Igrzyska'),
(29, 'CyberMarian', 'https://www.youtube.com/watch?v=oRKnGwoyeAM', 'MIRO MARO - Cyber Marian feat. Czwarta Fala & AdBuster (BFF \'Pisarz Miłości\' COVER)'),
(30, 'CyberMarian', 'https://www.youtube.com/watch?v=0zx883OoyYs', 'Wąs! Wąs! Wąs! (Cyber Marian feat. Czwarta Fala)'),
(31, 'riseagainst', 'https://www.youtube.com/watch?v=dhldbymXK-8', 'Rise Against - Give It All (Official Video)'),
(33, 'riseagainst', 'https://www.youtube.com/watch?v=JHiqGqoIGII', 'Rise Against - Help Is On The Way (Official Video)'),
(34, 'riseagainst', 'https://www.youtube.com/watch?v=XP4clbHc4Xg', 'Rise Against - Make It Stop (September\'s Children)'),
(35, 'riseagainst', 'https://www.youtube.com/watch?v=9-SQGOYOjxs', 'Rise Against - Prayer Of The Refugee (Official Music Video)'),
(36, 'riseagainst', 'https://www.youtube.com/watch?v=XN2FrUUq-zI', 'Rise Against - Ready To Fall (Official Music Video)'),
(37, 'riseagainst', 'https://www.youtube.com/watch?v=6nQCxwneUwA', 'Rise Against - Satellite (Official Music Video)'),
(38, 'riseagainst', 'https://www.youtube.com/watch?v=e8X3ACToii0', 'Rise Against - Savior (Official Music Video)'),
(39, 'riseagainst', 'https://www.youtube.com/watch?v=y5ZbTSOd3C4', 'Sight Unseen'),
(40, 'riseagainst', 'https://www.youtube.com/watch?v=eNZiksG5_oY', 'Worth Dying For'),
(41, 'enrique', 'https://www.youtube.com/watch?v=YUiVIPgJA0o', 'Enrique Iglesias - I\'m A Freak ft. Pitbull'),
(43, 'enrique', 'https://www.youtube.com/watch?v=Do2yf5JoJaA', 'Enrique Iglesias - There Goes My Baby ft. Flo Rida (Official Lyric Video)'),
(44, 'enrique', 'https://www.youtube.com/watch?v=NUsoVlDFqZg', 'Enrique Iglesias - Bailando ft. Descemer Bueno, Gente De Zona (Español)'),
(45, 'enrique', 'https://www.youtube.com/watch?v=HfszInbOhd8', 'Enrique Iglesias - Let Me Be Your Lover ft. Pitbull'),
(46, 'enrique', 'https://www.youtube.com/watch?v=1CegX29TikU', 'Enrique Iglesias - You And I'),
(47, 'enrique', 'https://www.youtube.com/watch?v=sC2nElyx7Ds', 'Enrique Iglesias - Heart Attack'),
(48, 'enrique', 'https://www.youtube.com/watch?v=ycztLEFLg14', 'Enrique Iglesias - Still Your King'),
(49, 'enrique', 'https://www.youtube.com/watch?v=mHxOltrMfX8', 'Enrique Iglesias - Turn The Night Up (Official)'),
(50, 'enrique', 'https://www.youtube.com/watch?v=Gnt274uZ5DY', 'Enrique Iglesias - Beautiful (feat. Kylie Minoque)'),
(51, 'enrique', 'https://www.youtube.com/watch?v=m3We7p78XTo', 'Enrique Iglesias - Noche Y De Dia ft. Yandel, Juan Magan'),
(52, 'enrique', 'https://www.youtube.com/watch?v=QoH8cGOPXmM', 'Enrique Iglesias - Physical (feat. Jennifer Lopez)');

-- --------------------------------------------------------

--
-- Table structure for table `welcome_goodbye`
--

DROP TABLE IF EXISTS `welcome_goodbye`;
CREATE TABLE IF NOT EXISTS `welcome_goodbye` (
  `server` varchar(30) NOT NULL,
  `channel` varchar(30) NOT NULL,
  PRIMARY KEY (`server`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `welcome_goodbye`
--

INSERT INTO `welcome_goodbye` (`server`, `channel`) VALUES
('943549756381220894', '943549757245259919'),
('946710733067001896', '946710733121548295'),
('935047277767163976', '935453946603012116'),
('946779417189965914', '946812403876765776'),
('922922055282860032', '922928961829371954'),
('969625262578864158', '969625262578864161');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
