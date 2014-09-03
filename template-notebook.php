<?php
/*
Template Name: Notebook Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'notebook'); ?>
<?php endwhile; ?>
