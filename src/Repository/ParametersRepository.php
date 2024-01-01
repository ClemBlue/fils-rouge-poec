<?php

namespace App\Repository;

use App\Entity\Parameters;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Parameters>
 *
 */
class ParametersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Parameters::class);
    }

    /**
     * @return String Returns the value of a parameter name
     */
    public function findByName(String $name): ?Parameters
    {
        return $this->createQueryBuilder('e')
        ->andWhere('e.name = :name')
        ->setParameter('name', $name)
        ->getQuery()
        ->getOneOrNullResult();
        ;
    }
}
