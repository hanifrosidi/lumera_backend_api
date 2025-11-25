import connect from "../db/connection.js";
import ClientError from "../error/ClientError.js";
import DatabaseError from "../error/DatabaseError.js";

class MachineRepository {
  async findAll() {
    try {
      const result = await connect.query(
        "SELECT * FROM machines"
      );

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async getDataChart(hours) {
    try {
      const result = await connect.query(
        `SELECT machine_id,
          AVG(air_temperature) AS air_temperature,
          AVG(process_temperature) AS process_temperature,
          AVG(rotational_speed) AS rotational_speed,
          AVG(torque) AS torque,
          AVG(tool_wear) AS tool_wear
          FROM machine_activity_sensor
          WHERE created_at >= NOW() - make_interval(hours => $1)
          GROUP BY machine_id`,
        [hours]
      );

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async findId(id) {
    try {
      const result = await connect.query(
        "SELECT * FROM machines WHERE id=$1",
        [id]
      );

      if (result.rows.length === 0) {
        throw new ClientError(
          "Id machine not found"
        );
      }

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async findType(type) {
    try {
      const result = await connect.query(
        "SELECT * FROM machines WHERE type=$1",
        [type]
      );

      if (result.rows.length === 0) {
        throw new ClientError(
          "Type machines not found"
        );
      }

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async setStatus(id_machine, status) {
    try {
      // check id_machine is ready
      const check_machine = await connect.query(
        "SELECT * FROM machines WHERE id=$1",
        [id_machine]
      );

      if (check_machine.rows.length === 0) {
        throw new ClientError(
          "Machine Not Found"
        );
      }

      // checking maintenance status
      const maintenaceCheck = await connect.query(
        "SELECT * FROM machine_maintenance WHERE id_machine=$1",
        [id_machine]
      );

      if (maintenaceCheck.rowCount === 0) {
        await connect.query(
          "UPDATE machines SET status=$1 WHERE id=$2",
          [status, id_machine]
        );
        return "Status machine berhasil dirubah";
      }

      // check if track is checking
      if (
        maintenaceCheck.rows[0].status ===
        "Checking"
      ) {
        throw new ClientError(
          `${id_machine} status masih dalam pengecekan silahkan selesaikan pengecekan pada daftar maintenance`
        );
      }

      await connect.query(
        "UPDATE machines SET status=$1 WHERE id=$2",
        [status, id_machine]
      );

      return "Status machine berhasil dirubah";
    } catch (err) {
      throw err;
    }
  }

  async create(machine) {
    try {
      const result = await connect.query(
        "INSERT INTO machines(type, name) VALUES($1, $2) RETURNING name",
        [machine.type, machine.name]
      );

      if (result.rows.length > 0) {
        return result.rows[0].name;
      } else {
        throw new DatabaseError(
          "Gagal menambah machine"
        );
      }
    } catch (err) {
      return err;
    }
  }

  async update(machine, id) {
    try {
      // checking id is find
      const id_checking = await connect.query(
        "SELECT * FROM machines WHERE id=$1",
        [id]
      );

      // throw client error if id not found
      if (id_checking.rows.length === 0) {
        throw new ClientError(
          "id machines not found"
        );
      }

      // get id machine
      const str = id_checking.rows[0].id;

      // update new machine data
      const update = await connect.query(
        "UPDATE machines SET id=$1,type=$2, name=$3, updated_at=$4 WHERE id=$5 RETURNING id",
        [
          machine.type + str.slice(1),
          machine.type,
          machine.name,
          new Date(),
          id,
        ]
      );

      // checking if update machinge is success
      if (update.rows.length > 0) {
        return str + " to " + update.rows[0].id;
      } else {
        throw DatabaseError(
          "Gagal update machine"
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      // check id is find
      const id_check = await connect.query(
        "SELECT * FROM machines WHERE id=$1",
        [id]
      );

      // throw client error if id not found
      if (id_check.rows.length === 0) {
        throw new ClientError(
          "Id machine not found"
        );
      }

      const result = await connect.query(
        "DELETE FROM machines WHERE id=$1 RETURNING name",
        [id]
      );

      // checking result delete
      if (result.rowCount > 0) {
        return result.rows[0].name;
      } else {
        throw new DatabaseError(
          "Gagal menghapus machine"
        );
      }
    } catch (err) {
      throw err;
    }
  }
}

export default MachineRepository;
