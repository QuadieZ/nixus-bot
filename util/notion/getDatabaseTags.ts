import { Client as NotionClient } from '@notionhq/client'

export async function getDatabaseTags(
    databaseId: string,
    category: string,
    type: "select" | "multi_select" = "select"
) {
    const notion = new NotionClient({
        auth: process.env.NOTION_TOKEN
    })

    const response = await notion.databases.retrieve({ database_id: databaseId })

    const categoryData = response.properties[category]

    if (!categoryData) return false

    if (type === "select" && categoryData.type === "select") {
        return categoryData[type].options.map((option) => ({
            id: option.id,
            name: option.name
        }))
    }

    if (type === "multi_select" && categoryData.type === "multi_select") {
        return categoryData[type].options.map((option) => ({
            id: option.id,
            name: option.name
        }))
    }

    return false
}