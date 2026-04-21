"""Generate 4 watercolor floral corner PNGs for the wedding site.
Uses Emergent Nano Banana (Gemini 3.1 flash image preview) via EMERGENT_LLM_KEY.
Saves to /app/frontend/public/assets/flor{1..4}.png
"""
import asyncio
import os
import base64
import sys
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv('/app/backend/.env')
API_KEY = os.getenv("EMERGENT_LLM_KEY")
if not API_KEY:
    print("missing key")
    sys.exit(1)

OUT_DIR = "/app/frontend/public/assets"
os.makedirs(OUT_DIR, exist_ok=True)

BASE = (
    "Watercolor botanical illustration, loose romantic wedding style. "
    "Soft dusty navy blue leaves (#344E8A and #6A8BAD) with lighter icy pastel blue highlights, "
    "delicate gold line accents on some stems (#C0A971), a few white cotton bolls for texture. "
    "Transparent / pure white background (PNG on white). "
    "Elegant asymmetric bouquet arrangement designed to sit in the CORNER of a wedding invitation, "
    "leaves flowing inward from the corner. High detail, painterly, semi-transparent watercolor washes, "
    "hand-painted feel (not vector). No text, no frame, no people. Square 1024x1024."
)

PROMPTS = {
    "flor1": BASE + " Arrangement fills the TOP-LEFT corner — leaves and stems extending from the upper-left toward the center-right and downward.",
    "flor2": BASE + " Arrangement fills the TOP-RIGHT corner — leaves and stems extending from the upper-right toward the center-left and downward.",
    "flor3": BASE + " Arrangement fills the BOTTOM-LEFT corner — leaves and stems extending from the lower-left toward the center-right and upward.",
    "flor4": BASE + " Arrangement fills the BOTTOM-RIGHT corner — leaves and stems extending from the lower-right toward the center-left and upward.",
}

async def gen(name: str, prompt: str):
    chat = LlmChat(api_key=API_KEY, session_id=f"floral-{name}", system_message="You are an image generation assistant. Return only the requested illustration image.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"{name}: NO IMAGE returned. text_head={ (text or '')[:120] }")
        return False
    img = images[0]
    out = os.path.join(OUT_DIR, f"{name}.png")
    with open(out, "wb") as f:
        f.write(base64.b64decode(img["data"]))
    print(f"{name}: saved -> {out}")
    return True

async def main():
    for name, prompt in PROMPTS.items():
        try:
            await gen(name, prompt)
        except Exception as e:
            print(f"{name}: ERROR {type(e).__name__}: {e}")

asyncio.run(main())
