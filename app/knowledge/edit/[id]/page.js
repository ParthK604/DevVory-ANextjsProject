"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"

export default function EditPage(){

  const { id } = useParams()
  const router = useRouter()

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [notes,setNotes] = useState("")
  const [links,setLinks] = useState([])
  const [images,setImages] = useState([])
  const [documents,setDocuments] = useState([])
  const [important,setImportant] = useState(false)

  /* LOAD KNOWLEDGE */

  useEffect(()=>{

    async function load(){

      const res = await fetch(`/api/knowledge/${id}`)
      const data = await res.json()

      setTitle(data.title || "")
      setDescription(data.description || "")
      setNotes(data.notes || "")
      setLinks(data.links || [])
      setImages(data.images || [])
      setDocuments(data.pdfs || [])
      setImportant(data.important || false)

    }

    if(id) load()

  },[id])

  /* LINKS */

  function addLink(){
    setLinks([...links,""])
  }

  function updateLink(index,value){

    const newLinks=[...links]
    newLinks[index]=value
    setLinks(newLinks)

  }

  function removeLink(index){
    setLinks(links.filter((_,i)=>i!==index))
  }

  /* IMAGE REMOVE */

  function removeImage(index){
    setImages(images.filter((_,i)=>i!==index))
  }

  /* DOCUMENT REMOVE */

  function removeDocument(index){
    setDocuments(documents.filter((_,i)=>i!==index))
  }

  /* UPDATE */

  async function handleSubmit(e){

    e.preventDefault()

    const payload={
      title,
      description,
      notes,
      links,
      images,
      pdfs:documents,
      important
    }

    const res = await fetch(`/api/knowledge/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(payload)
    })

    if(res.ok){
      router.push(`/dashboard/${id}`)
    }

  }

  return(

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Knowledge
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* TITLE */}

        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
        />

        {/* DESCRIPTION */}

        <input
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded"
        />

        {/* NOTES */}

        <textarea
          value={notes}
          onChange={(e)=>setNotes(e.target.value)}
          className="border p-3 rounded h-40"
          placeholder="Write notes..."
        />

        {/* LINKS */}

        <div>

          <h2 className="font-semibold mb-2">Links</h2>

          {links.map((link,i)=>(
            <div key={i} className="flex gap-2 mb-2">

              <input
                value={link}
                onChange={(e)=>updateLink(i,e.target.value)}
                className="border p-2 flex-1"
              />

              <button
                type="button"
                onClick={()=>removeLink(i)}
                className="text-red-500"
              >
                X
              </button>

            </div>
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

        <div>

          <h2 className="font-semibold mb-2">Images</h2>

          <div className="flex gap-2 flex-wrap mb-3">

            {images.map((img,i)=>(
              <div key={i} className="relative">

                <img
                  src={img.url}
                  className="w-24 h-24 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={()=>removeImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1"
                >
                  X
                </button>

              </div>
            ))}

          </div>

          <CldUploadWidget
            uploadPreset="devvault"
            options={{resourceType:"image"}}
            onSuccess={(result)=>{

              setImages(prev=>[
                ...prev,
                {url:result.info.secure_url}
              ])

            }}
          >

            {({open})=>(
              <button
                type="button"
                onClick={()=>open()}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Upload Image
              </button>
            )}

          </CldUploadWidget>

        </div>

        {/* DOCUMENT UPLOAD */}

        <div>

          <h2 className="font-semibold mb-2">Documents</h2>

          <ul className="mb-3">

            {documents.map((doc,i)=>(
              <li key={i} className="flex gap-3 items-center">

                <a
                  href={doc}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Document {i+1}
                </a>

                <button
                  type="button"
                  onClick={()=>removeDocument(i)}
                  className="text-red-500"
                >
                  Delete
                </button>

              </li>
            ))}

          </ul>

          <CldUploadWidget
            uploadPreset="devvault"
            options={{
              resourceType:"raw",
              clientAllowedFormats:[
                "pdf","ppt","pptx","doc","docx","xls","xlsx"
              ]
            }}
            onSuccess={(result)=>{

              setDocuments(prev=>[
                ...prev,
                result.info.secure_url
              ])

            }}
          >

            {({open})=>(
              <button
                type="button"
                onClick={()=>open()}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Upload Document
              </button>
            )}

          </CldUploadWidget>

        </div>

        {/* IMPORTANT */}

        <label className="flex gap-2 items-center">

          <input
            type="checkbox"
            checked={important}
            onChange={(e)=>setImportant(e.target.checked)}
          />

          Mark as Important

        </label>

        {/* SUBMIT */}

        <button
          type="submit"
          className="bg-purple-600 text-white p-3 rounded"
        >
          Update Knowledge
        </button>

      </form>

    </div>

  )

}