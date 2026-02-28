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
} from "lucide-react";

import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/react-app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";

const cctvCameras = [
  { id: "CAM-001", location: "Central Station", status: "online", lastActivity: "2 min ago" },
  { id: "CAM-002", location: "City Mall Entrance", status: "online", lastActivity: "1 min ago" },
  { id: "CAM-003", location: "Park Avenue", status: "offline", lastActivity: "15 min ago" },
  { id: "CAM-004", location: "Highway Junction A1", status: "online", lastActivity: "Just now" },
  { id: "CAM-005", location: "Airport Terminal 2", status: "online", lastActivity: "3 min ago" },
  { id: "CAM-006", location: "Bus Depot North", status: "online", lastActivity: "5 min ago" },
];

const steps = [
  { icon: Upload, title: "Register", description: "Submit missing person details and photo" },
  { icon: Brain, title: "AI Detection", description: "Our AI scans live CCTV feeds continuously" },
  { icon: AlertTriangle, title: "Risk Analysis", description: "Automated risk assessment and scoring" },
  { icon: Bell, title: "Alert", description: "Instant notifications on potential matches" },
];

export default function HomePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    lastSeenLocation: "",
    photo: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registration submitted successfully!");
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
            <Link to="/" className="text-sm font-medium text-primary">
              Home
            </Link>

            <Link
              to="/cctv"
              className="text-sm font-medium text-muted-foreground hover:text-foreground">
              CCTV Monitor
            </Link>

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

          {/* ✅ ADDED FOR CI/CD TEST — DO NOT REMOVE */}
        

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

          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Register Missing Person
          </h2>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
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

                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Last Seen Location</Label>
                    <Input
                      value={formData.lastSeenLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastSeenLocation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Upload Photo</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center bg-blue-50">
                    <input
                      type="file"
                      className="hidden"
                      id="photo"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          photo: e.target.files?.[0] || null,
                        })
                      }
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-blue-500" />
                      <p className="text-sm">
                        {formData.photo
                          ? formData.photo.name
                          : "Click to upload image"}
                      </p>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Registration
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