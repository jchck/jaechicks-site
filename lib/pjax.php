<?php

require_once locate_template('/assets/vendor/pjaxy/load.php');

add_action('after_theme_setup', 'pjax_setup');

function pjax_setup(){
	add_theme_support( 'pjax' );

	// the css selector for the container pjaxy is to update
	define( 'PJAXY_CONTAINER', '.wrapper' );

	// Does your theme use custom header images? Tell Pjaxy where to update those
	//define( 'PJAXY_HEADER_IMG', 'header#branding > a img' );
}