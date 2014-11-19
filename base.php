<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?>>
<div class="site-wrap">
<?php get_template_part( 'templates/sidebar', 'wrapper' ); ?>
<div class="push-wrap">
  <div class="it-all">
  <a href="#" class="toggle-nav"><i class="fa fa-bars"></i></a>

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

  <?php
    if (!is_front_page()) {
      do_action( 'get_header' );
      get_template_part( 'templates/header', 'simple' );
    } else {
      get_template_part( 'templates/home' );
    } ?>

  <?php if (!is_front_page()){ ?>
    <div class="wrap container" role="document">
      <div class="content row">
        <main class="main <?php echo roots_main_class(); ?>" role="main">
          <?php include roots_template_path(); ?>
        </main><!-- /.main -->
        <?php if (roots_display_sidebar()) : ?>
          <aside class="sidebar <?php echo roots_sidebar_class(); ?>" role="complementary">
            <?php include roots_sidebar_path(); ?>
          </aside><!-- /.sidebar -->
        <?php endif; ?>
      </div><!-- /.content -->
    </div><!-- /.wrap -->
  <?php } ?>

  <?php get_template_part('templates/footer'); ?>
</div><!-- /.it-all -->
</div><!-- /.push-wrap -->
</div><!-- /.site-wrap -->
</body>
</html>
