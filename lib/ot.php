<?php

add_filter( 'ot_theme_mode', '__return_true' );
add_filter( 'ot_show_pages', '__return_true' );

require_once locate_template('option-tree/ot-loader.php');