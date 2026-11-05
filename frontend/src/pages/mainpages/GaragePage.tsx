import { AddVehicleDialog } from "@/widgets/vehicle/ui/AddVehicleDialog";
import { GarageVehiclesWidget } from "@/widgets/vehicle/ui/GarageVehiclesWidget";

export default function GaragePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">
        <header className="garage-page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Гараж
            </h1>
            <p className="text-sm text-muted-foreground">
              Храните марку, модель и VIN, чтобы сверять данные при поиске запчастей.
            </p>
          </div>
          <AddVehicleDialog />
        </header>

        <GarageVehiclesWidget />
      </div>
    </div>
  );
}
