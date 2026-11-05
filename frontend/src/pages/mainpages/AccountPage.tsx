import {
  ArrowUpRight,
  CarFront,
  Mail,
  Package,
  Store,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/auth/useAuth";
import { ROUTE_PATHS } from "@/app/routes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function AccountPage() {
  const auth = useAuth();
  const user = auth?.user;
  const name =
    user?.username?.trim() || user?.email?.split("@")[0] || "Пользователь";
  const organization = user?.organization;
  return (
    <div className="workspace-page">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Личный кабинет
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ваш профиль и всё, что связано с автомобилем.
        </p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-primary">
                {name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <CardTitle className="truncate text-xl">{name}</CardTitle>
                <p className="mt-2 text-xs text-muted-foreground">
                  Профиль AutoSpare
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="profile-details">
              <div>
                <dt>
                  <Mail size={16} /> Электронная почта
                </dt>
                <dd>{user?.email}</dd>
              </div>
              <div>
                <dt>
                  <UserRound size={16} /> Имя пользователя
                </dt>
                <dd>{user?.username || "Не указано"}</dd>
              </div>
              {organization && (
                <div>
                  <dt>
                    <Store size={16} /> Организация
                  </dt>
                  <dd>{organization.name}</dd>
                </div>
              )}
            </dl>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => auth?.logout()}
            >
              Выйти из аккаунта
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[
            {
              path: ROUTE_PATHS.buyer.garage,
              icon: CarFront,
              title: "Мой гараж",
              text: "Автомобили, VIN и заметки — в одном месте",
            },
            {
              path: ROUTE_PATHS.buyer.orders,
              icon: Package,
              title: "Мои заказы",
              text: "Покупки и информация о доставке",
            },
          ].map(({ path, icon: Icon, title, text }) => (
            <Link className="workspace-link" key={path} to={path}>
              <Icon size={24} strokeWidth={1.5} />
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
              <ArrowUpRight className="ml-auto shrink-0" size={18} />
            </Link>
          ))}
          <div className="rounded-xl border border-border bg-accent/40 p-6">
            <Badge variant="secondary">Для бизнеса</Badge>
            <h2 className="mt-4 text-lg font-semibold">
              Продавайте запчасти с AutoSpare
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Откройте кабинет продавца, чтобы управлять ассортиментом и
              публикациями.
            </p>
            <Button asChild variant="link" className="mt-3 px-0">
              <Link to={ROUTE_PATHS.supplier.dashboard}>
                Кабинет продавца <ArrowUpRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
