import jsPDF from "jspdf";
export default function DownloadOrderPdf({ order }: { order: any }) {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(`주문번호: ${order.id}`, 10, 10);
    doc.text(`주문자: ${order.user?.name || "-"}`, 10, 20);
    doc.text(`금액: ${order.amount || 0}원`, 10, 30);
    doc.save(`order_${order.id}.pdf`);
  };
  return <button onClick={handleDownload} className="bg-blue-500 text-white px-3 py-1 rounded">PDF 다운로드</button>;
}
