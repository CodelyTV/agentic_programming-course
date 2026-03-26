import { DomainEvent } from "../../domain/event/DomainEvent";

type SerializedDomainEvent = {
	eventId: string;
	eventName: string;
	aggregateId: string;
	occurredAt: string;
	attributes: { [key: string]: unknown };
};

export class DomainEventJsonSerializer {
	static serialize(event: DomainEvent): string {
		const serialized: SerializedDomainEvent = {
			eventId: event.eventId,
			eventName: event.eventName,
			aggregateId: event.aggregateId,
			occurredAt: event.occurredAt.toISOString(),
			attributes: event.toPrimitives(),
		};

		return JSON.stringify(serialized);
	}
}
