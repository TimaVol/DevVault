"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UrlFilterConfig<T extends Record<string, string>> = {
  defaults: T;
};

export function useUrlFilters<T extends Record<string, string>>({
  defaults,
}: UrlFilterConfig<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const value = searchParams.get(String(key));
      if (value !== null) {
        result[key] = value as T[keyof T];
      }
    }
    return result;
  }, [defaults, searchParams]);

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const params = new URLSearchParams(searchParams.toString());
      const defaultValue = defaults[key];

      if (value === defaultValue || value === "") {
        params.delete(String(key));
      } else {
        params.set(String(key), value);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [defaults, pathname, router, searchParams],
  );

  return [filters, setFilter] as const;
}
