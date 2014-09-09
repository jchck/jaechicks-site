<?php while (have_posts()) : the_post(); ?>
  <article <?php post_class(); ?>>
    <header class="page-header">
      <h1 class="entry-title"><?php the_title(); ?></h1>
    </header>
    <a href="<?php the_permalink(); ?>">
      <figure>
        <?php the_post_thumbnail( $size, $attr ); ?>
        <figcaption>
          <header>
            <h3><a href="<?php the_permalink(); ?>"><?php the_excerpt(); ?></a></h3>
          </header>
        </figcaption>
      </figure>
    </a>
    <div class="entry-content">
      <?php the_content(); ?>
    </div>
    <footer>
      <?php get_template_part('templates/entry-meta'); ?>
      <?php wp_link_pages(array('before' => '<nav class="page-nav"><p>' . __('Pages:', 'roots'), 'after' => '</p></nav>')); ?>
      <span>#</span>
    </footer>
  </article>
<?php endwhile; ?>
