import { z } from "zod";

export const createEventSchema = z.object({
    activityName: z
        .string()
        .min(1, "กรุณากรอกชื่อกิจกรรม")
        .max(100, "ชื่อกิจกรรมต้องไม่เกิน 100 ตัวอักษร"),

    pdfFile: z
        .instanceof(File, { message: "กรุณาอัปโหลดไฟล์ PDF เทมเพลต" })
        .refine((f) => f.type === "application/pdf", "ไฟล์ต้องเป็น PDF เท่านั้น"),

    excelFile: z
        .instanceof(File, { message: "กรุณาอัปโหลดไฟล์รายชื่อผู้เข้าร่วม" })
        .refine(
            (f) =>
                [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-excel",
                ].includes(f.type),
            "ไฟล์ต้องเป็น .xlsx หรือ .xls เท่านั้น"
        ),
    fontSize: z
        .number({ message: "กรุณากรอกขนาดฟ้อนท์" })
        .min(1, "ขนาดฟ้อนท์ต้องมากกว่า 0")
        .max(200, "ขนาดฟ้อนท์ต้องไม่เกิน 200"),

    top: z
        .number({ message: "กรุณากรอกความสูง" })
        .min(1, "ความสูงต้องอยู่ระหว่าง 1-100")
        .max(100, "ความสูงต้องอยู่ระหว่าง 1-100"),

    left: z
        .number({ message: "กรุณากรอกตำแหน่งแนวนอน" })
        .min(1, "ตำแหน่งแนวนอนต้องอยู่ระหว่าง 1-100")
        .max(100, "ตำแหน่งแนวนอนต้องอยู่ระหว่าง 1-100"),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
    activityName: z
        .string()
        .min(1, "กรุณากรอกชื่อกิจกรรม")
        .max(100, "ชื่อกิจกรรมต้องไม่เกิน 100 ตัวอักษร"),
    pdfFile: z
        .instanceof(File, { message: "กรุณาอัปโหลดไฟล์ PDF เทมเพลต" })
        .refine((f) => f.type === "application/pdf", "ไฟล์ต้องเป็น PDF เท่านั้น"),
    excelFile: z
        .instanceof(File, { message: "กรุณาอัปโหลดไฟล์รายชื่อผู้เข้าร่วม" })
        .refine(
            (f) =>
                [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-excel",
                ].includes(f.type),
            "ไฟล์ต้องเป็น .xlsx หรือ .xls เท่านั้น"
        ),
    fontSize: z
        .number({ message: "กรุณากรอกขนาดฟ้อนท์" })
        .min(1, "ขนาดฟ้อนท์ต้องมากกว่า 0")
        .max(200, "ขนาดฟ้อนท์ต้องไม่เกิน 200"),
    top: z
        .number({ message: "กรุณากรอกความสูง" })
        .min(1, "ความสูงต้องอยู่ระหว่าง 1-100")
        .max(100, "ความสูงต้องอยู่ระหว่าง 1-100"),
    left: z
        .number({ message: "กรุณากรอกตำแหน่งแนวนอน" })
        .min(1, "ตำแหน่งแนวนอนต้องอยู่ระหว่าง 1-100")
        .max(100, "ตำแหน่งแนวนอนต้องอยู่ระหว่าง 1-100"),
});

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;