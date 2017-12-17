(function(){

	$(".nice-item").on("mouseenter mouseleave", onNiceHover);
	$(".nice-item").on("click", onNiceClick);


	function onNiceHover(ev)
	{
		var $item = $(this);
		var $img = $("img", $item);
		var $imgParent = $(".screenshot", $item);
		var $cover = $(".cover", $item);

		if(ev.type == "mouseenter" && $img.hasClass("isBig"))	return;
		if(ev.type == "mouseleave" && !$img.hasClass("isBig"))	return;

		var width = parseInt($imgParent.css("width"));
		var height = parseInt($imgParent.css("height"));
		var zoomW = 30;
		var duration = 250;
		var newW, newH, toOpacity;
		if(ev.type == "mouseenter")
		{
			$img.addClass("isBig");
			newW = width + zoomW;
			newH = height + height / width * zoomW;
			toOpacity = 1;
		}
		else
		{
			$img.removeClass("isBig");
			newW = width;
			newH = height;
			toOpacity = 0;
		}

		$img.stop().animate({
			"margin-top" : ((height - newH) / 2) + "px",
			"margin-left" : ((width - newW) / 2) + "px",
			"width" : newW + "px",
			"height" : newH + "px"
		}, duration, function(){

		});

		$cover.stop().animate({
			"opacity" : toOpacity,
			}, 
			duration, 
			function(){});
	}

	function onNiceClick()
	{
		var params = window.location.href.split( '/' );
		var baseURL = params[0] + "//" + params[2];
		// window.location.href = baseURL + "/" + $(this).attr("data-url");
	}

})();