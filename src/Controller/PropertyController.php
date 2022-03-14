<?php

namespace App\Controller;

use App\Repository\RentRepository;
use App\Repository\UserRepository;
use App\Repository\ResidenceRepository;
use App\Entity\Residence;
use Symfony\Component\HttpFoundation\{Request, Response, JsonResponse};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Service\FileUploader;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\KernelInterface;

#[isGranted("IS_AUTHENTICATED_REMEMBERED")]
class PropertyController extends AbstractController
{

    public function list(ResidenceRepository $residenceRepository, Request $request, RentRepository $rentRepository, UserRepository $userRepository)
    {
        $page = $request->query->get('page');
        if (empty($page) && $page != 1) {
            return $this->redirect("property?page=1");
        }
        if (in_array("ROLE_OWNER", $this->getUser()->getRoles())) {
            $residences = $residenceRepository->findByOwner($this->getUser());
        } else if (in_array("ROLE_REPRESENTATIVE", $this->getUser()->getRoles())) {
            $residences = $residenceRepository->findByRepresentative($this->getUser());
        } else {
            throw new HttpException(401, "you do not have access to this page");
        }

        $index = $page - 1;

        if (count($residences) > $index * 10) {
            $array_num = array();
            $indexMin = 0;
            $indexMax = ceil(count($residences) / 10) - 1;
            for ($i = 0; $i < 4; $i++) {
                if ($i + $index >= $indexMin && $i + $index <= $indexMax) {
                    array_push($array_num, $i + 1);
                }
            }

            return $this->render("property/index.html.twig", array(
                "residences" => array_map(function (Residence $residence) use ($rentRepository, $userRepository) {
                    $rentArray = $rentRepository->findByResidence($residence);
                    $occupation = "Non Occupé";
                    $availability = "disponible";
                    for ($i = 0; $i < count($rentArray); $i++) {
                        if ($rentArray[$i]->getArrivalDate() < new \DateTime("now") && $rentArray[$i]->getDepartureDate() > new \DateTime("now")) {
                            $occupation = "actuellement occupé";
                            $availability = $rentArray[count($rentArray) - 1]->getDepartureDate();
                            break;
                        }
                    }

                    $user = $userRepository->find($residence->getOwner());

                    return array(
                        "name" => $residence->getName(),
                        "id" => $residence->getId(),
                        // tout les champ suivant son disponible avec un join de residence sur rent
                        "rent_count" => count($rentArray),
                        "availability" => $availability,
                        "occupation" => $occupation,
                        // owner is a join of residence on user by residence.owner_id
                        "owner" => $user->getFirstName() . " " . $user->getLastName(),
                        "image" => $residence->getPhotoFile()
                    );
                }, array_slice($residences, $index * 10, ($index + 1) * 10)),
                "residences_length" => count($residences),
                "pagination" => array(
                    "previous" => $index != 0 ? $page - 1 : false,
                    "next" => count($residences) > ($index + 1) * 10 ? $page + 1 : false,
                    "num" => $array_num,
                    "active" => $page
                )
            ));
        }
        if ($page == 1) {
            return $this->render("property/index.html.twig", array(
                "residences" => array(),
                "residences_length" => 0,
                "pagination" => array(
                    "previous" => false,
                    "next" => false,
                    "num" => array(
                        1
                    ),
                    "active" => 1
                )
            ));
        }

        return $this->render("property/error.html.twig", array("page" => $page));
    }

    public function see(int $id, ResidenceRepository $residenceRepository, RentRepository $rentRepository, KernelInterface $appKernel)
    {
        $residence = $residenceRepository->find($id);
        $rentArray = $rentRepository->findByResidence($residence);
        return $this->render("property/see.html.twig", array(
            "residence" => array(
                "name" => $residence->getName(),
                "address" => $residence->getAddress(),
                "zipCode" => $residence->getZipCode(),
                "city" => $residence->getCity(),
                "country" => $residence->getCountry(),
                "photoFile" => $residence->getPhotoFile(),
            ),
            "rents" => $rentArray,
            "id" => $id
        ));
    }

    public function modifyProcess(Request $request,KernelInterface $appKernel, SluggerInterface $slugger, EntityManagerInterface $em){
        $id = $request->request->get("id");
        $name = $request->request->get("name");
        $address = $request->request->get("address");
        $zip_code = $request->request->get("zip-code");
        $city = $request->request->get("city");
        $country = $request->request->get("country");
        $inventory_file = $request->files->get("inventory_file");
        $photo_file = $request->files->get("photo_file");

        if(!$id){
            return new Response("can't fetch the entity because no id was found", 404);
        }

        $residence = $em->getReference(Residence::class, $id);

        $error = array();

        switch ("") {
            case $name:
                array_push($error, "name");
            case $address:
                array_push($error, "address");
            case $zip_code:
                array_push($error, "zip-code");
            case $city:
                array_push($error, "city");
            case $country:
                array_push($error, "country");
        }

        if (count($error) > 0) {
            return new JsonResponse($error, 412);
        }

        $targetDir = $appKernel->getProjectDir() . "/public/uploads/property";

        $fileUploader = new FileUploader($targetDir, $slugger);

        $residence
            ->setName($name)
            ->setAddress($address)
            ->setZipCode($zip_code)
            ->setCity($city)
            ->setCountry($country);

        if ($inventory_file != null) {
            $residence->setInventoryFile($fileUploader->upload($inventory_file));
        }
        if ($photo_file != null) {
            $residence->setPhotoFile($fileUploader->upload($photo_file));
        }

        $em->persist($residence);
        $em->flush($residence);

        return new Response("ok");  
    }

    #[isGranted("ROLE_OWNER", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public function add()
    {
        return $this->render("property/add.html.twig");
    }


    #[isGranted("ROLE_OWNER", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public function addProcess(Request $request, SluggerInterface $slugger, KernelInterface $appKernel, EntityManagerInterface $em)
    {
        $name = $request->request->get("name");
        $address = $request->request->get("address");
        $zip_code = $request->request->get("zip-code");
        $city = $request->request->get("city");
        $country = $request->request->get("country");
        $inventory_file = $request->files->get("inventory_file");
        $photo_file = $request->files->get("photo_file");

        $error = array();

        switch(""){
            case $name:
                array_push($error, "name");
            case $address:
                array_push($error, "address");
            case $zip_code:
                array_push($error, "zip-code");
            case $city:
                array_push($error, "city");
            case $country:
                array_push($error, "country");
        }
        switch(null){
            case $inventory_file:
                array_push($error, "inventory_file");
            case $photo_file:
                array_push($error, "photo_file");
        }

        if(count($error) > 0 ){
            return new JsonResponse($error, 412);
        }

        $targetDir = $appKernel->getProjectDir() . "/public/uploads/property";

        $residence = new Residence();

        $fileUploader = new FileUploader($targetDir, $slugger);

        $residence
            ->setInventoryFile($fileUploader->upload($inventory_file))
            ->setPhotoFile($fileUploader->upload($photo_file))
            ->setOwner($this->getUser())
            ->setName($name)
            ->setAddress($address)
            ->setZipCode($zip_code)
            ->setCity($city)
            ->setCountry($country);

        $em->persist($residence);
        $em->flush();

        return new JsonResponse("ok");
    }
}
