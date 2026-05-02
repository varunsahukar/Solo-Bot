import asyncio
import os
import sys

# Setup path
sys.path.insert(0, '/home/dragon/Desktop/PCL/Solo-Bot/solo-tutor')
from agents._llm import call_llm

async def main():
    try:
        res = await call_llm("Say hello")
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
