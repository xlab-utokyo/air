(($) => {
	const TIME = 400, DUR = 30000, MW = 1280, MH = 800, SP = 480, THRESHOLD = 0.1, KEY = "1143d56c-70c8-4ec7-86f7-2686add63e3e", NETWORK = "sfu", ROOM = ["linz-1-test", "linz-2-test", "linz-3-test", "tokyo-1-test", "tokyo-2-test", "tokyo-3-test"];
	let W, H, VW, sp = false, timer;
	let currentUser = null, thisUser = null, isAlreadyTested = false, peer, room, roomId, processor, isAlreadyPlayed;
	
	$(() => {
		if (Math.min(window.innerWidth, window.innerHeight) <= SP) sp = true;
		
		$("#wrap .bg")[0].play();
		setSize();
		$(window).on("orientationchange resize", setSize);
		$("#finish").hide();
		
		$("a[href='#']").on("click", (e) => {
			e.preventDefault();
		});
		
		$("#top .status").on("click", "button", async function(e) {
			e.preventDefault();
			const n = $(this).parent().index();
			
			roomId = ROOM[n];
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
			});
		});
		
		$("#instruction .test").on("click", play);
		
		$("#instruction .close").on("click", (e) => {
			e.preventDefault();
			$("#top").show();
			$("#instruction").fadeOut(TIME);
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
		
		$("#play .video").height(H);
		let fw = $("#play .video").width(), fh = $("#play .video").height(), movW = 1080, movH = 1920, movSC = Math.max(fh/movH, fw/movW);
		$("#play #device").css({
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
		console.log(currentUser)
		if (!currentUser) {
			peer = await connectPeer(KEY);
			room = peer.joinRoom(roomId, {
				mode: NETWORK,
			});
			
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
		console.log(data, peer.id);
		if (typeof data.currentUser === "undefined") {
			return;
		}

		if (peer.id === data.currentUser) {
			isAlreadyPlayed = true;
		}
		currentUser = data.currentUser;
		thisUser = peer.id;
/*		document.thisUser = this.peer.id;
		document.currentUser = data.currentUser;
		document.isAlreadyPlayed = this.isAlreadyPlayed;*/
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
