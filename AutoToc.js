/*
    auto-toc.js

    Automatically generates Table of Contents inside any/all <auto-toc> elements.

    The resultant markup is pretty simple, and should be easy to style.
    You may want to use auto-toc.css as a starting point.
*/
function initializeAutoToc(toc) {
    'use strict';
    
    // you can call initilizeAutoToc multiple times on same element
    toc.innerHTML = '';

    // find relevant headings
    var headings = (function() {
        var headings = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
        var exclude = toc.getAttribute('exclude-headings') || 'aside *';
        var matchesMethod = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        return headings.filter(function(h) {return !matchesMethod.call(h, exclude)});
    })();

    // add ids as necessary
    headings.forEach(function(h) {
        // TODO - ensure unique
        h.id = h.id || h.innerText.replace(' ', '-').replace(/[^\w-]/g, '')
    });

    // Generate links from headings
    var links = headings.map(function(h) {
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.classList.add('AutoTocLink');
        a.classList.add('AutoTocLink-'+h.nodeName.toLowerCase());
        a.innerText = h.innerText;
        toc.appendChild(a);
        return a
    });


    function get_top_visible_coordinate() {
        // TODO - support inner scroll containers?
        // TODO - consider getComputedStyle(document.documentElement).scrollPaddingTop
        // Could return absolute or relative unit
        // Still not fully supported by Safari, not widely used
        return 0;
    }
    function get_bottom_visible_coordinate() {
        // TODO - support inner scroll containers?
        // TODO - consider getComputedStyle(document.documentElement).scrollPaddingTop
        // Could return absolute or relative unit
        // Still not fully supported by Safari, not widely used
        return window.innerHeight;
    }
    var computed_style = getComputedStyle(toc);
    function scroll_toc(first_highlighted_index, last_highlighted_index) {
        if (computed_style.getPropertyValue('--scroll-toc').trim() != 'true') return
        // If the browser supports scrollIntoView {block: 'center'} option, use that
        if ('scrollBehavior' in document.documentElement.style) {
            try {
                var target = links[Math.floor((first_highlighted_index+last_highlighted_index)/2)];
                target.scrollIntoView({
                    block: 'center',
                });
                return
            }
            catch(e) {}
        }
        // else, scroll the first visible link to top of scroll container
        links[first_highlighted_index].scrollIntoView();
    }
    function highlightAndScroll() {
        var top = get_top_visible_coordinate() + 10;
        var bottom = get_bottom_visible_coordinate();
        var first_index_below_top = null;
        var first_index_below_bottom = null;
        var i, rect;
        var length = headings.length;

        // Loop through headings to find which sections are visible
        for (i = 0; i < length; i++) {
            rect = headings[i].getBoundingClientRect();
            if (first_index_below_top === null && rect.top > top) {
                first_index_below_top = i;
            }
            if (first_index_below_bottom === null && rect.bottom > bottom) {
                first_index_below_bottom = i;
                break
            }
        }

        var first_highlighted_index = (function() {
            if (first_index_below_top === null) return length - 1;
            if (first_index_below_top > 0) return first_index_below_top - 1
            return 0;
        })();
        var last_highlighted_index = (function() {
            if (first_index_below_bottom === null) return length - 1;
            if (first_index_below_bottom > 0) return first_index_below_bottom - 1;
            return 0;
        })();

        // Iterate through links, setting visibility class
        var VISIBLE_CLASS = 'AutoTocLink-visible';
        for (i = 0; i < first_highlighted_index; i++) {
            links[i].classList.remove(VISIBLE_CLASS);
        }
        for (i = first_highlighted_index; i <= last_highlighted_index; i++) {
            links[i].classList.add(VISIBLE_CLASS);
        }
        for (i = last_highlighted_index+1; i < length; i++) {
            links[i].classList.remove(VISIBLE_CLASS);
        }        

        scroll_toc(first_highlighted_index, last_highlighted_index);
    }
    highlightAndScroll();

    // highlightAndScroll on document scroll and resize, but throttled
    var pendingHighlightAndScroll = null;
    function doThrottledHightlightAndScroll() {
        pendingHighlightAndScroll = null;
        highlightAndScroll();
    }
    function throttledHighlightAndScroll() {
        if (pendingHighlightAndScroll) return
        pendingHighlightAndScroll = setTimeout(doThrottledHightlightAndScroll, 150);
    }
    addEventListener('scroll', throttledHighlightAndScroll);
    addEventListener('resize', throttledHighlightAndScroll);
    addEventListener('hashchange', highlightAndScroll);

    // Add as method to the element, so that it can be called by outside code
    toc.highlightAndScroll = highlightAndScroll;
}
Array.prototype.forEach.call(document.querySelectorAll('.AutoToc'), initializeAutoToc);
