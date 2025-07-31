import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Package, ShoppingCart, Calendar, AlertTriangle, Plus, Loader2, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useInventoryTransactions, useProducts, useVendors, usePeople, useCreateInventoryTransaction, useUpdateInventoryTransaction, useDeleteInventoryTransaction } from "@/hooks/useDatabase";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CreateInventoryTransactionForm } from "@/types/database";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any | null>(null);
  const [validationError, setValidationError] = useState("");

  // Database queries
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useInventoryTransactions();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: vendors } = useVendors();
  const { data: people } = usePeople();

  // Mutations
  const createTransactionMutation = useCreateInventoryTransaction();
  const updateTransactionMutation = useUpdateInventoryTransaction();
  const deleteTransactionMutation = useDeleteInventoryTransaction();

  // Form state
  const [formData, setFormData] = useState<CreateInventoryTransactionForm>({
    product_id: "",
    transaction_type: "purchase",
    quantity: 1,
    unit_price: 0,
    total_amount: 0,
    transaction_date: new Date().toISOString().split('T')[0],
    vendor_id: null,
    person_id: null,
    department_id: null,
    reference_number: "",
    notes: ""
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.person?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name === "quantity" || name === "unit_price" || name === "total_amount"
        ? parseFloat(value) || 0
        : value
    };

    // Auto-calculate total amount
    if (name === "quantity" || name === "unit_price") {
      const quantity = name === "quantity" ? (parseFloat(value) || 0) : newFormData.quantity;
      const unitPrice = name === "unit_price" ? (parseFloat(value) || 0) : newFormData.unit_price;
      newFormData.total_amount = quantity * unitPrice;
    }

    setFormData(newFormData);
    setValidationError(""); // Clear validation error when form changes
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === "" ? null : value
    });
    setValidationError(""); // Clear validation error when selection changes
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        transaction_date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  const handleAddTransaction = async () => {
    // Clear previous validation errors
    setValidationError("");

    // Validate required fields
    if (!formData.product_id) {
      setValidationError("Please select a product");
      return;
    }

    if (!formData.transaction_type) {
      setValidationError("Please select a transaction type");
      return;
    }

    if (formData.quantity <= 0) {
      setValidationError("Quantity must be greater than 0");
      return;
    }

    // Validate stock availability for issue transactions
    if (formData.transaction_type === "issue") {
      const selectedProduct = products?.find(p => p.id === formData.product_id);
      if (selectedProduct && formData.quantity > selectedProduct.quantity) {
        setValidationError(`Insufficient stock. Available: ${selectedProduct.quantity} ${selectedProduct.unit}`);
        return;
      }
    }

    try {
      await createTransactionMutation.mutateAsync(formData);
      resetForm();
      setIsAddTransactionOpen(false);
    } catch (error: any) {
      // Handle database validation errors
      if (error.message && error.message.includes('Insufficient stock')) {
        setValidationError(error.message);
      } else {
        setValidationError("Failed to record transaction. Please try again.");
      }
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setCurrentTransaction(transaction);
    setFormData({
      product_id: transaction.product_id,
      transaction_type: transaction.transaction_type,
      quantity: transaction.quantity,
      unit_price: transaction.unit_price || 0,
      total_amount: transaction.total_amount || 0,
      transaction_date: transaction.transaction_date,
      vendor_id: transaction.vendor_id || null,
      person_id: transaction.person_id || null,
      department_id: transaction.department_id || null,
      reference_number: transaction.reference_number || "",
      notes: transaction.notes || ""
    });
    setSelectedDate(new Date(transaction.transaction_date));
    setIsEditTransactionOpen(true);
  };

  const handleUpdateTransaction = async () => {
    if (!currentTransaction) return;
    
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
      await updateTransactionMutation.mutateAsync({
        id: currentTransaction.id,
        data: formData
      });
      resetForm();
      setIsEditTransactionOpen(false);
      setCurrentTransaction(null);
    } catch (error: any) {
      setValidationError("Failed to update transaction. Please try again.");
    }
  };

  const handleDeleteTransaction = async () => {
    if (!currentTransaction) return;

    try {
      await deleteTransactionMutation.mutateAsync(currentTransaction.id);
      setIsDeleteDialogOpen(false);
      setCurrentTransaction(null);
    } catch (error: any) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      transaction_type: "purchase",
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
      transaction_date: new Date().toISOString().split('T')[0],
      vendor_id: null,
      person_id: null,
      department_id: null,
      reference_number: "",
      notes: ""
    });
    setSelectedDate(new Date());
    setValidationError("");
  };

  const exportReport = (type: string) => {
    // Export functionality for generating reports
    if (!transactions || transactions.length === 0) {
      alert('No data available to export');
      return;
    }

    const csvHeaders = ['Date', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Reference', 'Notes'];
    const csvData = transactions.map(transaction => [
      format(new Date(transaction.transaction_date), 'yyyy-MM-dd'),
      products?.find(p => p.id === transaction.product_id)?.description || 'Unknown Product',
      transaction.transaction_type,
      transaction.quantity,
      transaction.unit_price ? `₹${transaction.unit_price}` : '-',
      transaction.total_amount ? `₹${transaction.total_amount}` : '-',
      transaction.reference_number || '-',
      transaction.notes || '-'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${type}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'issue': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'return': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'adjustment': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  if (transactionsError) {
    return (
      <div className="space-y-6">
        <Card className="glass border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load inventory data. Please check your database connection.</p>
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
            <h1 className="text-3xl font-bold text-primary mb-2">Inventory</h1>
            <p className="text-muted-foreground">Track purchase orders and transactions</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddTransactionOpen} onOpenChange={(open) => {
              setIsAddTransactionOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Record a new inventory transaction
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Validation Error Alert */}
                  {validationError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">Product*</Label>
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
                    <Label htmlFor="transaction_type" className="text-right">Type*</Label>
                    <Select
                      value={formData.transaction_type}
                      onValueChange={(value) => handleSelectChange("transaction_type", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="issue">Issue</SelectItem>
                        <SelectItem value="return">Return</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Quantity*</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max={formData.transaction_type === "issue" ? 
                        (products?.find(p => p.id === formData.product_id)?.quantity || 999) : 999}
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  {formData.transaction_type === "issue" && formData.product_id && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs text-muted-foreground">Available Stock</Label>
                      <div className="col-span-3 text-xs text-muted-foreground">
                        {products?.find(p => p.id === formData.product_id)?.quantity || 0} {
                          products?.find(p => p.id === formData.product_id)?.unit || ''
                        }
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit_price" className="text-right">Unit Price</Label>
                    <Input
                      id="unit_price"
                      name="unit_price"
                      type="number"
                      step="0.01"
                      value={formData.unit_price}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total_amount" className="text-right">Total Amount</Label>
                    <Input
                      id="total_amount"
                      name="total_amount"
                      type="number"
                      step="0.01"
                      value={formData.total_amount}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="transaction_date" className="text-right">Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="col-span-3 justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vendor_id" className="text-right">Vendor</Label>
                    <Select
                      value={formData.vendor_id}
                      onValueChange={(value) => handleSelectChange("vendor_id", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors?.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="person_id" className="text-right">Person</Label>
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
                    <Label htmlFor="reference_number" className="text-right">Reference</Label>
                    <Input
                      id="reference_number"
                      name="reference_number"
                      value={formData.reference_number}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="PO-001"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddTransaction}
                    disabled={
                      createTransactionMutation.isPending ||
                      !formData.product_id ||
                      !formData.transaction_type ||
                      formData.quantity <= 0 ||
                      (formData.transaction_type === "issue" && 
                       formData.quantity > (products?.find(p => p.id === formData.product_id)?.quantity || 0))
                    }
                  >
                    {createTransactionMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Add Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => exportReport('inventory')}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    {transactionsLoading ? "Loading..." : `${filteredTransactions.length} transactions total`}
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
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
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Person</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-primary/5">
                          <TableCell>{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell className="font-medium">{transaction.reference_number || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.product?.description || 'Unknown Product'}</p>
                              <p className="text-xs text-muted-foreground">{transaction.product?.unit || ''}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getTransactionTypeColor(transaction.transaction_type)}
                            >
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(transaction.unit_price)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.total_amount)}
                          </TableCell>
                          <TableCell>{transaction.vendor?.name || '-'}</TableCell>
                          <TableCell>{transaction.person?.name || '-'}</TableCell>
                          <TableCell>
                            <div className="max-w-32 truncate" title={transaction.notes || ''}>
                              {transaction.notes || '-'}
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
                                  onClick={() => handleEditTransaction(transaction)}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentTransaction(transaction);
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
                        <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No transactions found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditTransactionOpen} onOpenChange={(open) => {
        setIsEditTransactionOpen(open);
        if (!open) {
          resetForm();
          setCurrentTransaction(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as Add Transaction but with update functionality */}
            {validationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {/* Form fields - same as add transaction */}
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

            {/* Add all other form fields similar to the add dialog */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_transaction_type" className="text-right">Type*</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => handleSelectChange("transaction_type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
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
              <Label htmlFor="edit_unit_price" className="text-right">Unit Price</Label>
              <Input
                id="edit_unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_total_amount" className="text-right">Total Amount</Label>
              <Input
                id="edit_total_amount"
                name="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_reference_number" className="text-right">Reference</Label>
              <Input
                id="edit_reference_number"
                name="reference_number"
                value={formData.reference_number}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="PO-001"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_notes" className="text-right">Notes</Label>
              <Textarea
                id="edit_notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleUpdateTransaction}
              disabled={updateTransactionMutation.isPending}
            >
              {updateTransactionMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Update Transaction
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
                This action cannot be undone. This will permanently delete the transaction record
                {currentTransaction && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Transaction:</strong> {currentTransaction.product?.description} - {currentTransaction.transaction_type} - Qty: {currentTransaction.quantity}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTransactionMutation.isPending ? (
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

export default Inventory;