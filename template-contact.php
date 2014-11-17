<?php
/*
Template Name: Contact Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
	<?php get_template_part('templates/page', 'header'); ?>
	<div class="row">
		<div class="col-sm-6">
			<?php get_template_part('templates/content', 'page'); ?>
		</div>
		<div class="col-sm-6">
			<?php gravity_form('contact page', false, false); ?>
		</div>
	</div>
<?php endwhile; ?>
