/* Daan Dekoning Krekels
 * 21/04/2022
 * Automating NodeRED flows
 */
"use strict";
let request = require("request");

const ttn_token = ""; // Change with your API token
const mqtt_token = ""; // Change with your MQTT token
const application_name = "zanzibar";

getAllDevices(application_name, ttn_token, mqtt_token);

function getAllDevices(token, application_name, mqtt_token) {
  /* param: token Bearer token from TTN
   * param: application_name Name of TTN application where you want the devices from
   */
  let options = {
    method: "GET",
    url: `https://eu1.cloud.thethings.network/api/v3/applications/${application_name}/devices?field_mask=name`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    let jsonResp = JSON.parse(response.body);
    console.log(jsonResp);
    for (const device of jsonResp.end_devices) {
      let to_post = JSON.stringify(data);
      const device_nr = Number(device.name.split(" ")[1]); // Get only the number x from "device x"
      console.log(device_nr);
      to_post = to_post.replace(/_NR_/g, device_nr); // Put the device number everywhere on the right place
      to_post = to_post.replace(/_EUI_/g, String(device.ids.device_id)); // Put the device EUI everywhere on the right place
      to_post = to_post.replace(/_application_name_/g, application_name); // Put the application_name everywhere on the right place
      to_post = to_post.replace(/_mqtt-token_/g, mqtt_token); // Put the mqtt_token everywhere on the right place
      //   console.log(JSON.parse(to_post));
      postDevice(to_post); // Make a post request for every device
    }
  });
}

function postDevice(to_post) {
  let options = {
    method: "POST",
    url: "http://159.223.209.125:1880/flow",
    headers: {
      "Content-Type": "application/json",
    },
    body: to_post,
  };
  console.log(JSON.parse(options.body));

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

const data = {
  id: "_EUI_.1",
  type: "tab",
  label: "Sensor_NR_",
  disabled: false,
  info: "",
  env: [],
  nodes: [
    {
      id: "_EUI_.2",
      type: "mongodb out",
      z: "1",
      mongodb: "12",
      name: "Area_NR_ (save)",
      collection: "Area_NR_",
      payonly: true,
      upsert: false,
      multi: false,
      operation: "insert",
      x: 640,
      y: 460,
      wires: [],
    },
    {
      id: "_EUI_.3",
      type: "mongodb in",
      z: "1",
      mongodb: "12",
      name: "Area_NR_ data",
      collection: "Area_NR_",
      operation: "find",
      x: 290,
      y: 300,
      wires: [["_EUI_.11"]],
    },
    {
      id: "_EUI_.4",
      type: "http in",
      z: "1",
      name: "(get) data_NR_",
      url: "/data_NR_",
      method: "get",
      upload: false,
      swaggerDoc: "",
      x: 90,
      y: 300,
      wires: [["_EUI_.3"]],
    },
    {
      id: "_EUI_.5",
      type: "mqtt in",
      z: "1",
      name: "Sensor_NR_",
      topic: "v3/_application_name_@ttn/devices/_EUI_/up",
      qos: "2",
      datatype: "json",
      broker: "13",
      nl: false,
      rap: true,
      rh: 0,
      inputs: 0,
      x: 80,
      y: 460,
      wires: [["_EUI_.8", "_EUI_.7"]],
    },
    {
      id: "_EUI_.6",
      type: "http response",
      z: "1",
      name: "",
      statusCode: "",
      headers: {},
      x: 910,
      y: 300,
      wires: [],
    },
    {
      id: "_EUI_.7",
      type: "debug",
      z: "1",
      name: "RAW sensor data",
      active: false,
      tosidebar: true,
      console: false,
      tostatus: false,
      complete: "payload",
      targetType: "msg",
      statusVal: "",
      statusType: "auto",
      x: 310,
      y: 400,
      wires: [],
    },
    {
      id: "_EUI_.8",
      type: "function",
      z: "1",
      name: "",
      func: '\nlet data = msg.payload.uplink_message.decoded_payload;\nlet json = \n{\n  Name:data.name = "Node _NR_",\n  Latitude:data.location = msg.payload.uplink_message.locations["frm-payload"].latitude,\n  Longtitude:data.location = msg.payload.uplink_message.locations["frm-payload"].longitude,\n        battery: data.battery,\n        CO2: data.co2,\n        humidity: data.humidity,\n        pm10: data.pm10,\n        pm25: data.pm25,\n        pressure: data.pressure,\n        salinity: data.salinity,\n        temp: data.temp,\n        tvox: data.tvoc,\n  time: data.datetime = msg.payload.received_at\n}\nmsg.payload = json\n  return msg;',
      outputs: 1,
      noerr: 0,
      initialize: "",
      finalize: "",
      libs: [],
      x: 280,
      y: 460,
      wires: [["_EUI_.9", "_EUI_.2"]],
    },
    {
      id: "_EUI_.9",
      type: "debug",
      z: "1",
      name: "Parsed Sensor Data",
      active: false,
      tosidebar: true,
      console: false,
      tostatus: false,
      complete: "payload",
      targetType: "msg",
      statusVal: "",
      statusType: "auto",
      x: 660,
      y: 520,
      wires: [],
    },
    {
      id: "_EUI_.10",
      type: "debug",
      z: "1",
      name: "database Data",
      active: false,
      tosidebar: true,
      console: false,
      tostatus: false,
      complete: "payload",
      targetType: "msg",
      statusVal: "",
      statusType: "auto",
      x: 940,
      y: 360,
      wires: [],
    },
    {
      id: "_EUI_.11",
      type: "function",
      z: "1",
      name: "",
      func: "let data = msg.payload\nlet latest = msg.payload[data.length-1]\nmsg.payload = latest\nreturn msg;",
      outputs: 1,
      noerr: 0,
      initialize: "",
      finalize: "",
      libs: [],
      x: 620,
      y: 300,
      wires: [["_EUI_.6", "_EUI_.10"]],
    },
    {
      id: "_EUI_.12",
      type: "mongodb",
      hostname: "ci-infrastructure_mongodb_1",
      topology: "direct",
      connectOptions: "",
      port: "27017",
      db: "SensorData",
      name: "",
    },
    {
      id: "_EUI_.13",
      type: "mqtt-broker",
      name: "_application_name_",
      broker: "eu1.cloud.thethings.network",
      port: "1883",
      clientid: "",
      autoConnect: true,
      usetls: false,
      protocolVersion: "4",
      keepalive: "60",
      cleansession: true,
      birthTopic: "",
      birthQos: "0",
      birthPayload: "",
      birthMsg: {},
      closeTopic: "",
      closeQos: "0",
      closePayload: "",
      closeMsg: {},
      willTopic: "",
      willQos: "0",
      willPayload: "",
      willMsg: {},
      sessionExpiry: "",
      credentials: {
        user: "_application_name_@ttn",
        password: "_mqtt-token_",
      },
    },
  ],
};
