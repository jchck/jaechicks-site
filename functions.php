<?php 

//Define theme URL constant 

if(!defined('JAECHICK_ROOT')) {
	define( 'JAECHICK_ROOT', get_template_directory_uri());
}

//Includes
require_once('lib/utils.php');
require_once('lib/config.php');
require_once('lib/cleanup.php');
require_once('lib/rewrites.php');
require_once('lib/scripts.php');
require_once('lib/menu.php');
require_once('lib/favicon.php');