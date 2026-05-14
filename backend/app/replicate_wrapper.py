import os
import asyncio
from typing import Optional, Dict, Any
import replicate
from sqlalchemy.orm import Session
# the "engine" that generates the image.
class ReplicateWrapper:
    """
    Wrapper class to handle Replicate.ai interactions with token system
    """

    # Token cost per call (1 token by default)
    TOKEN_COST_PER_CALL = 1.0

    def __init__(self, api_token: Optional[str] = None):
        """
        Initialize the wrapper with the API token

        Args:
            api_token: Replicate API token (optional, uses environment variable if not provided)
        """
        self.api_token = api_token or os.getenv("REPLICATE_API_TOKEN")
        if self.api_token:
            os.environ["REPLICATE_API_TOKEN"] = self.api_token

    async def run_model(
        self,
        model_version: str,
        input_params: Dict[str, Any],
        user_id: Optional[int] = None,
        db: Optional[Session] = None,
        token_cost: Optional[float] = None
    ) -> Any:
        """
        Runs a model on Replicate with token checking

        Args:
            model_version: Model version (e.g. "owner/model:version")
            input_params: Input parameters for the model
            user_id: User ID (for token checking)
            db: Database session (for balance updates)
            token_cost: Custom token cost (default: TOKEN_COST_PER_CALL)

        Returns:
            Model output
        """
        cost = token_cost if token_cost is not None else self.TOKEN_COST_PER_CALL

        if user_id and db:
            from app.services import UserService
            user = UserService.get_user(db, user_id)
            if not user:
                raise Exception("User not found")

        try:
            if user_id and db:
                from app.services import UserService
                UserService.consume_tokens(db, user_id, cost)

            output = await asyncio.to_thread(
                replicate.run, model_version, input=input_params
            )

            return output
        except Exception as e:
            if user_id and db:
                from app.services import UserService
                try:
                    UserService.refund_tokens(db, user_id, cost)
                except Exception as refund_err:
                    print(f"[REFUND FAILED] {refund_err}")
            raise Exception(f"Error executing model: {str(e)}")

    def list_models(self) -> list:
        """
        Lists available models

        Returns:
            List of models
        """
        try:
            models = replicate.models.list()
            return list(models)
        except Exception as e:
            raise Exception(f"Error retrieving models: {str(e)}")
