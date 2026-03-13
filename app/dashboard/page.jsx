import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FiPlusSquare } from "react-icons/fi"
import { FaStar } from "react-icons/fa"
import Knowledge from "@/models/Knowledge"
import User from "@/models/User"
import connectDB from "@/lib/mongodb"
import Box from "../components/Box"
import DeleteButton from "../components/Deletebutton"

export default async function Dashboard() {

  const session = await getServerSession(authOptions)

  if (!session) redirect("/")

  await connectDB()

  const currentUser = await User.findOne({
    email: session.user.email
  })

  const knowledges = await Knowledge.find({
    userId: currentUser._id
  }).sort({ createdAt: -1 })

  

  return (

    <div className="p-6">

      <h1 className="text-3xl md:text-4xl font-bold mb-6">
      Welcome {session.user.name}
     </h1>

      <div className="mb-4 flex justify-between items-center">

        <h2 className="text-2xl font-semibold">
          Your Collections
        </h2>

        <Link href="/dashboard/add">
          <button className="text-purple-600 text-3xl hover:scale-110 transition">
            <FiPlusSquare />
          </button>
        </Link>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

  {knowledges.map((item) => (

    <div
      key={item._id}
      className="flex items-center justify-between gap-2 border p-3 rounded-lg hover:shadow-md transition"
    >

      {/* Title Box */}
      <Link
        href={`/dashboard/${item._id}`}
        className="flex-1 truncate"
      >
        <Box title={item.title} />
      </Link>

      {/* Icons */}
      <div className="flex items-center gap-2 shrink-0">

        {item.important && (
          <FaStar className="text-yellow-500 text-lg sm:text-xl" />
        )}

        <DeleteButton id={String(item._id)} />

      </div>

    </div>

  ))}

</div>

    </div>
  )
}