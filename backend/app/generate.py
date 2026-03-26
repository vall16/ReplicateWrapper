import os
import replicate
from dotenv import load_dotenv

load_dotenv()

def generate_image(prompt: str):
    output = replicate.run(
        "stability-ai/sdxl:latest",
        input={
            "prompt": prompt,
            "negative_prompt": "blurry, distorted, ugly, low quality, cartoon",
            "width": 1024,
            "height": 768,
            "num_outputs": 1
        }
    )
    return output[0]


if __name__ == "__main__":
    prompt = "modern italian apartment, bright, minimal furniture, real estate photography"
    image_url = generate_image(prompt)
    print("Image:", image_url)