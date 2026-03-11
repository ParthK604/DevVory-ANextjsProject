"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"

export default function AddPage() {

  const router = useRouter()

  const { register, handleSubmit } = useForm()

  const [links, setLinks] = useState([""])
  const [images, setImages] = useState([])
  const [pdfs, setPdfs] = useState([])

  // delete file from cloudinary
  async function deleteCloudinaryFile(token) {

    await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/delete_by_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      }
    )
  }

  // handle page close cleanup
  useEffect(() => {

    const handleUnload = async () => {
      for (const img of images) {
        if (img.delete_token) {
          await deleteCloudinaryFile(img.delete_token)
        }
      }
    }

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }

  }, [images])

  // dynamic links
  const addLink = () => {
    setLinks([...links, ""])
  }

  const updateLink = (index, value) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  // remove uploaded image
  const removeImage = async (index) => {

    const img = images[index]

    if (img.delete_token) {
      await deleteCloudinaryFile(img.delete_token)
    }

    const updated = [...images]
    updated.splice(index,1)
    setImages(updated)
  }

  const onSubmit = async (data) => {

    const payload = {
      ...data,
      links,
      images: images.map(img => ({ url: img.url })),
      pdfs
    }

    await fetch("/api/knowledge/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    router.push("/dashboard")
  }

  return (

    <div className="max-w-3xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Add Knowledge
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* TITLE */}
        <input
          {...register("title")}
          placeholder="Title"
          className="border p-2 rounded"
        />

        {/* DESCRIPTION */}
        <input
          {...register("description")}
          placeholder="Description"
          className="border p-2 rounded"
        />

        {/* NOTES */}
        <textarea
          {...register("notes")}
          placeholder="Write notes..."
          className="border p-3 rounded h-40"
        />

        {/* IMPORTANT CHECKBOX */}
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("important")} />
          Mark as Important
        </label>

        {/* LINKS */}
        <div>

          <h3 className="font-semibold mb-2">Links</h3>

          {links.map((link, i) => (
            <input
              key={i}
              value={link}
              onChange={(e) => updateLink(i, e.target.value)}
              className="border p-2 rounded mb-2 w-full"
              placeholder="Paste link"
            />
          ))}

          <button
            type="button"
            onClick={addLink}
            className="text-purple-600"
          >
            + Add Link
          </button>

        </div>

        {/* IMAGE UPLOAD */}
       <CldUploadWidget
  uploadPreset="devvault"
  options={{
    multiple: true,
    resourceType: "image",
    clientAllowedFormats: ["jpg","jpeg","png","webp"]
  }}
  onSuccess={(result) => {

    const url = result?.info?.secure_url
    const token = result?.info?.delete_token

    if (!url) return

    setImages(prev => [
      ...prev,
      {
        url: url,
        delete_token: token
      }
    ])

  }}
>
  {({ open }) => (
    <button
      type="button"
      onClick={() => open()}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Upload Image
    </button>
  )}
</CldUploadWidget>

        {/* SHOW IMAGES */}
        <div className="grid grid-cols-4 gap-3">

  {images.map((img, i) => (
    <div key={i} className="relative">

      <img
        src={img.url}
        className="w-24 h-24 object-cover rounded-md border"
      />

      <button
        type="button"
        onClick={() => removeImage(i)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
      >
        ×
      </button>

    </div>
  ))}

</div>

        {/* PDF UPLOAD */}
        <CldUploadWidget
  uploadPreset="devvault"
  options={{
    multiple: true,
    resourceType: "raw",
    clientAllowedFormats: ["pdf","ppt","pptx","doc","docx","xls"]
  }}
  onSuccess={(result) => {

    const url = result?.info?.secure_url

    if (!url) return

    setPdfs(prev => [
      ...prev,
      url
    ])

  }}
>
  {({ open }) => (
    <button
      type="button"
      onClick={() => open()}
      className="bg-green-500 text-white p-2 rounded"
    >
      Upload Document
    </button>
  )}
</CldUploadWidget>

        {/* SHOW PDFs */}
        <ul>
          {pdfs.map((pdf, i) => (
            <li key={i}>
              <a href={pdf} target="_blank" className="text-blue-600 underline">
                DOCUMENT {i + 1}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="bg-purple-600 text-white p-3 rounded"
        >
          Save Knowledge
        </button>

      </form>
    </div>
  )
}