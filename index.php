<?php get_header(); ?>
<body>
	<!-- Header -->
	<div id="header" class="skel-panels-fixed">
		<div class="top">
			<!-- Logo -->
			<?php get_template_part( 'parts/element', 'toplogo' ); ?>
			<!-- Nav -->
			<?php get_template_part('parts/element', 'nav' ); ?>						
		</div>			
		<div class="bottom">
			<!-- Social Icons -->
			<?php get_template_part('parts/element', 'social' ); ?>	
		</div>		
	</div>
	<!-- Main -->
	<div id="main">		
		<!-- Intro -->
		<?php get_template_part('parts/element', 'intro' ); ?>		
		<!-- About Me -->
		<?php get_template_part('parts/element','about' ); ?>					
		<!-- Portfolio -->
		<?php get_template_part('parts/element', 'portfolio' ); ?>		
		<!-- The Process -->
		<?php get_template_part('parts/element', 'process' ); ?>			
		<!-- Contact -->
		<?php get_template_part('parts/element', 'contact' ); ?>			
	</div>
<?php get_footer();?>