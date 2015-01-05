<?php get_template_part('templates/page', 'header'); ?>

<?php
	$books = $wp_query;
	$wp_query = null;
	$wp_query = new $WP_Query();
	$wp_query->query(
		'posts_per_page=-1'
	);
	while ($wp_query->have_posts()) : $wp_query->the_post();
?>

<div class="table-responsive">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Title</th>
				<th>Author</th>
				<th>Genre</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>The Tao of Pooh</td>
				<td>Benjamin Hoff</td>
				<td>Spirituality</td>
			</tr>
			<tr>
				<td>The Tao of Pooh</td>
				<td>Benjamin Hoff</td>
				<td>Spirituality</td>
			</tr>
			<tr>
				<td>The Tao of Pooh</td>
				<td>Benjamin Hoff</td>
				<td>Spirituality</td>
			</tr>
			<tr>
				<td>The Tao of Pooh</td>
				<td>Benjamin Hoff</td>
				<td>Spirituality</td>
			</tr>
		</tbody>
	</table>
</div>

<?php endwhile; wp_reset_query(); ?>
