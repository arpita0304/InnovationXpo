import { useEffect, useState } from "react";
import { data, Link } from "react-router-dom";
import {
  Shield,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Camera,
  Search,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

type Case = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  area: string;
  photo?: string;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  cameraMatched?: string;
  zoneStatus?: string;
  createdAt: string;
};

const getZoneBadge = (zone?: string) => {
  if (!zone) return { label: "UNKNOWN", cls: "bg-gray-100 text-gray-600" };
  const z = zone.toUpperCase();
  if (z === "HIGH") return { label: "HIGH RISK", cls: "bg-red-100 text-red-700" };
  if (z === "MEDIUM") return { label: "MEDIUM", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "LOW", cls: "bg-green-100 text-green-700" };
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchCases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/cases`);
      if (!res.ok) throw new Error("Failed to fetch cases");
      const data = await res.json();
      setCases(data);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message || "Could not load cases");
    } finally {
      setLoading(false);
    }
    console.log("Fetched cases:", data);
  };

  useEffect(() => {
    fetchCases();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCases, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.area.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const total = cases.length;
  const highRisk = cases.filter((c) => c.zoneStatus?.toUpperCase() === "HIGH").length;
  const matched = cases.filter((c) => c.cameraMatched).length;
  const today = cases.filter(
    (c) => new Date(c.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Guardian AI</h1>
              <p className="text-xs text-gray-500">Missing Person Surveillance</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-gray-500 hover:text-black">Home</Link>
            <Link to="/dashboard" className="text-sm font-medium text-blue-600">Dashboard</Link>
            <Link to="/cctv" className="text-sm text-gray-500 hover:text-black">CCTV Monitor</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cases Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={fetchCases}
            disabled={loading}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Cases" value={total} bg="bg-blue-50" />
          <StatCard icon={<Clock className="w-5 h-5 text-purple-600" />} label="Registered Today" value={today} bg="bg-purple-50" />
          <StatCard icon={<Camera className="w-5 h-5 text-green-600" />} label="Camera Matched" value={matched} bg="bg-green-50" />
          <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-600" />} label="High Risk Zones" value={highRisk} bg="bg-red-50" />
        </div>

        {/* SEARCH */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error} — Make sure the backend is running on port 5000.
          </div>
        )}

        {/* LOADING STATE */}
        {loading && !error && (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading cases...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {search ? "No cases match your search." : "No cases registered yet."}
            </p>
            {!search && (
              <Link to="/#register" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                Register the first case →
              </Link>
            )}
          </div>
        )}

        {/* CASES TABLE */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Registered Cases</h3>
              <span className="text-xs text-gray-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Person</th>
                    <th className="px-6 py-3">Age / Gender</th>
                    <th className="px-6 py-3">Last Seen Area</th>
                    <th className="px-6 py-3">Zone Risk</th>
                    <th className="px-6 py-3">Camera Match</th>
                    <th className="px-6 py-3">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((c) => {
                    const zone = getZoneBadge(c.zoneStatus);
                    return (
                      <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                        {/* Person */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {c.photo ? (
                              <img
                                src={`${BACKEND_URL}/${c.photo?.replace(/\\/g, "/")}`}
                                alt={c.name}
                                className="w-9 h-9 rounded-full object-cover border"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-gray-900">{c.name}</span>
                          </div>
                        </td>

                        {/* Age/Gender */}
                        <td className="px-6 py-4 text-gray-600">
                          {c.age} · <span className="capitalize">{c.gender}</span>
                        </td>

                        {/* Area */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {c.area}
                          </div>
                        </td>

                        {/* Zone */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${zone.cls}`}>
                            {zone.label}
                          </span>
                        </td>

                        {/* Camera Match */}
                        <td className="px-6 py-4">
                          {c.cameraMatched && c.cameraMatched !== "null" ? (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{c.cameraMatched}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">No match yet</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {formatDate(c.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
  return (
    <div className={`rounded-2xl p-5 border bg-white shadow-sm flex items-center gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
