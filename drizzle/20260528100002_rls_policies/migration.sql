-- RLS policies (mirrors lib/db/schema.ts). Requires auth.uid() via db.rls().

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "profiles select own" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "id");
--> statement-breakpoint
CREATE POLICY "profiles update own" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "id") WITH CHECK ((select auth.uid()) = "id");
--> statement-breakpoint
CREATE POLICY "profiles insert auth admin" ON "profiles" AS PERMISSIVE FOR INSERT TO "supabase_auth_admin" WITH CHECK (true);

--> statement-breakpoint
ALTER TABLE "snippets" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "snippets select own" ON "snippets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "snippets insert own" ON "snippets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "snippets update own" ON "snippets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "snippets delete own" ON "snippets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_id");

--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "projects select own" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "projects insert own" ON "projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "projects update own" ON "projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "projects delete own" ON "projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_id");

--> statement-breakpoint
ALTER TABLE "checklists" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "checklists select own" ON "checklists" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "checklists insert own" ON "checklists" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "checklists update own" ON "checklists" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "checklists delete own" ON "checklists" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_id");

--> statement-breakpoint
ALTER TABLE "checklist_items" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "checklist_items select own" ON "checklist_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
  SELECT 1 FROM "checklists"
  WHERE "checklists"."id" = "checklist_items"."checklist_id"
  AND "checklists"."user_id" = (select auth.uid())
));
--> statement-breakpoint
CREATE POLICY "checklist_items insert own" ON "checklist_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
  SELECT 1 FROM "checklists"
  WHERE "checklists"."id" = "checklist_items"."checklist_id"
  AND "checklists"."user_id" = (select auth.uid())
));
--> statement-breakpoint
CREATE POLICY "checklist_items update own" ON "checklist_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
  SELECT 1 FROM "checklists"
  WHERE "checklists"."id" = "checklist_items"."checklist_id"
  AND "checklists"."user_id" = (select auth.uid())
)) WITH CHECK (EXISTS (
  SELECT 1 FROM "checklists"
  WHERE "checklists"."id" = "checklist_items"."checklist_id"
  AND "checklists"."user_id" = (select auth.uid())
));
--> statement-breakpoint
CREATE POLICY "checklist_items delete own" ON "checklist_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
  SELECT 1 FROM "checklists"
  WHERE "checklists"."id" = "checklist_items"."checklist_id"
  AND "checklists"."user_id" = (select auth.uid())
));

--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "notes select own" ON "notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "notes insert own" ON "notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "notes update own" ON "notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_id") WITH CHECK ((select auth.uid()) = "user_id");
--> statement-breakpoint
CREATE POLICY "notes delete own" ON "notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_id");

--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.snippets TO authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notes TO authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.checklists TO authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.checklist_items TO authenticated;
