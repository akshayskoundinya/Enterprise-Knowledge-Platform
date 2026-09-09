from src.evaluation.models import EvaluationCase


EVALUATION_DATASET: list[EvaluationCase] = [
    EvaluationCase(
        id="case-001",
        question=(
            "What are mobile devices according "
            "to the document?"
        ),
        document_ids=[
            "6a995125265993fff50a84d3"
        ],
        relevant_chunk_ids=[
            "2b3271cb-1a44-4d49-bde0-86dd82fd5825"
        ],
        reference_answer=(
            "Mobile devices are described as handheld "
            "electronic devices that can be comfortably "
            "carried in a pocket or bag, including MP3 "
            "players, digital recorders, e-readers, "
            "tablets, and smartphones."
        ),
    ),
    EvaluationCase(
        id="case-002",
        question=(
            "How is mobile learning defined "
            "in the document?"
        ),
        document_ids=[
            "6a995125265993fff50a84d3"
        ],
        relevant_chunk_ids=[
            "2b3271cb-1a44-4d49-bde0-86dd82fd5825"
        ],
        reference_answer=(
            "The document states that there is no single "
            "agreed-upon definition. Some researchers "
            "view mobile learning as an extension of "
            "e-learning built on mobile devices, while "
            "others define it as learning that happens "
            "anywhere and anytime."
        ),
    ),
    EvaluationCase(
        id="case-003",
        question=(
            "What areas of language learning research "
            "have studied the use of mobile devices?"
        ),
        document_ids=[
            "6a995125265993fff50a84d3"
        ],
        relevant_chunk_ids=[
            "b7f0bd0e-4d79-42a7-8829-30303951d146"
        ],
        reference_answer=(
            "The document discusses research on learners' "
            "views of mobile devices in language instruction, "
            "attitudes toward mobile phones as instructional "
            "tools, profiling mobile language learners, "
            "their effects on foreign or second-language "
            "learning, distance language learning, informal "
            "language learning practices, and learners' use "
            "of mobile devices for foreign-language learning."
        ),
    ),
    EvaluationCase(
        id="case-004",
        question=(
            "How can mobile devices support learners' "
            "individual learning needs?"
        ),
        document_ids=[
            "6a995125265993fff50a84d3"
        ],
        relevant_chunk_ids=[
            "f417823f-68b2-4c25-846d-1f0bd9b88a1c"
        ],
        reference_answer=(
            "Mobile devices can help learners access "
            "suitable tools and necessary information to "
            "achieve their goals and meet their needs, "
            "while allowing them to adjust their English "
            "learning to their personal learning styles."
        ),
    ),
    EvaluationCase(
        id="case-005",
        question=(
            "What thematic categories emerged from "
            "the analysis of the interview data?"
        ),
        document_ids=[
            "6a995125265993fff50a84d3"
        ],
        relevant_chunk_ids=[
            "420df657-8622-41c5-a105-f22c94ecf70b"
        ],
        reference_answer=(
            "The analysis identified six thematic "
            "categories: usage of mobile devices, "
            "reasons for using mobile devices, resources "
            "and tools, mobile encounters, language "
            "practiced, and study performance."
        ),
    ),
]