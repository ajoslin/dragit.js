$(document).ready(function()
{
	var circle1;
	var circle2;
	$("#mario").toggle(
		function(event) {
			circle1 = ImageCircle("#mario", event.pageX, event.pageY);
		},
		function(event) {
			circle2 = ImageCircle("#mario", event.pageX, event.pageY);

			var time=500
			circle1.animate({left: circle2.css('left'), top: circle2.css('top')}, time);
			circle2.animate({left: circle1.css('left'), top: circle1.css('top')}, time);
		}
	);
});

//Constructor for image circle
//Creates a circle with parent' image at x,y as background
//can be dragged around
function ImageCircle(parentSel, x, y)
{
	$(parentSel).append("<div class=\"circle\"></div>");
	var circle = $(parentSel+" :last");
	var radius = parseInt(circle.css('width').replace("px",""))/2;
	console.log(radius);

	circle.css("background-image", "url(\"mario.jpg\")");
	circle.css("background-position", -(x-radius) + "px " + -(y-radius) + "px");
	circle.css("left", (x-radius)+"px");
	circle.css("top", (y-radius)+"px");

	return circle;
}

