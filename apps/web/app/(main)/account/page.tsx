import { PasswordChangeCard } from "./components/password-change-card";
import { getCurrentUser } from "@/lib/data/user";
import { ProfileCard } from "./components/profie-card";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <>
      <BreadcrumbConfig items={[{ label: "アカウント設定" }]} />
      <div className="h-full flex flex-col">
        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-auto max-w-7xl w-full md:px-6 lg:px-14 xl:px-28 2xl:px-32 py-16">
            <div className="mx-auto w-full @container max-w-[1200px] px-4 @lg:px-6 @xl:px-10">
              <header className="w-full flex-col gap-3 py-6 pt-0">
                <h3 className="text-xl">設定</h3>
              </header>
            </div>
            <div className="mx-auto w-full @container max-w-[1200px] px-4 @lg:px-6 @xl:px-10 pb-16 space-y-6">
              <ProfileCard user={user} />
              <PasswordChangeCard />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
