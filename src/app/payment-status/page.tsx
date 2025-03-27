import PaymentStatus from "./PaymentStatus";
import { Suspense } from "react";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatus />
    </Suspense>
  );
}