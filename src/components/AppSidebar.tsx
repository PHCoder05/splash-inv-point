import { useState } from "react";
import { LayoutDashboard, Package, Warehouse, ClipboardList, Waves } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Inventory Usage", url: "/inventory-usage", icon: ClipboardList },
  { title: "Inventory", url: "/inventory", icon: Warehouse },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "text-primary font-semibold" 
      : "text-foreground/80 hover:text-primary";

  return (
    <Sidebar
      className="glass border-r border-border/30 shadow-soft animate-slide-in-right"
      collapsible="icon"
    >
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors floating">
            <Waves className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-xl text-gradient">AquaManager</h1>
              <p className="text-xs text-muted-foreground">Inventory System</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavCls} group relative overflow-hidden rounded-xl p-3 transition-all duration-300 hover-lift`}
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-1.5 rounded-lg transition-colors ${isActive(item.url) ? 'bg-primary/20' : 'group-hover:bg-primary/10'}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        {!collapsed && (
                          <span className="font-medium animate-fade-in">{item.title}</span>
                        )}
                      </div>
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl animate-scale-in" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}