import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, ShoppingCart, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "156",
      description: "Active inventory items",
      icon: Package,
      trend: "+12%"
    },
    {
      title: "Low Stock Items",
      value: "23",
      description: "Items below threshold",
      icon: Warehouse,
      trend: "-5%"
    },
    {
      title: "Today's Orders",
      value: "47",
      description: "Orders processed today",
      icon: ShoppingCart,
      trend: "+8%"
    },
    {
      title: "Revenue",
      value: "$2,847",
      description: "Today's total revenue",
      icon: TrendingUp,
      trend: "+15%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to AquaManager - Your waterpark inventory overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="text-xs text-accent font-medium mt-1">
                {stat.trend} from yesterday
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Stock Added", item: "Pool Noodles", qty: "+50", time: "2 min ago" },
                { action: "Order Placed", item: "Sunscreen", qty: "-15", time: "5 min ago" },
                { action: "Stock Added", item: "Towels", qty: "+25", time: "10 min ago" },
                { action: "Order Placed", item: "Pool Floats", qty: "-8", time: "15 min ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${activity.qty.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.qty}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/10 transition-colors">
                <Package className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">Add Product</p>
              </button>
              <button className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/10 transition-colors">
                <ShoppingCart className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">New Order</p>
              </button>
              <button className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/10 transition-colors">
                <Warehouse className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">Check Stock</p>
              </button>
              <button className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/10 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">View Reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;