import fs from "fs/promises"
import path from "path"

export async function saveFile(file: File, folder: string, fileName: string) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadPath = path.join(process.cwd(), "uploads", folder)

    await fs.mkdir(uploadPath, { recursive: true })

    const filePath = path.join(uploadPath, fileName)

    await fs.writeFile(filePath, buffer)

    return `/uploads/${folder}/${fileName}`
}