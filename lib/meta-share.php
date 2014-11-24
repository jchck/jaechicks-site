<?php 

function jaechick_author_name() { ?>
	<meta name="author" content="<?php echo AUTHOR_NAME; ?>">
<?php }
if (AUTHOR_NAME && !current_user_can('manage_options')){
	add_action('wp_head', 'jaechick_author_name' );
}

function jaechick_google_plus() { ?>
	<meta name="author" href="https://plus.google.com/u/0/<?php echo GOOGLE_PLUS; ?>">
<?php }
if (GOOGLE_PLUS && !current_user_can('manage_options')){
	add_action('wp_head', 'jaechick_google_plus' );
}