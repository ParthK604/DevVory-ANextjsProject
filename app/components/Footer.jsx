import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-purple-400 text-white h-12 flex items-center justify-center font-semibold">
      © {new Date().getFullYear()} DevVault. All rights reserved.
    </footer>
  )
}

export default Footer
