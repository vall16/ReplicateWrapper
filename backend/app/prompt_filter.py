import re
from typing import Optional
from sqlalchemy.orm import Session
from app.database import BlockedPrompt
from app.logger import logger

BLOCKED_PATTERNS = [
    # minori / abuso
    re.compile(r'\b(child|minor|underage|teen|kid|girl|boy|baby|infant)\s*\S{0,5}(nsfw|nude|sex|porn|xxx|explicit|hot|naked)', re.IGNORECASE),
    re.compile(r'\b(cp|csam|child\s*porn|child\s*abuse|lolita|loli|shota)\b', re.IGNORECASE),

    # violenza esplicita / gore
    re.compile(r'\b(gore|snuff|torture|mutilat|eviscerat|disembowel|dismember|behead)\b', re.IGNORECASE),
    re.compile(r'\b(sexual\s*violence|rape|non.?consent|dubious\s*consent)\b', re.IGNORECASE),

    # autolesionismo / suicidio
    re.compile(r'\b(self.?harm|self.?hurt|self.?injury|suicide|kill\s*myself|cutting)\b', re.IGNORECASE),

    # terrorismo / atti criminali gravi
    re.compile(r'\b(terroris|bomb\s*making|weapon\s*manufactur|school\s*shooting|mass\s*shooting)\b', re.IGNORECASE),

    # hate speech / discriminazione
    re.compile(r'\b(nazi|white\s*supremac|kkk|neo.?nazi)\b', re.IGNORECASE),
    re.compile(r'\b(hate\s*speech|racial\s*slur|ethnic\s*cleans)\b', re.IGNORECASE),

    # escort / prostituzione
    re.compile(r'\b(escort\s*service|prostitut|sex\s*worker|massage\s*parlor\s*sex)\b', re.IGNORECASE),
    re.compile(r'\b(onlyfans|pornhub|xnxx|xvideos|strip\s*club)\b', re.IGNORECASE),

    # spam / crypto scam
    re.compile(r'\b(free\s*bitcoin|double\s*your\s*btc|crypto\s*giveaway|investment\s*scam)\b', re.IGNORECASE),
]


def filter_prompt(prompt: str) -> Optional[str]:
    for pattern in BLOCKED_PATTERNS:
        match = pattern.search(prompt)
        if match:
            return match.group(0)
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
        logger.warning(f"BLOCKED prompt user={user_id} matched='{match}' endpoint={endpoint}")
        return True
    return False
