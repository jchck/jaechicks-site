<article <?php post_class('notebook-entry'); ?>>
  <header>
    <h3 class="entry-title">
    	<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    </h3>
  </header>
  <div class="entry-summary">
    <?php the_excerpt(); ?>
  </div>
</article>
