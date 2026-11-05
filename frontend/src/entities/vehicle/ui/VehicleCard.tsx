import type { ReactNode } from "react";
import { CarFront } from "lucide-react";

import type { Vehicle } from "@/entities/vehicle/model/types";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

type VehicleCardProps = {
  vehicle: Vehicle;
  actions?: ReactNode;
  className?: string;
};

export function VehicleCard({ vehicle, actions, className }: VehicleCardProps) {
  const {
    make,
    model,
    year,
    vehicleType,
    vin,
    comment,
    createdAt,
    updatedAt,
  } = vehicle;

  const hasComment = Boolean(comment?.trim());
  const createdLabel = formatDate(createdAt);
  const updatedLabel = formatDate(updatedAt);

  return (
    <Card className={cn("garage-vehicle-card h-full", className)}>
      <CardHeader className="garage-vehicle-heading">
        <CarFront size={25} strokeWidth={1.6} aria-hidden="true" />
        <div>
          <CardTitle className="text-lg font-extrabold leading-tight">
            {make.makeName} {model.modelName}
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{vehicleType.name}</Badge>
            <span>{year || "—"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="garage-vehicle-details">
        <dl>
          <div>
            <dt>VIN</dt>
            <dd className="font-mono">{vin || "—"}</dd>
          </div>
          {hasComment && (
            <div>
              <dt>Комментарий</dt>
              <dd>{comment}</dd>
            </div>
          )}
        </dl>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Добавлен {createdLabel ?? "—"}</span>
          <span>Обновлён {updatedLabel ?? "—"}</span>
        </div>
      </CardContent>
      {actions && <CardFooter className="garage-vehicle-actions">{actions}</CardFooter>}
    </Card>
  );
}

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};
