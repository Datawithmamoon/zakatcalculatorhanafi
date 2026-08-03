import { createServerFn } from "@tanstack/react-start";
import { fetchLivePrices } from "./prices.server";

/** Public: live gold/silver spot prices and USD exchange rates, no auth required. */
export const getLivePrices = createServerFn({ method: "GET" }).handler(async () => {
  return await fetchLivePrices();
});
