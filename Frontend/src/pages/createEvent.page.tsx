import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import {
  MdEdit,
  MdDescription,
  MdGroup,
  MdSettings,
  MdDelete,
  MdUploadFile,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { createEventAPI } from "../services/apis/event.api";
import { getSampleCertificateAPI } from "../services/apis/certificate.api";

import Navbar from "../components/navbar.component";
import StatusBadge from "../components/statusBadge.component";
import BackBTN from "../components/backBTN.component";
import PdfViewer from "../components/PDFViewer.component";
import ButtonComponent from "../components/button.component";
import XLSXViewer from "../components/XLSXViewer.component";

import { createEventSchema } from "../validators/event.validator";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const now = new Date();

  const [activityName, setActivityName] = useState<string>("ชื่อกิจกรรม");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [pdfUrl, setPdfUrl] = useState<string | null>();
  const [excelFile, setExcelFile] = useState<File | undefined>();
  const [excelUrl, setExcelUrl] = useState<string | null>();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [sampleCertificateUrl, setSampleCertificateUrl] = useState<string | null>();

  const [fieldConfig, setFieldConfig] = useState<{
    fontSize: string;
    top: string;
    left: string;
  }>({
    fontSize: "24",
    top: "50",
    left: "50",
  });

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleDrop =
    (type: "pdf" | "excel") => async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (type === "pdf") {
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
        clearError("pdfFile");
        handleSampleCertificate(file);
      } else {
        setExcelFile(file);
        setExcelUrl(URL.createObjectURL(file));
        clearError("excelFile");
      }
    };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDelete = () => {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบกิจกรรมนี้?")) {
      navigate("/");
    }
  };

  const handleSampleCertificate = async (file: File) => {
    try {
      const res = await getSampleCertificateAPI({
        pdfFile: file,
        fontSize: Number(fieldConfig.fontSize),
        left: Number(fieldConfig.left),
        top: Number(fieldConfig.top),
      });

      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setSampleCertificateUrl(url);
        return;
      }
    } catch (error) {
      console.error("Error fetching sample certificate:", error);
      alert("เกิดข้อผิดพลาดในการดึงตัวอย่างใบประกาศนียบัตร");
    }
  };

  const handleCreateEvent = async () => {
    const result = createEventSchema.safeParse({
      activityName,
      pdfFile,
      excelFile,
      fontSize: Number(fieldConfig.fontSize),
      top: Number(fieldConfig.top),
      left: Number(fieldConfig.left),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const res = await createEventAPI({
        title: activityName,
        pdfFile: pdfFile!,
        excelFile: excelFile!,
        fontSize: Number(fieldConfig.fontSize),
        textX: Number(fieldConfig.left),
        textY: Number(fieldConfig.top),
      });
      if (res.status === 201) {
        alert("สร้างกิจกรรมสำเร็จ!");
        navigate("/event/" + res.data.data.eventID);
        return;
      }
      alert("เกิดข้อผิดพลาดในการสร้างกิจกรรม");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("เกิดข้อผิดพลาดในการสร้างกิจกรรม");
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      if (sampleCertificateUrl) URL.revokeObjectURL(sampleCertificateUrl);
    };
  }, [sampleCertificateUrl]);

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
                        onChange={(e) => {
                          setActivityName(e.target.value);
                          clearError("activityName");
                        }}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                        autoFocus
                        error={!!errors.activityName}
                        helperText={errors.activityName}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#1e293b",
                          },
                          "& .MuiInputBase-input": {
                            padding: "10px",
                          },
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: errors.activityName ? "#ef4444" : "#1e293b",
                            cursor: "pointer",
                          }}
                          onClick={() => setIsEditingName(true)}
                        >
                          {activityName}
                        </Typography>
                        {errors.activityName && (
                          <Typography sx={{ color: "#ef4444", fontSize: "12px" }}>
                            {errors.activityName}
                          </Typography>
                        )}
                      </Box>
                    )}
                    <Button
                      onClick={() => setIsEditingName(true)}
                      size="small"
                      sx={{
                        minWidth: "auto",
                        color: "#0C86FE",
                        padding: "2px",
                        "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.1)" },
                      }}
                    >
                      <MdEdit size={16} />
                    </Button>
                  </Box>
                  <StatusBadge status="Draft" size="large" />
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  สร้าง {now.toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={handleDelete}
              variant="outlined"
              sx={{
                minWidth: "auto",
                color: "#ef4444",
                borderColor: "#fecaca",
                padding: "8px",
                "&:hover": { backgroundColor: "#fee2e2", borderColor: "#ef4444" },
              }}
            >
              <MdDelete size={20} />
            </Button>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 5,
                  height: 30,
                  background: "linear-gradient(180deg, #557fe8, #44B0FF)",
                  borderRadius: "9999px",
                }}
              />
              <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>
                อัปโหลดไฟล์
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: "10px" }}>
                  <MdDescription size={20} style={{ color: "#0C86FE" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}
                  >
                    เทมเพลต <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Box>
                <Box sx={{ minHeight: "300px", height: "100%" }}>
                  {pdfFile ? (
                    <Box sx={{ width: "100%", gap: 2 }}>
                      {pdfUrl && (
                        <Box sx={{ width: "100%", maxWidth: 700 }}>
                          <PdfViewer fileUrl={pdfUrl} />
                        </Box>
                      )}
                      <Box sx={{ pt: "20px" }}>
                        <ButtonComponent
                          startIcon={<MdUploadFile />}
                          text="อัปโหลดไฟล์ใบประกาศนียบัตรใหม่"
                          width="100%"
                          onclick={() => pdfInputRef.current?.click()}
                        />
                        <input
                          ref={pdfInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setPdfFile(file);
                            setPdfUrl(URL.createObjectURL(file));
                            clearError("pdfFile");
                            handleSampleCertificate(file);
                          }}
                          style={{ display: "none" }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      onClick={() => pdfInputRef.current?.click()}
                      onDrop={handleDrop("pdf")}
                      onDragOver={handleDragOver}
                      sx={{
                        border: `2px dashed ${errors.pdfFile ? "#ef4444" : "#e2e8f0"}`,
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
                        backgroundColor: errors.pdfFile ? "#fff5f5" : "#f8fafc",
                        "&:hover": {
                          borderColor: "#0C86FE",
                          backgroundColor: "#eff6ff",
                        },
                      }}
                    >
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setPdfFile(file);
                          setPdfUrl(URL.createObjectURL(file));
                          clearError("pdfFile");
                          handleSampleCertificate(file);
                        }}
                        style={{ display: "none" }}
                      />
                      <MdUploadFile
                        size={32}
                        style={{
                          color: errors.pdfFile ? "#ef4444" : "#0C86FE",
                          marginBottom: "12px",
                        }}
                      />
                      <Typography sx={{ fontSize: "14px", color: "#1e293b" }}>
                        อัปโหลดไฟล์ <strong>PDF</strong> เทมเพลตใบประกาศนียบัตร
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94a3b8", pt: 0.5 }}>
                        คลิกหรือลากไฟล์เพื่ออัปโหลด (.pdf เท่านั้น)
                      </Typography>
                      {errors.pdfFile && (
                        <Typography sx={{ fontSize: "12px", color: "#ef4444", mt: 1, fontWeight: 500 }}>
                          {errors.pdfFile}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: "10px" }}>
                  <MdGroup size={20} style={{ color: "#0C86FE" }} />
                  <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>
                    รายชื่อผู้เข้าร่วม <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Box>
                <Box sx={{ height: { xs: "300px", md: "435px" }, width: { xs: "calc(100vw - 63px)", md: "100%" } }}>
                  {excelFile ? (
                    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box
                        sx={{
                          flex: 1,
                          overflowX: "auto",
                          overflowY: "auto",
                          border: "1px solid #eee",
                          borderRadius: 2,
                        }}
                      >
                        <XLSXViewer key={excelUrl} file={excelFile} />
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
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setExcelFile(file);
                          setExcelUrl(URL.createObjectURL(file));
                          clearError("excelFile");
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
                        border: `2px dashed ${errors.excelFile ? "#ef4444" : "#e2e8f0"}`,
                        borderRadius: "8px",
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: errors.excelFile ? "#fff5f5" : "#f8fafc",
                        "&:hover": {
                          borderColor: "#0C86FE",
                          backgroundColor: "#eff6ff",
                        },
                      }}
                    >
                      <input
                        ref={excelInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setExcelFile(file);
                          setExcelUrl(URL.createObjectURL(file));
                          clearError("excelFile");
                        }}
                        style={{ display: "none" }}
                      />
                      <MdUploadFile
                        size={32}
                        style={{
                          color: errors.excelFile ? "#ef4444" : "#0C86FE",
                          marginBottom: "12px",
                        }}
                      />
                      <Typography sx={{ fontSize: "14px", color: "#1e293b", display: "block" }}>
                        อัปโหลดไฟล์รายชื่อ <strong>Excel</strong>
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94a3b8", display: "block", mt: 0.5 }}>
                        คอลัมน์: ชื่อ นามสกุล อีเมล (.xlsx เท่านั้น)
                      </Typography>
                      {errors.excelFile && (
                        <Typography sx={{ fontSize: "12px", color: "#ef4444", mt: 1, fontWeight: 500 }}>
                          {errors.excelFile}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 5,
                  height: 30,
                  background: "linear-gradient(180deg, #557fe8, #44B0FF)",
                  borderRadius: "9999px",
                }}
              />
              <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#1e293b" }}>
                กำหนดจุด
              </Typography>
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
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>
                      ขนาดฟ้อนท์
                    </Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.fontSize}
                      onChange={(e) => {
                        setFieldConfig((prev) => ({ ...prev, fontSize: e.target.value }));
                        clearError("fontSize");
                      }}
                      fullWidth
                      size="small"
                      error={!!errors.fontSize}
                      helperText={errors.fontSize}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>
                      ความสูง (1-100%)
                    </Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.top}
                      onChange={(e) => {
                        setFieldConfig((prev) => ({ ...prev, top: e.target.value }));
                        clearError("top");
                      }}
                      fullWidth
                      size="small"
                      error={!!errors.top}
                      helperText={errors.top}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#64748b", display: "block", mb: 0.5 }}>
                      ตำแหน่งแนวนอน (1-100%)
                    </Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.left}
                      onChange={(e) => {
                        setFieldConfig((prev) => ({ ...prev, left: e.target.value }));
                        clearError("left");
                      }}
                      fullWidth
                      size="small"
                      error={!!errors.left}
                      helperText={errors.left}
                    />
                  </Box>
                  <ButtonComponent
                    startIcon={<MdSettings size={16} />}
                    onclick={() => handleSampleCertificate(pdfFile!)}
                    text="ยืนยัน"
                  />
                </Stack>
              </Box>
            </Paper>
            <Box sx={{ pt: "20px" }}>
              <ButtonComponent
                startIcon={<MdSettings size={16} />}
                onclick={handleCreateEvent}
                text="สร้างกิจกรรม"
                width="100%"
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}