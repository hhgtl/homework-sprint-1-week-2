export type UsersDbType = {
    login: string,
    email: string,
    createdAt: Date,
    password: string,
    emailConfirmation: {
        confirmationCode: string,
        confirmationCodeExpirationDate: Date,
        isConfirmed: boolean,
    }
}