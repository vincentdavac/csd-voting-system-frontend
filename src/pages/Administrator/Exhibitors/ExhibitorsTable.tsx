import { Search, SquarePen, Eye, QrCode, Plus, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import AddExhibitor from './AddExhibitor';
import ViewExhibitor from './ViewExhibitor';
import UpdateExhibitor from './UpdateExhibitor';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrImage: string;
  qrCode: string;
  program_id: number;
}

interface PROGRAM {
  id: number;
  name: string;
}

const toProxyUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url;
  }
};

const ExhibitorsTable = () => {
  const { authUser } = useAuth();
  const [exhibitors, setExhibitors] = useState<EXHIBITOR[]>([]);
  const [programs, setPrograms] = useState<PROGRAM[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );
  const [selectedForUpdate, setSelectedForUpdate] = useState<EXHIBITOR | null>(
    null,
  );

  const rowsPerPage = 10;

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/programs`);
      const json = await res.json();
      const mapped = json.data.map((p: any) => ({
        id: p.id,
        name: p.attributes.name,
      }));
      setPrograms(mapped);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchExhibitors = async () => {
    if (!authUser?.token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/exhibitors`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });
      const json = await res.json();
      const mapped = json.data.map((item: any) => ({
        id: item.id,
        image: item.attributes.image || 'https://via.placeholder.com/50',
        title: item.attributes.project_title,
        description: item.attributes.project_description,
        program: item.attributes.program?.name || 'N/A',
        program_id: item.attributes.program_id,
        qrImage: item.attributes.qr_image || '',
        qrCode: item.attributes.qr_string || 'NO-CODE',
      }));
      setExhibitors(mapped);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchExhibitors();
  }, [authUser?.token]);

  const filteredData = exhibitors.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.qrCode.toLowerCase().includes(search.toLowerCase());
    const matchesProgram =
      programFilter === 'All' || e.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /**
   * Converts any image URL (including SVG) to a PNG base64 string.
   * SVGs are fetched as text, converted to a Blob URL, then drawn
   * onto a canvas at a fixed size so jsPDF can embed them.
   */
  const imageUrlToPngBase64 = (imgUrl: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const isSvg =
        imgUrl.toLowerCase().includes('.svg') ||
        imgUrl.toLowerCase().startsWith('data:image/svg');

      if (isSvg) {
        try {
          // Use a relative proxy path to avoid CORS on the SVG fetch
          const svgRes = await fetch(toProxyUrl(imgUrl));
          if (!svgRes.ok) throw new Error(`SVG fetch failed: ${svgRes.status}`);
          const svgText = await svgRes.text();

          // Build a Blob URL so the browser can load it as an <img>
          const blob = new Blob([svgText], {
            type: 'image/svg+xml;charset=utf-8',
          });
          const blobUrl = URL.createObjectURL(blob);

          const img = new Image();
          img.onload = () => {
            const SIZE = 512; // render SVG at 512×512 px for good resolution
            const canvas = document.createElement('canvas');
            canvas.width = SIZE;
            canvas.height = SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(blobUrl);
              reject('Could not get canvas context');
              return;
            }
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, SIZE, SIZE);
            ctx.drawImage(img, 0, 0, SIZE, SIZE);
            URL.revokeObjectURL(blobUrl);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = (err) => {
            URL.revokeObjectURL(blobUrl);
            reject(err);
          };
          img.src = blobUrl;
        } catch (err) {
          reject(err);
        }
      } else {
        // Non-SVG: use proxy path to avoid CORS
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = toProxyUrl(imgUrl);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 512;
          canvas.height = img.naturalHeight || 512;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('Could not get canvas context');
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
      }
    });
  };

  /**
   * Core PDF builder — accepts an array of exhibitors and saves a PDF.
   */
  const buildAndSaveQrPdf = async (items: EXHIBITOR[], filename: string) => {
    const validItems = items.filter((ex) => ex.qrImage);
    if (validItems.length === 0) {
      alert('No QR images available for the selected exhibitor(s).');
      return;
    }

    const doc = new jsPDF();

    for (let i = 0; i < validItems.length; i++) {
      const ex = validItems[i];
      try {
        if (i > 0) doc.addPage();

        const base64Png = await imageUrlToPngBase64(ex.qrImage);

        // Reset font at the start of every page so all pages are consistent
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(7, 28, 79);
        doc.text('ITECHTIVITY 2026', 105, 40, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(ex.title, 105, 60, { align: 'center', maxWidth: 160 });

        doc.setFontSize(12);
        doc.text(`Program: ${ex.program}`, 105, 72, { align: 'center' });

        doc.addImage(base64Png, 'PNG', 55, 85, 100, 100);

        doc.setFontSize(14);
        doc.setFont('courier', 'bold');
        doc.text(ex.qrCode, 105, 198, { align: 'center' });
      } catch (error) {
        console.error(`Failed to process QR for "${ex.title}":`, error);
      }
    }

    doc.save(filename);
  };

  /** Download PDF for all selected exhibitors */
  const downloadSelectedQRs = () => {
    const toDownload = exhibitors.filter((ex) => selectedIds.includes(ex.id));
    buildAndSaveQrPdf(toDownload, `ITECHTIVITY_QRs_${Date.now()}.pdf`);
  };

  /** Download PDF for a single exhibitor (QR button in table row) */
  const downloadSingleQR = (ex: EXHIBITOR) => {
    buildAndSaveQrPdf([ex], `ITECHTIVITY_QR_${ex.qrCode || ex.id}.pdf`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search title or QR..."
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

          <select
            value={programFilter}
            onChange={(e) => {
              setProgramFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          >
            <option value="All">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={downloadSelectedQRs}
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Download size={18} /> Download PDF ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Plus size={18} /> Add Exhibitor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredData.length &&
                    filteredData.length > 0
                  }
                />
              </th>
              <th className="p-3 font-medium text-black dark:text-white">
                Image
              </th>
              <th className="p-3 font-medium text-black dark:text-white">
                Title
              </th>
              <th className="p-3 font-medium text-black dark:text-white">
                Program
              </th>
              <th className="p-3 font-medium text-black dark:text-white">
                QR Code
              </th>
              <th className="p-3 text-center font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-10">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-gray-500 italic"
                >
                  No exhibitors found.
                </td>
              </tr>
            ) : (
              currentData.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(e.id)}
                      onChange={() => handleSelectRow(e.id)}
                    />
                  </td>
                  <td className="p-3">
                    <img
                      src={e.image}
                      className="h-10 w-10 rounded object-cover border"
                      alt={e.title}
                    />
                  </td>
                  <td className="p-3 font-medium text-black dark:text-white">
                    {e.title}
                  </td>
                  <td className="p-3 text-black dark:text-white">
                    {e.program}
                  </td>
                  <td className="p-3 font-mono text-xs text-black dark:text-white">
                    {e.qrCode}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedExhibitor(e)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedForUpdate(e);
                        setShowUpdate(true);
                      }}
                      className="text-yellow-600 hover:underline flex items-center gap-1"
                    >
                      <SquarePen size={16} /> Edit
                    </button>
                    <button
                      onClick={() => downloadSingleQR(e)}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      <QrCode size={16} /> QR
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {currentData.length} of {filteredData.length}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded border px-4 py-1 disabled:opacity-30"
          >
            ←
          </button>
          <span className="py-1 dark:text-white">
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="rounded border px-4 py-1 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {showAdd && (
        <AddExhibitor
          onClose={() => setShowAdd(false)}
          onAdd={fetchExhibitors}
        />
      )}
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
          onUpdate={fetchExhibitors}
        />
      )}
    </div>
  );
};

export default ExhibitorsTable;
