<?php

namespace App\Exceptions;

use Exception;

class DeviceNotRegisteredException extends Exception
{
    public function __construct(public readonly string $deviceUuid)
    {
        parent::__construct('Device is not registered. Register the device before sending telemetry.');
    }
}
