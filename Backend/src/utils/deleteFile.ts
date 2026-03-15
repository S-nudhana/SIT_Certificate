import fs from "fs/promises"
import path from "path"

export async function deleteFile(fileUrl: string) {
    try {
        const filePath = path.join(process.cwd(), fileUrl)
        await fs.unlink(filePath)
        return true
    } catch (error) {
        console.error("File delete failed:", error)
        return false
    }
}