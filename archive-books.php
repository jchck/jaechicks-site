<?php get_template_part('templates/page', 'header'); ?>

<?php
	$args = array(
		'post_type' => array('books'),
		'posts_per_page' => -1,
	);
	$books_query = new WP_Query( $args );

?>

<div class="table-responsive">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Title</th>
				<th>Author</th>
				<th>Genre</th>
				<th>Date Read</th>
			</tr>
		</thead>
		<tbody>
			<?php while ($books_query->have_posts()) : $books_query->the_post(); ?>
			<tr>
				<td><?php the_title(); ?></td>
				<td><?php jaechick_terms( $post->id, 'author' ); ?></td>
				<td><?php jaechick_terms( $post->id, 'genre' ); ?></td>
				<td><?php the_time( 'M j, y' ); ?></td>
			</tr>
		<?php endwhile; wp_reset_postdata(); ?>
		</tbody>
	</table>
</div>