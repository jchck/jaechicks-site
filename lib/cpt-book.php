<?php 

/**
 * Create a taxonomy
 *
 * @uses  Inserts new taxonomy object into the list
 * @uses  Adds query vars
 *
 * @param string  Name of taxonomy object
 * @param array|string  Name of the object type for the taxonomy object.
 * @param array|string  Taxonomy arguments
 * @return null|WP_Error WP_Error if errors, otherwise null.
 */
function jaechick_book_genres() {

	$labels = array(
		'name'					=> _x( 'Genres', 'Taxonomy plural name', 'text-domain' ),
		'singular_name'			=> _x( 'Genre', 'Taxonomy singular name', 'text-domain' ),
		'search_items'			=> __( 'Search Genres', 'text-domain' ),
		'popular_items'			=> __( 'Popular Genres', 'text-domain' ),
		'all_items'				=> __( 'All Genres', 'text-domain' ),
		'parent_item'			=> __( 'Parent Genre', 'text-domain' ),
		'parent_item_colon'		=> __( 'Parent Genre', 'text-domain' ),
		'edit_item'				=> __( 'Edit Genre', 'text-domain' ),
		'update_item'			=> __( 'Update Genre', 'text-domain' ),
		'add_new_item'			=> __( 'Add New Genre', 'text-domain' ),
		'new_item_name'			=> __( 'New Genre Name', 'text-domain' ),
		'add_or_remove_items'	=> __( 'Add or remove Genres', 'text-domain' ),
		'choose_from_most_used'	=> __( 'Choose from most used text-domain', 'text-domain' ),
		'menu_name'				=> __( 'Genre', 'text-domain' ),
	);

	$args = array(
		'labels'            => $labels,
		'public'            => true,
		'show_in_nav_menus' => false,
		'show_admin_column' => true,
		'hierarchical'      => true,
		'show_tagcloud'     => false,
		'show_ui'           => true,
		'query_var'         => true,
		'rewrite'           => true,
		'query_var'         => true,
		'capabilities'      => array(),
	);

	register_taxonomy( 'genre', array( 'books' ), $args );
}

add_action( 'init', 'jaechick_book_genres' );

register_taxonomy_for_object_type( 'genre', 'books' );


/**
 * Create a taxonomy
 *
 * @uses  Inserts new taxonomy object into the list
 * @uses  Adds query vars
 *
 * @param string  Name of taxonomy object
 * @param array|string  Name of the object type for the taxonomy object.
 * @param array|string  Taxonomy arguments
 * @return null|WP_Error WP_Error if errors, otherwise null.
 */
function jaechick_book_authors() {

	$labels = array(
		'name'					=> _x( 'Authors', 'Taxonomy plural name', 'text-domain' ),
		'singular_name'			=> _x( 'Author', 'Taxonomy singular name', 'text-domain' ),
		'search_items'			=> __( 'Search Authors', 'text-domain' ),
		'popular_items'			=> __( 'Popular Authors', 'text-domain' ),
		'all_items'				=> __( 'All Authors', 'text-domain' ),
		'parent_item'			=> __( 'Parent Author', 'text-domain' ),
		'parent_item_colon'		=> __( 'Parent Author', 'text-domain' ),
		'edit_item'				=> __( 'Edit Author', 'text-domain' ),
		'update_item'			=> __( 'Update Author', 'text-domain' ),
		'add_new_item'			=> __( 'Add New Author', 'text-domain' ),
		'new_item_name'			=> __( 'New Author Name', 'text-domain' ),
		'add_or_remove_items'	=> __( 'Add or remove Authors', 'text-domain' ),
		'choose_from_most_used'	=> __( 'Choose from most used text-domain', 'text-domain' ),
		'menu_name'				=> __( 'Author', 'text-domain' ),
	);

	$args = array(
		'labels'            => $labels,
		'public'            => true,
		'show_in_nav_menus' => false,
		'show_admin_column' => true,
		'hierarchical'      => true,
		'show_tagcloud'     => false,
		'show_ui'           => true,
		'query_var'         => true,
		'rewrite'           => true,
		'query_var'         => true,
		'capabilities'      => array(),
	);

	register_taxonomy( 'author', array( 'books' ), $args );
}

add_action( 'init', 'jaechick_book_authors' );

register_taxonomy_for_object_type( 'author', 'books' );

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
		'taxonomies'          => array('author', 'genre'),
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 5,
		'menu_icon'           => null,
		'show_in_nav_menus'   => true,
		'publicly_queryable'  => true,
		'exclude_from_search' => true,
		'has_archive'         => true,
		'query_var'           => true,
		'can_export'          => true,
		'rewrite'             => true,
		'capability_type'     => 'post',
		'supports'            => array( 'title' )
	);

	register_post_type( 'books', $args );
}

add_action( 'init', 'jaechick_books' );

/**
 * Returns taxominy for custom post types sans <a> links
 * @uses get_the_term_list
 * 
 * @param current post ID, most likely will be $post->id
 * @param registered taxominy to return
 */

function jaechick_terms( $post_id, $tax ){
	$author_term = get_the_term_list( $post_id, $tax );
	if (!empty($author_term)) {
		echo '',
		strip_tags($author_term) ,'';
	}
}