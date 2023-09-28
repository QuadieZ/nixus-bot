import { getDatabaseTags } from ".."

export async function getCategoryExpenseTagId(name: string) {
    const ids = await getDatabaseTags(
        process.env.NOTION_EXPENSES_CAT_DB ?? "",
        "Tags",
        "multi_select"
    )

    if (!ids) return false

    return ids.find((item) => item.name === name)?.id
}