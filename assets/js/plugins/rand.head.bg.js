// For random header background images
// This approach was used in order to manipulate pseudo-elements
var count = 15,
	css = '.bg:after { background-image: url(/wp-content/themes/my-site/assets/img/bg/'+(Math.floor(Math.random()*(count))+1)+'.jpg); }',
	head = document.head || document.getElementsByTagName('head')[0],
	style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
head.appendChild(style);

// var count = 15,
// 	css = '.header { background-image: url(/wp-content/themes/my-site/assets/img/bg/'+(Math.floor(Math.random()*(count))+1)+'.jpg); }',
// 	head = document.head || document.getElementsByTagName('head')[0],
// 	style = document.createElement('style');

// style.type = 'text/css';
// if (style.styleSheet){
// 	style.styleSheet.cssText = css;
// } else {
// 	style.appendChild(document.createTextNode(css));
// }
// head.appendChild(style);