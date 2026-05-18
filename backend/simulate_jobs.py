from unittest.mock import Mock
import threading
import time
# Funzione isolata per simulare Replicate.. Questo script:
# 👉 simula un sistema di job asincroni tipo Replicate (AI generation)
# 👉 crea 10 job in parallelo
# 👉 alcuni falliscono (20%)
# 👉 se falliscono, prova a rifarli
# 👉 stampa lo stato in console
class ReplicateMock:
    def __init__(self):
        self.jobs = []

    def create_job(self, input_data):
        # Simula un job che può avere successo o fallire
        import random
        job_id = len(self.jobs) + 1
        status = "failed" if random.random() < 0.2 else "completed"
        job = {"id": job_id, "status": status, "input": input_data}
        self.jobs.append(job)
        return job

    def get_job_status(self, job_id):
        # Restituisce lo stato di un job
        for job in self.jobs:
            if job["id"] == job_id:
                return job["status"]
        return "not_found"

# Istanza del mock
replicate_mock = ReplicateMock()

def simulate_job_submission(job_id):
    input_data = {"job_id": job_id, "data": f"Test data {job_id}"}
    job = replicate_mock.create_job(input_data)
    print(f"Job {job['id']} created with status: {job['status']}")

    # Simula il polling dello stato del job
    while job['status'] == "failed":
        print(f"Retrying job {job['id']}...")
        time.sleep(1)
        job = replicate_mock.create_job(input_data)
        print(f"Job {job['id']} retried with status: {job['status']}")

    print(f"Job {job['id']} completed successfully!")

def main():
    threads = []
    num_jobs = 10  # Numero di job simultanei

    for i in range(1, num_jobs + 1):
        thread = threading.Thread(target=simulate_job_submission, args=(i,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()