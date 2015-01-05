<?php 
	$args = array('posts_per_page' => 10);
	$notebook_query = new WP_Query( $args );

	
	while ($notebook_query->have_posts()) : $notebook_query->the_post();
?>

<div class="notebook-entry">
	<h3 class="col-sm-12"><a href="<?php echo the_permalink();?>"><?php the_title();?></a></h3>
	<div class="col-sm-12"><?php echo the_excerpt();?></div>
</div>
<?php endwhile; ?>

<?php wp_reset_postdata(); ?>