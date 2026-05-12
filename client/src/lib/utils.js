import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const DateFormate = (date, format = "short", countryCode = "en-IN") => {
  if (format === "short") {
    return new Date(date).toLocaleDateString(countryCode, {
      day: "numeric",
      month: "2-digit",
      year: "numeric",
    });
  } else if (format === "long") {
    return new Date(date).toLocaleDateString(countryCode, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};
