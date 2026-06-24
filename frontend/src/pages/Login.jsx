import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  FlaskConical,
  Building2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const scrollToContact = () => {
    const section = document.getElementById("login-contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      if (user?.name) {
        localStorage.setItem("userName", user.name);
      }

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "lab_admin":
          navigate("/lab-admin/dashboard");
          break;

        case "librarian":
          navigate("/librarian/dashboard");
          break;

        case "faculty":
          navigate("/faculty/dashboard");
          break;

        case "student":
          navigate("/student/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);

      const message =
        err.response?.data?.message ||
        "Invalid email or password";

      alert(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE */}
          <div className="hidden lg:block">
            <div className="max-w-xl">

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h3 className="text-white font-semibold">
                    Campus Resource Optimizer
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Smart Resource Management
                  </p>
                </div>
              </div>

              <h1 className="mt-8 text-6xl font-bold leading-tight text-white">
                Manage Campus
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Resources Smarter
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                One platform to manage library books,
                laboratory equipment, classrooms,
                and campus facilities efficiently.
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Badge className="bg-white/10 text-white border-white/20">
                  Library Management
                </Badge>

                <Badge className="bg-white/10 text-white border-white/20">
                  Equipment Booking
                </Badge>

                <Badge className="bg-white/10 text-white border-white/20">
                  Room Scheduling
                </Badge>

                <Badge className="bg-white/10 text-white border-white/20">
                  Resource Tracking
                </Badge>
              </div>

              {/* Features */}
              <div className="mt-10 space-y-5">

                <div className="flex items-center gap-4 text-slate-300">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Digital Library Management
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <FlaskConical className="h-5 w-5 text-cyan-400" />
                  Lab Equipment Booking
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  Classroom & Room Scheduling
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <h3 className="text-3xl font-bold text-white">
                    1500+
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Books
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <h3 className="text-3xl font-bold text-white">
                    500+
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Equipment
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <h3 className="text-3xl font-bold text-white">
                    98%
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Availability
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LOGIN CARD */}
          <Card className="border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <CardContent className="p-8 md:p-10">

              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  Welcome Back
                </h2>

                <p className="mt-2 text-slate-300">
                  Sign in to continue
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 mt-8"
              >
                <div className="space-y-2">
                  <Label className="text-slate-200">
                    Email
                  </Label>

                  <Input
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="
                      h-12
                      bg-white/5
                      border-white/10
                      text-white
                      placeholder:text-slate-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      className="
                        h-12
                        pr-12
                        bg-white/5
                        border-white/10
                        text-white
                        placeholder:text-slate-500
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="
                    w-full
                    bg-gradient-to-r
                    from-blue-600
                    via-indigo-600
                    to-purple-600
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                    shadow-lg
                    shadow-blue-500/30
                  "
                >
                  Login
                </Button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={scrollToContact}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Need help? Contact Support
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        id="login-contact"
        className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-center gap-8 text-slate-300">

            <div className="flex items-center gap-2">
              <Mail size={18} />
              campus.support@college.edu
            </div>

            <div className="flex items-center gap-2">
              <Phone size={18} />
              +91 98765 43210
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            © 2026 Campus Resource Optimizer. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
