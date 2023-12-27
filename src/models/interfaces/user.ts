export interface User {
    first_name?: string,
    last_name?: string,
    occupation?: string

    displayName: string | null,
    email: string | null,
    emailVerified?: boolean,
    phoneNumber?: string,
    photoURL: string | null,
    uid: string
}