import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { ArrowRight, PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";

import type { ProtectedOutletContext } from "@/app/App";
import { toProductFeed } from "@/entities/product/model/adapters";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import { useCartQuery } from "@/entities/cart/model/useCartQuery";
import { useAddToCart } from "@/features/cart/useAddToCart";
import { useUpdateCart } from "@/features/cart/useUpdateCart";
import { useRemoveCartItem } from "@/features/cart/useRemoveCartItem";
import { ProductFiltersForm } from "@/features/product-filters/ui/ProductFiltersForm";
import type { FilterState } from "@/features/product-filters/model/types";
import { buildParams } from "@/features/product-filters/model/buildParams";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getProductsCatalog } from "@/entities/product/api";

const CATALOG_PAGE_SIZE = 20;

const createDefaultFilters = (): FilterState => ({
  q: "",
  make_id: null,
  condition: null,
  originality: null,
  price_min: "",
  price_max: "",
});

export function FeedProducts() {
  const { setHeaderSearch } = useOutletContext<ProtectedOutletContext>();

  const [draftFilters, setDraftFilters] =
    useState<FilterState>(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(createDefaultFilters);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersTitleRef = useRef<HTMLHeadingElement>(null);
  const { data: cart } = useCartQuery();
  const addMutation = useAddToCart();
  const updateMutation = useUpdateCart();
  const removeMutation = useRemoveCartItem();

  const queryParams = useMemo(
    () => buildParams(appliedFilters),
    [appliedFilters],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", "catalog", queryParams],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await getProductsCatalog({
        ...queryParams,
        cursor: pageParam,
      });

      return toProductFeed(response);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const currentPageSize = queryParams.limit ?? CATALOG_PAGE_SIZE;
  const initialSkeletonCount = Math.max(4, Math.min(12, currentPageSize));
  const loadingMoreSkeletonCount = Math.max(
    2,
    Math.min(6, Math.ceil(currentPageSize / 4)),
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleFiltersChange = useCallback((patch: Partial<FilterState>) => {
    setDraftFilters((current) => ({ ...current, ...patch }));
  }, []);

  const applySearch = useCallback((q: string) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    setAppliedFilters((current) => current.q === q ? current : { ...current, q });
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    handleFiltersChange({ q });
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => applySearch(q), 350);
  }, [applySearch, handleFiltersChange]);

  const handleApply = useCallback(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  useEffect(
    () => () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    const resetDraft = createDefaultFilters();
    const resetApplied = createDefaultFilters();
    setDraftFilters(resetDraft);
    setAppliedFilters(resetApplied);
  }, []);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const target = loaderRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const isInitialLoading = isLoading && products.length === 0;
  const isEmpty = !isLoading && products.length === 0 && !isError;

  const skeletonCount = isInitialLoading
    ? initialSkeletonCount
    : isFetchingNextPage
      ? loadingMoreSkeletonCount
      : 0;
  const shouldRenderGrid = products.length > 0 || skeletonCount > 0;

  const searchNode = useMemo(() => {
    const value = draftFilters.q ?? "";
    return (
      <form
        role="search"
        className="catalog-search"
        onSubmit={(event) => {
          event.preventDefault();
          applySearch(value);
        }}
      >
        <Search size={20} strokeWidth={1.8} aria-hidden="true" />
        <Input
          value={value}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Название запчасти или артикул"
          aria-label="Поиск запчастей"
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            type="button"
            className="catalog-search-clear"
            aria-label="Очистить поиск"
            onClick={() => {
              handleFiltersChange({ q: "" });
              applySearch("");
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
        <Button type="submit" className="catalog-search-submit" aria-label="Найти">
          <span>Найти</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </form>
    );
  }, [draftFilters.q, applySearch, handleFiltersChange, handleSearchChange]);

  useEffect(() => {
    setHeaderSearch(searchNode);
  }, [searchNode, setHeaderSearch]);

  useEffect(
    () => () => {
      setHeaderSearch(null);
    },
    [setHeaderSearch],
  );

  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="catalog-results-title"
      tabIndex={-1}
    >
      <div className="catalog-heading">
        <h2 id="catalog-results-title">Каталог запчастей</h2>
        <span className="catalog-count" aria-live="polite">
          {isLoading
            ? "Загружаем каталог…"
            : isError
              ? "Каталог недоступен"
              : `Предложения: ${products.length.toLocaleString("ru-RU")}${hasNextPage ? "+" : ""}`}
        </span>
      </div>
      <Sheet open={isFiltersSheetOpen} onOpenChange={setIsFiltersSheetOpen}>
        <div className="catalog-toolbar">
          <div className="catalog-tabs" role="group" aria-label="Быстрый выбор состояния">
            {([
              { value: null, label: "Все запчасти" },
              { value: "new", label: "Новые" },
              { value: "used", label: "Б/у" },
            ] as const).map((tab) => (
              <button
                type="button"
                key={tab.label}
                aria-pressed={appliedFilters.condition === tab.value}
                onClick={() => {
                  applySearch(draftFilters.q ?? "");
                  setDraftFilters((current) => ({ ...current, condition: tab.value }));
                  setAppliedFilters((current) => ({ ...current, condition: tab.value }));
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="catalog-filter-trigger lg:hidden" aria-label="Фильтры">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span>Фильтры</span>
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent
          side="left"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            filtersTitleRef.current?.focus();
          }}
          className="catalog-filter-sheet flex w-[88vw] max-w-[24rem] flex-col gap-0 overflow-y-auto p-0"
        >
          <SheetHeader className="px-5 pb-5 pt-6">
            <SheetTitle ref={filtersTitleRef} tabIndex={-1} className="text-xl">Фильтры каталога</SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-6">
            <ProductFiltersForm
              showHeading={false}
              state={draftFilters}
              onChange={handleFiltersChange}
              onReset={handleReset}
              onApply={() => {
                handleApply();
                setIsFiltersSheetOpen(false);
              }}
              disabled={isLoading || isFetchingNextPage}
              isLoading={isLoading || isFetchingNextPage}
            />
          </div>
        </SheetContent>
      </Sheet>

      {(appliedFilters.q ||
        appliedFilters.make_id ||
        appliedFilters.originality ||
        appliedFilters.price_min !== "" ||
        appliedFilters.price_max !== "") && (
        <div className="active-filters">
          <span>{appliedFilters.q ? `Поиск по запросу «${appliedFilters.q}»` : "Фильтры применены"}</span>
          <button type="button" onClick={handleReset}>Сбросить <X size={14} aria-hidden="true" /></button>
        </div>
      )}
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="w-full">
            <ProductFiltersForm
              state={draftFilters}
              onChange={handleFiltersChange}
              onReset={handleReset}
              onApply={handleApply}
              disabled={isLoading || isFetchingNextPage}
              isLoading={isLoading || isFetchingNextPage}
            />
          </div>
        </aside>

        <div className="catalog-results flex min-w-0 flex-col gap-5">
          {isError && (
            <div className="flex items-start justify-between gap-4 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
              <span className="leading-snug">
                Не удалось загрузить каталог товаров. Попробуйте ещё раз.
              </span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Обновить
              </Button>
            </div>
          )}

          {shouldRenderGrid ? (
            <div className="product-grid">
              {products.map((product) => {
                const cartItem = cart?.items.find(
                  (item) => item.product.id === product.id,
                );
                const quantity = cartItem?.quantity ?? 0;
                const isAddPending =
                  addMutation.isPending &&
                  addMutation.variables?.product_id === product.id;
                const isUpdatePending =
                  updateMutation.isPending &&
                  updateMutation.variables?.item_id === cartItem?.id;
                const isRemovePending =
                  removeMutation.isPending &&
                  removeMutation.variables === cartItem?.id;
                const isMutating =
                  isAddPending || isUpdatePending || isRemovePending;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    onAddToCart={() =>
                      addMutation.mutate({
                        product_id: product.id,
                        quantity: 1,
                      })
                    }
                    onIncrement={() => {
                      if (!cartItem) {
                        addMutation.mutate({
                          product_id: product.id,
                          quantity: 1,
                        });
                        return;
                      }
                      updateMutation.mutate({
                        item_id: cartItem.id,
                        quantity: cartItem.quantity + 1,
                      });
                    }}
                    onDecrement={() => {
                      if (!cartItem) {
                        return;
                      }
                      if (cartItem.quantity <= 1) {
                        removeMutation.mutate(cartItem.id);
                        return;
                      }
                      updateMutation.mutate({
                        item_id: cartItem.id,
                        quantity: cartItem.quantity - 1,
                      });
                    }}
                    isMutating={isMutating}
                  />
                );
              })}

              {Array.from({ length: skeletonCount }).map((_, index) => (
                <ProductCardSkeleton key={`product-skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          {isEmpty && (
            <div className="catalog-empty">
              <PackageSearch size={42} strokeWidth={1.2} />
              <h3>Пока ничего не нашлось</h3>
              <p>Попробуйте другое название или измените фильтры.</p>
              <Button variant="outline" onClick={handleReset}>
                Сбросить фильтры
              </Button>
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Загрузка..." : "Показать ещё"}
              </Button>
            </div>
          )}

          <div ref={loaderRef} aria-hidden className="h-px w-full" />
        </div>
      </div>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card product-skeleton" aria-hidden="true">
      <Skeleton className="product-image" />
      <div className="product-info space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
