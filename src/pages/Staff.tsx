
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Users, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  employeeId: string;
}

export const sampleStaff: Staff[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@waterpark.com",
    phone: "+1-555-0123",
    department: "Pool Operations",
    position: "Manager",
    hireDate: new Date("2023-01-15"),
    status: "active",
    employeeId: "EMP001"
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@waterpark.com",
    phone: "+1-555-0124",
    department: "Guest Services",
    position: "Supervisor",
    hireDate: new Date("2022-05-20"),
    status: "active",
    employeeId: "EMP002"
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Wilson",
    email: "mike.wilson@waterpark.com",
    phone: "+1-555-0125",
    department: "Safety",
    position: "Lifeguard",
    hireDate: new Date("2023-06-01"),
    status: "active",
    employeeId: "EMP003"
  },
  {
    id: 4,
    firstName: "Lisa",
    lastName: "Chen",
    email: "lisa.chen@waterpark.com",
    phone: "+1-555-0126",
    department: "Recreation",
    position: "Staff Member",
    hireDate: new Date("2023-03-10"),
    status: "inactive",
    employeeId: "EMP004"
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@waterpark.com",
    phone: "+1-555-0127",
    department: "Maintenance",
    position: "Maintenance Technician",
    hireDate: new Date("2021-11-22"),
    status: "active",
    employeeId: "EMP005"
  },
  {
    id: 6,
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@waterpark.com",
    phone: "+1-555-0128",
    department: "Food & Beverage",
    position: "Food Service Worker",
    hireDate: new Date("2024-02-18"),
    status: "active",
    employeeId: "EMP006"
  }
];

const Staff = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>(sampleStaff);

  const [formData, setFormData] = useState<Omit<Staff, 'id' | 'hireDate'> & { hireDate: Date | undefined }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: undefined,
    status: 'active',
    employeeId: ''
  });

  const departments = [
    "Pool Operations", "Guest Services", "Safety", "Recreation", "Maintenance", "Funworld", "waterworld", "Administration", "Food & Beverage", "Retail"
  ];
  const positions = [
    "Manager", "Supervisor", "Staff Member", "Lifeguard", "Maintenance Technician", "Guest Service Representative", "Food Service Worker", "Retail Associate", "Administrator"
  ];

  const filteredStaff = staffList.filter(staff =>
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, hireDate: date });
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.position || !formData.employeeId) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }
    return true;
  }

  const handleAddStaff = () => {
    if (!validateForm()) return;

    if (staffList.some(staff => staff.employeeId === formData.employeeId)) {
      toast({ title: "Duplicate Employee ID", description: "An employee with this ID already exists.", variant: "destructive" });
      return;
    }

    const newStaff: Staff = {
      id: staffList.length + 1,
      ...formData,
      hireDate: formData.hireDate || new Date(),
    };
    setStaffList([...staffList, newStaff]);
    toast({ title: "Staff Added", description: `${newStaff.firstName} ${newStaff.lastName} has been added.` });
    setIsAddDialogOpen(false);
    resetFormData();
  };

  const handleEditStaff = () => {
    if (!currentStaff || !validateForm()) return;
    
    if (staffList.some(staff => staff.employeeId === formData.employeeId && staff.id !== currentStaff.id)) {
      toast({ title: "Duplicate Employee ID", description: "An employee with this ID already exists.", variant: "destructive" });
      return;
    }

    const updatedStaff: Staff = {
      id: currentStaff.id,
      ...formData,
      hireDate: formData.hireDate || currentStaff.hireDate,
    };
    setStaffList(staffList.map(staff => staff.id === currentStaff.id ? updatedStaff : staff));
    toast({ title: "Staff Updated", description: `${updatedStaff.firstName} ${updatedStaff.lastName}'s details have been updated.` });
    setIsEditDialogOpen(false);
    resetFormData();
  };

  const openEditDialog = (staff: Staff) => {
    setCurrentStaff(staff);
    setFormData({
      ...staff,
      hireDate: staff.hireDate,
    });
    setIsEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      firstName: "", lastName: "", email: "", phone: "", department: "", position: "", hireDate: undefined, status: 'active', employeeId: ''
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-primary">Staff Management</h1>
            <p className="text-muted-foreground">Manage your waterpark staff members</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) resetFormData(); }}>
            <DialogTrigger asChild>
              <Button className="hover:scale-105 transition-transform">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details for the new staff member.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Form fields */}
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="firstName" className="text-right">First Name*</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lastName" className="text-right">Last Name*</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email*</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="employeeId" className="text-right">Employee ID*</Label><Input id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="department" className="text-right">Department*</Label><Select value={formData.department} onValueChange={(v) => handleSelectChange("department", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="position" className="text-right">Position*</Label><Select value={formData.position} onValueChange={(v) => handleSelectChange("position", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select position" /></SelectTrigger><SelectContent>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Hire Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="col-span-3 justify-start text-left font-normal">{formData.hireDate ? format(formData.hireDate, "PPP") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.hireDate} onSelect={handleDateChange} initialFocus /></PopoverContent></Popover></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="status" className="text-right">Status</Label><Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddStaff}>Add Staff</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="glass border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Staff List</CardTitle>
              <CardDescription>{filteredStaff.length} staff members found</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-primary/5 hover-lift transition-all">
                    <TableCell className="font-medium">{staff.employeeId}</TableCell>
                    <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell><Badge variant="outline">{staff.department}</Badge></TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{format(staff.hireDate, "PP")}</TableCell>
                    <TableCell><Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>{staff.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(staff)} className="hover:scale-105">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) resetFormData(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update the details for this staff member.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="firstName" className="text-right">First Name*</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lastName" className="text-right">Last Name*</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email*</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="employeeId" className="text-right">Employee ID*</Label><Input id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="department" className="text-right">Department*</Label><Select value={formData.department} onValueChange={(v) => handleSelectChange("department", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="position" className="text-right">Position*</Label><Select value={formData.position} onValueChange={(v) => handleSelectChange("position", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select position" /></SelectTrigger><SelectContent>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Hire Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="col-span-3 justify-start text-left font-normal">{formData.hireDate ? format(formData.hireDate, "PPP") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.hireDate} onSelect={handleDateChange} initialFocus /></PopoverContent></Popover></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="status" className="text-right">Status</Label><Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditStaff}>Update Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
