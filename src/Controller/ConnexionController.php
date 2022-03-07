<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\HashService;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class ConnexionController extends AbstractController{
    public function loginIndex(){
        return $this->render('login/index.html.twig');
    }

    public function loginProcess(Request $request, UserRepository $userRepository, HashService $hashService, Session $session, AuthenticationUtils $authenticationUtils){
        // // get the login error if there is one
        // $error = $authenticationUtils->getLastAuthenticationError();
        // $lastUsername = $authenticationUtils->getLastUsername();

        return new Response($error);

        // get the post data

        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if(!$email && !$password){
            return new Response("unknow parameter", 500);
        }

        $user = $userRepository->login($email, $password);

        if($user){
            $session->set('user', $user);
            return new Response('ok');
        }

        return new Response('ko');
    }

    public function registerIndex(){

    }

    public function registerProcess(){

    }
}