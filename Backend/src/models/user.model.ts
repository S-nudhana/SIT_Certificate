import { db } from "../config/db.config"

import { UserAuthQuery, UserRoleResponse } from "../types/user.type"

export async function findUserByEmail(email: string): Promise<UserAuthQuery | null> {
    try {
        const [rows] = await db.query<UserAuthQuery[]>(`SELECT user_id, user_role FROM users WHERE user_email = ?`, [email])
        return rows[0]
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function findUserRoleById(user_id: string): Promise<UserRoleResponse | null> {
    try {
        const [rows] = await db.query<UserAuthQuery[]>(`SELECT user_role, user_firstname FROM users WHERE user_id = ?`, [user_id])
        return {
            userRole: rows[0].user_role,
            userFirstname: rows[0].user_firstname
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
