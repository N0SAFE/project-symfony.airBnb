<?php

namespace App\Controller;

// use response and request
use Symfony\Component\HttpFoundation\{Request, Response};
// use abstractController
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProfileController extends AbstractController {
    public function index(){
        return new Response("ui");
    }
}