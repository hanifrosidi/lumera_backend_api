import connect from "../db/connection.js";
import ClientError from "../error/ClientError.js";
import DatabaseError from "../error/DatabaseError.js";

class MaintenanceRepository {
  async getAll() {
    try {
      const result =
        await connect.query(`SELECT id, id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine, count_anomali, count_normal,
        waktu_mulai, waktu_selesai,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) / 60) AS minutes_run,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) % 60) AS seconds_run,
        created_at
        FROM machine_maintenance`);

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async getById(id_maintenance) {
    try {
      const result = await connect.query(
        `SELECT id, id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine, count_anomali, count_normal,
        waktu_mulai, waktu_selesai,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) / 60) AS minutes_run,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) % 60) AS seconds_run,
        created_at
        FROM machine_maintenance WHERE id=$1`,
        [id_maintenance]
      );

      if (result.rows.length === 0) {
        throw new ClientError(
          "Data maintenance tidak ditemukan"
        );
      }

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async getByMachineId(id_machine) {
    try {
      const result = await connect.query(
        `SELECT id, id_machine, air_temperature, process_temperature, rotational_speed, torque, tool_wear, run_machine, count_anomali, count_normal,
        waktu_mulai, waktu_selesai,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) / 60) AS minutes_run,
        FLOOR(EXTRACT(EPOCH FROM (waktu_selesai - waktu_mulai)) % 60) AS seconds_run,
        created_at
        FROM machine_maintenance WHERE id_machine=$1`,
        [id_machine]
      );

      if (result.rowCount === 0) {
        throw new ClientError(
          "Data maintenance tidak ditemukan"
        );
      }

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async updateMaintenance(
    id_maintenance,
    status,
    message
  ) {
    try {
      // checking id_maintenance
      const checking1 = await connect.query(
        "SELECT * FROM machine_maintenance WHERE id=$1",
        [id_maintenance]
      );

      if (checking1.rowCount === 0) {
        throw new ClientError(
          "Daftar maintenance tidak ditemukan"
        );
      }

      if (
        checking1.rows[0].status !== "Checking"
      ) {
        throw new ClientError(
          "Maintenance machine telah dilakukan"
        );
      }

      // simpan message perbaikan
      const result = await connect.query(
        "INSERT INTO maintenance_message(id_maintenance,message) VALUES($1, $2) RETURNING id",
        [id_maintenance, message]
      );

      if (result.rowCount === 0) {
        throw new DatabaseError(
          "Gagal menambahkan message maintenance"
        );
      }

      // update status maintenance
      await connect.query(
        "UPDATE machine_maintenance SET status=$1 WHERE id=$2",
        [status, id_maintenance]
      );

      return checking1.rows[0].id_machine;
    } catch (err) {
      throw err;
    }
  }

  async deleteMaintenance(id_maintenance) {
    try {
      const search = await connect.query(
        "SELECT * FROM machine_maintenance WHERE id=$1",
        [id_maintenance]
      );

      if (search.rowCount === 0) {
        throw new ClientError(
          "Data maintenance tidak ditemukan"
        );
      }

      const result = await connect.query(
        "DELETE FROM machine_maintenance WHERE id=$1",
        [id_maintenance]
      );

      return search.rows[0].id_machine;
    } catch (err) {
      throw err;
    }
  }

  async getMessage() {
    try {
      const result = await connect.query(
        "SELECT * FROM maintenance_message"
      );

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async getMessageById(id) {
    try {
      const result = await connect.query(
        "SELECT * FROM maintenance_message WHERE id=$1",
        [id]
      );

      if (result.rowCount === 0) {
        throw new ClientError(
          "Message maintenance tidak ditemukan"
        );
      }

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteMessage(id) {
    try {
      const check1 = await connect.query(
        "SELECT * FROM maintenance_message WHERE id=$1",
        [id]
      );

      if (check1.rowCount === 0) {
        throw new ClientError(
          "Message maintenance tidak ditemukan"
        );
      }

      // Delete message maintenance
      await connect.query(
        "DELETE FROM maintenance_message WHERE id=$1",
        [id]
      );
    } catch (err) {
      throw err;
    }
  }
}

export default MaintenanceRepository;
