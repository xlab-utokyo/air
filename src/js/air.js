(function($) {
	const UNIT = 320, DUR = 10000, MW = 1280, MH = 800;
	let W, H, VW, liPos, winPos = {x: 0, y: 0}, mv = 0, zoom = false, total, vx = 0, vy = 0;
	
	$(function(){
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
		const open = $("#video li").eq(mv);
		open.addClass("zoom");
		liPos = open.position();
		open.after("<li></li>");
		zoom = true;
		setSize();
		$(window).on("orientationchange resize", setSize);
		
		$("a[href='#']").on("click", function(e) {
			e.preventDefault();
		});
		
		$("#wrap .float .play").on("click", function(e) {
			e.preventDefault();
			if ($("#instruction").css("display") == "block") {
				toPlay();
			} else if ($("#finish").css("display") == "block") {
				$("#float .float").hide();
				$("#finish").fadeOut(400, () => {
					countDown();
				});
			} else {
				toInstruction();
			}
		});
		
		$("#wrap .float .watch").on("click", function(e) {
			e.preventDefault();
			if ($("#finish").css("display") == "block") {
				$("#finish").fadeOut(100, () => {
					toWatch();
				});
			} else {
				toWatch();
			}
		});
		
		$("#float .float .arrow-left").on("click", function(e) {
			e.preventDefault();
			toTop();
		});
		
		$("#modal .float .play").on("click", function(e) {
			e.preventDefault();
			$("#finish").hide();
			$("#instruction").hide();
			$("#float .float").hide();
			$("#play").show();
			$("#modal").stop(true).fadeOut(200, function() {
				$("#wrap").removeClass("modal-on");
				$("#wrap").css({
					left: "auto",
					top: "auto"
				});
				window.scrollTo(winPos.x, winPos.y);
				countDown();
			});
		});
		
		$("#modal .float .watch").on("click", function(e) {
			e.preventDefault();
			$("#modal").stop(true).fadeOut(200, function() {
				$("#wrap").removeClass("modal-on");
				$("#wrap").css({
					left: "auto",
					top: "auto"
				});
				window.scrollTo(winPos.x, winPos.y);
				if ($("#finish").css("display") == "block") {
					$("#finish").fadeOut(100, () => {
						toWatch();
					});
				} else {
					toWatch();
				}
			});
		});
		
		$("a[href='#about']").on("click", function(e) {
			e.preventDefault();
			winPos.x = -window.pageXOffset;
			winPos.y = window.pageYOffset;
			$("#wrap").addClass("modal-on");
			window.scrollTo(winPos.x, winPos.y);
			$("#wrap").css({
				left: winPos.x,
				top: winPos.y
			});
			$("#modal").stop(true).fadeIn(400, () => {
				$("#finish").hide();
			});
			$("#modal").height(Math.max(H, $("#modal .main").height()));
		});
		
		$("#modal .back, #modal .close").on("click", function(e) {
			e.preventDefault();
			$("#modal").stop(true).fadeOut(200, function() {
				$("#wrap").removeClass("modal-on");
				$("#wrap").css({
					left: "auto",
					top: "auto"
				});
				window.scrollTo(winPos.x, winPos.y);
			});
		});
		
/*		$("#videos li > a").on("click", (e) => {
			e.preventDefault();
			const movW = 1920, movH = 1080, movSC = Math.max(H/movH, W/movW);
			$("#videos li").css({pointerEvents: "none"});
			const self = $(e.currentTarget).parents("li");
			self.after("<li></li>");
			const next = self.next();
			next.css({
				width: VW + "%",
				height: self.height()
			});
			liPos = self.position();
			self.css({
				position: "fixed",
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
			}, 500, "easeOutQuart", () => {
				self.find(".second").html(Math.round(DUR/1000) + "s");
				self.find(".left").delay(100).animate({
					left: 0
				}, 400, "easeOutQuart");
				self.find(".right").delay(100).animate({
					right: 0
				}, 400, "easeOutQuart", () => {
					self.find(".pointer").delay(100).animate({
						right: "-10px"
					}, {
						duration: DUR,
						easing: "linear",
						progress: (anim, prog, remain) => {
							self.find(".second").html(Math.round(remain/1000) + "s");
						},
						complete: () => {
							toWatch(self);
						}
					});
				});
			});
			const inner = self.children("a").find("img");
			inner.css({
				position: "absolute",
				top: 0,
				left: 0
			});
			inner.animate({
				width: (movSC * movW) + "px",
				height: (movSC * movH) + "px",
				top: ((H - movSC * movH) / 2) + "px",
				left: ((W -movSC * movW) / 2) + "px"
			}, 500, "easeOutQuart");
		});
		
		$(".left a").on("click", (e) => {
			e.preventDefault();
			toWatch($(e.currentTarget).parents("li"));
		});*/
	});
	
	const setSize = () => {
		W = Math.max(window.innerWidth, MW);
		H = Math.max(window.innerHeight, MH);
		
		$("#video ul, #top .main").height(H);
		$("#modal").height(Math.max(H, $("#modal .main").height()));
		
		$("#video li").each(function(i, elem) {
			if (zoom) {
				if (i != mv) {
					$(elem).css({
						width: 100 / vx + "%",
						height: H / vy
					});
				}
				const fw = $(elem).width(), fh = $(elem).height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
				$(elem).find("iframe").css({
					width: (movSC * movW) + "px",
					height: (movSC * movH) + "px",
					top: ((fh - movSC * movH) / 2) + "px",
					left: ((fw -movSC * movW) / 2) + "px"
				});
			} else {
				const fw = $(elem).width(), fh = $(elem).height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
				$(elem).css({
					width: 100 / vx + "%",
					height: H / vy
				});
				$(elem).find("iframe").css({
					width: (movSC * movW) + "px",
					height: (movSC * movH) + "px",
					top: ((fh - movSC * movH) / 2) + "px",
					left: ((fw -movSC * movW) / 2) + "px"
				});
			}
		});
	}
	
	const toWatch = () => {
		if (total == $("#video li").length) return;
		const self = $("#video li").eq(mv);
		const next = self.next();
		const inner = self.find("iframe");
		const fw = next.width(), fh = next.height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
		$("#instruction").fadeOut(400);
		$("#top").fadeOut(400);
		$("#watch").fadeIn(400);
		$("#float .float .watch").fadeOut(400);
		$("#float .float .arrow-left").fadeIn(400);
		inner.animate({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((fh - movSC * movH) / 2) + "px",
			left: ((fw -movSC * movW) / 2) + "px"
		}, 400, "easeOutQuart");
		self.animate({
			top: next.position().top - $(window).scrollTop(),
			left: next.position().left,
			width: next.width(),
			height: next.height()
		}, 400, "easeOutQuart", () => {
			next.remove();
			self.removeClass("zoom");
			self.removeAttr("style");
			self.css({
				width: 100 / vx + "%",
				height: H / vy
			});
			zoom = false;
		});
	}
	
	const toTop = () => {
		zoom = true;
		const self = $("#video li").eq(mv);
		self.after("<li></li>");
		const next = self.next();
		const fw = self.parent().width(), fh = self.parent().height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH/fh, fw/movW);
		next.css({
			width: 100 / vx + "%",
			height: H / vy
		});
		liPos = self.position();
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
		}, 500, function() {
			self.addClass("zoom");
			self.removeAttr("style");
		});
		const inner = self.find("iframe");
		inner.animate({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((fh - movSC * movH) / 2) + "px",
			left: ((fw -movSC * movW) / 2) + "px"
		}, 500, "easeOutQuart");
		$("#watch").fadeOut(400);
		$("#float .float .watch").fadeIn(400);
		$("#float .float .arrow-left").fadeOut(400);
	}
	
	const toInstruction = () => {
		if (!zoom) {
			zoom = true;
			const self = $("#video li").eq(mv);
			self.after("<li></li>");
			const next = self.next();
			const fw = self.parent().width(), fh = self.parent().height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH/fh, fw/movW);
			next.css({
				width: 100 / vx + "%",
				height: H / vy
			});
			liPos = self.position();
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
			}, 500, "easeOutQuart", function() {
				self.addClass("zoom");
				self.removeAttr("style");
				$("#watch").fadeOut(400);
				$("#instruction").fadeIn(400);
				$("#float .float .watch").fadeIn(400);
				$("#float .float .arrow-left").fadeOut(400);
			});
			const inner = self.find("iframe");
			inner.animate({
				width: (movSC * movW) + "px",
				height: (movSC * movH) + "px",
				top: ((fh - movSC * movH) / 2) + "px",
				left: ((fw -movSC * movW) / 2) + "px"
			}, 500, "easeOutQuart");
		} else {
			$("#watch").fadeOut(400);
			$("#instruction").fadeIn(400);
			$("#float .float .watch").fadeIn(400);
			$("#float .float .arrow-left").fadeOut(400);
		}
	}
	
	const toPlay = () => {
		$("#float .float").fadeOut(400);
		$("#instruction").fadeOut(400);
		countDown();
	}
	
	const countDown = () => {
		const svg = $("#play svg").drawsvg({
			duration: DUR,
			easing: "linear"
		});
		$("#play").fadeIn(400, () => {
			$("#play svg").delay(100).animate({
				opacity: 1
			}, {
				duration: DUR,
				easing: "linear",
				progress: (anim, prog, remain) => {
					$("#play .second").html(Math.round(remain/1000) + "s");
				},
				complete: () => {
					$("#finish .float").show();
					$("#finish").delay(100).fadeIn(400, () => {
						$("#play").hide();
						$("#float .float").show();
					});
				}
			});
			svg.drawsvg("animate");
		});
	}
	
/*	const toWatch = (mv) => {
		const self = $("#video li").eq(mv);
		self.find(".pointer").stop();
		self.find(".pointer").css({
			right: "calc(100% - 10px)"
		});
		const next = self.next();
		self.find(".left").animate({
			left: "-25%"
		}, 200, "easeOutQuart");
		self.find(".right").animate({
			right: "-25%"
		}, 200, "easeOutQuart", () => {
			self.animate({
				top: next.position().top - $(window).scrollTop(),
				left: next.position().left,
				width: next.width(),
				height: next.height()
			}, 400, "easeOutQuart", () => {
			});
			const inner = self.children("a").find("img");
			inner.animate({
				width: next.width(),
				height: next.height(),
				top: 0,
				left: 0
			}, 400, "easeOutQuart", () => {
				self.css({
					position: "relative",
					left: "auto",
					top: "auto",
					width: VW + "%",
					height: "auto",
					zIndex: "auto"
				});
				next.remove();
				$("#videos li").css({pointerEvents: "auto"});
				inner.css({
					position: "static",
					width: "100%",
					height: "auto"
				});
			});
		});
	}*/
})(jQuery);
