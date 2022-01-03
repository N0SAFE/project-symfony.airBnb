<?php

namespace App\Entity;

use App\Repository\ResidenceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ResidenceRepository::class)
 */
class Residence
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
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $zip_code;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $country;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $inventory_file;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="residences")
     */
    private $owner_id;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="representative_id")
     */
    private $representative_id;

    /**
     * @ORM\OneToMany(targetEntity=Rent::class, mappedBy="residence_id")
     */
    private $residence_id;

    public function __construct()
    {
        $this->representative_id = new ArrayCollection();
        $this->residence_id = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zip_code;
    }

    public function setZipCode(string $zip_code): self
    {
        $this->zip_code = $zip_code;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getInventoryFile(): ?string
    {
        return $this->inventory_file;
    }

    public function setInventoryFile(string $inventory_file): self
    {
        $this->inventory_file = $inventory_file;

        return $this;
    }

    public function getOwnerId(): ?User
    {
        return $this->owner_id;
    }

    public function setOwnerId(?User $owner_id): self
    {
        $this->owner_id = $owner_id;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getRepresentativeId(): Collection
    {
        return $this->representative_id;
    }

    public function addRepresentativeId(User $representativeId): self
    {
        if (!$this->representative_id->contains($representativeId)) {
            $this->representative_id[] = $representativeId;
            $representativeId->setRepresentativeId($this);
        }

        return $this;
    }

    public function removeRepresentativeId(User $representativeId): self
    {
        if ($this->representative_id->removeElement($representativeId)) {
            // set the owning side to null (unless already changed)
            if ($representativeId->getRepresentativeId() === $this) {
                $representativeId->setRepresentativeId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Rent[]
     */
    public function getResidenceId(): Collection
    {
        return $this->residence_id;
    }

    public function addResidenceId(Rent $residenceId): self
    {
        if (!$this->residence_id->contains($residenceId)) {
            $this->residence_id[] = $residenceId;
            $residenceId->setResidenceId($this);
        }

        return $this;
    }

    public function removeResidenceId(Rent $residenceId): self
    {
        if ($this->residence_id->removeElement($residenceId)) {
            // set the owning side to null (unless already changed)
            if ($residenceId->getResidenceId() === $this) {
                $residenceId->setResidenceId(null);
            }
        }

        return $this;
    }
}
