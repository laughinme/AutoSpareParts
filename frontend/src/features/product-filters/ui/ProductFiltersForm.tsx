import { useId, useState } from "react";
import { Loader2, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useVehicleMakes } from "@/entities/vehicle/model/useVehicleMakes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import type { FilterState } from "../model/types";

type ProductFiltersFormProps = {
  state: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  onApply: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  showHeading?: boolean;
};

export function ProductFiltersForm({
  state,
  onChange,
  onReset,
  onApply,
  disabled = false,
  isLoading = false,
  className,
  showHeading = true,
}: ProductFiltersFormProps) {
  const id = useId();
  const [makeSearch, setMakeSearch] = useState("");
  const {
    data: makes = [],
    isLoading: makesLoading,
    isError: makesError,
    refetch,
  } = useVehicleMakes({ limit: 100, search: makeSearch.trim() || null });
  const invalidPrice =
    state.price_min != null &&
    state.price_min !== "" &&
    state.price_max != null &&
    state.price_max !== "" &&
    Number(state.price_min) > Number(state.price_max);

  return (
    <form
      className={cn("catalog-filters", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled && !invalidPrice) onApply();
      }}
    >
      {showHeading && (
        <div className="filter-heading">
          <h3>
            <SlidersHorizontal size={17} aria-hidden="true" /> Фильтры
          </h3>
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            aria-label="Сбросить фильтры"
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      <fieldset disabled={disabled} className="filter-section">
        <legend>Марка автомобиля</legend>
        <Label htmlFor={`${id}-make-search`} className="sr-only">
          Поиск марки
        </Label>
        <Input
          id={`${id}-make-search`}
          placeholder="Найти марку"
          value={makeSearch}
          onChange={(event) => setMakeSearch(event.target.value)}
          className="mb-2"
        />
        <Select
          value={state.make_id?.toString() ?? "all"}
          onValueChange={(value) =>
            onChange({ make_id: value === "all" ? null : Number(value) })
          }
          disabled={disabled || makesLoading}
        >
          <SelectTrigger
            id={`${id}-make`}
            className="w-full"
            aria-label="Марка автомобиля"
          >
            <SelectValue
              placeholder={makesLoading ? "Загружаем марки…" : "Все марки"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все марки</SelectItem>
            {state.make_id != null &&
              !makes.some((make) => make.makeId === state.make_id) && (
                <SelectItem value={String(state.make_id)}>
                  Выбранная марка
                </SelectItem>
              )}
            {makes.map((make) => (
              <SelectItem key={make.makeId} value={String(make.makeId)}>
                {make.makeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {makesError && (
          <button
            type="button"
            className="mt-2 text-xs text-destructive underline"
            onClick={() => refetch()}
          >
            Не удалось загрузить. Повторить
          </button>
        )}
      </fieldset>
      <fieldset disabled={disabled} className="filter-section">
        <legend>Цена</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`${id}-min`} className="sr-only">
              Цена от
            </Label>
            <Input
              id={`${id}-min`}
              type="number"
              min="0"
              step="any"
              placeholder="От"
              value={state.price_min ?? ""}
              onChange={(event) =>
                onChange({
                  price_min:
                    event.target.value === "" ? "" : Number(event.target.value),
                })
              }
              aria-invalid={invalidPrice}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-max`} className="sr-only">
              Цена до
            </Label>
            <Input
              id={`${id}-max`}
              type="number"
              min="0"
              step="any"
              placeholder="До"
              value={state.price_max ?? ""}
              onChange={(event) =>
                onChange({
                  price_max:
                    event.target.value === "" ? "" : Number(event.target.value),
                })
              }
              aria-invalid={invalidPrice}
            />
          </div>
        </div>
        <p className="filter-hint">В валюте предложения</p>
        {invalidPrice && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            Цена «от» должна быть меньше цены «до».
          </p>
        )}
      </fieldset>
      <fieldset disabled={disabled} className="filter-section">
        <legend>Состояние</legend>
        {(
          [
            { value: "all", label: "Любое" },
            { value: "new", label: "Новые" },
            { value: "used", label: "С пробегом" },
          ] as const
        ).map((option) => (
          <label className="filter-radio" key={option.value}>
            <input
              type="radio"
              name={`${id}-condition`}
              checked={(state.condition ?? "all") === option.value}
              onChange={() =>
                onChange({
                  condition: option.value === "all" ? null : option.value,
                })
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <fieldset disabled={disabled} className="filter-section">
        <legend>Тип запчасти</legend>
        {(
          [
            { value: "all", label: "Все запчасти" },
            { value: "oem", label: "Оригинальные (OEM)" },
            { value: "aftermarket", label: "Аналоги" },
          ] as const
        ).map((option) => (
          <label className="filter-radio" key={option.value}>
            <input
              type="radio"
              name={`${id}-originality`}
              checked={(state.originality ?? "all") === option.value}
              onChange={() =>
                onChange({
                  originality: option.value === "all" ? null : option.value,
                })
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <div className="filter-actions">
        <Button
          type="submit"
          disabled={disabled || isLoading || invalidPrice}
          className="w-full"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}Показать
          запчасти
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onReset}
          disabled={disabled}
        >
          Сбросить всё
        </Button>
      </div>
    </form>
  );
}
