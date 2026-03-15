// Mock data for activities
export interface Activity {
  id: string;
  title: string;
  participants: number;
  status: "draft" | "awaiting-signature" | "completed";
  imageSrc?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockActivities: Activity[] = [
  {
    id: "1",
    title: "SIT Openhouse 2025",
    participants: 20,
    status: "completed",
    createdAt: "14/03/2569",
    updatedAt: "14/03/2569",
  },
  {
    id: "2",
    title: "SIT Workshop - Web Development",
    participants: 15,
    status: "awaiting-signature",
    createdAt: "10/03/2569",
    updatedAt: "12/03/2569",
  },
  {
    id: "3",
    title: "SIT Seminar - Cloud Computing",
    participants: 30,
    status: "draft",
    createdAt: "08/03/2569",
    updatedAt: "08/03/2569",
  },
  {
    id: "4",
    title: "SIT Conference 2025",
    participants: 50,
    status: "completed",
    createdAt: "01/03/2569",
    updatedAt: "05/03/2569",
  },
  {
    id: "5",
    title: "Data Science Workshop",
    participants: 25,
    status: "draft",
    createdAt: "12/03/2569",
    updatedAt: "13/03/2569",
  },
  {
    id: "6",
    title: "Cybersecurity Training",
    participants: 18,
    status: "awaiting-signature",
    createdAt: "09/03/2569",
    updatedAt: "11/03/2569",
  },
  {
    id: "7",
    title: "Mobile App Development",
    participants: 22,
    status: "completed",
    createdAt: "02/03/2569",
    updatedAt: "04/03/2569",
  },
  {
    id: "8",
    title: "AI & Machine Learning",
    participants: 35,
    status: "draft",
    createdAt: "13/03/2569",
    updatedAt: "14/03/2569",
  },
];
