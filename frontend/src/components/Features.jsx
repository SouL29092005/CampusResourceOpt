import {
  BookOpen,
  FlaskConical,
  Activity,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Library Management",
    description:
      "Search, issue, and track books digitally with ease.",
    icon: BookOpen,
  },
  {
    title: "Lab Equipment Booking",
    description:
      "Fair booking system with waitlists and usage tracking.",
    icon: FlaskConical,
  },
  {
    title: "Resource Usage Tracking",
    description:
      "Track availability, usage history, and equipment health.",
    icon: Activity,
  },
  {
    title: "Admin Control",
    description:
      "Monitor resource usage and prevent misuse.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-20 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium bg-white shadow-sm">
            Platform Features
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Everything You Need To Manage
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Campus Resources
            </span>
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            A centralized platform for managing library resources,
            laboratory equipment, room bookings, and campus facilities.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} />
                  </div>

                  <CardTitle className="pt-4 text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Bottom Accent Line */}
                <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-b-xl" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}