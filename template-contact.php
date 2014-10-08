<?php
/*
Template Name: Contact Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
	<?php get_template_part('templates/page', 'header'); ?>
	<!-- <div class="row">
		<div class="col-sm-12">
			<ul class="list-inline">
				<li><a class="btn btn-primary" href="http://twitter.com/jaechick" target="_blank">@jaechick</a></li>
				<li><a class="btn btn-primary" href="mailto:hey@justinchick.com" target="_blank">hey [at] justinchick.com</a></li>
				<li><a class="btn btn-primary" href="tel:13144883200" target="_blank">(314) 488-3200</a></li>
			</ul>
		</div>
	</div> -->
	<div class="row">
		<div class="col-sm-6">
			<?php get_template_part('templates/content', 'page'); ?>
		</div>
		<div class="col-sm-6">
			<?php gravity_form('contact page', false, false); ?>
		</div>
	</div>
<?php endwhile; ?>
