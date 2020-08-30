(($) => {
	const TIME = 400, DUR = 10000, MW = 1280, MH = 800, SP = 480;
	let W, H, VW, sp = false, liPos, mv = 0, zoom = false, total, vx = 0, vy = 0, timer;
	
	$(() => {
		if (Math.min(window.innerWidth, window.innerHeight) <= SP) sp = true;
		if (sp) $("head").append('<link rel="stylesheet" href="css/style-sp.css" type="text/css">');
		
		total = $("#video li").length;
		vx = 0;
		if (total % 3 == 0) {
			vx = 3;
		} else if (total % 2 == 0) {
			vx = 2;
		} else {
			vx = 1;
		}
		vy = 1;
		if (total > 3) vy = 2;
		setSize();
		$(window).on("orientationchange resize", setSize);
		
		$("a[href='#']").on("click", (e) => {
			e.preventDefault();
		});
		
		$("#top .watch").on("click", (e) => {
			e.preventDefault();
			$("#watch").show();
			$("#video").show();
			setSize();
			$("#top").fadeOut(TIME);
		});
		
		$("#video li .dummy").on("click", (e) => {
			e.preventDefault();
			$(e.currentTarget).hide();
			zoom = true;
			mv = $(e.currentTarget).parent().index();
			console.log($(this), mv)
			const self = $("#video li").eq(mv);
			self.after("<li></li>");
			const next = self.next();
			setSize();
			const fw = self.parent().width(), fh = self.parent().height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
			next.css({
				width: 100 / vx + "%",
				height: H / vy
			});
			liPos = self.position();
			if (sp) {
				$("#finish").css({top: liPos.top});
				$("html, body").animate({
					scrollTop: liPos.top
				}, TIME, "easeOutQuart", (e) => {
					$("body").css({
						overflow: "hidden"
					});
				});
			} else {
				self.css({
					position: "absolute",
					top: liPos.top - $(window).scrollTop(),
					left: liPos.left,
					height: self.height(),
					zIndex: 1
				});
				self.animate({
					top: 0,
					left: 0,
					width: "100%",
					height: H + "px"
				}, TIME, "easeOutQuart", () => {
					self.addClass("zoom");
					self.removeAttr("style");
				});
				const inner = self.find("iframe");
				inner.animate({
					width: (movSC * movW) + "px",
					height: (movSC * movH) + "px",
					top: ((fh - movSC * movH) / 2) + "px",
					left: ((fw -movSC * movW) / 2) + "px"
				}, TIME, "easeOutQuart");
			}
			$("#watch").fadeOut(TIME);
			$("#play").fadeIn(TIME, countDown);
		});
		
		$("#play .play").on("click", (e) => {
			e.preventDefault();
			countDown();
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
				$("#video").hide();
			});
		});
		
		$("#instruction .arrow-left").on("click", (e) => {
			e.preventDefault();
			if ($("#watch").css("display") == "none") $("#top").show();
			if ($("#video").css("display") == "none") $("#video").show();
			$("#instruction").fadeOut(TIME);
			setSize();
		});
		
		$("#logo").on("click", (e) => {
			e.preventDefault();
			if ($("#instruction").css("display") != "none") {
				$("#top").show();
				$("#instruction").fadeOut(TIME);
			} else {
				if ($("#play").css("display") == "none") {
					if ($("#top").css("display") == "none") {
						$("#top").fadeIn(TIME, () => {
							$("#watch").hide();
							clearTimeout(timer);
							$("#finish").hide();
						});
						setSize();
					}
				}
			}
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
			$("#video ul").height(H);
			$("#top").height(Math.max(H + 40, $("#top .main").height() + 40));
			$("#instruction").height(H - 40);
		}
		
		$("#video li").each((i, elem) => {
			if (sp) {
				$(elem).css({
					width: "100%",
					height:  H
				});
				setDummy(elem);
				setMov(elem);
			} else {
				if (zoom) {
					if (i != mv) {
						$(elem).css({
							width: 100 / vx + "%",
							height: H / vy
						});
						setDummy(elem);
					}
					setMov(elem);
				} else {
					$(elem).css({
						width: 100 / vx + "%",
						height: H / vy
					});
					setDummy(elem);
					setMov(elem);
				}
			}
		});
	}
	
	const setDummy = (elem) => {
		$(elem).find(".dummy").css({
			width: $(elem).width(),
			height: $(elem).height()
		});
	}
	
	const setMov = (elem) => {
		const fw = $(elem).width(), fh = $(elem).height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
		$(elem).find("iframe").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((fh - movSC * movH) / 2) + "px",
			left: ((fw -movSC * movW) / 2) + "px"
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
						zoom = false;
						const self = $("#video li").eq(mv)
						self.removeClass("zoom");
						self.find(".dummy").show();
						self.next().remove();
						setSize();
						if (sp) {
							$("body").removeAttr("style");
							$("#video").hide();
							$("#finish").css({top: 0});
						}
						timer = setTimeout(toTop, 5000);
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
