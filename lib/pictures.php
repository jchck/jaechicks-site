<?php

function post_thumbnail_url(){
	$thumb_id = get_post_thumbnail_id();
    $thumb_url_array = wp_get_attachment_image_src( $thumb_id, 'full' );
    $thumb_url = $thumb_url_array[0];
    echo $thumb_url;
}

function image_figure($html, $id, $caption, $title, $align, $url){
	$html5 = "<figure class='align-$align'>";
	$html5 .= "<a href='$url'>";
	$html5 .= "<img src='$url' alt='$title' />";
	$html5 .= "</a>";

	$html5 .= "<figcaption>$caption</figcaption>";
	
	$html5 .= "</figure>";

	return $html5;
}

add_action('image_send_to_editor', 'image_figure', 10, 9);