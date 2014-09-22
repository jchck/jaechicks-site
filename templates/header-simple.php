<header>
	<div class="bg">
		<div class="table">
		  <div>
		    <?php get_template_part( 'templates/logo' ); ?>
		    <?php if (! is_page('signup')) { ?>
		    	<?php wp_nav_menu(array('theme_location' => 'primary_navigation')); ?>
		    <?php } ?>
		    
		  </div>
		</div>
	</div>
</header>