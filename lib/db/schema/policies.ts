import { sql, type SQL } from "drizzle-orm";
import {
  pgPolicy,
  type AnyPgColumn,
  type PgTable,
} from "drizzle-orm/pg-core";
import {
  authenticatedRole,
  supabaseAuthAdminRole,
} from "drizzle-orm/supabase";

export function authenticatedOwnRowPolicies(
  tableLabel: string,
  userIdColumn: AnyPgColumn,
  options?: { skipInsert?: boolean },
) {
  const ownsRow = sql`(select auth.uid()) = ${userIdColumn}`;

  const policies = [
    pgPolicy(`${tableLabel} select own`, {
      for: "select",
      to: authenticatedRole,
      using: ownsRow,
    }),
  ];

  if (!options?.skipInsert) {
    policies.push(
      pgPolicy(`${tableLabel} insert own`, {
        for: "insert",
        to: authenticatedRole,
        withCheck: ownsRow,
      }),
    );
  }

  policies.push(
    pgPolicy(`${tableLabel} update own`, {
      for: "update",
      to: authenticatedRole,
      using: ownsRow,
      withCheck: ownsRow,
    }),
    pgPolicy(`${tableLabel} delete own`, {
      for: "delete",
      to: authenticatedRole,
      using: ownsRow,
    }),
  );

  return policies;
}

export function profilePolicies(idColumn: AnyPgColumn) {
  const ownsRow = sql`(select auth.uid()) = ${idColumn}`;

  return [
    pgPolicy("profiles select own", {
      for: "select",
      to: authenticatedRole,
      using: ownsRow,
    }),
    pgPolicy("profiles update own", {
      for: "update",
      to: authenticatedRole,
      using: ownsRow,
      withCheck: ownsRow,
    }),
    pgPolicy("profiles insert auth admin", {
      for: "insert",
      to: supabaseAuthAdminRole,
      withCheck: sql`true`,
    }),
  ];
}

export function authenticatedViaParentPolicies(
  tableLabel: string,
  ownershipCondition: SQL,
  options?: { update?: boolean },
) {
  const policies = [
    pgPolicy(`${tableLabel} select own`, {
      for: "select",
      to: authenticatedRole,
      using: ownershipCondition,
    }),
    pgPolicy(`${tableLabel} insert own`, {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownershipCondition,
    }),
  ];

  if (options?.update) {
    policies.push(
      pgPolicy(`${tableLabel} update own`, {
        for: "update",
        to: authenticatedRole,
        using: ownershipCondition,
        withCheck: ownershipCondition,
      }),
    );
  }

  policies.push(
    pgPolicy(`${tableLabel} delete own`, {
      for: "delete",
      to: authenticatedRole,
      using: ownershipCondition,
    }),
  );

  return policies;
}

export function ownsViaParent(
  parentTable: PgTable,
  parentIdColumn: AnyPgColumn,
  childFkColumn: AnyPgColumn,
  parentUserIdColumn: AnyPgColumn,
) {
  return sql`exists (
      select 1 from ${parentTable}
      where ${parentIdColumn} = ${childFkColumn}
      and ${parentUserIdColumn} = (select auth.uid())
    )`;
}
