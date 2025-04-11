"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Order {
  orderNumber: string
  name: string
  email: string
  phone: string
  pickupLocation: string
  paymentMethod: string
  items: any[]
  total: number
  date: string
  status: string
}

export default function OrderConfirmationPage({
  params
}: {
  params: { orderNumber: string }
}) {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const currentOrder = orders.find((o: Order) => o.orderNumber === params.orderNumber)
    if (currentOrder) {
      setOrder(currentOrder)
    }
  }, [params.orderNumber])

  if (!order) {
    return (
      <div className="container mx-auto px-4 pt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/menu">
          <Button>Return to Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-100 p-4 rounded-lg mb-8">
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-green-700">Your order number is: {order.orderNumber}</p>
        </div>

        <div className="bg-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Pickup Location:</p>
              <p>{order.pickupLocation}</p>
            </div>
            <div>
              <p className="font-medium">Payment Method:</p>
              <p>{order.paymentMethod}</p>
            </div>
            <div>
              <p className="font-medium">Order Summary:</p>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg mb-8">
          <h2 className="font-semibold text-blue-800 mb-2">Next Steps:</h2>
          <ol className="list-decimal list-inside text-blue-700 space-y-2">
            <li>Complete your payment using the selected payment method</li>
            <li>Check your email for order confirmation and payment instructions</li>
            <li>Save your order number: {order.orderNumber}</li>
          </ol>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/menu">
            <Button variant="outline">Return to Menu</Button>
          </Link>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}