import type { FilterState } from "./types"
import type { CatalogParams } from "@/entities/product/api"

const DEFAULT_LIMIT = 20

export function buildParams(state: FilterState): CatalogParams {
  const q = state.q?.trim()

  const toNumOrNull = (v: unknown) =>
    v === "" || v === null || v === undefined ? null : Number(v)

  let priceMin = toNumOrNull(state.price_min)
  let priceMax = toNumOrNull(state.price_max)

  if (Number.isNaN(priceMin)) priceMin = null
  if (Number.isNaN(priceMax)) priceMax = null

  if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
    ;[priceMin, priceMax] = [priceMax, priceMin]
  }

  const params: CatalogParams = {
    q: q || undefined,
    make_id: state.make_id ?? undefined,
    condition: state.condition ?? undefined,
    originality: state.originality ?? undefined,
    price_min: priceMin ?? undefined,
    price_max: priceMax ?? undefined,
    limit: DEFAULT_LIMIT,
  }

  return params
}
