<?php

namespace App\DataFixtures;

use App\Entity\Rent;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class RentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $timestamp = mt_rand(1, time());
        $date = new \DateTime("2009-04-10");
        $date->setTimestamp($timestamp);

        for ($i = 0; $i < 20; $i++) {
            $rent = new Rent();
            $rent->setInventoryFile('fichier'.$i);
            $rent->setArrivalDate($date);
            $rent->setDepartureDate($date);
            $rent->setTenantComment('rien à signaler');
            $rent->setTenantSignature('Nom du locataire');
            $rent->setTenantValidateAt($date);
            $rent->setRepresentativeComment('rien à signaler');
            $rent->setRepresentativeSignature('Nom du mandataire');
            $rent->setRepresentativeValidateAt($date);
            $rent->setTenant($this->getReference('user-'.rand(1,19)));
            $rent->setResidence($this->getReference('residence-'.rand(1,19)));
            $manager->persist($rent);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
            ResidenceFixtures::class
        ];
    }
}
