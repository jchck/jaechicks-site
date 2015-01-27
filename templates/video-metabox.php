<?php
	$jaechick_video = get_post_meta( $post->ID, 'video_embed', true );
	if (!empty($jaechick_video)){
		echo '<div class="video-wrapper">' . $jaechick_video .'</div>';
	}
?>