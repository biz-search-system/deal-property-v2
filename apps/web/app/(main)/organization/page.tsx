import { OrganizationsContent } from "@/components/organizations/organizations-content";

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">所属している組織</h2>
        <OrganizationsContent />
      </div>
    </div>
  );
}
