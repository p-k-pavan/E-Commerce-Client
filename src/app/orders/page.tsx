"use client";

import { Package, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

export default function Orders() {
  const orders = [
    {
      id: 'ORD-2024-001',
      date: 'April 8, 2026',
      status: 'delivered',
      total: 1245,
      items: [
        {
          name: 'Fresh Red Apples - Premium Quality (1 kg)',
          quantity: 2,
          price: 120,
          image: 'https://images.unsplash.com/photo-1757332334757-4ae9658176ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFwcGxlcyUyMGZydWl0fGVufDF8fHx8MTc3NTYyNDcyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Full Cream Fresh Milk - Daily Delivery (1 Liter)',
          quantity: 3,
          price: 60,
          image: 'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZGFpcnl8ZW58MXx8fHwxNzc1NjA5NDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Classic Potato Chips - Family Pack (200g)',
          quantity: 4,
          price: 80,
          image: 'https://images.unsplash.com/photo-1579384264577-79580c9d3a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBjaGlwcyUyMHNuYWNrc3xlbnwxfHx8fDE3NzU2MDcyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      deliveryAddress: '123 MG Road, Bangalore, Karnataka - 560001',
    },
    {
      id: 'ORD-2024-002',
      date: 'April 7, 2026',
      status: 'in-transit',
      total: 865,
      items: [
        {
          name: 'Premium Basmati Rice - Extra Long Grain (5kg)',
          quantity: 1,
          price: 450,
          image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zfGVufDF8fHx8MTc3NTYyNDczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Cheddar Cheese Block - Aged & Flavorful (200g)',
          quantity: 2,
          price: 180,
          image: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBkYWlyeSUyMHByb2R1Y3R8ZW58MXx8fHwxNzc1NjE5NDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      deliveryAddress: '123 MG Road, Bangalore, Karnataka - 560001',
      expectedDelivery: 'Today, 4:00 PM - 6:00 PM',
    },
    {
      id: 'ORD-2024-003',
      date: 'April 5, 2026',
      status: 'processing',
      total: 590,
      items: [
        {
          name: '100% Pure Orange Juice - No Added Sugar (1L)',
          quantity: 3,
          price: 150,
          image: 'https://images.unsplash.com/photo-1697479815895-23ea2934711a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZSUyMGJldmVyYWdlfGVufDF8fHx8MTc3NTYxOTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Greek Yogurt - High Protein (400g)',
          quantity: 1,
          price: 90,
          image: 'https://images.unsplash.com/photo-1719528809952-d613e546b18b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBkYWlyeXxlbnwxfHx8fDE3NzU2MjQ3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      deliveryAddress: '123 MG Road, Bangalore, Karnataka - 560001',
    },
    {
      id: 'ORD-2024-004',
      date: 'April 3, 2026',
      status: 'cancelled',
      total: 320,
      items: [
        {
          name: 'Mixed Nuts - Roasted & Salted (250g)',
          quantity: 1,
          price: 280,
          image: 'https://images.unsplash.com/photo-1772986796515-055c11e6c39e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMG51dHMlMjBoZWFsdGh5JTIwc25hY2t8ZW58MXx8fHwxNzc1NjI4MDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        },
      ],
      deliveryAddress: '123 MG Road, Bangalore, Karnataka - 560001',
      cancellationReason: 'Customer request',
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'text-[#16A34A]',
          bg: 'bg-green-50',
          label: 'Delivered',
        };
      case 'in-transit':
        return {
          icon: Package,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          label: 'In Transit',
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-[#FACC15]',
          bg: 'bg-yellow-50',
          label: 'Processing',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          label: 'Cancelled',
        };
      default:
        return {
          icon: Package,
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          label: 'Unknown',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">


      <main className="max-w-360 mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">My Orders</h1>
          <p className="text-[#6B7280]">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-[#6B7280]">Order ID</p>
                        <p className="font-bold text-[#111827]">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Order Date</p>
                        <p className="font-medium text-[#111827]">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Total Amount</p>
                        <p className="font-bold text-[#111827]">₹{order.total}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bg}`}
                      >
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-[#111827] mb-1">{item.name}</h4>
                          <p className="text-sm text-[#6B7280]">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#111827]">
                            ₹{item.quantity * item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-[#6B7280] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111827] mb-1">
                          Delivery Address
                        </p>
                        <p className="text-sm text-[#6B7280]">{order.deliveryAddress}</p>
                        {order.expectedDelivery && (
                          <p className="text-sm text-[#16A34A] font-medium mt-2">
                            Expected: {order.expectedDelivery}
                          </p>
                        )}
                        {order.cancellationReason && (
                          <p className="text-sm text-red-500 font-medium mt-2">
                            Reason: {order.cancellationReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <Eye className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-medium text-[#111827]">View Details</span>
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <Download className="w-5 h-5 text-[#6B7280]" />
                        <span className="font-medium text-[#111827]">Download Invoice</span>
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="flex-1 px-4 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium">
                        Reorder
                      </button>
                    )}
                    {(order.status === 'processing' || order.status === 'in-transit') && (
                      <button className="px-6 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State (if no orders) */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#111827] mb-2">No orders yet</h3>
            <p className="text-[#6B7280] mb-6">
              Start shopping to see your orders here
            </p>
            <button className="px-6 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium">
              Start Shopping
            </button>
          </div>
        )}
      </main>

    </div>
  );
}
