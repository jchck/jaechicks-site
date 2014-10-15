<?php
/*
Template Name: Landing Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'page'); ?>
<?php endwhile; ?>

<p class="back"><a href="<?php echo esc_url(home_url('/')); ?>/"><i class="fa fa-hand-o-left"></i> back to justinchick.com</a></p>
