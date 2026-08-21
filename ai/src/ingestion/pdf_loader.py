from pathlib import Path
from tempfile import NamedTemporaryFile

from langchain_community.document_loaders import (
    PyPDFLoader,
)
from langchain_core.documents import Document


def load_pdf(
    content: bytes,
) -> list[Document]:
    with NamedTemporaryFile(
        suffix=".pdf",
        delete=False,
    ) as temp_file:
        temp_file.write(content)
        temp_path = Path(temp_file.name)

    try:
        loader = PyPDFLoader(
            str(temp_path)
        )

        return loader.load()

    finally:
        temp_path.unlink(
            missing_ok=True
        )