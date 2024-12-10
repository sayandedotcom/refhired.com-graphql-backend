import { Link } from "@/navigation";

import { cn } from "@/utils";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/dashboard" className="hover:text-primary text-sm font-medium transition-colors">
        Overview
      </Link>
      <Link
        href="/dashboard/settings"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
        Settings
      </Link>
    </nav>
  );
}
