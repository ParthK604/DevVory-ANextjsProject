import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import connectDB from "@/lib/mongodb"
import Knowledge from "@/models/Knowledge"
import Link from "next/link"

export default async function KnowledgePage({ params }) {

  const session = await getServerSession(authOptions)

  if (!session) redirect("/")

  await connectDB()

  const { id } = await params

  const knowledge = await Knowledge.findById(id)

  if (!knowledge) redirect("/dashboard")

  return (

    <div className="p-6 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          {knowledge.title}
        </h1>

       <div className="flex flex-row gap-1">
        <Link href={`/dashboard`}>
        <button className="bg-red-700 text-white px-4 py-2 rounded">
            Back
        </button>
        </Link>
        <Link href={`/knowledge/edit/${knowledge._id}`}>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            Edit
          </button>
        </Link>
       </div> 

      </div>

      <p className="text-gray-600 mb-6">
        {knowledge.description}
      </p>

      {/* NOTES */}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Notes</h2>

        <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {knowledge.notes}
        </div>
      </div>

      {/* LINKS */}

      {knowledge.links?.length > 0 && (

        <div className="mb-8">

          <h2 className="text-2xl font-semibold mb-2">
            Your Reference Links
          </h2>

          <ul className="space-y-2">

            {knowledge.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {link}
                </a>
              </li>
            ))}

          </ul>

        </div>

      )}

      {/* IMAGES */}

      {knowledge.images?.length > 0 && (

        <div className="mb-8">

          <h2 className="text-2xl font-semibold mb-2">
            Your Reference Images or diagrams
          </h2>

          <div className="grid grid-cols-3 gap-4">

            {knowledge.images.map((img,i)=>(
               <Link key={i} href={img.url} target="_blank">
              <img
                key={i}
                src={img.url}
                className="rounded shadow"
               />
               </Link>
              ))}

          </div>

        </div>

      )}

      {/* DOCUMENTS */}

      {knowledge.pdfs?.length > 0 && (

        <div>

          <h2 className="text-2xl font-semibold mb-2">
           Your Documents
          </h2>

          <ul className="space-y-2">

            {knowledge.pdfs.map((doc,i)=>(
              <li key={i}>
                <a
                  href={doc}
                  target="_blank"
                  className="text-green-600 underline"
                >
                  Open Document {i+1}
                </a>
              </li>
            ))}

          </ul>

        </div>

      )}

    </div>
  )
} 