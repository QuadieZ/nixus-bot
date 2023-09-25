import { readTextFromImg } from "."

export type bankingData = {
    date: string
    amount: string
    recipient: string
}

export async function banking(image: string): Promise<false | bankingData> {
    const text = await readTextFromImg(image)

    const dateRegex = /[0-9]{2} [A-Za-z]{3} [0-9]{2,4}/
    const amountRegex = /(?<=AMOUNT )[0-9.]+/
    const recipientRegex = /(?<=TO ).+/

    const date = text.match(dateRegex)
    const amount = text.match(amountRegex)
    const recipient = text.match(recipientRegex)

    if (!date || !amount || !recipient) return false

    return {
        date: date[0],
        amount: amount[0],
        recipient: recipient[0]
    }
}