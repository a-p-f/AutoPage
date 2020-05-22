(function() {
'use strict';

var menu = document.querySelector('.AutoMenu'); if (!menu) return;
// Create open/close buttons
var openButton = (function() {
	var b = document.createElement('button');
	b.classList.add('AutoMenuOpenButton');
	b.innerText = '☰';
	b.onclick = activateMenu;
	menu.parentElement.insertBefore(b, menu);
	return b;
})();
var closeButton = (function() {
	var b = document.createElement('button');
	b.classList.add('AutoMenuCloseButton');
	b.innerText = '✕';
	b.onclick = deactivateMenu;
	menu.insertBefore(b, menu.firstElementChild);
	return b;
})();

// Hide the open button when the the menu is on-screen
new IntersectionObserver(function(entries) {
	if (entries[0].isIntersecting) {
		openButton.classList.remove('AutoMenuOpenButton-visible')
		setTimeout(function() {
			openButton.style.display = 'none';
		}, 300);
	}
	else {
		openButton.style.display = 'block';
		requestAnimationFrame(function() {requestAnimationFrame(function() {
			openButton.classList.add('AutoMenuOpenButton-visible')
		})});
	}
}, {}).observe(menu);

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

function activateMenu() {
	menu.classList.add('AutoMenu-active');
	openButton.style.display = 'none';
	closeButton.style.visibility = 'visible';
	lockScroll();
}
function deactivateMenu() {
	menu.classList.remove('AutoMenu-active');
	openButton.style.display = 'block';
	closeButton.style.visibility = 'hidden';
	releaseScroll();
}

})();