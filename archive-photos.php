<?php get_template_part('templates/page', 'header'); ?>
<?php $count = 1; ?>
<?php while (have_posts()) : the_post(); ?>
	<?php $class = ($count==1) ? 'class="first"' : ''; ?>
		<article <?php echo $class; ?>>
  			<div class="entry-summary">
    			<?php if ( has_post_thumbnail() ){ ?>
    			<a href="<?php the_permalink(); ?>">
	       			<figure>
	          			<?php the_post_thumbnail( $size, $attr ); ?>
	          			<figcaption>
		            		<header>
		              			<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
		              			<h5><?php the_excerpt(); ?></h5>
		            		</header>
	          			</figcaption>
	        		</figure>
      			</a>
    			<?php } ?> 
  			</div>
		</article>
<?php $count++; ?>
<?php endwhile; ?>

<?php if ($wp_query->max_num_pages > 1) : ?>
<nav class="post-nav">
	<ul class="pager">
		<li class="previous"><?php next_posts_link(__('&larr; Older posts', 'roots')); ?></li>
		<li class="next"><?php previous_posts_link(__('Newer posts &rarr;', 'roots')); ?></li>
	</ul>
</nav>
<?php endif; ?>