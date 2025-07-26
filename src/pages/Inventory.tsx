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

  // Sample data for inventory items
  const inventoryItems = [
    {
      id: 1,
      purchase: {
        description: "16\" Wall Fan CG",
        qty: 5,
        unit: "NOS",
        rate: 1950.00,
        date: "1/4/25",
        vendor: "M.M Switchgear",
        person: "Vikrant",
        department: "Funworld"
      },
      issued: {
        date: "2/4/25",
        description: "16\" Wall Fan CG",
        unit: "Nos",
        qty: 2,
        issuedTo: "Staff Dinning"
      }
    },
    {
      id: 2,
      purchase: {
        description: "400mm x 7.6mm Cable Ties",
        qty: 6,
        unit: "Pkt",
        rate: 390.00,
        date: "1/4/25",
        vendor: "M.M Switchgear",
        person: "Vikrant",
        department: "waterworld"
      },
      issued: {
        date: "3/4/25",
        description: "530mm X 7.6mm Cable Ties",
        unit: "pkt",
        qty: 1,
        issuedTo: "rain dance"
      }
    },
    {
      id: 3,
      purchase: {
        description: "530mm X 7.6mm Cable Ties",
        qty: 2,
        unit: "PKT",
        rate: 525.00,
        date: "2/4/25",
        vendor: "M.M Switchgear",
        person: "",
        department: ""
      },
      issued: {
        date: "",
        description: "",
        unit: "",
        qty: null,
        issuedTo: ""
      }
    },
    {
      id: 4,
      purchase: {
        description: "LED Rope Light Serial Set",
        qty: 3,
        unit: "Box",
        rate: 8675.00,
        date: "4/4/25",
        vendor: "M.M Switchgear",
        person: "",
        department: ""
      },
      issued: {
        date: "",
        description: "",
        unit: "",
        qty: null,
        issuedTo: ""
      }
    },
    {
      id: 5,
      purchase: {
        description: "Spare Adaptor for LED Rope",
        qty: 4,
        unit: "Nos",
        rate: 180.00,
        date: "4/4/25",
        vendor: "M.M Switchgear",
        person: "",
        department: ""
      },
      issued: {
        date: "",
        description: "",
        unit: "",
        qty: null,
        issuedTo: ""
      }
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

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Track purchase orders and issued items
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
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
                      <TableCell 
                        colSpan={8} 
                        className="text-center font-bold bg-primary/10 border"
                      >
                        Purchase of Item
                      </TableCell>
                      <TableCell 
                        colSpan={5} 
                        className="text-center font-bold bg-secondary/10 border"
                      >
                        Issued Items
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="bg-primary/5">Description of Goods</TableHead>
                      <TableHead className="bg-primary/5">Qty</TableHead>
                      <TableHead className="bg-primary/5">Unit/Measurement</TableHead>
                      <TableHead className="bg-primary/5">Rate</TableHead>
                      <TableHead className="bg-primary/5">Date</TableHead>
                      <TableHead className="bg-primary/5">Vendor Name</TableHead>
                      <TableHead className="bg-primary/5">Person</TableHead>
                      <TableHead className="bg-primary/5">Department</TableHead>
                      <TableHead className="bg-secondary/5">Date</TableHead>
                      <TableHead className="bg-secondary/5">Description of Goods</TableHead>
                      <TableHead className="bg-secondary/5">Unit/Measurement</TableHead>
                      <TableHead className="bg-secondary/5">Qty</TableHead>
                      <TableHead className="bg-secondary/5">Item Issued It</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-primary/5">
                        <TableCell>{item.purchase.description}</TableCell>
                        <TableCell className="font-medium">{item.purchase.qty}</TableCell>
                        <TableCell>{item.purchase.unit}</TableCell>
                        <TableCell>{item.purchase.rate.toFixed(2)}</TableCell>
                        <TableCell>{item.purchase.date}</TableCell>
                        <TableCell>{item.purchase.vendor}</TableCell>
                        <TableCell>{item.purchase.person}</TableCell>
                        <TableCell>{item.purchase.department}</TableCell>
                        <TableCell className="bg-secondary/5">{item.issued.date}</TableCell>
                        <TableCell className="bg-secondary/5">{item.issued.description}</TableCell>
                        <TableCell className="bg-secondary/5">{item.issued.unit}</TableCell>
                        <TableCell className="font-medium bg-secondary/5">{item.issued.qty}</TableCell>
                        <TableCell className="bg-secondary/5">
                          {item.issued.issuedTo && (
                            <span>{item.issued.issuedTo}</span>
                          )}
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