from huggingface_hub import InferenceClient
import os

token = os.environ.get("HUGGINGFACE_TOKEN", "YOUR_HF_TOKEN")
m = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(model=m, token=token)
try:
    res = client.chat_completion(messages=[{"role": "user", "content": "Say hello"}], max_tokens=50)
    print("Success:", res.choices[0].message.content)
except Exception as e:
    print("Error:", e)
