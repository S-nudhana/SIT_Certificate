import * as XLSX from "xlsx"

export function countExcelRows(filePath: string): number {
    const workbook = XLSX.readFile(filePath)

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(sheet)

    return data.length
}