import { getDatabaseTags } from "../getDatabaseTags";

export async function getExpenseTypeTag(name: string) {
    const ids = await getDatabaseTags(
        process.env.NOTION_EXPENSES_DB ?? "",
        "Type"
    )

    if (!ids) return false

    return ids.find((item) => item.name === name)?.id
}