# [jaechick's site](http://justinchick.com)

jaechick's site is a WordPress theme built on [Roots](http://roots.io/starter-theme/).

## Requirements
* [Node](http://nodejs.org/)
	* via [installer](http://nodejs.org/download/)
* [grunt-cli](http://gruntjs.com/getting-started)
	* via command line `npm install grunt-cli -g`
* [Composer](https://getcomposer.org/)
	* via command line `curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer`

## Features
* Everything Roots includes
* Multiple page templates - using the standard [WordPress Template Hierarchy](http://wphierarchy.com/)
	* [Default page](http://justinchick.com/biography/)
	* [Landing page](https://github.com/jaechick/jaechicks-site/blob/master/template-landing.php)
	* [Blog index](http://justinchick.com/notebook/)
	* [Contact page](http://justinchick.com/contact/) (making use of [Gravity Forms](http://www.gravityforms.com/) )
	* Life changing [404 page](http://justinchick.com/404)
	* Beautiful photography [portfolio](http://justinchick.com/pictures/)
	* Index of [books read](http://justinchick.com/books/)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
* [Fluidbox](http://terrymun.github.io/Fluidbox/)
* Off canvas mobile navigation
* [Our Collective Base Styles](https://github.com/jaechick/Our-Collective-Base-Styles)
* [Prism](http://prismjs.com/index.html)

## But Wait! Their's More!
* Front-end package management via [Bower](http://bower.io/)!
	* Bootstrap
	* Fluidbox
	* Font Awesome
	* Modernizr
	* Respond.js
* PHP dependency management via [Composer](https://getcomposer.org/)
	* [Option Tree](https://github.com/valendesigns/option-tree)
* LESS & jQuery compiling and jQuery linting via [Grunt](http://gruntjs.com/)

## Installation
1. Clone the repo `git clone https://github.com/jaechick/jaechicks-site.git`
2. Update npm `npm update npm -g`
3. cd into the theme directory
4. Install Grunt and Bower dependencies `npm install`
5. Install Composer dependencies `composer install`
6. Activate theme locally
7. Get ready to rock & roll