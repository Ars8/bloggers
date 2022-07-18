import { emailAdapter } from "../adapters/email-adapter"
import { UserAccountDBType } from "../repositories/types"

export const emailsManager = {
    async sendEmailConfirmationMessage(user: UserAccountDBType) {
        await emailAdapter.sendEmail(user.accountData.email, "registration", "<a href=`https://bloggersars.herokuapp.com/registration-confirmation?code=${user.accountData.confirmationCode}`></a>")
    },
    async reSendEmailConfirmationMessage(user: UserAccountDBType) {
        await emailAdapter.sendEmail(user.accountData.email, "reSend", "<a href=`https://some-front.com/confirm-registration?code=${user.accountData.confirmationCode}`></a>")
    }
}