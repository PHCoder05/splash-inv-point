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
    <div className="space-y-8 animate-fade-up">
      <div className="glass-card hover-lift">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 floating">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Welcome to AquaManager - Your waterpark inventory overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-0 hover-lift animate-fade-up" style={{animationDelay: '600ms'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Stock Added", item: "Pool Noodles", qty: "+50", time: "2 min ago", type: "add" },
                { action: "Order Placed", item: "Sunscreen", qty: "-15", time: "5 min ago", type: "remove" },
                { action: "Stock Added", item: "Towels", qty: "+25", time: "10 min ago", type: "add" },
                { action: "Order Placed", item: "Pool Floats", qty: "-8", time: "15 min ago", type: "remove" },
              ].map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-300 border border-border/30 hover-lift"
                  style={{animationDelay: `${700 + index * 100}ms`}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activity.type === 'add' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <Package className={`h-4 w-4 ${activity.type === 'add' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${activity.qty.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.qty}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-lift animate-fade-up" style={{animationDelay: '700ms'}}>
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
                { icon: Package, label: "Add Product", color: "primary" },
                { icon: ShoppingCart, label: "New Order", color: "accent" },
                { icon: Warehouse, label: "Check Stock", color: "secondary" },
                { icon: TrendingUp, label: "View Reports", color: "primary" }
              ].map((action, index) => (
                <button 
                  key={index}
                  className="btn-glass group text-center hover:scale-105 animate-fade-up"
                  style={{animationDelay: `${800 + index * 100}ms`}}
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
      </div>
    </div>
  );
};

export default Dashboard;