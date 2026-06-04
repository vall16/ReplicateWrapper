import re
from typing import Optional
from sqlalchemy.orm import Session
from app.database import BlockedPrompt
from app.logger import logger

BLOCKED_PATTERNS = [
    re.compile(r'\b(child|minor|underage|teen|kid|girl|boy|baby|infant)\s*\S{0,5}(nsfw|nude|sex|porn|xxx|explicit|hot|naked)', re.IGNORECASE),
    re.compile(r'\b(cp|csam|child\s*porn|child\s*abuse|lolita|loli|shota)\b', re.IGNORECASE),
    re.compile(r'\b(gore|snuff|torture|mutilat|eviscerat|disembowel|dismember|behead)\b', re.IGNORECASE),
    re.compile(r'\b(sexual\s*violence|rape|non.?consent|dubious\s*consent)\b', re.IGNORECASE),
    re.compile(r'\b(self.?harm|self.?hurt|self.?injury|suicide|kill\s*myself|cutting)\b', re.IGNORECASE),
    re.compile(r'\b(terroris|bomb\s*making|weapon\s*manufactur|school\s*shooting|mass\s*shooting)\b', re.IGNORECASE),
    re.compile(r'\b(nazi|white\s*supremac|kkk|neo.?nazi)\b', re.IGNORECASE),
    re.compile(r'\b(hate\s*speech|racial\s*slur|ethnic\s*cleans)\b', re.IGNORECASE),
    re.compile(r'\b(escort\s*service|prostitut|sex\s*worker|massage\s*parlor\s*sex)\b', re.IGNORECASE),
    re.compile(r'\b(onlyfans|pornhub|xnxx|xvideos|strip\s*club)\b', re.IGNORECASE),
    re.compile(r'\b(free\s*bitcoin|double\s*your\s*btc|crypto\s*giveaway|investment\s*scam)\b', re.IGNORECASE),
]

THRESHOLDS = {
    "toxicity": 0.7,
    "severe_toxicity": 0.5,
    "obscene": 0.7,
    "identity_attack": 0.6,
    "insult": 0.7,
    "threat": 0.5,
    "sexual_explicit": 0.5,
}

_detoxify_model = None


def _get_model():
    global _detoxify_model
    if _detoxify_model is None:
        try:
            from detoxify import Detoxify
            _detoxify_model = Detoxify("unbiased")
            logger.info("Detoxify model loaded (unbiased)")
        except Exception as e:
            logger.warning(f"Detoxify not available, level 2 disabled: {e}")
            _detoxify_model = False
    return _detoxify_model


def filter_prompt(prompt: str) -> Optional[str]:
    for pattern in BLOCKED_PATTERNS:
        match = pattern.search(prompt)
        if match:
            return match.group(0)
    return None


def filter_prompt_level2(prompt: str) -> Optional[str]:
    model = _get_model()
    if not model:
        return None
    try:
        result = model.predict(prompt)
        for category, threshold in THRESHOLDS.items():
            score = result.get(category, 0)
            if score > threshold:
                return f"{category}={score:.3f}"
    except Exception as e:
        logger.warning(f"Detoxify prediction failed: {e}")
    return None


def check_and_log_prompt(
    prompt: str,
    user_id: int,
    db: Session,
    endpoint: str = ""
) -> bool:
    match = filter_prompt(prompt)
    if match:
        blocked = BlockedPrompt(
            user_id=user_id,
            prompt=prompt[:500],
            matched_pattern=match,
            endpoint=endpoint
        )
        db.add(blocked)
        db.commit()
        logger.warning(f"BLOCKED (level1) user={user_id} matched='{match}' endpoint={endpoint}")
        return True

    match = filter_prompt_level2(prompt)
    if match:
        blocked = BlockedPrompt(
            user_id=user_id,
            prompt=prompt[:500],
            matched_pattern=f"detoxify:{match}",
            endpoint=endpoint
        )
        db.add(blocked)
        db.commit()
        logger.warning(f"BLOCKED (level2) user={user_id} reason='{match}' endpoint={endpoint}")
        return True

    return False
