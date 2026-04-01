import { DomainEvent } from "../../domain/event/DomainEvent";
import { DomainEventSubscriber } from "../../domain/event/DomainEventSubscriber";
import { DomainEventSubscriberNotExistError } from "../../domain/event/DomainEventSubscriberNotExistError";

type SubscriberName = string;

export class DomainEventSubscriberNameToClass {
	private readonly subscriberNameToClass: Map<
		SubscriberName,
		DomainEventSubscriber<DomainEvent>
	>;

	constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
		this.subscriberNameToClass = new Map();

		subscribers.forEach((subscriber) => {
			this.subscriberNameToClass.set(subscriber.name(), subscriber);
		});
	}

	search(subscriberName: string): DomainEventSubscriber<DomainEvent> | null {
		const subscriber = this.subscriberNameToClass.get(subscriberName);

		return subscriber ?? null;
	}

	find(subscriberName: string): DomainEventSubscriber<DomainEvent> {
		const subscriber = this.search(subscriberName);

		if (!subscriber) {
			throw new DomainEventSubscriberNotExistError(subscriberName);
		}

		return subscriber;
	}
}
