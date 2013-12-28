
	$("#btnTest").click(function(event) {
		/* Act on the event */
		sessionStorage.setItem("mode", "test");
		console.log("test");
	});
	$("#btnPractice").click(function(event) {
		/* Act on the event */
		sessionStorage.setItem("mode", "prac");
		console.log("practice");
	});

