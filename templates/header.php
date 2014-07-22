<header class="banner navbar navbar-default navbar-static-top" role="banner">
  <div class="container">

    <div class="table">
      <div>
        <a href="<?php echo esc_url(home_url('/')); ?>/">
          <object type="image/svg+xml" data="<?php echo get_template_directory_uri() . '/assets/img/logo.svg' ?>" class="logo"></object>
        </a>
      </div>
    </div>

    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>/">Navbar Brand!</a>
    </div>

    <nav class="collapse navbar-collapse" role="navigation">
      <?php
        if (has_nav_menu('primary_navigation')) :
          wp_nav_menu(array('theme_location' => 'primary_navigation', 'menu_class' => 'nav navbar-nav menu'));
        endif;
      ?>
    </nav>
  </div>
</header>