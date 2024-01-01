<?php

namespace App\Controller;

use App\Repository\ParametersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

class ParametreController extends AbstractController

{
    #[Route('/api/parametre', name: 'app_api_parametre')]
    public function updateOpenApiKey(Request $request , ParametersRepository $repository, EntityManagerInterface $entityManager): Response
    { 
        $parameter = $repository->findOneByName("openai_api_key");
        // recuperer le contenu json de la requette 
        $content=$request->getContent();
        // decoder le json 
        $jsonData=json_decode($content, true);
        if (!$parameter) {
            throw $this->createNotFoundException('Parameter not found');
        }
        $newValue=$jsonData['newValue'];
        $parameter->setValue($newValue);
        $entityManager->persist($parameter);
         // Enregistrer les modifications dans la base de données
        $entityManager->flush();

        return new Response();
        
    }
}
