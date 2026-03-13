"use client"

import React from 'react'
import { FaGithub } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"

const page = () => {
  return (

    <div className="min-h-screen flex items-center justify-center px-6 py-10">

      <div className="max-w-3xl w-full text-center">

        {/* TITLE */}

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About DevVory
        </h1>

        {/* DESCRIPTION */}

        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">

          Hi, I'm <span className="font-semibold">Parth Kamath</span>, a student at
          <span className="font-semibold"> TSEC (Thadomal Shahani Engineering College)</span>.
          I enjoy building things on the web and exploring how technology can solve
          real problems.

          <br /><br />

          DevVory was created from a simple problem that most of us face —
          we consume a lot of knowledge every day: YouTube tutorials, Different problems,
          GitHub repositories, blog posts, notes, and documentation.

          <br /><br />

          But all this information gets scattered across bookmarks, chats,
          random documents, and different platforms.

          <br /><br />

          <span className="font-semibold">
            DevVory is a personal knowledge vault
          </span>{" "}
          designed to help people store, organize, and revisit everything they learn
          in one structured place.

          <br /><br />

          The goal is simple: help people build their own organized
          knowledge system instead of losing valuable resources.

        </p>

        {/* BUTTON SECTION */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          {/* GITHUB */}

          <a
            href="https://github.com/ParthK604"
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg hover:scale-105 transition"
          >
            <FaGithub size={20} />
            GitHub
          </a>

          {/* LINKEDIN */}

          <a
            href="https://www.linkedin.com/in/parth-kamath-84a721338"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:scale-105 transition"
          >
            <FaLinkedin size={20} />
            LinkedIn
          </a>

          {/* CONTRIBUTE */}

          <a
            href="https://github.com/ParthK604/DevVory-ANextjsProject"
            className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:scale-105 transition"
          >
            Contribute to DevVory
          </a>

        </div>

      </div>

    </div>

  )
}

export default page