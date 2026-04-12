import os
from typing import Optional, Dict, Any
import replicate
from sqlalchemy.orm import Session
# la “macchina” che genera l’immagine.
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
        db: Optional[Session] = None,
        token_cost: Optional[float] = None
    ) -> Any:
        """
        Esegue un modello su Replicate con controllo token

        Args:
            model_version: Versione del modello (es. "owner/model:version")
            input_params: Parametri di input per il modello
            user_id: ID dell'utente (per controllo token)
            db: Sessione database (per aggiornamento saldo)
            token_cost: Costo token personalizzato (default: TOKEN_COST_PER_CALL)

        Returns:
            Output del modello
        """
        # Usa il costo token personalizzato o il default
        cost = token_cost if token_cost is not None else self.TOKEN_COST_PER_CALL
        
        # Verifica token se user_id è fornito
        if user_id and db:
            from app.services import UserService
            user = UserService.get_user(db, user_id)
            if not user:
                raise Exception("Utente non trovato")
            if user.tokens < cost:
                raise Exception(f"❌ Token insufficienti! Hai {user.tokens} token, servono {cost}")
        
        try:
            output = replicate.run(
                model_version,
                input=input_params
            )
            
            # Consuma i token se l'operazione è riuscita
            if user_id and db:
                from app.services import UserService
                UserService.consume_tokens(db, user_id, cost)
            
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
