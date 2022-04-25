<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\RentRepository;
use App\Repository\PropertyRepository;
use App\Repository\ResidenceRepository;
use App\Repository\UserRepository;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

use App\Entity\User;

use App\Service\HashService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\ChoiceList\EntityLoaderInterface;

class TenantController extends AbstractController {
    public function list(UserRepository $userRepository){
        $tenants = $userRepository->findByRole("ROLE_TENANT");
        return $this->render("tenant/index.html.twig", array(
            "tenants"=> array_values($tenants)
        ));
    }

    public function add(RentRepository $rentRepository, ResidenceRepository $residenceRepository){
        $user = $this->getUser();
        $userRents = $rentRepository->findBy(array("tenant" => $user));
        $properties = $residenceRepository->findAll();
        return $this->render("tenant/add.html.twig", array(
            "userRents" => $userRents,
            "properties" => $properties
        ));
    }

    public function addProcess(Request $request, UserRepository $userRepository, HashService $hashService, MailerInterface $mailer, EntityManagerInterface $em){
        $lastName = $request->request->get("last_name");
        $firstName = $request->request->get("first_name");
        $email = $request->request->get("email");

        if(empty($lastName) || empty($firstName) || empty($email)){
            return new Response("bad credentials");
        }

        $user = $userRepository->findBy(array('email' => $email));
        if ($user) {
            return new Response("exist");
        }

        $password = sha1(random_bytes(10));

        $user = new User();
        $user->setLastName($lastName);
        $user->setFirstName($firstName);
        $user->setEmail($email);
        $user->setPassword($hashService->hashStr($password));
        $user->setIsVerified(true);
        $user->setRoles(array("ROLE_TENANT"));

        $email = (new TemplatedEmail())
            ->from(new Address('sssebillemathis@gmail.com', 'mathis sebille'))
            ->to($user->getEmail())
            ->subject('bonjour')
            ->htmlTemplate('tenant/email.html.twig')
            ->context([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'password' => $password,
                'content' => "un administrateur a crée votre compte de mandataire"
            ]);

        $mailer->send($email);

        $em->persist($user);
        $em->flush();

        return new Response("ok");
    }

    public function modify(int $id, UserRepository $userRepository) { 
        $tenants = $userRepository->find($id);
        return $this->render("tenant/modify.html.twig", array(
            "tenant" => $tenants
        ));
    }

    public function modifyProcess(Request $request, UserRepository $userRepository, HashService $hashService, MailerInterface $mailer, EntityManagerInterface $em){
        $lastName = $request->request->get("last_name");
        $firstName = $request->request->get("first_name");
        $email = $request->request->get("email");
        $password = $request->request->get("password");
        $passwordVerify = $request->request->get("password_verify");
        $notify = $request->request->get("notify");
        $id = $request->request->get("id");

        if (empty($lastName) || empty($firstName) || empty($email) || empty($id)) {
            return new Response("bad credentials");
        }

        if((!empty($password) || !empty($passwordVerify)) && (empty($password) || empty($passwordVerify))){
            return new Response("one pass set");
        }

        if($password != $passwordVerify){
            return new Response("diferent pass");
        }

        if($notify && empty($password)){
            return new Response("notify and empty pass");
        }

        $user = $userRepository->find($id);

        $user->setLastName($lastName);
        $user->setFirstName($firstName);
        $user->setEmail($email);
        $user->setPassword($hashService->hashStr($password));
        $user->setIsVerified(true);
        $user->setRoles(array("ROLE_TENANT"));
        if($notify){
            $email = (new TemplatedEmail())
                ->from(new Address('sssebillemathis@gmail.com', 'mathis sebille'))
                ->to($user->getEmail())
                ->subject('bonjour')
                ->htmlTemplate('tenant/email.html.twig')
                ->context([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'password' => $password,
                    'content' => 'un administrateur a modifié votre compte de mandataire'
                ]);

            $mailer->send($email);
        }

        $em->persist($user);
        $em->flush();

        return new Response("ok");
    }
}