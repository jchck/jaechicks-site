<?php



/**
* Registers a new post type
* @uses $wp_post_types Inserts new post type object into the list
*
* @param string  Post type key, must not exceed 20 characters
* @param array|string  See optional args description above.
* @return object|WP_Error the registered post type object, or an error object
*/
function portfolio() {

	$labels = array(
		'name'                => __( 'Portfolio', 'text-domain' ),
		'singular_name'       => __( 'Portfolio Item', 'text-domain' ),
		'add_new'             => _x( 'Add New Portfolio Item', 'text-domain', 'text-domain' ),
		'add_new_item'        => __( 'Add New Portfolio Item', 'text-domain' ),
		'edit_item'           => __( 'Edit Portfolio Item', 'text-domain' ),
		'new_item'            => __( 'New Portfolio Item', 'text-domain' ),
		'view_item'           => __( 'View Portfolio Item', 'text-domain' ),
		'search_items'        => __( 'Search Portfolio Items', 'text-domain' ),
		'not_found'           => __( 'No Portfolio Items found', 'text-domain' ),
		'not_found_in_trash'  => __( 'No Portfolio Items found in Trash', 'text-domain' ),
		'parent_item_colon'   => __( 'Parent Portfolio Item:', 'text-domain' ),
		'menu_name'           => __( 'Portfolio Items', 'text-domain' ),
	);

	$args = array(
		'labels'                   => $labels,
		'hierarchical'        => false,
		'description'         => 'description',
		'taxonomies'          => array(),
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 5,
		'menu_icon'           => null,
		'show_in_nav_menus'   => true,
		'publicly_queryable'  => true,
		'exclude_from_search' => false,
		'has_archive'         => true,
		'query_var'           => true,
		'can_export'          => true,
		'rewrite'             => true,
		'capability_type'     => 'post',
		'supports'            => array(
			'title', 'editor', 'thumbnail',
			'excerpt', 'revisions'
			)
	);

	register_post_type( 'portfolio', $args );
}

add_action( 'init', 'portfolio' );
