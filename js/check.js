const DEVICES = {
  "tokyo-1": {
    label: "TOKYO 1",
    room: "tokyo-mesh-1",
    network: "mesh",
    key: "42d2a8f3-ed64-48af-8928-902bd4e4f5bc",
    cid: "52c30248-e069-11ea-87d0-0242ac130003",
  },
  "tokyo-2": {
    label: "TOKYO 2",
    room: "tokyo-mesh-2",
    network: "mesh",
    key: "f061f8cb-d48f-49b4-8fa7-691e7ec19b48",
    cid: "52c3048c-e069-11ea-87d0-0242ac130003",
  }
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
  redirected.searchParams.append("roomId", device.room);

  if (isDevice) {
    redirected.searchParams.append("cid", device.cid);
  }

  window.location.href = redirected.toString();
});
