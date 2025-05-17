import { Layout } from "@/common/layout/Layout";
import PaymentPackages from "./PaymentPackages";
import { Suspense } from "react";

export default function Announcements() {
  return (
    <Layout paddingContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentPackages />
      </Suspense>
    </Layout>
  );
}