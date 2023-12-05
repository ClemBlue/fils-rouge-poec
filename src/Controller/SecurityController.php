<?php

namespace App\Controller;

use PHPUnit\Util\Json;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\InMemoryUserProvider;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


class SecurityController extends AbstractController
{
    
        private $tokenStorage;

        public function __construct(TokenStorageInterface $tokenStorage)
        {
            $this->tokenStorage = $tokenStorage;
        }
        /**
         * @Route("/login", name="app_login", methods={"POST"})
         */
        public function login(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
        {
            $data = json_decode($request->getContent(), true);

            $username = $data['username'] ?? null;
            $password = $data['password'] ?? null;

            if (!$username || !$password) {
                return new JsonResponse(['error' => 'Invalid credentials'], 400);
            }

            // Retrieve users directly from security.yaml configuration
            $token = $this->tokenStorage->getToken();
            $user = $token->getUser();

    
            // Verify the provided password against the hashed password from security.yaml
            $hashedPassword = $user['password'];
            if (!$passwordHasher->isPasswordValid($hashedPassword, $password, $user[$username])) {
                throw new BadCredentialsException('Invalid credentials');
            }
    
            return new JsonResponse(['message' => 'Login successful']);
        }
    
        /**
         * @Route("/logout", name="app_logout")
         */
        public function logout(): void
        {
            // The logout action will be handled by Symfony's security system
        }
    }