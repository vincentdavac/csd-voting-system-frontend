import {
  Search,
  Plus,
  Eye,
  Edit3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AddProgram from './AddProgram';
import ViewProgram from './ViewProgram';
import UpdateProgram from './UpdateProgram';
import API_BASE_URL from '../../../config/api';

export interface PROGRAM {
  id: number;
  image: string;
  name: string;
  description: string;
  dateTime: string;
}

const ProgramTable = () => {
  const [programsData, setProgramsData] = useState<PROGRAM[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<PROGRAM | null>(null);
  const [selectedProgramForUpdate, setSelectedProgramForUpdate] =
    useState<PROGRAM | null>(null);

  const rowsPerPage = 8;

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/programs`, {
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();

      if (json.data) {
        const mapped = json.data.map((p: any) => ({
          id: p.id,
          image: p.attributes.image || 'https://via.placeholder.com/50',
          name: p.attributes.name,
          description: p.attributes.description,
          dateTime: `${p.attributes.createdDate} @ ${p.attributes.createdTime}`,
        }));
        setProgramsData(mapped);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const filteredData = programsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="rounded-[32px] border border-stroke bg-white p-6 shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
      {/* Table Header / Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-6 dark:border-strokedark">
        <div>
          <h2 className="text-xl font-black text-black dark:text-white">
            Program Directory
          </h2>
          <p className="text-xs font-medium text-gray-400">
            Manage and monitor all active academic programs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-64 rounded-2xl border-2 border-gray-50 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="overflow-hidden">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="pb-4 pl-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Reference
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Program Identity
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Overview
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Created Date
              </th>
              <th className="pb-4 pr-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Management
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-strokedark">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="py-8">
                    <div className="h-12 w-full rounded-xl bg-gray-100 dark:bg-meta-4"></div>
                  </td>
                </tr>
              ))
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-30">
                    <PackageOpen size={48} />
                    <p className="mt-2 font-bold italic">
                      No matching programs found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((p, index) => (
                <tr
                  key={p.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-meta-4/20"
                >
                  <td className="py-5 pl-4">
                    <span className="font-mono text-xs font-bold text-gray-400">
                      #{(page - 1) * rowsPerPage + index + 1}
                    </span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 rounded-xl border-2 border-white shadow-sm dark:border-strokedark">
                        <img
                          src={p.image}
                          className="h-full w-full object-cover rounded-lg"
                          alt=""
                        />
                      </div>
                      <span className="font-bold text-black dark:text-white leading-tight">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 max-w-[240px]">
                    <p className="truncate text-gray-500 dark:text-gray-400">
                      {p.description}
                    </p>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                      <Calendar size={14} className="text-primary" />
                      {p.dateTime}
                    </div>
                  </td>
                  <td className="py-5 pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProgram(p)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-blue-500/10"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setSelectedProgramForUpdate(p)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-all hover:bg-amber-600 hover:text-white dark:bg-amber-500/10"
                        title="Update Program"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Premium Pagination */}
      <div className="mt-8 flex items-center justify-between border-t border-stroke pt-6 dark:border-strokedark">
        <p className="text-xs font-bold text-gray-400">
          Showing{' '}
          <span className="text-black dark:text-white">
            {currentData.length}
          </span>{' '}
          of {filteredData.length} Programs
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex h-10 items-center justify-center rounded-xl bg-gray-50 px-4 text-xs font-black dark:bg-meta-4">
            PAGE {page} OF {totalPages || 1}
          </div>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddProgram onClose={() => setShowAdd(false)} onAdd={fetchPrograms} />
      )}
      {selectedProgram && (
        <ViewProgram
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
      {selectedProgramForUpdate && (
        <UpdateProgram
          program={selectedProgramForUpdate}
          onClose={() => setSelectedProgramForUpdate(null)}
          onUpdate={fetchPrograms}
        />
      )}
    </div>
  );
};

export default ProgramTable;
