// Animations & shifts done using jQuery
$(document).ready(function(){
	function runSlider(slider, attrAuto, attrTiming, attrAnimation) {
		// Three main variables available to each slider function. Can also be passed in using data-attr, if individual settings desired
		// Autoplay defaults to true - slider is most effective/impressive when starting in autoplay mode
		var Autoplay = true;
		// When autoplay is active, this is the time (in ms) that each slide will be static on the screen, before advancing
		var Timing = 5000;
		// The time, in ms, that the sliding animation takes
		var AnimationTiming = 2000;

		function testParam(setting, param) {
			return typeof param !== 'undefined' && (typeof param !== 'object' && param !== null) ? Number(param) : setting;
		}
		Autoplay = testParam(Autoplay, attrAuto);
		Timing = testParam(Timing, attrTiming);
		AnimationTiming = testParam(AnimationTiming, attrAnimation);

		var slides = [];
		$(slider).children(".slide").each(function countSlide() {
			slides.push(this);
		});		
		console.log(slides);
		var currentSlide = 0;
		var loadingBar = $(slider).find(".loading-bar");
		var dotSpan = '<span class="dot-nav-circle slider-button"><i class="fa fa-circle-o" aria-hidden="true"></i></span>'
		for (var i=0; i<slides.length; i++) {
			var dotSpan = '<span class="dot-nav-circle slider-button"><i class="fa fa-circle-o" aria-hidden="true"></i></span>'
			var wrapperElem = $(slider).find($(".dot-nav-wrapper")).get(0);
			wrapperElem.insertAdjacentHTML( 'afterbegin', dotSpan );
		}
		// set first navigation dot to be active by default
		$(slider).find($("span.dot-nav-circle:first-of-type")).addClass("active");
		// Hide pause/play functionality if autoplay turned off
		if (Autoplay == false) {$(slider).find($(".dot-nav-play-pause").hide())}

		function startAnimate() {
			var currentWidth = loadingBar.width();
			var percentWidthRemaining = 1 - (currentWidth / loadingBar.parent().width());
			loadingBar.animate({
				width: "100%",
			}, (Timing - 150) * percentWidthRemaining, "linear", function completedLoader() {
				advance();
			});
		}


		function loader() {
			console.log("loader called");						

			// Animation of loading bar also directly tied to whether slider is currently proceeding
			// Can only advance slide if animation completes, or interrupted by a button click that forces advance			
			loadingBar.attr("style",null);
			loadingBar.addClass("visible");			

			startAnimate();			

			// Button click interruption stops animation, forces advance			

			return false;
		}


		// auto advance, or incrementally advance/move backwards by one
		function advance(increment) {
			// "Left" css values for animations
			var endLeft;
			var nextSlide;
			// A css class determining where the next slide should enter from
			var enterPoint;
			// Setup movements either sliding left or right
			if (increment == -1 ) {
				endLeft = "100%";
				enterPoint = "left-enter";
				if (currentSlide > 0) {
					nextSlide = currentSlide - 1;
				} else {
					nextSlide = slides.length - 1;
				}
			} else {
				endLeft = "-100%";
				enterPoint = "right-enter";
				if (currentSlide < slides.length - 1 ) {
					nextSlide = currentSlide + 1;
				} else {
					nextSlide = 0;
				}
			}
			
			$(slides[nextSlide]).attr("style",null);
			$(slides[nextSlide]).addClass(enterPoint);
			$(slides[nextSlide]).children(".overlay-text").attr("style",null);
			$(slides[currentSlide]).animate({
				left: endLeft,
			}, AnimationTiming, function () {				
				$(this).attr("style","");
				$(this).removeClass("initial");
			});
			
			$(slides[nextSlide]).animate({
				left: "0%",
			}, AnimationTiming, function () {
				$(this).removeClass(enterPoint);
				$(this).attr("style","");
				$(this).css("left", "0%");
			});
			$(slides[nextSlide]).children(".overlay-text").animate({
				marginLeft: "0%",
			}, AnimationTiming);

			// Return loading bar to original, unloaded state					
			loadingBar.animate({
				width: "0%",
				opacity: "0"
			}, 500, function removeVisible() {
				loadingBar.removeClass("visible");	
				
			});

			setTimeout(function() {
				currentSlide = nextSlide;
				$(slider).find(".dot-nav-circle").removeClass("active");
				$(slider).find(".dot-nav-wrapper .dot-nav-circle:nth-child(" + (currentSlide + 1) + ")").addClass("active");
				if(Autoplay == true) {loader(); }
			}, AnimationTiming); // Wait to start the next animation until after the current one has finished
						
		}

		// Handle various potential clicks of nav buttons (arrows, pause, play)
		$(slider).find(".slider-button").click( function manualAdvance() {
			var buttonPausePlay = $(slider).find($(".dot-nav-play-pause"));
			function change(from, to) {				
				buttonPausePlay.removeClass(from);
				buttonPausePlay.addClass(to);
			}
			loadingBar.stop(true, false);
			if ($(this).hasClass("dot-nav-play-pause")) {
				if (buttonPausePlay.hasClass("pause")) {
					change("pause","play");
				} else {
					change("play","pause");
					// If changing out of "play", can resume the animation where it left off
					startAnimate();
				}
			} else if ($(this).hasClass("left-arrow")) {
				if (buttonPausePlay.hasClass("play")) {
					change("play","pause");
				}
				advance(1); // step forward 1 slide
				return false;
			} else if ($(this).hasClass("right-arrow")) {
				if (buttonPausePlay.hasClass("play")) {
					change("play","pause");
				}
				advance(-1); // step backward 1 slide
				return false;
			} else {
				return false;
			}
			
		});

		if (Autoplay == true) {			
			loader();
		}

	}






	// Initiate sliders, using jQuery objects
	$(".slider-wrapper").each( function initialize() {
		var attrAuto = $(this).attr("data-autoplay");
		var attrTiming = $(this).attr("data-timing");
		var attrAnimation = $(this).attr("data-animation");
		runSlider(this, attrAuto, attrTiming, attrAnimation);
	});

});



