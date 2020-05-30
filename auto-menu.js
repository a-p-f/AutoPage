(function() {
'use strict';

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
	var menu = document.getElementById('AutoMenu'); 
	if (!menu) return;
	menu.classList.add('AutoMenu');

	var isActive = false;
	var activatedAt = null;

	// Create open/close buttons
	var openButton = (function() {
		var b = document.createElement('button');
		b.classList.add('AutoMenuOpenButton');
		b.setAttribute('aria-hidden', 'true');
		b.innerText = '☰';
		b.onclick = activateMenu;
		menu.parentElement.insertBefore(b, menu);
		return b;
	})();
	var closeButton = (function() {
		var wrapper = document.createElement('div');
		wrapper.classList.add('AutoMenuCloseWrapper');
		menu.insertBefore(wrapper, menu.firstElementChild);
		var b = document.createElement('button');
		b.classList.add('AutoMenuCloseButton');
		b.setAttribute('aria-hidden', 'true');
		b.innerText = '✕';
		b.onclick = function() {
			if (isActive) {
				deactivateMenu();
			}
			else {
				menu.nextElementSibling.scrollIntoView();
			}
		}
		wrapper.appendChild(b);
		return b;
	})();

	function activateMenu() {
		if (isActive) return
		isActive = true;
		activatedAt = Date.now();
		lockScroll();
		menu.classList.add('AutoMenu-active');
		menu.setAttribute('aria-modal', 'true');
		closeButton.focus();
	}
	function deactivateMenu() {
		if (!isActive) return
		isActive = false;
		menu.classList.remove('AutoMenu-active');
		releaseScroll();
		menu.removeAttribute('aria-modal');
		openButton.focus();
	}

	addEventListener('scroll', function(e) {
		/*
			User can't scroll the document while the menu is open.
			If the document scrolls, it must be because the user clicked a hash-link inside the menu. 
		*/
		if (e.target == document) {
			if (Date.now() - activatedAt < 200) {
				// This scroll event was caused by the opening of the menu.
				// Ignore it.
				return
			}
			deactivateMenu();
		}
	});
})();

document.documentElement.classList.remove('auto-menu-loading');
})();