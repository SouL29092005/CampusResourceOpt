import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Background Effects */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />

      <div className="absolute right-0 top-40 -z-10 h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[120px]" />

      <div className="absolute left-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 py-28">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
            🚀 Smart Campus Resource Management Platform
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
            Optimize Every
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Campus Resource
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            Centralize library management, laboratory equipment booking,
            classroom scheduling, and campus resource allocation into one
            intelligent platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="
              group
              h-14
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-violet-600
              px-8
              text-base
              font-semibold
              text-white
              shadow-[0_10px_30px_rgba(79,70,229,0.35)]
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_20px_40px_rgba(79,70,229,0.45)]
            "
          >
            <Link to="/login">
              Get Started
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>

          <a
            href="#features"
            className="
              flex
              h-14
              items-center
              rounded-xl
              border
              border-slate-300
              bg-white/80
              px-8
              font-semibold
              text-slate-700
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:border-blue-500
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            Explore Features
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
            <p className="text-slate-500">Resource Access</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-indigo-600">100%</h3>
            <p className="text-slate-500">Centralized</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-violet-600">Smart</h3>
            <p className="text-slate-500">Scheduling</p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <Card
          className="
            mt-20
            border-0
            bg-white/80
            backdrop-blur-xl
            shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          "
        >
          <div className="grid gap-6 p-8 md:grid-cols-4">
            <div className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">📚</div>
              <h3 className="mt-4 text-lg font-semibold">Library</h3>
              <p className="mt-2 text-sm text-slate-500">
                Manage books, issues, returns and overdue tracking.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">🧪</div>
              <h3 className="mt-4 text-lg font-semibold">Laboratories</h3>
              <p className="mt-2 text-sm text-slate-500">
                Book equipment and monitor availability.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">🏫</div>
              <h3 className="mt-4 text-lg font-semibold">Room Booking</h3>
              <p className="mt-2 text-sm text-slate-500">
                Reserve classrooms, seminar halls and auditoriums.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">📅</div>
              <h3 className="mt-4 text-lg font-semibold">Scheduling</h3>
              <p className="mt-2 text-sm text-slate-500">
                Manage timetables and avoid booking conflicts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}