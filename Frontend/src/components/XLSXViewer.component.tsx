import { useEffect, useState } from "react"
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import * as XLSX from "xlsx"

import type { NormalizedRow, XLSXViewerProps } from "../types/components.type"

const FIRSTNAME_KEYS = ["firstname", "first_name", "first name", "ชื่อ", "name"]
const LASTNAME_KEYS  = ["lastname",  "last_name",  "last name",  "นามสกุล", "surname"]
const EMAIL_KEYS     = ["email", "e-mail", "อีเมล", "อีเมล์", "mail"]

function findKey(obj: Record<string, any>, candidates: string[]): string | undefined {
    const lower = Object.keys(obj).map(k => ({ original: k, normalized: k.toLowerCase().trim() }))
    for (const candidate of candidates) {
        const match = lower.find(k => k.normalized === candidate.toLowerCase())
        if (match) return match.original
    }
    return undefined
}

function normalizeRow(row: Record<string, any>): NormalizedRow {
    const firstnameKey = findKey(row, FIRSTNAME_KEYS)
    const lastnameKey  = findKey(row, LASTNAME_KEYS)
    const emailKey     = findKey(row, EMAIL_KEYS)

    return {
        firstname: firstnameKey ? String(row[firstnameKey] ?? "").trim() : "",
        lastname:  lastnameKey  ? String(row[lastnameKey]  ?? "").trim() : "",
        email:     emailKey     ? String(row[emailKey]     ?? "").trim() : "",
    }
}

const HEADERS = ["ชื่อ", "นามสกุล", "อีเมล"]

export default function XLSXViewer({ file, onDataLoaded }: XLSXViewerProps) {
    const [rows, setRows] = useState<NormalizedRow[]>([])

    useEffect(() => {
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: "array" })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const objects = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[]

            if (!objects.length) return

            const normalized = objects
                .map(normalizeRow)
                .filter(r => r.firstname || r.lastname || r.email)

            setRows(normalized)
            onDataLoaded?.(objects)
        }
        reader.readAsArrayBuffer(file)
    }, [file])

    if (!rows.length) return <></>

    return (
        <Box sx={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "auto" }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {HEADERS.map((h, i) => (
                            <TableCell key={i}>{h}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.firstname}</TableCell>
                            <TableCell>{row.lastname}</TableCell>
                            <TableCell>{row.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}