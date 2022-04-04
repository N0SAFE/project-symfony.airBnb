<?php

namespace App\Repository;

use App\Entity\Residence;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Residence|null find($id, $lockMode = null, $lockVersion = null)
 * @method Residence|null findOneBy(array $criteria, array $orderBy = null)
 * @method Residence[]    findAll()
 * @method Residence[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ResidenceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em)
    {
        parent::__construct($registry, Residence::class);
        $this->em = $em;
    }

    public function findByOwner(User $user): array {
        return $this->createQueryBuilder("r")
            ->addSelect("u")
            ->join("r.owner", "u")
            ->andWhere($user->getId()."=u.id")
            ->getQuery()
            ->getResult();
    }

    public function findByRepresentative(User $user): array {
        return $this->createQueryBuilder("r")
            ->addSelect("u")
            ->join("r.representative", "u")
            ->andWhere($user->getId() . "=u.id")
            ->getQuery()
            ->getResult();
    }


    // /**
    //  * @return Residence[] Returns an array of Residence objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Residence
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
