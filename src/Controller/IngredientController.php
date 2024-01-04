<?php

namespace App\Controller;

use App\Repository\ParametersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class IngredientController extends AbstractController
{
    private $httpClient;
    private $apiUrl;

    public function __construct(HttpClientInterface $httpClient, ParameterBagInterface $parameterBag)
    {
        $this->httpClient = $httpClient;
        $this->apiUrl = $parameterBag->get('openai_api_url');
    }

    #[Route('/api/ingredients', name: 'app_api_ingredients')]
    public function callOpenAPI(Request $request , ParametersRepository $repository): JsonResponse
    { 
        $parameter = $repository->findOneByName("openai_api_key");
        // recuperer le contenu json de la requette 
        $content=$request->getContent();
        // decoder le json 
        $jsonData=json_decode($content, true);
        if (!$parameter) {
            throw $this->createNotFoundException('Parameter not found');
        }
        // verifier si le json est correctement décoder

        if($jsonData===null)
        {
            return new JsonResponse(['error '=> 'invalide json'], JsonResponse::HTTP_BAD_REQUEST);

        }

        $ingredientsString = "";
        $portions = null;
        $motsClesString = "";

        foreach ($jsonData as $key => $value) {
            if($key === 'ingredients' && is_array($value)){
                foreach ($value as $ingredient) {
                    // vérifier si les parametres sont presents
                    if (!isset($ingredient['label'])|| !isset($ingredient['quantity'])  || !isset($ingredient['unit']))
                    {
                        return new JsonResponse(['error '=> 'Missing requered parametrs'], JsonResponse::HTTP_BAD_REQUEST);
                    } 
                    //recuperer les parametres
                    $label = $ingredient['label'];
                    $quantity= $ingredient['quantity'];
                    $unit= $ingredient['unit'];
                    $ingredientsString .= $label . " " . $quantity . " " . $unit. ", ";
                }
            } elseif ($key === 'portions') {
                $portions = $value;
            } elseif ($key === 'motscles' && is_array($value)) {
                foreach($value as $motCle){
                    if (!isset($motCle['nom'])) {
                        return new JsonResponse(['error ' => 'Missing required parameters'], JsonResponse::HTTP_BAD_REQUEST);
                    }
                    $motsClesString .= $motCle['nom'] . ", ";
                }
            }
        }
        $ingredientsString = rtrim($ingredientsString, ", ");
        $motClesString = rtrim($motsClesString, ", ");

        // Replace 'your_openai_api_key' with your actual OpenAI API key
        $response = $this->httpClient->request('POST', $this->apiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $parameter->getValue(),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messages' => array(array("role" => "user", "content" => "Donne moi une liste de recette faisable en utilisant la liste des ingrédients suivant : " . $ingredientsString . ". Tu n'as pas besoin de rentrer dans les détails je souhaite juste leurs noms sans prendre en compte la quantité d'ingrédients nécessaire à la réalisation de ses recettes ou si il manque des ingrédients.")),
                'max_tokens' => 2000,
                'model' => 'gpt-3.5-turbo'
            ],
        ]);
        // Process $data as needed
        $array = $response->toArray();

        $jsonResponse = new JsonResponse($array['choices'][0]['message']['content'], 200, [], true);(html_entity_decode($array['choices'][0]['message']['content']));
        $jsonResponse->headers->set('Access-Control-Allow-Origin', 'http://localhost');
        return $jsonResponse;
    }
    
}