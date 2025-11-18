import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schemaPath = join(process.cwd(), "supabase", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");

describe("Supabase schema", () => {
  it("includes all required tables", () => {
  expect(schema).toContain("create table if not exists visibletoai_businesses");
  expect(schema).toContain("create table if not exists visibletoai_assets");
  expect(schema).toContain("create table if not exists visibletoai_public_pages");
  expect(schema).toContain("create table if not exists visibletoai_index_events");
  });
});

