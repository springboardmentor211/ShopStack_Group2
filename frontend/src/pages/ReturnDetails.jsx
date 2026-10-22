import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RETURN_DETAILS_DATA = {
  id: 'RET-6101',
  orderId: 'ORD-24088',
  status: 'Pending Review',
  productName: 'Noir Eau de Parfum',
  sku: 'BE-NOIR-50',
  productImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80',
  customer: 'Kabir Rao',
  seller: 'House & Trail',
  returnReason: 'Item damaged on arrival',
  customerComments: 'The outer packaging was damaged.',
  sellerResponse: 'Awaiting inspection.',
  warehouseInspection: 'Pending',
  evidence: 'No files attached',
  timeline: [
    { title: 'Requested', desc: 'Recorded in marketplace activity', status: 'done' },
    { title: 'Approved', desc: 'Recorded in marketplace activity', status: 'done' },
    { title: 'Picked Up', desc: 'Recorded in marketplace activity', status: 'done' },
    { title: 'Warehouse Received', desc: 'Awaiting next update', status: 'pending' },
    { title: 'Inspected', desc: 'Awaiting next update', status: 'pending' },
    { title: 'Refund Initiated', desc: 'Awaiting next update', status: 'pending' },
    { title: 'Refund Completed', desc: 'Awaiting next update', status: 'pending' },
  ]
};

export default function ReturnDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = RETURN_DETAILS_DATA;

  return (
    <div className="space-y-6 pb-12 text-[#1a1612]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › Returns & Disputes › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Return / Dispute Details</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Return / Dispute Details</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search orders, users, sellers or products..."
              className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2 text-xs text-[#1a1612] outline-none shadow-2xs placeholder-[#a8a096]"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs">
            <svg className="w-4 h-4 text-[#70665f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center gap-2 bg-white border border-[#eae3da] rounded-xl px-3 py-1.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#1a1612] text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-tight text-[#1a1612]">Hi, Admin</p>
              <p className="text-[10px] text-[#8c827a] leading-tight">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/returns')}
          className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] mb-1 inline-block"
        >
          ← Back to Returns & Disputes
        </button>
        <h1 className="text-3xl font-bold text-[#1a1612]">Return / Dispute Details</h1>
        <p className="text-xs text-[#8c827a] mt-1 font-medium">
          {data.id} · <span className="text-[#a16207]">{data.status}</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Case & Product & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case & Product Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs">
            <h3 className="text-base font-bold text-[#1a1612] mb-6">Case & Product</h3>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 pb-6 border-b border-[#eae3da]">
              <div className="w-36 h-44 bg-[#fcf8f2] rounded-2xl p-2 border border-[#eae3da] flex items-center justify-center shrink-0">
                <img
                  src={data.productImage}
                  alt={data.productName}
                  className="max-h-full object-contain rounded-lg"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left pt-2">
                <h4 className="text-lg font-bold text-[#1a1612]">{data.productName}</h4>
                <p className="text-xs text-[#8c827a] font-mono">SKU {data.sku}</p>
                <button
                  onClick={() => navigate('/orders')}
                  className="mt-3 border border-[#eae3da] bg-white px-4 py-1.5 rounded-xl text-xs font-semibold text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs"
                >
                  View Order
                </button>
              </div>
            </div>

            {/* Field Details Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[11px] text-[#8c827a] font-medium">Return ID</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.id}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8c827a] font-medium">Order ID</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.orderId}</p>
              </div>

              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Customer</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.customer}</p>
              </div>
              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Seller</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.seller}</p>
              </div>

              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Return Reason</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.returnReason}</p>
              </div>
              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Customer Comments</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.customerComments}</p>
              </div>

              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Seller Response</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.sellerResponse}</p>
              </div>
              <div className="border-t border-[#eae3da] pt-4">
                <p className="text-[11px] text-[#8c827a] font-medium">Warehouse Inspection Result</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.warehouseInspection}</p>
              </div>

              <div className="border-t border-[#eae3da] pt-4 col-span-2">
                <p className="text-[11px] text-[#8c827a] font-medium">Evidence / Attachments</p>
                <p className="text-xs font-bold text-[#1a1612] mt-1">{data.evidence}</p>
              </div>
            </div>
          </div>

          {/* Case Timeline Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs">
            <h3 className="text-base font-bold text-[#1a1612] mb-6">Case Timeline</h3>

            <div className="relative border-l-2 border-[#c2b6a8] ml-2 space-y-6 pl-6">
              {data.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full ${
                      item.status === 'done' ? 'bg-[#a3793e]' : 'bg-[#c2b6a8]'
                    }`}
                  />
                  <h5 className="text-xs font-bold text-[#1a1612]">{item.title}</h5>
                  <p className="text-[11px] text-[#8c827a] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Decision Actions */}
        <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1a1612]">Decision</h3>
            <p className="text-[11px] text-[#8c827a] mt-1">
              Review available evidence before making a final decision.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => alert('Approved successfully!')}
              className="w-full bg-[#bd904a] hover:bg-[#a87f3f] text-white py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Approve
            </button>

            <button
              onClick={() => alert('Rejected')}
              className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Reject
            </button>

            <button
              onClick={() => alert('Requested Information')}
              className="w-full border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Request Information
            </button>

            <button
              onClick={() => alert('Initiated Refund')}
              className="w-full border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Initiate Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}