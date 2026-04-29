<?php

namespace App\DTO;

/**
 * Data Transfer Object for User.
 *
 * This class is used to standardize the structure
 * of user data returned by the service layer.
 */
class UserDTO
{
    /**
     * User identifier.
     */
    public int $id;

    /**
     * User name.
     */
    public string $name;

    /**
     * Create new UserDTO instance.
     *
     * @param int $id
     * @param string $name
     */
    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    /**
     * Convert DTO to array.
     *
     * Used for JSON responses.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}