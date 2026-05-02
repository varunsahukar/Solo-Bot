# Solo-Bot File Structure

```
.
├── agents
│   └── graph.py
├── backend
│   ├── agents
│   │   ├── graph.py
│   │   └── __init__.py
│   ├── api
│   │   ├── chat.py
│   │   ├── files.py
│   │   └── __init__.py
│   ├── config.py
│   ├── embeddings.py
│   ├── extractor
│   │   ├── __init__.py
│   │   └── text.py
│   ├── llm.py
│   ├── main.py
│   ├── rag
│   │   ├── __init__.py
│   │   └── retriever.py
│   ├── requirements.txt
│   └── storage
│       └── cloud
├── build_project.py
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── hooks
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── rag
│   └── retriever.py
├── README.md
├── setup_files.py
├── solo-tutor
│   ├── agents
│   │   ├── chat_agent.py
│   │   ├── code_agent.py
│   │   ├── graph.py
│   │   ├── __init__.py
│   │   ├── _llm.py
│   │   ├── quiz_agent.py
│   │   ├── router.py
│   │   ├── state.py
│   │   └── video_agent.py
│   ├── backend
│   │   ├── config.py
│   │   ├── extractor
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── routes
│   │   ├── schemas.py
│   │   └── tests
│   ├── eslint.config.js
│   ├── frontend
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── postcss.config.js
│   │   ├── skills-lock.json
│   │   ├── src
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   ├── index.html
│   ├── main.py
│   ├── package.json
│   ├── package-lock.json
│   ├── rag
│   │   ├── chunker.py
│   │   ├── embedder.py
│   │   ├── ingest_pipeline.py
│   │   ├── __init__.py
│   │   └── retriever.py
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── storage
│   │   ├── cloud
│   │   └── local
│   └── vite.config.js
├── storage
│   └── cloud
│       ├── client.py
│       ├── __init__.py
│       ├── schema.sql
│       └── vectors.py
├── test2.txt
└── test.txt
```
