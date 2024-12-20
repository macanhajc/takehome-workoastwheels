import { useFormContext } from "react-hook-form";
import { FormValues } from "./form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { trpc } from "@/trpc";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";

export function AdditionalFilters() {
  const form = useFormContext<FormValues>();
  const classification = form.watch("classification");
  const minPassengers = form.watch("minPassengers");
  const make = form.watch("make");

  const [optionsResponse] = trpc.vehicles.options.useSuspenseQuery();

  return (
    <div className="flex flex-col md:px-4 px-0 md:py-4 py-4 gap-4">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Price per hour</FormLabel>

            <FormControl>
              <Slider
                min={10}
                max={100}
                step={1}
                defaultValue={[100]}
                onValueChange={(values) => {
                  form.setValue("page", 1);
                  field.onChange([10, values[0]]);
                }}
              />
            </FormControl>

            <div className="flex justify-between mt-2 mb-1">
              <span>${10}</span>
              <span>${100}</span>
            </div>

            <Input
              readOnly
              value={field.value[1].toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="minPassengers"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Passengers</FormLabel>
            <Select
              value={minPassengers.toString()}
              onValueChange={(value) => {
                form.setValue("page", 1);
                field.onChange(value);
              }}
            >
              <SelectTrigger id="seats">
                <SelectValue placeholder="Select passengers count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" disabled>
                  Select passengers count
                </SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8+</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Vehicle Makes</FormLabel>
            <div className="grid grid-cols-1">
              {optionsResponse.makes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vehicle-type-${type}`}
                    checked={make.includes(type)}
                    onCheckedChange={(checked) => {
                      form.setValue("page", 1);
                      field.onChange(
                        checked
                          ? [...make, type]
                          : make.filter((t) => t !== type)
                      );
                    }}
                  />
                  <Label
                    htmlFor={`vehicle-type-${type}`}
                    className="capitalize text-lg font-normal"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Vehicle Classes</FormLabel>
            <div className="grid grid-cols-1">
              {optionsResponse.classifications.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vehicle-type-${type}`}
                    checked={classification.includes(type)}
                    onCheckedChange={(checked) => {
                      form.setValue("page", 1);
                      field.onChange(
                        checked
                          ? [...classification, type]
                          : classification.filter((t) => t !== type)
                      );
                    }}
                  />
                  <Label
                    htmlFor={`vehicle-type-${type}`}
                    className="capitalize text-lg font-normal"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
