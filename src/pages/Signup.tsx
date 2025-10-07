// src/pages/Signup.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE, parseError } from "@/utils/api";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Step 2: Profile Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (!email || !password || !username) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username,
          full_name: fullName,
          phone,
          bio,
        }),
      });

      if (!res.ok) {
        const err = await parseError(res);
        toast.error(err.error || "Signup failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const { accessToken, user } = data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user || {}));
        localStorage.setItem("role", user?.is_admin ? "admin" : "creator");
      }

      toast.success("Account created 🎉");
      navigate("/");
    } catch (err) {
      console.error("❌ Signup network error:", err);
      toast.error(`Signup failed: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 ? "Create your account" : "Tell us more about you"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Start your journey with CreatorPulse." : "Complete your profile to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                Next
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4">
               <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little bit about yourself" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Sign up"}
              </Button>
            </form>
          )}

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}