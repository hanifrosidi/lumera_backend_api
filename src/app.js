import express from "express";
import dotenv from "dotenv";
import machinesRouter from "./routes/machine.js";
import authRouter from "./routes/auth.js";
import { WebSocketServer, WebSocket } from "ws";
import {
  checkMachineStatus,
  predictSensor,
  randomSensor,
  insertSensor,
  insertPredict,
  cutOffMachine,
  buildTicketMainten,
} from "../helper/helper-sensor.js";
import maintenanceRouter from "./routes/maintenance.js";
import chatbotRouter from "./routes/chatbot.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/machine", machinesRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/auth", authRouter);
app.use("/chatbot", chatbotRouter);

const server = app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}`
  );
});

const wss = new WebSocketServer({ server });

let limitAnomaliCounters = {
  machine1: 5,
  machine2: 5,
  machine3: 5,
};

wss.on("connection", function connection(ws) {
  ws.on("message", async function message(data) {
    const socketMessage = JSON.parse(
      data.toString()
    );

    if (socketMessage.channel === "machine1") {
      console.log("menangkap sensor machine1");

      const sensor_input = randomSensor();

      try {
        const status_machine =
          await checkMachineStatus(
            socketMessage.channel
          );

        if (status_machine.status === "Off") {
          ws.send(
            "Machine 1 status is off please on Machine 1"
          );
        } else {
          // record sensor input
          const result = await insertSensor(
            socketMessage.channel,
            sensor_input
          );

          // predict to ml api
          const response = await predictSensor(
            sensor_input
          );

          if (response.predictions[0] === 1) {
            await insertPredict(
              result.id_activity,
              "anomali"
            );

            ws.send(
              `Machine 1 terdeteksi anomali `
            );

            limitAnomaliCounters.machine1--;

            if (
              limitAnomaliCounters.machine1 < 0
            ) {
              await cutOffMachine(
                socketMessage.channel
              );

              ws.send(
                `Machine 1 terdeteksi kerusakan berat & auto off active`
              );

              await buildTicketMainten(
                socketMessage.channel
              );

              ws.send(
                `Machine 1 berhasil ditambahkan pada daftar maintenance`
              );

              limitAnomaliCounters.machine1 = 10;
            }
          } else {
            await insertPredict(
              result.id_activity,
              "normal"
            );

            ws.send(
              `Machine 1 sensor detect air_temperature ${result.air_temperature} proccess_temperature ${result.process_temperature} rotational_speed ${result.rotational_speed} torque ${result.torque} tool_wear ${result.tool_wear} condition is good`
            );
          }
        }
      } catch (err) {
        ws.send(err);
      }
    } else if (
      socketMessage.channel === "machine2"
    ) {
      console.log("menangkap sensor machine2");

      const sensor_input = randomSensor();

      try {
        const status_machine =
          await checkMachineStatus(
            socketMessage.channel
          );

        if (status_machine.status === "Off") {
          ws.send(
            "Machine 2 status is off please on Machine 2"
          );
        } else {
          // record sensor input
          const result = await insertSensor(
            socketMessage.channel,
            sensor_input
          );

          // predict to ml api
          const response = await predictSensor(
            sensor_input
          );

          if (response.predictions[0] === 1) {
            limitAnomaliCounters.machine2 -= 1;

            await insertPredict(
              result.id_activity,
              "anomali"
            );

            ws.send(
              `Machine 2 terdeteksi anomali `
            );

            console.log(
              limitAnomaliCounters.machine2
            );

            if (
              limitAnomaliCounters.machine2 < 0
            ) {
              await cutOffMachine(
                socketMessage.channel
              );

              ws.send(
                `Machine 2 terdeteksi kerusakan berat & auto off active`
              );

              const result =
                await buildTicketMainten(
                  socketMessage.channel
                );

              console.log(result);

              ws.send(
                `Machine 2 berhasil ditambahkan pada daftar maintenance`
              );

              limitAnomaliCounters.machine2 = 10;
            }
          } else {
            await insertPredict(
              result.id_activity,
              "normal"
            );

            ws.send(
              `Machine 2 sensor detect air_temperature ${result.air_temperature} proccess_temperature ${result.process_temperature} rotational_speed ${result.rotational_speed} torque ${result.torque} tool_wear ${result.tool_wear} condition is good`
            );
          }
        }
      } catch (err) {
        ws.send(err);
      }
    } else if (
      socketMessage.channel === "machine3"
    ) {
      console.log("menangkap sensor machine3");

      const sensor_input = randomSensor();

      try {
        const status_machine =
          await checkMachineStatus(
            socketMessage.channel
          );

        if (status_machine.status === "Off") {
          ws.send(
            "Machine 3 status is off please on Machine 3"
          );
        } else {
          // record sensor input
          const result = await insertSensor(
            socketMessage.channel,
            sensor_input
          );

          // predict to ml api
          const response = await predictSensor(
            sensor_input
          );

          if (response.predictions[0] < 1) {
            await insertPredict(
              result.id_activity,
              "anomali"
            );

            ws.send(
              `Machine 3 terdeteksi anomali `
            );

            limitAnomaliCounters.machine3--;

            console.log(
              limitAnomaliCounters.machine3
            );

            if (
              limitAnomaliCounters.machine3 === 0
            ) {
              await cutOffMachine(
                socketMessage.channel
              );

              ws.send(
                `Machine 3 terdeteksi kerusakan berat & auto off active`
              );

              await buildTicketMainten(
                socketMessage.channel
              );

              ws.send(
                `Machine 3 berhasil ditambahkan pada daftar maintenance`
              );

              limitAnomaliCounters.machine3 = 10;
            }
          } else {
            await insertPredict(
              result.id_activity,
              "normal"
            );

            ws.send(
              `Machine 3 sensor detect air_temperature ${result.air_temperature} proccess_temperature ${result.process_temperature} rotational_speed ${result.rotational_speed} torque ${result.torque} tool_wear ${result.tool_wear} condition is good`
            );
          }
        }
      } catch (err) {
        ws.send(err);
      }
    }
  });

  wss.on("close", () => {
    for (const set of channels.values()) {
      set.delete(wss);
    }
  });
});

wss.on("error", console.error);
console.log(
  `Websocket server running on ws://localhost:${port}`
);
