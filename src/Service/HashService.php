<?php

namespace App\Service;

use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;

class HashService {
    public function __construct(string $algorithm = "bcrypt") {
        $this->setPasswordHasher($algorithm);
    }
    public function setPasswordHasher(string $algorithm = "bcrypt") {
        $this->factory = new PasswordHasherFactory([
            'common' => ['algorithm' => $algorithm],
            'memory-hard' => ['algorithm' => 'sodium'],
        ]);

        // Retrieve the right password hasher by its name
        $this->passwordHasher = $this->factory->getPasswordHasher('common');
    }
    public function hashStr(string $str):string{
        return $hash = $this->passwordHasher->hash($str);
    }
    public function verify(string $hash, string $str):bool{
        return $this->passwordHasher->verify($hash, $str);
    }
}