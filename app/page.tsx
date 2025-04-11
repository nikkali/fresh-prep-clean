"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-6">Welcome to Fresh Prep</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Delicious, healthy meals prepared fresh for you
        </p>
        
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
            alt="Healthy Meal"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/menu">
            <Button size="lg" className="text-lg">
              View This Week's Menu
            </Button>
          </Link>
          <Link href="/faq">
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-card shadow-lg transition-transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
            <p className="text-muted-foreground">
              We use only the freshest, highest quality ingredients
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card shadow-lg transition-transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-2">Weekly Menu</h3>
            <p className="text-muted-foreground">
              New delicious options every week
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card shadow-lg transition-transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-2">Easy Pickup</h3>
            <p className="text-muted-foreground">
              Convenient pickup locations
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}