<?php

function post_thumbnail_url(){
	$thumb_id = get_post_thumbnail_id();
    $thumb_url_array = wp_get_attachment_image_src( $thumb_id, 'full' );
    $thumb_url = $thumb_url_array[0];
    echo $thumb_url;
}