import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

# Create logs directory
LOGS_DIR = os.path.join(os.path.dirname(__file__), "..", "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

# Configure logger
logger = logging.getLogger("repli_api")
logger.setLevel(logging.DEBUG)

# File handler with rotation (max 10MB, keep 5 backups)
file_handler = RotatingFileHandler(
    os.path.join(LOGS_DIR, "app.log"),
    maxBytes=10 * 1024 * 1024,
    backupCount=5
)
file_handler.setLevel(logging.DEBUG)

# Console handler (only INFO and above)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Add handlers
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Critical alerts handler (separate file for critical errors)
critical_handler = RotatingFileHandler(
    os.path.join(LOGS_DIR, "critical.log"),
    maxBytes=5 * 1024 * 1024,
    backupCount=3
)
critical_handler.setLevel(logging.CRITICAL)
critical_handler.setFormatter(formatter)
logger.addHandler(critical_handler)

def log_token_operation(operation: str, user_id: int, amount: int, status: str, details: str = ""):
    """Log token operations (purchase, consume, refund)"""
    message = f"TOKEN_OP user_id={user_id} op={operation} amount={amount} status={status}"
    if details:
        message += f" details={details}"
    if status == "FAILED":
        logger.critical(message)
    elif status == "SUCCESS":
        logger.info(message)
    else:
        logger.warning(message)

def log_refund_failure(user_id: int, amount: int, reason: str):
    """Log critical refund failures (tokens lost)"""
    logger.critical(f"CRITICAL_REFUND_FAILURE user_id={user_id} amount={amount} reason={reason}")

def log_file_download(user_id: int, url: str, status: str, error: str = ""):
    """Log file download operations"""
    message = f"FILE_DOWNLOAD user_id={user_id} url={url} status={status}"
    if error:
        message += f" error={error}"
    if status == "FAILED":
        logger.warning(message)
    else:
        logger.info(message)
