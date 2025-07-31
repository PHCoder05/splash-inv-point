import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  User, 
  Building, 
  Filter,
  Download,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { sampleStaff } from "./Staff";

// Define interfaces
interface Product {
  id: number;
  description: string;
  rate: number;
  unit: string;
  stock: number;
  vendor: string;
}

interface UsageRecord {
  id: number;
  productId: number;
  description: string;
  unit: string;
  vendor: string;
  quantity: number;
  person: string;
  department: string;
  date: Date;
  purpose: string;
}

const InventoryUsage = () => {
  const { toast } = useToast();
  
  // Products data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, description: "Pool Noodles", rate: 5.99, unit: "PCS", stock: 150, vendor: "AquaSupplies Inc" },
    { id: 2, description: "Sunscreen SPF 50", rate: 12.99, unit: "BTL", stock: 45, vendor: "SafeSun Products" },
    { id: 3, description: "Pool Towels", rate: 15.99, unit: "PCS", stock: 80, vendor: "TextilePro" },
    { id: 4, description: "Pool Floats", rate: 25.99, unit: "PCS", stock: 12, vendor: "AquaSupplies Inc" },
    { id: 5, description: "Water Bottle", rate: 3.99, unit: "PCS", stock: 200, vendor: "HydroGoods" },
    { id: 6, description: "16\" Wall Fan CG", rate: 1950.00, unit: "NOS", stock: 5, vendor: "M.M Switchgear" },
    { id: 7, description: "400mm x 7.6mm Cable Ties", rate: 390.00, unit: "Pkt", stock: 6, vendor: "M.M Switchgear" },
    { id: 8, description: "530mm X 7.6mm Cable Ties", rate: 525.00, unit: "PKT", stock: 2, vendor: "M.M Switchgear" },
    { id: 9, description: "LED Rope Light Serial Set", rate: 8675.00, unit: "Box", stock: 3, vendor: "M.M Switchgear" },
    { id: 10, description: "Spare Adaptor for LED Rope", rate: 180.00, unit: "Nos", stock: 4, vendor: "M.M Switchgear" }
  ]);
  
  // People and departments for dropdowns
  const people = sampleStaff.map(staff => `${staff.firstName} ${staff.lastName}`);
  
  const departments = [
    "Pool Operations", "Guest Services", "Safety", "Recreation", "Maintenance", "Funworld", "waterworld"
  ];
  
  // State for form
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [person, setPerson] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [purpose, setPurpose] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for usage history
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([
    {
      id: 1,
      productId: 6,
      description: "16\" Wall Fan CG",
      unit: "NOS",
      vendor: "M.M Switchgear",
      quantity: 2,
      person: "Vikrant",
      department: "Funworld",
      date: new Date(2025, 3, 2), // April 2, 2025
      purpose: "Staff dining area cooling"
    },
    {
      id: 2,
      productId: 7,
      description: "400mm x 7.6mm Cable Ties",
      unit: "Pkt",
      vendor: "M.M Switchgear",
      quantity: 1,
      person: "Vikrant",
      department: "waterworld",
      date: new Date(2025, 3, 3), // April 3, 2025
      purpose: "Rain dance area maintenance"
    }
  ]);
  
  // State for filters
  const [filters, setFilters] = useState({
    person: "",
    department: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    product: ""
  });
  
  // Filtered usage records
  const filteredUsageRecords = usageHistory.filter(record => {
    return (
      (!filters.person || record.person.toLowerCase().includes(filters.person.toLowerCase())) &&
      (!filters.department || record.department.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.product || record.description.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!filters.startDate || record.date >= filters.startDate) &&
      (!filters.endDate || record.date <= filters.endDate)
    );
  });
  
  // Filtered products based on search
  const filteredProducts = products.filter(product => 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle product selection
  const handleProductSelect = (productId: number) => {
    const product = products.find(p => p.id === Number(productId));
    if (product) {
      setSelectedProduct(product);
      setQuantity(1);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!selectedProduct) {
        toast({
        title: "Missing Product",
        description: "Please select a product",
          variant: "destructive"
        });
      return;
    }
    
    if (!person) {
      toast({
        title: "Missing Person",
        description: "Please select the person responsible",
        variant: "destructive"
      });
      return;
    }
    
    if (!department) {
      toast({
        title: "Missing Department",
        description: "Please select a department",
        variant: "destructive"
      });
      return;
    }
    
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be greater than zero",
        variant: "destructive"
      });
      return;
    }

    if (quantity > selectedProduct.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedProduct.stock} ${selectedProduct.unit} available`,
        variant: "destructive"
      });
      return;
    }

    // Create new usage record
    const newRecord: UsageRecord = {
      id: usageHistory.length + 1,
      productId: selectedProduct.id,
      description: selectedProduct.description,
      unit: selectedProduct.unit,
      vendor: selectedProduct.vendor,
      quantity: quantity,
      person: person,
      department: department,
      date: date,
      purpose: purpose
    };
    
    // Update usage history
    setUsageHistory([newRecord, ...usageHistory]);
    
    // Update product stock
    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, stock: p.stock - quantity } 
        : p
    ));
    
    // Show success message
    toast({
      title: "Usage Recorded Successfully",
      description: `${quantity} ${selectedProduct.unit} of ${selectedProduct.description} issued to ${department}`
    });

    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setPerson("");
    setDepartment("");
    setDate(new Date());
    setPurpose("");
    setSearchQuery("");
  };
  
  // Export usage history
  const exportUsageHistory = () => {
    toast({
      title: "Export Started",
      description: "Your usage history export is being prepared"
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Inventory Usage</h1>
        <p className="text-muted-foreground">Track internal resource consumption</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportUsageHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export Usage History
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Form */}
        <Card className="glass border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Record New Usage
            </CardTitle>
            <CardDescription>
              Issue inventory items for internal use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">Product Selection*</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="productSearch"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchQuery && filteredProducts.length > 0 && !selectedProduct && (
                <div className="border rounded-md mt-1 max-h-60 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-primary/5 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        handleProductSelect(product.id);
                        setSearchQuery("");
                      }}
                    >
                      <div>
                    <p className="font-medium">{product.description}</p>
                        <p className="text-xs text-muted-foreground">{product.vendor}</p>
                      </div>
                      <Badge variant="outline">
                        Stock: {product.stock} {product.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedProduct && (
                <div className="p-3 border rounded-md bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{selectedProduct.description}</p>
                    <p className="text-sm text-muted-foreground">
                        {selectedProduct.vendor} • {selectedProduct.unit}
                    </p>
                    </div>
                    <Badge variant="outline">
                      Stock: {selectedProduct.stock}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Change Selection
                  </Button>
                </div>
              )}
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedProduct?.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                disabled={!selectedProduct}
              />
              {selectedProduct && (
                <p className="text-xs text-muted-foreground">
                  Unit: {selectedProduct.unit}
                </p>
              )}
            </div>
            
            {/* Person */}
            <div className="space-y-2">
              <Label htmlFor="person">Person Responsible*</Label>
              <Select value={person} onValueChange={setPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department*</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Usage Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose/Notes</Label>
              <Textarea
                id="purpose"
                placeholder="Explain purpose of usage"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
              />
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!selectedProduct || !person || !department || quantity <= 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Record Usage
            </Button>
          </CardContent>
        </Card>

        {/* Usage History */}
        <Card className="glass border-0 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Usage History</CardTitle>
                <CardDescription>
                  View and filter inventory usage records
                </CardDescription>
              </div>
              
              {/* Filters */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4 p-2">
                    <h4 className="font-medium">Filter Records</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="filterProduct">Product</Label>
                      <Input
                        id="filterProduct"
                        placeholder="Filter by product..."
                        value={filters.product}
                        onChange={(e) => setFilters({...filters, product: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="filterPerson">Person</Label>
                      <Select 
                        value={filters.person} 
                        onValueChange={(value) => setFilters({...filters, person: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All people" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All people</SelectItem>
                          {people.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
              <div className="space-y-2">
                      <Label htmlFor="filterDepartment">Department</Label>
                      <Select 
                        value={filters.department}
                        onValueChange={(value) => setFilters({...filters, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All departments</SelectItem>
                          {departments.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                              className="w-full justify-start text-left font-normal"
                          size="sm"
                        >
                              {filters.startDate ? format(filters.startDate, "PP") : "From"}
                        </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={filters.startDate || undefined}
                              onSelect={(date) => setFilters({...filters, startDate: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                              className="w-full justify-start text-left font-normal"
                          size="sm"
                        >
                              {filters.endDate ? format(filters.endDate, "PP") : "To"}
                        </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={filters.endDate || undefined}
                              onSelect={(date) => setFilters({...filters, endDate: date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFilters({
                          person: "",
                          department: "",
                          startDate: null,
                          endDate: null,
                          product: ""
                        })}
                      >
                        Reset Filters
                      </Button>
                      <Button size="sm">Apply Filters</Button>
                </div>
              </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsageRecords.length > 0 ? (
                    filteredUsageRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.description}</TableCell>
                        <TableCell>{record.unit}</TableCell>
                        <TableCell>{record.vendor}</TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>{record.person}</TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{format(record.date, "PP")}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.purpose}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No usage records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryUsage;