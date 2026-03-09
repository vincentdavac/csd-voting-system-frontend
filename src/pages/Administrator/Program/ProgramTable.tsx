import { Search, Plus, Eye, SquarePen } from 'lucide-react';
import { useState } from 'react';
import AddProgram from './AddProgram';
import ViewProgram from './ViewProgram';
import UpdateProgram from './UpdateProgram';

interface PROGRAM {
  id: number;
  image: string;
  name: string;
  description: string;
  dateTime: string;
}

const ProgramTable = () => {
  const [programsData, setProgramsData] = useState<PROGRAM[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      image: 'https://via.placeholder.com/50',
      name: `Program ${i + 1}`,
      description:
        i % 2 === 0 ? 'Smart IoT Project' : 'Innovative Tech Project',
      dateTime: new Date().toLocaleString(),
    })),
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<PROGRAM | null>(null);
  const [selectedProgramForUpdate, setSelectedProgramForUpdate] =
    useState<PROGRAM | null>(null);
  const rowsPerPage = 10;

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

  // Function to handle adding a new program
  const handleAddProgram = (newProgram: {
    image: string;
    name: string;
    description: string;
  }) => {
    const nextId =
      programsData.length > 0
        ? programsData[programsData.length - 1].id + 1
        : 1;
    const newEntry: PROGRAM = {
      id: nextId,
      image: newProgram.image || 'https://via.placeholder.com/50',
      name: newProgram.name,
      description: newProgram.description,
      dateTime: new Date().toLocaleString(),
    };
    setProgramsData([newEntry, ...programsData]); // Add to the top
    setShowAdd(false); // Close modal
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* TOP CONTROLS */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search program..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* ADD PROGRAM BUTTON */}
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <Plus size={18} />
          Add Program
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date-Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((p, index) => (
              <tr key={p.id} className="border-b border-stroke">
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>
                <td className="p-3">
                  <img
                    src={p.image}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 max-w-[200px] truncate">{p.description}</td>
                <td className="p-3">{p.dateTime}</td>

                {/* ACTIONS */}
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => setSelectedProgram(p)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>

                  <button
                    onClick={() => setSelectedProgramForUpdate(p)}
                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                  >
                    <SquarePen size={16} /> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded border px-4 py-1 disabled:opacity-40"
        >
          ←
        </button>

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded border px-4 py-1 disabled:opacity-40"
        >
          →
        </button>
      </div>

      {/* ADD PROGRAM MODAL */}
      {showAdd && (
        <AddProgram
          onClose={() => setShowAdd(false)}
          onAdd={handleAddProgram}
        />
      )}

      {/* VIEW PROGRAM MODAL */}
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
          onUpdate={(updatedProgram) => {
            setProgramsData((prev) =>
              prev.map((p) =>
                p.id === updatedProgram.id ? updatedProgram : p,
              ),
            );
          }}
        />
      )}
    </div>
  );
};

export default ProgramTable;
