/** * @author  */


var Browser = Browser || {};Browser.noIFrame = function () {
	if (self != top) {
		top.location = self.location;
	}};