<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Rent;
use App\Entity\Residence;
use App\Entity\User;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $alpha = "abcdefghijklmnopqrstuvwxyz";
        $integer = "123456789";
        $nonAlpha = "!@#$%^&*()_+=-";
        
        for($i = 0; $i < 20; $i++) {
            $owner = new User();
            $owner
                ->setRole('ROLE_OWNER')
                ->setEmail(str_shuffle($alpha).'@gmail.com')
                ->setPassword(str_shuffle($alpha.$integer.$nonAlpha))
                ->setIsVerified(rand(0,1) == 1);
            $manager->persist($owner);
        }

        for($i = 0; $i < 20; $i++) {
            $representative = new User();
            $representative
                ->setRole('ROLE_REPRESENTATIVE')
                ->setEmail(str_shuffle($alpha) . '@gmail.com')
                ->setPassword(str_shuffle($alpha . $integer . $nonAlpha))
                ->setIsVerified(rand(0, 1) == 1);
            $manager->persist($representative);
        }

        $array_tenant = [];
        for($i = 0; $i < 20; $i++) {
            $tenant = new User();
            $tenant
                ->setRole('ROLE_TENANT')
                ->setEmail(str_shuffle($alpha) . '@gmail.com')
                ->setPassword(str_shuffle($alpha . $integer . $nonAlpha))
                ->setIsVerified(rand(0, 1) == 1);
            $manager->persist($tenant);
            array_push($array_tenant, $tenant);
        }


        $array_residence = [];
        for($i = 0; $i < 20; $i++){
            $residence = new Residence();
            $residence
                ->setName(str_shuffle($alpha))
                ->setAddress('Address')
                ->setCity('City')
                ->setZipCode('ZipCode')
                ->setCountry('Country')
                ->setInventoryFile('inventory_file');
            $manager->persist($residence);
            array_push($array_residence, $residence);
        }

        for($i = 0; $i < 20; $i++){
            $rent = new Rent();
            $rent
                ->setTenant($array_tenant[$i])
                ->setResidence($array_residence[$i])
                ->setInventoryFile('inventory_file')
                ->setArrivalDate(new \DateTime())
                ->setDepartureDate(new \DateTime())
                ->setTenantComment('comment')
                ->setTenantSignature('signature')
                ->setTenantValidateAt('validate_at')
                ->setRepresentativeComment(str_shuffle($alpha))
                ->setRepresentativeSignature('representative signature')
                ->setRepresentativeValidateAt(new \DateTime());
            $manager->persist($rent);
        }

        $manager->flush();
    }
}
