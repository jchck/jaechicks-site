<?php 
	$blog = $wp_query;
	$wp_query = null;
	$wp_query = new WP_Query(); $wp_query->query('posts_per_page=10');
	while ($wp_query->have_posts()) : $wp_query->the_post();
?>

<div class="row">
	<h3 class="col-sm-12"><a href="<?php echo the_permalink();?>"><?php the_title();?></a></h3>
	<div class="col-sm-12"><?php echo the_excerpt();?></div>
</div>
<hr />
<?php endwhile; ?>

<?php wp_reset_query(); ?>