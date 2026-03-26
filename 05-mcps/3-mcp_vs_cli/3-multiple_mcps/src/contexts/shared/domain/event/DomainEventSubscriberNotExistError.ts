import { CodelyError } from "../CodelyError";

export class DomainEventSubscriberNotExistError extends CodelyError {
	readonly message = "DomainEventSubscriberNotExistError";

	constructor(subscriberName: string) {
		super({ subscriberName });
	}
}
