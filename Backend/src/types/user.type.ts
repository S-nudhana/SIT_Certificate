import { RowDataPacket } from 'mysql2'

export interface UserQuery extends RowDataPacket{
    user_id: string,
    user_name: string,
    user_email: string
}

export interface UserAuthQuery extends RowDataPacket {
    user_role: string
}

export interface UserRoleResponse {
    userRole: string
}
