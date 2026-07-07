'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton, useClerk } from '@clerk/nextjs';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Wrench,
  GraduationCap,
  Briefcase,
  Command,
  ChevronsUpDown,
  LogOut,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Projects', href: '/projects', icon: FolderKanban },
  { title: 'Blog Posts', href: '/posts', icon: FileText },
  { title: 'Experience', href: '/experience', icon: Briefcase },
  { title: 'Skills', href: '/skills', icon: Wrench },
  { title: 'Education', href: '/education', icon: GraduationCap },
  { title: 'Social Links', href: '/social-links', icon: Command },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center">
                  <img src="/rishicodes.svg" alt="Logo" className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">RishiCodes</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href} onClick={handleLinkClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center"
                >
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold">{user?.firstName?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-1 group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user?.fullName || 'Admin'}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress || 'admin@rishicodes.com'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-zinc-950 border-zinc-800 text-zinc-300"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-zinc-800">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold">{user?.firstName?.charAt(0) || 'A'}</span>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.fullName || 'Admin'}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress || 'admin@rishicodes.com'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-zinc-900 focus:text-zinc-100"
                  onClick={() => {
                    if (isMobile) {
                      setOpenMobile(false);
                    }
                    openUserProfile();
                  }}
                >
                  <Settings className="mr-2 size-4" />
                  Manage Account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <SignOutButton>
                  <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900 focus:text-zinc-100">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
