import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus, CreditCard, Banknote, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  description: string;
  rate: number;
  quantity: number;
  unit: string;
  stock: number;
}

const POS = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    department: "",
    person: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  const products = [
    { id: 1, description: "Pool Noodles", rate: 5.99, unit: "PCS", stock: 150 },
    { id: 2, description: "Sunscreen SPF 50", rate: 12.99, unit: "BTL", stock: 45 },
    { id: 3, description: "Pool Towels", rate: 15.99, unit: "PCS", stock: 80 },
    { id: 4, description: "Pool Floats", rate: 25.99, unit: "PCS", stock: 12 },
    { id: 5, description: "Water Bottle", rate: 3.99, unit: "PCS", stock: 200 }
  ];

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Stock Limit",
          description: "Cannot add more items than available in stock",
          variant: "destructive"
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1, stock: product.stock }]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      const product = products.find(p => p.id === id);
      if (product && newQuantity <= product.stock) {
        setCart(cart.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.rate * item.quantity), 0);
  };

  const processOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing order",
        variant: "destructive"
      });
      return;
    }

    if (!customerDetails.name || !customerDetails.department || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock order processing
    toast({
      title: "Order Processed Successfully!",
      description: `Order total: $${calculateTotal().toFixed(2)} - Payment via ${paymentMethod}`,
    });

    // Clear cart and form
    setCart([]);
    setCustomerDetails({ name: "", department: "", person: "", notes: "" });
    setPaymentMethod("");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-primary mb-2">Point of Sale</h1>
        <p className="text-muted-foreground">Process orders and manage transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Product Selection
            </CardTitle>
            <CardDescription>Add items to cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex-1">
                    <p className="font-medium">{product.description}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.rate.toFixed(2)} per {product.unit}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => addToCart(product)}
                    size="sm"
                    disabled={product.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cart and Order Details */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review and process order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Cart Items:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded border border-border/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">${item.rate.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <p className="text-lg font-bold text-primary">
                    Total: ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Cart is empty</p>
            )}

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="font-medium">Customer Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customerName">Name *</Label>
                  <Input
                    id="customerName"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={customerDetails.department}
                    onChange={(e) => setCustomerDetails({...customerDetails, department: e.target.value})}
                    placeholder="Department"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="person">Handled By</Label>
                <Input
                  id="person"
                  value={customerDetails.person}
                  onChange={(e) => setCustomerDetails({...customerDetails, person: e.target.value})}
                  placeholder="Staff member name"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={customerDetails.notes}
                  onChange={(e) => setCustomerDetails({...customerDetails, notes: e.target.value})}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <Banknote className="h-5 w-5 mb-1" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === "digital" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("digital")}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <Smartphone className="h-5 w-5 mb-1" />
                  <span className="text-xs">Digital</span>
                </Button>
              </div>
            </div>

            {/* Process Order Button */}
            <Button 
              onClick={processOrder}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Process Order - ${calculateTotal().toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POS;