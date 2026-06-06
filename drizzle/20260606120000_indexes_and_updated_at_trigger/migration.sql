-- Indexes on foreign keys and common query columns
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "snippets_user_id_idx" ON "snippets" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "snippets_created_at_idx" ON "snippets" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "snippets_is_pinned_idx" ON "snippets" ("is_pinned");

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_user_id_idx" ON "projects" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "projects" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" ("status");

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "checklists_user_id_idx" ON "checklists" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "checklists_created_at_idx" ON "checklists" ("created_at");

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "checklist_items_checklist_id_idx" ON "checklist_items" ("checklist_id");
--> statement-breakpoint
ALTER TABLE "checklist_items"
  ADD CONSTRAINT "checklist_items_checklist_id_position_unique" UNIQUE ("checklist_id", "position");

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_user_id_idx" ON "notes" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_created_at_idx" ON "notes" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_is_pinned_idx" ON "notes" ("is_pinned");

-- updatedAt trigger: automatically keeps updated_at current on every UPDATE
--> statement-breakpoint
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON "profiles"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--> statement-breakpoint
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON "snippets"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--> statement-breakpoint
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON "projects"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--> statement-breakpoint
CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON "checklists"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--> statement-breakpoint
CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON "checklist_items"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--> statement-breakpoint
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON "notes"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
