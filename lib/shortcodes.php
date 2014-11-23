<?php 

add_shortcode('one_half_first', 'one_half_first');
function one_half_first( $atts, $content = null ){
	return '<div class="row"><div class="col-sm-6">' . do_shortcode($content) . '</div>';
}
add_shortcode('one_half_last', 'one_half_last');
function one_half_last( $atts, $content = null ){
	return '<div class="col-sm-6">' . do_shortcode($content) . '</div></div>';
}