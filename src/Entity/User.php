<?php
namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface
{
    private $id;
    private $username;
    private $password;
    private $roles = [];

    // Other properties, getters, and setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getRoles(): array
    {
        // Ensure that the user always has at least one role
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getSalt(): ?string
    {
        // You might need a salt, but modern algorithms include it in the hash
        return null;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data in the user, clear it here
        // $this->plainPassword = null;
    }
}