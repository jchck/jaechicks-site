<?php 
	$args = array('posts_per_page' => 3);
	$notebook_query = new WP_Query( $args );

	
	while ($notebook_query->have_posts()) : $notebook_query->the_post();
?>

<div class="notebook-entry">
	<h3 class="col-sm-12"><a href="<?php echo the_permalink();?>"><?php the_title();?></a></h3>
	<div class="col-sm-12"><?php echo the_excerpt();?></div>
</div>
<?php endwhile; ?>

<?php if ($notebook_query->max_num_pages > 1) : ?>
  <nav class="post-nav">
    <ul class="pager">
      <li class="previous"><?php next_posts_link(__('&larr; Older posts', 'roots')); ?></li>
      <li class="next"><?php previous_posts_link(__('Newer posts &rarr;', 'roots')); ?></li>
    </ul>
  </nav>
<?php endif; ?>

<?php wp_reset_postdata(); ?>