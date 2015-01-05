<?php 

/**
* Registers a new post type
* @uses $wp_post_types Inserts new post type object into the list
*
* @param string  Post type key, must not exceed 20 characters
* @param array|string  See optional args description above.
* @return object|WP_Error the registered post type object, or an error object
*/
function jaechick_books() {

	$labels = array(
		'name'                => __( 'Books', 'text-domain' ),
		'singular_name'       => __( 'book', 'text-domain' ),
		'add_new'             => _x( 'Add New book', 'text-domain', 'text-domain' ),
		'add_new_item'        => __( 'Add New book', 'text-domain' ),
		'edit_item'           => __( 'Edit book', 'text-domain' ),
		'new_item'            => __( 'New book', 'text-domain' ),
		'view_item'           => __( 'View book', 'text-domain' ),
		'search_items'        => __( 'Search Books', 'text-domain' ),
		'not_found'           => __( 'No Books found', 'text-domain' ),
		'not_found_in_trash'  => __( 'No Books found in Trash', 'text-domain' ),
		'parent_item_colon'   => __( 'Parent book:', 'text-domain' ),
		'menu_name'           => __( 'Books', 'text-domain' ),
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
			'title', 'editor','custom-fields', 'page-attributes'
			)
	);

	register_post_type( 'books', $args );
}

add_action( 'init', 'jaechick_books' );
