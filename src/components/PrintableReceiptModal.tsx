import React, { useState } from 'react';
import {
  Printer,
  FileDown,
  Copy,
  Check,
  X,
  ShieldCheck,
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Mail,
  Phone,
  Building2,
  FileText,
  Share2,
} from 'lucide-react';
import { VehicleTier, CONTACT_INFO, FareCalculationResult } from '../data/gocavData';
import { generateReceiptPdf } from '../utils/generateQuotePdf';

export interface PrintableReceiptData {
  ref: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  tin?: string;
  flightNumber?: string;
  serviceLabel: string;
  pickup: string;
  dropoff: string;
  date: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  days?: number;
  pax?: number;
  bags?: number;
  vehicle: VehicleTier;
  fare: FareCalculationResult;
  notes?: string;
  isCorporate?: boolean;
  companyName?: string;
  status?: 'booked' | 'estimate' | 'dispatched';
  matchedDriver?: {
    driver: string;
    unit: string;
    plate: string;
    base: string;
  } | null;
  dispatchChannel?: string;
}

interface PrintableReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrintableReceiptData;
}

export const PrintableReceiptModal: React.FC<PrintableReceiptModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateReceiptPdf({
      quoteRef: data.ref,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail,
      clientTin: data.tin,
      flightNumber: data.flightNumber,
      serviceLabel: data.serviceLabel,
      pickup: data.pickup,
      dropoff: data.dropoff,
      date: data.date,
      pickupTime: data.pickupTime,
      returnDate: data.returnDate,
      returnTime: data.returnTime,
      vehicle: data.vehicle,
      fare: data.fare,
      notes: data.notes,
      isCorporate: data.isCorporate,
      mode: 'receipt',
    });
  };

  const handleCopyText = () => {
    let txt = `═══════════════════════════════════════\n`;
    txt += `   GOCAV TRANSPORT OFFICIAL RECEIPT   \n`;
    txt += `═══════════════════════════════════════\n`;
    txt += `Receipt Ref : ${data.ref}\n`;
    txt += `Issued Date : ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}\n`;
    txt += `Status      : ${data.status === 'booked' ? 'CONFIRMED & DISPATCHED' : 'OFFICIAL FARE ESTIMATE'}\n`;
    txt += `───────────────────────────────────────\n`;
    txt += `Passenger   : ${data.clientName || 'Valued Guest'}\n`;
    txt += `Mobile      : ${data.clientPhone || 'N/A'}\n`;
    if (data.clientEmail) txt += `Email       : ${data.clientEmail}\n`;
    if (data.tin) txt += `TIN (BIR)   : ${data.tin}\n`;
    if (data.companyName) txt += `Company     : ${data.companyName}\n`;
    if (data.flightNumber) txt += `Flight/Gate : ${data.flightNumber}\n`;
    txt += `───────────────────────────────────────\n`;
    txt += `Service     : ${data.serviceLabel}\n`;
    txt += `Vehicle     : ${data.vehicle.name} (${data.vehicle.models})\n`;
    txt += `Pickup      : ${data.pickup}\n`;
    txt += `Destination : ${data.dropoff || 'As designated'}\n`;
    txt += `Schedule    : ${data.date} @ ${data.pickupTime}\n`;
    if (data.returnDate) txt += `Return      : ${data.returnDate} @ ${data.returnTime || 'TBD'}\n`;
    if (data.matchedDriver) {
      txt += `Chauffeur   : ${data.matchedDriver.driver} (${data.matchedDriver.unit} · Plate ${data.matchedDriver.plate})\n`;
    }
    txt += `───────────────────────────────────────\n`;
    txt += `ITEMIZED CHARGES:\n`;
    data.fare.lines.forEach((l) => {
      const v = l.val === 0 && l.zeroToll ? '₱0 (Toll-Free)' : `₱${Math.round(l.val).toLocaleString()}`;
      txt += ` • ${l.label.padEnd(28, ' ')} : ${v}\n`;
    });
    txt += `───────────────────────────────────────\n`;
    txt += `TOTAL FARE  : ₱${data.fare.total.toLocaleString()}\n`;
    txt += `Inclusions  : Fuel, Chauffeur & Express Tolls Included\n`;
    if (data.notes) txt += `Notes       : ${data.notes}\n`;
    txt += `═══════════════════════════════════════\n`;
    txt += `GoCav Transport Services · Gen. Trias, Cavite\n`;
    txt += `Hotline: ${CONTACT_INFO.phone1} · Email: ${CONTACT_INFO.email}\n`;

    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isBooked = data.status === 'booked' || data.status === 'dispatched';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#141622] border border-[#d4af37]/40 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when Printing) */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0e1017] border-b border-[#242736] print:hidden gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Official Booking Receipt
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">Ref: {data.ref}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#f5d77f] to-[#d4af37] text-black hover:brightness-110 active:scale-95 transition"
              title="Print receipt or save as PDF via system printer dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1e2130] text-[#f5d77f] border border-[#d4af37]/40 hover:bg-[#d4af37]/15 active:scale-95 transition"
              title="Download official PDF receipt file"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 active:scale-95 transition"
              title="Copy text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="gocav-printable-receipt" className="p-5 sm:p-7 space-y-5 print:p-0 print:text-black">
          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#282c3c] print:border-slate-300 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl sm:text-2xl font-black tracking-wider text-[#f5d77f] print:text-slate-900">
                  GOCAV TRANSPORT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/40 print:border-slate-800 print:text-slate-800">
                  e-Receipt
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Executive Chauffeur &amp; Airport Transfer Services · Luzon Network
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 print:border-slate-400 print:text-slate-900 print:bg-slate-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isBooked ? 'CONFIRMED & DISPATCHED' : 'OFFICIAL FARE ESTIMATE'}</span>
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 font-mono mt-1">
                Ref: <strong className="text-white print:text-black">{data.ref}</strong> · Issued: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Passenger & Itinerary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Passenger Info */}
            <div className="p-3.5 rounded-xl bg-[#181a26] border border-[#2b2f42] print:border-slate-300 print:bg-slate-50 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] print:text-slate-700 block">
                Passenger / Client Details
              </span>
              <div className="space-y-1 text-slate-200 print:text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">Full Name:</span>
                  <span className="font-bold text-white print:text-black">{data.clientName || 'Valued Guest'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">Mobile (+63):</span>
                  <span className="font-mono font-semibold">{data.clientPhone || 'Not provided'}</span>
                </div>
                {data.clientEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 print:text-slate-600">Billing Email:</span>
                    <span className="font-mono text-[11px] text-[#f5d77f] print:text-slate-800">{data.clientEmail}</span>
                  </div>
                )}
                {data.companyName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 print:text-slate-600">Company:</span>
                    <span className="font-semibold">{data.companyName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">TIN (BIR Reg):</span>
                  <span className="font-mono font-semibold text-emerald-400 print:text-slate-900">
                    {data.tin || 'Non-VAT Consumer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle & Chauffeur Info */}
            <div className="p-3.5 rounded-xl bg-[#181a26] border border-[#2b2f42] print:border-slate-300 print:bg-slate-50 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] print:text-slate-700 block">
                Assigned Vehicle &amp; Service
              </span>
              <div className="space-y-1 text-slate-200 print:text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">Service:</span>
                  <span className="font-bold truncate max-w-[180px]">{data.serviceLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">Vehicle:</span>
                  <span className="font-bold text-[#f5d77f] print:text-slate-900">{data.vehicle.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 print:text-slate-600">Capacity:</span>
                  <span>{data.pax ?? data.vehicle.maxPax} Pax · {data.bags ?? data.vehicle.maxBags} Bags</span>
                </div>
                {data.flightNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 print:text-slate-600">Flight / Gate:</span>
                    <span className="font-mono font-bold text-[#f5d77f] print:text-slate-900">{data.flightNumber}</span>
                  </div>
                )}
                {data.matchedDriver && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 print:text-slate-600">Unit / Plate:</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-400 print:text-emerald-700">
                      {data.matchedDriver.driver} · {data.matchedDriver.plate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itinerary Schedule Box */}
          <div className="p-3.5 rounded-xl bg-[#10121a] border border-[#2b2f42] print:border-slate-300 print:bg-slate-50 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] print:text-slate-700 block">
              Trip Itinerary &amp; Timeline
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 print:text-slate-900">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5 print:text-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">PICKUP LOCATION</span>
                  <span className="font-semibold text-white print:text-black">{data.pickup}</span>
                  <span className="block text-[11px] text-[#f5d77f] print:text-slate-700 mt-0.5">
                    {data.date} at {data.pickupTime}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 print:text-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">DESTINATION DROP-OFF</span>
                  <span className="font-semibold text-white print:text-black">{data.dropoff || 'As designated'}</span>
                  {data.returnDate && (
                    <span className="block text-[11px] text-emerald-400 print:text-slate-700 mt-0.5">
                      Return: {data.returnDate} at {data.returnTime || 'TBD'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {data.notes && (
              <div className="pt-2 border-t border-white/5 print:border-slate-200 text-[11px] text-slate-400 print:text-slate-700">
                <strong className="text-slate-300 print:text-black">Special Notes / Flight: </strong>
                {data.notes}
              </div>
            )}
          </div>

          {/* Itemized Fare Calculation Table */}
          <div className="rounded-xl border border-[#2b2f42] print:border-slate-300 overflow-hidden text-xs">
            <div className="bg-[#181a26] print:bg-slate-200 px-4 py-2 flex justify-between font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider text-[10px]">
              <span>Itemized Fare Breakdown</span>
              <span>Amount (PHP)</span>
            </div>
            <div className="divide-y divide-white/5 print:divide-slate-200 bg-[#12141c] print:bg-white px-4 py-1">
              {data.fare.lines.map((line, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center text-slate-300 print:text-slate-800">
                  <span className={line.disc ? 'text-emerald-400 font-medium' : ''}>
                    {line.label}
                  </span>
                  <span className={`font-mono font-bold ${line.disc ? 'text-emerald-400' : 'text-white print:text-black'}`}>
                    {line.val === 0 && line.zeroToll
                      ? '₱0 (Toll-Free)'
                      : `${line.val < 0 ? '-' : ''}₱${Math.abs(Math.round(line.val)).toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Highlight */}
            <div className="bg-[#1a1c28] print:bg-slate-100 px-4 py-3 flex items-center justify-between border-t border-[#2b2f42] print:border-slate-300">
              <div>
                <span className="text-xs font-bold text-white print:text-black block">TOTAL FARE:</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600">
                  All-Inclusive (Fuel, Chauffeur &amp; Designated Expressways)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-[#f5d77f] print:text-slate-900 font-mono">
                  ₱{data.fare.total.toLocaleString()}
                </span>
                <span className="block text-[10px] text-emerald-400 print:text-emerald-700 font-bold uppercase">
                  Inclusive of VAT / Tolls
                </span>
              </div>
            </div>

            {/* BIR Compliance & Commission Revenue Split */}
            <div className="bg-[#12141e] print:bg-slate-50 px-4 py-2 border-t border-white/5 print:border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-400 print:text-slate-600 gap-2">
              <span className="font-semibold text-slate-300 print:text-slate-800">
                BIR Revenue Share:
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span>GoCav Platform (20%): <strong className="text-[#f5d77f] print:text-slate-900">₱{Math.round(data.fare.total * 0.20).toLocaleString()}</strong></span>
                <span>•</span>
                <span>Partner Payout (80%): <strong className="text-emerald-400 print:text-slate-900">₱{Math.round(data.fare.total * 0.80).toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Footer Notice & Contacts */}
          <div className="pt-2 text-[10px] text-slate-400 print:text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 print:border-slate-300 gap-2">
            <div>
              <p className="font-semibold text-slate-300 print:text-black">GoCav Transport Services · General Trias, Cavite</p>
              <p>Hotline / WhatsApp / Viber: {CONTACT_INFO.phone1} · {CONTACT_INFO.phone2}</p>
              <p>Email: {CONTACT_INFO.email} · {CONTACT_INFO.tin}</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="block text-[#f5d77f] print:text-slate-800 font-bold">Thank you for choosing GoCav!</span>
              <span>Keep this e-receipt for your records</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Button (Hidden when Printing) */}
        <div className="p-4 bg-[#0e1017] border-t border-[#242736] flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition"
          >
            Close Receipt View
          </button>
        </div>
      </div>
    </div>
  );
};
