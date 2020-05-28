/*
	auto-menu.js

	Responsible for creating the menu show/hide button,
	and showing/hiding the menu.

	Requires auto-menu.css.
*/

(function() {
'use strict';

function gID(id) {
	return document.getElementById(id);
}

var overflowX, overflowY;
function lockScroll() {
	/*
		Note - we don't worry about reflows due scroll bars showing/hiding,
		because this will generally only be used on mobile devices, where scrollbars never take up width
	*/
	var bs = document.body.style;
	overflowX = bs.overflowX;
	overflowY = bs.overflowY;
	bs.overflowX = 'hidden';
	bs.overflowY = 'hidden';
}
function releaseScroll() {
	var bs = document.body.style;
	bs.overflowX = overflowX;
	bs.overflowY = overflowY;
}

// Prepare the AutoMenu
(function() {
	var menu = gID('AutoMenu'); if (!menu) return;
	var openButton = gID('AutoMenuOpenButton');
	var closeButton = gID('AutoMenuCloseButton');
	var isActive = false;

	openButton.onclick = activateMenu;
	closeButton.onclick = function() {
		if (isActive) {
			deactivateMenu();
		}
		else {
			menu.nextElementSibling.scrollIntoView();
		}
	}

	// // Create open/close buttons
	// var openButton = (function() {
	// 	var b = document.createElement('button');
	// 	b.classList.add('AutoMenuOpenButton');
	// 	b.innerText = '☰';
	// 	b.onclick = activateMenu;
	// 	menu.parentElement.insertBefore(b, menu);
	// 	return b;
	// })();
	// var closeButton = (function() {
	// 	var b = document.createElement('button');
	// 	b.classList.add('AutoMenuCloseButton');
	// 	b.innerText = '✕';
	// 	b.onclick = deactivateMenu;
	// 	menu.insertBefore(b, menu.firstElementChild);
	// 	return b;
	// })();



	function activateMenu() {
		if (isActive) return
		isActive = true;
		menu.classList.add('active');
		lockScroll();
	}
	function deactivateMenu() {
		if (!isActive) return
		isActive = false;
		menu.classList.remove('active');
		releaseScroll();
	}

	addEventListener('scroll', function(e) {
		/*
			User can't scroll the document while the menu is open.
			If the document scrolls, it must be because the user clicked a hash-link inside the menu. 
		*/
		if (e.target == document) {
			deactivateMenu();
		}
	});
})();

document.documentElement.classList.remove('auto-menu-loading');
})();