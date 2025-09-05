import InvoiceDetailsPage from "./components/InvoiceDetails";
import { Layout } from "@/common/layout/Layout";
import { Suspense } from "react";

export default function Announcements() {
  return (
    <Layout paddingContainer>
      <Suspense fallback={<div>Se încarcă...</div>}>
        <InvoiceDetailsPage />
      </Suspense>
    </Layout>
  );
}