import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Package, ShoppingCart, Calendar } from "lucide-react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for purchase orders
  const purchases = [
    {
      id: "PO001",
      date: "2025-01-20",
      description: "Pool Noodles",
      qty: 50,
      unit: "PCS",
      rate: 5.99,
      vendor: "AquaSupplies Inc",
      person: "John Smith",
      department: "Pool Operations",
      status: "Received"
    },
    {
      id: "PO002", 
      date: "2025-01-19",
      description: "Sunscreen SPF 50",
      qty: 30,
      unit: "BTL",
      rate: 12.99,
      vendor: "SafeSun Products",
      person: "Sarah Johnson",
      department: "Guest Services",
      status: "Pending"
    }
  ];

  // Sample data for issued items
  const issuedItems = [
    {
      id: "IS001",
      date: "2025-01-20",
      description: "Pool Towels",
      qty: 15,
      unit: "PCS",
      issuedTo: "Lifeguard Station A",
      person: "Mike Wilson",
      department: "Safety",
      status: "Completed"
    },
    {
      id: "IS002",
      date: "2025-01-20", 
      description: "Pool Floats",
      qty: 8,
      unit: "PCS",
      issuedTo: "Kids Pool Area",
      person: "Lisa Chen",
      department: "Recreation",
      status: "In Progress"
    }
  ];

  const exportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Inventory</h1>
            <p className="text-muted-foreground">Track purchase orders and issued items</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportReport('inventory')}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="issued" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Issued Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Track incoming inventory and purchase history
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search purchases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl.No</TableHead>
                      <TableHead>Description of Goods</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rate ($)</TableHead>
                      <TableHead>Unit/Measurement</TableHead>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Person</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase, index) => (
                      <TableRow key={purchase.id} className="hover:bg-primary/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{purchase.description}</TableCell>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.rate.toFixed(2)}</TableCell>
                        <TableCell>{purchase.unit}</TableCell>
                        <TableCell>{purchase.vendor}</TableCell>
                        <TableCell>{purchase.person}</TableCell>
                        <TableCell>{purchase.department}</TableCell>
                        <TableCell className="font-medium">{purchase.qty}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.status === "Received" ? "default" : "secondary"}>
                            {purchase.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issued">
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Issued Items</CardTitle>
                  <CardDescription>
                    Track items issued to departments and staff
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issued items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl.No</TableHead>
                      <TableHead>Description of Goods</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Unit/Measurement</TableHead>
                      <TableHead>Items Issued To</TableHead>
                      <TableHead>Person</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issuedItems.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-primary/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.issuedTo}</TableCell>
                        <TableCell>{item.person}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell className="font-medium">{item.qty}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "Completed" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;