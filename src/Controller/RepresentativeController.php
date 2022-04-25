<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{JsonResponse, Request, Response};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Repository\UserRepository;
use App\Repository\ResidenceRepository;
use App\Repository\ResidenceAssociationRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\Residence;
use App\Form\ModifyRepresentativeType;
use App\Service\HashService;
use PhpParser\Node\Expr\AssignOp\Mod;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Doctrine\Persistence\ManagerRegistry;

#[isGranted("ROLE_OWNER", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
class RepresentativeController extends AbstractController
{

    public function list(UserRepository $userRepository, ResidenceRepository $residenceRepository)
    {
        $representatives = $userRepository->findByRole("ROLE_REPRESENTATIVE");
        return $this->render("representative/index.html.twig", array(
            "representatives" => array_values($representatives)
        ));
    }

    public function modifyProcess (Request $request, UserRepository $userRepository, ResidenceRepository $residenceRepository, EntityManagerInterface $em){
        $lastName = $request->request->get("last_name");
        $firstName = $request->request->get("first_name");
        $email = $request->request->get("email");
        $id = $request->request->get("id");
        if(isset($request->request->all()["managedRent"])){
            $managedRent = $request->request->all()["managedRent"];
        }else{
            $managedRent = [];
        }
        
        $representative = $userRepository->findOneBy(array('id' => $id));
        if(!$representative){
            return new Response("don't exist");
        }

        foreach($representative->getResidences() as $residence){
            $representative->removeResidence($residence);
        }
        
        foreach($managedRent as $id){
            $representative->addResidence($residenceRepository->find($id));
        }

        $representative->setLastName($lastName);
        $representative->setFirstName($firstName);
        $representative->setEmail($email);

        $em->persist($representative);
        $em->flush();
        
        return new Response("ok");
    }

    public function modify(int $id, ResidenceRepository $residenceRepository, EntityManagerInterface $em, UserRepository $userRepository)
    {
        $representative = $userRepository->find($id);

        $representativeResidences = $representative->getResidences();
        $residences = $residenceRepository->findAll();

        return $this->render("representative/modify.html.twig", array(
            "residencesSelected" => $representativeResidences,
            'representative' => $representative,
            'residences' => $residences
        ));
    }

    public function addProcess(Request $request, HashService $hashService, UserRepository $userRepository, EntityManagerInterface $em, MailerInterface $mailer)
    {

        $lastName = $request->request->get("last_name");
        $firstName = $request->request->get("first_name");
        $email = $request->request->get("email");

        if (empty($lastName) || empty($firstName) || empty($email)) {
            return new Response(json_encode([
                "lastName" => empty($lastName),
                "firstName" => empty($firstName),
                "email" => empty($email)
            ]), 401);
        }

        $user = $userRepository->findBy(array('email' => $email));
        if ($user) {
            return new Response("exist");
        }

        $user = new User();

        $password = sha1(random_bytes(10));
        $user->setPassword($hashService->hashStr($password));
        $user->setEmail($email);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setIsVerified(true);
        $user->setRoles(array("ROLE_REPRESENTATIVE"));


        $email = (new TemplatedEmail())
            ->from(new Address('sssebillemathis@gmail.com', 'mathis sebille'))
            ->to($user->getEmail())
            ->subject('bonjour')
            ->htmlTemplate('representative/email.html.twig')
            ->context([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'password' => $password
            ]);

        $mailer->send($email);

        $em->persist($user);
        $em->flush();

        return new Response("ok");
    }

    public function add()
    {
        return $this->render("representative/add.html.twig");
    }
}
