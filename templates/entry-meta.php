<p class="byline author vcard">
	<?php if (is_singular( 'pictures' )) {
		echo 'Pictures by:';
	} else {
		echo 'Written by:';
	} ?>
	<a href="<?php echo home_url( 'biography' ); ?>" rel="author" class="fn">
		<?php echo get_the_author(); ?>
	</a>
</p>