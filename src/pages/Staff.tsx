
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Users } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useCreatePerson, useDepartments, usePeople, useSetPersonActive, useUpdatePerson, useDeletePerson } from "@/hooks/useDatabase";
import type { Department, Person } from "@/types/database";

const Staff = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const { data: people, isLoading: isPeopleLoading } = usePeople();
  const { data: depts } = useDepartments();
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const setPersonActive = useSetPersonActive();
  const deletePerson = useDeletePerson();

  const departments = useMemo(() => (depts || []).map((d: Department) => ({ id: d.id, name: d.name })), [depts]);

  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; department_id: string | null; is_active: 'active' | 'inactive' }>({
    name: "",
    email: "",
    phone: "",
    department_id: null,
    is_active: 'active'
  });

  const filteredPeople = useMemo(() => {
    const list = people || [];
    return list.filter((p) => {
      const departmentName = (p as any).department?.name || "";
      return (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [people, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name) {
      toast({ title: "Missing Fields", description: "Please enter name.", variant: "destructive" });
      return false;
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }
    return true;
  }

  const handleAddStaff = async () => {
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      department_id: formData.department_id || null,
      is_active: formData.is_active === 'active',
    };
    await createPerson.mutateAsync(payload);
    setIsAddDialogOpen(false);
    resetFormData();
  };

  const handleEditStaff = async () => {
    if (!currentPerson || !validateForm()) return;

    await updatePerson.mutateAsync({
      id: currentPerson.id,
      data: {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        department_id: formData.department_id || null,
        is_active: formData.is_active === 'active',
      }
    });
    setIsEditDialogOpen(false);
    resetFormData();
  };

  const openEditDialog = (person: Person) => {
    setCurrentPerson(person);
    setFormData({
      name: person.name,
      email: person.email || "",
      phone: person.phone || "",
      department_id: person.department_id || null,
      is_active: person.is_active ? 'active' : 'inactive',
    });
    setIsEditDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department_id: null,
      is_active: 'active',
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
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name*</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="department_id" className="text-right">Department</Label><Select value={formData.department_id ?? ""} onValueChange={(v) => handleSelectChange("department_id", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="is_active" className="text-right">Status</Label><Select value={formData.is_active} onValueChange={(v) => handleSelectChange("is_active", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddStaff} disabled={createPerson.isPending}>Add Staff</Button>
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
              <CardDescription>{filteredPeople.length} staff members found</CardDescription>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPeopleLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredPeople.map((p) => (
                    <TableRow key={p.id} className="hover:bg-primary/5 hover-lift transition-all">
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell><Badge variant="outline">{(p as any).department?.name ?? '-'}</Badge></TableCell>
                      <TableCell><Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'active' : 'inactive'}</Badge></TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(p)} className="hover:scale-105">Edit</Button>
                        <Button variant={p.is_active ? 'secondary' : 'default'} size="sm" onClick={() => setPersonActive.mutate({ id: p.id, isActive: !p.is_active })}>
                          {p.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => { setDeleteTarget(p); setIsDeleteDialogOpen(true); }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!isPeopleLoading && filteredPeople.length === 0 && (
            <div className="text-sm text-muted-foreground p-4">No staff found. Try a different search or add a new staff member.</div>
          )}
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
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name*</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="department_id" className="text-right">Department</Label><Select value={formData.department_id ?? ""} onValueChange={(v) => handleSelectChange("department_id", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="is_active" className="text-right">Status</Label><Select value={formData.is_active} onValueChange={(v) => handleSelectChange("is_active", v)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditStaff} disabled={updatePerson.isPending}>Update Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the staff record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePerson.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteTarget) {
                  await deletePerson.mutateAsync(deleteTarget.id);
                }
                setIsDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              disabled={deletePerson.isPending}
            >
              {deletePerson.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Staff;
