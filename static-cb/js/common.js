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
   $('body').click(function(event) {
       $('.dropdown-menu').slideUp(300);
   });
});