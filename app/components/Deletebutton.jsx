"use client"
import { MdDelete } from "react-icons/md"
import { useRouter } from "next/navigation"

export default function DeleteButton({ id }) {
  const router=useRouter()
  async function handleDelete() {

    const res = await fetch(`/api/knowledge/${id}`, {
      method: "DELETE"
    })

    if(res.ok){
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-xl hover:scale-110"
    >
      <MdDelete />
    </button>
  )
}