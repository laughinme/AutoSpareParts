import { useState } from "react";
import {
  Package,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buildProductDetailsPath } from "@/app/routes";
import type { Product } from "@/entities/product/model/types";
import { Button } from "@/shared/components/ui/button";

type ProductCardProps = {
  product: Product;
  quantity?: number;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  isMutating?: boolean;
};

const conditionNames: Record<string, string> = {
  new: "Новая",
  used: "Б/у",
  refurbished: "Восстановленная",
};

export function ProductCard({
  product,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  isMutating = false,
}: ProductCardProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  let priceLabel = "Цена не указана";
  if (Number.isFinite(product.price)) {
    try {
      priceLabel = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: product.currency ?? "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(product.price);
    } catch {
      priceLabel = product.price.toLocaleString("ru-RU");
    }
  }
  const outOfStock = product.qty <= 0;
  return (
    <article className="product-card">
      <Link
        to={buildProductDetailsPath(product.id)}
        className="product-image"
        aria-label={`Подробнее: ${product.title}`}
      >
        {product.imageUrl && failedImage !== product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onError={() => setFailedImage(product.imageUrl ?? null)}
          />
        ) : (
          <div className="product-no-image">
            <Package size={32} strokeWidth={1.25} aria-hidden="true" />
            <span>Фото отсутствует</span>
          </div>
        )}
        {product.condition && (
          <span className="condition-tag">
            {conditionNames[product.condition] ??
              product.condition.replace(/_/g, " ")}
          </span>
        )}
        <span className="product-open" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="product-info">
        <div className="product-price">{priceLabel}</div>
        <Link
          to={buildProductDetailsPath(product.id)}
          className="product-title"
        >
          {product.title}
        </Link>
        <p className="product-stock">
          <span className={outOfStock ? "unavailable" : ""} />
          {outOfStock
            ? "Нет в наличии"
            : Number.isFinite(product.qty)
              ? `В наличии · ${product.qty.toLocaleString("ru-RU")} шт.`
              : "Уточняйте наличие"}
        </p>
        {quantity > 0 ? (
          <div
            className="quantity-control"
            aria-label="Количество в корзине"
            aria-live="polite"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDecrement}
              disabled={isMutating || !onDecrement}
              aria-label={`Уменьшить количество: ${product.title}`}
            >
              <Minus size={16} />
            </Button>
            <span>
              {isMutating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                quantity
              )}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onIncrement}
              disabled={isMutating || !onIncrement || quantity >= product.qty}
              aria-label={`Увеличить количество: ${product.title}`}
            >
              <Plus size={16} />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="product-add"
            variant="outline"
            onClick={onAddToCart}
            disabled={isMutating || !onAddToCart || outOfStock}
          >
            {isMutating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingBag size={16} />
            )}
            {outOfStock ? "Недоступно" : "В корзину"}
          </Button>
        )}
      </div>
    </article>
  );
}
