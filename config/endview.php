<?php

return [
    'agent_key' => env('ENDVIEW_AGENT_KEY'),

    'default_company_id' => env('ENDVIEW_DEFAULT_COMPANY_ID'),

    'default_site_id' => env('ENDVIEW_DEFAULT_SITE_ID'),

    'offline_threshold_minutes' => (int) env('ENDVIEW_OFFLINE_THRESHOLD_MINUTES', 15),

    'health' => [
        'warning_score' => 60,
        'online_score' => 80,
        'cpu_usage_warning_percent' => 90,
        'ram_usage_warning_percent' => 90,
        'storage_usage_warning_percent' => 90,
        'battery_health_warning_percent' => 60,
        'penalty_points' => 20,
    ],
];
