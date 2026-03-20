import {
  Search,
  SquarePen,
  Eye,
  QrCode,
  Plus,
  Download,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
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

  const getProgramBadge = (program: string) => {
    const styles: Record<string, string> = {
      IT: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
      CS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
      IS: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
      EMC: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20',
    };
    return (
      styles[program.toUpperCase()] ||
      'bg-gray-100 text-gray-700 dark:bg-gray-500/10 border border-gray-200'
    );
  };

  return (
    <div className="rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
      {/* --- TOP BAR: SEARCH & ACTIONS --- */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b border-stroke pb-8 dark:border-strokedark">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white tracking-tight uppercase italic">
            Exhibitor Directory
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              {filteredData.length} Live Registrations
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search & Filter Group */}
          <div className="flex items-center gap-2 rounded-2xl bg-gray-50 p-1 dark:bg-meta-4 shadow-inner">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-56 bg-transparent py-2.5 pl-10 pr-4 text-sm font-bold text-black outline-none placeholder:text-gray-400 dark:text-white"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
              />
            </div>
            <div className="h-6 w-[2px] bg-gray-200 dark:bg-strokedark"></div>
            <select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent px-4 py-2 text-sm font-black uppercase tracking-wider text-black outline-none dark:text-white cursor-pointer"
            >
              <option value="All">All Tracks</option>
              {programs.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={downloadSelectedQRs}
                className="group flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                <Download size={18} className="group-hover:animate-bounce" />
                PDF ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-black text-white shadow-xl transition-all hover:bg-opacity-80 active:scale-95 dark:bg-white dark:text-black"
            >
              <Plus size={18} />
              ADD NEW
            </button>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="pb-4 pl-4">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-md accent-primary"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredData.length &&
                    filteredData.length > 0
                  }
                />
              </th>
              <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                Media
              </th>
              <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                Project Info
              </th>
              <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">
                Program
              </th>
              <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-gray-400">
                QR String
              </th>
              <th className="pb-4 pr-4 text-center font-black text-[10px] uppercase tracking-widest text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-strokedark">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-20 text-center animate-pulse font-bold"
                >
                  Initializing Data...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-24 text-center opacity-30 font-black uppercase tracking-widest"
                >
                  No Matches Found
                </td>
              </tr>
            ) : (
              currentData.map((e) => (
                <tr
                  key={e.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-meta-4/10"
                >
                  <td className="py-6 pl-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded-md accent-primary"
                      checked={selectedIds.includes(e.id)}
                      onChange={() => handleSelectRow(e.id)}
                    />
                  </td>
                  <td className="py-6">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-gray-100 transition-transform group-hover:scale-110 dark:ring-strokedark">
                      <img
                        src={e.image}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="max-w-[240px] truncate text-base font-black text-black dark:text-white">
                      {e.title}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                      UID: {e.id}
                    </p>
                  </td>
                  <td className="py-6 text-center">
                    <span
                      className={`inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${getProgramBadge(
                        e.program,
                      )}`}
                    >
                      {e.program}
                    </span>
                  </td>
                  <td className="py-6 font-mono text-[11px] font-bold text-primary dark:text-blue-400">
                    {e.qrCode}
                  </td>
                  <td className="py-6 pr-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setSelectedExhibitor(e)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-blue-600 hover:text-white dark:bg-meta-4"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedForUpdate(e);
                          setShowUpdate(true);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-amber-500 hover:text-white dark:bg-meta-4"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => downloadSingleQR(e)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-emerald-500 hover:text-white dark:bg-meta-4"
                      >
                        <QrCode size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: PAGINATION --- */}
      <div className="mt-10 flex items-center justify-between border-t border-stroke pt-8 dark:border-strokedark">
        <p className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Showing {currentData.length} / {filteredData.length} Record Set
        </p>

        <div className="flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-100 text-black transition-all hover:bg-gray-100 disabled:opacity-20 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex h-12 items-center gap-1 rounded-2xl bg-gray-50 px-6 dark:bg-meta-4">
            <span className="text-xs font-black text-black dark:text-white">
              {page}
            </span>
            <span className="text-[10px] font-bold text-gray-400">/</span>
            <span className="text-xs font-bold text-gray-400">
              {totalPages || 1}
            </span>
          </div>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-100 text-black transition-all hover:bg-gray-100 disabled:opacity-20 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* MODALS */}
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
