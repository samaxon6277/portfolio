import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FileText, Plus, Trash2, Printer, Download, Save, 
  RotateCcw, Upload, Check, Copy, DollarSign, Calendar, 
  Building2, User, CreditCard, ShieldCheck, Sparkles, ArrowRight
} from 'lucide-react';
import CustomSelect from '../CustomSelect';
import FormField from '../ui/FormField';
import CustomInput from '../ui/CustomInput';
import CustomTextarea from '../ui/CustomTextarea';
import CustomBadge from '../ui/CustomBadge';
import { useCustomUi } from '../../context/CustomUiContext';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
}

export type CurrencySymbol = '₹' | '$' | '€' | '£' | 'AED ' | 'C$' | 'A$';

const CURRENCIES: { code: string; label: string; symbol: CurrencySymbol }[] = [
  { code: 'INR', label: 'INR (₹ - Indian Rupee)', symbol: '₹' },
  { code: 'USD', label: 'USD ($ - US Dollar)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€ - Euro)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£ - British Pound)', symbol: '£' },
  { code: 'AED', label: 'AED (د.إ - UAE Dirham)', symbol: 'AED ' }
];

export default function InvoiceGenerator() {
  const { showToast, showConfirm } = useCustomUi();

  // Invoice Metadata
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-084');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [currencyCode, setCurrencyCode] = useState('INR');

  // Business & Client Details
  const [fromName, setFromName] = useState('SamaXon Digital Solutions');
  const [fromEmail, setFromEmail] = useState('billing@samaxon.com');
  const [fromAddress, setFromAddress] = useState('Level 4, Sector 62, Noida, Delhi NCR 201309');
  const [fromTaxId, setFromTaxId] = useState('GSTIN: 07AABCS1429B1Z2');

  const [toName, setToName] = useState('The Imperial Grand Palace');
  const [toEmail, setToEmail] = useState('accounts@imperialgrand.com');
  const [toAddress, setToAddress] = useState('MG Road, Connaught Place, New Delhi 110001');
  const [toTaxId, setToTaxId] = useState('GSTIN: 07AAACT2345K1Z8');

  // Line Items
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: '1',
      description: 'Bespoke Luxury Resort Website (48h Rapid Architecture)',
      quantity: 1,
      unitPrice: 85000,
      taxPercent: 18
    },
    {
      id: '2',
      description: 'Automated WhatsApp Concierge & Banquet Booking Bot',
      quantity: 1,
      unitPrice: 25000,
      taxPercent: 18
    },
    {
      id: '3',
      description: 'Core Web Vitals Speed Tuning & Cloud Run Deployment',
      quantity: 1,
      unitPrice: 15000,
      taxPercent: 18
    }
  ]);

  // Adjustments
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [notes, setNotes] = useState('Payment is due within 15 days of invoice date. Thank you for partnering with SamaXon Digital Solutions.');
  const [paymentTerms, setPaymentTerms] = useState('Bank: HDFC Bank | A/C: 5020008472910 | IFSC: HDFC0001234 | UPI: samaxon@hdfcbank');

  // Optional Logo
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Currency symbol
  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode)?.symbol || '₹';
  }, [currencyCode]);

  const formatAmount = (num: number): string => {
    return `${currencySymbol}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach(item => {
      const lineSubtotal = item.quantity * item.unitPrice;
      const lineTax = lineSubtotal * (item.taxPercent / 100);
      subtotal += lineSubtotal;
      totalTax += lineTax;
    });

    const discountAmount = subtotal * (discountPercent / 100);
    const grandTotal = Math.max(0, subtotal - discountAmount + totalTax + shippingFee);

    return {
      subtotal,
      discountAmount,
      totalTax,
      grandTotal
    };
  }, [items, discountPercent, shippingFee]);

  // Add Item
  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: String(Date.now()),
      description: 'Consultation / Development Service',
      quantity: 1,
      unitPrice: 5000,
      taxPercent: 18
    };
    setItems([...items, newItem]);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      showToast('Invoice must contain at least one line item.', 'warning');
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  // Update Item
  const handleUpdateItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG/JPG).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setLogoUrl(loadEvt.target?.result as string);
      showToast('Brand logo affixed to invoice.', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Save to LocalStorage
  const handleSaveToStorage = () => {
    const payload = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      currencyCode,
      fromName,
      fromEmail,
      fromAddress,
      fromTaxId,
      toName,
      toEmail,
      toAddress,
      toTaxId,
      items,
      discountPercent,
      shippingFee,
      notes,
      paymentTerms,
      logoUrl
    };
    localStorage.setItem('samaxon_saved_invoice_template', JSON.stringify(payload));
    showToast('Invoice template saved locally to your browser!', 'success');
  };

  // Load from LocalStorage
  const handleLoadFromStorage = () => {
    const saved = localStorage.getItem('samaxon_saved_invoice_template');
    if (!saved) {
      showToast('No saved invoice template found in browser storage.', 'info');
      return;
    }
    try {
      const p = JSON.parse(saved);
      if (p.invoiceNumber) setInvoiceNumber(p.invoiceNumber);
      if (p.fromName) setFromName(p.fromName);
      if (p.fromEmail) setFromEmail(p.fromEmail);
      if (p.fromAddress) setFromAddress(p.fromAddress);
      if (p.toName) setToName(p.toName);
      if (p.toEmail) setToEmail(p.toEmail);
      if (p.toAddress) setToAddress(p.toAddress);
      if (p.currencyCode) setCurrencyCode(p.currencyCode);
      if (Array.isArray(p.items)) setItems(p.items);
      if (p.notes) setNotes(p.notes);
      if (p.paymentTerms) setPaymentTerms(p.paymentTerms);
      if (p.logoUrl) setLogoUrl(p.logoUrl);
      showToast('Saved invoice template successfully restored.', 'success');
    } catch (e) {
      showToast('Failed to load saved template.', 'error');
    }
  };

  // Reset to default
  const handleReset = () => {
    showConfirm({
      title: 'Reset Invoice?',
      message: 'This will reset all line items and addresses to default state. Any unsaved custom items will be lost.',
      confirmText: 'Reset Form',
      onConfirm: () => {
        setInvoiceNumber(`INV-${new Date().getFullYear()}-001`);
        setItems([
          {
            id: '1',
            description: 'Custom Web Design & Architecture',
            quantity: 1,
            unitPrice: 50000,
            taxPercent: 18
          }
        ]);
        setDiscountPercent(0);
        setShippingFee(0);
        showToast('Invoice reset to blank template.', 'info');
      }
    });
  };

  return (
    <div className="space-y-10 text-left" id="invoice-generator-tool">
      {/* Hero Header - Hidden on Print */}
      <div className="print:hidden bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/25 rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CustomBadge variant="gold" size="md" icon={<FileText className="w-3 h-3" />}>
              Commercial Billing Suite
            </CustomBadge>
            <span className="text-[10px] font-mono text-[#D6B46A]/80 uppercase tracking-wider">
              Print-Ready Vector Formatting
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Professional Luxury <span className="text-[#D6B46A]">Invoice Generator</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Generate clean, compliant, executive commercial invoices with automatic subtotal and GST/tax calculations. Download as vector PDF, print directly, or save reusable corporate templates.
          </p>
        </div>
      </div>

      {/* Main Container: Controls (Left) vs Live Invoice Document Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor (5 cols) - Hidden on Print */}
        <div className="print:hidden lg:col-span-5 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">Document Editor</span>
              <h3 className="font-display text-lg font-bold text-[#111111]">Invoice Parameters</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSaveToStorage}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-all cursor-pointer"
                title="Save Template"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleLoadFromStorage}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-all cursor-pointer"
                title="Restore Saved Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Invoice Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Invoice Number" required>
              <CustomInput
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-2026-001"
              />
            </FormField>

            <FormField label="Currency Standard">
              <CustomSelect
                value={currencyCode}
                onChange={(val) => setCurrencyCode(String(val))}
                options={CURRENCIES.map(c => ({ value: c.code, label: c.label }))}
              />
            </FormField>

            <FormField label="Issue Date">
              <CustomInput
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </FormField>

            <FormField label="Due Date">
              <CustomInput
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </FormField>
          </div>

          {/* Sender & Recipient Blocks */}
          <div className="space-y-4 pt-2 border-t border-[#D6B46A]/15">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#D6B46A]" />
              <span>Seller / Service Provider</span>
            </h4>
            <div className="space-y-2.5">
              <CustomInput
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Company / Agency Name"
              />
              <CustomInput
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="billing@yourcompany.com"
              />
              <CustomInput
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="Business Address, City, Pincode"
              />
              <CustomInput
                value={fromTaxId}
                onChange={(e) => setFromTaxId(e.target.value)}
                placeholder="Tax ID / GSTIN / VAT"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#D6B46A]/15">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#D6B46A]" />
              <span>Client / Bill To</span>
            </h4>
            <div className="space-y-2.5">
              <CustomInput
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Client Name or Organization"
              />
              <CustomInput
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="client.accounts@example.com"
              />
              <CustomInput
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Client Address, City"
              />
              <CustomInput
                value={toTaxId}
                onChange={(e) => setToTaxId(e.target.value)}
                placeholder="Client GSTIN / Tax ID"
              />
            </div>
          </div>

          {/* Line Items Editor */}
          <div className="space-y-3 pt-2 border-t border-[#D6B46A]/15">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Line Items ({items.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-[#111111] text-[#D6B46A] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-[#FAF6F0] border border-[#D6B46A]/20 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[10px] text-[#85641C]">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <CustomInput
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description / Service scope"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] text-[#8A8178] block">Qty</span>
                      <CustomInput
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8A8178] block">Unit Price</span>
                      <CustomInput
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8A8178] block">Tax %</span>
                      <CustomInput
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxPercent}
                        onChange={(e) => handleUpdateItem(item.id, 'taxPercent', Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Brand Logo Upload */}
          <div className="p-3 bg-[#FAF6F0] rounded-xl flex items-center justify-between border border-[#D6B46A]/20">
            <div>
              <span className="text-xs font-bold text-[#111111] block">Affix Company Logo</span>
              <span className="text-[10px] text-[#8A8178]">Appears top-left on printed invoice</span>
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D6B46A]/40 text-[#111111] hover:border-[#D6B46A] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>{logoUrl ? 'Change' : 'Upload'}</span>
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
              className="sr-only"
            />
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            Reset to Standard Template
          </button>
        </div>

        {/* Right Column: Live Printable Invoice Document (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Actions Bar (Print, Download) - Hidden on Print */}
          <div className="print:hidden bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111]">
                Live Document Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#111111] text-[#D6B46A] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          {/* Authentic High-End Physical Invoice Document */}
          <div 
            id="samaxon-printable-invoice"
            className="bg-white border border-[#D6B46A]/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl print:shadow-none print:border-none print:p-0 text-left space-y-8 min-h-[750px] flex flex-col justify-between"
          >
            {/* Invoice Top Header */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#D6B46A]/25 pb-6">
                <div className="space-y-2 max-w-sm">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-10 object-contain mb-2" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center text-[#D6B46A] font-black text-xs font-display">
                        S
                      </div>
                      <span className="font-display font-black text-lg tracking-tight text-[#111111]">
                        {fromName}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-[#8A8178] leading-relaxed">
                    {fromAddress}
                  </p>
                  <p className="text-xs text-[#8A8178]">
                    {fromEmail}
                  </p>
                  {fromTaxId && (
                    <p className="text-[10.5px] font-mono text-[#85641C] font-bold">
                      {fromTaxId}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-2xl sm:text-3xl font-display font-black uppercase tracking-widest text-[#111111] block">
                    INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold text-[#85641C]">
                    #{invoiceNumber}
                  </p>
                  <div className="pt-2 text-xs text-[#8A8178] space-y-0.5">
                    <div>Date: <strong className="text-[#111111]">{invoiceDate}</strong></div>
                    <div>Due Date: <strong className="text-[#111111]">{dueDate}</strong></div>
                  </div>
                </div>
              </div>

              {/* Bill To Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold block">
                    Billed To
                  </span>
                  <h4 className="font-display text-base font-bold text-[#111111]">
                    {toName || 'Client Name'}
                  </h4>
                  <p className="text-xs text-[#8A8178] leading-relaxed">
                    {toAddress}
                  </p>
                  <p className="text-xs text-[#8A8178]">
                    {toEmail}
                  </p>
                  {toTaxId && (
                    <p className="text-[10.5px] font-mono text-[#85641C]">
                      {toTaxId}
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="pt-4 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#111111] text-[10px] font-mono font-bold uppercase tracking-wider text-[#111111]">
                      <th className="py-3 px-2">Scope of Services</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Unit Price</th>
                      <th className="py-3 px-2 text-right">Tax Rate</th>
                      <th className="py-3 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {items.map((item) => {
                      const lineAmt = item.quantity * item.unitPrice;
                      return (
                        <tr key={item.id} className="text-neutral-800">
                          <td className="py-3 px-2 font-semibold text-[#111111]">
                            {item.description}
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-2 text-right font-mono">
                            {formatAmount(item.unitPrice)}
                          </td>
                          <td className="py-3 px-2 text-right font-mono text-[#8A8178]">
                            {item.taxPercent}%
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-[#111111]">
                            {formatAmount(lineAmt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex flex-col sm:flex-row sm:justify-end pt-4">
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-[#8A8178]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-[#111111] font-semibold">{formatAmount(calculations.subtotal)}</span>
                  </div>

                  {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({discountPercent}%):</span>
                      <span className="font-mono font-semibold">-{formatAmount(calculations.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#8A8178]">
                    <span>Tax / GST:</span>
                    <span className="font-mono text-[#111111] font-semibold">{formatAmount(calculations.totalTax)}</span>
                  </div>

                  <div className="flex justify-between border-t-2 border-[#111111] pt-2 text-sm font-bold text-[#111111]">
                    <span className="font-display">Total Balance Due:</span>
                    <span className="font-mono text-base font-black text-[#85641C]">
                      {formatAmount(calculations.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Payment Instructions & Signature */}
            <div className="border-t border-[#D6B46A]/20 pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#8A8178]">
                <div>
                  <span className="font-bold text-[#111111] block mb-1 uppercase tracking-wider text-[10px] font-mono">
                    Payment Instructions & Bank Routing:
                  </span>
                  <p className="font-mono text-[11px] leading-relaxed text-[#111111]">
                    {paymentTerms}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#111111] block mb-1 uppercase tracking-wider text-[10px] font-mono">
                    Terms & Notes:
                  </span>
                  <p className="leading-relaxed">
                    {notes}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-mono text-[#8A8178] border-t border-neutral-100">
                <span>Authorized Digital Commercial Document</span>
                <span>Generated via SamaXon Digital Solutions · https://samaxon.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
