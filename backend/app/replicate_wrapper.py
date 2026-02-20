import os
from typing import Optional, Dict, Any
import replicate
from sqlalchemy.orm import Session

class ReplicateWrapper:
    """
    Wrapper class per gestire le interazioni con Replicate.ai con sistema token
    """

    # Costo token per chiamata (1 token per default)
    TOKEN_COST_PER_CALL = 1.0

    def __init__(self, api_token: Optional[str] = None):
        """
        Inizializza il wrapper con il token API

        Args:
            api_token: Token API di Replicate (opzionale, usa variabile d'ambiente se non fornito)
        """
        self.api_token = api_token or os.getenv("REPLICATE_API_TOKEN")
        if self.api_token:
            os.environ["REPLICATE_API_TOKEN"] = self.api_token

    async def run_model(
        self,
        model_version: str,
        input_params: Dict[str, Any],
        user_id: Optional[int] = None,
        db: Optional[Session] = None
    ) -> Any:
        """
        Esegue un modello su Replicate con controllo token

        Args:
            model_version: Versione del modello (es. "owner/model:version")
            input_params: Parametri di input per il modello
            user_id: ID dell'utente (per controllo token)
            db: Sessione database (per aggiornamento saldo)

        Returns:
            Output del modello
        """
        # Verifica token se user_id è fornito
        if user_id and db:
            from app.services import UserService
            user = UserService.get_user(db, user_id)
            if not user:
                raise Exception("Utente non trovato")
            if user.tokens < self.TOKEN_COST_PER_CALL:
                raise Exception(f"❌ Token insufficienti! Hai {user.tokens} token, servono {self.TOKEN_COST_PER_CALL}")
        
        try:
            output = replicate.run(
                model_version,
                input=input_params
            )
            
            # Consuma i token se l'operazione è riuscita
            if user_id and db:
                from app.services import UserService
                UserService.consume_tokens(db, user_id, self.TOKEN_COST_PER_CALL)
            
            return output
        except Exception as e:
            raise Exception(f"Errore nell'esecuzione del modello: {str(e)}")

    def list_models(self) -> list:
        """
        Elenca i modelli disponibili

        Returns:
            Lista dei modelli
        """
        try:
            models = replicate.models.list()
            return list(models)
        except Exception as e:
            raise Exception(f"Errore nel recupero dei modelli: {str(e)}")
