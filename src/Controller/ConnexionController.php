<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\HashService;
use App\Form\LoginFormType;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use App\Security\SecurityAuthenticator;

class ConnexionController extends AbstractController{
    public function generatePassword(HashService $hashService){
        return new Response($hashService->hashStr("SebilleMat3103*"));
    }

    public function index() {
        return $this->render('login/index.html.twig', array(
            "role" => $this->getUser() ? $this->getUser()->getRoles()[0] : "undefined"
        ));
    }

    public function loginProcess(Request $request, UserRepository $userRepository, Session $session, UserAuthenticatorInterface $authenticator, SecurityAuthenticator $formAuthenticator){
        if ($request->isMethod('GET')) {
            return $this->redirectToRoute('home');
        }

        $email = $request->request->get('email', null);
        $password = $request->request->get("password", null);

        if($email == null || $password == null) {
            return new Response("ko");
        }

        $user = $userRepository->login($email, $password);
        
        if(!$user){
            return new Response("ko");
        }
        $authenticator->authenticateUser(
            $user,
            $formAuthenticator,
            $request
        );
        
        return new Response("ok");
        
    }

    public function logout(){
        return $this->redirectToRoute('login');
    }

    public function delete(){
        if(!$this->getUser()){
            return $this->redirectToRoute('home');
        }
        return $this->render("delete/index.html.twig");
    }

    public function deleteProccess(UserRepository $userRepository) {
        $user = $this->getUser();
        if(!$user){
            return new Response("unknow authentificator", 401);
        }

        $userRepository->delete($user);
        return $this->redirectToRoute("logout");
    }

    public function registerIndex(){

    }

    public function registerProcess(){

    }
}   