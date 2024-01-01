<?php

namespace App\Controller;

use App\Repository\ParametersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class RecetteController extends AbstractController
{
    private $httpClient;

    private $apiUrl;

    public function __construct(HttpClientInterface $httpClient, ParameterBagInterface $parameterBag)
    {
        $this->httpClient = $httpClient;
        $this->apiUrl = $parameterBag->get('openai_api_url');
    }

    #[Route('/api/recettes', name: 'app_api_recettes')]
    public function callOpenAPI(Request $request, ParametersRepository $repository): JsonResponse
    {
        // Get the prompt from the request query parameters
        $text = $request->query->get('text', '');
        $isCalorie = $request->query->get('calories', false);
        $isCo2 = $request->query->get('co2', false);
        $coloriesJson = $isCalorie ? ", calories: x" : "";
        $c02Json = $isCo2 ? ", co2: y tonnes" : "";
        $parameter = $repository->findOneByName("openai_api_key");

        if (!$parameter) {
            throw $this->createNotFoundException('Parameter not found');
        }

        // Replace 'your_openai_api_key' with your actual OpenAI API key
        $response = $this->httpClient->request('POST', $this->apiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $parameter->getValue(),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messages' => array(array("role" => "user", "content" => "donne moi la recette de ".$text." sous forme json {ingredients:[{ingredient: x, qty: y, unit: z}], steps: [a, b, c]".$coloriesJson.$c02Json."}")),
                'max_tokens' => 500,
                'model' => 'gpt-3.5-turbo'
            ],
        ]);
        // Process $data as needed
        $array = $response->toArray();

        return new JsonResponse($array['choices'][0]['message']['content'], 200, [], true);
    }

}