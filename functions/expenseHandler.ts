import { Message } from "discord.js";
import { banking } from "../util";
import { createNotionPage } from "../util/notion/createNotionPage";

export function expenseHandler(message: Message<boolean>) {

    if (message.attachments) {
        message.attachments.forEach(async (attachment) => {
            const result = await banking(attachment.url)

            // cannot read text from image
            if (!result) {
                message.channel.send("What are you doing? That's not a slip...")
                return
            }

            await createNotionPage(
                process.env.NOTION_EXPENSES_DB ?? "",
                result.recipient,
                {
                    Amount: {
                        type: 'number',
                        number: parseFloat(result.amount)
                    },
                    Type: {
                        type: 'select',
                        select: {
                            // TODO: Determine expense category
                            id: ''
                        }
                    },
                    Date: {
                        type: 'date',
                        date: {
                            start: new Date(result.date).toISOString()
                        }
                    }
                }
            )

            message.channel.send("Consider it done.")
        })
    }

    else {
        if (message.content[0] === "+") {
            // TODO: Handle income
        }
    }

}