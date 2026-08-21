// Port Camofox listens on inside the subcontainer, fixed by the upstream image
// (`ENV CAMOFOX_PORT=9377`). Shared by the daemon env, the health check URL,
// and the interface binding so the three can never drift apart.
export const apiPort = 9377
