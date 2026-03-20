import { Link } from 'react-router-dom';
import { LayoutDashboard, ChevronRight, MapPin } from 'lucide-react';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stroke pb-6 dark:border-strokedark">
      {/* PAGE TITLE WITH ACCENT */}
      <div className="relative">
        <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic">
          {pageName}
        </h2>
        <div className="absolute -bottom-1 left-0 h-1 w-12 bg-primary rounded-full"></div>
      </div>

      {/* NAVIGATION CAPSULE */}
      <nav className="rounded-2xl bg-white border border-stroke px-4 py-2 shadow-sm dark:bg-boxdark dark:border-strokedark transition-all hover:shadow-md">
        <ol className="flex items-center gap-2">
          {/* HOME / DASHBOARD LINK */}
          <li className="group">
            <Link
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-primary dark:text-gray-500"
              to="/"
            >
              <LayoutDashboard
                size={14}
                className="group-hover:animate-pulse"
              />
              DASHBOARD
            </Link>
          </li>

          {/* DIVIDER */}
          <li className="text-gray-300 dark:text-gray-600">
            <ChevronRight size={14} strokeWidth={3} />
          </li>

          {/* ACTIVE PAGE BADGE */}
          <li className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20">
            <MapPin size={12} fill="currentColor" fillOpacity={0.2} />
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
