import { Download } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useToasts } from '../hooks/useToasts';
import ToastStack from '../components/common/ToastStack';

const REPORTS = ['Inventory Report', 'Warehouse Performance', 'Shipment Report', 'Order Report'];

const escapeCsv = (value) => {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapePdfText = (value) => String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const buildPdfBlob = (title, rows) => {
  const lines = [`Shop360 — ${title}`, `Generated: ${new Date().toLocaleString()}`, '', ...rows];
  const content = lines
    .map((line, index) => `BT /F1 12 Tf 50 ${760 - index * 18} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

function exportCsv(reportName, rows) {
  const safeName = reportName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const csv = rows.length
    ? [rows[0].map((cell) => escapeCsv(cell)), ...rows.slice(1).map((row) => row.map((cell) => escapeCsv(cell))).map((row) => row.join(','))].join('\n')
    : '';

  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${safeName}.csv`);
}

function exportPdf(reportName, rows) {
  const safeName = reportName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const pdf = buildPdfBlob(reportName, rows.map((row) => row.join(' | ')));
  downloadBlob(pdf, `${safeName}.pdf`);
}

function getReportRows(reportName, { inventory, shipments, pipeline, dueToday, warehouseName }) {
  switch (reportName) {
    case 'Inventory Report':
      return [
        ['SKU', 'Product', 'Category', 'Vendor', 'Qty', 'Bin', 'Zone'],
        ...inventory.map((item) => [item.sku, item.name, item.category, item.vendor, item.qty, item.bin, item.zone]),
      ];
    case 'Warehouse Performance':
      return [
        ['Metric', 'Value'],
        ['Warehouse', warehouseName || 'North Hub'],
        ['Total Inventory Units', inventory.reduce((sum, item) => sum + Number(item.qty || 0), 0)],
        ['Low Stock Items', inventory.filter((item) => Number(item.qty || 0) <= Number(item.threshold || 0)).length],
        ['Pending Inbound', shipments.filter((item) => item.status === 'pending').length],
        ['Due Today', dueToday],
        ['Orders Pending', pipeline.pending || 0],
        ['Orders Confirmed', pipeline.confirmed || 0],
        ['Orders Picked', pipeline.picked || 0],
      ];
    case 'Shipment Report':
      return [
        ['ASN', 'SKU', 'Vendor', 'Qty', 'Status', 'Arrived At'],
        ...shipments.map((item) => [item.id, item.sku, item.vendor, item.qty, item.status, item.arrivedAt || item.receivedAt || '—']),
      ];
    case 'Order Report':
      return [
        ['Stage', 'Orders'],
        ['Pending', pipeline.pending || 0],
        ['Confirmed', pipeline.confirmed || 0],
        ['Picked', pipeline.picked || 0],
        ['Packed', pipeline.packed || 0],
        ['Shipped', pipeline.shipped || 0],
        ['Out For Delivery', pipeline.out_for_delivery || 0],
        ['Delivered', pipeline.delivered || 0],
        ['Due Today', dueToday],
      ];
    default:
      return [['Metric', 'Value']];
  }
}

function ReportCard({ name, rows, onExport }) {
  return (
    <div className="rounded-2xl border border-[#E8DFC8] bg-[#F9F3E8] p-4 shadow-sm">
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#1A1A1A]">{name}</h2>
          <p className="mt-2 text-xs uppercase tracking-[.12em] text-[#746D62]">{rows} rows</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onExport('PDF')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D8C5A4] bg-[#F1E6D2] px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition hover:bg-[#E8DCC0]"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            type="button"
            onClick={() => onExport('Excel')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D8C5A4] bg-[#F1E6D2] px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition hover:bg-[#E8DCC0]"
          >
            <Download className="h-3.5 w-3.5" />
            Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const inventory = useSelector((state) => state.warehouse.inventory.items);
  const shipments = useSelector((state) => state.warehouse.receiving.items);
  const pipeline = useSelector((state) => state.warehouse.orderSummary.pipeline);
  const dueToday = useSelector((state) => state.warehouse.orderSummary.dueToday);
  const warehouseName = useSelector((state) => state.warehouse.core.profile?.warehouseName);
  const { toasts, push } = useToasts();

  const reportData = useMemo(
    () =>
      REPORTS.reduce((acc, name) => {
        const rows = getReportRows(name, { inventory, shipments, pipeline, dueToday, warehouseName });
        acc[name] = { rows, totalRows: Math.max(0, rows.length - 1) };
        return acc;
      }, {}),
    [inventory, shipments, pipeline, dueToday, warehouseName]
  );

  const handleExport = (reportName, format) => {
    const rows = reportData[reportName]?.rows || [];
    if (!rows.length) return;

    if (format === 'PDF') {
      exportPdf(reportName, rows);
      push(`${reportName} PDF downloaded successfully.`, 'ok');
      return;
    }

    exportCsv(reportName, rows);
    push(`${reportName} CSV downloaded successfully.`, 'ok');
  };

  return (
    <div className="px-5 py-7 lg:px-8">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#8F6739]">Operations · Reports & Export</p>
        <h1 className="wh-editorial mt-3 text-4xl font-bold leading-tight text-[#1A1A1A]">Generate a Report</h1>
        <p className="mt-2 text-sm text-[#746D62]">Export warehouse data for record-keeping or vendor/admin review.</p>
      </div>

      <div className="rounded-2xl border border-[#E8DFC8] bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {REPORTS.map((reportName) => (
            <ReportCard
              key={reportName}
              name={reportName}
              rows={reportData[reportName]?.totalRows || 0}
              onExport={(format) => handleExport(reportName, format)}
            />
          ))}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
