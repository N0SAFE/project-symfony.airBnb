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
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="rents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $tenant;

    /**
     * @ORM\ManyToOne(targetEntity=Residence::class, inversedBy="rents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $residence;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="managedRents")
     */
    private $representative;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $first_comment;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $first_signature;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $first_validate_at;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $second_comment;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $second_signature;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $second_validate_at;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $third_comment;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $third_signature;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $third_validate_at;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $fourth_comment;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $fourth_signature;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $fourth_validate_at;

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

    public function getRepresentative(): ?User
    {
        return $this->representative;
    }

    public function setRepresentative(?User $representative): self
    {
        $this->representative = $representative;

        return $this;
    }

    public function getFirstComment(): ?string
    {
        return $this->first_comment;
    }

    public function setFirstComment(?string $first_comment): self
    {
        $this->first_comment = $first_comment;

        return $this;
    }

    public function getFirstSignature(): ?string
    {
        return $this->first_signature;
    }

    public function setFirstSignature(?string $first_signature): self
    {
        $this->first_signature = $first_signature;

        return $this;
    }

    public function getFirstValidateAt(): ?\DateTimeImmutable
    {
        return $this->first_validate_at;
    }

    public function setFirstValidateAt(?\DateTimeImmutable $first_validate_at): self
    {
        $this->first_validate_at = $first_validate_at;

        return $this;
    }

    public function getSecondComment(): ?string
    {
        return $this->second_comment;
    }

    public function setSecondComment(?string $second_comment): self
    {
        $this->second_comment = $second_comment;

        return $this;
    }

    public function getSecondSignature(): ?string
    {
        return $this->second_signature;
    }

    public function setSecondSignature(?string $second_signature): self
    {
        $this->second_signature = $second_signature;

        return $this;
    }

    public function getSecondValidateAt(): ?\DateTimeImmutable
    {
        return $this->second_validate_at;
    }

    public function setSecondValidateAt(?\DateTimeImmutable $second_validate_at): self
    {
        $this->second_validate_at = $second_validate_at;

        return $this;
    }

    public function getThirdComment(): ?string
    {
        return $this->third_comment;
    }

    public function setThirdComment(?string $third_comment): self
    {
        $this->third_comment = $third_comment;

        return $this;
    }

    public function getThirdSignature(): ?string
    {
        return $this->third_signature;
    }

    public function setThirdSignature(?string $third_signature): self
    {
        $this->third_signature = $third_signature;

        return $this;
    }

    public function getThirdValidateAt(): ?\DateTimeImmutable
    {
        return $this->third_validate_at;
    }

    public function setThirdValidateAt(?\DateTimeImmutable $third_validate_at): self
    {
        $this->third_validate_at = $third_validate_at;

        return $this;
    }

    public function getFourthComment(): ?string
    {
        return $this->fourth_comment;
    }

    public function setFourthComment(?string $fourth_comment): self
    {
        $this->fourth_comment = $fourth_comment;

        return $this;
    }

    public function getFourthSignature(): ?string
    {
        return $this->fourth_signature;
    }

    public function setFourthSignature(?string $fourth_signature): self
    {
        $this->fourth_signature = $fourth_signature;

        return $this;
    }

    public function getFourthValidateAt(): ?\DateTimeImmutable
    {
        return $this->fourth_validate_at;
    }

    public function setFourthValidateAt(?\DateTimeImmutable $fourth_validate_at): self
    {
        $this->fourth_validate_at = $fourth_validate_at;

        return $this;
    }
}
