import { Client as NotionClient } from '@notionhq/client'
import { MultiSelectPropertyItemObjectResponse, PageObjectResponse, SelectPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { createNotionPage, getCategoryExpenseTagId, getExpenseTagsId } from '.'
import { Message } from 'discord.js'
import startCase from 'lodash/startCase'

export async function getExpenseCategory(
    name: string,
    message: Message<boolean>
) {
    const notion = new NotionClient({
        auth: process.env.NOTION_TOKEN
    })

    const response = await notion.databases.query({ database_id: process.env.NOTION_EXPENSES_CAT_DB ?? "", page_size: 100 })

    const existingCategories = response?.results?.map(result => {
        const nameProperty = (result as PageObjectResponse).properties['Name']
        const tagsProperty = (result as PageObjectResponse).properties['Tags'] as MultiSelectPropertyItemObjectResponse
        const title = nameProperty?.type === "title" ? nameProperty?.title[0]?.plain_text : false
        return (
            {
                title,
                tagName: tagsProperty.multi_select.map(option => option.name)
            }
        )
    }).filter(x => x)

    const category = existingCategories.find(category => category.title === name)

    if (category) {
        const result = await Promise.all(category.tagName.map(async (tag) => ({
            id: await getExpenseTagsId(tag),
            name: tag
        })))

        return result
    }

    await message.channel.send("...Category?\n(Food, Entertainment, Transportation, Bills, Saving)")

    const categoryResponse = await message.channel.awaitMessages({
        max: 1,
        time: 60000,
        errors: ["time"]
    }).catch(() => {
        message.channel.send("I can't create it if you don't give me category. Well, don't forget to add tags by yourself later then.")
        return
    })

    if (!categoryResponse) return false

    const newCategory = categoryResponse.first()?.content

    if (newCategory) {
        const mainTableTags = await Promise.all(newCategory.split(" ").map(async (cat) => {
            return {
                id: await getExpenseTagsId(startCase(cat)),
                name: startCase(cat)
            }
        }))

        const categoryTableTags = await Promise.all(newCategory.split(" ").map(async (cat) => {
            return {
                id: await getCategoryExpenseTagId(startCase(cat)),
                name: startCase(cat)
            }
        }))

        await createNotionPage(
            process.env.NOTION_EXPENSES_CAT_DB ?? "",
            name,
            {
                Tags: {
                    type: "multi_select",
                    multi_select: categoryTableTags
                } as MultiSelectPropertyItemObjectResponse
            }
        )

        return mainTableTags
    }

}