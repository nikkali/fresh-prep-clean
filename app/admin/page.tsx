"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const ADMIN_PASSWORD = "FreshPrep2024" // You can change this password

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "weekly" | "freezer"
  image: string
  macros: {
    protein: string
    carbs: string
    fat: string
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: "weekly",
    macros: { protein: "", carbs: "", fat: "" }
  })
  const router = useRouter()

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      toast({
        title: "Success",
        description: "Logged in successfully"
      })
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive"
      })
    }
  }

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const productToSave = {
      ...newProduct,
      id: Date.now().toString(),
      macros: {
        protein: newProduct.macros?.protein || "0g",
        carbs: newProduct.macros?.carbs || "0g",
        fat: newProduct.macros?.fat || "0g"
      }
    } as Product

    const updatedProducts = [...products, productToSave]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    // Reset form
    setNewProduct({
      category: "weekly",
      macros: { protein: "", carbs: "", fat: "" }
    })

    toast({
      title: "Success",
      description: "Product added successfully"
    })
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    toast({
      title: "Success",
      description: "Product deleted successfully"
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => setIsAuthenticated(false)}
        >
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="space-y-4">
            <Input
              value={newProduct.name || ""}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product name *"
            />
            <Input
              value={newProduct.description || ""}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Description *"
            />
            <Input
              type="number"
              value={newProduct.price || ""}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              placeholder="Price *"
            />
            <Input
              value={newProduct.image || ""}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              placeholder="Image URL *"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={newProduct.macros?.protein || ""}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  macros: { ...newProduct.macros, protein: e.target.value }
                })}
                placeholder="Protein (g)"
              />
              <Input
                value={newProduct.macros?.carbs || ""}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  macros: { ...newProduct.macros, carbs: e.target.value }
                })}
                placeholder="Carbs (g)"
              />
              <Input
                value={newProduct.macros?.fat || ""}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  macros: { ...newProduct.macros, fat: e.target.value }
                })}
                placeholder="Fat (g)"
              />
            </div>
            <select
              className="w-full p-2 border rounded"
              value={newProduct.category}
              onChange={(e) => setNewProduct({
                ...newProduct,
                category: e.target.value as "weekly" | "freezer"
              })}
            >
              <option value="weekly">Weekly Menu</option>
              <option value="freezer">Freezer Meals</option>
            </select>
            <Button onClick={handleSaveProduct} className="w-full">
              Add Product
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Products</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </div>
                <p className="text-sm">{product.description}</p>
                <p className="text-sm mt-2">Category: {product.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}