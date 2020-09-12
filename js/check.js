const DEVICES = {
  "linz-1": {
    label: "LINZ 1",
    room: "linz-1-production",
    network: "sfu",
    key: "42d2a8f3-ed64-48af-8928-902bd4e4f5bc",
    cid: "52c30248-e069-11ea-87d0-0242ac130003",
  },
  "linz-2": {
    label: "LINZ 2",
    room: "linz-2-production",
    network: "sfu",
    key: "4bf93d11-4e49-40a4-8a25-f33c033cf1fe",
    cid: "52c3048c-e069-11ea-87d0-0242ac130003",
  },
  "linz-3": {
    label: "LINZ 3",
    room: "linz-3-production",
    network: "sfu",
    key: "4409fcf1-896a-4d12-8e1b-bb10175e24e3",
    cid: "52c305e0-e069-11ea-87d0-0242ac130003",
  },
  "tokyo-1": {
    label: "TOKYO 1",
    room: "tokyo-1-production",
    network: "sfu",
    key: "f061f8cb-d48f-49b4-8fa7-691e7ec19b48",
    cid: "9f7ea436-e6a7-11ea-adc1-0242ac120002",
  },
  "tokyo-2": {
    label: "TOKYO 2",
    room: "tokyo-2-production-2",
    network: "sfu",
    key: "0c58b2e1-96e1-47c5-82f7-cc6a7419600a",
    cid: "9f7ea68e-e6a7-11ea-adc1-0242ac120002",
  },
  "tokyo-3": {
    label: "TOKYO 3",
    room: "tokyo-3-production-2",
    network: "sfu",
    key: "6e465825-3b1c-4070-a0be-9b3987f8481c",
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
  redirected.searchParams.append("roomId", device.room);

  if (isDevice) {
    redirected.searchParams.append("cid", device.cid);
  }

  window.location.href = redirected.toString();
});
