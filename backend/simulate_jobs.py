import threading
import time
import random


# =========================
# CONFIG
# =========================

MAX_WORKERS = 3
queue_size = 0
queue_lock = threading.Lock()


# =========================
# MOCK SYSTEM
# =========================

class ReplicateMock:
    def __init__(self):
        self.jobs = []

    def create_job(self, input_data):

        job_id = len(self.jobs) + 1

        job = {
            "id": job_id,
            "status": "queued",
            "input": input_data,
            "queued_at": time.time(),
            "started_at": None,
            "finished_at": None
        }

        self.jobs.append(job)
        return job


replicate_mock = ReplicateMock()


# =========================
# WORKER SIMULATION
# =========================

def simulate_job_submission(job_id):

    global queue_size

    input_data = {"job_id": job_id, "data": f"Test data {job_id}"}

    # enqueue
    with queue_lock:
        queue_size += 1

    job = replicate_mock.create_job(input_data)

    # 🔥 queue delay (congestione reale)
    time.sleep(0.3 * queue_size)

    # start job
    job["started_at"] = time.time()
    job["status"] = "processing"

    print(f"Job {job['id']} started (queue={queue_size})")

    # 🔥 base processing time
    processing_time = random.uniform(1, 5)

    # 🔥 outliers (10% slow jobs)
    if random.random() < 0.1:
        processing_time = random.uniform(8, 20)

    time.sleep(processing_time)

    # dequeue
    with queue_lock:
        queue_size -= 1

    # 🔥 failure simulation (20%)
    if random.random() < 0.2:
        job["status"] = "failed"
        job["finished_at"] = time.time()
        print(f"Job {job['id']} FAILED")

        return

    job["status"] = "completed"
    job["finished_at"] = time.time()

    print(f"Job {job['id']} completed")


# =========================
# LATENCY METRICS
# =========================

def calculate_latency_metrics(jobs):

    latencies = []

    for job in jobs:
        if job["queued_at"] and job["finished_at"]:
            latencies.append(job["finished_at"] - job["queued_at"])

    if not latencies:
        return {}

    latencies.sort()

    def percentile(p):
        idx = int(len(latencies) * p)
        idx = min(idx, len(latencies) - 1)
        return latencies[idx]

    return {
        "p50": percentile(0.50),
        "p95": percentile(0.95),
        "p99": percentile(0.99),
        "count": len(latencies)
    }


# =========================
# MAIN
# =========================

def main():

    threads = []
    num_jobs = 20

    semaphore = threading.Semaphore(MAX_WORKERS)

    def wrapped_job(i):
        with semaphore:
            simulate_job_submission(i)

    for i in range(1, num_jobs + 1):
        thread = threading.Thread(target=wrapped_job, args=(i,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    metrics = calculate_latency_metrics(replicate_mock.jobs)

    print("\n================ LATENCY METRICS ================")
    print(f"Jobs processed: {metrics['count']}")
    print(f"p50: {metrics['p50']:.2f}s")
    print(f"p95: {metrics['p95']:.2f}s")
    print(f"p99: {metrics['p99']:.2f}s")


if __name__ == "__main__":
    main()