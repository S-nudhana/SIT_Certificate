import { db } from "../config/db.config"

import { UserAuthQuery, UserRoleResponse } from "../types/user.type"

export async function findUserRoleById(user_id: string): Promise<UserRoleResponse | null> {
    try {
        const [rows] = await db.query<UserAuthQuery[]>(`SELECT user_role FROM users WHERE user_id = ?`, [user_id])
        return {
            userRole: rows[0].user_role
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
