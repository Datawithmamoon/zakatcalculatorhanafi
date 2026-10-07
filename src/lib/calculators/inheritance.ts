/**
 * Mirath / Faraid — Islamic inheritance distribution (Hanafi).
 *
 * Exact rational arithmetic throughout (no floating-point in the shares).
 * Covers: spouses, children, son's children, parents, grandparents, full /
 * consanguine (paternal) / uterine (maternal) siblings, the full 'asaba order
 * down to the full paternal uncle's son, Hajb (with reasons), Asl al-mas'alah,
 * 'Awl, Radd (spouse excluded), Kasr & Tashih, Kalalah detection, Dhawu
 * al-arham (four classes), optional Muqasamah (Sahibain view), and helper
 * workflows for Haml, Mafqud / captive, Takharuj and Munasakhat.
 */

// ---------------------------------------------------------------- fractions
export interface Frac {
  n: number;
  d: number;
}
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
export const F = (n: number, d = 1): Frac => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};
export const fAdd = (a: Frac, b: Frac) => F(a.n * b.d + b.n * a.d, a.d * b.d);
export const fSub = (a: Frac, b: Frac) => F(a.n * b.d - b.n * a.d, a.d * b.d);
export const fMul = (a: Frac, b: Frac) => F(a.n * b.n, a.d * b.d);
export const fDiv = (a: Frac, b: Frac) => F(a.n * b.d, a.d * b.n);
export const fCmp = (a: Frac, b: Frac) => a.n * b.d - b.n * a.d;
export const fNum = (a: Frac) => a.n / a.d;
export const fStr = (a: Frac) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
const ZERO = F(0);
const ONE = F(1);
const fSum = (xs: Frac[]) => xs.reduce(fAdd, ZERO);

// ---------------------------------------------------------------- types
export interface HeirsInput {
  /** Net estate after funeral costs, debts and a valid bequest (max 1/3). */
  estate: number;
  spouse: "none" | "husband" | "wife";
  /** Number of wives (up to four); they share one portion. */
  wives: number;
  sons: number;
  daughters: number;
  father: boolean;
  mother: boolean;
  /** Paternal grandfather — inherits in place of an absent father. */
  paternalGrandfather: boolean;
  /** Legacy: number of grandmothers (used when the two flags below are unset). */
  grandmothers: number;
  fullBrothers: number;
  fullSisters: number;
  // ---- extended heirs (all optional) ----
  paternalGrandmother?: boolean;
  maternalGrandmother?: boolean;
  sonsSons?: number;
  sonsDaughters?: number;
  consanguineBrothers?: number;
  consanguineSisters?: number;
  uterineBrothers?: number;
  uterineSisters?: number;
  fullNephews?: number;
  consanguineNephews?: number;
  fullUncles?: number;
  consanguineUncles?: number;
  fullCousins?: number;
  // ---- dhawu al-arham ----
  daughtersSons?: number;
  daughtersDaughters?: number;
  maternalGrandfather?: boolean;
  sistersSons?: number;
  sistersDaughters?: number;
  brothersDaughters?: number;
  paternalAunts?: number;
  maternalUncles?: number;
  maternalAunts?: number;
  // ---- options ----
  /** Relatives who died in the same accident with unknown order (do not inherit). */
  diedTogether?: Partial<Record<string, number>>;
  /** Apply Muqasamah between grandfather and siblings (Sahibain view). */
  muqasamah?: boolean;
}

export type Basis = "fixed" | "residue" | "radd" | "dhawu";

export interface HeirShare {
  key: string;
  count: number;
  /** Fraction of the estate (decimal, for display/back-compat). */
  fraction: number;
  /** Exact fraction of the estate. */
  exact: Frac;
  amount: number;
  perPerson: number;
  basis: Basis;
  /** Fard label e.g. "1/6", "asaba", "1/6+asaba", "radd". */
  fard: string;
  /** Sahm in the base (or 'awl/radd) mas'alah, when an integer. */
  sahm: number | null;
  /** Group sahm in the corrected (tashih) mas'alah. */
  finalSahm: number;
  perPersonSahm: number;
  note?: string;
}

export interface ExcludedHeir {
  key: string;
  count: number;
  reason: string;
}

export interface AffectedHeir {
  key: string;
  reason: string;
}

export interface InheritanceResult {
  estate: number;
  shares: HeirShare[];
  excluded: ExcludedHeir[];
  affected: AffectedHeir[];
  /** Sum of the fixed shares before 'Awl (decimal). */
  fixedTotal: number;
  fixedTotalExact: Frac;
  awlApplied: boolean;
  raddApplied: boolean;
  dhawuApplied: boolean;
  muqasamahApplied: boolean;
  kalalah: boolean;
  asl: number;
  /** Mas'alah after 'Awl or Radd (equals asl otherwise). */
  aslAfter: number;
  /** Corrected mas'alah after Tashih. */
  tashihAsl: number;
  kasr: boolean;
  residueSahm: number | null;
  distributed: number;
  unassigned: number;
  unassignedExact: Frac;
  warnings: string[];
}

const int = (n: unknown): number => {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

interface Draft {
  key: string;
  count: number;
  share: Frac;
  basis: Basis;
  fard: string;
  note?: string;
}
interface Unit {
  key: string;
  count: number;
  weight: number; // per head
}

// ---------------------------------------------------------------- engine
export function calculateInheritance(input: HeirsInput): InheritanceResult {
  const estate = Number.isFinite(input.estate) && input.estate > 0 ? input.estate : 0;
  const dt = input.diedTogether ?? {};
  const excluded: ExcludedHeir[] = [];
  const affected: AffectedHeir[] = [];
  const warnings: string[] = [];

  const n = (k: keyof HeirsInput) => {
    const raw = int(input[k]);
    const died = Math.min(raw, int(dt[k as string]));
    if (died > 0) excluded.push({ key: k as string, count: died, reason: "diedTogether" });
    return raw - died;
  };
  const flag = (k: keyof HeirsInput) => {
    if (!input[k]) return false;
    if (int(dt[k as string]) > 0) {
      excluded.push({ key: k as string, count: 1, reason: "diedTogether" });
      return false;
    }
    return true;
  };
  const exclude = (key: string, count: number, reason: string) => {
    if (count > 0) excluded.push({ key, count, reason });
  };

  // ---- people
  let spouse = input.spouse;
  let wives = spouse === "wife" ? Math.min(4, Math.max(1, int(input.wives) || 1)) : 0;
  if (spouse === "wife" && int(dt.wife) > 0) {
    const d = Math.min(wives, int(dt.wife));
    exclude("wife", d, "diedTogether");
    wives -= d;
    if (wives === 0) spouse = "none";
  }
  if (spouse === "husband" && int(dt.husband) > 0) {
    exclude("husband", 1, "diedTogether");
    spouse = "none";
  }
  const sons = n("sons");
  const daughters = n("daughters");
  let ss = n("sonsSons");
  let sd = n("sonsDaughters");
  const fatherP = flag("father");
  const motherP = flag("mother");
  const pgfP = flag("paternalGrandfather");
  const legacyGM = input.paternalGrandmother === undefined && input.maternalGrandmother === undefined;
  const mgmP = legacyGM ? int(input.grandmothers) >= 1 : flag("maternalGrandmother");
  const pgmP = legacyGM ? int(input.grandmothers) >= 2 : flag("paternalGrandmother");
  let fb = n("fullBrothers");
  let fs = n("fullSisters");
  let cb = n("consanguineBrothers");
  let cs = n("consanguineSisters");
  let ub = n("uterineBrothers");
  let us = n("uterineSisters");
  const nephF = n("fullNephews");
  const nephC = n("consanguineNephews");
  const uncF = n("fullUncles");
  const uncC = n("consanguineUncles");
  const cous = n("fullCousins");

  // Mother's reduction counts all siblings, even blocked ones.
  const siblingTotal = fb + fs + cb + cs + ub + us;

  // ---- descendants
  if (sons > 0) {
    exclude("sonsSons", ss, "blockedBySon");
    exclude("sonsDaughters", sd, "blockedBySon");
    ss = 0;
    sd = 0;
  } else if (daughters >= 2 && ss === 0 && sd > 0) {
    exclude("sonsDaughters", sd, "blockedByTwoDaughters");
    sd = 0;
  }
  const maleDesc = sons > 0 || ss > 0;
  const femaleDesc = daughters > 0 || sd > 0;
  const anyDesc = maleDesc || femaleDesc;

  // ---- ascendants
  const father = fatherP;
  const grandfather = !father && pgfP;
  if (father && pgfP) exclude("paternalGrandfather", 1, "blockedByFather");
  const asc = father ? "father" : grandfather ? "grandfather" : null;
  const mother = motherP;

  const muq = !!input.muqasamah && grandfather && !maleDesc && fb + fs + cb + cs > 0;

  // ---- full & consanguine sibling blocking
  const sibBlockReason = maleDesc
    ? sons > 0
      ? "blockedBySon"
      : "blockedBySonsSon"
    : father
      ? "blockedByFather"
      : grandfather && !muq
        ? "blockedByGrandfather"
        : null;
  if (sibBlockReason) {
    exclude("fullBrothers", fb, sibBlockReason);
    exclude("fullSisters", fs, sibBlockReason);
    exclude("consanguineBrothers", cb, sibBlockReason);
    exclude("consanguineSisters", cs, sibBlockReason);
    fb = fs = cb = cs = 0;
    if (!maleDesc) warnings.push("siblings-excluded");
    else if (int(input.fullBrothers) + int(input.fullSisters) > 0) warnings.push("siblings-excluded");
  }
  if (sibBlockReason && !warnings.includes("siblings-excluded") && int(input.fullBrothers) + int(input.fullSisters) > 0)
    warnings.push("siblings-excluded");

  // ---- uterine siblings
  const uterBlock = anyDesc ? "blockedByDescendant" : asc ? (father ? "blockedByFather" : "blockedByGrandfather") : null;
  if (uterBlock) {
    exclude("uterineBrothers", ub, uterBlock);
    exclude("uterineSisters", us, uterBlock);
    ub = us = 0;
  }

  const fixed: Draft[] = [];
  const push = (key: string, count: number, share: Frac, fard: string, note?: string) =>
    fixed.push({ key, count, share, basis: "fixed", fard, note });

  // ---- spouse
  let spouseShare = ZERO;
  if (spouse === "husband") {
    spouseShare = anyDesc ? F(1, 4) : F(1, 2);
    push("husband", 1, spouseShare, fStr(spouseShare));
    if (anyDesc) affected.push({ key: "husband", reason: "reducedByDescendant" });
  } else if (wives > 0) {
    spouseShare = anyDesc ? F(1, 8) : F(1, 4);
    push("wife", wives, spouseShare, fStr(spouseShare));
    if (anyDesc) affected.push({ key: "wife", reason: "reducedByDescendant" });
  }

  // ---- mother / grandmothers
  if (mother) {
    if (anyDesc || siblingTotal >= 2) {
      push("mother", 1, F(1, 6), "1/6");
      affected.push({ key: "mother", reason: anyDesc ? "reducedByDescendant" : "reducedBySiblings" });
    } else if (spouse !== "none" && father) {
      // 'Umariyyatan: one third of what remains after the spouse.
      push("mother", 1, fDiv(fSub(ONE, spouseShare), F(3)), "1/3 باقی", "umariyya");
      affected.push({ key: "mother", reason: "umariyya" });
    } else push("mother", 1, F(1, 3), "1/3");
    exclude("maternalGrandmother", mgmP ? 1 : 0, "blockedByMother");
    exclude("paternalGrandmother", pgmP ? 1 : 0, "blockedByMother");
    if (int(input.grandmothers) > 0 && legacyGM) warnings.push("grandmother-excluded");
  } else {
    const pgmOk = pgmP && !father;
    if (pgmP && father) exclude("paternalGrandmother", 1, "blockedByFather");
    const c = (mgmP ? 1 : 0) + (pgmOk ? 1 : 0);
    if (c > 0) push("grandmother", c, F(1, 6), "1/6");
  }

  // ---- father / grandfather fixed sixth
  if (asc && !muq && anyDesc) push(asc, 1, F(1, 6), femaleDesc && !maleDesc ? "1/6+عصبہ" : "1/6");

  // ---- daughters / son's daughters
  if (sons === 0 && daughters > 0) push("daughters", daughters, daughters === 1 ? F(1, 2) : F(2, 3), daughters === 1 ? "1/2" : "2/3");
  if (sons === 0 && ss === 0 && sd > 0) {
    if (daughters === 1) {
      push("sonsDaughters", sd, F(1, 6), "1/6", "takmila");
      affected.push({ key: "sonsDaughters", reason: "takmila" });
    } else if (daughters === 0) push("sonsDaughters", sd, sd === 1 ? F(1, 2) : F(2, 3), sd === 1 ? "1/2" : "2/3");
  }

  // ---- uterine siblings
  if (ub + us > 0) {
    const tot = ub + us === 1 ? F(1, 6) : F(1, 3);
    const label = fStr(tot);
    if (ub > 0) push("uterineBrothers", ub, fMul(tot, F(ub, ub + us)), label, "equal");
    if (us > 0) push("uterineSisters", us, fMul(tot, F(us, ub + us)), label, "equal");
  }

  // ---- full sisters
  const fsMaalGhayr = !muq && fs > 0 && fb === 0 && femaleDesc;
  if (!muq && fs > 0 && fb === 0 && !femaleDesc) push("fullSisters", fs, fs === 1 ? F(1, 2) : F(2, 3), fs === 1 ? "1/2" : "2/3");

  // ---- consanguine siblings
  let csMaalGhayr = false;
  if (!muq && cb + cs > 0) {
    const blk = fb > 0 ? "blockedByFullBrother" : fsMaalGhayr ? "blockedByFullSisterAsaba" : null;
    if (blk) {
      exclude("consanguineBrothers", cb, blk);
      exclude("consanguineSisters", cs, blk);
      cb = cs = 0;
    } else if (cb === 0) {
      if (fs >= 2) {
        exclude("consanguineSisters", cs, "blockedByTwoFullSisters");
        cs = 0;
      } else if (femaleDesc) csMaalGhayr = true;
      else if (fs === 1) {
        push("consanguineSisters", cs, F(1, 6), "1/6", "takmila");
        affected.push({ key: "consanguineSisters", reason: "takmila" });
      } else push("consanguineSisters", cs, cs === 1 ? F(1, 2) : F(2, 3), cs === 1 ? "1/2" : "2/3");
    }
  }

  // ---- Muqasamah (grandfather with siblings, Sahibain view)
  let muqTier: Unit[] | null = null;
  if (muq) {
    const useFull = fb + fs > 0;
    if (useFull) {
      exclude("consanguineBrothers", cb, "blockedByFullSiblings");
      exclude("consanguineSisters", cs, "blockedByFullSiblings");
    }
    const bro = useFull ? fb : cb;
    const sis = useFull ? fs : cs;
    const units = 2 * bro + sis;
    const others = fSum(fixed.map((d) => d.share));
    const rem = fSub(ONE, others);
    const opts: Array<[Frac, string]> = [[fMul(rem, F(2, 2 + units)), "muqasamah"]];
    if (fixed.length === 0) opts.push([F(1, 3), "1/3"]);
    else opts.push([fDiv(rem, F(3)), "1/3 باقی"], [F(1, 6), "1/6"]);
    const best = opts.reduce((a, b) => (fCmp(b[0], a[0]) > 0 ? b : a));
    push("grandfather", 1, best[0], best[1], "muqasamah");
    muqTier = [];
    if (bro > 0) muqTier.push({ key: useFull ? "fullBrothers" : "consanguineBrothers", count: bro, weight: 2 });
    if (sis > 0) muqTier.push({ key: useFull ? "fullSisters" : "consanguineSisters", count: sis, weight: 1 });
  }

  // ---- 'asaba order
  const tiers: Unit[][] = [];
  const t = (...u: Unit[]) => tiers.push(u.filter((x) => x.count > 0));
  t({ key: "sons", count: sons, weight: 2 }, ...(sons > 0 ? [{ key: "daughters", count: daughters, weight: 1 }] : []));
  t({ key: "sonsSons", count: ss, weight: 2 }, ...(ss > 0 ? [{ key: "sonsDaughters", count: sd, weight: 1 }] : []));
  if (muqTier) tiers.push(muqTier);
  else t(...(asc && !maleDesc ? [{ key: asc, count: 1, weight: 1 }] : []));
  if (!muq) {
    t({ key: "fullBrothers", count: fb, weight: 2 }, ...(fb > 0 ? [{ key: "fullSisters", count: fs, weight: 1 }] : []));
    t(...(fsMaalGhayr ? [{ key: "fullSisters", count: fs, weight: 1 }] : []));
    t({ key: "consanguineBrothers", count: cb, weight: 2 }, ...(cb > 0 ? [{ key: "consanguineSisters", count: cs, weight: 1 }] : []));
    t(...(csMaalGhayr ? [{ key: "consanguineSisters", count: cs, weight: 1 }] : []));
  }
  t({ key: "fullNephews", count: nephF, weight: 1 });
  t({ key: "consanguineNephews", count: nephC, weight: 1 });
  t({ key: "fullUncles", count: uncF, weight: 1 });
  t({ key: "consanguineUncles", count: uncC, weight: 1 });
  t({ key: "fullCousins", count: cous, weight: 1 });

  const idx = tiers.findIndex((x) => x.length > 0);
  const residuaries = idx >= 0 ? tiers[idx] : [];
  if (idx >= 0) {
    for (const tier of tiers.slice(idx + 1))
      for (const u of tier) {
        if (fixed.some((d) => d.key === u.key)) continue;
        if (u.key === "father" || u.key === "grandfather") continue;
        exclude(u.key, u.count, "closerResiduary");
      }
  }

  // ---- distribution
  const fixedSum = fSum(fixed.map((d) => d.share));
  const drafts: Draft[] = [];
  let awlApplied = false;
  let raddApplied = false;
  let dhawuApplied = false;
  let residue = fSub(ONE, fixedSum);

  if (fCmp(fixedSum, ONE) > 0) {
    awlApplied = true;
    for (const d of fixed) drafts.push({ ...d, share: fDiv(d.share, fixedSum) });
    residue = ZERO;
  } else {
    for (const d of fixed) drafts.push({ ...d });
    if (residue.n > 0) {
      const wt = residuaries.reduce((a, r) => a + r.count * r.weight, 0);
      if (wt > 0) {
        for (const r of residuaries)
          drafts.push({ key: r.key, count: r.count, share: fMul(residue, F(r.count * r.weight, wt)), basis: "residue", fard: "عصبہ" });
      } else {
        const eligible = fixed.filter((d) => d.key !== "husband" && d.key !== "wife");
        const base = fSum(eligible.map((d) => d.share));
        if (base.n > 0) {
          raddApplied = true;
          for (const d of eligible) drafts.push({ key: d.key, count: d.count, share: fMul(residue, fDiv(d.share, base)), basis: "radd", fard: "رد" });
        } else {
          const dh = dhawuDistribution(input, n, flag, exclude);
          if (dh.length > 0) {
            dhawuApplied = true;
            for (const x of dh) drafts.push({ key: x.key, count: x.count, share: fMul(residue, x.share), basis: "dhawu", fard: "ذوی الارحام" });
          } else if (fixed.length > 0) {
            // Only a spouse survives: later Hanafi fatwa returns the residue to the spouse.
            raddApplied = true;
            for (const d of fixed) drafts.push({ key: d.key, count: d.count, share: residue, basis: "radd", fard: "رد", note: "spouseRadd" });
          }
        }
      }
    }
  }

  // ---- merge drafts per key
  const merged = new Map<string, Draft>();
  for (const d of drafts) {
    const e = merged.get(d.key);
    if (e) {
      e.share = fAdd(e.share, d.share);
      if (e.basis !== d.basis) {
        e.fard = e.fard.includes("عصبہ") || d.basis !== "residue" ? `${e.fard}+${d.fard}` : `${e.fard}+عصبہ`;
        e.fard = e.fard.replace("1/6+عصبہ+عصبہ", "1/6+عصبہ");
        e.basis = "fixed";
      }
    } else merged.set(d.key, { ...d });
  }
  const groups = [...merged.values()].filter((d) => d.share.n > 0);

  // ---- asl / awl / radd / tashih
  let asl = fixed.reduce((a, d) => lcm(a, d.share.d), 1);
  if (fixed.length === 0) {
    asl = residuaries.reduce((a, r) => a + r.count * r.weight, 0) || groups.reduce((a, g) => lcm(a, g.share.d), 1);
  }
  let aslAfter = asl;
  if (awlApplied) aslAfter = fixedSum.n * (asl / fixedSum.d);
  else if (raddApplied || dhawuApplied) aslAfter = groups.reduce((a, g) => lcm(a, g.share.d), 1);
  let tashihAsl = aslAfter;
  for (const g of groups) tashihAsl = lcm(tashihAsl, fDiv(g.share, F(g.count)).d);
  const kasr = tashihAsl !== aslAfter;
  const residueSahm = !awlApplied && residuaries.length > 0 && residue.n > 0 ? (residue.n * asl) / residue.d : null;

  const shares: HeirShare[] = groups.map((g) => {
    const sahmRaw = fMul(g.share, F(aslAfter));
    const fin = fMul(g.share, F(tashihAsl));
    return {
      key: g.key,
      count: g.count,
      exact: g.share,
      fraction: fNum(g.share),
      amount: (estate * g.share.n) / g.share.d,
      perPerson: (estate * g.share.n) / g.share.d / g.count,
      basis: g.basis,
      fard: g.fard,
      sahm: sahmRaw.d === 1 ? sahmRaw.n : null,
      finalSahm: fin.n / fin.d,
      perPersonSahm: fin.n / fin.d / g.count,
      note: g.note,
    };
  });

  const total = fSum(groups.map((g) => g.share));
  const unassignedExact = fSub(ONE, total);
  const distributed = (estate * total.n) / total.d;

  if (shares.length === 0) warnings.push("no-heirs");
  if (awlApplied) warnings.push("awl");
  if (raddApplied) warnings.push("radd");

  const kalalah = !anyDesc && !father && !grandfather;

  return {
    estate,
    shares,
    excluded,
    affected,
    fixedTotal: fNum(fixedSum),
    fixedTotalExact: fixedSum,
    awlApplied,
    raddApplied,
    dhawuApplied,
    muqasamahApplied: muq,
    kalalah,
    asl,
    aslAfter,
    tashihAsl,
    kasr,
    residueSahm,
    distributed,
    unassigned: shares.length === 0 ? estate : Math.max(0, estate - distributed),
    unassignedExact: shares.length === 0 ? ONE : unassignedExact,
    warnings,
  };
}

// ---------------------------------------------------------------- dhawu al-arham
function dhawuDistribution(
  input: HeirsInput,
  n: (k: keyof HeirsInput) => number,
  flag: (k: keyof HeirsInput) => boolean,
  exclude: (key: string, count: number, reason: string) => void,
): Array<{ key: string; count: number; share: Frac }> {
  const split = (units: Array<[string, number, number]>) => {
    const tot = units.reduce((a, [, c, w]) => a + c * w, 0);
    return units.filter(([, c]) => c > 0).map(([key, c, w]) => ({ key, count: c, share: F(c * w, tot) }));
  };
  const dS = n("daughtersSons");
  const dD = n("daughtersDaughters");
  const mgf = flag("maternalGrandfather");
  const sS = n("sistersSons");
  const sD = n("sistersDaughters");
  const bD = n("brothersDaughters");
  const pA = n("paternalAunts");
  const mU = n("maternalUncles");
  const mA = n("maternalAunts");
  const classes: Array<Array<[string, number]>> = [
    [["daughtersSons", dS], ["daughtersDaughters", dD]],
    [["maternalGrandfather", mgf ? 1 : 0]],
    [["sistersSons", sS], ["sistersDaughters", sD], ["brothersDaughters", bD]],
    [["paternalAunts", pA], ["maternalUncles", mU], ["maternalAunts", mA]],
  ];
  const ci = classes.findIndex((c) => c.some(([, k]) => k > 0));
  if (ci < 0) return [];
  for (const c of classes.slice(ci + 1)) for (const [k, cnt] of c) exclude(k, cnt, "closerDhawu");
  if (ci === 0) return split([["daughtersSons", dS, 2], ["daughtersDaughters", dD, 1]]);
  if (ci === 1) return [{ key: "maternalGrandfather", count: 1, share: ONE }];
  if (ci === 2) return split([["sistersSons", sS, 2], ["sistersDaughters", sD, 1], ["brothersDaughters", bD, 1]]);
  // Class 4: paternal side 2/3, maternal side 1/3; one side alone takes all.
  const out: Array<{ key: string; count: number; share: Frac }> = [];
  const pat = pA > 0;
  const mat = mU + mA > 0;
  const patShare = pat && mat ? F(2, 3) : pat ? ONE : ZERO;
  const matShare = fSub(ONE, patShare);
  if (pat) out.push({ key: "paternalAunts", count: pA, share: patShare });
  if (mat) for (const x of split([["maternalUncles", mU, 2], ["maternalAunts", mA, 1]])) out.push({ ...x, share: fMul(x.share, matShare) });
  return out;
}

// ---------------------------------------------------------------- conditional (Haml / Mafqud)
export interface ConditionalRow {
  key: string;
  count: number;
  /** Amount released now (minimum across all scenarios). */
  now: Frac;
  amountNow: number;
}
export interface ConditionalResult {
  scenarios: Array<{ label: string; result: InheritanceResult }>;
  rows: ConditionalRow[];
  reserved: Frac;
  reservedAmount: number;
}

function conditional(
  estate: number,
  scenarios: Array<{ label: string; result: InheritanceResult }>,
  presentCounts: Map<string, number>,
): ConditionalResult {
  const rows: ConditionalRow[] = [];
  for (const [key, count] of presentCounts) {
    if (count <= 0) continue;
    let min: Frac | null = null;
    for (const s of scenarios) {
      const g = s.result.shares.find((x) => x.key === key);
      const per = g ? fDiv(g.exact, F(g.count)) : ZERO;
      if (!min || fCmp(per, min) < 0) min = per;
    }
    const now = fMul(min ?? ZERO, F(count));
    if (now.n > 0) rows.push({ key, count, now, amountNow: (estate * now.n) / now.d });
  }
  const reserved = fSub(ONE, fSum(rows.map((r) => r.now)));
  return { scenarios, rows, reserved, reservedAmount: (estate * reserved.n) / reserved.d };
}

/** Haml: the deceased's unborn child. Heirs get the least they would receive; the rest is reserved. */
export function calculatePregnancy(input: HeirsInput): ConditionalResult {
  const base = calculateInheritance(input);
  const asSon = calculateInheritance({ ...input, sons: int(input.sons) + 1 });
  const asDaughter = calculateInheritance({ ...input, daughters: int(input.daughters) + 1 });
  const present = new Map<string, number>();
  for (const s of [...base.shares, ...asSon.shares, ...asDaughter.shares]) {
    const orig = s.key === "sons" ? int(input.sons) : s.key === "daughters" ? int(input.daughters) : base.shares.find((b) => b.key === s.key)?.count ?? s.count;
    present.set(s.key, orig);
  }
  return conditional(base.estate, [
    { label: "son", result: asSon },
    { label: "daughter", result: asDaughter },
    { label: "stillborn", result: base },
  ], present);
}

export const MISSING_KEYS = [
  "husband",
  "sons",
  "daughters",
  "father",
  "fullBrothers",
  "fullSisters",
  "consanguineBrothers",
  "consanguineSisters",
  "uterineBrothers",
  "uterineSisters",
] as const;
export type MissingKey = (typeof MISSING_KEYS)[number];

/** Mafqud / captive of unknown fate: treated as alive for his own share, reserved until his status is known. */
export function calculateMissing(input: HeirsInput, key: MissingKey): ConditionalResult {
  const dead: HeirsInput = { ...input };
  if (key === "husband") dead.spouse = "none";
  else if (key === "father") dead.father = false;
  else (dead as unknown as Record<string, number>)[key] = Math.max(0, int(input[key]) - 1);
  const alive = calculateInheritance(input);
  const deadR = calculateInheritance(dead);
  const present = new Map<string, number>();
  for (const s of [...alive.shares, ...deadR.shares]) {
    const isMissingGroup = s.key === key || (key === "husband" && s.key === "husband");
    const cnt = alive.shares.find((a) => a.key === s.key)?.count ?? s.count;
    present.set(s.key, isMissingGroup ? cnt - 1 : cnt);
  }
  return conditional(alive.estate, [
    { label: "alive", result: alive },
    { label: "dead", result: deadR },
  ], present);
}

// ---------------------------------------------------------------- takharuj
export interface TakharujRow {
  key: string;
  count: number;
  originalAmount: number;
  adjustedAmount: number;
  originalSahm: number;
  adjustedSahm: number;
}
export interface TakharujResult {
  exitingKey: string;
  consideration: number;
  remainingEstate: number;
  originalAsl: number;
  adjustedAsl: number;
  rows: TakharujRow[];
}

/**
 * One heir from group `key` withdraws, taking `consideration` (an item / sum
 * from the estate). His sahm is removed from the mas'alah and the rest of the
 * estate is divided among the others by their original sahm.
 */
export function applyTakharuj(result: InheritanceResult, key: string, consideration: number): TakharujResult | null {
  const g = result.shares.find((s) => s.key === key);
  if (!g) return null;
  const asl = result.tashihAsl;
  const exitSahm = g.perPersonSahm;
  const adjustedAsl = asl - exitSahm;
  const c = Math.min(Math.max(0, consideration), result.estate);
  const remaining = result.estate - c;
  const rows: TakharujRow[] = result.shares.map((s) => {
    const count = s.key === key ? s.count - 1 : s.count;
    const sahm = s.key === key ? s.finalSahm - exitSahm : s.finalSahm;
    return {
      key: s.key,
      count,
      originalAmount: s.amount,
      originalSahm: s.finalSahm,
      adjustedSahm: sahm,
      adjustedAmount: adjustedAsl > 0 ? (remaining * sahm) / adjustedAsl : 0,
    };
  });
  return { exitingKey: key, consideration: c, remainingEstate: remaining, originalAsl: asl, adjustedAsl, rows };
}

// ---------------------------------------------------------------- munasakhat
export interface MunasakhaStage {
  /** Index of the earlier stage the deceased heir belongs to. */
  fromStage: number;
  /** Heir group key (in that stage) of the person who died before distribution. */
  heirKey: string;
  heirs: HeirsInput;
}
export interface ConsolidatedRow {
  stage: number;
  key: string;
  count: number;
  exact: Frac;
  amount: number;
}
export interface MunasakhaResult {
  stages: Array<{ result: InheritanceResult; transferred: Frac; transferredAmount: number; valid: boolean }>;
  consolidated: ConsolidatedRow[];
  /** Al-mas'alah al-jami'a: common denominator of every final share. */
  jamia: number;
  total: Frac;
}

export function calculateMunasakha(first: HeirsInput, later: MunasakhaStage[]): MunasakhaResult {
  const estate = Number.isFinite(first.estate) && first.estate > 0 ? first.estate : 0;
  const r0 = calculateInheritance(first);
  const stages: MunasakhaResult["stages"] = [{ result: r0, transferred: ONE, transferredAmount: estate, valid: true }];
  const holdings = new Map<string, ConsolidatedRow>();
  const id = (s: number, k: string) => `${s}:${k}`;
  for (const s of r0.shares) holdings.set(id(0, s.key), { stage: 0, key: s.key, count: s.count, exact: s.exact, amount: 0 });

  later.forEach((st, i) => {
    const stageNo = i + 1;
    const src = holdings.get(id(st.fromStage, st.heirKey));
    const r = calculateInheritance({ ...st.heirs, estate: 1 });
    if (!src || src.count <= 0 || st.fromStage >= stageNo) {
      stages.push({ result: { ...r, estate: 0 }, transferred: ZERO, transferredAmount: 0, valid: false });
      return;
    }
    const per = fDiv(src.exact, F(src.count));
    src.exact = fSub(src.exact, per);
    src.count -= 1;
    const scaled = calculateInheritance({ ...st.heirs, estate: (estate * per.n) / per.d });
    stages.push({ result: scaled, transferred: per, transferredAmount: (estate * per.n) / per.d, valid: true });
    for (const g of r.shares) holdings.set(id(stageNo, g.key), { stage: stageNo, key: g.key, count: g.count, exact: fMul(per, g.exact), amount: 0 });
    // Any part the later deceased leaves unassigned stays recorded as unassigned.
  });

  const consolidated = [...holdings.values()]
    .filter((h) => h.exact.n > 0 && h.count > 0)
    .map((h) => ({ ...h, amount: (estate * h.exact.n) / h.exact.d }));
  const jamia = consolidated.reduce((a, h) => lcm(a, fDiv(h.exact, F(h.count)).d), 1);
  return { stages, consolidated, jamia, total: fSum(consolidated.map((h) => h.exact)) };
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
  paternalGrandmother: false,
  maternalGrandmother: false,
});
