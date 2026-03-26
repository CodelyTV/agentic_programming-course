export async function retry<T>(
	fn: () => Promise<T>,
	maxAttempts: number = 3,
	delayMs: number = 30,
	attempt: number = 1,
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (attempt >= maxAttempts) {
			throw error;
		}

		await wait(delayMs * attempt);

		return retry(fn, maxAttempts, delayMs, attempt + 1);
	}
}

async function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
