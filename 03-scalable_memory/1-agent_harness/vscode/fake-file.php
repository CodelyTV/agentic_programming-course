<?php

declare(strict_types=1);

namespace App;

final class FakeService
{
    public function __construct(
        private readonly string $name,
        private readonly int $maxRetries = 3,
    ) {
    }

    public function execute(array $items): array
    {
        return array_map(
            fn (string $item): string => strtoupper(trim($item)),
            array_filter($items, fn (string $item): bool => $item !== ''),
        );
    }

    public function name(): string
    {
        return $this->name;
    }

    public function maxRetries(): int
    {
        return $this->maxRetries;
    }
}
