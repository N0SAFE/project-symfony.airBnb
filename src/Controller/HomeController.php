<?php


namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Security\SecurityAuthenticator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

#[isGranted("IS_AUTHENTICATED_REMEMBERED")]
class HomeController extends AbstractController {
    public function index(SecurityAuthenticator $securityAuthenticator){
        $roles = $this->getUser()->getRoles();
        $role = in_array("ROLE_OWNER", $roles) ? "bailleur" : (in_array("ROLE_TENANT", $roles) ? "locataire" : "mandataire");
        return $this->render(
            "home/index.html.twig",
            array(
                "user" => array(
                    "lastname" => $this->getUser()->getLastName(),
                    "firstname" => $this->getUser()->getFirstName(),
                    "stringRole" => $role
                )
            )
        );
    }
}