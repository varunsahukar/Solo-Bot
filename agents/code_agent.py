from agents.state import AgentState
from agents._llm import call_llm
from datetime import datetime

async def run_code_agent(state: AgentState) -> AgentState:
    # The Code Assistant generates formal documentation WITHOUT markdown symbols (# or *).
    current_date = datetime.now().strftime("%Y-%m-%d")
    prompt = f"""You are a Lead Software Architect.
Generate a formal technical report for the following request.

CRITICAL FORMATTING RULES:
1. DO NOT use any markdown symbols like '#' for headers.
2. DO NOT use any markdown symbols like '*' or '**' for bolding or lists.
3. Use plain text spacing and CAPITALIZED HEADERS for sections.
4. For lists/bullet points, use dots (.) followed by a space.
5. Only use triple backticks for the code block itself so it stays readable.

REPORT STRUCTURE:

DOCUMENT TITLE: {state["query"][:50]}...

METADATA
Document ID: TDD-{datetime.now().strftime("%y%m%d%H%M")}
Author: SoloTutor AI Architect
Date: {current_date}
Status: Final Review

CLASSIFICATION: (Identify if this is DSA, CLEAN CODE, CODE REVIEW, or SYSTEM DESIGN)

--------------------------------------------------

SECTION 1: EXECUTIVE SUMMARY
(Provide summary here)

SECTION 2: TECHNICAL SPECIFICATION
2.1 Problem Definition
2.2 Algorithm Design (DSA Focus)

SECTION 3: IMPLEMENTATION
(Provide code block here)

SECTION 4: CODE QUALITY AUDIT
(Provide feedback on Clean Code, Readability, and Review comments)

SECTION 5: PERFORMANCE ANALYSIS
5.1 Time Complexity (Big O)
5.2 Space Complexity (Big O)

SECTION 6: INTEGRATION AND TESTING
6.1 Usage Reference
6.2 Validation Test Cases

SECTION 7: AUDIT AND SAFETY
(Edge case mitigation)

Request: {state["query"]}
"""
    state['answer'] = await call_llm(prompt)
    state['retrieved_chunks'] = []
    return state
