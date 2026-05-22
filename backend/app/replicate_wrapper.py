import os
import asyncio
from typing import Optional, Dict, Any, Callable
import replicate
from sqlalchemy.orm import Session
from app.logger import logger, log_token_operation, log_refund_failure

class ReplicateWrapper:

    TOKEN_COST_PER_CALL = 1.0

    def __init__(self, api_token: Optional[str] = None):
        self.api_token = api_token or os.getenv("REPLICATE_API_TOKEN")
        if self.api_token:
            os.environ["REPLICATE_API_TOKEN"] = self.api_token

    async def run_model(
        self,
        model_version: str,
        input_params: Dict[str, Any],
        user_id: Optional[int] = None,
        db: Optional[Session] = None,
        token_cost: Optional[float] = None,
        save_func: Optional[Callable[[Any], Any]] = None
    ) -> Any:
        cost = token_cost if token_cost is not None else self.TOKEN_COST_PER_CALL

        if user_id and db:
            from app.services import UserService
            user = UserService.get_user(db, user_id)
            if not user:
                raise Exception("User not found")

        consumed = False
        try:
            if user_id and db:
                from app.services import UserService
                UserService.consume_tokens(db, user_id, cost)
                consumed = True
                log_token_operation("CONSUME", user_id, int(cost), "SUCCESS")

            output = await asyncio.to_thread(
                replicate.run, model_version, input=input_params
            )

            if save_func:
                output = await save_func(output)

            return output
        except Exception as e:
            if user_id and db and consumed:
                from app.services import UserService
                try:
                    UserService.refund_tokens(db, user_id, cost)
                    log_token_operation("REFUND", user_id, int(cost), "SUCCESS", f"after_error: {str(e)[:100]}")
                except Exception as refund_err:
                    error_summary = f"Original error: {str(e)[:50]} | Refund error: {str(refund_err)[:50]}"
                    log_refund_failure(user_id, int(cost), error_summary)
                    logger.critical(f"TOKENS_LOST user_id={user_id} amount={cost} - user must be compensated manually!")
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
