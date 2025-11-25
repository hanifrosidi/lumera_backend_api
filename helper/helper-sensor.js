import connect from "../src/db/connection.js";
import DatabaseError from "../src/error/DatabaseError.js";

export async function insertSensor(
  type_machine,
  sensor
) {
  if (type_machine === "machine1") {
    try {
      const result = await connect.query(
        "INSERT INTO machine_activity_sensor(machine_id, air_temperature, process_temperature, rotational_speed, torque, tool_wear) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_activity, air_temperature, process_temperature, rotational_speed, torque, tool_wear",
        [
          "L001",
          sensor.air_temperature,
          sensor.proccess_temperature,
          sensor.rotational_speed,
          sensor.torque,
          sensor.tool_wear,
        ]
      );
      return result.rows[0];
    } catch (err) {
      return err;
    }
  } else if (type_machine === "machine2") {
    try {
      const result = await connect.query(
        "INSERT INTO machine_activity_sensor(machine_id, air_temperature, process_temperature, rotational_speed, torque, tool_wear) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_activity, air_temperature, process_temperature, rotational_speed, torque, tool_wear",
        [
          "M001",
          sensor.air_temperature,
          sensor.proccess_temperature,
          sensor.rotational_speed,
          sensor.torque,
          sensor.tool_wear,
        ]
      );

      return result.rows[0];
    } catch (err) {
      return err;
    }
  } else if (type_machine === "machine3") {
    try {
      const result = await connect.query(
        "INSERT INTO machine_activity_sensor(machine_id, air_temperature, process_temperature, rotational_speed, torque, tool_wear) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_activity, air_temperature, process_temperature, rotational_speed, torque, tool_wear",
        [
          "H001",
          sensor.air_temperature,
          sensor.proccess_temperature,
          sensor.rotational_speed,
          sensor.torque,
          sensor.tool_wear,
        ]
      );

      return result.rows[0];
    } catch (err) {
      return err;
    }
  } else {
    return "Machine not register";
  }
}

export async function insertPredict(
  id_activity,
  predict
) {
  try {
    await connect.query(
      "INSERT INTO machine_sensor_predict(id_activity, predict_result) VALUES($1, $2)",
      [id_activity, predict]
    );
  } catch (err) {
    return err;
  }
}

export async function cutOffMachine(
  type_machine
) {
  if (type_machine === "machine1") {
    try {
      await connect.query(
        "UPDATE machines SET status='Off' WHERE id='L001'"
      );
    } catch (err) {
      return err;
    }
  } else if (type_machine === "machine2") {
    try {
      await connect.query(
        "UPDATE machines SET status='Off' WHERE id='M001'"
      );
    } catch (err) {
      return err;
    }
  } else if (type_machine === "machine3") {
    try {
      await connect.query(
        "UPDATE machines SET status='Off' WHERE id='H001'"
      );
    } catch (err) {
      return err;
    }
  }
}

export async function checkMachineStatus(
  type_machine
) {
  try {
    if (type_machine === "machine1") {
      const result = await connect.query(
        "SELECT status FROM machines WHERE id=$1",
        ["L001"]
      );
      return result.rows[0];
    } else if (type_machine === "machine2") {
      const result = await connect.query(
        "SELECT status FROM machines WHERE id=$1",
        ["M001"]
      );
      return result.rows[0];
    } else if (type_machine === "machine3") {
      const result = await connect.query(
        "SELECT status FROM machines WHERE id=$1",
        ["H001"]
      );
      return result.rows[0];
    }
  } catch (err) {
    return err;
  }
}

export function randomSensor() {
  return {
    air_temperature: Number(
      (
        Math.random() * (400.0 - 50.0) +
        50.0
      ).toFixed(1)
    ),
    proccess_temperature: Number(
      (
        Math.random() * (400.0 - 50.0) +
        50.0
      ).toFixed(1)
    ),
    rotational_speed:
      Math.floor(Math.random() * (3000 - 1000)) +
      1000,
    torque: Number(
      (Math.random() * (101.0 - 0) + 0).toFixed(1)
    ),
    tool_wear: Math.floor(Math.random() * 301),
  };
}

export async function predictSensor({
  air_temperature,
  proccess_temperature,
  rotational_speed,
  torque,
  tool_wear,
}) {
  try {
    const response = await fetch(
      "http://127.0.0.1:5001/invocations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataframe_split: {
            columns: [
              "Air_temperature_K",
              "Process_temperature_K",
              "Rotational_speed_rpm",
              "Torque_Nm",
              "Tool_wear_min",
            ],
            data: [
              [
                air_temperature,
                proccess_temperature,
                rotational_speed,
                torque,
                tool_wear,
              ],
            ],
          },
        }),
      }
    );

    return await response.json();
  } catch (err) {
    return "Api ML Bermasalah";
  }
}

export async function buildTicketMainten(
  type_machine
) {
  try {
    if (type_machine === "machine1") {
      const recap_predict = await connect.query(`
        SELECT 
        sensor.machine_id,
        AVG(sensor.air_temperature) AS avg_air_temperature,
        AVG(sensor.process_temperature) AS avg_process_temperature,
        AVG(sensor.rotational_speed) AS avg_rotational_speed,
        AVG(sensor.torque) AS avg_torque,
        AVG(sensor.tool_wear) AS avg_tool_wear,
        COUNT(sensor.machine_id) AS run_machine,
        SUM(CASE WHEN predict.predict_result = 'anomali' THEN 1 ELSE 0 END) AS count_anomali,
        SUM(CASE WHEN predict.predict_result = 'normal' THEN 1 ELSE 0 END) AS count_normal,
        MIN(predict.created_at) AS waktu_mulai,
        MAX(predict.created_at) AS waktu_selesai
      FROM machine_sensor_predict AS predict
      INNER JOIN machine_activity_sensor AS sensor 
        ON predict.id_activity = sensor.id_activity
      WHERE sensor.machine_id = 'L001'
        AND predict.created_at < (
          SELECT MAX(p2.created_at)
          FROM machine_sensor_predict AS p2
          INNER JOIN machine_activity_sensor AS s2 
            ON p2.id_activity = s2.id_activity
          WHERE s2.machine_id = 'L001'
        )
      GROUP BY sensor.machine_id
      `);

      if (recap_predict.rows.length > 0) {
        const result = {
          id_machine:
            recap_predict.rows[0].machine_id,
          air_temperature: Number(
            recap_predict.rows[0]
              .avg_air_temperature
          ),
          process_temperature: Number(
            recap_predict.rows[0]
              .avg_process_temperature
          ),
          rotational_speed: Number(
            recap_predict.rows[0]
              .avg_rotational_speed
          ),
          torque: Number(
            recap_predict.rows[0].avg_torque
          ),
          tool_wear: Number(
            recap_predict.rows[0].avg_tool_wear
          ),
          run_machine: Number(
            recap_predict.rows[0].run_machine
          ),
          count_anomali: Number(
            recap_predict.rows[0].count_anomali
          ),
          count_normal: Number(
            recap_predict.rows[0].count_normal
          ),
          waktu_mulai: new Date(
            recap_predict.rows[0].waktu_mulai
          ),
          waktu_selesai: new Date(
            recap_predict.rows[0].waktu_selesai
          ),
        };

        // save to machine_maintenance
        const result_maintenance =
          await connect.query(
            "INSERT INTO machine_maintenance(id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine,count_anomali, count_normal, waktu_mulai, waktu_selesai) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING id",
            [
              result.id_machine,
              result.air_temperature,
              result.process_temperature,
              result.rotational_speed,
              result.torque,
              result.tool_wear,
              result.run_machine,
              result.count_anomali,
              result.count_normal,
              result.waktu_mulai,
              result.waktu_selesai,
            ]
          );

        if (
          result_maintenance.rows.length === 0
        ) {
          throw DatabaseError(
            "Gagal menambahkan machine maintenance"
          );
        }

        await connect.query(`DELETE FROM machine_sensor_predict AS predict
        USING machine_activity_sensor AS activity
        WHERE activity.machine_id = 'L001'`);
      } else {
        throw DatabaseError(
          "gagal mendapatkan recap"
        );
      }
    } else if (type_machine === "machine2") {
      const recap_predict = await connect.query(`
        SELECT 
        sensor.machine_id,
        AVG(sensor.air_temperature) AS avg_air_temperature,
        AVG(sensor.process_temperature) AS avg_process_temperature,
        AVG(sensor.rotational_speed) AS avg_rotational_speed,
        AVG(sensor.torque) AS avg_torque,
        AVG(sensor.tool_wear) AS avg_tool_wear,
        COUNT(sensor.machine_id) AS run_machine,
        SUM(CASE WHEN predict.predict_result = 'anomali' THEN 1 ELSE 0 END) AS count_anomali,
        SUM(CASE WHEN predict.predict_result = 'normal' THEN 1 ELSE 0 END) AS count_normal,
        MIN(predict.created_at) AS waktu_mulai,
        MAX(predict.created_at) AS waktu_selesai
      FROM machine_sensor_predict AS predict
      INNER JOIN machine_activity_sensor AS sensor 
        ON predict.id_activity = sensor.id_activity
      WHERE sensor.machine_id = 'M001'
        AND predict.created_at < (
          SELECT MAX(p2.created_at)
          FROM machine_sensor_predict AS p2
          INNER JOIN machine_activity_sensor AS s2 
            ON p2.id_activity = s2.id_activity
          WHERE s2.machine_id = 'M001'
        )
      GROUP BY sensor.machine_id
      `);

      if (recap_predict.rows.length > 0) {
        const result = {
          id_machine:
            recap_predict.rows[0].machine_id,
          air_temperature: Number(
            recap_predict.rows[0]
              .avg_air_temperature
          ),
          process_temperature: Number(
            recap_predict.rows[0]
              .avg_process_temperature
          ),
          rotational_speed: Number(
            recap_predict.rows[0]
              .avg_rotational_speed
          ),
          torque: Number(
            recap_predict.rows[0].avg_torque
          ),
          tool_wear: Number(
            recap_predict.rows[0].avg_tool_wear
          ),
          run_machine: Number(
            recap_predict.rows[0].run_machine
          ),
          count_anomali: Number(
            recap_predict.rows[0].count_anomali
          ),
          count_normal: Number(
            recap_predict.rows[0].count_normal
          ),
          waktu_mulai: new Date(
            recap_predict.rows[0].waktu_mulai
          ),
          waktu_selesai: new Date(
            recap_predict.rows[0].waktu_selesai
          ),
        };

        // save to machine_maintenance
        const result_maintenance =
          await connect.query(
            "INSERT INTO machine_maintenance(id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine,count_anomali, count_normal, waktu_mulai, waktu_selesai) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING id",
            [
              result.id_machine,
              result.air_temperature,
              result.process_temperature,
              result.rotational_speed,
              result.torque,
              result.tool_wear,
              result.run_machine,
              result.count_anomali,
              result.count_normal,
              result.waktu_mulai,
              result.waktu_selesai,
            ]
          );

        if (
          result_maintenance.rows.length === 0
        ) {
          throw DatabaseError(
            "Gagal menambahkan machine maintenance"
          );
        }

        await connect.query(`DELETE FROM machine_sensor_predict AS predict
        USING machine_activity_sensor AS activity
        WHERE activity.machine_id = 'M001'`);
      } else {
        throw DatabaseError(
          "gagal mendapatkan recap"
        );
      }
    } else if (type_machine === "machine3") {
      const recap_predict = await connect.query(`
        SELECT 
        sensor.machine_id,
        AVG(sensor.air_temperature) AS avg_air_temperature,
        AVG(sensor.process_temperature) AS avg_process_temperature,
        AVG(sensor.rotational_speed) AS avg_rotational_speed,
        AVG(sensor.torque) AS avg_torque,
        AVG(sensor.tool_wear) AS avg_tool_wear,
        COUNT(sensor.machine_id) AS run_machine,
        SUM(CASE WHEN predict.predict_result = 'anomali' THEN 1 ELSE 0 END) AS count_anomali,
        SUM(CASE WHEN predict.predict_result = 'normal' THEN 1 ELSE 0 END) AS count_normal,
        MIN(predict.created_at) AS waktu_mulai,
        MAX(predict.created_at) AS waktu_selesai
      FROM machine_sensor_predict AS predict
      INNER JOIN machine_activity_sensor AS sensor 
        ON predict.id_activity = sensor.id_activity
      WHERE sensor.machine_id = 'H001'
        AND predict.created_at < (
          SELECT MAX(p2.created_at)
          FROM machine_sensor_predict AS p2
          INNER JOIN machine_activity_sensor AS s2 
            ON p2.id_activity = s2.id_activity
          WHERE s2.machine_id = 'H001'
        )
      GROUP BY sensor.machine_id
      `);

      if (recap_predict.rows.length > 0) {
        const result = {
          id_machine:
            recap_predict.rows[0].machine_id,
          air_temperature: Number(
            recap_predict.rows[0]
              .avg_air_temperature
          ),
          process_temperature: Number(
            recap_predict.rows[0]
              .avg_process_temperature
          ),
          rotational_speed: Number(
            recap_predict.rows[0]
              .avg_rotational_speed
          ),
          torque: Number(
            recap_predict.rows[0].avg_torque
          ),
          tool_wear: Number(
            recap_predict.rows[0].avg_tool_wear
          ),
          run_machine: Number(
            recap_predict.rows[0].run_machine
          ),
          count_anomali: Number(
            recap_predict.rows[0].count_anomali
          ),
          count_normal: Number(
            recap_predict.rows[0].count_normal
          ),
          waktu_mulai: new Date(
            recap_predict.rows[0].waktu_mulai
          ),
          waktu_selesai: new Date(
            recap_predict.rows[0].waktu_selesai
          ),
        };

        // save to machine_maintenance
        const result_maintenance =
          await connect.query(
            "INSERT INTO machine_maintenance(id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine,count_anomali, count_normal, waktu_mulai, waktu_selesai) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING id",
            [
              result.id_machine,
              result.air_temperature,
              result.process_temperature,
              result.rotational_speed,
              result.torque,
              result.tool_wear,
              result.run_machine,
              result.count_anomali,
              result.count_normal,
              result.waktu_mulai,
              result.waktu_selesai,
            ]
          );

        if (
          result_maintenance.rows.length === 0
        ) {
          throw DatabaseError(
            "Gagal menambahkan machine maintenance"
          );
        }

        await connect.query(`DELETE FROM machine_sensor_predict AS predict
        USING machine_activity_sensor AS activity
        WHERE activity.machine_id = 'H001'`);
      } else {
        throw DatabaseError(
          "gagal mendapatkan recap"
        );
      }
    }
  } catch (err) {
    return err;
  }
}
