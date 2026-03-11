"use client"
import Link from "next/link"
import { signIn } from "next-auth/react"


export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

      
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-6">
        Welcome to DevVault 
      </h1>

     
      <p className="max-w-3xl text-gray-600 text-lg leading-relaxed mb-8">
        In today’s fast-paced tech world, developers consume massive amounts of information —
        YouTube tutorials, DSA problems, GitHub repositories, system design blogs, documentation,
        coding snippets and more. DevVault is your personal knowledge vault to securely store,
        organize and retrieve everything you learn — all in one structured, searchable place.
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