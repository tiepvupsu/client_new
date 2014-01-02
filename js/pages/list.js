(function(){

	$(".listviewOffline li").click(function(event) {
		/* Act on the event */
		console.log("licked");
		console.log($(this).find("a.unit").attr("value"));
	});
	$('.listviewOffline').on('click', 'li', function() {
        console.log($(this).find("a.unit").attr("value"));
        console.log("clicked");
    });
});