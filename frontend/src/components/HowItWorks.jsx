import {
  LogIn,
  Search,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const steps = [
  {
    title: "Login",
    description: "Sign in securely using your campus account.",
    icon: LogIn,
  },
  {
    title: "Browse Resources",
    description:
      "Explore books, equipment, labs, and available rooms.",
    icon: Search,
  },
  {
    title: "Book or Join Waitlist",
    description:
      "Reserve resources instantly or join the waitlist if unavailable.",
    icon: CalendarCheck,
  },
  {
    title: "Use & Return",
    description:
      "Resource status updates automatically when your booking ends.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium shadow-sm">
            Simple Process
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            How It Works
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Get access to campus resources in just a few simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20">
          {/* Desktop Connector Line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200" />

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative text-center group"
                >
                  {/* Number Circle */}
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon size={30} />
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-0 right-1/2 translate-x-8 -translate-y-2 h-7 w-7 rounded-full bg-white border shadow text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>

                  <Card className="mt-6 border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}