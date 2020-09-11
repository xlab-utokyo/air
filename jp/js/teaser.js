(($) => {
	const MW = 1280, MH = 800, SP = 768;
	let W, H, sp = false, pc = true;
	
	$(() => {
		var ua = navigator.userAgent;
		if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) || ua.indexOf('Windows Phone') > 0) {
			pc = false;
			$("video.bg").remove();
		} else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
			pc = false;
			$("video.bg").remove();
		} else {
			$("img.bg").remove();
//			$(".bg")[0].play();
		}
		setSize();
		$(window).on("orientationchange resize", setSize);
		$(window).on("scroll", () => {
			if (!pc) setSize();
		});
	});
	
	const setSize = () => {
		if (window.innerWidth <= SP) sp = true;
		if (sp) {
			W = document.body.clientWidth;
			H = window.innerHeight;
		} else {
			W = Math.max(document.body.clientWidth, MW);
			H = Math.max(window.innerHeight, MH);
		}
		
		let movW = 16, movH = 9, movSC = Math.max(H/movH, W/movW);
		$(".bg").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((H - movSC * movH) / 2) + "px",
			left: ((W -movSC * movW) / 2) + "px"
		});
	}
})(jQuery);
