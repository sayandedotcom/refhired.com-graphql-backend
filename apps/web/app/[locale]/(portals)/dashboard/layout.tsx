import { unstable_setRequestLocale } from "next-intl/server";

import { MainNav } from "@/components/dashboard/components/main-nav";
import { Search } from "@/components/dashboard/components/search";
import { UserNav } from "@/components/dashboard/components/user-nav";

export default function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: any;
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <section className="scroll-smooth">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </section>
    </>
  );
}
