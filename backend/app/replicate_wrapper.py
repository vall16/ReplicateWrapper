import os
from typing import Optional, Dict, Any
import replicate

class ReplicateWrapper:
    """
    Wrapper class per gestire le interazioni con Replicate.ai
    """

    def __init__(self, api_token: Optional[str] = None):
        """
        Inizializza il wrapper con il token API..prova

        Args:
            api_token: Token API di Replicate (opzionale, usa variabile d'ambiente se non fornito)
        """
        self.api_token = api_token or os.getenv("REPLICATE_API_TOKEN")
        if self.api_token:
            os.environ["REPLICATE_API_TOKEN"] = self.api_token

    async def run_model(
        self,
        model_version: str,
        input_params: Dict[str, Any]
    ) -> Any:
        """
        Esegue un modello su Replicate

        Args:
            model_version: Versione del modello (es. "owner/model:version")
            input_params: Parametri di input per il modello

        Returns:
            Output del modello
        """
        try:
            output = replicate.run(
                model_version,
                input=input_params
            )
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
