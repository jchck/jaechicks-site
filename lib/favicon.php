<?php

function jaechick_favicon() 
	{ ?>
		<link rel="shortcut icon" href="<?php echo JAECHICK_ROOT . '/assets/img/favicon.ico'?>" />
	<?php }
add_action('wp_head', 'jaechick_favicon');