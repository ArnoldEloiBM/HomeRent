import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertiesApi, rentalsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Building2, MapPin, Bed, Bath, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatMoney } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function PropertiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: properties = [], refetch } = useQuery({ queryKey: ["properties"], queryFn: () => propertiesApi.list().then((r) => r.data) });
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [rentalOpen, setRentalOpen] = useState<any>(null);
  const [rentalLoading, setRentalLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    try {
      const fd = new FormData(e.currentTarget);
      await propertiesApi.create(fd);
      toast({ title: "Property created!" });
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleRent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRentalLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await rentalsApi.create({
        propertyId: rentalOpen.id,
        startDate: fd.get("startDate") as string,
        endDate: fd.get("endDate") as string,
      });
      toast({ title: "Rental request sent!" });
      setRentalOpen(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setRentalLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {user?.role === "landlord" ? "My Properties" : "Browse Properties"}
          </h1>
          <p className="text-sm text-muted-foreground">{properties.length} properties</p>
        </div>
        {user?.role === "landlord" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Property</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Property</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3">
                <div><Label>Title</Label><Input name="title" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price (RWF/mo)</Label><Input name="price" type="number" required /></div>
                  <div><Label>Location</Label><Input name="location" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Bedrooms</Label><Input name="bedrooms" type="number" required /></div>
                  <div><Label>Bathrooms</Label><Input name="bathrooms" type="number" required /></div>
                </div>
                <div><Label>Description</Label><Input name="description" /></div>
                <div><Label>Image</Label><Input name="image" type="file" accept="image/*" required /></div>
                <Button type="submit" className="w-full" disabled={creating}>{creating ? "Creating…" : "Create Property"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p: any) => (
          <div key={p.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            {(p.image_url || p.imageUrl) && (
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.image_url || p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-card-foreground">{p.title}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{p.bedrooms} Beds</span>
                <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{p.bathrooms} Baths</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary">{formatMoney(p.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                {user?.role === "tenant" && (
                  <Button size="sm" onClick={() => setRentalOpen(p)}>Rent Now</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Building2 className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No properties yet</p>
        </div>
      )}

      <Dialog open={!!rentalOpen} onOpenChange={() => setRentalOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rent: {rentalOpen?.title}</DialogTitle></DialogHeader>
          <form onSubmit={handleRent} className="space-y-3">
            <div><Label>Start Date</Label><Input name="startDate" type="date" required /></div>
            <div><Label>End Date</Label><Input name="endDate" type="date" required /></div>
            <p className="text-sm text-muted-foreground">Monthly price: {rentalOpen && formatMoney(rentalOpen.price)}</p>
            <Button type="submit" className="w-full" disabled={rentalLoading}>{rentalLoading ? "Sending…" : "Submit Rental Request"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
