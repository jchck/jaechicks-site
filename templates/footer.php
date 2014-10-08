<?php if (!is_front_page()){?>
<footer>
	<div class="content-info" role="contentinfo">
	  <div class="row">
	  	<div class="foot-across">
	  		<ul class="list-inline">
	  			<li><a href="https://www.linkedin.com/in/justinchick" target="_blank" title="Justin Chick on LinkedIn"><i class="fa fa-linkedin"></i></a></li>
	  			<li><a href="http://twitter.com/jaechick" target="_blank" title="Follow Justin Chick on Twitter"><i class="fa fa-twitter"></i></a></li>
	  			<li><a href="https://github.com/jaechick" target="_blank" title="See Justin Chick code on Github"><i class="fa fa-github"></i></a></li>
	  			<li><a href="https://medium.com/@jaechick" target="_blank" title="Read with Justin Chick on Medium"><i class="fa fa-medium"></i></a></li>
	  			<li><a href="mailto:hey@justinchick.com" target="_blank" title="Contact Justin Chick via Email"><i class="fa fa-envelope"></i></a></li>
	  		</ul>
	  		<?php if (!is_page('signup' )){ ?>
	  			<p class="signup"><a href="<?php echo home_url( 'signup' ); ?>">Did you know I have a weekly newsletter?</a></p>
	  		<?php } ?>
	  		<p class="credit"><a href="<?php echo home_url(); ?>" title="Justin Chick is a freelance WordPress developer in St. Louis MO">Made in STL</a> by <a href="<?php echo home_url( 'biography' ); ?>" title="Be sur to update this later">Justin Chick</a> with <a href="http://www.justintakespictures.co/" target="_blank" title="Justin Takes Pictures - Things As I See Them"><i class="fa fa-heart-o"></i></a></p>
	  		<p class="credit">&copy; <?php the_date( Y ); ?></p>
	  	</div>
	  </div>
	</div>
</footer>
<?php } ?>

<?php wp_footer(); ?>
