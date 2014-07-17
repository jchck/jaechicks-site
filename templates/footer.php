<?php if (!is_front_page()){?>
	<footer class="content-info" role="contentinfo">
	  <div class="container">
	    <?php dynamic_sidebar('sidebar-footer'); ?>
	  </div>
	</footer>
<?php } ?>

<?php wp_footer(); ?>
