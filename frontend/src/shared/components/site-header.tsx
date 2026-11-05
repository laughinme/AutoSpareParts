import { useState, type ReactNode } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import type { NavSection } from "@/shared/components/nav-main";
import { NavMain } from "@/shared/components/nav-main";
import { NavUser } from "@/shared/components/nav-user";
import { Brand } from "@/shared/components/brand";
import { RepositoryLink } from "@/shared/components/repository-link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ROUTE_PATHS, SUPPLIER_NAV_SECTION } from "@/app/routes";
import { cn } from "@/shared/lib/utils";

type SiteHeaderProps = {
  sections: NavSection[];
  user: { name: string; email: string; avatar: string };
  homePath?: string;
  searchSlot?: ReactNode;
  navItemCounters?: Record<string, number>;
  onNavItemSelect?: Parameters<typeof NavMain>[0]["onItemSelect"];
};

const sectionNames: Record<string, string> = {
  Buyer: "Покупателям",
  Supplier: "Продавцам",
  Admin: "Администрирование",
};

export function SiteHeader({
  sections,
  user,
  homePath = "/",
  searchSlot,
  navItemCounters,
  onNavItemSelect,
}: SiteHeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const cartCount = navItemCounters?.[ROUTE_PATHS.buyer.cart] ?? 0;
  const navigation = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.path !== ROUTE_PATHS.buyer.cart),
  }));

  return (
    <header className="market-header">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      <div className="header-container header-main">
        <div className="header-identity">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="header-menu-button md:hidden"
                aria-label="Открыть меню"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              aria-describedby={undefined}
              side="left"
              className="flex w-[min(88vw,22rem)] flex-col gap-5 p-0"
            >
              <SheetHeader className="border-b px-5 py-6">
                <SheetTitle>
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Мобильная навигация"
                className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6"
              >
                {[...sections, SUPPLIER_NAV_SECTION].map((section) => (
                  <div key={section.label} className="flex flex-col gap-2">
                    <span className="mb-1 text-xs font-semibold text-muted-foreground">
                      {sectionNames[section.label] ?? section.label}
                    </span>
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        onClick={(event) => {
                          if (
                            onNavItemSelect?.({ section, item, event }) ===
                            false
                          ) {
                            event.preventDefault();
                          }
                          setIsMobileNavOpen(false);
                        }}
                        className={({ isActive }) =>
                          cn(
                            "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold",
                            isActive
                              ? "bg-accent text-primary"
                              : "text-muted-foreground hover:bg-muted",
                          )
                        }
                      >
                        {item.icon && <item.icon className="size-5" />}
                        {item.title}
                        {!!navItemCounters?.[item.path] && (
                          <Badge className="ml-auto">
                            {navItemCounters[item.path]}
                          </Badge>
                        )}
                      </NavLink>
                    ))}
                  </div>
                ))}
                <RepositoryLink className="mobile-repository-link" />
              </nav>
            </SheetContent>
          </Sheet>
          <Link to={homePath} aria-label="AutoSpare — на главную">
            <Brand compact />
          </Link>
        </div>
        {searchSlot && <div className="header-search">{searchSlot}</div>}
        <div className="header-actions">
          <NavLink
            to={ROUTE_PATHS.buyer.cart}
            className="header-cart"
            aria-label={cartCount ? `Корзина, товаров: ${cartCount}` : "Корзина"}
          >
            <ShoppingBag size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className="header-cart-label">Корзина</span>
            {cartCount > 0 && <span className="header-cart-count" aria-hidden="true">{cartCount}</span>}
          </NavLink>
          <RepositoryLink className="repository-link hidden md:inline-flex" />
          <NavUser user={user} onNavItemSelect={onNavItemSelect} />
        </div>
      </div>
      <div className="header-navigation hidden md:block">
        <div className="header-container">
          <NavMain sections={navigation} onItemSelect={onNavItemSelect} />
        </div>
      </div>
    </header>
  );
}
