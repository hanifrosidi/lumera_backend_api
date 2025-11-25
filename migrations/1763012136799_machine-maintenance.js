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
  // Create a sequence that starts at 1
  pgm.createSequence("machines_seq", {
    start: 1,
  });

  pgm.createType("track", ["Checking", "Finish"]);

  pgm.createTable("machine_maintenance", {
    id: {
      type: "varchar(10)",
      notNull: true,
      primaryKey: true,
      default: pgm.func(
        "('MM' || LPAD(nextval('machines_seq')::text, 5, '0'))"
      ),
    },
    id_machine: {
      type: "text",
      notNull: true,
    },
    air_temperature: {
      type: "numeric",
      notNull: true,
    },
    process_temperature: {
      type: "numeric",
      notNull: true,
    },
    rotational_speed: {
      type: "numeric",
      notNull: true,
    },
    torque: {
      type: "numeric",
      notNull: true,
    },
    tool_wear: {
      type: "numeric",
      notNull: true,
    },
    run_machine: {
      type: "integer",
      notNull: true,
    },
    count_anomali: {
      type: "integer",
      notNull: true,
    },
    count_normal: {
      type: "integer",
      notNull: true,
    },
    waktu_mulai: {
      type: "timestamp",
      notNull: true,
    },
    waktu_selesai: {
      type: "timestamp",
      notNull: true,
    },
    status: {
      type: "track",
      notNull: true,
      default: "Checking",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createConstraint(
    "machine_maintenance",
    "fk_machine_maintenance_machines",
    {
      foreignKeys: {
        columns: "id_machine",
        references: "machines(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("machine_maintenance");
  pgm.dropType("track");
};
