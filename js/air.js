(($) => {
	const TIME = 400, DUR = 3000, MW = 1280, MH = 800, SP = 480, THRESHOLD = 0.1;
	let W, H, VW, sp = false, pc = true, timer;
	let currentUser = null, thisUser = null, isAlreadyTested = false, peer, room, roomId, processor, isAlreadyPlayed;
	
	$(() => {
		if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0) {
			pc = false;
			$("video.bg").remove();
		} else if (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
			pc = false;
			$("video.bg").remove();
		} else {
			$("img.bg").remove();
			$("#wrap .bg")[0].play();
		}
		setSize();
		$(window).on("orientationchange resize", setSize);
		$(window).on("scroll", () => {
			if (pc) {
				scrollFixed();			
			} else {
				setSize();
			}
		});
		$("#finish").hide();
		
		$("a[href='#']").on("click", (e) => {
			e.preventDefault();
		});
		
		$("#top .status").on("click", "button", async function(e) {
			e.preventDefault();
			const n = $(this).parent().index();
			
			roomId = $(this).attr("id");
			await connect();
			await play();
			
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
				setSize();
			});
		});
		
		$("#instruction .test").on("click", play);
		
		$("#instruction .close").on("click", (e) => {
			e.preventDefault();
			$("#top").show();
			$("#instruction").fadeOut(TIME);
		});
		
		$(".policy").on("click", (e) => {
			e.preventDefault();
			$(window).scrollTop(0);
			$("#policy").fadeIn(TIME, () => {
				$("#top").hide();
				setSize();
			});
		});
		
		$("#policy .close").on("click", (e) => {
			e.preventDefault();
			$("#top").show();
			$("#policy").fadeOut(TIME);
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
		
		$("#play .video").height(H);
		let fw = $("#play .video").width(), fh = $("#play .video").height(), movW = 3, movH = 4, movSC = Math.max(fh/movH, fw/movW);
		$("#play #device").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((fh - movSC * movH) / 2) + "px",
			left: ((fw -movSC * movW) / 2) + "px"
		});
		movW = 16, movH = 9, movSC = Math.max(H/movH, W/movW);
		$("#wrap .bg").css({
			width: (movSC * movW) + "px",
			height: (movSC * movH) + "px",
			top: ((H - movSC * movH) / 2) + "px",
			left: ((W -movSC * movW) / 2) + "px"
		});
		
		scrollFixed();
	}
	
	const scrollFixed = () => {
		$("#logo, .subtitle").css("left", -$(window).scrollLeft() + 20);
		$("#instruction .mic").css("left", -$(window).scrollLeft() + (W/2 - 140));
		$(".close").css("left", -$(window).scrollLeft() + (W - 76));
	}
	const countDown = () => {
		setSize();
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
						timer = setTimeout(toTop, 5000);
					});
				}
			});
			setTimeout(() => {
				svg.drawsvg("animate");
			}, 100);
		});
	}
	
	const toTop = () => {
		$("#top").fadeIn(TIME, () => {
			$("#finish").hide();
		});
	}
	
	
// -----skyway---------------------------------------------
	
	async function play() {
		if (isAlreadyTested) return;
		
		const stream = await getAudioStream();
		
		if (!stream) {
			return;
		} else {
			isAlreadyTested = true;
		}
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();
		const mediaStreamSource = audioContext.createMediaStreamSource(stream);
		processor = audioContext.createScriptProcessor(512);

		const tickEls = new Array();
		tickEls[0] = document.querySelectorAll("#instruction .mic li");
		tickEls[1] = document.querySelectorAll("#play .mic li");

		let previousTime = Date.now();
		processor.onaudioprocess = e => {
			if ($("#play").css("display") != "none") {
				if (currentUser === null && isAlreadyPlayed) {
					processor.onaudioprocess = null;
					return;
				}
				
				if (currentUser && currentUser !== peer.id) {
					processor.onaudioprocess = null;
					return;
				}
			}
			
			const currentTime = Date.now();
			if (currentTime - previousTime < 100) {
				return;
			}
			previousTime = currentTime;
			
			const buffer = e.inputBuffer.getChannelData(0)
			
			let total = 0;
			for (let i = 0; i < buffer.length; i++) {
				total += Math.abs(buffer[i]);
			}
			
			const rms = Math.sqrt(total / buffer.length);
			const signal = rms > THRESHOLD ? 1 : 0;
			if ($("#play").css("display") != "none") dispatchToRoom({ signal });
			
			const tickClassName = signal ? "active" : "inactive";
			for (let i = 0; i < tickEls[0].length; i++) {
				const tickEl = tickEls[i];
				tickEls[0][i].classList.remove("active");
				tickEls[0][i].classList.remove("inactive");
				tickEls[1][i].classList.remove("active");
				tickEls[1][i].classList.remove("inactive");
				
				if (rms * tickEls[0].length > i + 1) {
					tickEls[0][i].classList.add(tickClassName);
					tickEls[1][i].classList.add(tickClassName);
				}
			}
		};
		mediaStreamSource.connect(processor);
		processor.connect(audioContext.destination);
	}
	
	async function getAudioStream() {
		try {
			const stream = navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			return stream;
		} catch (e) {
			console.error(e);
			alert(`${ e.name }: please reload`);
			return null;
		}
	}
	
	async function connect() {
//		console.log(currentUser)
		if (!currentUser) {
			for (var i in DEVICES) {
				if (roomId == DEVICES[i]["room"]) {
					peer = await connectPeer(DEVICES[i]["key"]);
					room = peer.joinRoom(roomId, {
						mode: DEVICES[i]["network"],
					});
					break;
				}
			}
			room.on("data", onData);
			room.on("stream", onStream);
			room.on("peerLeave", onLeave);
		}
	}

	function connectPeer(key) {
		return new Promise(r => {
			const peer = new Peer({ key: key });
			peer.on("open", () => r(peer));
		});
	}

	function dispatchToRoom(data) {
		room.send(data);
	}

/*	function onClickAudioMuting({ target }) {
		target.classList.toggle("disabled");
		const track = this.stream.getAudioTracks()[0];
		track.enabled = !target.classList.contains("disabled");
	}

	async function onClickPlay() {
		await connect();
		play();
	}*/

	async function onData({ data }) {
//		console.log(data, peer.id);
		if (typeof data.currentUser === "undefined") {
			return;
		}

		if (peer.id === data.currentUser) {
			isAlreadyPlayed = true;
		}
		currentUser = data.currentUser;
		thisUser = peer.id;
	}

	async function onLeave(peerId) {
		console.log("onLeave:"+peerId);
	}

	async function onStream(stream) {
		const presenterVideo = $("#device")[0];
		presenterVideo.muted = true;
		presenterVideo.srcObject = stream;
		presenterVideo.playsInline = true;
		presenterVideo.play();
	}

})(jQuery);
