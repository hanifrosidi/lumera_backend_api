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
  pgm.createSequence("activity_seq", {
    start: 1,
  });

  pgm.createTable("machine_activity_sensor", {
    id_activity: {
      type: "varchar(10)",
      primaryKey: true,
    },
    machine_id: {
      type: "text",
      notNull: true,
    },
    air_temperature: {
      type: "numeric(4,1)",
      notNull: true,
      default: 0.0,
    },
    process_temperature: {
      type: "numeric(4,1)",
      notNull: true,
      default: 0.0,
    },
    rotational_speed: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    torque: {
      type: "numeric(4,1)",
      notNull: true,
      default: 0,
    },
    tool_wear: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createConstraint(
    "machine_activity_sensor",
    "fk_machine_activity_sensor_machines",
    {
      foreignKeys: {
        columns: "machine_id",
        references: "machines(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    }
  );

  pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_activity_id()
    RETURNS TRIGGER AS $$
    DECLARE
      seq_num INT;
    BEGIN
      SELECT nextval('activity_seq') INTO seq_num;
      NEW.id_activity := 'SR' || LPAD(seq_num::text, 4, '0');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER activity_id_trigger
    BEFORE INSERT ON machine_activity_sensor
    FOR EACH ROW
    WHEN (NEW.id_activity IS NULL)
    EXECUTE FUNCTION generate_activity_id();
  `);
};

export const down = (pgm) => {
  pgm.sql(
    `DROP TRIGGER IF EXISTS activity_id_trigger ON machine_activity_sensor;`
  );
  pgm.sql(
    `DROP FUNCTION IF EXISTS generate_activity_id();`
  );
  pgm.dropSequence("activity_seq");
  pgm.dropTable("machine_activity_sensor");
};