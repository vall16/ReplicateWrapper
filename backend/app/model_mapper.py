def map_model(model: str) -> str:
    mapping = {
        "flux-pro": "black-forest-labs/flux-1-pro",
        "flux-dev": "black-forest-labs/flux-1-dev",
        "sdxl": "stability-ai/sdxl",
        # 3 dollari 1000 imagini
        "flux-schnell": "black-forest-labs/flux-1-schnell",
    }
    return mapping.get(model, "stability-ai/sdxl")