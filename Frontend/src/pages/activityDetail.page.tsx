import { useState, useRef } from "react";
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
  MdArrowBack,
  MdEdit,
  MdDescription,
  MdGroup,
  MdTipsAndUpdates,
  MdSettings,
  MdDelete,
  MdUploadFile,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar.component";
import StatusBadge from "../components/statusBadge.component";
import { mockActivities } from "../data/mockData";
import type { Activity } from "../data/mockData";

interface FieldConfig {
  fontSize: number;
  top: number;
  left: number;
}

export default function ActivityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activity] = useState<Activity | null>(
    mockActivities.find((a) => a.id === id) || null
  );

  const [activityName, setActivityName] = useState(activity?.title || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const [fieldConfig, setFieldConfig] = useState<FieldConfig>({
    fontSize: 24,
    top: 50,
    left: 50,
  });

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleDrop =
    (type: "pdf" | "excel") => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (type === "pdf") setPdfFile(file);
      else setExcelFile(file);
    };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDelete = () => {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบกิจกรรมนี้?")) {
      navigate("/");
    }
  };

  const handleConfirm = () => {
    console.log({ fieldConfig });
  };

  const handleGenerateCertificates = () => {
    console.log("Generating certificates...");
  };

  if (!activity) {
    return (
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Navbar userName="Nannicha" userInitial="N" />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h5">ไม่พบกิจกรรม</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Navbar userName="Nannicha" userInitial="N" />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Page Header */}
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
              <Button
                onClick={() => navigate("/")}
                sx={{
                  minWidth: "auto",
                  color: "#64748b",
                  padding: "4px",
                  mt: 0.5,
                  "&:hover": { backgroundColor: "transparent", color: "#1e293b" },
                }}
              >
                <MdArrowBack size={20} />
              </Button>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  {isEditingName ? (
                    <TextField
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                      autoFocus
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#1e293b",
                        },
                        "& .MuiInputBase-input": {
                          padding: 0,
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#1e293b", cursor: "pointer" }}
                      onClick={() => setIsEditingName(true)}
                    >
                      {activityName}
                    </Typography>
                  )}
                  <Button
                    onClick={() => setIsEditingName(true)}
                    size="small"
                    sx={{
                      minWidth: "auto",
                      color: "#2563eb",
                      padding: "2px",
                      "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.1)" },
                    }}
                  >
                    <MdEdit size={16} />
                  </Button>
                  <StatusBadge status={activity.status} size="large" />
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  สร้าง {activity.createdAt} • แก้ไขล่าสุด {activity.updatedAt}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={handleDelete}
              sx={{
                minWidth: "auto",
                color: "#ef4444",
                padding: "8px",
                "&:hover": { backgroundColor: "#fee2e2" },
              }}
            >
              <MdDelete size={20} />
            </Button>
          </Box>

          {/* Upload Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 4, height: 20, backgroundColor: "#2563eb", borderRadius: "2px" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
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
              {/* Template Upload */}
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <MdDescription size={16} style={{ color: "#2563eb" }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    เทมเพลต
                  </Typography>
                </Box>
                <Box
                  onClick={() => pdfInputRef.current?.click()}
                  onDrop={handleDrop("pdf")}
                  onDragOver={handleDragOver}
                  sx={{
                    border: "2px dashed #e2e8f0",
                    borderRadius: "8px",
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      borderColor: "#2563eb",
                      backgroundColor: "#eff6ff",
                    },
                  }}
                >
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files && setPdfFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <MdUploadFile size={32} style={{ color: "#2563eb", marginBottom: "12px" }} />
                  {pdfFile ? (
                    <Typography variant="caption" sx={{ color: "#2563eb", fontWeight: 500 }}>
                      {pdfFile.name}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: "#1e293b", display: "block" }}>
                        อัปโหลดไฟล์ <strong>PDF</strong> เทมเพลตใบประกาศนียบัตร
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
                        คลิกหรือลากไฟล์เพื่ออัปโหลด (.pdf เท่านั้น)
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>

              {/* Participant List Upload */}
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <MdGroup size={16} style={{ color: "#2563eb" }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    รายชื่อผู้เข้าร่วม
                  </Typography>
                </Box>
                <Box
                  onClick={() => excelInputRef.current?.click()}
                  onDrop={handleDrop("excel")}
                  onDragOver={handleDragOver}
                  sx={{
                    border: "2px dashed #e2e8f0",
                    borderRadius: "8px",
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      borderColor: "#2563eb",
                      backgroundColor: "#eff6ff",
                    },
                  }}
                >
                  <input
                    ref={excelInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => e.target.files && setExcelFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <MdUploadFile size={32} style={{ color: "#2563eb", marginBottom: "12px" }} />
                  {excelFile ? (
                    <Typography variant="caption" sx={{ color: "#2563eb", fontWeight: 500 }}>
                      {excelFile.name}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: "#1e293b", display: "block" }}>
                        อัปโหลดไฟล์รายชื่อ <strong>Excel</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
                        คอลัมน์: ชื่อ นามสกุล อีเมล (.xlsx เท่านั้น)
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Field Config Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 4, height: 20, backgroundColor: "#2563eb", borderRadius: "2px" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                กำหนดจุด
              </Typography>
            </Box>
            <Paper
              sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                {/* Preview */}
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
                      fontSize: `${Math.max(10, fieldConfig.fontSize * 0.6)}px`,
                      color: "#94a3b8",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    Preview
                  </Typography>
                </Box>

                {/* Controls */}
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                      ขนาดฟ้อนท์
                    </Typography>
                    <TextField
                      type="number"
                      value={fieldConfig.fontSize}
                      onChange={(e) =>
                        setFieldConfig((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
                      }
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                      ความสูง (1-100%)
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ min: 1, max: 100 }}
                      value={fieldConfig.top}
                      onChange={(e) =>
                        setFieldConfig((prev) => ({ ...prev, top: Number(e.target.value) }))
                      }
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                      ความกว้าง (1-100%)
                    </Typography>
                    <TextField
                      type="number"
                      inputProps={{ min: 1, max: 100 }}
                      value={fieldConfig.left}
                      onChange={(e) =>
                        setFieldConfig((prev) => ({ ...prev, left: Number(e.target.value) }))
                      }
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MdSettings size={16} />}
                    onClick={handleConfirm}
                    sx={{
                      backgroundColor: "#2563eb",
                      textTransform: "none",
                      fontWeight: 600,
                      mt: 1,
                      "&:hover": {
                        backgroundColor: "#1d4ed8",
                      },
                    }}
                  >
                    ยืนยัน
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Generate Section */}
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <MdTipsAndUpdates size={18} style={{ color: "#2563eb" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  สร้างและดาวน์โหลดใบประกาศนียบัตรทั้งหมด
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<MdTipsAndUpdates size={16} />}
                onClick={handleGenerateCertificates}
                sx={{
                  backgroundColor: "#2563eb",
                  textTransform: "none",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
              >
                สร้างใบประกาศนียบัตร
              </Button>
            </Box>
          </Paper>

          {/* Send Email Section (disabled) */}
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              opacity: 0.6,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <MdDescription size={18} style={{ color: "#cbd5e1" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#94a3b8" }}>
                  ส่งใบประกาศนียบัตร
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1", display: "block", mt: 0.25 }}>
                  เร็ว ๆ นี้ — ส่งใบประกาศนียบัตรทางอีเมลหลังจากลงนาม
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
