const DEVICES = {
  "linz-1": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "52c30248-e069-11ea-87d0-0242ac130003",
  },
  "linz-2": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "52c3048c-e069-11ea-87d0-0242ac130003",
  },
  "linz-3": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "52c305e0-e069-11ea-87d0-0242ac130003",
  },
  "tokyo-1": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "9f7ea436-e6a7-11ea-adc1-0242ac120002",
  },
  "tokyo-2": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "9f7ea68e-e6a7-11ea-adc1-0242ac120002",
  },
  "tokyo-3": {
    network: "sfu",
    key: "1143d56c-70c8-4ec7-86f7-2686add63e3e",
    cid: "9f7ea8aa-e6a7-11ea-adc1-0242ac120002",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(document.URL);
  const room = url.searchParams.get("room");

  if (!room) {
    return;
  }

  const device = DEVICES[room];
  const type = url.searchParams.get("type");
  const isDevice = type === "device";
  const file = isDevice ? "device.html" : "index.html";

  const redirected = new URL(file, "https://dadaa.github.io/air-on-air/");
  redirected.searchParams.append("key", device.key);
  redirected.searchParams.append("network", device.network);
  redirected.searchParams.append("roomId", room);

  if (isDevice) {
    redirected.searchParams.append("cid", device.cid);
  }

  window.location.href = redirected.toString();
});
