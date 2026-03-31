import { useState } from "react";
import { Link } from "react-router-dom";
import { applicationsApi } from "@/lib/api";
import { Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ApplyLandlordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await applicationsApi.apply(fd);
      setSubmitted(true);
      toast({ title: "Application submitted!", description: "We'll review and get back to you." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Apply as Landlord</h1>
          <p className="mt-1 text-sm text-muted-foreground">Submit your details to list properties on HomeRent</p>
        </div>

        {submitted ? (
          <Card>
            <CardContent className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                <Upload className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">Application Submitted!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Our team will review your application and contact you via email.</p>
              <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Back to Sign In</Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your Details</CardTitle>
              <CardDescription>We need your ID card for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Full Name</Label><Input name="name" required /></div>
                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                <div className="space-y-2"><Label>Phone Number</Label><Input name="phone" type="tel" required /></div>
                <div className="space-y-2"><Label>ID Card Image</Label><Input name="idCard" type="file" accept="image/*" required /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Submitting…" : "Submit Application"}</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-semibold text-primary hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
