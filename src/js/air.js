(($) => {
	const TIME = 400, DUR = 10000, MW = 1280, MH = 800, SP = 480, URL = "https://dadaa.github.io/air-on-air/?key=1143d56c-70c8-4ec7-86f7-2686add63e3e&network=mesh&roomId=", ROOM = ["tokyo-1", "tokyo-2", "tokyo-3", "linz-1", "linz-2", "linz-3"];
	let W, H, VW, sp = false, timer;
	
	$(() => {
		if (Math.min(window.innerWidth, window.innerHeight) <= SP) sp = true;
		if (sp) $("head").append('<link rel="stylesheet" href="css/style-sp.css" type="text/css">');
		
		$("#wrap .bg")[0].play();
		setSize();
		$(window).on("orientationchange resize", setSize);
		
		$("a[href='#']").on("click", (e) => {
			e.preventDefault();
		});
		
		$("#top .status a").on("click", (e) => {
			e.preventDefault();
			const n = $(e.target).parent().index();
			$("#play .video iframe").attr({src: URL + ROOM[n]});
			$("#play").show();
			setSize();
			$("#top").fadeOut(TIME, countDown);
			$("html, body").animate({
				scrollTop: 0
			}, TIME, "easeOutQuart");
		});
		
		$("#finish .top").on("click", (e) => {
			e.preventDefault();
			clearTimeout(timer);
			toTop();
		});
		
		$(".howto").on("click", (e) => {
			e.preventDefault();
			$(window).scrollTop(0);
			$("#instruction").fadeIn(TIME, () => {
				$("#top").hide();
			});
		});
		
		$("#instruction .arrow-left").on("click", (e) => {
			e.preventDefault();
			$("#top").show();
			$("#instruction").fadeOut(TIME);
			setSize();
		});
	});
	
	const setSize = () => {
		if (sp) {
			W = window.innerWidth;
			H = window.innerHeight;
		} else {
			W = Math.max(window.innerWidth, MW);
			H = Math.max(window.innerHeight, MH);
		}
		
		if (sp) {
			$("#top").height(Math.max(H, $("#top .main").height() + 140));
		} else {
//			$("#top").height(Math.max(H + 40, $("#top .main").height() + 40));
//			$("#instruction").height(H - 40);
		}
		
		$("#play .video").height(H);
		let fw = $("#play .video").width(), fh = $("#play .video").height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
		$("#play .video iframe").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((fh - movSC * movH) / 2) + "px",
			left: ((fw -movSC * movW) / 2) + "px"
		});
		movW = 1920, movH = 1080, movSC = Math.max(H/movH, W/movW);
		$("#wrap .bg").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((H - movSC * movH) / 2) + "px",
			left: ((W -movSC * movW) / 2) + "px"
		});
	}
	
	const countDown = () => {
		const svg = $("#play svg").drawsvg({
			duration: DUR,
			easing: "linear"
		});
		$("#play").fadeIn(TIME, () => {
			$("#play svg").delay(100).animate({
				opacity: 1
			}, {
				duration: DUR,
				easing: "linear",
				progress: (anim, prog, remain) => {
					$("#play .second").html(Math.round(remain/1000) + "s");
				},
				complete: () => {
					$("#finish").delay(100).fadeIn(TIME, () => {
						$("#play").hide();
						setSize();
						if (sp) {
							$("#finish").css({top: 0});
						}
//						timer = setTimeout(toTop, 5000);
					});
				}
			});
			svg.drawsvg("animate");
		});
	}
	
	const toTop = () => {
		$("#top").fadeIn(TIME, () => {
			$("#finish").hide();
		});
		setSize();
	}
})(jQuery);
