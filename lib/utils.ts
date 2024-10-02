import { Optional, UrlQueryParams } from "@/types";
import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const formatBalance = (value: Optional<bigint>, sliceIdx = 8) => {
  if (!value) {
    return 0;
  }

  return formatEther(value).toString().slice(0, sliceIdx);
};
