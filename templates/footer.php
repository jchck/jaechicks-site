<?php if (!is_front_page()){?>
<footer>
	<div class="content-info" role="contentinfo">
	  <div class="row">
	  	<div class="foot-across">
	  		<?php if (!is_page_template( 'template-landing.php' )){ ?>
	  		<ul class="list-inline">
	  			<li><a href="https://www.linkedin.com/in/justinchick" target="_blank" title="Justin Chick on LinkedIn"><i class="fa fa-linkedin"></i></a></li>
	  			<li><a href="http://twitter.com/jaechick" target="_blank" title="Follow Justin Chick on Twitter"><i class="fa fa-twitter"></i></a></li>
	  			<li><a href="https://github.com/jaechick" target="_blank" title="See Justin Chick code on Github"><i class="fa fa-github"></i></a></li>
	  			<li><a href="https://medium.com/@jaechick" target="_blank" title="Read with Justin Chick on Medium"><i class="fa fa-medium"></i></a></li>
	  		</ul>
		  		<?php if (current_theme_supports('signup' )) { ?>
		  			<p class="signup"><a href="<?php echo home_url( 'signup' ); ?>">Did you know I have a weekly newsletter?</a></p>
		  		<?php } ?>
		  		<?php if (current_theme_supports( 'work-together' ) ) { ?>
		  			<?php if (! is_page_template( 'template-notebook.php' )) { ?>
		  				<p class="signup"><a href="<?php echo home_url( 'lets-work-together' ); ?>">Do you want to work together?</a></p>
		  			<? } else { ?>
		  				<div class="row">
		  					<div class="ad-space">
		  						<div class="ad-container">
			  						<a href="http://ourcollective.is" target="_blank">
			  							<img src="<?php echo get_template_directory_uri() . '/assets/img/oc-logo.png'; ?>" />
			  							<div class="ad-description">
			  								<p>Let's Work</p>
			  							</div>
			  						</a>
			  					</div>
		  					</div>
		  					<div class="ad-space">
		  						<div class="ad-container">
			  						<a class="thumbnail" href="http://referrals.trhou.se/justinchick" target="_blank">
			  							<img src="<?php echo get_template_directory_uri() . '/assets/img/treehouse-logo.png'; ?>" />
				  						<div class="ad-description">
				  							<p>Let's Learn</p>
				  						</div>
			  						</a>
		  						</div>
		  					</div>
		  				</div>
		  			<?php } ?>
		  			
		  		<?php } ?>
	  		<?php } ?>
	  		<p class="credit"><a href="<?php echo home_url(); ?>" title="Justin Chick is a WordPress developer in St. Louis MO">Made in STL</a> by <a href="<?php echo home_url( 'biography' ); ?>" title="Justin Chick is a WordPress consultant, designer, developer, project manager">Justin Chick</a> | <a href="<?php echo home_url( 'colophon' ); ?>">Colophon</a></p>
	  		<p class="credit">&copy; <?php the_date( 'Y' ); ?></p>
	  	</div>
	  </div>
	</div>
</footer>
<?php } ?>

<?php wp_footer(); ?>
