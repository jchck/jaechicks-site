<?php 

function jaechick_author_name() { ?>
	<meta name="author" content="<?php echo AUTHOR_NAME; ?>">
<?php }
if (AUTHOR_NAME){
	add_action('wp_head', 'jaechick_author_name', 5 );
}

function jaechick_google_plus() { ?>
	<meta name="author" href="https://plus.google.com/u/0/<?php echo GOOGLE_PLUS; ?>">
<?php }
if (GOOGLE_PLUS){
	add_action('wp_head', 'jaechick_google_plus', 5 );
}