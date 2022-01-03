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
     * @ORM\OneToMany(targetEntity=Rent::class, mappedBy="tenant")
     */
    private $rents;

    /**
     * @ORM\OneToMany(targetEntity=Residence::class, mappedBy="owner")
     */
    private $residences;

    /**
     * @ORM\OneToMany(targetEntity=Residence::class, mappedBy="representative")
     */
    private $representative;

   

   

    public function __construct()
    {
        $this->residences = new ArrayCollection();
        $this->tenant_id = new ArrayCollection();
        $this->rents = new ArrayCollection();
        $this->representative = new ArrayCollection();
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
     * @return Collection|Rent[]
     */
    public function getRents(): Collection
    {
        return $this->rents;
    }

    public function addRent(Rent $rent): self
    {
        if (!$this->rents->contains($rent)) {
            $this->rents[] = $rent;
            $rent->setTenant($this);
        }

        return $this;
    }

    public function removeRent(Rent $rent): self
    {
        if ($this->rents->removeElement($rent)) {
            // set the owning side to null (unless already changed)
            if ($rent->getTenant() === $this) {
                $rent->setTenant(null);
            }
        }

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
            $residence->setOwner($this);
        }

        return $this;
    }

    public function removeResidence(Residence $residence): self
    {
        if ($this->residences->removeElement($residence)) {
            // set the owning side to null (unless already changed)
            if ($residence->getOwner() === $this) {
                $residence->setOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Residence[]
     */
    public function getRepresentative(): Collection
    {
        return $this->representative;
    }

    public function addRepresentative(Residence $representative): self
    {
        if (!$this->representative->contains($representative)) {
            $this->representative[] = $representative;
            $representative->setRepresentative($this);
        }

        return $this;
    }

    public function removeRepresentative(Residence $representative): self
    {
        if ($this->representative->removeElement($representative)) {
            // set the owning side to null (unless already changed)
            if ($representative->getRepresentative() === $this) {
                $representative->setRepresentative(null);
            }
        }

        return $this;
    }

   

   
}
