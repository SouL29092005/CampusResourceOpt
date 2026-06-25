import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden overflow-y-visible">

      {/* Soft Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col">

          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
            <Header />
          </div>

          <main className="flex-1 p-6 md:p-8 overflow-visible">
            <div
              className="
                min-h-full
                rounded-3xl
                border
                bg-white
                shadow-sm
                p-6
              "
            >
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}