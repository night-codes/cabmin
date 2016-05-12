$(function () {
	$('input:checkbox').checkbox({cls:'checkbox', empty: window.staticUrl + '/img/empty.png'});
	$('input:radio').checkbox({cls:'radio', empty: window.staticUrl + '/img/empty.png'});
	$('.dropdown-toggle').click(function(event) {
		if (!event) event = window.event;
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		$('.dropdown-menu').slideToggle(300);
		return false;
	});
	$('.dropdown-menu').click(function(event) {
		if (!event) event = window.event;
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
	});
	$('a.submenu').click(function(ev){
		var $el = $(this);
		var $ic = $el.find('.fa');
		var clsMove;
		var clsAdd;
		var up = 'fa-caret-up';
		var down = 'fa-caret-down';

		$el.next('.submenuBody').slideToggle(300);

		if ($ic.hasClass(up)) {
			clsMove = up;
			clsAdd = down;
		} else {
			clsMove = down;
			clsAdd = up;
		}

		$ic.removeClass(clsMove).addClass(clsAdd);

		if (!ev) ev = window.event;
		ev.cancelBubble = true;
		if (ev.stopPropagation) ev.stopPropagation();
		ev.preventDefault();
		return;
	})
	$('body').click(function(event) {
		 $('.dropdown-menu').slideUp(300);
	});
	$('body').removeClass('no-js');
	$('.nav-button').click(function(el, i) {
		$('aside').css({'left': '0px'});
		$('.asideBottom').show();
		$('body').css({'overflow': 'hidden'});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	/* aside mobile menu */
	$('.asideBottom').click(function(el, i) {
		$('aside').css({'left': '-450px'});
		$('.asideBottom').hide();
		$('body').css({'overflow': 'auto'});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
	$('.scrollable' ).bind('mousewheel DOMMouseScroll', function ( e ) {
		delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
		e.preventDefault();
		e.stopPropagation();
		return false;
	});


});
