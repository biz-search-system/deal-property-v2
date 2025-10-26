import { CreateOrganizationForm } from "@/components/organizations/create-organization-form";

export default function NewOrganizationPage() {
  return (
    <div className="container mx-auto p-4 lg:p-10 flex justify-center">
      <CreateOrganizationForm />
    </div>
  );
}
