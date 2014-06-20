<?php
function jaechick_scripts() {
	/*
		Attach The JS
	*/
	wp_deregister_script('jquery');
	wp_register_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', array(), null, false);

	wp_register_script('all', JAECHICK_ROOT . '/assets/js/scripts.all.min.js', array('jquery'), null, false);
	wp_enqueue_script('all');

	/*
		Attach IE Conditional Stylesheets
		Beginning with IE9
	*/
	wp_enqueue_style('ie9', JAECHICK_ROOT . '/assets/css/ie9.css', null, null);
	
	add_filter('style_loader_tag', 'ie9_conditional', 10, 2);
	
	function ie9_conditional( $tag, $handle ) {
	
	if ( 'ie9' == $handle )
		$tag = '<!--[if lte IE 9]>' . "\n" . $tag . '<![endif]-->' . "\n";
	
	return $tag;	
	}
	/*
		IE8
	*/
	wp_enqueue_style('ie8', JAECHICK_ROOT . '/assets/css/ie8.css', null, null);
	
	add_filter('style_loader_tag', 'ie8_conditional', 10, 2);
	
	function ie8_conditional( $tag, $handle ) {
	
	if ( 'ie8' == $handle )
		$tag = '<!--[if lte IE 8]>' . "\n" . $tag . '<![endif]-->' . "\n";
	
	return $tag;	
	}
	/*
		HTML 5 SHIV for IE8 Only
	*/
	echo '<!--[if lt IE 8]><script src="/personal/new-site/assets/js/html5shiv.js"></script><![endif]-->';
	/*
		Attach Style Sheets For Peeps With JS Disabled
	*/
	wp_enqueue_style('no-script', JAECHICK_ROOT . '/assets/css/skel-noscript.css', null, null);
	
	add_filter('style_loader_tag', 'no_script', 10, 2);
	
	function no_script($tag, $handle){
		if('no-script' == $handle)
			$tag = '<noscript>' . "\n" . $tag . '</noscript>' . "\n";
		return $tag;
	}
	
}
add_action('wp_enqueue_scripts', 'jaechick_scripts', 100);