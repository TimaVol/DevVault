-- Add deleted_at to all primary user-owned tables.
-- NULL = live row; non-NULL = soft-deleted.
--> statement-breakpoint
ALTER TABLE "snippets"   ADD COLUMN "deleted_at" TIMESTAMPTZ;
--> statement-breakpoint
ALTER TABLE "projects"   ADD COLUMN "deleted_at" TIMESTAMPTZ;
--> statement-breakpoint
ALTER TABLE "checklists" ADD COLUMN "deleted_at" TIMESTAMPTZ;
--> statement-breakpoint
ALTER TABLE "notes"      ADD COLUMN "deleted_at" TIMESTAMPTZ;
