import { Pagination, trpc } from "@/trpc.ts";
import { useFormContext } from "react-hook-form";
import {
  combineDateTime,
  FormValues,
  OrderBy,
  orderByOptions,
} from "@/components/search/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDifferenceInDays } from "@/lib/times";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function PaginationButtons({ data }: { data: Pagination }) {
  const form = useFormContext<FormValues>();
  const currentPage = form.watch("page");

  return (
    <div className="flex gap-2 justify-center mt-6">
      <Button
        variant="link"
        onClick={() => form.setValue("page", currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          onClick={() => form.setValue("page", page)}
          variant={page === currentPage ? "default" : "outline"}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="link"
        onClick={() => form.setValue("page", currentPage + 1)}
        disabled={currentPage === data.totalPages}
      >
        Next
      </Button>
    </div>
  );
}

function Sort() {
  const form = useFormContext<FormValues>();
  const orderBy = form.watch("orderBy");

  return (
    <Select
      value={orderBy}
      defaultValue="price_asc"
      onValueChange={(val) => form.setValue("orderBy", val as OrderBy)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {orderByOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function VehicleList() {
  const navigate = useNavigate();

  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");
  const minPassengers = form.watch("minPassengers");
  const classification = form.watch("classification");
  const make = form.watch("make");
  const price = form.watch("price");
  const page = form.watch("page");
  const orderBy = form.watch("orderBy");

  const startDateTime = useMemo(
    () => combineDateTime(startDate, startTime),
    [startDate, startTime]
  );

  const endDateTime = useMemo(
    () => combineDateTime(endDate, endTime),
    [endDate, endTime]
  );

  const [searchResponse] = trpc.vehicles.search.useSuspenseQuery(
    {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      page: Number(page),
      passengerCount: Number(minPassengers),
      classification: classification,
      make: make,
      priceMin: price[0],
      priceMax: price[1],
      orderBy: orderBy,
    },
    {
      keepPreviousData: true,
    }
  );

  if (searchResponse?.vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-muted-foreground">
          No vehicles found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between">
        <div className="pb-4">
          <h2 className="md:text-3xl text-xl font-semibold">
            {searchResponse.pagination.totalItems}{" "}
            {searchResponse.pagination.totalItems > 1 ? "Cars" : "Car"}{" "}
            available
          </h2>
          <p className="md:text-sm text-xs text-gray-600 pt-1">
            Showing {(page - 1) * searchResponse.pagination.itemsPerPage + 1} to{" "}
            {Math.min(
              page * searchResponse.pagination.itemsPerPage,
              searchResponse.pagination.totalItems
            )}{" "}
            of {searchResponse.pagination.totalItems} vehicles
          </p>
        </div>

        <Sort />
      </div>

      <ul className="space-y-4">
        {searchResponse.vehicles.map((vehicle) => {
          const bookNowParams = new URLSearchParams({
            id: vehicle.id,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
          });

          const diffInDays = getDifferenceInDays(startDateTime, endDateTime);

          const vehicleHoursDollar = vehicle.hourly_rate_cents / 100;
          const endPrice = diffInDays.differenceInHours * vehicleHoursDollar;

          return (
            <Link
              key={vehicle.id}
              className="flex md:pointer-events-none pointer-events-auto"
              to={{
                pathname: "review",
                search: bookNowParams.toString(),
              }}
            >
              <div className="flex flex-grow md:flex-row flex-col gap-4 border rounded-2xl p-2">
                <div className="flex md:flex-row flex-row-reverse flex-grow gap-4">
                  <img
                    src={vehicle.thumbnail_url}
                    alt={vehicle.model}
                    width={140}
                    height={140}
                    className="rounded-xl p-2 bg-neutral-100 hover:scale-105 transition-all ease-in"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-2xl">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p>Type: {vehicle.classification}</p>
                    <p>Year: {vehicle.year}</p>
                    <p>Model: {vehicle.doors}</p>
                    <p>Passengers: {vehicle.max_passengers}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p>
                    Price for {diffInDays.differenceInDays}{" "}
                    {diffInDays.differenceInDays > 1 ? "days" : "day"}:
                  </p>
                  <p className="font-bold md:text-3xl text-2xl">
                    {endPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>

                  <Button
                    className="md:inline-flex hidden mt-2 w-36 mb-2 pointer-events-auto"
                    onClick={() => {
                      // To prevent <a> cannot appear as a descendant of <a>
                      navigate({
                        pathname: "review",
                        search: bookNowParams.toString(),
                      });
                    }}
                  >
                    Reserve now
                  </Button>

                  <p className="text-sm">
                    Start from{" "}
                    <span className="text-base font-semibold">
                      {(vehicle.hourly_rate_cents / 100).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                      <span className="text-sm">/hr</span>
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </ul>

      <PaginationButtons data={searchResponse.pagination} />
    </div>
  );
}
