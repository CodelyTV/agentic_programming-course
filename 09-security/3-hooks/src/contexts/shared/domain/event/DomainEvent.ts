import { v4 } from "uuid";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
	static fromPrimitives: (
		aggregateId: string,
		eventId: string,
		occurredAt: Date,
		attributes: DomainEventAttributes,
	) => DomainEvent;

	public readonly eventId: string;
	public readonly occurredAt: Date;

	protected constructor(
		public readonly eventName: string,
		public readonly aggregateId: string,
		eventId?: string,
		occurredAt?: Date,
	) {
		this.eventId = eventId ?? v4();
		this.occurredAt = occurredAt ?? new Date();
	}

	abstract toPrimitives(): DomainEventAttributes;
}
