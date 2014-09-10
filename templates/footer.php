<?php if (!is_front_page()){?>
<footer>
	<div class="content-info" role="contentinfo">
	  <div class="row">
	  	<div class="foot-across">
	  		<ul class="list-inline">
	  			<li><a href="https://www.linkedin.com/in/justinchick" target="_blank" title="Justin Chick on LinkedIn"><i class="fa fa-linkedin"></i></a></li>
	  			<li><a href="http://twitter.com/jaechick" target="_blank" title="Follow Justin Chick on Twitter"><i class="fa fa-twitter"></i></a></li>
	  			<li><a href="mailto:hey@justinchick.com" target="_blank" title="Contact Justin Chick via Email"><i class="fa fa-envelope"></i></a></li>
	  		</ul>
	  		<?php if (!is_page('signup' )){ ?>
	  			<p class="signup"><a href="#">Did you know I have a weekly newsletter?</a></p>
	  		<?php } ?>
	  		<p class="credit"><a href="<?php echo home_url(); ?>" title="Justin Chick is a freelance WordPress developer in St. Louis MO">Made in STL</a> by Justin Chick &copy; <?php the_date( Y ); ?></p>
	  	</div>
	  </div>
	</div>
</footer>
<?php } ?>

<?php wp_footer(); ?>
