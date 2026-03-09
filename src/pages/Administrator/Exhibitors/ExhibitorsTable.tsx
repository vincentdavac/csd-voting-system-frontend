import { Search, SquarePen, Eye, QrCode, Plus } from 'lucide-react';
import { useState } from 'react';
import AddExhibitor from './AddExhibitor';
import ViewExhibitor from './ViewExhibitor';
import UpdateExhibitor from './UpdateExhibitor';
import GenerateQrCode from './GenerateQrCode';
interface EXHIBITOR {
  image: string;
  title: string;
  description: string;
  program: string;
  qrImage: string;
  qrCode: string;
}

const exhibitorsData: EXHIBITOR[] = Array.from({ length: 20 }, (_, i) => ({
  image: 'https://via.placeholder.com/50',
  title: `Project ${i + 1}`,
  description: 'Smart IoT Disaster Monitoring System',
  program: i % 2 === 0 ? 'BSIT' : 'BSCS',
  qrImage:
    'https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=EXHIBIT' +
    (i + 1),
  qrCode: `EXHIBIT-${1000 + i}`,
}));

const rowsPerPage = 10;

const ExhibitorsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );
  const [selectedForUpdate, setSelectedForUpdate] = useState<EXHIBITOR | null>(
    null,
  );
  const [selectedForQr, setSelectedForQr] = useState<EXHIBITOR | null>(null);

  const filteredData = exhibitorsData.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.program.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* TOP CONTROLS */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search exhibitor..."
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

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <Plus size={18} />
          Add Exhibitor
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Program / Course</th>
              <th className="p-3">QR Image</th>
              <th className="p-3">QR Code</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((e, index) => (
              <tr key={index} className="border-b border-stroke">
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>

                <td className="p-3">
                  <img
                    src={e.image}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>

                <td className="p-3 font-medium">{e.title}</td>

                <td className="p-3 max-w-[200px] truncate">{e.description}</td>

                <td className="p-3">{e.program}</td>

                <td className="p-3">
                  <img src={e.qrImage} className="h-10 w-10" />
                </td>

                <td className="p-3 font-mono text-xs">{e.qrCode}</td>

                {/* ACTIONS */}
                <td className="p-3 flex justify-center gap-3">
                  {/* VIEW */}
                  <button
                    onClick={() => setSelectedExhibitor(e)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  {/* UPDATE */}
                  <button
                    onClick={() => {
                      setSelectedForUpdate(e); // separate state for update
                      setShowUpdate(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                  >
                    <SquarePen size={16} />
                    Update
                  </button>

                  {/* QR */}
                  <button
                    onClick={() => setSelectedForQr(e)}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <QrCode size={16} /> QR
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

      {/* ADD MODAL */}
      {showAdd && (
        <AddExhibitor
          onClose={() => setShowAdd(false)}
          onAdd={(data) => {
            console.log('New Exhibitor:', data);
          }}
        />
      )}

      {/* VIEW MODAL */}
      {selectedExhibitor && (
        <ViewExhibitor
          exhibitor={selectedExhibitor}
          onClose={() => setSelectedExhibitor(null)}
        />
      )}

      {selectedForUpdate && showUpdate && (
        <UpdateExhibitor
          exhibitor={selectedForUpdate}
          onClose={() => setShowUpdate(false)}
          onUpdate={(updatedData) => {
            console.log('Updated Exhibitor:', updatedData);
            const index = exhibitorsData.findIndex(
              (e) => e.qrCode === updatedData.qrCode,
            );
            if (index !== -1) {
              exhibitorsData[index] = updatedData;
            }
            setShowUpdate(false);
            setSelectedForUpdate(null);
          }}
        />
      )}

      {/* QR CODE MODAL */}
      {selectedForQr && (
        <GenerateQrCode
          exhibitor={selectedForQr}
          onClose={() => setSelectedForQr(null)}
        />
      )}
    </div>
  );
};

export default ExhibitorsTable;
