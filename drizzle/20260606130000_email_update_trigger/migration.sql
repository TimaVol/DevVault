-- Sync email changes from auth.users → profiles when a user updates their email.
-- The existing on_auth_user_created trigger covers INSERT only; this covers UPDATE.
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles
    SET email = NEW.email, updated_at = now()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

--> statement-breakpoint
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;

--> statement-breakpoint
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_update();

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.handle_user_email_update() TO supabase_auth_admin;
