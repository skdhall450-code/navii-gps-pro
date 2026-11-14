"use client";
import CustomerAlertSettings from "@/components/customer/CustomerAlertSettings";
import { useCustomerSession } from "@/components/customer/CustomerSession";
export default function CustomerSettingsPage() {
 const customer = useCustomerSession();
 if (!customer || !["CUSTOMER", "USER"].includes(customer.role)) return <p role="alert">This page is available to customer accounts only.</p>;
 return <CustomerAlertSettings key={customer.id} />;
}
