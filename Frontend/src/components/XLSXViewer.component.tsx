import { useEffect, useState } from "react"
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import * as XLSX from "xlsx"

interface Props {
    file: File
    onDataLoaded?: (data: any[]) => void
}

export default function XLSXViewer({ file, onDataLoaded }: Props) {
    const [rows, setRows] = useState<any[]>([])
    const headers = ["ชื่อ", "นามสกุล", "อีเมล"]

    useEffect(() => {
        if (!file) return

        const reader = new FileReader()

        reader.onload = (e) => {
            const data = e.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: "array" })

            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]

            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })

            if (!json.length) return

            const bodyRows = json.slice(1)

            setRows(bodyRows as any[])

            if (onDataLoaded) {
                const objects = XLSX.utils.sheet_to_json(sheet)
                onDataLoaded(objects)
            }
        }

        reader.readAsArrayBuffer(file)
    }, [file])

    if (!rows.length) {
        return <></>
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                overflowX: "auto",
                overflowY: "auto"
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {headers.map((h, i) => (
                            <TableCell key={i}>{h}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            {row.map((cell: any, j: number) => (
                                <TableCell key={j}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}