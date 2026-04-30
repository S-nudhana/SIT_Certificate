import { useState, useRef, useEffect, useCallback } from "react"
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material"
import {
  MdEdit,
  MdDescription,
  MdGroup,
  MdTipsAndUpdates,
  MdSettings,
  MdDelete,
  MdUploadFile,
  MdOutlineFileUpload,
  MdCheck,
} from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"

import Navbar from "../components/navbar.component"
import StatusBadge from "../components/statusBadge.component"
import BackBTN from "../components/backBTN.component"
import PdfViewer from "../components/PDFViewer.component"
import ButtonComponent from "../components/button.component"
import XLSXViewer from "../components/XLSXViewer.component"
import { useGetEventById } from "../hooks/query/event.query"
import { getSampleCertificateAPI, generateCertificateAPI } from "../services/apis/certificate.api"
import { updateEventByIdAPI } from "../services/apis/event.api"
import { updateEventSchema } from "../validators/event.validator"

import type { FieldConfig } from "../types/event/eventDetail.type"

export default function EventDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isLoading, isError } = useGetEventById(Number(id))

  const activity = data?.data?.data?.event ?? null

  const resolveFileUrl = (url?: string | null): string | null => {
    if (!url) return null
    const baseUrl = import.meta.env.VITE_IMG_URL || ""
    return `${baseUrl}${url}`
  }

  const [activityName, setActivityName] = useState<string>("")
  const [isEditingName, setIsEditingName] = useState(false)
  const activityLoaded = useRef(false)

  const [fieldConfig, setFieldConfig] = useState<FieldConfig>({
    fontSize: "24",
    top: "50",
    left: "50",
  })

  const [pdfFile, setPdfFile] = useState<File | undefined>()
  const [pdfFileFromUrl, setPdfFileFromUrl] = useState<File | undefined>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const [excelFile, setExcelFile] = useState<File | undefined>()
  const [excelFileFromUrl, setExcelFileFromUrl] = useState<File | undefined>()
  const [excelUrl, setExcelUrl] = useState<string | null>(null)

  const [sampleCertificateUrl, setSampleCertificateUrl] = useState<string | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!activity || activityLoaded.current) return
    activityLoaded.current = true
    setActivityName(activity.eventTitle ?? "")
    setFieldConfig({
      fontSize: activity.eventTextSize ?? "24",
      top: activity.eventTextYPos ?? "50",
      left: activity.eventTextXPos ?? "50",
    })
    const pdfUrl = resolveFileUrl(activity.certificateURL)
    if (pdfUrl) {
      setPdfUrl(pdfUrl)
      fetch(pdfUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setPdfFileFromUrl(new File([blob], "template.pdf", { type: "application/pdf" }))
        })
        .catch(console.error)
    }

    const xlsxUrl = resolveFileUrl(activity.excelURL)
    if (xlsxUrl) {
      setExcelUrl(xlsxUrl)
      fetch(xlsxUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setExcelFileFromUrl(
            new File([blob], "participants.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          )
        })
        .catch(() => setExcelFileFromUrl(undefined))
    }
  }, [activity])

  const handleSampleCertificate = useCallback(
    async (file: File) => {
      const parsedConfig = {
        fontSize: Number(fieldConfig.fontSize) || 0,
        top: Number(fieldConfig.top) || 0,
        left: Number(fieldConfig.left) || 0,
      }
      try {
        const res = await getSampleCertificateAPI({
          pdfFile: file,
          fontSize: parsedConfig.fontSize,
          left: parsedConfig.left,
          top: parsedConfig.top,
        })
        if (res.status === 200) {
          const blob = new Blob([res.data], { type: "application/pdf" })
          setSampleCertificateUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return URL.createObjectURL(blob)
          })
        }
      } catch (error) {
        console.error("Error fetching sample certificate:", error)
      }
    },
    [fieldConfig]
  )

  useEffect(() => {
    const file = pdfFile ?? pdfFileFromUrl
    if (!file) return
    handleSampleCertificate(file)
  }, [pdfFile, pdfFileFromUrl])

  useEffect(() => {
    return () => {
      if (sampleCertificateUrl) URL.revokeObjectURL(sampleCertificateUrl)
    }
  }, [sampleCertificateUrl])

  const handleDrop =
    (type: "pdf" | "excel") => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file) return
      if (type === "pdf") {
        setPdfFile(file)
        setPdfUrl(URL.createObjectURL(file))
        handleSampleCertificate(file)
      } else {
        setExcelFile(file)
        setExcelUrl(URL.createObjectURL(file))
      }
    }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleConfirm = () => {
    const file = pdfFile ?? pdfFileFromUrl
    if (file) handleSampleCertificate(file)
  }

  const handleUpdateEvent = async () => {
    const resolvedPdf = pdfFile ?? pdfFileFromUrl
    const resolvedExcel = excelFile ?? excelFileFromUrl
    const parsedConfig = {
      fontSize: Number(fieldConfig.fontSize) || 0,
      top: Number(fieldConfig.top) || 0,
      left: Number(fieldConfig.left) || 0,
    }
    const result = updateEventSchema.safeParse({
      activityName,
      pdfFile: resolvedPdf,
      excelFile: resolvedExcel,
      fontSize: parsedConfig.fontSize,
      top: parsedConfig.top,
      left: parsedConfig.left,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!resolvedPdf || !resolvedExcel) {
      setErrors({
        pdfFile: !resolvedPdf ? "กรุณาอัปโหลดไฟล์ PDF" : "",
        excelFile: !resolvedExcel ? "กรุณาอัปโหลดไฟล์ Excel" : "",
      })
      return
    }

    setErrors({})
    setIsUpdating(true)

    try {
      const res = await updateEventByIdAPI({
        eventID: Number(id),
        title: activityName,
        pdfFile: resolvedPdf,
        excelFile: resolvedExcel,
        fontSize: parsedConfig.fontSize,
        textX: parsedConfig.left,
        textY: parsedConfig.top,
      })

      if (res.status === 200 || res.status === 201) {
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตกิจกรรม")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGenerateCertificate = async () => {
    try {
      const res = await generateCertificateAPI(Number(id))
      console.log(res)
    } catch (error) {
      console.error("Error generating certificate:", error)
      alert("เกิดข้อผิดพลาดในการสร้างใบรับรอง")
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return <div>Failed to load event detail</div>
  }

  if (!activity) {
    return (
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ textAlign: "center", gap: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20px", color: "#1e293b" }}>ไม่พบกิจกรรม</Typography>
            <ButtonComponent onclick={() => navigate("/")} text="กลับไปที่หน้าหลัก" width="100%" />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
              <BackBTN />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, gap: 1.5, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isEditingName ? (
                      <TextField
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setIsEditingName(false)
                          if (e.key === "Escape") {
                            setActivityName(activity.eventTitle ?? "")
                            setIsEditingName(false)
                          }
                        }}
                        autoFocus
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": { fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" },
                          "& .MuiInputBase-input": { padding: "8px 12px" },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{ fontSize: "24px", fontWeight: 700, color: "#1e293b", cursor: "pointer" }}
                        onClick={() => setIsEditingName(true)}
                      >
                        {activityName || activity.eventTitle}
                      </Typography>
                    )}
                    <Button
                      onClick={() => setIsEditingName(true)}
                      size="small"
                      sx={{ minWidth: "auto", color: "#0C86FE", padding: "2px", "&:hover": { backgroundColor: "rgba(37,99,235,0.1)" } }}
                    >
                      <MdEdit size={16} />
                    </Button>
                  </Box>
                  <StatusBadge status={activity.status} size="large" />
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  สร้าง {new Date(activity.eventCreateAt).toLocaleDateString("th-TH")} • แก้ไขล่าสุด {new Date(activity.eventUpdateAt).toLocaleDateString("th-TH")}
                </Typography>
              </Box>
            </Box>
            <Button
              sx={{ minWidth: "auto", color: "#ef4444", padding: "8px", "&:hover": { backgroundColor: "#fee2e2" } }}
            >
              <MdDelete size={20} />
            </Button>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 5, height: 30, background: "linear-gradient(180deg, #557fe8, #44B0FF)", borderRadius: "9999px" }} />
              <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>อัปโหลดไฟล์</Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <Paper sx={{ p: 2, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", backgroundColor: "#fff", display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: "10px" }}>
                  <MdDescription size={20} style={{ color: "#0C86FE" }} />
                  <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>เทมเพลต</Typography>
                </Box>
                {errors.pdfFile && (
                  <Typography sx={{ fontSize: "12px", color: "#ef4444", mb: 1 }}>{errors.pdfFile}</Typography>
                )}
                <Box sx={{ minHeight: "300px", height: "100%" }}>
                  {pdfUrl ? (
                    <Box sx={{ width: "100%", gap: 2 }}>
                      <Box sx={{ width: "100%", maxWidth: 700 }}>
                        <PdfViewer key={pdfUrl} fileUrl={pdfUrl} />
                      </Box>
                      <Box sx={{ pt: "20px" }}>
                        <ButtonComponent
                          startIcon={<MdUploadFile />}
                          text="อัปโหลดไฟล์ใบประกาศนียบัตรใหม่"
                          width="100%"
                          onclick={() => pdfInputRef.current?.click()}
                        />
                      </Box>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setPdfFile(file)
                          setPdfUrl(URL.createObjectURL(file))
                          handleSampleCertificate(file)
                          e.target.value = ""
                        }}
                        style={{ display: "none" }}
                      />
                    </Box>
                  ) : (
                    <Box
                      onClick={() => pdfInputRef.current?.click()}
                      onDrop={handleDrop("pdf")}
                      onDragOver={handleDragOver}
                      sx={{
                        border: "2px dashed #e2e8f0",
                        borderRadius: "8px",
                        textAlign: "center",
                        minHeight: "100%",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#f8fafc",
                        "&:hover": { borderColor: "#0C86FE", backgroundColor: "#eff6ff" },
                      }}
                    >
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setPdfFile(file)
                          setPdfUrl(URL.createObjectURL(file))
                          handleSampleCertificate(file)
                          e.target.value = ""
                        }}
                        style={{ display: "none" }}
                      />
                      <MdUploadFile size={32} style={{ color: "#0C86FE", marginBottom: "12px" }} />
                      <Typography sx={{ fontSize: "14px", color: "#1e293b" }}>
                        อัปโหลดไฟล์ <strong>PDF</strong> เทมเพลตใบประกาศนียบัตร
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94a3b8", pt: 0.5 }}>
                        คลิกหรือลากไฟล์เพื่ออัปโหลด (.pdf เท่านั้น)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
              <Paper sx={{ p: 2, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", backgroundColor: "#fff", display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: "10px" }}>
                  <MdGroup size={20} style={{ color: "#0C86FE" }} />
                  <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>รายชื่อผู้เข้าร่วม</Typography>
                </Box>
                {errors.excelFile && (
                  <Typography sx={{ fontSize: "12px", color: "#ef4444", mb: 1 }}>{errors.excelFile}</Typography>
                )}
                <Box sx={{ height: { xs: "300px", md: "415px" }, width: { xs: "calc(100vw - 63px)", md: "100%" } }}>
                  {excelUrl ? (
                    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ flex: 1, overflowX: "auto", overflowY: "auto", border: "1px solid #eee", borderRadius: 2 }}>
                        {(excelFile || excelFileFromUrl) ? (
                          <XLSXViewer key={excelUrl} file={(excelFile ?? excelFileFromUrl)!} />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography sx={{ fontSize: "14px" }}>กำลังโหลด...</Typography>
                          </Box>
                        )}
                      </Box>
                      <ButtonComponent
                        startIcon={<MdUploadFile />}
                        text="อัปโหลดไฟล์รายชื่อผู้เข้าร่วมใหม่"
                        width="100%"
                        onclick={() => excelInputRef.current?.click()}
                      />
                      <input
                        ref={excelInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setExcelFile(file)
                          setExcelUrl(URL.createObjectURL(file))
                          e.target.value = ""
                        }}
                        style={{ display: "none" }}
                      />
                    </Box>
                  ) : (
                    <Box
                      onClick={() => excelInputRef.current?.click()}
                      onDrop={handleDrop("excel")}
                      onDragOver={handleDragOver}
                      sx={{
                        border: "2px dashed #e2e8f0",
                        borderRadius: "8px",
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#f8fafc",
                        "&:hover": { borderColor: "#0C86FE", backgroundColor: "#eff6ff" },
                      }}
                    >
                      <input
                        ref={excelInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setExcelFile(file)
                          setExcelUrl(URL.createObjectURL(file))
                          e.target.value = ""
                        }}
                        style={{ display: "none" }}
                      />
                      <MdUploadFile size={32} style={{ color: "#0C86FE", marginBottom: "12px" }} />
                      <Typography sx={{ fontSize: "14px", color: "#1e293b", display: "block" }}>
                        อัปโหลดไฟล์รายชื่อ <strong>Excel</strong>
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94a3b8", display: "block", mt: 0.5 }}>
                        คอลัมน์: ชื่อ นามสกุล อีเมล (.xlsx เท่านั้น)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 5, height: 30, background: "linear-gradient(180deg, #557fe8, #44B0FF)", borderRadius: "9999px" }} />
              <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>กำหนดจุด</Typography>
            </Box>
            <Paper sx={{ p: 3, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
                {sampleCertificateUrl ? (
                  <Box sx={{ width: "100%", maxWidth: 700 }}>
                    <PdfViewer fileUrl={sampleCertificateUrl} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: "2px dashed #e2e8f0",
                      borderRadius: "8px",
                      backgroundColor: "#f0f4f8",
                      minHeight: "280px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        position: "absolute",
                        top: `${fieldConfig.top}%`,
                        left: `${fieldConfig.left}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: `${Math.max(10, Number(fieldConfig.fontSize) * 0.6)}px`,
                        color: "#94a3b8",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      Preview
                    </Typography>
                  </Box>
                )}
                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>ขนาดฟ้อนท์</Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.fontSize}
                      onChange={(e) =>
                        setFieldConfig(prev => ({
                          ...prev,
                          fontSize: e.target.value
                        }))
                      }
                      fullWidth
                      size="small"
                      error={!!errors.fontSize}
                      helperText={errors.fontSize}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>ความสูง (1-100%)</Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.top}
                      onChange={(e) =>
                        setFieldConfig(prev => ({
                          ...prev,
                          top: e.target.value
                        }))
                      }
                      fullWidth
                      size="small"
                      error={!!errors.top}
                      helperText={errors.top}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>ความกว้าง (1-100%)</Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.left}
                      onChange={(e) =>
                        setFieldConfig(prev => ({
                          ...prev,
                          left: e.target.value
                        }))
                      }
                      fullWidth
                      size="small"
                      error={!!errors.left}
                      helperText={errors.left}
                    />
                  </Box>
                  <ButtonComponent
                    startIcon={<MdSettings size={16} />}
                    onclick={handleConfirm}
                    text="ยืนยัน"
                  />
                </Stack>
              </Box>
            </Paper>
          </Box>
          <Box sx={{ position: "relative" }}>
            <ButtonComponent
              startIcon={
                isUpdating
                  ? <CircularProgress size={16} sx={{ color: "#fff" }} />
                  : updateSuccess
                    ? <MdCheck size={16} />
                    : <MdOutlineFileUpload size={16} />
              }
              onclick={isUpdating ? undefined : handleUpdateEvent}
              text={isUpdating ? "กำลังอัพเดต..." : updateSuccess ? "อัพเดตสำเร็จ!" : "อัพเดตกิจกรรม"}
              width="100%"
            />
          </Box>
          <Paper sx={{ p: 2.5, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <MdTipsAndUpdates size={18} style={{ color: "#0C86FE" }} />
                <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>สร้างและดาวน์โหลดใบประกาศนียบัตรทั้งหมด</Typography>
              </Box>
              <ButtonComponent
                endIcon={<MdTipsAndUpdates size={16} />}
                onclick={handleGenerateCertificate}
                text="สร้างใบประกาศนียบัตร"
                width={{ xs: "100%", md: "auto" }}
              />
            </Box>
          </Paper>
          <Paper sx={{ p: 2.5, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", opacity: 0.6 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: { xs: "start", md: "space-between" }, alignItems: { xs: "start", md: "center" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <MdDescription size={18} style={{ color: "#cbd5e1" }} />
                <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#94a3b8" }}>ส่งใบประกาศนียบัตร</Typography>
              </Box>
              <Typography sx={{ color: "#cbd5e1", display: "block", mt: 0.25 }}>
                เร็ว ๆ นี้ — ส่งใบประกาศนียบัตรทางอีเมลหลังจากลงนาม
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}