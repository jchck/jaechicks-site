<?php

require_once 'Mandrill.php';

add_action('admin_init', 'mandrill_settings_page');

function mandrill_settings_page(){
	add_options_page( __( 'Mandrill Settings', 'mandrill_emailer' ),
	__( 'Mandrill Emailer', 'mandrill_emailer' ),
	'manage_options',
	'mandrill-emailer',
	'mandrill_emailer_settings_page'
	);

	add_settings_section( 'mandrill_settings_general', __( 'General Settings' ), 'mandrill_settings_general_callback', 'mandrill-emailer' );

	add_settings_section( 'mandrill_settings_template', __( 'Templates' ), 'mandrill_settings_template_callback', 'mandrill-emailer' );

	add_settings_field( 'mandrill_use_mandrill', __( 'Use Mandrill for Email' ), 'mandrill_use_mandrill_callback', 'mandrill-emailer', 'mandrill_settings_general' );
	register_setting( 'mandrill-emailer', 'mandrill_use_mandrill' );

	add_settings_field( $id, $title, $callback, $page, $section, $args );
}