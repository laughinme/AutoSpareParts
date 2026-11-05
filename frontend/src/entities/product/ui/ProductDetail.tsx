import { useState } from "react"
import { ImageIcon, Loader2, Minus, Plus, ShoppingBag } from "lucide-react"

import type { ProductDetail } from "@/entities/product/model/types"
import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"

type ProductDetailsProps = {
  product: ProductDetail
  onAddToCart?: () => void
  isAddToCartLoading?: boolean
  cartQuantity?: number
  onIncrement?: () => void
  onDecrement?: () => void
  isCartUpdating?: boolean
  showCartActions?: boolean
}

export function ProductDetails({
  product,
  onAddToCart,
  isAddToCartLoading = false,
  cartQuantity = 0,
  onIncrement,
  onDecrement,
  isCartUpdating = false,
  showCartActions = true,
}: ProductDetailsProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const priceLabel = formatPrice(product.price, product.currency)
  const conditionLabel = formatCondition(product.condition)
  const stockLabel = formatStock(product.qty)
  const isInCart = cartQuantity > 0
  const isMinusDisabled = isCartUpdating || !onDecrement || cartQuantity <= 0
  const isPlusDisabled = isCartUpdating || !onIncrement || cartQuantity >= product.qty
  const isAddDisabled = isAddToCartLoading || !onAddToCart || product.qty <= 0

  return (
    <div className="product-detail-layout grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="product-detail-media-group space-y-4">
        <Card className="product-detail-photo overflow-hidden py-0">
          <CardContent className="border-b-0 p-0">
            <div className="relative aspect-[4/3] w-full bg-muted">
              {product.imageUrl && failedImage !== product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="product-detail-image h-full w-full object-contain"
                  onError={() => setFailedImage(product.imageUrl ?? null)}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-10" aria-hidden />
                  <span className="text-xs">Нет изображения</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="product-detail-description">
          <CardHeader className="pb-4">
            <h2 className="product-detail-section-title">Описание</h2>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            {product.description ? (
              <p className="whitespace-pre-line [overflow-wrap:anywhere]">{product.description}</p>
            ) : (
              <p className="italic text-muted-foreground/80">
                Описание пока не добавлено.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="product-detail-info-group space-y-4">
        <Card className="product-detail-buy">
          <CardHeader className="product-detail-heading">
            {conditionLabel && <Badge variant="secondary">{conditionLabel}</Badge>}
            <h1>{product.title}</h1>
          </CardHeader>
          <CardContent className="product-detail-purchase">
            <div>
              <p className="product-detail-price">{priceLabel}</p>
              <p className="product-detail-stock">
                <span className={product.qty > 0 ? "in-stock" : ""} />
                {product.qty > 0 ? `В наличии · ${stockLabel} шт.` : "Нет в наличии"}
              </p>
            </div>
            {showCartActions && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {isInCart ? (
                  <div className="flex flex-1 flex-col gap-3 rounded-lg border bg-muted/20 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-10"
                        onClick={onDecrement}
                        disabled={isMinusDisabled}
                        aria-label="Уменьшить количество"
                      >
                        <Minus className="size-5" aria-hidden />
                      </Button>
                      <div className="flex h-12 w-16 items-center justify-center rounded-md border bg-background text-lg font-semibold">
                        {isCartUpdating ? (
                          <Loader2 className="size-5 animate-spin" aria-hidden />
                        ) : (
                          cartQuantity
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-10"
                        onClick={onIncrement}
                        disabled={isPlusDisabled}
                        aria-label="Увеличить количество"
                      >
                        <Plus className="size-5" aria-hidden />
                      </Button>
                    </div>
                    <span className="text-sm uppercase tracking-wide text-muted-foreground sm:text-right">
                      В корзине:&nbsp;
                      <span className="font-semibold text-foreground">
                        {cartQuantity}
                      </span>
                    </span>
                  </div>
                ) : (
                  <Button
                    className="min-h-12 flex-1 gap-2"
                    onClick={onAddToCart}
                    disabled={isAddDisabled}
                  >
                    {isAddToCartLoading
                      ? <Loader2 className="size-4 animate-spin" aria-hidden />
                      : <ShoppingBag className="size-4" aria-hidden />}
                    {product.qty > 0 ? "Добавить в корзину" : "Недоступно"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="product-detail-specs">
          <CardHeader className="pb-4">
            <h2 className="product-detail-section-title">Характеристики</h2>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <CharacteristicRow label="Состояние" value={conditionLabel ?? "—"} />
            <CharacteristicRow label="Валюта" value={product.currency?.toUpperCase() ?? "—"} />
            <CharacteristicRow label="Остаток" value={`${stockLabel} шт.`} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type CharacteristicRowProps = {
  label: string
  value: string
}

function CharacteristicRow({ label, value }: CharacteristicRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

const formatPrice = (price: number, currency?: string) => {
  if (!Number.isFinite(price)) {
    return "—"
  }
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency ?? "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return Number(price).toLocaleString("ru-RU")
  }
}

const formatStock = (qty?: number) => {
  if (typeof qty !== "number" || !Number.isFinite(qty)) {
    return "—"
  }
  if (qty < 0) {
    return "0"
  }
  return qty.toString()
}

const formatCondition = (condition: string) => {
  if (!condition) {
    return null
  }
  return ({ new: "Новая", used: "Б/у", refurbished: "Восстановленная" } as Record<string, string>)[condition] ?? condition.replace(/_/g, " ")
}
