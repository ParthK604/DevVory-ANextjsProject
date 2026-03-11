import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Knowledge from "@/models/Knowledge"
import cloudinary from "@/lib/cloudinary"

function extractPublicId(url) {
  const parts = url.split("/")
  const uploadIndex = parts.indexOf("upload")
  const publicIdWithVersion = parts.slice(uploadIndex + 2).join("/")
  return publicIdWithVersion.split(".")[0]
}

export async function DELETE(req, { params }) {

  try {

    await connectDB()

    const { id } = await params

    const knowledge = await Knowledge.findById(id)

    if (!knowledge) {
      return NextResponse.json(
        { success:false, message:"Knowledge not found" },
        { status:404 }
      )
    }

    /* DELETE IMAGES */

    if (knowledge.images?.length) {

      for (const img of knowledge.images) {

        const publicId = extractPublicId(img.url)

        const result = await cloudinary.uploader.destroy(publicId)

        console.log("Image delete:", result)

      }

    }

    /* DELETE DOCUMENTS */

    if (knowledge.pdfs?.length) {

      for (const file of knowledge.pdfs) {

        const publicId = extractPublicId(file)

        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw"
        })

        console.log("Doc delete:", result)

      }

    }

    /* DELETE DATABASE ENTRY */

    await Knowledge.findByIdAndDelete(id)

    return NextResponse.json({
      success:true,
      message:"Knowledge and files deleted"
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { success:false, error:error.message },
      { status:500 }
    )

  }

}

export async function PUT(req,{params}){

  await connectDB()

  const {id} = await params

  const body = await req.json()

  const updated = await Knowledge.findByIdAndUpdate(
    id,
    body,
    {new:true}
  )

  return NextResponse.json(updated)

}
export async function GET(req, { params }) {

  try {

    await connectDB()

    const { id } = await params

    const knowledge = await Knowledge.findById(id)

    if (!knowledge) {
      return NextResponse.json(
        { success:false, message:"Not found" },
        { status:404 }
      )
    }

    return NextResponse.json(knowledge)

  } catch (error) {

    return NextResponse.json(
      { success:false, error:error.message },
      { status:500 }
    )

  }

}