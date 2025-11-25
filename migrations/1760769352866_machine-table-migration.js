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
  // Create sequences for each type
  pgm.createSequence("seq_h", { start: 1 });
  pgm.createSequence("seq_l", { start: 1 });
  pgm.createSequence("seq_m", { start: 1 });

  // Create type enum
  pgm.createType("machine_perform", [
    "High performance",
    "Medium performance",
    "Low performance",
  ]);

  pgm.createType("status", ["On", "Off"]);

  pgm.createTable("machines", {
    id: {
      type: "text",
      notNull: true,
      primaryKey: true,
    },

    type: {
      type: "char(1)",
      notNull: true,
      check: "type IN ('H', 'L', 'M')",
    },

    name: {
      type: "machine_perform",
      notNull: true,
    },

    status: {
      type: "status",
      notNull: true,
      default: "Off",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },

    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  // Create trigger function to assign ID based on type
  pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_machine_id()
    RETURNS TRIGGER AS $$
    DECLARE
      seq_val integer;
      prefix text;
    BEGIN
      prefix := NEW.type;
      
      IF prefix = 'H' THEN
        seq_val := nextval('seq_h');
      ELSIF prefix = 'L' THEN
        seq_val := nextval('seq_l');
      ELSIF prefix = 'M' THEN
        seq_val := nextval('seq_m');
      ELSE
        RAISE EXCEPTION 'Invalid type prefix: %', prefix;
      END IF;
      
      NEW.id := concat(prefix, lpad(seq_val::text, 3, '0'));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create trigger
  pgm.sql(`
    CREATE TRIGGER trg_generate_machine_id
    BEFORE INSERT ON machines
    FOR EACH ROW
    EXECUTE FUNCTION generate_machine_id();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(
    `DROP TRIGGER IF EXISTS trg_generate_machine_id ON machines;`
  );
  pgm.sql(
    `DROP FUNCTION IF EXISTS generate_machine_id;`
  );
  pgm.dropTable("machines");
  pgm.dropSequence("seq_h");
  pgm.dropSequence("seq_l");
  pgm.dropSequence("seq_m");
  pgm.dropType("machine_perform");
  pgm.dropType("status");
};

