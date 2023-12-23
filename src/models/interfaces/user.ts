export interface User {
    first_name: string,
    last_name: string,
    occupation?: string

    displayName?: string
    email?: string
    emailVerified?: boolean
}