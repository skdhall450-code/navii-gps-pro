export type MaintenanceSaveOperation = {
  path: string;
  method: string;
  body: object;
};

/** One immutable user-initiated write at a time. No automatic network retries. */
export class MaintenanceSaveAttempt {
  private pending: MaintenanceSaveOperation | null = null;
  private inFlight = false;

  begin(
    build: () => MaintenanceSaveOperation,
  ): MaintenanceSaveOperation | null {
    if (this.inFlight) return null;
    if (!this.pending) {
      // Capture exactly the serializable body, including version/idempotency key.
      this.pending = JSON.parse(
        JSON.stringify(build()),
      ) as MaintenanceSaveOperation;
    }
    this.inFlight = true;
    return this.pending;
  }
  succeeded(): void {
    this.pending = null;
    this.inFlight = false;
  }
  failed(uncertain: boolean): void {
    this.inFlight = false;
    if (!uncertain) this.pending = null;
  }
}

/** Invalidate detail loads whenever the user chooses a newer screen or action. */
export class LatestMaintenanceRead {
  private active: AbortController | null = null;
  begin(): AbortController {
    this.cancel();
    this.active = new AbortController();
    return this.active;
  }
  cancel(): void {
    this.active?.abort();
    this.active = null;
  }
  isCurrent(controller: AbortController): boolean {
    return this.active === controller && !controller.signal.aborted;
  }
}
