<?php

namespace App\Entity;

use App\Repository\RentRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=RentRepository::class)
 */
class Rent
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
    private $inventory_file;

    /**
     * @ORM\Column(type="datetime")
     */
    private $arrival_date;

    /**
     * @ORM\Column(type="datetime")
     */
    private $departure_date;

    /**
     * @ORM\Column(type="text")
     */
    private $tenant_comment;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $tenant_signature;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $tenant_validate_at;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $representative_comment;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $representative_signature;

    /**
     * @ORM\Column(type="datetime")
     */
    private $representative_validate_at;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="rents")
     */
    private $tenant;

    /**
     * @ORM\ManyToOne(targetEntity=Residence::class, inversedBy="rents")
     */
    private $residence;

    

    
    public function getId(): ?int
    {
        return $this->id;
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

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrival_date;
    }

    public function setArrivalDate(\DateTimeInterface $arrival_date): self
    {
        $this->arrival_date = $arrival_date;

        return $this;
    }

    public function getDepartureDate(): ?\DateTimeInterface
    {
        return $this->departure_date;
    }

    public function setDepartureDate(\DateTimeInterface $departure_date): self
    {
        $this->departure_date = $departure_date;

        return $this;
    }

    public function getTenantComment(): ?string
    {
        return $this->tenant_comment;
    }

    public function setTenantComment(string $tenant_comment): self
    {
        $this->tenant_comment = $tenant_comment;

        return $this;
    }

    public function getTenantSignature(): ?string
    {
        return $this->tenant_signature;
    }

    public function setTenantSignature(string $tenant_signature): self
    {
        $this->tenant_signature = $tenant_signature;

        return $this;
    }

    public function getTenantValidateAt(): ?string
    {
        return $this->tenant_validate_at;
    }

    public function setTenantValidateAt(string $tenant_validate_at): self
    {
        $this->tenant_validate_at = $tenant_validate_at;

        return $this;
    }

    public function getRepresentativeComment(): ?string
    {
        return $this->representative_comment;
    }

    public function setRepresentativeComment(?string $representative_comment): self
    {
        $this->representative_comment = $representative_comment;

        return $this;
    }

    public function getRepresentativeSignature(): ?string
    {
        return $this->representative_signature;
    }

    public function setRepresentativeSignature(string $representative_signature): self
    {
        $this->representative_signature = $representative_signature;

        return $this;
    }

    public function getRepresentativeValidateAt(): ?\DateTimeInterface
    {
        return $this->representative_validate_at;
    }

    public function setRepresentativeValidateAt(\DateTimeInterface $representative_validate_at): self
    {
        $this->representative_validate_at = $representative_validate_at;

        return $this;
    }

    public function getTenant(): ?User
    {
        return $this->tenant;
    }

    public function setTenant(?User $tenant): self
    {
        $this->tenant = $tenant;

        return $this;
    }

    public function getResidence(): ?Residence
    {
        return $this->residence;
    }

    public function setResidence(?Residence $residence): self
    {
        $this->residence = $residence;

        return $this;
    }

    


}
