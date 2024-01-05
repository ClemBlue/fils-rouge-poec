<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
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

    #[Route('/api/ingredients', name: 'app_api_ingredients_get', methods: ["GET"])]
    public function getIngredients(Request $request, IngredientRepository $repository): JsonResponse
    { 
        $ingredients = $repository->findAll();
        $ingredientsArray = [];
        foreach ($ingredients as $ingredient) {
            $ingredientsArray[] = [
                'id' => $ingredient->getId(),
                'name' => $ingredient->getName(),
                'img' => $ingredient->getImg(),
                'unit' => $ingredient->getUnit()
            ];
        }
        return $this->json($ingredientsArray);
    }

    #[Route('/api/ingredients', name: 'app_api_ingredients_post', methods: ["POST"])]
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

        foreach ($jsonData as $key => $value) {
            if($key === 'ingredients' && is_array($value)){
                foreach ($value as $ingredient) {
                    // vérifier si les parametres sont presents
                    if (!isset($ingredient['label']))
                    {
                        return new JsonResponse(['error '=> 'Missing requered parametrs'], JsonResponse::HTTP_BAD_REQUEST);
                    } 
                    //recuperer les parametres
                    $label = $ingredient['label'];
                    $ingredientsString .= $label . ", ";
                }
            }
        }
        $ingredientsString = rtrim($ingredientsString, ", ");

        // Replace 'your_openai_api_key' with your actual OpenAI API key
        $response = $this->httpClient->request('POST', $this->apiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $parameter->getValue(),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messages' => array(array("role" => "user", "content" => "donne moi les noms de recettes à partir des ingrédients " . $ingredientsString . " sous la forme JSON {'recettes': [{'nom': 'recette 1', 'nom' : 'recette 2'}]}. Ne retourne que du JSON")),
                'max_tokens' => 500,
                'model' => 'gpt-3.5-turbo'
            ],
        ]);
        // Process $data as needed
        $array = $response->toArray();

        $jsonResponse = new JsonResponse($array['choices'][0]['message']['content'], 200, [], true);
        $jsonResponse->headers->set('Access-Control-Allow-Origin', 'http://localhost');
        return $jsonResponse;
    }
    
}