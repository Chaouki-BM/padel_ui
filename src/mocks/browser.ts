export const getWorker = async () => {
  if (typeof window !== "undefined") {
    const { setupWorker } = await import("msw/browser");
    const { handlers } = await import("@/mocks/handlers");
    return setupWorker(...handlers);
  }
  return null;
};
