/*
Made by: Birk Tamm
Date: 21/04/2022 22:03
*/

"use strict";
var request = require("request");
var optionsGET = {
    method: "GET",
    url: "https://eu1.cloud.thethings.network/api/v3/applications/zanzibar/devices?field_mask=name",
    headers: {
        Authorization: "Bearer API_KEY_FROM_TTN",
    },
};

request(optionsGET, function(error, response) {
    if (error) throw new Error(error);
    let jsonResp = JSON.parse(response.body);
    for (const device of jsonResp.end_devices) {
        make_json(device.name, device.ids.device_id);
    }
});

function make_json(name, id) {
    var EUI = id;
    var NAME = name;
    var NAME_NR = name.substring(5);

    var string_data = JSON.stringify(data);

    string_data = string_data.replaceAll("EUI", EUI);
    string_data = string_data.replaceAll("NAME_NR", NAME_NR);
    string_data = string_data.replaceAll("NAME", NAME);
    send_data(string_data)
}

function send_data(data) {
    var optionsPOST = {
        'method': 'POST',
        'url': 'http://NODERED_IP/flow',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: data
    };
    request(optionsPOST, function(error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}
const data = {
    id: "EUI.1",
    type: "tab",
    label: "SensorNAME_NR",
    disabled: false,
    info: "",
    env: [],
    nodes: [{
            id: "EUI.2",
            type: "mongodb out",
            z: "EUI.1",
            mongodb: "EUI.12",
            name: "AreaNAME_NR (save)",
            collection: "AreaNAME_NR",
            payonly: true,
            upsert: false,
            multi: false,
            operation: "insert",
            x: 640,
            y: 460,
            wires: [],
        },
        {
            id: "EUI.3",
            type: "mongodb in",
            z: "EUI.1",
            mongodb: "EUI.12",
            name: "AreaNAME_NR data",
            collection: "AreaNAME_NR",
            operation: "find",
            x: 290,
            y: 300,
            wires: [
                ["EUI.11"]
            ],
        },
        {
            id: "EUI.4",
            type: "http in",
            z: "EUI.1",
            name: "(get) dataNAME_NR",
            url: "/dataNAME_NR",
            method: "get",
            upload: false,
            swaggerDoc: "",
            x: 90,
            y: 300,
            wires: [
                [
                    "EUI.3"
                ]
            ],
        },
        {
            id: "EUI.5",
            type: "mqtt in",
            z: "EUI.1",
            name: "Sensor",
            topic: "v3/zanzibar@ttn/devices/EUI/up",
            qos: "2",
            datatype: "json",
            broker: "EUI.13",
            nl: false,
            rap: true,
            rh: 0,
            inputs: 0,
            x: 80,
            y: 460,
            wires: [
                ["EUI.8", "EUI.7"]
            ],
        },
        {
            id: "EUI.6",
            type: "http response",
            z: "EUI.1",
            name: "",
            statusCode: "",
            headers: {},
            x: 910,
            y: 300,
            wires: [],
        },
        {
            id: "EUI.7",
            type: "debug",
            z: "EUI.1",
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
            id: "EUI.8",
            type: "function",
            z: "EUI.1",
            name: "",
            func: '\nvar data = msg.payload.uplink_message.decoded_payload;\nvar json = \n{\n  Name:data.name = "NAME",\n  Latitude:data.location = msg.payload.uplink_message.locations["frm-payload"].latitude,\n  Longtitude:data.location = msg.payload.uplink_message.locations["frm-payload"].longitude,\n        battery: data.battery,\n        CO2: data.co2,\n        humidity: data.humidity,\n        pm10: data.pm10,\n        pm25: data.pm25,\n        pressure: data.pressure,\n        salinity: data.salinity,\n        temp: data.temp,\n        tvox: data.tvoc,\n  time: data.datetime = msg.payload.received_at\n}\nmsg.payload = json\n  return msg;',
            outputs: 1,
            noerr: 0,
            initialize: "",
            finalize: "",
            libs: [],
            x: 280,
            y: 460,
            wires: [
                ["EUI.9", "EUI.2"]
            ],
        },
        {
            id: "EUI.9",
            type: "debug",
            z: "EUI.1",
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
            id: "EUI.10",
            type: "debug",
            z: "EUI.1",
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
            id: "EUI.11",
            type: "function",
            z: "EUI.1",
            name: "",
            func: "var data = msg.payload\nvar latest = msg.payload[data.length-1]\nmsg.payload = latest\nreturn msg;",
            outputs: 1,
            noerr: 0,
            initialize: "",
            finalize: "",
            libs: [],
            x: 620,
            y: 300,
            wires: [
                ["EUI.6", "EUI.10"]
            ],
        },
        {
            id: "EUI.12",
            type: "mongodb",
            hostname: "ci-infrastructure_mongodb_1",
            topology: "direct",
            connectOptions: "",
            port: "27017",
            db: "SensorData",
            name: "",
        },
        {
            id: "EUI.13",
            type: "mqtt-broker",
            name: "Sensoren",
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
                user: "zanzibar@ttn",
                password: "API_KEY_FROM_TTN"
            }
        },
    ],
};