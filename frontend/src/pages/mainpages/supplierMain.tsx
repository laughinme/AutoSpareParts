import { ArrowUpRight, ImageIcon, Package, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/auth/useAuth";
import { ROUTE_PATHS, buildSupplierProductDetailsPath } from "@/app/routes";
import { useSupplierProducts } from "@/entities/supplierProducts/model/useSupplierProducts";
import { SupplierProductCreateDialog } from "@/widgets/supplier/ui/SupplierProductCreateDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

const statusNames: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликован",
  archived: "В архиве",
};

export default function SupplierMain() {
  const organization = useAuth()?.user?.organization;
  const orgId = organization?.id ?? "";
  const products = useSupplierProducts({ orgId, limit: 6 });
  const published = useSupplierProducts({
    orgId,
    limit: 1,
    status: "published",
  });
  const drafts = useSupplierProducts({ orgId, limit: 1, status: "draft" });
  const metrics = [
    { label: "Всего товаров", query: products },
    { label: "Опубликованы", query: published },
    { label: "Черновики", query: drafts },
  ];

  if (!orgId)
    return (
      <div className="workspace-page">
        <h1 className="text-2xl font-semibold">Кабинет продавца</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Завершите регистрацию организации, чтобы открыть магазин.
        </p>
      </div>
    );

  return (
    <div className="workspace-page">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-primary">
            <Store size={15} /> Кабинет продавца
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {organization?.name || "Ваш магазин"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ассортимент и публикации. Всё готово к работе.
          </p>
        </div>
        <SupplierProductCreateDialog orgId={orgId} />
      </header>
      <section className="admin-metrics mb-7" aria-label="Сводка по товарам">
        {metrics.map(({ label, query }) => (
          <div className="admin-metric" key={label}>
            <div>
              <p>{label}</p>
              <div className="metric-value tabular-nums">
                {query.isLoading ? (
                  <Skeleton className="mt-3 h-8 w-14" />
                ) : query.isError ? (
                  "—"
                ) : (
                  (query.data?.total ?? 0).toLocaleString("ru-RU")
                )}
              </div>
            </div>
            <Package aria-hidden="true" />
          </div>
        ))}
      </section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg">Ваши товары</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to={ROUTE_PATHS.supplier.products}>
              Весь ассортимент <ArrowUpRight size={15} />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {products.isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((key) => (
                <Skeleton className="h-20 w-full" key={key} />
              ))}
            </div>
          ) : products.isError ? (
            <div className="catalog-empty">
              <p>Не удалось загрузить ассортимент.</p>
              <Button
                variant="outline"
                onClick={() => {
                  products.refetch();
                  published.refetch();
                  drafts.refetch();
                }}
              >
                Повторить
              </Button>
            </div>
          ) : products.data?.items.length ? (
            <div className="supplier-overview-list">
              {products.data.items.map((product) => (
                <Link
                  key={product.id}
                  to={buildSupplierProductDetailsPath(product.id)}
                >
                  <div className="supplier-overview-image">
                    {product.media[0]?.url ? (
                      <img src={product.media[0].url} alt="" />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2>{product.title}</h2>
                    <p>
                      {product.partNumber || "Без артикула"} ·{" "}
                      {product.quantityOnHand} шт. в наличии
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {statusNames[product.status] ?? product.status}
                  </Badge>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-muted-foreground"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <Package size={38} strokeWidth={1.3} />
              <h3>Магазин начинается с первой детали</h3>
              <p>
                Добавьте товар, заполните характеристики и подготовьте
                публикацию.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
