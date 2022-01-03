<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_verified;

    /**
     * @ORM\OneToMany(targetEntity=Residence::class, mappedBy="owner_id")
     */
    private $residences;

    /**
     * @ORM\ManyToOne(targetEntity=Residence::class, inversedBy="representative_id")
     */
    private $representative_id;

    /**
     * @ORM\OneToMany(targetEntity=Rent::class, mappedBy="tenant_id")
     */
    private $tenant_id;

    public function __construct()
    {
        $this->residences = new ArrayCollection();
        $this->tenant_id = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getIsVerified(): ?bool
    {
        return $this->is_verified;
    }

    public function setIsVerified(bool $is_verified): self
    {
        $this->is_verified = $is_verified;

        return $this;
    }

    /**
     * @return Collection|Residence[]
     */
    public function getResidences(): Collection
    {
        return $this->residences;
    }

    public function addResidence(Residence $residence): self
    {
        if (!$this->residences->contains($residence)) {
            $this->residences[] = $residence;
            $residence->setOwnerId($this);
        }

        return $this;
    }

    public function removeResidence(Residence $residence): self
    {
        if ($this->residences->removeElement($residence)) {
            // set the owning side to null (unless already changed)
            if ($residence->getOwnerId() === $this) {
                $residence->setOwnerId(null);
            }
        }

        return $this;
    }

    public function getRepresentativeId(): ?Residence
    {
        return $this->representative_id;
    }

    public function setRepresentativeId(?Residence $representative_id): self
    {
        $this->representative_id = $representative_id;

        return $this;
    }

    /**
     * @return Collection|Rent[]
     */
    public function getTenantId(): Collection
    {
        return $this->tenant_id;
    }

    public function addTenantId(Rent $tenantId): self
    {
        if (!$this->tenant_id->contains($tenantId)) {
            $this->tenant_id[] = $tenantId;
            $tenantId->setTenantId($this);
        }

        return $this;
    }

    public function removeTenantId(Rent $tenantId): self
    {
        if ($this->tenant_id->removeElement($tenantId)) {
            // set the owning side to null (unless already changed)
            if ($tenantId->getTenantId() === $this) {
                $tenantId->setTenantId(null);
            }
        }

        return $this;
    }
}
