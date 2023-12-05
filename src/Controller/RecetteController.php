<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class RecetteController extends AbstractController
{
    private $httpClient;
    private $openaiApiKey;
    private $apiUrl;

    public function __construct(HttpClientInterface $httpClient, ParameterBagInterface $parameterBag)
    {
        $this->httpClient = $httpClient;
        $this->openaiApiKey = $parameterBag->get('openai_api_key');
        $this->apiUrl = $parameterBag->get('openai_api_url');
    }

    #[Route('/api/recettes', name: 'app_api_recettes')]
    public function callOpenAPI(Request $request): JsonResponse
    {
        // Get the prompt from the request query parameters
        $text = $request->query->get('text', '');

        // Replace 'your_openai_api_key' with your actual OpenAI API key
        $response = $this->httpClient->request('POST', $this->apiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->openaiApiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messages' => array(array("role" => "user", "content" => "donne moi la recette de ".$text." sous forme json {ingredients:[{ingredient: x, qty: y, unit: z}], steps: [a, b, c]}")),
                'max_tokens' => 500,
                'model' => 'gpt-3.5-turbo'
            ],
        ]);
        // Process $data as needed
        $array = $response->toArray();

        return new JsonResponse($array['choices'][0]['message']['content'], 200, [], true);(html_entity_decode($array['choices'][0]['message']['content']));
    }

}