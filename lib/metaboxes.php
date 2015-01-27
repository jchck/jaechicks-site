<?php
/**
 * Initialize the custom Meta Boxes. 
 */
add_action( 'admin_init', 'register_meta_boxes' );

/**
 * Meta Boxes demo code.
 *
 * You can find all the available option types in demo-theme-options.php.
 *
 * @return    void
 * @since     2.0
 */
function register_meta_boxes() {
  
  /**
   * Create a custom meta boxes array that we pass to 
   * the OptionTree Meta Box API Class.
   */
  $jaechick_video = array(
    'id'          => 'video_metabox',
    'title'       => __( 'YouTube Video Embeds', 'theme-text-domain' ),
    'desc'        => '',
    'pages'       => array( 'page', 'post' ),
    'context'     => 'normal',
    'priority'    => 'high',
    'fields'      => array(
      array(
        'label'       => 'YouTube Video Embed',
        'id'          => 'video_embed',
        'type'        => 'text'
      )
    )
  );
  
  /**
   * Register our meta boxes using the 
   * ot_register_meta_box() function.
   */
  if ( function_exists( 'ot_register_meta_box' ) )
    ot_register_meta_box( $jaechick_video );

}