<p class="byline author vcard"><?php echo __('Written by:', 'roots'); ?> <a href="<?php echo home_url( 'biography' ); ?>" rel="author" class="fn"><?php echo get_the_author(); ?></a></p>
<time class="published" datetime="<?php echo get_the_time('c'); ?>"><?php echo get_the_date(); ?></time>