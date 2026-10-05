import { jsPDF } from 'jspdf';
import { FareCalculationResult, VehicleTier, CONTACT_INFO } from '../data/gocavData';

export interface QuotePdfParams {
  quoteRef: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientTin?: string;
  flightNumber?: string;
  companyName?: string;
  days?: number;
  pax?: number;
  bags?: number;
  serviceLabel: string;
  pickup: string;
  dropoff: string;
  date: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  vehicle: VehicleTier;
  fare: FareCalculationResult;
  notes?: string;
  isCorporate?: boolean;
  mode?: 'quotation' | 'receipt';
  status?: string;
}

export function generateQuotePdf(params: QuotePdfParams): void {
  const isReceipt = params.mode === 'receipt';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Background Bar
  doc.setFillColor(14, 15, 20);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Brand Name
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('GOCAV TRANSPORT', 16, 18);

  // Subtitle
  doc.setTextColor(230, 230, 235);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Premium Chauffeur & Executive Transport Services', 16, 25);
  doc.setFontSize(8);
  doc.setTextColor(160, 163, 175);
  doc.text('Cavite · NCR · Laguna · Batangas · Northern & Southern Luzon', 16, 31);

  // Reference Box (Top Right)
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(isReceipt ? 'OFFICIAL E-RECEIPT' : 'OFFICIAL QUOTATION', pageWidth - 16, 17, { align: 'right' });

  doc.setTextColor(220, 220, 230);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${isReceipt ? 'Receipt' : 'Quote'} Ref: ${params.quoteRef}`, pageWidth - 16, 23, { align: 'right' });
  doc.text(`Issued: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}`, pageWidth - 16, 29, { align: 'right' });

  y = 48;

  // Client & Itinerary Grid (height adjusted to accommodate BIR TIN and details)
  const boxHeight = params.flightNumber || params.companyName ? 56 : 50;
  doc.setFillColor(248, 249, 251);
  doc.setDrawColor(225, 228, 235);
  doc.roundedRect(14, y, pageWidth - 28, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isReceipt ? 'PASSENGER, BIR COMPLIANCE & BOOKING SPECIFICATIONS' : 'CLIENT & ITINERARY SPECIFICATIONS', 20, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const leftColX = 20;
  const rightColX = 110;

  // Left Column (Client Details & BIR Compliance)
  doc.text('Client / Passenger:', leftColX, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.clientName || 'Valued Guest', leftColX + 32, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Contact Mobile:', leftColX, y + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.clientPhone || 'Not provided', leftColX + 32, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Billing Email:', leftColX, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.clientEmail || 'Tuhamied@gmail.com', leftColX + 32, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('TIN (BIR Reg):', leftColX, y + 37);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.clientTin || '940-158-988-0000 (Non-VAT)', leftColX + 32, y + 37);

  if (params.companyName) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Company Entity:', leftColX, y + 44);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(params.companyName.slice(0, 32), leftColX + 32, y + 44);
  } else if (params.flightNumber) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Flight / Gate:', leftColX, y + 44);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(params.flightNumber, leftColX + 32, y + 44);
  }

  // Right Column (Trip Logistics & Vehicle)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Vehicle Assigned:', rightColX, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(`${params.vehicle.name} (${params.vehicle.models})`, rightColX + 27, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Pickup Origin:', rightColX, y + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.pickup.slice(0, 36) || 'N/A', rightColX + 27, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Drop-off Dest.:', rightColX, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(params.dropoff.slice(0, 36) || 'As designated', rightColX + 27, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Schedule / Date:', rightColX, y + 37);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${params.date} at ${params.pickupTime || 'TBD'}`, rightColX + 27, y + 37);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Capacity / Bags:', rightColX, y + 44);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${params.pax ?? params.vehicle.maxPax} Pax · ${params.bags ?? params.vehicle.maxBags} Bags ${params.days && params.days > 1 ? `· ${params.days} Days` : ''}`, rightColX + 27, y + 44);

  y = y + boxHeight + 8;

  // Breakdown Table Header
  doc.setFillColor(235, 238, 245);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(isReceipt ? 'ITEMIZED RECEIPT BREAKDOWN' : 'ITEMIZED SERVICE / FARE BREAKDOWN', 18, y + 5.5);
  doc.text('AMOUNT (PHP)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 12;

  // Table Lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  params.fare.lines.forEach((line) => {
    doc.setTextColor(51, 65, 85);
    const label = line.label.length > 70 ? line.label.slice(0, 68) + '...' : line.label;
    doc.text(label, 18, y);

    const valFormatted =
      line.val === 0 && line.zeroToll
        ? 'PHP 0 (Free)'
        : (line.val < 0 ? '-PHP ' : 'PHP ') + Math.abs(Math.round(line.val)).toLocaleString();

    if (line.disc) {
      doc.setTextColor(22, 163, 74);
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(valFormatted, pageWidth - 18, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Dotted line separator
    doc.setDrawColor(230, 233, 240);
    doc.line(18, y + 2, pageWidth - 18, y + 2);

    y += 7.5;
  });

  // Total Box
  y += 4;
  doc.setFillColor(14, 15, 20);
  doc.roundedRect(pageWidth - 94, y, 80, 16, 2, 2, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(isReceipt ? 'TOTAL FARE DUE/PAID:' : 'ESTIMATED TOTAL:', pageWidth - 88, y + 10.5);
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`PHP ${params.fare.total.toLocaleString()}`, pageWidth - 18, y + 11, { align: 'right' });

  y += 26;

  // Policy & Inclusions Note
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(133, 77, 14);
  doc.text('INCLUSIONS & SERVICE GUARANTEE', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(113, 63, 18);
  const inclusions = [
    '• Chauffeur, clean air-conditioned unit, fuel and all designated expressway toll gates are included.',
    '• Airport runs include flight delay tracking and designated curbside terminal staging.',
    '• Parking fees at airports or commercial garages are billed at actual official receipt cost.',
    '• Standby time beyond stated limits is billed at standard excess hourly rate.',
    '• Driver assignment and vehicle plate details are dispatched via SMS / WhatsApp 24 hours prior.',
  ];

  inclusions.forEach((inc, i) => {
    doc.text(inc, 18, y + 11 + i * 4);
  });

  y += 36;

  // Footer / Contact Dispatch
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GoCav Transport Dispatch Office', 16, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(CONTACT_INFO.address, 16, y + 4.5);
  doc.text(`Mobile / WhatsApp / Viber: ${CONTACT_INFO.phone1} · ${CONTACT_INFO.phone2}`, 16, y + 9);
  doc.text(`Email: ${CONTACT_INFO.email} · Reg: ${CONTACT_INFO.tin}`, 16, y + 13.5);

  // Save PDF
  const safeFilename = isReceipt
    ? `GoCav_Receipt_${params.quoteRef}.pdf`
    : `GoCav_Quotation_${params.quoteRef}.pdf`;
  doc.save(safeFilename);
}

export function generateReceiptPdf(params: QuotePdfParams): void {
  generateQuotePdf({ ...params, mode: 'receipt' });
}
