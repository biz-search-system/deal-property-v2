import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { BrokerNewForm } from "@/components/exit/broker/broker-new-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "業者 新規登録",
};

export default function BrokerNewPage() {
  return (
    <>
      <BreadcrumbConfig
        items={[{ label: "業者マスタ", href: "/brokers" }, { label: "新規登録" }]}
      />
      <BrokerNewForm />
    </>
  );
}
