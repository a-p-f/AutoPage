(function() {
'use strict';

var menu = document.querySelector('.AutoMenu'); if (!menu) return;
// var openButton = (function() {
// 	var b = document.createElement('button');
// 	b.classList.add('AutoMenuOpenButton');
// 	b.innerText = '☰';
// 	b.onclick = function() {toggleMenu(true)}
// 	menu.parentElement.insertBefore(b, menu);
// 	return b;
// })();
// var closeButton = (function() {

// })();

// function toggleOpenButton(show) {

// }
// function toggleMenu(active) {

// }

// Add menu button, add click handler
var menuButton = document.createElement('button');
menuButton.classList.add('AutoMenuButton');
menuButton.innerText = '☰';
menuButton.onclick = function() {
	menuButton.classList.toggle('AutoMenuButton-menuShown');
	menu.classList.toggle('AutoMenu-shown');
}
menu.parentElement.insertBefore(menuButton, menu);

// Hide the menu button when the the menu is on-screen
new IntersectionObserver(function(entries) {
	if (entries[0].isIntersecting) {
		menuButton.classList.remove()
		menuButton.style.display = 'none';
	}
	else {
		menuButton.style.display = 'block';
	}
}, {}).observe(menu);

})();