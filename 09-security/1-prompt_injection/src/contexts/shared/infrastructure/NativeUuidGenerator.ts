import { randomUUID } from "crypto";
import { Service } from "diod";

import { UuidGenerator } from "../domain/UuidGenerator";

@Service()
export class NativeUuidGenerator extends UuidGenerator {
	async generate(): Promise<string> {
		return randomUUID();
	}
}
