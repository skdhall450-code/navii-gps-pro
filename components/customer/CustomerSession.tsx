"use client";
import { createContext, useContext } from "react";
export type CustomerIdentity = {
    id: string;
    name: string;
    role: string;
    sessionToken: string | null;
};
export const CustomerSession = createContext<CustomerIdentity | null>(null);
export function useCustomerSession() { return useContext(CustomerSession); }
