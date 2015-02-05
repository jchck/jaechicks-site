<?php 

add_shortcode('one_half_first', 'one_half_first');
function one_half_first( $atts, $content = null ){
	return '<div class="row"><div class="col-sm-6">' . do_shortcode($content) . '</div>';
}
add_shortcode('one_half_last', 'one_half_last');
function one_half_last( $atts, $content = null ){
	return '<div class="col-sm-6">' . do_shortcode($content) . '</div></div>';
}

/**
 * shortcode format = [fitvids embed=//www.youtube.com/embed/1yqVD0swvWU?rel=0&amp;showinfo=0]
 */
add_shortcode('fitvids', 'fitvids');
function fitvids( $atts, $embed = null ){
	extract( shortcode_atts( array(
		"embed" => 'null'
		),
		$atts ) );
	$video_wrapper = '<div class="video-wrapper"><iframe width="853" height="480" src="';
	$video_wrapper .= $embed;
	$video_wrapper .= '" frameborder="0" allowfullscreen></iframe></div>';

	return $video_wrapper;
}