"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

// Menu items - You can edit these directly
const meals = [
  {
    id: "1",
    name: "Grilled Chicken Bowl",
    description: "Grilled chicken with quinoa and roasted vegetables",
    price: 12.99,
    category: "weekly",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    macros: {
      protein: "30g",
      carbs: "45g",
      fat: "15g",
    },
  },
  {
    id: "2",
    name: "Salmon Power Bowl",
    description: "Fresh salmon with brown rice and mixed vegetables",
    price: 14.99,
    category: "freezer",
    image: "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg",
    macros: {
      protein: "25g",
      carbs: "40g",
      fat: "20g",
    },
  },
  {
    id: "3",
    name: "Vegetarian Buddha Bowl",
    description: "Fresh mixed vegetables with quinoa and tahini dressing",
    price: 11.99,
    category: "weekly",
    image: "https://images.pexels.com/photos/1833333/pexels-photo-1833333.jpeg",
    macros: {
      protein: "15g",
      carbs: "55g",
      fat: "12g",
    },
  },
  {
    id: "4",
    name: "Steak and Sweet Potato Bowl",
    description: "Grilled steak with roasted sweet potatoes and vegetables",
    price: 15.99,
    category: "freezer",
    image: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg",
    macros: {
      protein: "35g",
      carbs: "40g",
      fat: "20g",
    },
  },
  // Add more meals here following the same format
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("weekly")
  const { addItem } = useCart()

  const filteredMeals = meals.filter((meal) => meal.category === activeCategory)

  const handleAddToCart = (meal: typeof meals[0]) => {
    try {
      addItem({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity: 1,
        image: meal.image,
      })
      
      toast({
        title: "Added to cart",
        description: `${meal.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={activeCategory === "weekly" ? "default" : "outline"}
          onClick={() => setActiveCategory("weekly")}
        >
          This Week&apos;s Meals
        </Button>
        <Button
          variant={activeCategory === "freezer" ? "default" : "outline"}
          onClick={() => setActiveCategory("freezer")}
        >
          Freezer Meals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-card rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
              <p className="text-muted-foreground mb-4">{meal.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                  <p>Protein: {meal.macros.protein}</p>
                  <p>Carbs: {meal.macros.carbs}</p>
                  <p>Fat: {meal.macros.fat}</p>
                </div>
                <p className="text-xl font-bold">${meal.price}</p>
              </div>
              <Button
                className="w-full"
                onClick={() => handleAddToCart(meal)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}