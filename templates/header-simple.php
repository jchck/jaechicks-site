<header>
	<div class="bg">
		<div class="table">
		  <div>
		    <a href="<?php echo esc_url(home_url('/')); ?>/">
		      <object type="image/svg+xml" data="<?php echo get_template_directory_uri() . '/assets/img/logo.svg' ?>" class="logo"></object>
		    </a>
		    <?php wp_nav_menu(array('theme_location' => 'primary_navigation')); ?>
		  </div>
		</div>
	</div>
</header>