"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UrlFilterConfig<T extends Record<string, string>> = {
  defaults: T;
};

type SetFilterOptions = {
  resetPage?: boolean;
};

function applyFilter<T extends Record<string, string>>(
  params: URLSearchParams,
  defaults: T,
  key: keyof T,
  value: T[keyof T],
) {
  const defaultValue = defaults[key];

  if (value === defaultValue || value === "") {
    params.delete(String(key));
  } else {
    params.set(String(key), value);
  }
}

function resetPage<T extends Record<string, string>>(
  params: URLSearchParams,
  defaults: T,
) {
  if ("page" in defaults) {
    params.delete("page");
  }
}

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

  const replaceParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K], options?: SetFilterOptions) => {
      const params = new URLSearchParams(searchParams.toString());
      applyFilter(params, defaults, key, value);
      if (options?.resetPage) {
        resetPage(params, defaults);
      }
      replaceParams(params);
    },
    [defaults, replaceParams, searchParams],
  );

  return [filters, setFilter] as const;
}
