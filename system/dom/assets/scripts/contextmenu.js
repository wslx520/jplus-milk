
using("System.Dom.Base");




if(navigator.isOpera && parseFloat(navigator.version) <= 10)
	Dom.addEvents('contextmenu', 'mouseup', function(e){
		return e.button === 2;
	});