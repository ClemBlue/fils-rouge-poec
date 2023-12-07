<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;


class FormLoginAuthenticator extends AbstractAuthenticator implements AuthenticationEntryPointInterface
{
    private $security;
    private $urlGenerator;

    public function __construct(Security $security, UrlGeneratorInterface $urlGenerator)
    {
        $this->security = $security;
        $this->urlGenerator = $urlGenerator;
    }

    public function supports(Request $request): bool
    {
        return $request->attributes->get('_route') === 'app_login'
            && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        $username = $request->request->get('_username');
        $password = $request->request->get('_password');

        return new Passport(new UserBadge($username), new PasswordCredentials($password));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Your logic after successful authentication (e.g., redirecting the user)
        return new RedirectResponse($this->urlGenerator->generate('app_homepage'));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Your logic on authentication failure (e.g., redirecting to the login form with an error message)
        $url = $this->urlGenerator->generate('app_login');
        return new RedirectResponse($url);
    }

    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        // Redirect to the login page on authentication failure
        if ($request->attributes->get('_route') != 'app_login') {
            $url = $this->urlGenerator->generate('app_login');

            return new RedirectResponse($url);
        }
        return new Response();
    }
}
