/**
 * Mirath / Faraid — Islamic inheritance distribution (Hanafi).
 *
 * Covers the common family cases: spouse, children, parents, grandparents and
 * full siblings, including 'Awl (proportional reduction when the fixed shares
 * exceed the estate) and Radd (return of the residue to the sharers when there
 * is no residuary heir). Grandchildren, half-siblings, uncles and more distant
 * relatives, as well as bequests beyond one third, need a qualified Mufti.
 */
export interface HeirsInput {
  /** Net estate after funeral costs, debts and a valid bequest (max 1/3). */
  estate: number;
  spouse: "none" | "husband" | "wife";
  /** Number of wives (a man may leave up to four); they share one portion. */
  wives: number;
  sons: number;
  daughters: number;
  father: boolean;
  mother: boolean;
  /** Paternal grandfather — inherits in place of an absent father. */
  paternalGrandfather: boolean;
  /** Grandmother(s) — inherit 1/6 between them when the mother is absent. */
  grandmothers: number;
  fullBrothers: number;
  fullSisters: number;
}

export interface HeirShare {
  key: string;
  /** Number of people sharing this portion. */
  count: number;
  /** Fraction of the estate this group receives in total. */
  fraction: number;
  amount: number;
  /** Each individual's amount within the group. */
  perPerson: number;
  basis: "fixed" | "residue" | "radd";
  note?: string;
}

export interface InheritanceResult {
  estate: number;
  shares: HeirShare[];
  /** Sum of the fixed shares before 'Awl was applied. */
  fixedTotal: number;
  awlApplied: boolean;
  raddApplied: boolean;
  distributed: number;
  unassigned: number;
  warnings: string[];
}

const int = (n: unknown): number => {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export function calculateInheritance(input: HeirsInput): InheritanceResult {
  const estate = Number.isFinite(input.estate) && input.estate > 0 ? input.estate : 0;
  const sons = int(input.sons);
  const daughters = int(input.daughters);
  const fullBrothers = int(input.fullBrothers);
  const fullSisters = int(input.fullSisters);
  const grandmothers = int(input.grandmothers);
  const wives = input.spouse === "wife" ? Math.min(4, Math.max(1, int(input.wives) || 1)) : 0;
  const warnings: string[] = [];

  const hasChild = sons > 0 || daughters > 0;
  const father = input.father;
  // The grandfather only inherits when the father is absent.
  const grandfather = !father && input.paternalGrandfather;
  const mother = input.mother;
  // A grandmother is excluded by the mother (and the paternal one by the father).
  const grandmotherShares = !mother && grandmothers > 0;
  // Siblings are excluded by a son, the father or the grandfather.
  const siblingsBlocked = sons > 0 || father || grandfather;
  const siblingCount = siblingsBlocked ? 0 : fullBrothers + fullSisters;

  interface Draft extends Omit<HeirShare, "amount" | "perPerson"> {}
  const fixed: Draft[] = [];

  // ---- Fixed (Quranic) shares -------------------------------------------
  if (input.spouse === "husband") {
    fixed.push({ key: "husband", count: 1, fraction: hasChild ? 1 / 4 : 1 / 2, basis: "fixed" });
  } else if (wives > 0) {
    fixed.push({ key: "wife", count: wives, fraction: hasChild ? 1 / 8 : 1 / 4, basis: "fixed" });
  }

  if (mother) {
    // 1/6 with a child or with two or more siblings, otherwise 1/3.
    const siblingsForMother = siblingsBlocked
      ? fullBrothers + fullSisters // still count for exclusion purposes
      : fullBrothers + fullSisters;
    const sixth = hasChild || siblingsForMother >= 2;
    fixed.push({ key: "mother", count: 1, fraction: sixth ? 1 / 6 : 1 / 3, basis: "fixed" });
  } else if (grandmotherShares) {
    fixed.push({ key: "grandmother", count: grandmothers, fraction: 1 / 6, basis: "fixed" });
  }

  const ascendant = father ? "father" : grandfather ? "grandfather" : null;
  if (ascendant) {
    // With a son the ascendant takes 1/6 only; with daughters only he takes
    // 1/6 plus the residue; with no descendants he is a pure residuary.
    if (sons > 0) fixed.push({ key: ascendant, count: 1, fraction: 1 / 6, basis: "fixed" });
    else if (daughters > 0) fixed.push({ key: ascendant, count: 1, fraction: 1 / 6, basis: "fixed" });
  }

  if (sons === 0 && daughters > 0) {
    fixed.push({
      key: "daughters",
      count: daughters,
      fraction: daughters === 1 ? 1 / 2 : 2 / 3,
      basis: "fixed",
    });
  }

  // Sisters take a fixed share only when there are no daughters and no brothers.
  const sistersAsResiduary = !siblingsBlocked && fullSisters > 0 && (fullBrothers > 0 || daughters > 0);
  if (!siblingsBlocked && fullSisters > 0 && !sistersAsResiduary) {
    fixed.push({
      key: "fullSisters",
      count: fullSisters,
      fraction: fullSisters === 1 ? 1 / 2 : 2 / 3,
      basis: "fixed",
    });
  }

  const fixedTotal = fixed.reduce((a, s) => a + s.fraction, 0);

  // ---- Residuaries ('asaba) ---------------------------------------------
  // Ordered strength: children, then father/grandfather, then full siblings.
  type Residuary = { key: string; count: number; weight: number };
  const residuaries: Residuary[] = [];
  if (sons > 0) {
    residuaries.push({ key: "sons", count: sons, weight: sons * 2 });
    if (daughters > 0) residuaries.push({ key: "daughters", count: daughters, weight: daughters });
  } else if (ascendant && daughters === 0) {
    residuaries.push({ key: ascendant, count: 1, weight: 1 });
  } else if (ascendant && daughters > 0) {
    residuaries.push({ key: ascendant, count: 1, weight: 1 });
  } else if (!siblingsBlocked && fullBrothers > 0) {
    residuaries.push({ key: "fullBrothers", count: fullBrothers, weight: fullBrothers * 2 });
    if (fullSisters > 0)
      residuaries.push({ key: "fullSisters", count: fullSisters, weight: fullSisters });
  } else if (sistersAsResiduary && fullSisters > 0) {
    // 'Asaba ma'a al-ghayr: sisters take the residue alongside daughters.
    residuaries.push({ key: "fullSisters", count: fullSisters, weight: fullSisters });
  }

  let awlApplied = false;
  let raddApplied = false;
  const map = new Map<string, HeirShare>();

  const addShare = (key: string, count: number, fraction: number, basis: HeirShare["basis"]) => {
    const existing = map.get(key);
    const total = (existing?.fraction ?? 0) + fraction;
    map.set(key, {
      key,
      count,
      fraction: total,
      amount: total * estate,
      perPerson: count > 0 ? (total * estate) / count : 0,
      basis: existing && existing.basis !== basis ? "fixed" : basis,
    });
  };

  if (fixedTotal > 1) {
    // 'Awl — every fixed share is scaled down proportionally.
    awlApplied = true;
    for (const s of fixed) addShare(s.key, s.count, s.fraction / fixedTotal, "fixed");
  } else {
    for (const s of fixed) addShare(s.key, s.count, s.fraction, "fixed");
    const residue = 1 - fixedTotal;
    if (residue > 1e-9) {
      const weightTotal = residuaries.reduce((a, r) => a + r.weight, 0);
      if (weightTotal > 0) {
        for (const r of residuaries) addShare(r.key, r.count, (residue * r.weight) / weightTotal, "residue");
      } else {
        // Radd — the residue returns to the sharers, except the spouse.
        const eligible = fixed.filter((s) => s.key !== "husband" && s.key !== "wife");
        const base = eligible.reduce((a, s) => a + s.fraction, 0);
        if (base > 0) {
          raddApplied = true;
          for (const s of eligible) addShare(s.key, s.count, (residue * s.fraction) / base, "radd");
        }
      }
    }
  }

  const shares = [...map.values()].filter((s) => s.fraction > 1e-9);
  const distributed = shares.reduce((a, s) => a + s.amount, 0);

  if (shares.length === 0)
    warnings.push("no-heirs");
  if (awlApplied) warnings.push("awl");
  if (raddApplied) warnings.push("radd");
  if (siblingsBlocked && fullBrothers + fullSisters > 0) warnings.push("siblings-excluded");
  if (!mother && grandmothers > 0 && !grandmotherShares) warnings.push("grandmother-excluded");

  return {
    estate,
    shares,
    fixedTotal,
    awlApplied,
    raddApplied,
    distributed,
    unassigned: Math.max(0, estate - distributed),
    warnings,
  };
}

export const emptyHeirs = (): HeirsInput => ({
  estate: 0,
  spouse: "none",
  wives: 1,
  sons: 0,
  daughters: 0,
  father: false,
  mother: false,
  paternalGrandfather: false,
  grandmothers: 0,
  fullBrothers: 0,
  fullSisters: 0,
});
