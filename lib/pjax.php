<?php 

require_once( trailingslashit( get_template_directory() ) . 'pjaxy/load.php' );

add_action( 'after_setup_theme', 'mytheme_setup' );
function mytheme_setup() {
    add_theme_support( 'pjax' );

    // the css selector for the container pjaxy is to update
    //define( 'PJAXY_CONTAINER', '#pjax' );

    // Does your theme use custom header images? Tell Pjaxy where to update those
    //define( 'PJAXY_HEADER_IMG', 'header#branding > a img' );
}