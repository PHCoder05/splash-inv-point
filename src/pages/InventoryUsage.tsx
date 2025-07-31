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
  Plus,
  AlertTriangle,
  Loader2,
  AlertCircle,
  TrendingDown,
  Package,
  CheckCircle,
  Pencil,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useUsageRecords, 
  useProducts, 
  usePeople, 
  useDepartments,
  useCreateUsageRecord,
  useUpdateUsageRecord,
  useDeleteUsageRecord
} from "@/hooks/useDatabase";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
<<<<<<< HEAD
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
=======
import type { CreateUsageRecordForm } from "@/types/database";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
>>>>>>> 840a99ca01108c949332564d470d15d0d82be3c6

const InventoryUsage = () => {
  // Database queries
  const { data: usageRecords, isLoading: usageLoading, error: usageError } = useUsageRecords();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: people } = usePeople();
  const { data: departments } = useDepartments();
  
<<<<<<< HEAD
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
=======
  // Mutations
  const createUsageMutation = useCreateUsageRecord();
  const updateUsageMutation = useUpdateUsageRecord();
  const deleteUsageMutation = useDeleteUsageRecord();

  // State
  const [isAddUsageOpen, setIsAddUsageOpen] = useState(false);
  const [isEditUsageOpen, setIsEditUsageOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUsageRecord, setCurrentUsageRecord] = useState<any | null>(null);
  const [validationError, setValidationError] = useState("");

  // Form state for add
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
>>>>>>> 840a99ca01108c949332564d470d15d0d82be3c6
  const [quantity, setQuantity] = useState<number>(1);
  const [person, setPerson] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  // Form state for edit
  const [formData, setFormData] = useState<CreateUsageRecordForm>({
    product_id: "",
    quantity: 1,
    person_id: null,
    department_id: null,
    usage_date: new Date().toISOString().split('T')[0],
    purpose: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [purpose, setPurpose] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  
  // Filters state
  const [filters, setFilters] = useState({
    person: "",
    department: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    product: ""
  });
  
  // Filtered usage records
  const filteredUsageRecords = usageRecords?.filter(record => {
    return (
      (!filters.person || record.person?.name?.toLowerCase().includes(filters.person.toLowerCase())) &&
      (!filters.department || record.department?.name?.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.product || record.product?.description?.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!filters.startDate || new Date(record.usage_date) >= filters.startDate) &&
      (!filters.endDate || new Date(record.usage_date) <= filters.endDate)
    );
  }) || [];
  
  // Filtered products based on search
  const filteredProducts = products?.filter(product => 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setQuantity(1);
      setSearchQuery("");
      setValidationError(""); // Clear any previous validation errors
    }
  };
  
  // Handle quantity change with validation
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setValidationError(""); // Clear validation error when quantity changes
    
    // Validate stock availability
    if (selectedProduct && newQuantity > selectedProduct.quantity) {
      setValidationError(`Insufficient stock. Available: ${selectedProduct.quantity} ${selectedProduct.unit}`);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationError("");
    
    // Validate required fields
    if (!selectedProduct) {
      setValidationError("Please select a product");
      return;
    }
    
    if (!person) {
      setValidationError("Please select a person responsible");
      return;
    }
    
    if (!department) {
      setValidationError("Please select a department");
      return;
    }
    
    if (quantity <= 0) {
      setValidationError("Quantity must be greater than 0");
      return;
    }

    // Validate stock availability
    if (quantity > selectedProduct.quantity) {
      setValidationError(`Insufficient stock. Available: ${selectedProduct.quantity} ${selectedProduct.unit}`);
      return;
    }

    const usageData: CreateUsageRecordForm = {
      product_id: selectedProduct.id,
      quantity: quantity,
      person_id: person,
      department_id: department,
      usage_date: format(date, 'yyyy-MM-dd'),
      purpose: purpose
    };

    try {
      await createUsageMutation.mutateAsync(usageData);
      
      // Reset form
      setSelectedProduct(null);
      setQuantity(1);
      setPerson("");
      setDepartment("");
      setDate(new Date());
      setPurpose("");
      setSearchQuery("");
      setValidationError("");
    } catch (error: any) {
      // Handle database validation errors
      if (error.message && error.message.includes('Insufficient stock')) {
        setValidationError(error.message);
      } else {
        setValidationError("Failed to record usage. Please try again.");
      }
    }
  };
  
  // Export usage history
  const exportUsageHistory = () => {
    console.log("Exporting usage history...");
  };

  // Handle edit usage record
  const handleEditUsageRecord = (record: any) => {
    setCurrentUsageRecord(record);
    setFormData({
      product_id: record.product_id,
      quantity: record.quantity,
      person_id: record.person_id || null,
      department_id: record.department_id || null,
      usage_date: record.usage_date,
      purpose: record.purpose || ""
    });
    setSelectedDate(new Date(record.usage_date));
    setIsEditUsageOpen(true);
  };

  const handleUpdateUsageRecord = async () => {
    if (!currentUsageRecord) return;
    
    setValidationError("");

    // Validate required fields
    if (!formData.product_id) {
      setValidationError("Please select a product");
      return;
    }

    if (formData.quantity <= 0) {
      setValidationError("Quantity must be greater than 0");
      return;
    }

    try {
      await updateUsageMutation.mutateAsync({
        id: currentUsageRecord.id,
        data: formData
      });
      resetForm();
      setIsEditUsageOpen(false);
      setCurrentUsageRecord(null);
    } catch (error: any) {
      setValidationError("Failed to update usage record. Please try again.");
    }
  };

  const handleDeleteUsageRecord = async () => {
    if (!currentUsageRecord) return;

    try {
      await deleteUsageMutation.mutateAsync(currentUsageRecord.id);
      setIsDeleteDialogOpen(false);
      setCurrentUsageRecord(null);
    } catch (error: any) {
      console.error("Failed to delete usage record:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      quantity: 1,
      person_id: null,
      department_id: null,
      usage_date: new Date().toISOString().split('T')[0],
      purpose: ""
    });
    setSelectedDate(new Date());
    setValidationError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setValidationError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === "" ? null : value
    });
    setValidationError("");
  };

  if (usageError) {
    return (
      <div className="space-y-6">
        <Card className="glass border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load usage data. Please check your database connection.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {/* Validation Error Alert */}
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
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
                  disabled={productsLoading}
                />
              </div>
              
              {searchQuery && filteredProducts.length > 0 && !selectedProduct && (
                <div className="border rounded-md mt-1 max-h-60 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-primary/5 cursor-pointer flex justify-between items-center"
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <div>
                        <p className="font-medium">{product.description}</p>
                        <p className="text-xs text-muted-foreground">{product.vendor?.name}</p>
                      </div>
                      <Badge variant={product.quantity <= product.min_stock ? "destructive" : "outline"}>
                        Stock: {product.quantity} {product.unit}
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
                        {selectedProduct.vendor?.name} • {selectedProduct.unit}
                      </p>
                    </div>
                    <Badge variant={selectedProduct.quantity <= selectedProduct.min_stock ? "destructive" : "outline"}>
                      Stock: {selectedProduct.quantity}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => {
                      setSelectedProduct(null);
                      setValidationError("");
                    }}
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
                max={selectedProduct?.quantity || 999}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                disabled={!selectedProduct}
                className={validationError && quantity > (selectedProduct?.quantity || 0) ? "border-destructive" : ""}
              />
              {selectedProduct && (
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Unit: {selectedProduct.unit}</span>
                  <span>Available: {selectedProduct.quantity} {selectedProduct.unit}</span>
                </div>
              )}
              {selectedProduct && quantity > selectedProduct.quantity && (
                <p className="text-xs text-destructive">
                  Cannot consume more than available stock
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
                  {people?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                  {departments?.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
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
              disabled={
                !selectedProduct || 
                !person || 
                !department || 
                quantity <= 0 || 
                quantity > (selectedProduct?.quantity || 0) ||
                createUsageMutation.isPending
              }
            >
              {createUsageMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
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
                  {usageLoading ? "Loading..." : `View and filter ${filteredUsageRecords.length} usage records`}
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
                          {people?.map(p => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
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
                          {departments?.map(d => (
                            <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
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
                              onSelect={(date) => setFilters({...filters, startDate: date || null})}
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
                              onSelect={(date) => setFilters({...filters, endDate: date || null})}
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
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsageRecords.length > 0 ? (
                    filteredUsageRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-primary/5">
                        <TableCell>{format(new Date(record.usage_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.product?.description || 'Unknown Product'}</p>
                            <p className="text-xs text-muted-foreground">{record.product?.unit || ''}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{record.quantity}</TableCell>
                        <TableCell>{record.person?.name || '-'}</TableCell>
                        <TableCell>{record.department?.name || '-'}</TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate" title={record.purpose || ''}>
                            {record.purpose || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditUsageRecord(record)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentUsageRecord(record);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="cursor-pointer text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No usage records found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Usage Record Dialog */}
      <Dialog open={isEditUsageOpen} onOpenChange={(open) => {
        setIsEditUsageOpen(open);
        if (!open) {
          resetForm();
          setCurrentUsageRecord(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Usage Record</DialogTitle>
            <DialogDescription>
              Update the usage record details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {validationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_product" className="text-right">Product*</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => handleSelectChange("product_id", value)}
                disabled={productsLoading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{product.description}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Stock: {product.quantity} {product.unit}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_quantity" className="text-right">Quantity*</Label>
              <Input
                id="edit_quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_person_id" className="text-right">Person</Label>
              <Select
                value={formData.person_id}
                onValueChange={(value) => handleSelectChange("person_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {people?.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_department_id" className="text-right">Department</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => handleSelectChange("department_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_purpose" className="text-right">Purpose</Label>
              <Textarea
                id="edit_purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleUpdateUsageRecord}
              disabled={updateUsageMutation.isPending}
            >
              {updateUsageMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Update Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                This action cannot be undone. This will permanently delete the usage record.
                {currentUsageRecord && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Record:</strong> {currentUsageRecord.product?.description} - Qty: {currentUsageRecord.quantity} - {format(new Date(currentUsageRecord.usage_date), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUsageRecord}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUsageMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryUsage;