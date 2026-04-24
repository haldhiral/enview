<?php

test('home redirects to the dashboard when the application is mounted under a subpath', function () {
    config(['app.url' => 'http://localhost/enview']);

    $response = $this
        ->withServerVariables([
            'SCRIPT_FILENAME' => public_path('index.php'),
            'SCRIPT_NAME' => '/enview/index.php',
            'PHP_SELF' => '/enview/index.php',
        ])
        ->get('http://localhost/enview/?');

    expect($response->headers->get('Location'))
        ->toBe('http://localhost/enview/dashboard');
});

test('settings redirects to the profile settings route when mounted under a subpath', function () {
    config(['app.url' => 'http://localhost/enview']);

    $response = $this
        ->withoutMiddleware()
        ->withServerVariables([
            'SCRIPT_FILENAME' => public_path('index.php'),
            'SCRIPT_NAME' => '/enview/index.php',
            'PHP_SELF' => '/enview/index.php',
        ])
        ->get('http://localhost/enview/settings');

    expect($response->headers->get('Location'))
        ->toBe('http://localhost/enview/settings/profile');
});
