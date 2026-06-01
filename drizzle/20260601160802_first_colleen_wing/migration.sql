ALTER TABLE "profiles" RENAME CONSTRAINT "profiles_id_fk" TO "profiles_id_users_id_fkey";--> statement-breakpoint
ALTER POLICY "checklist_items select own" ON "checklist_items" TO "authenticated" USING (exists (
      select 1 from "checklists"
      where "checklists"."id" = "checklist_items"."checklist_id"
      and "checklists"."user_id" = (select auth.uid())
    ));--> statement-breakpoint
ALTER POLICY "checklist_items insert own" ON "checklist_items" TO "authenticated" WITH CHECK (exists (
      select 1 from "checklists"
      where "checklists"."id" = "checklist_items"."checklist_id"
      and "checklists"."user_id" = (select auth.uid())
    ));--> statement-breakpoint
ALTER POLICY "checklist_items update own" ON "checklist_items" TO "authenticated" USING (exists (
      select 1 from "checklists"
      where "checklists"."id" = "checklist_items"."checklist_id"
      and "checklists"."user_id" = (select auth.uid())
    )) WITH CHECK (exists (
      select 1 from "checklists"
      where "checklists"."id" = "checklist_items"."checklist_id"
      and "checklists"."user_id" = (select auth.uid())
    ));--> statement-breakpoint
ALTER POLICY "checklist_items delete own" ON "checklist_items" TO "authenticated" USING (exists (
      select 1 from "checklists"
      where "checklists"."id" = "checklist_items"."checklist_id"
      and "checklists"."user_id" = (select auth.uid())
    ));