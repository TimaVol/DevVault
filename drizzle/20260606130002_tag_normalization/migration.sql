-- Normalize snippet tags and project tech stacks from arrays into junction tables.
-- Existing array data is migrated before the old columns are dropped.

--> statement-breakpoint
CREATE TABLE "snippet_tags" (
  "snippet_id" UUID NOT NULL REFERENCES "snippets"("id") ON DELETE CASCADE,
  "tag"        TEXT NOT NULL,
  PRIMARY KEY ("snippet_id", "tag")
);
--> statement-breakpoint
CREATE INDEX "snippet_tags_tag_idx" ON "snippet_tags" ("tag");

--> statement-breakpoint
CREATE TABLE "project_tech_stack" (
  "project_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "tech"       TEXT NOT NULL,
  PRIMARY KEY ("project_id", "tech")
);
--> statement-breakpoint
CREATE INDEX "project_tech_stack_tech_idx" ON "project_tech_stack" ("tech");

-- Migrate existing array data (skip NULLs and empty strings)
--> statement-breakpoint
INSERT INTO "snippet_tags" ("snippet_id", "tag")
  SELECT id, unnest(tags)
  FROM "snippets"
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
ON CONFLICT DO NOTHING;

--> statement-breakpoint
INSERT INTO "project_tech_stack" ("project_id", "tech")
  SELECT id, unnest(tech_stack)
  FROM "projects"
  WHERE tech_stack IS NOT NULL AND array_length(tech_stack, 1) > 0
ON CONFLICT DO NOTHING;

-- Drop old array columns now that data is migrated
--> statement-breakpoint
ALTER TABLE "snippets" DROP COLUMN "tags";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "tech_stack";

-- RLS
--> statement-breakpoint
ALTER TABLE "snippet_tags" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "snippet_tags select own" ON "snippet_tags"
  AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (EXISTS (
    SELECT 1 FROM "snippets"
    WHERE "snippets"."id" = "snippet_id"
      AND "snippets"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
CREATE POLICY "snippet_tags insert own" ON "snippet_tags"
  AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (EXISTS (
    SELECT 1 FROM "snippets"
    WHERE "snippets"."id" = "snippet_id"
      AND "snippets"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
CREATE POLICY "snippet_tags delete own" ON "snippet_tags"
  AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (EXISTS (
    SELECT 1 FROM "snippets"
    WHERE "snippets"."id" = "snippet_id"
      AND "snippets"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
GRANT SELECT, INSERT, DELETE ON TABLE public.snippet_tags TO authenticated;

--> statement-breakpoint
ALTER TABLE "project_tech_stack" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "project_tech_stack select own" ON "project_tech_stack"
  AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (EXISTS (
    SELECT 1 FROM "projects"
    WHERE "projects"."id" = "project_id"
      AND "projects"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
CREATE POLICY "project_tech_stack insert own" ON "project_tech_stack"
  AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (EXISTS (
    SELECT 1 FROM "projects"
    WHERE "projects"."id" = "project_id"
      AND "projects"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
CREATE POLICY "project_tech_stack delete own" ON "project_tech_stack"
  AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (EXISTS (
    SELECT 1 FROM "projects"
    WHERE "projects"."id" = "project_id"
      AND "projects"."user_id" = (SELECT auth.uid())
  ));
--> statement-breakpoint
GRANT SELECT, INSERT, DELETE ON TABLE public.project_tech_stack TO authenticated;
