import { ErrorFallback } from "@/components/ErrorFallback";
import { Button } from "@/components/ui/button.tsx";
import { Form } from "@/components/ui/form.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { roundToNearest30Minutes } from "@/lib/times.ts";
import { addDays, addHours, format } from "date-fns";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { FormValues } from "@/components/search/form.tsx";
import { AdditionalFilters } from "@/components/search/AdditionalFilters.tsx";
import { VehicleList } from "@/components/search/VehicleList.tsx";
import { TimeRangeFilters } from "@/components/search/TimeRangeFilters.tsx";
import { Card } from "@/components/ui/card";
import SlidersHorizontal from "@/components/ui/icons/sliders-horizontal";
import Nav from "@/components/Nav";

export function SearchPage() {
  const [initialStartDateAndTime] = useState(() =>
    roundToNearest30Minutes(addHours(new Date(), 1))
  );

  const [initialEndDateAndTime] = useState(() =>
    addDays(initialStartDateAndTime, 1)
  );

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: initialStartDateAndTime,
      startTime: format(initialStartDateAndTime, "HH:mm"),
      endDate: initialEndDateAndTime,
      endTime: format(initialEndDateAndTime, "HH:mm"),
      minPassengers: 1,
      classification: [],
      make: [],
      price: [10, 100],
      page: 1,
    },
  });

  const filters = (
    <ErrorBoundary
      fallback={<ErrorFallback message="Failed to load filters" />}
    >
      <Suspense
        fallback={
          <div className="flex flex-col gap-4 p-4">
            <Skeleton className="w-full h-[100px] rounded" />
            <Skeleton className="w-full h-[100px] rounded" />
            <Skeleton className="w-full h-[100px] rounded" />
            <Skeleton className="w-full h-[100px] rounded" />
          </div>
        }
      >
        <AdditionalFilters />
      </Suspense>
    </ErrorBoundary>
  );

  return (
    <Form {...form}>
      <Nav />

      <div className="bg-neutral-50 px-6">
        <div className="container mx-auto pt-6 flex flex-col">
          <Card className="p-4">
            <TimeRangeFilters />
          </Card>

          <div className="grid grid-cols-12 gap-6 grid-flow-row">
            <div className="col-span-12 md:col-span-3 md:py-6 pt-2">
              <div className="md:hidden mt-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal width="16" height="16" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>{filters}</SheetContent>
                </Sheet>
              </div>
              <Card className="hidden md:block">{filters}</Card>
            </div>

            <div className="col-span-12 md:col-span-9 pb-6 md:pt-6 pt-0">
              <ErrorBoundary
                fallback={<ErrorFallback message="Failed to load vehicles" />}
              >
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-4">
                      <Skeleton className="w-full h-[178px] rounded" />
                      <Skeleton className="w-full h-[178px] rounded" />
                      <Skeleton className="w-full h-[178px] rounded" />
                      <Skeleton className="w-full h-[178px] rounded" />
                    </div>
                  }
                >
                  <VehicleList />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
