<?php 

function jaechick_author_name() { ?>
	<meta name="author" content="<?php echo AUTHOR_NAME; ?>">
<?php }
if (AUTHOR_NAME){
	add_action('wp_head', 'jaechick_author_name', 5 );
}

function jaechick_google_plus() { ?>
	<meta name="author" href="https://plus.google.com/u/0/<?php echo GOOGLE_PLUS; ?>">
<?php }
if (GOOGLE_PLUS){
	add_action('wp_head', 'jaechick_google_plus', 5 );
}

function jaechick_social_exerpt($post_id){
	// @link http://wordpress.stackexchange.com/a/54629/54644
	$the_post = get_post($post_id);
	$the_excerpt = $the_post->post_content;
	$excerpt_length = 25; // sets excerpt length by word count
	$the_excerpt = strip_tags(strip_shortcodes($the_excerpt));
	$words = explode(' ', $the_excerpt, $excerpt_length + 1);

	if(count($words) > $excerpt_length) :
		array_pop($words);
		array_push($words, '…');
		$the_excerpt = implode(' ', $words);
	endif;

	return $the_excerpt;
}

function jaechick_twitter_share() { ?>
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:site" content="@<?php echo TWITTER_NAME; ?>" />
	<meta property="twitter:creator" content="@<?php echo TWITTER_NAME; ?>" />
	<meta property="twitter:title" content="<?php wp_title('|', true, 'right'); ?>" />
	<meta property="twitter:url" content="<?php echo the_permalink(); ?>" />
	<meta property="twitter:domain" content="<?php echo esc_url(home_url()); ?>" />
	<meta property="twitter:description" content="<?php echo jaechick_social_exerpt($post_id); ?>" />
<?php }
if (current_theme_supports( 'twitter-share' )){
	add_action('wp_head', 'jaechick_twitter_share', 10);
}

function jaechick_facebook_share(){ ?>
	<meta property="og:type" content="article" />
	<meta property="og:title" content="<?php wp_title('|', true, 'right'); ?>" />
	<meta property="og:description" content="<?php echo jaechick_social_exerpt($post_id); ?>" />
	<meta property="og:url" content="<?php echo the_permalink(); ?>" />
	<meta property="og:site_name" content="<?php echo AUTHOR_NAME; ?>" />
	<meta property="og:image" content="http://pjrvs.com/themes/new/assets/pjrvs.jpg" />
<?php }
if (current_theme_supports( 'facebook-share' )){
	add_action('wp_head', 'jaechick_facebook_share', 10);
}