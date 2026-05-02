import asyncio
import os
import sys

sys.path.insert(0, '/home/dragon/Desktop/PCL/Solo-Bot/solo-tutor')
from agents.graph import run_chat

async def main():
    try:
        res = await run_chat("explain", "test_doc_id")
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
