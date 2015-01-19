<?php while (have_posts()) : the_post(); ?>

  <article <?php post_class(); ?>>
    <header class="page-header">
      <h1 class="entry-title"><?php the_title(); ?></h1>
    </header>
    <a href="<?php post_thumbnail_url() ?>">
      <figure>
        <?php the_post_thumbnail(); ?>
        <figcaption>
          <header>
            <h3><a><?php the_excerpt(); ?></a></h3>
          </header>
        </figcaption>
      </figure>
    </a>
    <div class="entry-content">
      <?php the_content(); ?>
    </div>
    <div class="row">
      <div class="project-deets">
        <h6>Client Name: Justin Chick<h6>
        <h6>Discipline: CSS3, HTML5, WordPress</h6>
        
      </div>
    </div>
    <footer>
      <?php get_template_part('templates/entry-meta'); ?>
      <?php wp_link_pages(array('before' => '<nav class="page-nav"><p>' . __('Pages:', 'roots'), 'after' => '</p></nav>')); ?>
      <span>#</span>
    </footer>
  </article>
<?php endwhile; ?>
