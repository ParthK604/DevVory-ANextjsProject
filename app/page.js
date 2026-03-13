"use client"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

useEffect(() => {
  if (session) {
    router.replace("/dashboard")
  }
}, [session, router])
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">


      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-6">
        Welcome to DevVory
      </h1>


      <p className="max-w-3xl text-gray-600 text-lg leading-relaxed mb-8">
        In today’s fast-paced learning environment, students come across a huge amount of information every day — lecture notes, tutorial videos, reference links, PDFs, and helpful resources. But keeping everything organized can be difficult. DevVory is your personal knowledge vault where you can store, organize, and revisit everything you learn in one structured and searchable place
      </p>


      <div className="flex gap-6">
        <button
          onClick={() => signIn(null, { callbackUrl: "/dashboard" })}
          className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow-md"
        >
          Get Started
        </button>

        <Link href="/about">
          <button className="border border-purple-600 text-purple-600 hover:bg-purple-100 transition px-6 py-2 rounded-lg font-semibold">
            Learn More
          </button>
        </Link>
      </div>

    </div>
  )
}