import { Message } from "discord.js";
import { banking, getExpenseTagsId, getExpenseTypeTag } from "../util";
import { createNotionPage } from "../util/notion/createNotionPage";
import { DatePropertyItemObjectResponse, MultiSelectPropertyItemObjectResponse, NumberPropertyItemObjectResponse, SelectPropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getExpenseCategory } from "../util/getExpenseCategory";

export async function expenseHandler(message: Message<boolean>) {
    if (message.attachments.size !== 0) {
        message.attachments.forEach(async (attachment) => {
            const result = await banking(attachment.url)

            // cannot read text from image
            if (!result) {
                message.channel.send("What are you doing? That's not a slip...")
                return
            }

            const tags = await getExpenseCategory(result.recipient, message)

            await createNotionPage(
                process.env.NOTION_EXPENSES_DB ?? "",
                result.recipient,
                {
                    Amount: {
                        type: 'number',
                        number: parseFloat(result.amount)
                    } as NumberPropertyItemObjectResponse,
                    Type: {
                        type: 'select',
                        select: {
                            id: await getExpenseTypeTag('Outgo')
                        }
                    } as SelectPropertyItemObjectResponse,
                    Date: {
                        type: "date",
                        date: {
                            start: result.date.toISOString()
                        }
                    } as DatePropertyItemObjectResponse,
                    ...(!!tags ? {
                        Tags: {
                            type: 'multi_select',
                            multi_select: tags
                        } as MultiSelectPropertyItemObjectResponse,
                    } : {})
                }
            )

            message.channel.send("Consider it done.")
        })
    }

    else {
        if (message.content[0] === "+") {
            const data = message.content.split(" ")
            if (data.length != 2) message.channel.send("+[Amount] [Name], remember?")
            else {
                await createNotionPage(
                    process.env.NOTION_EXPENSES_DB ?? "",
                    data[1],
                    {
                        Amount: {
                            type: "number",
                            number: parseFloat(data[0])
                        } as NumberPropertyItemObjectResponse,
                        Type: {
                            type: 'select',
                            select: {
                                id: await getExpenseTypeTag('Income')
                            }
                        } as SelectPropertyItemObjectResponse,
                        Date: {
                            type: "date",
                            date: {
                                start: new Date(message.createdAt).toISOString()
                            }
                        } as DatePropertyItemObjectResponse,
                    }
                )
                message.channel.send("Consider it done.")
            }
        }
    }

}