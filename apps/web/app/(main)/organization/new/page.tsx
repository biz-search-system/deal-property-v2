import { CreateOrganizationForm } from "@/app/(main)/organization/components/create-organization-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewOrganizationPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/organization">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            新しい組織を作成
          </h1>
          <p className="text-muted-foreground mt-2">
            組織を作成してメンバーを招待し、共同作業を開始しましょう
          </p>
        </div>
      </div>

      <CreateOrganizationForm />
    </div>
  );
}