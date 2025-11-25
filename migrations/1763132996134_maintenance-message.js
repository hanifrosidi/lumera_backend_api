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
  // Create sequence
  pgm.createSequence("mms_seq", { start: 1 });

  pgm.createTable("maintenance_message", {
    id: {
      type: "text",
      primaryKey: true,
      notNull: true,
    },
    id_maintenance: {
      type: "varchar(10)",
      notNull: true,
    },
    message: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createConstraint(
    "maintenance_message",
    "fk_maintenance_message_machine_maintenance",
    {
      foreignKeys: {
        columns: "id_maintenance",
        references: "machine_maintenance(id)",
        onDelete: "CASCADE",
      },
    }
  );

  // Create function to generate MMS0001 format
  pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_mms_id()
    RETURNS trigger AS $$
    BEGIN
      NEW.id := 'MMS' || LPAD(nextval('mms_seq')::text, 4, '0');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create trigger
  pgm.sql(`
    CREATE TRIGGER trg_mms_id
    BEFORE INSERT ON maintenance_message
    FOR EACH ROW
    WHEN (NEW.id IS NULL)
    EXECUTE FUNCTION generate_mms_id();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("maintenance_message");
  pgm.dropSequence("mms_seq");
};
