<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Repository\UserRepository;

class RepresentativeController extends AbstractController {
    public function list(UserRepository $userRepository){
        // select * from user join residence on user.id = residence.representative_id where residence.owner_id = 1;
        // dd($userRepository->findRepresentativeByOwner($this->getUser()));
    }

    public function see(){

    }
}