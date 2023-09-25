import { Client as NotionClient } from '@notionhq/client'
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'

export async function createNotionPage(
    databaseId: string,
    pageName: string,
    pageProperties?: CreatePageParameters['properties']
) {
    const notion = new NotionClient({
        auth: process.env.NOTION_TOKEN
    })

    const response = await notion.pages.create({
        parent: {
            database_id: databaseId
        },
        properties: {
            Name: {
                type: 'title',
                title: [
                    {
                        type: 'text',
                        text: {
                            content: pageName
                        }
                    }
                ]
            },
            ...pageProperties
        }
    })

    return response
}