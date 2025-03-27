import PaymentPackages from "./PaymentPackages";
import { Suspense } from "react";

export default function PaymentPackagesPage() {
  return (
    <Suspense fallback={<div>Loading packages...</div>}>
      <PaymentPackages />
    </Suspense>
  );
}