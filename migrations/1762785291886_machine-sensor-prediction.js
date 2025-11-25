/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Create type enum
  pgm.createType("sensor_predict", [
    "normal",
    "anomali",
  ]);

  pgm.createTable("machine_sensor_predict", {
    id_predict: {
      type: "varchar(10)",
      notNull: true,
      primaryKey: true,
    },
    id_activity: {
      type: "varchar(10)",
      notNull: true,
    },
    predict_result: {
      type: "sensor_predict",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createConstraint(
    "machine_sensor_predict",
    "fk_machine_sensor_predict_machine_activity_sensor",
    {
      foreignKeys: {
        columns: "id_activity",
        references:
          "machine_activity_sensor(id_activity)",
        onDelete: "CASCADE",
      },
    }
  );

  pgm.sql(`
  CREATE OR REPLACE FUNCTION generate_predict_id()
  RETURNS TRIGGER AS $$
  DECLARE
    seq_num INT;
  BEGIN
    SELECT nextval('activity_seq') INTO seq_num;
    NEW.id_predict := 'SP' || LPAD(seq_num::text, 4, '0');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

  pgm.sql(`
  CREATE TRIGGER activity_id_trigger
  BEFORE INSERT ON machine_sensor_predict
  FOR EACH ROW
  WHEN (NEW.id_predict IS NULL)
  EXECUTE FUNCTION generate_predict_id();
`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("machine_sensor_predict");
  pgm.dropType("sensor_predict");
};
