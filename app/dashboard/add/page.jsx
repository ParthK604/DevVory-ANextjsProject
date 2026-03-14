"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"

export default function AddPage() {

const [isDisabled, setIsDisabled] = useState(false)

const onSubmit = async (data) => {

  setIsDisabled(true)   // disable immediately

  const payload = {
    ...data,
    links,
    images: images.map(img => ({ url: img.url })),
    pdfs
  }

  try {

    await fetch("/api/knowledge/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    router.push("/dashboard")

  } catch (error) {

    console.error(error)
    setIsDisabled(false) // re-enable if error happens

  }

}

  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [links, setLinks] = useState([""])
  const [images, setImages] = useState([])
  const [pdfs, setPdfs] = useState([])

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

  const addLink = () => {
    setLinks([...links, ""])
  }

  const updateLink = (index, value) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const removeImage = async (index) => {

    const img = images[index]

    if (img.delete_token) {
      await deleteCloudinaryFile(img.delete_token)
    }

    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
  }

  


  return (

    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Add Knowledge
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* TITLE */}

        <div>
          <p className="font-semibold mb-1">Enter a Title</p>

          <input
            {...register("title", {
              required: "Title is required",
              maxLength: {
                value: 20,
                message: "Title cannot exceed 20 characters"
              }
            })}
            placeholder="Title"
            className="border p-3 rounded w-full"
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>


        {/* DESCRIPTION */}

        <div>
          <p className="font-semibold mb-1">Enter a Short Description</p>

          <input
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 80,
                message: "Description cannot exceed 80 characters"
              }
            })}
            placeholder="Short Description"
            className="border p-3 rounded w-full"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* NOTES */}
        <div>

          <p className="font-semibold mb-2">
            Write your notes or explanation below
          </p>

          <textarea
            {...register("notes")}
            placeholder="Start writing your notes..."
            className="border p-3 rounded w-full resize-none overflow-hidden min-h-30"
            onInput={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
          />

        </div>

        {/* IMPORTANT */}
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("important")} />
          Mark this knowledge as important
        </label>

        {/* LINKS */}

        <div>

          <p className="font-semibold mb-3">
            Add reference links that helped you learn this topic
          </p>

          {links.map((link, i) => (
            <input
              key={i}
              value={link}
              onChange={(e) => updateLink(i, e.target.value)}
              className="border p-2 rounded mb-2 w-full"
              placeholder="Paste reference link"
            />
          ))}

          <button
            type="button"
            onClick={addLink}
            className="text-purple-600 font-medium"
          >
            + Add another link
          </button>

        </div>

        {/* IMAGE SECTION */}

        <div>

          <p className="font-semibold mb-3">
            Would you like to upload any reference images or diagrams?
          </p>

          <CldUploadWidget
            uploadPreset="devvault"
            options={{
              multiple: true,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
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
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upload Image
              </button>
            )}

          </CldUploadWidget>

          {/* SHOW IMAGES */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">

            {images.map((img, i) => (
              <div key={i} className="relative">

                <img
                  src={img.url}
                  className="w-full h-24 object-cover rounded-md border"
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

        </div>

        {/* DOCUMENT SECTION */}

        <div>

          <p className="font-semibold mb-3">
            Would you like to add any important documents (PDFs, PowerPoint files, spreadsheets, etc.)?
          </p>

          <CldUploadWidget
            uploadPreset="devvault"
            options={{
              multiple: true,
              resourceType: "raw",
              clientAllowedFormats: ["pdf", "ppt", "pptx", "doc", "docx", "xls"]
            }}
            onSuccess={(result) => {

              const url = result?.info?.secure_url

              if (!url) return

              setPdfs(prev => [...prev, url])
            }}
          >

            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Upload Document
              </button>
            )}

          </CldUploadWidget>

          {/* SHOW DOCUMENTS */}

          <ul className="mt-3 space-y-2">
            {pdfs.map((pdf, i) => (
              <li key={i}>
                <a href={pdf} target="_blank" className="text-blue-600 underline">
                  Document {i + 1}
                </a>
              </li>
            ))}
          </ul>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={isDisabled}
          className={`p-3 rounded mt-4 text-white ${isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isDisabled ? "Saving..." : "Save Knowledge"}
        </button>

      </form>

    </div>
  )
}