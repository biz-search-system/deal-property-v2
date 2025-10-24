import { OrganizationsContent } from "@/app/(main)/organization/components/organizations-content";

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">所属している組織</h2>
          <OrganizationsContent />
        </div>
      </div>
    </div>
  );
}
