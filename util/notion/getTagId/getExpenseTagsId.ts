import { getDatabaseTags } from ".."

export async function getExpenseTagsId(name: string) {
    const ids = await getDatabaseTags(
        process.env.NOTION_EXPENSES_DB ?? "",
        "Tags",
        "multi_select"
    )

    if (!ids) return false

    return ids.find((item) => item.name === name)?.id
}