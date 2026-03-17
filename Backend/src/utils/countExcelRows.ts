import path from "path"
import * as XLSX from "xlsx"

export function countExcelRows(filePath: string) {

    const fullPath = path.join(process.cwd(), filePath)

    const workbook = XLSX.readFile(fullPath)

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const json = XLSX.utils.sheet_to_json(sheet)

    return json.length
}