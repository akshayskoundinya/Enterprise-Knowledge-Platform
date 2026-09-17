import {
    generateAnswer,
    searchDocuments,
} from "../../clients";
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

export async function generate(
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

    const result = await generateAnswer({
        query: input.query,
        userId: input.userId,
        allowedDocumentIds,
        topK: input.topK,
    });

    const documentNames = new Map(
        accessibleDocuments.map(
            (document) => [
                document._id.toString(),
                document.name,
            ]
        )
    );

    return {
        ...result,
        sources: result.sources.map(
            (source) => ({
                ...source,
                document_name:
                    documentNames.get(
                        source.document_id
                    ) ?? "Unknown document",
            })
        ),
    };
}