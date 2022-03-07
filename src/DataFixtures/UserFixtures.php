<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $array=array('Owner', 'Tenant', 'Representive');

        for ($i = 0; $i < 20; $i++) {
            $user = new User();
            $user->setRole($array[rand(0,2)]);
            $user->setEmail('mail@Zmail.com');
            $user->setPassword('123456');
            $user->setIsVerified(rand(0,1));
            $manager->persist($user);
            $this->addReference('user-'.$i, $user);
        }

        $manager->flush();
    }
}
