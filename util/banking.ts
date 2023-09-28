import { readTextFromImg } from "."

export type bankingData = {
    date: Date
    amount: string
    recipient: string
}

export async function banking(image: string): Promise<false | bankingData> {
    const text = await readTextFromImg(image)

    const dateRegex = /[0-9]{2} [A-Za-z]{3} [0-9]{2,4}/
    const timeRegex = /[0-9]{2}:[0-9]{2}/
    const amountRegex = /(?<=AMOUNT )[0-9.]+/
    const recipientRegex = /(?<=TO ).+/

    const date = text.match(dateRegex)
    const time = text.match(timeRegex)
    const amount = text.match(amountRegex)
    const recipient = text.match(recipientRegex)

    if (!date || !amount || !recipient) return false

    return {
        date: new Date(`${date} ${time}`),
        amount: amount[0],
        recipient: recipient[0]
    }
}