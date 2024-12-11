import { AuthLayout } from "@/common/layout/AuthLayout";
import MyAccountComponent from "./MyAccountComponent";

export default function MyAccount() {
  return (
    <AuthLayout>
      <MyAccountComponent />
    </AuthLayout>
  );
}
