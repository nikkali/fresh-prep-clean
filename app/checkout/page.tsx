"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config/site"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    paymentMethod: "" as "cashapp" | "venmo" | "",
  })

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isMinimumMet = formData.pickupLocation !== "barbies-clinic" || total >= 100

  const generateOrderNumber = () => {
    return `FP${Date.now().toString().slice(-6)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isMinimumMet) {
      toast({
        title: "Minimum Order Required",
        description: "Orders for Barbie's Clinic require a minimum of $100",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    const orderNumber = generateOrderNumber()

    // Generate order summary
    const orderSummary = items.map(item => 
      `${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
    ).join('\n')

    try {
      // Send order to business email
      const businessFormData = new FormData()
      businessFormData.append('_subject', `New Order ${orderNumber}`)
      businessFormData.append('name', formData.name)
      businessFormData.append('email', formData.email)
      businessFormData.append('phone', formData.phone)
      businessFormData.append('pickupLocation', formData.pickupLocation)
      businessFormData.append('paymentMethod', formData.paymentMethod)
      businessFormData.append('orderSummary', orderSummary)
      businessFormData.append('total', total.toString())
      businessFormData.append('orderNumber', orderNumber)

      // Send to business email
      await fetch('https://formsubmit.co/maggielizeida@yahoo.com', {
        method: 'POST',
        body: businessFormData
      })

      // Send confirmation to customer
      const customerFormData = new FormData()
      customerFormData.append('_subject', `Your Fresh Prep Order ${orderNumber}`)
      customerFormData.append('email', formData.email)
      customerFormData.append('name', formData.name)
      customerFormData.append('orderNumber', orderNumber)
      customerFormData.append('orderSummary', orderSummary)
      customerFormData.append('total', total.toString())
      customerFormData.append('paymentMethod', formData.paymentMethod)
      customerFormData.append('paymentInstructions', 
        formData.paymentMethod === 'cashapp' 
          ? `Please send payment to ${siteConfig.payments.cashapp}` 
          : `Please send payment to ${siteConfig.payments.venmo}`
      )

      await fetch('https://formsubmit.co/ajax/' + formData.email, {
        method: 'POST',
        body: customerFormData
      })

      // Save order to localStorage
      const order = {
        orderNumber,
        ...formData,
        items,
        total,
        date: new Date().toISOString(),
        status: "pending"
      }

      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))

      // Clear cart and redirect
      clearCart()
      router.push(`/order-confirmation/${orderNumber}`)

      toast({
        title: "Order Submitted",
        description: "Check your email for order confirmation and payment instructions.",
      })
    } catch (error) {
      console.error('Error submitting order:', error)
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2">Email *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2">Pickup Location *</label>
              <select
                className="w-full p-2 border rounded"
                required
                value={formData.pickupLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pickupLocation: e.target.value })
                }
              >
                <option value="">Select a location</option>
                {siteConfig.pickupLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} {location.minimumOrder > 0 && `(Min. order $${location.minimumOrder})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Payment Method *</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded cursor-pointer text-center ${
                    formData.paymentMethod === 'cashapp' ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cashapp' })}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setFormData({ ...formData, paymentMethod: 'cashapp' })
                    }
                  }}
                >
                  <h3 className="font-semibold">Cash App</h3>
                  <p className="text-lg">{siteConfig.payments.cashapp}</p>
                </div>
                <div
                  className={`p-4 border rounded cursor-pointer text-center ${
                    formData.paymentMethod === 'venmo' ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'venmo' })}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setFormData({ ...formData, paymentMethod: 'venmo' })
                    }
                  }}
                >
                  <h3 className="font-semibold">Venmo</h3>
                  <p className="text-lg">{siteConfig.payments.venmo}</p>
                </div>
              </div>
            </div>

            {!isMinimumMet && (
              <div className="text-red-500" role="alert">
                * Minimum order of $100 required for Barbie's Clinic pickup
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isMinimumMet || !formData.paymentMethod || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Order"}
            </Button>
          </form>
        </div>

        <div className="bg-card p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}