<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?>>
<div class="wrapper">

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

<div class="sidebar-wrapper">
  <div class="sidebar-wrapper">
    <ul class="sidebar-nav">
      <li class="sidebar-brand">
        <a href="#">Start Bootstrap</a>
      </li>
      <li>
        <a href="#">Dashboard</a>
      </li>
      <li>
        <a href="#">Shortcuts</a>
      </li>
      <li>
        <a href="#">Overview</a>
      </li>
      <li>
        <a href="#">Events</a>
      </li>
      <li>
        <a href="#">About</a>
      </li>
      <li>
        <a href="#">Services</a>
      </li>
      <li>
        <a href="#">Contact</a>
      </li>
    </ul>
  </div>
</div>

<div class="page-content-wrapper">
  <a href="#menu-toggle" class="off-canvas-toggle" id="menu-toggle">Toggle Menu</a>

  <?php if (!is_front_page()){ ?>
    <?php
      do_action('get_header');
      get_template_part('templates/header', 'simple');
    ?>
  <?php } ?>

  <?php if (is_front_page()){ ?>
    <?php get_template_part( 'templates/home' ); ?>
  <?php } ?>

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
</div>
</div>
</body>
</html>
