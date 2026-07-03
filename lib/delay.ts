export async function delay(ms = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
