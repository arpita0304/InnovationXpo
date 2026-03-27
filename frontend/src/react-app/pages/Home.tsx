import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Brain,
  AlertTriangle,
  Bell,
  Upload,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Card, CardContent } from "@/react-app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const steps = [
  { icon: Upload, title: "Register", description: "Submit missing person details and photo" },
  { icon: Brain, title: "AI Detection", description: "Our AI scans live CCTV feeds continuously" },
  { icon: AlertTriangle, title: "Risk Analysis", description: "Automated risk assessment and scoring" },
  { icon: Bell, title: "Alert", description: "Instant notifications on potential matches" },
];

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    area: "",
    photo: null as File | null,
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.name || !formData.age || !formData.gender || !formData.area) {
      setErrorMsg("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("age", formData.age);
      payload.append("gender", formData.gender);
      payload.append("area", formData.area);
      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      const res = await fetch(`${BACKEND_URL}/api/cases/register`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      setStatus("success");
      // Reset form
      setFormData({ name: "", gender: "", age: "", area: "", photo: null });

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Guardian AI</h1>
              <p className="text-xs text-muted-foreground">Missing Person Surveillance</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm font-medium text-primary">Home</Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link to="/cctv" className="text-sm font-medium text-muted-foreground hover:text-foreground">CCTV Monitor</Link>
            <a href="#register">
              <Button size="sm">Report Missing</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-20 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <Eye className="w-4 h-4" />
            AI-Powered Surveillance System
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Finding Missing Persons with{" "}
            <span className="text-primary">Intelligent Detection</span>
          </h1>

          <p className="text-muted-foreground mb-8">
            Our AI continuously monitors CCTV networks using facial recognition
            and pattern analysis to locate missing individuals quickly.
          </p>

          <div className="flex justify-center gap-4">
            <a href="#register">
              <Button size="lg" className="gap-2">
                Register Missing Person <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-blue-600" />
                </div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2">Register Missing Person</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Fill in the details below to register a missing person in our AI surveillance system.
          </p>

          <Card>
            <CardContent className="p-8">
              {/* Success Banner */}
              {status === "success" && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Registration submitted successfully! Our AI will begin scanning immediately.</p>
                </div>
              )}

              {/* Error Banner */}
              {status === "error" && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label>Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={status === "loading"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Gender <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      disabled={status === "loading"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Age <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      disabled={status === "loading"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Last Seen Area <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g. Central Station, Park Avenue"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Upload Photo</Label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${formData.photo ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300"}`}>
                    <input
                      type="file"
                      className="hidden"
                      id="photo"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                      disabled={status === "loading"}
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <Upload className={`mx-auto mb-2 ${formData.photo ? "text-blue-500" : "text-gray-400"}`} />
                      <p className="text-sm font-medium">
                        {formData.photo ? formData.photo.name : "Click to upload photo"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10 text-center">
        <p className="text-sm text-slate-400">
          © 2024 Guardian AI — Government Surveillance Initiative
        </p>
      </footer>
    </div>
  );
}
