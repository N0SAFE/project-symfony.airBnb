<?php


namespace App\Controller;

use App\Repository\RentRepository;
use App\Repository\ResidenceRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Security\SecurityAuthenticator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Entity\Rent;
use Doctrine\ORM\EntityManagerInterface;

class RentController extends AbstractController {
    public function index(int $id, RentRepository $rentRepository){
        $rent = $rentRepository->find($id);

        return $this->render("rent/see.html.twig", array(
            "rent" => $rent
        ));
    }

    public function list(){

    }

    #[isGranted("ROLE_REPRESENTATIVE", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public  function addFromProperty(int $id, ResidenceRepository $residenceRepository, UserRepository $userRepository, RentRepository $rentRepository){
        $property = $residenceRepository->find($id);
        if(!in_array($property, $this->getUser()->getResidences()->toArray())){
            return new Response("you can not manage this property", 404);
        };
        return $this->render("rent/addFromProperty.html.twig", array(
            "residence" => $property,
            "tenants" => $userRepository->findByRole("ROLE_TENANT"),
            "rents" => $rentRepository->findBy(array("residence" => $property)),
            "representative" => $this->getUser()
        )); 
    }

    #[isGranted("ROLE_REPRESENTATIVE", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public function addFromTenant(int $id, UserRepository $userRepository, ResidenceRepository $residenceRepository, RentRepository $rentRepository){
        $tenant = $userRepository->find($id);
        if(!in_array("ROLE_TENANT", $tenant->getRoles())){
            return new Response("unknow tenant", 404);
        }

        return $this->render("rent/addFromTenant.html.twig", array(
            "tenant" => $tenant,
            "properties" => $residenceRepository->findBy(array("representative" => $this->getUser())),
            "rents" => $rentRepository->findBy(array("tenant" => $tenant)),
            "representative" => $this->getUser()
        ));
    }

    public function addProcess(Request $request, RentRepository $rentRepository, ResidenceRepository $residenceRepository, UserRepository $userRepository ,EntityManagerInterface $em){
        $representativeId = $request->request->get("representative");
        $residenceId = $request->request->get("residence");
        $tenantId = $request->request->get("tenant");
        $rent_start = $request->request->get("rent_start");
        $rent_end = $request->request->get("rent_end");

        if((new \DateTime($rent_start) > new \DateTime($rent_end))){
            return new Response("start > end", 401);
        }

        if(empty($residenceId) || empty($tenantId) || empty($representativeId) || empty($rent_start) || empty($rent_end)){
            return new Response(json_encode(array(
                "residence" => empty($residenceId),
                "tenant" => empty($tenantId),
                "representative" => empty($representativeId),
                "rent_start" => empty($rent_start),
                "rent_end" => empty($rent_end)
            )), 401);
        }
        
        $residence = $residenceRepository->find($residenceId);
        $representative = $userRepository->find($representativeId);
        $tenant = $userRepository->find($tenantId);

        $rent = new Rent();
        $rent
            ->setArrivalDate(new \DateTime($rent_start))
            ->setDepartureDate(new \DateTime($rent_end))
            ->setInventoryFile($residence->getInventoryFile())
            ->setTenant($tenant)
            ->setResidence($residence)
            ->setRepresentative($representative);

        $em->persist($rent);
        $em->flush();

        return new Response("ok", 200);
    }

    public function signupProcess(Request $request, EntityManagerInterface $em){
        $firstName = $request->request->get("first_name");
        $lastName = $request->request->get("last_name");
        $comment = $request->request->get("comment");
        $phase = $request->request->get("phase");
    }
}