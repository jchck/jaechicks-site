// Fluidbox

$(function () {
    //$('.entry-content p a').fluidbox(); // photos in entry content 
    $('.entry-content .row a').fluidbox(); // photos in a row in entry content
    $('.pictures figure a').fluidbox(); // photos in single-pictures.php
});

// Wrap every other <figure> in <div class="row"> in pic single
$('.pics > figure').each(function(i){
	if (i % 2 === 0) {
		$(this).nextAll().andSelf().slice(0,2).wrapAll('<div class="row"></div>');
	}
});
