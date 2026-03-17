import {
	DomainEvent,
	DomainEventAttributes,
} from "../../domain/event/DomainEvent";
import { DomainEventClass } from "../../domain/event/DomainEventClass";

type SerializedDomainEvent = {
	eventId: string;
	eventName: string;
	aggregateId: string;
	occurredAt: string;
	attributes: DomainEventAttributes;
};

export class DomainEventJsonDeserializer {
	constructor(private readonly eventMapping: Map<string, DomainEventClass>) {}

	deserialize(serialized: string): DomainEvent {
		const event: SerializedDomainEvent = JSON.parse(serialized);
		const EventClass = this.eventMapping.get(event.eventName);

		if (!EventClass) {
			throw new Error(`Unknown event: ${event.eventName}`);
		}

		return EventClass.fromPrimitives(
			event.aggregateId,
			event.eventId,
			new Date(event.occurredAt),
			event.attributes,
		);
	}
}
