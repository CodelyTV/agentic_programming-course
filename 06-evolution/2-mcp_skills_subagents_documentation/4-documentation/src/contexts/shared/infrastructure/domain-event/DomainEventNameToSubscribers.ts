import { DomainEvent } from "../../domain/event/DomainEvent";
import { DomainEventSubscriber } from "../../domain/event/DomainEventSubscriber";

type EventName = string;

export class DomainEventNameToSubscribers {
	private readonly eventNameToSubscribers: Map<
		EventName,
		DomainEventSubscriber<DomainEvent>[]
	>;

	constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
		this.eventNameToSubscribers = new Map();

		subscribers
			.flatMap((subscriber) =>
				subscriber
					.subscribedTo()
					.map((event) => ({ event, subscriber })),
			)
			.forEach(({ event, subscriber }) => {
				const currentSubscriptions =
					this.eventNameToSubscribers.get(event.eventName) ?? [];

				const hasSubscriberAlreadyBeenAdded = currentSubscriptions.some(
					(sub) => sub.name() === subscriber.name(),
				);

				if (!hasSubscriberAlreadyBeenAdded) {
					currentSubscriptions.push(subscriber);

					this.eventNameToSubscribers.set(
						event.eventName,
						currentSubscriptions,
					);
				}
			});
	}

	searchSubscribers(eventName: string): DomainEventSubscriber<DomainEvent>[] {
		return this.eventNameToSubscribers.get(eventName) ?? [];
	}
}
