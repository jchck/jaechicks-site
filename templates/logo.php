<a class="svg" href="<?php echo esc_url(home_url('/')); ?>/">
	<?php if (current_theme_supports('github' )) { ?>
		<i class="fa fa-spinner fa-spin fa-5x"></i>
	<?php } else { ?> 
		<object type="image/svg+xml" data="<?php echo get_template_directory_uri() . '/assets/img/logo.svg' ?>" class="logo"></object>
	<?php } ?>
</a>