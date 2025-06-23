import * as React from "react";
import * as XLSX from "xlsx";
export default function DownloadOrderExcel({ orders }: { orders: any[] }) {
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };
  return <button onClick={handleDownload} className="bg-green-500 text-white px-3 py-1 rounded">엑셀 다운로드</button>;
}
