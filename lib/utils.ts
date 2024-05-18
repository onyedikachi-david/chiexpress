/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));



interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
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

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "chi ":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "momo":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}



export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export async function hashPin(pin: number) {
  try {
    const saltRounds = 10; // Adjust as needed for security vs performance trade-off
    // bcrypt.genSalt(saltRounds, function (err, salt) {
    //   bcrypt.hash(pin, salt, function (err, hash) {
    //     // Store hash in your password DB.
    //     return hash;
    //   });
    // });
    const bcrypt = require("bcryptjs");
    const hashedPin = await bcrypt.hash(String(pin), saltRounds);
    return hashedPin;
  } catch (error) {
    console.error("Error hashing PIN:", error);
    throw error;
  }
}

export async function verifyPin(hashedPin: string, plainPin: number) {
  try {
    const bcrypt = require("bcryptjs");
    const match = await bcrypt.compare(String(plainPin), hashedPin);
    return match;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    throw error;
  }
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const authFormSchema = (type: string) =>
  z.object({
    // sign up
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    phoneNumber: "sign-in"
      ? z.string().optional()
      : z.string().regex(/^\+\d{10,15}$/),
    // both
    email: z.string().email(),
    password: z.string().min(8),
  });
