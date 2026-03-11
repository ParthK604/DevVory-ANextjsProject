"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const { data:session }=useSession();
    return (
    <nav className='h-15 justify-between items-center px-3 bg-purple-400 flex text-white'>
    <div className="logo font-bold text-lg">
        <Link href="/">DevVault</Link>
    </div>
    <ul className="flex gap-4 items-center justify-center">
     <Link href="/about"><li>About</li></Link>
    <li>
    {session ? (
  <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-purple-600 shadow-lg p-3 rounded-lg py-1 font-bold">
    Sign Out
  </button>
) : (
  <button
  onClick={() => signIn(null, { callbackUrl: "/dashboard" })}>
  Sign In
</button>
)}</li>
  </ul>
    </nav>
  )
}

export default Navbar
