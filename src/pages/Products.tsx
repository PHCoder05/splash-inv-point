import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Package, AlertTriangle } from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      description: "Pool Noodles",
      unit: "PCS",
      rate: 5.99,
      quantity: 150,
      minStock: 50,
      category: "Pool Equipment"
    },
    {
      id: 2,
      description: "Sunscreen SPF 50",
      unit: "BTL",
      rate: 12.99,
      quantity: 45,
      minStock: 20,
      category: "Safety"
    },
    {
      id: 3,
      description: "Pool Towels",
      unit: "PCS",
      rate: 15.99,
      quantity: 80,
      minStock: 30,
      category: "Amenities"
    },
    {
      id: 4,
      description: "Pool Floats",
      unit: "PCS",
      rate: 25.99,
      quantity: 12,
      minStock: 15,
      category: "Pool Equipment"
    },
    {
      id: 5,
      description: "Water Slides Maintenance Kit",
      unit: "KIT",
      rate: 89.99,
      quantity: 5,
      minStock: 3,
      category: "Maintenance"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= minStock) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your waterpark inventory products</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="glass border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Inventory
              </CardTitle>
              <CardDescription>
                {filteredProducts.length} products total
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate ($)</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.quantity, product.minStock);
                  return (
                    <TableRow key={product.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.quantity <= product.minStock && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>{product.rate.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">{product.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;