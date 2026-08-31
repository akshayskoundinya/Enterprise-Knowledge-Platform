import { searchDocuments } from "../../clients";
import {
    getAccessibleDocuments,
} from "../document/document.service";

interface SearchInput {
    userId: string;
    roleId: string;
    query: string;
    topK: number;
}

export async function search(
    input: SearchInput
) {
    const accessibleDocuments =
        await getAccessibleDocuments(
            input.userId,
            input.roleId
        );

    const allowedDocumentIds =
        accessibleDocuments.map(
            (document) =>
                document._id.toString()
        );

    return searchDocuments({
        query: input.query,
        userId: input.userId,
        allowedDocumentIds,
        topK: input.topK,
    });
}