<?php
/**
 * Clean up the_excerpt()
 */
function roots_excerpt_more($more) {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'roots') . '</a>';
}
add_filter('excerpt_more', 'roots_excerpt_more');

/**
 * Manage output of wp_title()
 */
function roots_wp_title($title) {
  if (is_feed()) {
    return $title;
  }

  $title .= get_bloginfo('name');

  return $title;
}
add_filter('wp_title', 'roots_wp_title', 10);

/**
 * Add favicon to head
 * via wp_head
 */
function jaechick_favicon(){ ?>
	<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri() . '/assets/img/favicon.png'; ?>" sizes="16x16" />
<?php }
if (current_theme_supports( 'favicon' )){
	add_action('wp_head', 'jaechick_favicon' );
}