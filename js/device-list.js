class DeviceList {
  constructor() {
	this.init();
  }

  init() {
    $("#top .status").empty();
    for (const { label, room, key, network } of Object.values(DEVICES)) {
      const link = document.createElement("button");
      link.classList.add("off", "btn-long");
      link.id = room;
	  
      const nameLabel = document.createElement("span");
      nameLabel.textContent = label;
      link.appendChild(nameLabel);
      const statusLabel = document.createElement("p");
      statusLabel.textContent = "CLOSED";
      link.appendChild(statusLabel);

      const li = document.createElement("li");
      li.appendChild(link);

      $("#top .status")[0].appendChild(li);
    }

    this.start();
  }

  async start() {
    let statuses = {};
    try {
      const response = await fetch("device-statuses.json");
      statuses = await response.json();
    } catch (e) {
      console.error(e);
    }

    for (const [id, { room, key, network }] of Object.entries(DEVICES)) {
	    console.log(id, statuses[id])
      if (statuses[id] === false) {
        // unavailable.
        continue;
      }

      this.observe(room, key, network);
    }
  }

  async observe(roomId, key, network) {
    const peer = await this.connectPeer(key);
    const room = peer.joinRoom(roomId, { mode: network });
    room.on("data", ({ data }) => {
      if (typeof data.currentUser === "undefined") {
        return;
      }

      const link = document.getElementById(roomId);
      const statusLabel = link.querySelector("p");
      const { currentUser } = data;

      if (currentUser === null) {
        link.classList.remove("off");
        statusLabel.textContent = "PLAY";
      } else {
        link.classList.add("off");
        statusLabel.textContent = "BUSY";
      }
    });
  }

  connectPeer(key) {
    return new Promise(r => {
      const peer = new Peer({ key: key });
      peer.on("open", () => r(peer));
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new DeviceList());
