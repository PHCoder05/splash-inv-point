import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, ShoppingCart, TrendingUp, AlertTriangle, Calendar, DollarSign, Plus, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats, useRecentActivity, useProductStockStatus } from "@/hooks/useDatabase";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: stockStatus, isLoading: stockLoading } = useProductStockStatus();

  // Calculate stats from real data
  const dashboardStats = [
    {
      title: "Total Products",
      value: statsLoading ? "..." : stats?.totalProducts.toString() || "0",
      description: "Active inventory items",
      icon: Package,
      trend: statsLoading ? "..." : "+12%",
      color: "primary"
    },
    {
      title: "Low Stock Items",
      value: statsLoading ? "..." : stats?.lowStockItems.toString() || "0",
      description: "Items below threshold",
      icon: AlertTriangle,
      trend: statsLoading ? "..." : "-5%",
      color: "destructive"
    },
    {
      title: "Today's Transactions",
      value: statsLoading ? "..." : stats?.todayOrders.toString() || "0",
      description: "Transactions processed today",
      icon: ShoppingCart,
      trend: statsLoading ? "..." : "+8%",
      color: "secondary"
    },
    {
      title: "Today's Value",
      value: statsLoading ? "..." : formatCurrency(stats?.revenue || 0),
      description: "Today's transaction value",
      icon: DollarSign,
      trend: statsLoading ? "..." : "+15%",
      color: "accent"
    }
  ];

  // Get low stock items for alerts
  const lowStockItems = stockStatus?.filter(item => item.stock_status === 'low_stock') || [];
  const outOfStockItems = stockStatus?.filter(item => item.stock_status === 'out_of_stock') || [];

  if (statsError) {
    return (
      <div className="space-y-8 animate-fade-up">
        <Card className="glass border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load dashboard data. Please check your database connection.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up relative">
      {/* Header */}
      <div className="glass-card hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 floating">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-lg">Welcome to AquaManager - Your waterpark inventory overview</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/products')} 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
            <Button 
              onClick={() => navigate('/inventory')} 
              variant="outline"
              className="border-primary/20 hover:bg-primary/10"
            >
              <Warehouse className="h-4 w-4 mr-2" />
              View Inventory
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card 
            key={index} 
            className="glass border-0 hover-lift group cursor-pointer animate-fade-up"
            style={{animationDelay: `${index * 150}ms`}}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mb-2">
                {stat.description}
              </p>
              <div className="text-xs font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-accent">{stat.trend} from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && !stockLoading && (
        <Card className="glass border-destructive/20 hover-lift animate-fade-up" style={{animationDelay: '600ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div>
                    <p className="font-medium text-destructive">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.category} • {item.vendor}</p>
                  </div>
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              ))}
              {lowStockItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div>
                    <p className="font-medium text-yellow-700">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.category} • {item.vendor}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-yellow-700 border-yellow-500">
                      Stock: {item.quantity} {item.unit}
                    </Badge>
                    <p className="text-xs text-yellow-600 mt-1">Min: {item.min_stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Overview */}
      <Card className="glass border-0 hover-lift animate-fade-up" style={{animationDelay: '700ms'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Overview
          </CardTitle>
          <CardDescription>Current inventory levels and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">In Stock</p>
                  <p className="text-2xl font-bold text-green-700">
                    {stockStatus?.filter(item => item.stock_status === 'in_stock').length || 0}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {lowStockItems.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-700">
                    {outOfStockItems.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass border-0 hover-lift animate-fade-up" style={{animationDelay: '700ms'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription>Latest inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))
            ) : recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-300 border border-border/30 hover-lift"
                  style={{animationDelay: `${800 + index * 100}ms`}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.transaction_type === 'purchase' ? 'bg-green-500/10' : 'bg-blue-500/10'
                    }`}>
                      <Package className={`h-4 w-4 ${
                        activity.transaction_type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.transaction_type === 'purchase' ? 'Purchase' : 'Transaction'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.product?.description || 'Unknown Product'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      activity.transaction_type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      +{activity.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.transaction_date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass border-0 hover-lift animate-fade-up" style={{animationDelay: '800ms'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Package, label: "Add Product", color: "primary", href: "/products" },
              { icon: ShoppingCart, label: "Record Purchase", color: "accent", href: "/inventory" },
              { icon: Warehouse, label: "Issue Items", color: "secondary", href: "/inventory-usage" },
              { icon: TrendingUp, label: "View Reports", color: "primary", href: "/products" }
            ].map((action, index) => (
              <button 
                key={index}
                className="btn-glass group text-center hover:scale-105 animate-fade-up"
                style={{animationDelay: `${900 + index * 100}ms`}}
                onClick={() => window.location.href = action.href}
              >
                <div className={`mx-auto mb-3 p-3 rounded-xl bg-${action.color}/10 group-hover:bg-${action.color}/20 transition-colors`}>
                  <action.icon className={`h-6 w-6 text-${action.color}`} />
                </div>
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 floating"
            onClick={() => navigate('/inventory')}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-16 right-0 bg-background/90 backdrop-blur-sm border rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-sm font-medium whitespace-nowrap">Quick Add Transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;