<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\RentRepository;

class RentController extends AbstractController {
    public function list(RentRepository $rentRepository){
        $rents = $rentRepository->findAll();
        return $this->render("rent/index.html.twig", array( 
            "rents"=>$rents
        ));
    }

    public function add(RentRepository $rentRepository){
        $user = $this->getUser();
        $userRents = $rentRepository->findBy(array("tenant" => $user));
        return $this->render("rent/add.html.twig", array(
            "userRents" => $userRents
        ));
    }

    public function addProcess(){

    }

    public function modify(int $id){

    }

    public function modifyProcess(){

    }
}