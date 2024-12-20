export type OrderBy = "price_asc" | "price_desc" | "name_asc" | "name_desc";

export const orderByOptions: { label: string; value: OrderBy }[] = [
  { label: "Price (Low to High)", value: "price_asc" },
  { label: "Price (High to Low)", value: "price_desc" },
  { label: "Make (A to Z)", value: "name_asc" },
  { label: "Make (Z to A)", value: "name_desc" },
];

export interface FormValues {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  price: [number, number];
  minPassengers: number;
  make: string[];
  classification: string[];
  page: number;
  orderBy?: OrderBy;
}

export const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":");
  const combinedDate = new Date(date);
  combinedDate.setHours(parseInt(hours), parseInt(minutes));
  return combinedDate;
};
