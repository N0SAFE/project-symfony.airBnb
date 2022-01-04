<?php

namespace App\DataFixtures;

use App\Entity\Residence;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ResidenceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $array=array('Lanchettes', 'Pierrafort', 'Biollene', 'Lonchamps', 'Morel');

        for ($i = 0; $i < 20; $i++) {
            $residence = new Residence();
            $residence->setName($array[rand(0,4)]);
            $residence->setAddress('Avenue de la libération');
            $residence->setCity('Valmorel');
            $residence->setZipCode('73260');
            $residence->setCountry('France');
            $residence->setInventoryFile('fichier'.$i);
            $residence->setOwner($this->getReference('user-'.rand(1,19)));
            $residence->setRepresentative($this->getReference('user-'.rand(1,19)));
            $manager->persist($residence);
            $this->addReference('residence-'.$i, $residence);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
        ];
    }
}
