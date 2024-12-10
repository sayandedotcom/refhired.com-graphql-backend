import { Metadata } from "next";

import DashboardPage from "@/components/dashboard/page";

// import { columns } from "@/components/ui/data-table/components/columns";
// import { DataTable } from "@/components/ui/data-table/components/data-table";
// import { UserNav } from "@/components/ui/data-table/components/user-nav";
// import { tsTasks } from "@/components/ui/data-table/data/tasks";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get job referrals to the top best companies of the world",
  robots: {
    index: false,
    nocache: true, //Disallow in sitemap
  },
};

// async function getTasks() {
//   const data = await fs.readFile(path.join(process.cwd(), "app/components/ui/data/tasks.json"));

//   const tasks = JSON.parse(data.toString());

//   return z.array(taskSchema).parse(tasks);
// }
export default async function Dashboard() {
  // const tasks = await getTasks();
  return (
    <>
      <DashboardPage />
      {/* <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
            <p className="text-muted-foreground">Here&apos;s a list of your referrals for this month!</p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tsTasks} columns={columns} />
      </div> */}
    </>
  );
}
