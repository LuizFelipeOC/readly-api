/* src/db/migrations/<timestamp>_create_profiles_and_trigger.js */
exports.up = (pgm) => {
    pgm.sql(`
    CREATE TABLE IF NOT EXISTS public.profiles (
      id uuid PRIMARY KEY,
      firstName text,
      lastName text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

    pgm.sql(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, firstName, lastName, created_at, updated_at)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
        COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
        now(),
        now()
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

    // ensure trigger is created (DROP IF EXISTS then CREATE for compatibility)
    pgm.sql(`
      DROP TRIGGER IF EXISTS auth_user_created ON auth.users;

      CREATE TRIGGER auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_new_user();
    `);
};

exports.down = (pgm) => {
    pgm.sql(`DROP TRIGGER IF EXISTS auth_user_created ON auth.users;`);
    pgm.sql(`DROP FUNCTION IF EXISTS public.handle_new_user();`);
    pgm.sql(`DROP TABLE IF EXISTS public.profiles;`);
};