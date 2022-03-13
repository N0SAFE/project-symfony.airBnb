<?php 

namespace App\Controller;

use App\Repository\RentRepository;
use App\Repository\UserRepository;
use App\Repository\ResidenceRepository;
use App\Entity\Residence;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpKernel\Exception\HttpException;

use Symfony\Component\HttpKernel\KernelInterface;

#[isGranted("IS_AUTHENTICATED_REMEMBERED")]
class PropertyController extends AbstractController {
    public function list(ResidenceRepository $residenceRepository, Request $request, RentRepository $rentRepository, UserRepository $userRepository){
        $page = $request->query->get('page');
        if(empty($page) && $page != 1){
            return $this->redirect("property?page=1");
        }
        
        $residences = $residenceRepository->findByOwner($this->getUser());
        
        $index = $page - 1;

        if(count($residences) > $index*10) {
            $array_num = array();
            $indexMin = 0;
            $indexMax = ceil(count($residences)/10) - 1;
            for($i = 0; $i < 4; $i++){
                if($i + $index >= $indexMin && $i + $index <= $indexMax){
                    array_push($array_num, $i + 1);
                }
            }

            return $this->render("property/index.html.twig", array(
                "residences" => array_map(function(Residence $residence) use($rentRepository, $userRepository) {
                    $rentArray = $rentRepository->findByResidence($residence);
                    $occupation = "Non Occupé";
                    $availability = "disponible";
                    for($i = 0; $i < count($rentArray); $i++){
                        if($rentArray[$i]->getArrivalDate() < new \DateTime("now") && $rentArray[$i]->getDepartureDate() > new \DateTime("now")){
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
                        "image" => "sample.jpg"
                    );
                }, array_slice($residences, $index * 10, ($index + 1) * 10)),
                "residences_length" => count($residences),
                "pagination" => array(
                    "previous" => $index != 0 ? $page - 1 : false,
                    "next" => count($residences) > ( $index + 1 ) * 10 ? $page + 1 : false,
                    "num" => $array_num,
                    "active" => $page
                )
            ));
        }
        if($page == 1){
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

    public function see(int $id, ResidenceRepository $residenceRepository, RentRepository $rentRepository, KernelInterface $appKernel) {
        $residence = $residenceRepository->find($id);
        $rentArray = $rentRepository->findByResidence($residence);
        return $this->render("property/see.html.twig",array(
            "residence" => array(
                "name"=>$residence->getName(),
                "address"=>$residence->getAddress(),
                "zipCode"=>$residence->getZipCode(),
                "city"=>$residence->getCity(),
                "country"=>$residence->getCountry(),
                "photoFile"=> $residence->getPhotoFile() == "" ? "/img/default.jpg" : "/img/".$residence->getPhotoFile(),
            ),
            "rents" => $rentArray
        ));
    }

    #[isGranted("ROLE_OWNER", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public function add(){
        return new Response("property/add.html.twig");
    }

    #[isGranted("ROLE_OWNER", null, "Vous n'avez pas le rôle correspondant à cette page !", 404)]
    public function addProcess(){

    }
}