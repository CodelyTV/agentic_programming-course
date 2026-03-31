import { DomainEvent } from "../../domain/event/DomainEvent";
import { DomainEventClass } from "../../domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../domain/event/DomainEventSubscriber";

type EventName = string;

export class DomainEventNameToClass {
	private readonly eventNameToClass: Map<EventName, DomainEventClass>;

	constructor(eventClasses: DomainEventClass[]) {
		this.eventNameToClass = new Map();

		eventClasses.forEach((eventClass) => {
			this.eventNameToClass.set(eventClass.eventName, eventClass);
		});
	}

	static fromSubscribers(
		subscribers: DomainEventSubscriber<DomainEvent>[],
	): DomainEventNameToClass {
		const eventClasses = subscribers.flatMap((subscriber) =>
			subscriber.subscribedTo(),
		);

		return new DomainEventNameToClass(eventClasses);
	}

	searchEvent(
		id: string,
		name: string,
		attributes: Record<string, unknown>,
		occurredAt: Date,
	): DomainEvent | null {
		const EventClass = this.eventNameToClass.get(name);

		if (!EventClass) {
			return null;
		}

		return EventClass.fromPrimitives(
			attributes.id as string,
			id,
			occurredAt,
			attributes,
		);
	}
}
