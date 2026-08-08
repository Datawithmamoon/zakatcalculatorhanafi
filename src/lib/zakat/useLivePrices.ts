import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLivePrices } from "@/lib/prices.functions";
import type { LivePrices } from "@/lib/prices.types";

const CACHE_KEY = "zakat-live-prices-v1";

function readCache(): LivePrices | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as LivePrices) : null;
  } catch {
    return null;
  }
}

function writeCache(p: LivePrices) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable */
  }
}

export interface LivePriceState {
  /** Price of one gram of pure metal in the reporting currency. */
  goldPerGram: number | null;
  silverPerGram: number | null;
  currency: string;
  fetchedAt: string | null;
  source: string;
  sourceUrl: string;
  /** True when the network call failed and cached values are being shown. */
  stale: boolean;
  error: string | null;
  loading: boolean;
  refresh: () => void;
}

/**
 * Live spot prices converted into the app's reporting currency.
 * Falls back to the last cached response so a failing API never produces
 * wrong numbers — it produces the previous known-good ones plus a warning.
 */
export function useLivePrices(opts: {
  currency: string;
  autoRefresh: boolean;
  intervalMinutes: number;
}): LivePriceState {
  const [cache, setCache] = useState<LivePrices | null>(null);
  useEffect(() => setCache(readCache()), []);

  const query = useQuery({
    queryKey: ["live-prices"],
    queryFn: async () => {
      const data = (await getLivePrices()) as LivePrices;
      writeCache(data);
      setCache(data);
      return data;
    },
    staleTime: Math.max(1, opts.intervalMinutes) * 60 * 1000,
    refetchInterval: opts.autoRefresh ? Math.max(1, opts.intervalMinutes) * 60 * 1000 : false,
    refetchOnWindowFocus: opts.autoRefresh,
    retry: 1,
  });

  const data = query.data ?? cache;
  const refresh = useCallback(() => void query.refetch(), [query]);

  return useMemo<LivePriceState>(() => {
    const rate = data ? (data.rates[opts.currency] ?? (opts.currency === "USD" ? 1 : null)) : null;
    const usable = data && rate && rate > 0;
    return {
      goldPerGram: usable ? data.goldUsdPerGram * rate : null,
      silverPerGram: usable ? data.silverUsdPerGram * rate : null,
      currency: opts.currency,
      fetchedAt: data?.fetchedAt ?? null,
      source: data?.metalSource ?? "gold-api.com (live spot)",
      sourceUrl: data?.metalSourceUrl ?? "https://api.gold-api.com",
      stale: Boolean(query.isError && data),
      error: query.isError
        ? data
          ? "live-failed-cached"
          : "live-failed"
        : data && !usable
          ? "no-rate"
          : null,
      loading: query.isFetching,
      refresh,
    };
  }, [data, opts.currency, query.isError, query.isFetching, refresh]);
}
